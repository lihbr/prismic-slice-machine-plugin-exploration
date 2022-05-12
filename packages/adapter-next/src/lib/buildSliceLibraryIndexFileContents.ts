import {
	SliceMachineActions,
	SliceMachineContext,
} from "@slicemachine/plugin-kit";
import { createRequire } from "node:module";
import semver from "semver";

import { PluginOptions } from "../types";

import { pascalCase } from "./pascalCase";
import { noopTag as typescript } from "./noopTag";

type BuildSliceLibraryIndexFileContentsArgs = {
	libraryID: string;
	actions: SliceMachineActions;
	context: SliceMachineContext<PluginOptions>;
};

export const buildSliceLibraryIndexFileContents = async (
	args: BuildSliceLibraryIndexFileContentsArgs,
): Promise<{ filePath: string; contents: string }> => {
	const filePath = args.actions.joinPathFromRoot(
		args.libraryID,
		args.context.options.typescript ? "index.ts" : "index.js",
	);
	const sliceLibrary = await args.actions.readLibrary({
		libraryID: args.libraryID,
	});
	const require = createRequire(args.context.project.root);
	const isReactLazyCompatible =
		semver.satisfies("18", require("react/package.json").version) &&
		semver.satisfies("12", require("next/package.json").version);

	let contents: string;

	if (isReactLazyCompatible) {
		contents = typescript`
			import * as React from 'react'

			export const components = {
				${sliceLibrary.sliceIDs.map(
					(id) => `${id}: React.lazy(() => import('./${pascalCase(id)}')),`,
				)}
			}
		`;
	} else {
		contents = typescript`
			import dynamic from 'next/dynamic'

			export const components = {
				${sliceLibrary.sliceIDs.map(
					(id) => `${id}: dynamic(() => import('./${pascalCase(id)}')),`,
				)}
			}
		`;
	}

	if (args.context.options.format) {
		contents = await args.actions.format(contents, filePath);
	}

	return { filePath, contents };
};
