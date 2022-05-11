import { SliceMachineActions } from "./SliceMachineActions";
import { SliceMachineContext } from "./SliceMachineContext";
import { SliceMachineHooks } from "./createSliceMachineHookSystem";
import { SliceMachineProject } from "./types";
import { HookSystem } from "./lib";

/**
 * Slice Machine plugin definition.
 */
export type SliceMachinePlugin<
	TPluginOptions extends Record<string, unknown> = Record<string, unknown>,
> = {
	/**
	 * Information about the plugin.
	 */
	meta: {
		name: string;
	};

	/**
	 * Default options.
	 */
	defaultOptions?: TPluginOptions;

	/**
	 * Plugin setup.
	 */
	setup: (
		actions: SliceMachineActions & {
			hook: HookSystem<SliceMachineHooks>["hook"];
		},
		context: SliceMachineContext<TPluginOptions>,
	) => void | Promise<void>;
};

/**
 * @internal
 */
export type LoadedSliceMachinePlugin<
	TPluginOptions extends Record<string, unknown> = Record<string, unknown>,
> = SliceMachinePlugin<TPluginOptions> & {
	resolve: string;
	options: TPluginOptions;
};

export const defineSliceMachinePlugin = <
	TPluginOptions extends Record<string, unknown> = Record<string, unknown>,
>(
	plugin: SliceMachinePlugin<TPluginOptions>,
): SliceMachinePlugin<TPluginOptions> => plugin;
