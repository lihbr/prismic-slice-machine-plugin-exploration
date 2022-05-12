import { join } from "node:path";
import * as prismicT from "@prismicio/types";

import prettier from "prettier";
import stripIndent from "strip-indent";

import { HookSystem } from "./lib";
import { LoadedSliceMachinePlugin } from "./defineSliceMachinePlugin";
import { SliceMachineProject, SliceMachineHooks, SliceLibrary } from "./types";

type FormatOptions = {
	prettier?: prettier.Options;
};

type GetSliceModelArgs = {
	libraryID: string;
	sliceID: string;
};

type ReadLibraryArgs = {
	libraryID: string;
};

type NotifyArgs = {
	type: "info" | "warn" | "error";
	message: string;
};

/**
 * Slice Machine actions shared to plugins and hooks.
 */
export type SliceMachineActions = {
	joinPathFromRoot(...paths: string[]): string;
	format(
		source: string,
		filePath?: string,
		options?: FormatOptions,
	): Promise<string>;
	getSliceModel(args: GetSliceModelArgs): Promise<prismicT.SharedSliceModel>;
	readLibrary(
		args: ReadLibraryArgs,
	): Promise<SliceLibrary & { sliceIDs: string[] }>;
	notify(args: NotifyArgs): Promise<void>;
};

/**
 * Creates Slice Machine actions.
 *
 * @internal
 */
export const createSliceMachineActions = (
	project: SliceMachineProject,
	hookSystem: HookSystem<SliceMachineHooks>,
	_plugin: LoadedSliceMachinePlugin,
): SliceMachineActions => {
	return {
		joinPathFromRoot: (...paths) => {
			return join(project.root, ...paths);
		},

		format: async (source, filePath = project.root, options) => {
			let formatted = stripIndent(source);

			const prettierOptions = await prettier.resolveConfig(filePath);

			if (prettierOptions) {
				formatted = prettier.format(formatted, {
					...prettierOptions,
					...(options?.prettier ?? {}),
				});
			}

			return formatted;
		},

		readLibrary: async (args) => {
			const [library] = await hookSystem.callHook("library:read", {
				libraryID: args.libraryID,
			});

			return library;
		},

		getSliceModel: async (args) => {
			const [model] = await hookSystem.callHook("slice:read", {
				libraryID: args.libraryID,
				sliceID: args.sliceID,
			});

			if (!model) {
				throw new Error(
					`A "${args.sliceID}" Slice does not exist in the "${args.libraryID}" library.`,
				);
			}

			return model;
		},

		notify: async (_args) => {
			// Trigger an internal Slice Machine function.
			// It doesn't necessarily need to be a hook function.
			// If SM uses a separate hook system
			// internally, then it could be called here.
		},
	};
};
