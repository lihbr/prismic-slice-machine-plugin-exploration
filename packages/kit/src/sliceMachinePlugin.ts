import type { SliceMachineConfig } from "./types";

/**
 * Slice Machine plugin definition.
 */
export type SliceMachinePlugin<
	TOptions extends Record<string, unknown> = Record<string, unknown>,
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
	defaults?: TOptions | ((sliceMachineConfig: SliceMachineConfig) => TOptions);

	/**
	 * Plugin setup.
	 */
	setup: (
		mergedOptions: TOptions,
		sliceMachine: unknown,
	) => void | Promise<void>;
};

export const defineSliceMachinePlugin = (
	plugin: SliceMachinePlugin,
): SliceMachinePlugin => plugin;
