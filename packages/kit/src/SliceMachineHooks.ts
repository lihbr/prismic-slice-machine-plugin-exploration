import { HookSystem, UseHooksReturnType } from "./lib";
import { SliceMachineActions } from "./SliceMachineActions";
import { SliceMachineContext } from "./SliceMachineContext";
import { SliceMachineProject } from "./types";

type TODO = unknown;

const SLICE_MACHINE_HOOKS = {
	sliceCreate: "slice:create",
	sliceUpdate: "slice:update",
	sliceDelete: "slice:delete",
	sliceRead: "slice:read",
	customTypeCreate: "custom-type:create",
	customTypeUpdate: "custom-type:update",
	customTypeDelete: "custom-type:delete",
	customTypeRead: "custom-type:read",
	libraryRead: "library:read",
	snippetRead: "snippet:read",
	sliceSimulatorSetupRead: "slice-simulator:setup:read",
	uiNotification: "ui:notification",
} as const;

/**
 * All Slice Machine base hooks
 *
 * @remarks
 * Hooks are internal as they are extended when provided to plugins. Use
 * {@link SliceMachineHook} instead.
 * @internal
 */
export type SliceMachineHooks = {
	// Slices
	[SLICE_MACHINE_HOOKS.sliceCreate]: (data: TODO) => void | Promise<void>;
	[SLICE_MACHINE_HOOKS.sliceUpdate]: (data: TODO) => void | Promise<void>;
	[SLICE_MACHINE_HOOKS.sliceDelete]: (data: TODO) => void | Promise<void>;
	[SLICE_MACHINE_HOOKS.sliceRead]: (data: TODO) => void | Promise<void>;

	// Custom Types
	[SLICE_MACHINE_HOOKS.customTypeCreate]: (data: TODO) => void | Promise<void>;
	[SLICE_MACHINE_HOOKS.customTypeUpdate]: (data: TODO) => void | Promise<void>;
	[SLICE_MACHINE_HOOKS.customTypeDelete]: (data: TODO) => void | Promise<void>;
	[SLICE_MACHINE_HOOKS.customTypeRead]: (data: TODO) => void | Promise<void>;

	// Libraries
	[SLICE_MACHINE_HOOKS.libraryRead]: (data: TODO) => void | Promise<void>;

	// Snippets
	[SLICE_MACHINE_HOOKS.snippetRead]: (data: TODO) => void | Promise<void>;

	// Slice Simulator
	[SLICE_MACHINE_HOOKS.sliceSimulatorSetupRead]: (
		data: TODO,
	) => void | Promise<void>;

	// Actions?
	[SLICE_MACHINE_HOOKS.uiNotification]: (data: {
		type: "info" | "warn" | "error";
		message: string;
	}) => void | Promise<void>;
};

export type SliceMachineHookNames =
	typeof SLICE_MACHINE_HOOKS[keyof typeof SLICE_MACHINE_HOOKS];

/**
 * Defines a hook function type.
 */
export type SliceMachineHook<
	TName extends SliceMachineHookNames,
	TPluginOptions extends Record<string, unknown> = Record<string, unknown>,
> = (
	...args: [
		...args: Parameters<SliceMachineHooks[TName]>,
		actions: SliceMachineActions,
		context: SliceMachineContext<TPluginOptions>,
	]
) => ReturnType<SliceMachineHooks[TName]>;

const ALL_HOOKS = Object.values(SLICE_MACHINE_HOOKS);

/**
 * @internal
 */
export const createSliceMachineHooks = (
	project: SliceMachineProject,
): {
	hookSystem: HookSystem<SliceMachineHooks>;
	useHooks: () => UseHooksReturnType<
		SliceMachineHooks,
		[project: SliceMachineProject]
	>;
} => {
	const hookSystem = new HookSystem<
		SliceMachineHooks,
		"sliceMachine" | "adapter" | "plugin"
	>({
		sliceMachine: {
			canHook: ALL_HOOKS,
			canCall: ALL_HOOKS,
		},
		adapter: {
			canHook: ALL_HOOKS,
			canCall: ALL_HOOKS,
		},
		plugin: {
			canHook: [
				SLICE_MACHINE_HOOKS.sliceCreate,
				SLICE_MACHINE_HOOKS.sliceUpdate,
				SLICE_MACHINE_HOOKS.sliceDelete,
				SLICE_MACHINE_HOOKS.customTypeCreate,
				SLICE_MACHINE_HOOKS.customTypeUpdate,
				SLICE_MACHINE_HOOKS.customTypeDelete,
				SLICE_MACHINE_HOOKS.snippetRead,
				SLICE_MACHINE_HOOKS.uiNotification,
			],
			canCall: ALL_HOOKS,
		},
	});

	return {
		hookSystem,
		useHooks: () =>
			hookSystem.useHooks("sliceMachine", "sliceMachine", project),
	};
};
