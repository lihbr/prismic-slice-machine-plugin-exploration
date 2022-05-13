import type { CustomTypeDeleteHook } from "@slicemachine/plugin-kit";
import * as fs from "node:fs/promises";

import type { PluginOptions } from "../types";

export const customTypeDelete: CustomTypeDeleteHook<PluginOptions> = async (
	data,
	actions,
	_context,
) => {
	const dir = actions.joinPathFromRoot("customtypes", data.model.id);

	await fs.rmdir(dir);
};
