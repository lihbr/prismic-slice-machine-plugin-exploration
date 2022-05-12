import type {
	SliceMachineActions,
	SliceMachineContext,
	SliceUpdateHook,
	SliceUpdateHookData,
} from "@slicemachine/plugin-kit";
import { generateTypes } from "prismic-ts-codegen";
import * as fs from "node:fs/promises";
import * as path from "node:path";

import type { PluginOptions } from "../types";

type Args = {
	dir: string;
	data: SliceUpdateHookData;
	actions: SliceMachineActions;
	context: SliceMachineContext<PluginOptions>;
};

const updateModelFile = async ({ dir, data, actions, context }: Args) => {
	const filePath = path.join(dir, "model.json");

	let contents = JSON.stringify(data.model);

	if (context.options.format) {
		contents = await actions.format(contents, filePath);
	}

	await fs.writeFile(filePath, contents);
};

const updateTypesFile = async ({ dir, data, actions, context }: Args) => {
	const filePath = path.join(dir, "types.ts");

	let contents = generateTypes({
		sharedSliceModels: [data.model],
	});

	if (context.options.format) {
		contents = await actions.format(contents, filePath);
	}

	await fs.writeFile(filePath, contents);
};

export const sliceUpdate: SliceUpdateHook<PluginOptions> = async (
	data,
	actions,
	context,
) => {
	const dir = actions.joinPathFromRoot(data.libraryID, data.model.id);

	await Promise.allSettled([
		updateModelFile({ dir, data, actions, context }),
		updateTypesFile({ dir, data, actions, context }),
	]);
};
