import { UseHooksReturnType } from "./lib";
import { SliceMachineActions } from "./SliceMachineActions";
import { SliceMachineContext } from "./SliceMachineContext";
import { SliceMachineHooks } from "./SliceMachineHooks";
import { SliceMachineProject } from "./types";

/**
 * Slice Machine plugin definition.
 */
export type SliceMachinePlugin<
	TPluginOptions extends Record<string, unknown> = Record<string, unknown>,
> = {
	/**
	 * Informations about the plugin.
	 */
	meta: {
		name: string;
	};

	/**
	 * Default options, or a function returning them.
	 */
	defaults?:
		| TPluginOptions
		| ((sliceMachineProject: SliceMachineProject) => TPluginOptions);

	/**
	 * Plugin setup.
	 */
	setup: (
		actions: SliceMachineActions &
			UseHooksReturnType<
				SliceMachineHooks,
				[
					actions: SliceMachineActions,
					context: SliceMachineContext<TPluginOptions>,
				]
			>,
		context: SliceMachineContext<TPluginOptions>,
	) => void | Promise<void>;
};

export type SliceMachinePluginType = "adapter" | "plugin";

/**
 * @internal
 */
export type LoadedSliceMachinePlugin<
	TPluginOptions extends Record<string, unknown> = Record<string, unknown>,
> = SliceMachinePlugin<TPluginOptions> & {
	type: SliceMachinePluginType;
	resolve: string;
	userOptions: TPluginOptions;
	mergedOptions: TPluginOptions;
};

export const defineSliceMachinePlugin = <
	TPluginOptions extends Record<string, unknown> = Record<string, unknown>,
>(
	plugin: SliceMachinePlugin<TPluginOptions>,
): SliceMachinePlugin<TPluginOptions> => plugin;
