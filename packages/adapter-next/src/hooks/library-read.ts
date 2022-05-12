import type { LibraryReadHook } from "@slicemachine/plugin-kit";
import * as prismicT from "@prismicio/types";
import * as fs from "node:fs/promises";
import * as path from "path";

import { readJSONFile } from "../lib/readJSONFile";

import type { PluginOptions, SliceLibraryMetadata } from "../types";

const isSharedSliceModel = (
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	input: any,
): input is prismicT.SharedSliceModel => {
	return (
		typeof input === "object" &&
		input !== null &&
		"type" in input &&
		input.type === prismicT.CustomTypeModelSliceType.SharedSlice
	);
};

export const libraryRead: LibraryReadHook<PluginOptions> = async (
	data,
	actions,
	_context,
) => {
	const dirPath = actions.joinPathFromRoot(data.id);

	let metadata: SliceLibraryMetadata = {};
	try {
		metadata = await readJSONFile<SliceLibraryMetadata>(
			path.join(dirPath, "library.json"),
		);
	} catch {
		// noop
	}

	const childDirs = await fs.readdir(dirPath);

	const sliceIDs: string[] = [];
	await Promise.all(
		childDirs.map(async (childDir) => {
			const modelPath = path.join(dirPath, childDir, "model.json");

			try {
				const modelContents = await readJSONFile(modelPath);

				if (isSharedSliceModel(modelContents)) {
					sliceIDs.push(modelContents.id);
				}
			} catch {
				// noop
			}
		}),
	);

	return {
		id: data.id,
		name: metadata.name,
		sliceIDs,
	};
};
