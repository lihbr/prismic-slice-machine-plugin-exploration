import { useSliceMachine } from "../sliceMachineContext";
import type { SliceMachineHooks } from "../sliceMachineHooks";

/**
 * This file is mainly showcasing a pattern that the plugin kit could use to
 * maybe ease the DX for both the Slice Machine team and plugin authors
 * leveraging context and hooks.
 */

/**
 * This function is primarily meant to be used by plugin authors.
 */
export const notify = (
	...args: Parameters<SliceMachineHooks["ui:notification"]>
) => {
	return useSliceMachine().callHook("ui:notification", ...args);
};

/**
 * This function is primarily meant to be used by Slice Machine team.
 */
export const useNotification = (
	handler: SliceMachineHooks["ui:notification"],
) => {
	return useSliceMachine().hook("ui:notification", handler);
};
