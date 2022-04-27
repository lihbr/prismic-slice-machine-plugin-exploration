/**
 * How plugins are registered.
 */
export type SliceMachineConfigPluginRegistration =
	| string
	| {
			resolve: string;
			options?: Record<string, unknown>;
	  };

/**
 * Slice Machine `sm.json` config.
 *
 * Note: we maybe should push for Slice Machine to use c12 or similar:
 * https://github.com/unjs/c12
 */
export type SliceMachineConfig = {
	_latest: string;
	apiEndpoint: string;
	localSliceSimulatorURL?: string;
	libraries?: string[];
	adapter?: SliceMachineConfigPluginRegistration;
	plugins?: SliceMachineConfigPluginRegistration[];
};
