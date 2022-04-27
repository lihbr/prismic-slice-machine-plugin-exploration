import * as fs from "node:fs/promises";

import { exists, usePath } from "./usePath";

export const existsDir = exists;

export const readDir = (pathFromRoot: string): Promise<string[]> => {
	return fs.readdir(usePath(pathFromRoot).path);
};

export const writeDir = async (pathFromRoot: string): Promise<void> => {
	await fs.mkdir(usePath(pathFromRoot).path, { recursive: true });
};

export const removeDir = async (pathFromRoot: string): Promise<void> => {
	await fs.rmdir(usePath(pathFromRoot).path, { recursive: true });
};

export const useDir = (pathFromRoot: string) => {
	return {
		path: usePath(pathFromRoot).path,
		exists: () => existsDir(pathFromRoot),
		read: () => readDir(pathFromRoot),
		write: () => writeDir(pathFromRoot),
		delete: () => removeDir(pathFromRoot),
	};
};
