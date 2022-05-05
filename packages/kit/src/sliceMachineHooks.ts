import { HookSystem } from "./lib";

type TODO = unknown;

/**
 * Possible hooks emitted by Slice Machine.
 */
export type SliceMachineHooks<TOptions = never> = {
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

export const createSliceMachineHooks = () => {
	return new HookSystem<SliceMachineHooks>({
		sliceMachine: {
			canHook: ["*"],
			canCall: ["*"],
		},
		plugin: {
			canHook: ["!*:read"],
			canCall: ["*"],
		},
		adapter: {
			canHook: ["*"],
			canCall: ["*"],
		},
	});
};
