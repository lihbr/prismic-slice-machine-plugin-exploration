import { SliceMachineContext } from "@slicemachine/plugin-kit";
import { stripIndent } from "common-tags";
import { createRequire } from "node:module";
import semver from "semver";

import { PluginOptions } from "../types";

import { pascalCase } from "./pascalCase";

type BuildSliceLibraryIndexFileContentsArgs = {
	libraryID: string;
} & SliceMachineContext<PluginOptions>;

export const buildSliceLibraryIndexFileContents = async (
	args: BuildSliceLibraryIndexFileContentsArgs,
): Promise<{ filePath: string; contents: string }> => {
	const filePath = args.helpers.joinPathFromRoot(
		args.libraryID,
		args.options.typescript ? "index.ts" : "index.js",
	);
	const sliceLibrary = await args.actions.readSliceLibrary({
		libraryID: args.libraryID,
	});
	const require = createRequire(args.project.root);
	const isReactLazyCompatible =
		semver.satisfies("18", require("react/package.json").version) &&
		semver.satisfies("12", require("next/package.json").version);

	let contents: string;

	if (isReactLazyCompatible) {
		contents = stripIndent`
			import * as React from 'react'

			export const components = {
				${sliceLibrary.sliceIDs.map(
					(id) => `${id}: React.lazy(() => import('./${pascalCase(id)}')),`,
				)}
			}
		`;
	} else {
		contents = stripIndent`
			import dynamic from 'next/dynamic'

			export const components = {
				${sliceLibrary.sliceIDs.map(
					(id) => `${id}: dynamic(() => import('./${pascalCase(id)}')),`,
				)}
			}
		`;
	}

	if (args.options.format) {
		contents = await args.helpers.format(contents, filePath);
	}

	return { filePath, contents };
};
