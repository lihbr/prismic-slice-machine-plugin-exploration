import type { CustomTypeLibraryReadHook } from "@slicemachine/plugin-kit";
import * as prismicT from "@prismicio/types";
import * as fs from "node:fs/promises";
import * as path from "path";

import { readJSONFile } from "../lib/readJSONFile";

import type { PluginOptions } from "../types";

const isCustomTypeModel = (
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	input: any,
): input is prismicT.CustomTypeModel => {
	return typeof input === "object" && input !== null && "json" in input;
};

export const customTypeLibraryRead: CustomTypeLibraryReadHook<
	PluginOptions
> = async (_data, { helpers }) => {
	const dirPath = helpers.joinPathFromRoot("customtypes");

	const childFiles = await fs.readdir(dirPath);

	const ids: string[] = [];
	await Promise.all(
		childFiles.map(async (childDir) => {
			const modelPath = path.join(dirPath, `${childDir}.json`);

			try {
				const modelContents = await readJSONFile(modelPath);

				if (isCustomTypeModel(modelContents)) {
					ids.push(modelContents.id);
				}
			} catch {
				// noop
			}
		}),
	);

	return {
		ids,
	};
};
