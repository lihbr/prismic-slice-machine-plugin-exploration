import defu from "defu";

import { SliceMachineAdapter } from "../sliceMachineAdapter";
import { SliceMachineContext, useSliceMachine } from "../sliceMachineContext";
import {
	adapterOnlyHooks,
	SliceMachineAdapterHooks,
	SliceMachinePluginHooks,
} from "../sliceMachineHooks";
import { SliceMachinePlugin } from "../sliceMachinePlugin";

/**
 * This very roughly outlines what running a plugin looks like.
 */

/**
 * @internal
 */
export const usePlugin = async <
	TPlugin extends SliceMachinePlugin | SliceMachineAdapter =
		| SliceMachinePlugin
		| SliceMachineAdapter,
	TPluginOptions = Parameters<Exclude<TPlugin["setup"], undefined>>[0],
>(
	plugin: TPlugin,
	options: TPluginOptions,
): Promise<void> => {
	const sliceMachine = useSliceMachine();

	const defaultOptions =
		typeof plugin.defaults === "function"
			? plugin.defaults(sliceMachine.config)
			: plugin.defaults || {};

	const mergedOptions = defu(options, defaultOptions);

	const hook: SliceMachineContext<
		| SliceMachinePluginHooks<TPluginOptions>
		| SliceMachineAdapterHooks<TPluginOptions>
	>["hook"] = (name, handler) => {
		if (
			plugin._type === "plugin" &&
			(adapterOnlyHooks as unknown as string[]).includes(name)
		) {
			console.warn("%o is an adapter-only hook, it will be ignored", name);

			return () => {
				/* ... */
			};
		}

		// @ts-expect-error can't narrow down further
		return sliceMachine.hook(name, async (...args) => {
			return await handler(...args, mergedOptions);
		});
	};

	if (plugin.hooks) {
		Object.entries(plugin.hooks).forEach(([name, handler]) => {
			// @ts-expect-error can't narrow down further
			hook(name, handler);
		});
	}

	if (typeof plugin.setup === "function") {
		await plugin.setup(mergedOptions, {
			...sliceMachine,
			hook,
		});
	}
};
