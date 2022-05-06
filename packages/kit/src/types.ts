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
 */
export type SliceMachineConfig = {
	_latest: string;
	apiEndpoint: string;
	localSliceSimulatorURL?: string;
	libraries?: string[];
	adapter: SliceMachineConfigPluginRegistration;
	plugins?: SliceMachineConfigPluginRegistration[];
};

export type SliceMachineProject = {
	root: string;
	config: SliceMachineConfig;
};
