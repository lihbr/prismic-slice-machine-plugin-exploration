import type {
	SliceDeleteHook,
	SliceDeleteHookData,
	SliceMachineContext,
} from "@slicemachine/plugin-kit";
import * as fs from "node:fs/promises";

import { buildSliceLibraryIndexFileContents } from "../lib/buildSliceLibraryIndexFileContents";

import type { PluginOptions } from "../types";

type Args = {
	data: SliceDeleteHookData;
} & SliceMachineContext<PluginOptions>;

const deleteSliceDir = async ({ data, helpers }: Args) => {
	const dir = helpers.joinPathFromRoot(data.libraryID, data.model.id);

	await fs.rmdir(dir);
};

const updateSliceLibraryIndexFile = async ({
	data,
	actions,
	helpers,
	project,
	options,
}: Args) => {
	const { filePath, contents } = await buildSliceLibraryIndexFileContents({
		libraryID: data.libraryID,
		actions,
		helpers,
		project,
		options,
	});

	await fs.writeFile(filePath, contents);
};

export const sliceDelete: SliceDeleteHook<PluginOptions> = async (
	data,
	context,
) => {
	await Promise.allSettled([
		deleteSliceDir({ data, ...context }),
		updateSliceLibraryIndexFile({ data, ...context }),
	]);
};
