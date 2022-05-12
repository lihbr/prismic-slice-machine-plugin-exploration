import { CreateScopeReturnType } from "./lib";
import { SliceMachineActions } from "./createSliceMachineActions";
import { SliceMachineContext } from "./createSliceMachineContext";
import { SliceMachineHookExtraArgs, SliceMachineHooks } from "./types";

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
		actions: SliceMachineActions &
			CreateScopeReturnType<
				SliceMachineHooks,
				SliceMachineHookExtraArgs<TPluginOptions>
			>,
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
