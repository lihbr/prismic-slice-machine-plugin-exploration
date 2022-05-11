// TODO: This may need to be replaced with @prismicio/types-internal.
//       Be aware of the implications of exposing @prismicio/types-internal as
//       part of the public API; it would no longer be "internal."
import * as prismicT from "@prismicio/types";

import { SliceMachineActions } from "./SliceMachineActions";
import { SliceMachineContext } from "./SliceMachineContext";

export type PluginOptions = Record<string, unknown>;

/**
 * How plugins are registered.
 */
export type SliceMachineConfigPluginRegistration<
	TPluginOptions extends PluginOptions = PluginOptions,
> =
	| string
	| {
			resolve: string;
			options?: TPluginOptions;
	  };

/**
 * Slice Machine `sm.json` config.
 */
export type SliceMachineConfig = {
	_latest: string;
	apiEndpoint: string;
	localSliceSimulatorURL?: string;
	libraries?: string[];
	adapter: SliceMachineConfigPluginRegistration;
	plugins?: SliceMachineConfigPluginRegistration[];
};

export type SliceMachineProject = {
	root: string;
	config: SliceMachineConfig;
};

export type SliceLibrary = {
	id: string;
};

// ============================================================================
//
// # HOOK TYPES
//
// ============================================================================

export type SliceMachineHook<
	TData,
	TReturn,
	TPluginOptions extends PluginOptions,
> = (
	data: TData,
	actions: SliceMachineActions,
	context: SliceMachineContext<TPluginOptions>,
) => TReturn | Promise<TReturn>;

export const SliceMachineHookName = {
	slice_create: "slice:create",
	slice_update: "slice:update",
	slice_delete: "slice:delete",
	slice_read: "slice:read",
	customType_create: "custom-type:create",
	customType_update: "custom-type:update",
	customType_delete: "custom-type:delete",
	customType_read: "custom-type:read",
	library_read: "library:read",
	snippet_read: "snippet:read",
	sliceSimulator_setup_read: "slice-simulator:setup:read",
	ui_notification: "ui:notification",
} as const;

export type SliceMachineHooks<
	TPluginOptions extends PluginOptions = PluginOptions,
> = {
	// Slices
	[SliceMachineHookName.slice_create]: SliceCreateHook<TPluginOptions>;
	[SliceMachineHookName.slice_update]: SliceUpdateHook<TPluginOptions>;
	[SliceMachineHookName.slice_delete]: SliceDeleteHook<TPluginOptions>;
	[SliceMachineHookName.slice_read]: SliceReadHook<TPluginOptions>;

	// Custom Types
	[SliceMachineHookName.customType_create]: CustomTypeCreateHook<TPluginOptions>;
	[SliceMachineHookName.customType_update]: CustomTypeUpdateHook<TPluginOptions>;
	[SliceMachineHookName.customType_delete]: CustomTypeDeleteHook<TPluginOptions>;
	[SliceMachineHookName.customType_read]: CustomTypeReadHook<TPluginOptions>;

	// Libraries
	[SliceMachineHookName.library_read]: LibraryReadHook<TPluginOptions>;

	// Snippets
	[SliceMachineHookName.snippet_read]: SnippetReadHook<TPluginOptions>;

	// Slice Simulator
	[SliceMachineHookName.sliceSimulator_setup_read]: SliceSimulatorSetupReadHook<TPluginOptions>;

	// User Interface
	[SliceMachineHookName.ui_notification]: UINotificationHook<TPluginOptions>;
};

// ============================================================================
// ## slice:create
// ============================================================================

export type SliceCreateHookData = {
	sliceLibraryID: string;
	model: prismicT.SharedSliceModel;
};
export type SliceCreateHook<
	TPluginOptions extends PluginOptions = PluginOptions,
> = SliceMachineHook<SliceCreateHookData, void, TPluginOptions>;

// ============================================================================
// ## slice:update
// ============================================================================

export type SliceUpdateHookData = {
	sliceLibraryID: string;
	model: prismicT.SharedSliceModel;
};
export type SliceUpdateHook<
	TPluginOptions extends PluginOptions = PluginOptions,
> = SliceMachineHook<SliceUpdateHookData, void, TPluginOptions>;

// ============================================================================
// ## slice:delete
// ============================================================================

export type SliceDeleteHookData = {
	sliceLibraryID: string;
	model: prismicT.SharedSliceModel;
};
export type SliceDeleteHook<
	TPluginOptions extends PluginOptions = PluginOptions,
> = SliceMachineHook<SliceDeleteHookData, void, TPluginOptions>;

// ============================================================================
// ## slice:read
// ============================================================================

export type SliceReadHookData = {
	sliceLibraryID: string;
	id: string;
};
export type SliceReadHook<
	TPluginOptions extends PluginOptions = PluginOptions,
