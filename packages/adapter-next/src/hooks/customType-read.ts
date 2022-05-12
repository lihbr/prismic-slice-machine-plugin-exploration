import type { CustomTypeReadHook } from "@slicemachine/plugin-kit";
import * as prismicT from "@prismicio/types";

import { readJSONFile } from "../lib/readJSONFile";

import type { PluginOptions } from "../types";

export const customTypeRead: CustomTypeReadHook<PluginOptions> = async (
	data,
	actions,
	_context,
) => {
	const filePath = actions.joinPathFromRoot("customtypes", `${data.id}.json`);

	return await readJSONFile<prismicT.CustomTypeModel>(filePath);
};