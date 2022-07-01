import defu from "defu";

import { HookSystem } from "./lib";
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
import { createSliceMachineHookSystem } from "./createSliceMachineHookSystem";

/**
 * @internal
 */
export const REQUIRED_ADAPTER_HOOKS: SliceMachineHookNames[] = [
	"slice:read",
	"slice-library:read",
	"custom-type:read",
	"custom-type-library:read",
	"slice-simulator:setup:read",
];
/**
 * @internal
 */
export const ADAPTER_ONLY_HOOKS = REQUIRED_ADAPTER_HOOKS;

type SliceMachinePluginRunnerConstructorArgs = {
	project: SliceMachineProject;
	hookSystem: HookSystem<SliceMachineHooks>;
	staticPlugins?: Record<string, SliceMachinePlugin>;
};

/**
 * @internal
 */
export class SliceMachinePluginRunner {
	private _project: SliceMachineProject;
	private _hookSystem: HookSystem<SliceMachineHooks>;
	private _staticPlugins: Record<string, SliceMachinePlugin>;

	// Methods forwarded to the plugin runner's hook system.
	callHook: HookSystem["callHook"];
	hooksForOwner: HookSystem["hooksForOwner"];

	constructor({
		project,
		hookSystem,
		staticPlugins = {},
	}: SliceMachinePluginRunnerConstructorArgs) {
		this._project = project;
		this._hookSystem = hookSystem;
		this._staticPlugins = staticPlugins;

		this.callHook = this._hookSystem.callHook.bind(this._hookSystem);
		this.hooksForOwner = this._hookSystem.hooksForOwner.bind(this._hookSystem);
	}

	private async _loadPlugin(
		pluginRegistration: SliceMachineConfigPluginRegistration,
	): Promise<LoadedSliceMachinePlugin> {
		// Sanitize registration
		const { resolve, options = {} } =
			typeof pluginRegistration === "string"
				? { resolve: pluginRegistration }
				: pluginRegistration;

		let plugin = this._staticPlugins[resolve];

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

	private async _setupPlugin(
		plugin: LoadedSliceMachinePlugin,
		as: "adapter" | "plugin",
	): Promise<void> {
		const context = createSliceMachineContext(
			this._project,
			this._hookSystem,
			plugin,
		);
		const hookSystemScope =
			this._hookSystem.createScope<SliceMachineHookExtraArgs>(
				// plugin.type,
				plugin.resolve,
				[context],
			);

		// Prevent plugins from hooking to adapter only hooks
		const hook: typeof hookSystemScope.hook =
			as === "adapter"
				? hookSystemScope.hook
				: (name, hook, meta) => {
						if (ADAPTER_ONLY_HOOKS.includes(name)) {
							return;
						}

						return hookSystemScope.hook(name, hook, meta);
				  };

		// Run plugin setup with actions and context
		try {
			await plugin.setup({
				...context,
				hook,
				unhook: hookSystemScope.unhook,
			});
		} catch (error) {
			if (error instanceof Error) {
				throw new Error(
					`Plugin \`${plugin.resolve}\` errored during setup: ${error.message}`,
					{ cause: error },
				);
			} else {
				throw new Error(
					`Plugin \`${plugin.resolve}\` errored during setup: ${error}`,
				);
			}
		}
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

		await Promise.all([
			this._setupPlugin(adapter, "adapter"),
			...plugins.map((plugin) => this._setupPlugin(plugin, "plugin")),
		]);

		this._validateAdapter(adapter);
	}
}

type CreateSliceMachinePluginRunnerArgs = {
	project: SliceMachineProject;
	staticPlugins?: Record<string, SliceMachinePlugin>;
};

/**
 * @internal
 */
export const createSliceMachinePluginRunner = ({
	project,
	staticPlugins,
}: CreateSliceMachinePluginRunnerArgs): SliceMachinePluginRunner => {
	const hookSystem = createSliceMachineHookSystem();

	return new SliceMachinePluginRunner({ project, hookSystem, staticPlugins });
};
