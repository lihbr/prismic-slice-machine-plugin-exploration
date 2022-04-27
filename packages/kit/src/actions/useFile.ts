import * as fs from "node:fs/promises";
import { dirname } from "node:path";

import prettier from "prettier";

import { exists, usePath } from "./usePath";
import { useDir } from "./useDir";

/**
 * The point of those helpers is that they are tied to Slice Machine context and
 * should be a single point of failure when maintaining the file system.
 */

export const existsFile = exists;

export const readFile = (pathFromRoot: string): Promise<string> => {
	return fs.readFile(usePath(pathFromRoot).path, "utf8");
};

export const writeFile = async (
	pathFromRoot: string,
	body: string,
): Promise<void> => {
	const { path } = usePath(pathFromRoot);

	// Create dir if it doesn't exist
	const dir = useDir(dirname(path));
	if (!dir.exists()) {
		await dir.write();
	}

	// Format body with prettier
	const prettierOptions = (await prettier.resolveConfig(path)) ?? undefined;
	const formattedBody = prettier.format(body, prettierOptions);

	return fs.writeFile(path, formattedBody, "utf8");
};

export const removeFile = async (pathFromRoot: string): Promise<void> => {
	return fs.unlink(usePath(pathFromRoot).path);
};

export const useFile = (pathFromRoot: string) => {
	return {
		path: usePath(pathFromRoot).path,
		exists: () => existsFile(pathFromRoot),
		read: () => readFile(pathFromRoot),
		write: (body: string) => writeFile(pathFromRoot, body),
		remove: () => removeFile(pathFromRoot),
	};
};
