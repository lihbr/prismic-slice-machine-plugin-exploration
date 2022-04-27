import detectIndent from "detect-indent";

import { useSliceMachine } from "../sliceMachineContext";
import { existsFile, removeFile, useFile } from "./useFile";

/**
 * The point of those helpers is that they are tied to Slice Machine context and
 * should be a single point of failure when maintaining the file system.
 */

export const DEFAULT_JSON_META = {
	indent: "  ",
};

export type JSONMeta = {
	indent: string;
};

export const existsJSON = existsFile;

export const readJSON = async <T = unknown>(
	pathFromRoot: string,
): Promise<{ json: T; meta: JSONMeta }> => {
	const raw = await useFile(pathFromRoot).read();

	return {
		json: JSON.parse(raw),
		meta: {
			indent: detectIndent(raw).indent || DEFAULT_JSON_META.indent,
		},
	};
};

export const writeJSON = async <T = unknown>(
	pathFromRoot: string,
	data: T,
	meta: JSONMeta = DEFAULT_JSON_META,
): Promise<void> => {
	const raw = JSON.stringify(`${data}\n`, null, meta.indent);

	await useFile(pathFromRoot).write(raw);
};

export const removeJSON = removeFile;

export const useJSON = <T = unknown>(pathFromRoot: string) => {
	const { path, exists } = useFile(pathFromRoot);

	let meta: JSONMeta | undefined;

	const read = async (): Promise<T> => {
		const { json, meta: _meta } = await readJSON<T>(pathFromRoot);

		meta = _meta;

		return json;
	};

	const readMeta = async (): Promise<JSONMeta> => {
		if (exists()) {
			await read();
		} else {
			const {
				file: { packageJSON },
			} = useSliceMachine();

			const { readMeta } = useJSON(packageJSON);

			meta = await readMeta();
		}

		return meta as JSONMeta;
	};

	const write = async (body: T) => {
		if (!meta) {
			meta = await readMeta();
		}

		return writeJSON<T>(pathFromRoot, body, meta);
	};

	const remove = () => removeJSON(path);

	return {
		path,
		exists,
		read,
		readMeta,
		write,
		remove,
	};
};
