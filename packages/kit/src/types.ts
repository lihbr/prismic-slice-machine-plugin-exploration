// TODO: This may need to be replaced with @prismicio/types-internal.
//       Be aware of the implications of exposing @prismicio/types-internal as
//       part of the public API; it would no longer be "internal."
import * as prismicT from "@prismicio/types";

import { SliceMachineContext } from "./createSliceMachineContext";

type Promisable<T> = T | PromiseLike<T>;

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

export type SliceMachineHook<TData, TReturn> = (
	data: TData,
) => Promisable<TReturn>;

export type SliceMachineHookExtraArgs<
	TPluginOptions extends PluginOptions = PluginOptions,
> = [context: SliceMachineContext<TPluginOptions>];

export type ExtendSliceMachineHook<
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	THook extends SliceMachineHook<any, any>,
	TPluginOptions extends PluginOptions = PluginOptions,
> = (
	...args: [
		...args: Parameters<THook>,
		...extraArgs: SliceMachineHookExtraArgs<TPluginOptions>,
	]
) => ReturnType<THook>;

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

export type SliceMachineHookNames =
	typeof SliceMachineHookName[keyof typeof SliceMachineHookName];

export type SliceMachineHooks = {
	// Slices
	[SliceMachineHookName.slice_create]: SliceCreateHookBase;
	[SliceMachineHookName.slice_update]: SliceUpdateHookBase;
	[SliceMachineHookName.slice_delete]: SliceDeleteHookBase;
	[SliceMachineHookName.slice_read]: SliceReadHookBase;

	// Custom Types
	[SliceMachineHookName.customType_create]: CustomTypeCreateHookBase;
	[SliceMachineHookName.customType_update]: CustomTypeUpdateHookBase;
	[SliceMachineHookName.customType_delete]: CustomTypeDeleteHookBase;
	[SliceMachineHookName.customType_read]: CustomTypeReadHookBase;

	// Libraries
	[SliceMachineHookName.library_read]: LibraryReadHookBase;

	// Snippets
	[SliceMachineHookName.snippet_read]: SnippetReadHookBase;

	// Slice Simulator
	[SliceMachineHookName.sliceSimulator_setup_read]: SliceSimulatorSetupReadHookBase;
};

// ============================================================================
// ## slice:create
// ============================================================================

export type SliceCreateHookData = {
	libraryID: string;
	model: prismicT.SharedSliceModel;
};
export type SliceCreateHookBase = SliceMachineHook<SliceCreateHookData, void>;
export type SliceCreateHook<
	TPluginOptions extends PluginOptions = PluginOptions,
> = ExtendSliceMachineHook<SliceCreateHookBase, TPluginOptions>;

// ============================================================================
// ## slice:update
// ============================================================================

export type SliceUpdateHookData = {
	libraryID: string;
	model: prismicT.SharedSliceModel;
};
export type SliceUpdateHookBase = SliceMachineHook<SliceUpdateHookData, void>;
export type SliceUpdateHook<
	TPluginOptions extends PluginOptions = PluginOptions,
> = ExtendSliceMachineHook<SliceUpdateHookBase, TPluginOptions>;

// ============================================================================
// ## slice:delete
// ============================================================================

export type SliceDeleteHookData = {
	libraryID: string;
	model: prismicT.SharedSliceModel;
};
export type SliceDeleteHookBase = SliceMachineHook<SliceDeleteHookData, void>;
export type SliceDeleteHook<
	TPluginOptions extends PluginOptions = PluginOptions,
> = ExtendSliceMachineHook<SliceDeleteHookBase, TPluginOptions>;

// ============================================================================
// ## slice:read
// ============================================================================

export type SliceReadHookData = {
	libraryID: string;
	sliceID: string;
};
export type SliceReadHookBase = SliceMachineHook<
	SliceReadHookData,
	prismicT.SharedSliceModel
>;
export type SliceReadHook<
	TPluginOptions extends PluginOptions = PluginOptions,
> = ExtendSliceMachineHook<SliceReadHookBase, TPluginOptions>;

// ============================================================================
// ## custom-type:create
// ============================================================================

export type CustomTypeCreateHookData = {
	model: prismicT.CustomTypeModel;
};
export type CustomTypeCreateHookBase = SliceMachineHook<
	CustomTypeCreateHookData,
	void
>;
export type CustomTypeCreateHook<
	TPluginOptions extends PluginOptions = PluginOptions,