> = SliceMachineHook<
	SliceReadHookData,
	prismicT.SharedSliceModel,
	TPluginOptions
>;

// ============================================================================
// ## custom-type:create
// ============================================================================

export type CustomTypeCreateHookData = {
	model: prismicT.CustomTypeModel;
};
export type CustomTypeCreateHook<
	TPluginOptions extends PluginOptions = PluginOptions,
> = SliceMachineHook<
	CustomTypeCreateHookData,
	prismicT.CustomTypeModel,
	TPluginOptions
>;

// ============================================================================
// ## custom-type:update
// ============================================================================

export type CustomTypeUpdateHookData = {
	model: prismicT.CustomTypeModel;
};
export type CustomTypeUpdateHook<
	TPluginOptions extends PluginOptions = PluginOptions,
> = SliceMachineHook<
	CustomTypeUpdateHookData,
	prismicT.CustomTypeModel,
	TPluginOptions
>;

// ============================================================================
// ## custom-type:delete
// ============================================================================

export type CustomTypeDeleteHookData = {
	model: prismicT.CustomTypeModel;
};
export type CustomTypeDeleteHook<
	TPluginOptions extends PluginOptions = PluginOptions,
> = SliceMachineHook<
	CustomTypeDeleteHookData,
	prismicT.CustomTypeModel,
	TPluginOptions
>;

// ============================================================================
// ## custom-type:read
// ============================================================================

export type CustomTypeReadHookData = {
	id: string;
};
export type CustomTypeReadHook<
	TPluginOptions extends PluginOptions = PluginOptions,
> = SliceMachineHook<
	CustomTypeReadHookData,
	prismicT.CustomTypeModel,
	TPluginOptions
>;

// ============================================================================
// ## snippet:read
// ============================================================================

enum SnippetReadHookDataRootModelType {
	Slice = "Slice",
	CustomType = "CustomType",
}
export type SnippetReadHookData = {
	fieldPath: string[];
	sliceLibrary: SliceLibrary;
} & (
	| {
			rootModelType: SnippetReadHookDataRootModelType.Slice;
			rootModel: prismicT.SharedSliceModel;
			model: prismicT.CustomTypeModelFieldForGroup;
	  }
	| {
			rootModelType: SnippetReadHookDataRootModelType.CustomType;
			rootModel: prismicT.CustomTypeModel;
			model: prismicT.CustomTypeModelField;
	  }
);
type SnippetDescriptor = {
	label: string;
	language: string;
	preCode?: string;
	code: string;
	postCode?: string;
};
export type SnippetReadHookReturnType =
	| SnippetDescriptor
	| SnippetDescriptor[]
	| undefined;
export type SnippetReadHook<
	TPluginOptions extends PluginOptions = PluginOptions,
> = SliceMachineHook<
	SnippetReadHookData,
	SnippetReadHookReturnType,
	TPluginOptions
>;

// ============================================================================
// ## library:read
// ============================================================================

export type LibraryReadHookData = {
	id: string;
};
export type LibraryReadHookReturnType = SliceLibrary & {
	sliceIDs: string[];
};
export type LibraryReadHook<
	TPluginOptions extends PluginOptions = PluginOptions,
> = SliceMachineHook<
	LibraryReadHookData,
	LibraryReadHookReturnType,
	TPluginOptions
>;

// ============================================================================
// ## slice-simulator:setup:read
// ============================================================================

export const SliceSimulatorSetupStepStatus = {
	Incomplete: "Incomplete",
	PartiallyComplete: "PartiallyComplete",
	Complete: "Complete",
} as const;
type SliceSimulatorSetupStep<
	TPluginOptions extends PluginOptions = PluginOptions,
> = {
	body: string;
	isCompleted: (
		actions: SliceMachineActions,
		context: SliceMachineContext<TPluginOptions>,
	) => typeof SliceSimulatorSetupStepStatus[keyof typeof SliceSimulatorSetupStepStatus];
};
export type SliceSimulatorSetupReadHookReturnType<
	TPluginOptions extends PluginOptions = PluginOptions,
> = SliceSimulatorSetupStep<TPluginOptions>[];
export type SliceSimulatorSetupReadHook<
	TPluginOptions extends PluginOptions = PluginOptions,
> = SliceMachineHook<
	undefined,
	SliceSimulatorSetupReadHookReturnType<TPluginOptions>,
	TPluginOptions
>;

// ============================================================================
// ## slice-simulator:setup:read
// ============================================================================

export const UINotificationType = {
	Info: "Info",
	Warn: "Warn",
	Error: "Error",
} as const;
export type UINotificationHookData = {
	type: typeof UINotificationType[keyof typeof UINotificationType];
	message: string;
};
export type UINotificationHook<
	TPluginOptions extends PluginOptions = PluginOptions,
> = SliceMachineHook<UINotificationHookData, void, TPluginOptions>;
