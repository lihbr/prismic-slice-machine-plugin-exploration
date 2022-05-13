import type {
	SliceCreateHook,
	SliceCreateHookData,
	SliceMachineActions,
	SliceMachineContext,
} from "@slicemachine/plugin-kit";
import { generateTypes } from "prismic-ts-codegen";
import { stripIndent } from "common-tags";
import * as fs from "node:fs/promises";
import * as path from "node:path";

import { buildSliceLibraryIndexFileContents } from "../lib/buildSliceLibraryIndexFileContents";
import { getJSOrTSXFileExtension } from "../lib/getJSOrTSXFileExtension";
import { pascalCase } from "../lib/pascalCase";

import type { PluginOptions } from "../types";

type Args = {
	dir: string;
	data: SliceCreateHookData;
	actions: SliceMachineActions;
	context: SliceMachineContext<PluginOptions>;
};

const createModelFile = async ({ dir, data, actions, context }: Args) => {
	const filePath = path.join(dir, "model.json");

	let contents = JSON.stringify(data.model);

	if (context.options.format) {
		contents = await actions.format(contents, filePath);
	}

	await fs.writeFile(filePath, contents);
};

const createComponentFile = async ({ dir, data, actions, context }: Args) => {
	const filePath = path.join(
		dir,
		`index.${getJSOrTSXFileExtension(context.options)}`,
	);
	const model = data.model;
	const pascalID = pascalCase(model.id);

	let contents: string;

	if (context.options.typescript) {
		contents = stripIndent`
			import { SliceComponentProps } from "@prismicio/react";
			import { ${pascalID}Slice } from "./types";

			/**
			 * Props for \`${pascalID}\`.
			 */
			type ${pascalID}Props = SliceComponentProps<${pascalID}Slice>;

			/**
			 * Component for "${model.name}" Slices.
			 */
			const ${pascalID} = ({ slice }: ${pascalID}Props): React.Element => {
				return (
					<section
						data-slice-type={slice.slice_type}
						data-slice-variation={slice.variation}
					>
						Placeholder component for ${model.id} (variation: {slice.variation}) Slices
					</section>
				);
			};

			export default ${pascalID}
		`;
	} else {
		contents = stripIndent`
			/**
			 * @typedef {import("./types").${pascalID}Slice} ${pascalID}Slice
			 *
			 * @typedef {import("./SliceZone").SliceComponentProps<${pascalID}Slice>} ${pascalID}Props
			 */

			/**
			 * @param {${pascalID}Props}
			 */
			const ${pascalID} = ({ slice }) => {
				return (
					<section
						data-slice-type={slice.slice_type}
						data-slice-variation={slice.variation}
					>
						Placeholder component for ${model.id} (variation: {slice.variation}) Slices
					</section>
				);
			};

			export default ${pascalID};
		`;
	}

	if (context.options.format) {
		contents = await actions.format(contents, filePath);
	}

	await fs.writeFile(filePath, contents);
};

const createTypesFile = async ({ dir, data, actions, context }: Args) => {
	const filePath = path.join(dir, "types.ts");

	let contents = generateTypes({
		sharedSliceModels: [data.model],
	});

	if (context.options.format) {
		contents = await actions.format(contents, filePath);
	}

	await fs.writeFile(filePath, contents);
};

const upsertSliceLibraryIndexFile = async ({
	data,
	actions,
	context,
}: Omit<Args, "dir">) => {
	const { filePath, contents } = await buildSliceLibraryIndexFileContents({
		libraryID: data.libraryID,
		actions: actions,
		context: context,
	});

	await fs.writeFile(filePath, contents);
};

export const sliceCreate: SliceCreateHook<PluginOptions> = async (
	data,
	actions,
	context,
) => {
	const dir = actions.joinPathFromRoot(data.libraryID, data.model.id);

	await fs.mkdir(dir, { recursive: true });

	await Promise.allSettled([
		createModelFile({ dir, data, actions, context }),
		createComponentFile({ dir, data, actions, context }),
		createTypesFile({ dir, data, actions, context }),
		upsertSliceLibraryIndexFile({ data, actions, context }),
	]);
};
