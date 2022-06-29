import * as prismicT from "@prismicio/types";

import { HookSystem } from "./lib";
import { SliceMachineProject, SliceMachineHooks, SliceLibrary } from "./types";

type GetSliceModelArgs = {
	libraryID: string;
	sliceID: string;
};

type ReadLibraryArgs = {
	libraryID: string;
};

/**
 * Slice Machine actions shared to plugins and hooks.
 */
export type SliceMachineActions = {
	getSliceModel(args: GetSliceModelArgs): Promise<prismicT.SharedSliceModel>;
	readLibrary(
		args: ReadLibraryArgs,
	): Promise<SliceLibrary & { sliceIDs: string[] }>;
};

/**
 * Creates Slice Machine actions.
 *
 * @internal
 */
export const createSliceMachineActions = (
	project: SliceMachineProject,
	hookSystem: HookSystem<SliceMachineHooks>,
): SliceMachineActions => {
	return {
		readLibrary: async (args) => {
			const {
				data: [library],
				errors: [cause],
			} = await hookSystem.callHook("library:read", {
				libraryID: args.libraryID,
			});

			if (!library) {
				throw new Error(`Library \`${args.libraryID}\` not found.`, {
					cause,
				});
			}

			return library;
		},

		getSliceModel: async (args) => {
			const {
				data: [model],
				errors: [cause],
			} = await hookSystem.callHook("slice:read", {
				libraryID: args.libraryID,
				sliceID: args.sliceID,
			});

			if (!model) {
				throw new Error(
					`Slice \`${args.sliceID}\` not found in the \`${args.libraryID}\` library.`,
					{ cause },
				);
			}

			return model;
		},
	};
};
