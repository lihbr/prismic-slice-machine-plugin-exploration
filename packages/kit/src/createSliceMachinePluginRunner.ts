import defu from "defu";

import { HookSystem } from "./lib";
import { createSliceMachineActions } from "./createSliceMachineActions";
import { createSliceMachineContext } from "./createSliceMachineContext";
import {
	LoadedSliceMachinePlugin,
	SliceMachinePlugin,
} from "./defineSliceMachinePlugin";
import {
	SliceMachineConfigPluginRegistration,
	SliceMachineHookExtraArgs,
	SliceMachineHookNames,
	SliceMachineHooks,
	SliceMachineProject,
} from "./types";

const REQUIRED_ADAPTER_HOOKS: SliceMachineHookNames[] = [
	"slice:read",
	"custom-type:read",
	"library:read",
	"slice-simulator:setup:read",
];

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
		plugin?: SliceMachinePlugin,
	): Promise<LoadedSliceMachinePlugin> {
		// Sanitize registration
		const { resolve, options = {} } =
			typeof pluginRegistration === "string"
				? { resolve: pluginRegistration }
				: pluginRegistration;

		if (!plugin) {
			// Import plugin
			const raw = await import(resolve);
			plugin = raw.default || raw;
		}

		if (!plugin) {
			throw new Error(`Could not load plugin: \`${resolve}\``);
		}

		const mergedOptions = defu(options, plugin.defaultOptions || {});

		return {
			...plugin,
			resolve,
			options: mergedOptions,
		};
	}

	private async _setupPlugin(plugin: LoadedSliceMachinePlugin): Promise<void> {
		const actions = createSliceMachineActions(
			this._project,
			this._hookSystem,
			plugin,
		);
		const context = createSliceMachineContext(this._project, plugin);
		const hookSystemScope =
			this._hookSystem.createScope<SliceMachineHookExtraArgs>(
				// plugin.type,
				plugin.resolve,
				[actions, context],
			);

		// Run plugin setup with actions and context
		await plugin.setup(
			{
				...actions,
				hook: hookSystemScope.hook,
				unhook: hookSystemScope.unhook,
			},
			context,
		);
	}

	private _validateAdapter(adapter: LoadedSliceMachinePlugin): void {
		const hooks = this._hookSystem.hooksForOwner(adapter.resolve);
		const hookNames = hooks.map((hook) => hook.meta.name);

		const missingHooks = REQUIRED_ADAPTER_HOOKS.filter(
			(requiredHookName) => !hookNames.includes(requiredHookName),
		);

		if (missingHooks.length) {
			throw new Error(
				`Adapter \`${adapter.resolve}\` is missing hooks: \`${missingHooks.join(
					"`, `",
				)}\``,
			);
		}
	}

	async init(): Promise<void> {
		const [adapter, ...plugins] = await Promise.all(
			[
				this._project.config.adapter,
				...(this._project.config.plugins ?? []),
			].map((pluginRegistration) => this._loadPlugin(pluginRegistration)),
		);

		await Promise.all(
			[adapter, ...plugins].map((plugin) => this._setupPlugin(plugin)),
		);

		this._validateAdapter(adapter);
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
