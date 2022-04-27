import { createHooks } from "hookable";

type TODO = unknown;

/**
 * Possible hooks emitted by Slice Machine.
 */
export type SliceMachineHooks = {
	// Slices
	"slice:create": (todoPayload: TODO) => void | Promise<void>;
	"slice:update": (todoPayload: TODO) => void | Promise<void>;
	"slice:delete": (todoPayload: TODO) => void | Promise<void>;
	"slice:read": (todoPayload: TODO) => void | Promise<void>;

	// Custom Types
	"custom-type:create": (todoPayload: TODO) => void | Promise<void>;
	"custom-type:update": (todoPayload: TODO) => void | Promise<void>;
	"custom-type:delete": (todoPayload: TODO) => void | Promise<void>;
	"custom-type:read": (todoPayload: TODO) => void | Promise<void>;

	// Libraries
	"library:read": (todoPayload: TODO) => void | Promise<void>;

	// Snippets
	"snippet:read": (todoPayload: TODO) => void | Promise<void>;

	// Slice Simulator
	"slice-simulator:setup:read": (todoPayload: TODO) => void | Promise<void>;

	// Actions?
	"ui:notification": (
		type: "info" | "warn" | "error",
		message: string,
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

const hooks = createHooks<SliceMachineHooks>();

export const hook = hooks.hook;
export const removeHook = hooks.removeHook;
export const callHook = hooks.callHook;
