// Public (for plugin authors)

export type { SliceMachinePlugin } from "./defineSliceMachinePlugin";
export { defineSliceMachinePlugin } from "./defineSliceMachinePlugin";

export type { SliceMachineActions } from "./createSliceMachineActions";
export type { SliceMachineHelpers } from "./createSliceMachineHelpers";
export type { SliceMachineContext } from "./createSliceMachineContext";

export {
	SnippetReadHookDataRootModelType,
	SliceSimulatorSetupStepValidationMessageType,
	PrismicPushActionType,
} from "./types";

export type {
	PluginOptions,
	SliceMachineProject,
	SliceMachineConfig,
	SliceLibrary,
	// Public hooks
	//
	// -- slice:create
	SliceCreateHook,
	SliceCreateHookData,
	//
	// -- slice:update
	SliceUpdateHook,
	SliceUpdateHookData,
	//
	// -- slice:delete
	SliceDeleteHook,
	SliceDeleteHookData,
	//
	// -- slice:read
	SliceReadHook,
	SliceReadHookData,
	//
	// -- slice:custom-screenshot:update
	SliceCustomScreenshotUpdateHook,
	SliceCustomScreenshotUpdateHookData,
	//
	// -- slice-library:read
	SliceLibraryReadHook,
	SliceLibraryReadHookData,
	SliceLibraryReadHookReturnType,
	//
	// -- customType:create
	CustomTypeCreateHook,
	CustomTypeCreateHookData,
	//
	// -- custom-type:update
	CustomTypeUpdateHook,
	CustomTypeUpdateHookData,
	//
	// -- custom-type:delete
	CustomTypeDeleteHook,
	CustomTypeDeleteHookData,
	//
	// -- custom-type:read
	CustomTypeReadHook,
	CustomTypeReadHookData,
	//
	// -- custom-type-library:read
	CustomTypeLibraryReadHook,
	CustomTypeLibraryReadHookReturnType,
	//
	// -- snippet:read
	SnippetReadHook,
	SnippetReadHookData,
	SnippetReadHookReturnType,
	SnippetDescriptor,
	//
	// -- slice-simulator:setup:read
	SliceSimulatorSetupReadHook,
	SliceSimulatorSetupReadHookReturnType,
	SliceSimulatorSetupStep,
	SliceSimulatorSetupStepValidationMessage,
	//
	// -- prismic:push
	PrismicPushHook,
	PrismicPushHookData,
} from "./types";

export { HookError } from "./lib";

// Internal (for Slice Machine)

export { createSliceMachineHookSystem } from "./createSliceMachineHookSystem";

export {
	REQUIRED_ADAPTER_HOOKS,
	ADAPTER_ONLY_HOOKS,
	createSliceMachinePluginRunner,
} from "./createSliceMachinePluginRunner";
export type { SliceMachinePluginRunner } from "./createSliceMachinePluginRunner";
