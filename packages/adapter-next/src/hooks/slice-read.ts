import type { SliceReadHook } from "@slicemachine/plugin-kit";
import * as prismicT from "@prismicio/types";

import { readJSONFile } from "../lib/readJSONFile";

import type { PluginOptions } from "../types";

export const sliceRead: SliceReadHook<PluginOptions> = async (
	data,
	actions,
	_context,
) => {
	const filePath = actions.joinPathFromRoot(
		data.libraryID,
		data.sliceID,
		"model.json",
	);

	return await readJSONFile<prismicT.SharedSliceModel>(filePath);
};