import { SliceMachineContext } from "./sliceMachineContext";
import type { SliceMachinePluginHooks } from "./sliceMachineHooks";
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
	hooks?: Partial<SliceMachinePluginHooks<TOptions>>;

	/**
	 * Plugin setup.
	 */
	setup?: (
		mergedOptions: TOptions,
		sliceMachine: SliceMachineContext<SliceMachinePluginHooks<TOptions>>,
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
