import type {
	SliceDeleteHook,
	SliceDeleteHookData,
	SliceMachineActions,
	SliceMachineContext,
} from "@slicemachine/plugin-kit";
import * as fs from "node:fs/promises";

import { buildSliceLibraryIndexFileContents } from "../lib/buildSliceLibraryIndexFileContents";

import type { PluginOptions } from "../types";

type Args = {
	data: SliceDeleteHookData;
	actions: SliceMachineActions;
	context: SliceMachineContext<PluginOptions>;
};

const deleteSliceDir = async ({
	data,
	actions,
}: Pick<Args, "data" | "actions">) => {
	const dir = actions.joinPathFromRoot(data.libraryID, data.model.id);

	await fs.rmdir(dir);
};

const updateSliceLibraryIndexFile = async ({
	data,
	actions,
	context,
}: Args) => {
	const { filePath, contents } = await buildSliceLibraryIndexFileContents({
		libraryID: data.libraryID,
		actions,
		context,
	});

	await fs.writeFile(filePath, contents);
};

export const sliceDelete: SliceDeleteHook<PluginOptions> = async (
	data,
	actions,
	context,
) => {
	await Promise.allSettled([
		deleteSliceDir({ data, actions }),
		updateSliceLibraryIndexFile({ data, actions, context }),
	]);
};
