import { LoadedSliceMachinePlugin } from "./SliceMachinePlugin";
import { SliceMachineProject } from "./types";

/**
 * Slice Machine context shared to plugins and hooks.
 */
export type SliceMachineContext<
	TPluginOptions extends Record<string, unknown>,
> = {
	project: SliceMachineProject;
	options: TPluginOptions;
};

/**
 * Creates Slice Machine context.
 *
 * @internal
 */
export const createSliceMachineContext = <
	TPluginOptions extends Record<string, unknown>,
>(
	project: SliceMachineProject,
	plugin: LoadedSliceMachinePlugin<TPluginOptions>,
): SliceMachineContext<TPluginOptions> => {
	return {
		project,
		options: plugin.options,
	};
};
