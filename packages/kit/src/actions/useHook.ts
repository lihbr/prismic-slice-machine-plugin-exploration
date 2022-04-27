import { SliceMachineContext, useSliceMachine } from "../sliceMachineContext";

export const callHook: SliceMachineContext["callHook"] = (...args) => {
	return useSliceMachine().callHook(...args);
};

export const useHook = (
	...args: Parameters<SliceMachineContext["hook"]>
): (() => void) => {
	return useSliceMachine().hook(...args);
};
