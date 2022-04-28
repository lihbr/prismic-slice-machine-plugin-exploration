import { Hookable, HookCallback } from "hookable";
import { createContext } from "unctx";

import type { SliceMachineConfig } from "./types";
import { SliceMachineHooks, SafeSliceMachineHooks } from "./sliceMachineHooks";

export type SliceMachineContext<
	THooks extends Record<string, HookCallback> = SafeSliceMachineHooks,
> = {
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

	hook: Hookable<THooks>["hook"];

	removeHook: Hookable<THooks>["removeHook"];

	callHook: Hookable<SliceMachineHooks>["callHook"];
};

type SliceMachineInternalContext = Omit<
	SliceMachineContext,
	"hook" | "removeHook"
> & {
	/**
	 * @internal
	 */
	hook: SliceMachineContext["hook"];

	/**
	 * @internal
	 */
	removeHook: SliceMachineContext["removeHook"];
};

export const sliceMachineContext = createContext<SliceMachineInternalContext>();

/**
 * This allow Slice Machine context described above to be accessible easily
 * anywhere in plugins.
 */
export const useSliceMachine = (): SliceMachineInternalContext => {
	const context = sliceMachineContext.use();

	if (!context) {
		throw new Error("Slice Machine context is unavailable!");
	}

	return context;
};
