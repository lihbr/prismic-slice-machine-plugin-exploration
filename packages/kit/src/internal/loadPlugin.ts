import { SliceMachineConfigPluginRegistration } from "../types";
import { SliceMachineAdapter } from "../sliceMachineAdapter";
import { SliceMachinePlugin } from "../sliceMachinePlugin";
import { usePlugin } from "./usePlugin";

/**
 * @internal
 */
export const loadPlugin = async (
	pluginRegistration: SliceMachineConfigPluginRegistration,
	deferUsage = false,
): Promise<
	[SliceMachinePlugin | SliceMachineAdapter, Record<string, unknown>]
> => {
	const { resolve, options = {} } =
		typeof pluginRegistration === "string"
			? { resolve: pluginRegistration }
			: pluginRegistration;

	const raw = await import(resolve);
	const maybePlugin = raw.default || raw;

	if (!maybePlugin) {
		throw new Error(`Could not load plugin: ${resolve}`);
	}

	if (!deferUsage) {
		await usePlugin(maybePlugin, options);
	}

	return [maybePlugin, options];
};
