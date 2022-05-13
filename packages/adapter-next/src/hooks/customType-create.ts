import type {
	CustomTypeCreateHook,
	CustomTypeCreateHookData,
	SliceMachineActions,
	SliceMachineContext,
} from "@slicemachine/plugin-kit";
import { generateTypes } from "prismic-ts-codegen";
import * as fs from "node:fs/promises";
import * as path from "node:path";

import type { PluginOptions } from "../types";

type Args = {
	dir: string;
	data: CustomTypeCreateHookData;
	actions: SliceMachineActions;
	context: SliceMachineContext<PluginOptions>;
};

const createModelFile = async ({ dir, data, actions, context }: Args) => {
	const filePath = path.join(dir, "index.json");

	let contents = JSON.stringify(data.model);

	if (context.options.format) {
		contents = await actions.format(contents, filePath);
	}

	await fs.writeFile(filePath, contents);
};

const createTypesFile = async ({ dir, data, actions, context }: Args) => {
	const filePath = path.join(dir, "types.ts");

	// TODO: Figure out how to import Shared Slice types
	let contents = generateTypes({
		customTypeModels: [data.model],
	});

	if (context.options.format) {
		contents = await actions.format(contents, filePath);
	}

	await fs.writeFile(filePath, contents);
};

export const customTypeCreate: CustomTypeCreateHook<PluginOptions> = async (
	data,
	actions,
	context,
) => {
	const dir = actions.joinPathFromRoot("customtypes", data.model.id);

	await fs.mkdir(dir, { recursive: true });

	await Promise.allSettled([
		createModelFile({ dir, data, actions, context }),
		createTypesFile({ dir, data, actions, context }),
	]);
};
