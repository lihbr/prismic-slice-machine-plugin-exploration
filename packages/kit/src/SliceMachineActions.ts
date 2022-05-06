import { join } from "node:path";

import prettier from "prettier";
import stripIndent from "strip-indent";

import { HookSystem } from "./lib";
import { SliceMachineHooks } from "./SliceMachineHooks";
import { LoadedSliceMachinePlugin } from "./SliceMachinePlugin";
import { SliceMachineProject } from "./types";

const pathFromRootFactory =
	(project: SliceMachineProject) => (pathFromRoot: string) => {
		return join(project.root, pathFromRoot);
	};

const formatFactory =
	(project: SliceMachineProject) =>
	async (
		raw: string,
		path: string = project.root,
		options?: {
			prettier?: prettier.Options;
		},
	) => {
		let formatted = stripIndent(raw);

		const prettierOptions = await prettier.resolveConfig(path);

		if (prettierOptions) {
			formatted = prettier.format(formatted, {
				...prettierOptions,
				...(options?.prettier ?? {}),
			});
		}

		return formatted;
	};

/**
 * Slice Machine actions shared to plugins and hooks.
 */
export type SliceMachineActions = {
	pathFromRoot: ReturnType<typeof pathFromRootFactory>;
	format: ReturnType<typeof formatFactory>;
	notify: SliceMachineHooks["ui:notification"];
};

/**
 * Creates Slice Machine actions.
 *
 * @internal
 */
export const createSliceMachineActions = (
	project: SliceMachineProject,
	hookSystem: HookSystem<SliceMachineHooks>,
	plugin: LoadedSliceMachinePlugin,
): SliceMachineActions => {
	const { callHook } = hookSystem.useHooks(plugin.type, plugin.resolve);

	return {
		pathFromRoot: pathFromRootFactory(project),
		format: formatFactory(project),
		notify: (...args) => callHook("ui:notification", ...args),
	};
};
