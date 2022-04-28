import { createHooks } from "hookable";

type TODO = unknown;

/**
 * Possible hooks emitted by Slice Machine.
 */
export type SliceMachineHooks<TOptions = void> = {
	// Slices
	"slice:create": (
		todoPayload: TODO,
		options: TOptions,
	) => void | Promise<void>;
	"slice:update": (
		todoPayload: TODO,
		options: TOptions,
	) => void | Promise<void>;
	"slice:delete": (
		todoPayload: TODO,
		options: TOptions,
	) => void | Promise<void>;
	"slice:read": (todoPayload: TODO, options: TOptions) => void | Promise<void>;

	// Custom Types
	"custom-type:create": (
		todoPayload: TODO,
		options: TOptions,
	) => void | Promise<void>;
	"custom-type:update": (
		todoPayload: TODO,
		options: TOptions,
	) => void | Promise<void>;
	"custom-type:delete": (
		todoPayload: TODO,
		options: TOptions,
	) => void | Promise<void>;
	"custom-type:read": (
		todoPayload: TODO,
		options: TOptions,
	) => void | Promise<void>;

	// Libraries
	"library:read": (
		todoPayload: TODO,
		options: TOptions,
	) => void | Promise<void>;

	// Snippets
	"snippet:read": (
		todoPayload: TODO,
		options: TOptions,
	) => void | Promise<void>;

	// Slice Simulator
	"slice-simulator:setup:read": (
		todoPayload: TODO,
		options: TOptions,
	) => void | Promise<void>;

	// Actions?
	"ui:notification": (
		type: "info" | "warn" | "error",
		message: string,
		options: TOptions,
	) => void | Promise<void>;
};

export const adapterOnlyHooks = [
	"slice:read",
	"custom-type:read",
	"library:read",
	"snippet:read",
	"slice-simulator:setup:read",
] as const;
export type AdapterOnlyHooks = typeof adapterOnlyHooks[number];

export type SliceMachinePluginHooks<TOptions = void> = Omit<
	SliceMachineHooks<TOptions>,
	AdapterOnlyHooks
>;

export type SliceMachineAdapterHooks<TOptions = void> =
	SliceMachineHooks<TOptions>;

export type SafeSliceMachineHooks<TOptions = void> = Pick<
	SliceMachineHooks<TOptions>,
	Extract<keyof SliceMachinePluginHooks, keyof SliceMachineAdapterHooks>
>;

const hooks = createHooks<SliceMachineHooks>();

export const hook = hooks.hook;
export const removeHook = hooks.removeHook;
export const callHook = hooks.callHook;
