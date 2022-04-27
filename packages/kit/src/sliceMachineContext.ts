import { createContext } from "unctx";

import type { SliceMachineConfig } from "./types";
import { hook, removeHook, callHook } from "./sliceMachineHooks";

export type SliceMachineContext = {
	dir: {
		/**
		 * Absolute path to project root
		 */
		root: string;

		/**
		 * Typically `${root}/.slicemachine`
		 */
		dotSliceMachine: string;

		/**
		 * Typically `${root}/node_modules/.cache`
		 */
		cache: string;
	};

	file: {
		/**
		 * Typically `${root}/sm.json`
		 */
		sliceMachineConfig: string;

		/**
		 * Typically `${root}/package.json`
		 */
		packageJSON: string;
	};

	config: SliceMachineConfig;

	hook: typeof hook;

	removeHook: typeof removeHook;

	callHook: typeof callHook;
};

export const sliceMachineContext = createContext<SliceMachineContext>();

/**
 * This allow Slice Machine context described above to be accessible easily
 * anywhere in plugins.
 */
export const useSliceMachine = (): SliceMachineContext => {
	const context = sliceMachineContext.use();

	if (!context) {
		throw new Error("Slice Machine context is unavailable!");
	}

	return context;
};
