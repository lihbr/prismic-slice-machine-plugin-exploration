import { Hookable } from "hookable";
import { SliceMachineContext } from "./sliceMachineContext";
import type { AdapterOnlyHooks, SliceMachineHooks } from "./sliceMachineHooks";
import type { SliceMachineConfig } from "./types";

/**
 * Slice Machine plugin definition.
 */
export type SliceMachinePlugin<
	TOptions extends Record<string, unknown> = Record<string, unknown>,
> = {
	/**
	 * Not sure how necessary that is, the idea is to have a flag to differentiate
	 * plugins from adapters internally without having to look at `sm.json`.
	 */
	_type: "plugin";

	/**
	 * Informations about the plugin.
	 */
	meta: {
		name: string;
	};

	/**
	 * Default options, or a function returning them.
	 */
	defaults?: TOptions | ((sliceMachineConfig: SliceMachineConfig) => TOptions);

	/**
	 * Sugar for registering hooks.
	 */
	hooks?: Partial<{
		[key in Exclude<
			keyof SliceMachineHooks,
			AdapterOnlyHooks
		>]: SliceMachineHooks[key];
	}>;

	/**
	 * Plugin setup.
	 */
	setup?: (
		mergedOptions: TOptions,
		sliceMachine: {
			hook: Hookable<Omit<SliceMachineHooks, AdapterOnlyHooks>>["hook"];

			removeHook: Hookable<
				Omit<SliceMachineHooks, AdapterOnlyHooks>
			>["removeHook"];

			callHook: Hookable<Omit<SliceMachineHooks, AdapterOnlyHooks>>["callHook"];
		} & Omit<SliceMachineContext, "hook" | "removeHook" | "callHook">,
	) => void | Promise<void>;
};

export const defineSliceMachinePlugin = (
	plugin: Omit<SliceMachinePlugin, "_type">,
): SliceMachinePlugin => {
	return {
		_type: "plugin",
		...plugin,
	};
};
