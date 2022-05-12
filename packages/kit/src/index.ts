// Public (for plugin authors)

export type { SliceMachinePlugin } from "./defineSliceMachinePlugin";
export { defineSliceMachinePlugin } from "./defineSliceMachinePlugin";

// export type { SliceMachineHook } from "./createSliceMachineHookSystem";
export type { SliceMachineActions } from "./createSliceMachineActions";
export type { SliceMachineContext } from "./createSliceMachineContext";

export { SnippetReadHookDataRootModelType } from "./types";

export type {
	PluginOptions,
	SliceMachineProject,
	SliceMachineConfig,
	SliceLibrary,
	// Public hooks
	// -- slice:create
	SliceCreateHook,
	SliceCreateHookData,
	// -- slice:update
	SliceUpdateHook,
	SliceUpdateHookData,
	// -- slice:delete
	SliceDeleteHook,
	SliceDeleteHookData,
	// -- slice:read
	SliceReadHook,
	SliceReadHookData,
	// -- customType:create
	CustomTypeCreateHook,
	CustomTypeCreateHookData,
	// -- customType:update
	CustomTypeUpdateHook,
	CustomTypeUpdateHookData,
	// -- customType:delete
	CustomTypeDeleteHook,
	CustomTypeDeleteHookData,
	// -- customType:read
	CustomTypeReadHook,
	CustomTypeReadHookData,
	// -- snippet:read
	SnippetReadHook,
	SnippetReadHookData,
	SnippetReadHookReturnType,
	SnippetDescriptor,
	// -- library:read
	LibraryReadHook,
	LibraryReadHookData,
	LibraryReadHookReturnType,
	// -- slice-simulator:setup:read
	SliceSimulatorSetupStepStatus,
	SliceSimulatorSetupReadHookReturnType,
	SliceSimulatorSetupStep,
	SliceSimulatorSetupReadHook,
} from "./types";

// Internal (for Slice Machine)

export { createSliceMachineHookSystem } from "./createSliceMachineHookSystem";
// export type { SliceMachineHooks } from "./createSliceMachineHookSystem";

export { createSliceMachinePluginRunner } from "./createSliceMachinePluginRunner";
export type { SliceMachinePluginRunner } from "./createSliceMachinePluginRunner";
