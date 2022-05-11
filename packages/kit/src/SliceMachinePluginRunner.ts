import defu from "defu";

import { HookSystem } from "./lib";
import { createSliceMachineActions } from "./SliceMachineActions";
import { createSliceMachineContext } from "./SliceMachineContext";
import {
	createSliceMachineHookSystem,
	SliceMachineHookNames,
	SliceMachineHooks,
} from "./createSliceMachineHookSystem";
import {
	LoadedSliceMachinePlugin,
	SliceMachinePlugin,
} from "./SliceMachinePlugin";
import {
	SliceMachineConfigPluginRegistration,
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
		// const hookHelpers = this._hookSystem.useHooks(
		// 	plugin.type,
		// 	plugin.resolve,
		// 	actions,
		// 	context,
		// );

		// Run plugin setup with actions and context
		await plugin.setup(
			{
				...actions,
				hook: this._hookSystem.hook.bind(this._hookSystem),
				// ...hookHelpers,
			},
			context,
		);
	}

	private _validateAdapter(plugin: LoadedSliceMachinePlugin): void {
		const hooks = this._hookSystem.hooksForOwner(plugin.resolve);
		const hookNames = hooks.map((hook) => hook.name);

		const missingHooks = REQUIRED_ADAPTER_HOOKS.filter(
			(requiredHookName) => !hookNames.includes(requiredHookName),
		);

		if (missingHooks.length) {
			throw new Error(
				`Adapter \`${plugin.resolve}\` is missing hooks: \`${missingHooks.join(
					"`, `",
				)}\``,
			);
		}
	}

	async init(): Promise<void> {
		const [adapter, ...plugins] = await Promise.all([
			this._loadPlugin(this._project.config.adapter),
			...(this._project.config.plugins ?? []).map((pluginRegistration) =>
				this._loadPlugin(pluginRegistration),
			),
		]);

		await Promise.all([
			this._setupPlugin(adapter),
			...plugins.map((plugin) => this._setupPlugin(plugin)),
		]);

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

const app = async () => {
	const project: SliceMachineProject = {
		root: "/tmp/",
		config: {
			_latest: "0.0.0",
			adapter: "@slicemachine/adapter-next",
			apiEndpoint: "https://qwerty.cdn.prismic.io/api/v2",
		},
	};

	const actions = {
		readSlice: async (sliceLibraryID: string, id: string) => {
			const x = await hookSystem.callHook(
				"slice:read",
				{ sliceLibraryID, id },
				actions,
				{},
			);

			return x;
		},
	};

	const hookSystem = createSliceMachineHookSystem();
	const pluginRunner = createSliceMachinePluginRunner(project, hookSystem, {
		actions,
	});

	await pluginRunner.init();

	hookSystem.callHook("slice:create");
};
