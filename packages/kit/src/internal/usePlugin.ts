import defu from "defu";

import { SliceMachinePlugin } from "../sliceMachinePlugin";

/**
 * @internal
 */
export const usePlugin = async <
	TPlugin extends SliceMachinePlugin = SliceMachinePlugin,
	TPluginOptions = Parameters<Exclude<TPlugin["setup"], undefined>>[0],
>(
	plugin: TPlugin,
	options: TPluginOptions,
): Promise<void> => {
	const defaultOptions =
		typeof plugin.defaults === "function"
			? plugin.defaults({} as any)
			: plugin.defaults || {};

	const mergedOptions = defu(options, defaultOptions);

	if (typeof plugin.setup === "function") {
		await plugin.setup(mergedOptions, {});
	}
};