> = ExtendSliceMachineHook<CustomTypeCreateHookBase, TPluginOptions>;

// ============================================================================
// ## custom-type:update
// ============================================================================

export type CustomTypeUpdateHookData = {
	model: prismicT.CustomTypeModel;
};
export type CustomTypeUpdateHookBase = SliceMachineHook<
	CustomTypeUpdateHookData,
	void
>;
export type CustomTypeUpdateHook<
	TPluginOptions extends PluginOptions = PluginOptions,
> = ExtendSliceMachineHook<CustomTypeUpdateHookBase, TPluginOptions>;

// ============================================================================
// ## custom-type:delete
// ============================================================================

export type CustomTypeDeleteHookData = {
	model: prismicT.CustomTypeModel;
};
export type CustomTypeDeleteHookBase = SliceMachineHook<
	CustomTypeDeleteHookData,
	void
>;
export type CustomTypeDeleteHook<
	TPluginOptions extends PluginOptions = PluginOptions,
> = ExtendSliceMachineHook<CustomTypeDeleteHookBase, TPluginOptions>;

// ============================================================================
// ## custom-type:read
// ============================================================================

export type CustomTypeReadHookData = {
	id: string;
};
export type CustomTypeReadHookBase = SliceMachineHook<
	CustomTypeReadHookData,
	prismicT.CustomTypeModel
>;
export type CustomTypeReadHook<
	TPluginOptions extends PluginOptions = PluginOptions,
> = ExtendSliceMachineHook<CustomTypeReadHookBase, TPluginOptions>;

// ============================================================================
// ## snippet:read
// ============================================================================

export const SnippetReadHookDataRootModelType = {
	Slice: "Slice",
	CustomType: "CustomType",
} as const;
export type SnippetReadHookData = {
	fieldPath: string[];
	sliceLibrary: SliceLibrary;
} & (
	| {
			rootModelType: typeof SnippetReadHookDataRootModelType.Slice;
			rootModel: prismicT.SharedSliceModel;
			model: prismicT.CustomTypeModelFieldForGroup;
	  }
	| {
			rootModelType: typeof SnippetReadHookDataRootModelType.CustomType;
			rootModel: prismicT.CustomTypeModel;
			model: prismicT.CustomTypeModelField;
	  }
);
export type SnippetDescriptor = {
	label: string;
	language: string;
	code: string;
};
export type SnippetReadHookReturnType =
	| SnippetDescriptor
	| SnippetDescriptor[]
	| undefined;
export type SnippetReadHookBase = SliceMachineHook<
	SnippetReadHookData,
	SnippetReadHookReturnType
>;
export type SnippetReadHook<
	TPluginOptions extends PluginOptions = PluginOptions,
> = ExtendSliceMachineHook<SnippetReadHookBase, TPluginOptions>;

// ============================================================================
// ## library:read
// ============================================================================

export type LibraryReadHookData = {
	libraryID: string;
};
export type LibraryReadHookReturnType = SliceLibrary & {
	sliceIDs: string[];
};
export type LibraryReadHookBase = SliceMachineHook<
	LibraryReadHookData,
	LibraryReadHookReturnType
>;
export type LibraryReadHook<
	TPluginOptions extends PluginOptions = PluginOptions,
> = ExtendSliceMachineHook<LibraryReadHookBase, TPluginOptions>;

// ============================================================================
// ## slice-simulator:setup:read
// ============================================================================

export const SliceSimulatorSetupStepValidationMessageType = {
	Error: "Error",
	Warning: "Warning",
} as const;
export type SliceSimulatorSetupStepValidationMessage = {
	type: typeof SliceSimulatorSetupStepValidationMessageType[keyof typeof SliceSimulatorSetupStepValidationMessageType];
	title: string;
	message: string;
};
export type SliceSimulatorSetupStep = {
	title: string;
	body: string;
	validate?: () => Promisable<
		| SliceSimulatorSetupStepValidationMessage
		| SliceSimulatorSetupStepValidationMessage[]
		| void
	>;
};
export type SliceSimulatorSetupReadHookReturnType = SliceSimulatorSetupStep[];
export type SliceSimulatorSetupReadHookBase = SliceMachineHook<
	undefined,
	SliceSimulatorSetupReadHookReturnType
>;
export type SliceSimulatorSetupReadHook<
	TPluginOptions extends PluginOptions = PluginOptions,
> = ExtendSliceMachineHook<SliceSimulatorSetupReadHookBase, TPluginOptions>;
