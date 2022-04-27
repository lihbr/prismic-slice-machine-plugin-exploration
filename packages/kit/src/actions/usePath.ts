import { join } from "node:path";
import { existsSync } from "node:fs";

import { useSliceMachine } from "../sliceMachineContext";

/**
 * The point of those helpers is that they are tied to Slice Machine context and
 * should be a single point of failure when maintaining the file system.
 */

export const fromRoot = (pathFromRoot: string) => {
	const {
		dir: { root },
	} = useSliceMachine();

	return join(root, pathFromRoot);
};

export const exists = (pathFromRoot: string): boolean => {
	return existsSync(fromRoot(pathFromRoot));
};

export const usePath = (pathFromRoot: string) => {
	return {
		path: fromRoot(pathFromRoot),
		exists: () => exists(pathFromRoot),
	};
};
