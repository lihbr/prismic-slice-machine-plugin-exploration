import defu from "defu";

import { HookSystem } from "./lib";
import { createSliceMachineActions } from "./SliceMachineActions";
import { createSliceMachineContext } from "./SliceMachineContext";
import { SliceMachineHookNames, SliceMachineHooks } from "./SliceMachineHooks";
import {
	LoadedSliceMachinePlugin,
	SliceMachinePluginType,
} from "./SliceMachinePlugin";
import {
	SliceMachineConfigPluginRegistration,
	SliceMachineProject,
} from "./types";

/**
 * @internal
 */
export class SliceMachinePluginRunner {
	private _project: SliceMachineProject;
	private _hookSystem: HookSystem<SliceMachineHooks>;

	constructor(
		project: SliceMachineProject,
		hookSystem: HookSystem<SliceMachineHooks>,
	) {
		this._project = project;
		this._hookSystem = hookSystem;
	}

	private async _loadPlugin(
		pluginRegistration: SliceMachineConfigPluginRegistration,
		type: SliceMachinePluginType,
	): Promise<LoadedSliceMachinePlugin> {
		// Sanitize registration
		const { resolve, options = {} } =
			typeof pluginRegistration === "string"
				? { resolve: pluginRegistration }
				: pluginRegistration;

		// Import plugin
		const raw = await import(resolve);
		const maybePlugin = raw.default || raw;

		if (!maybePlugin) {
			throw new Error(`Could not load plugin: \`${resolve}\``);
		}

		// Resolve options
		const defaultOptions =
			typeof maybePlugin.defaults === "function"
				? maybePlugin.defaults(this._project)
				: maybePlugin.defaults || {};

		const mergedOptions = defu(options, defaultOptions);

		return {
			...maybePlugin,
			type,
			resolve,
			userOptions: options,
			mergedOptions,
		};
	}

	private async _usePlugin(plugin: LoadedSliceMachinePlugin): Promise<void> {
		const actions = createSliceMachineActions(
			this._project,
			this._hookSystem,
			plugin,
		);
		const context = createSliceMachineContext(this._project, plugin);
		const hookHelpers = this._hookSystem.useHooks(
			plugin.type,
			plugin.resolve,
			actions,
			context,
		);

		// Run plugin setup with actions and context
		await plugin.setup(
			{
				...actions,
				...hookHelpers,
			},
			context,
		);

		// Check if adapter is featurefull
		if (plugin.type === "adapter") {
			const adapterHooks = this._hookSystem.inspect(plugin.resolve);
			const requiredAdapterHooks: SliceMachineHookNames[] = [
				"slice:read",
				"custom-type:read",
				"library:read",
				"slice-simulator:setup:read",
			];

			const missingHooks = requiredAdapterHooks.filter(
				(requiredAdapterHook) => !adapterHooks.includes(requiredAdapterHook),
			);

			if (missingHooks.length) {
				throw new Error(
					`Adapter \`${
						plugin.resolve
					}\` is missing hooks: \`${missingHooks.join("`, `")}\``,
				);
			}
		}
	}

	async init(): Promise<void> {
		const [adapter, plugins] = await Promise.all([
			this._loadPlugin(this._project.config.adapter, "adapter"),
			Promise.all(
				(this._project.config.plugins ?? []).map((pluginRegistration) =>
					this._loadPlugin(pluginRegistration, "plugin"),
				),
			),
		]);

		await this._usePlugin(adapter);
		await Promise.all(plugins.map((plugin) => this._usePlugin(plugin)));
	}
}

/**
 * @internal
 */
export const createSliceMachinePluginRunner = (
	project: SliceMachineProject,
	hookSystem: HookSystem<SliceMachineHooks>,
): SliceMachinePluginRunner => {
	return new SliceMachinePluginRunner(project, hookSystem);
};
