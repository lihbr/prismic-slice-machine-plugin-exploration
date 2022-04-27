import type { SliceMachineContext } from "./sliceMachineContext";
import type { SliceMachinePlugin } from "./sliceMachinePlugin";
import type { SliceMachineHooks } from "./sliceMachineHooks";

// TODO: We should find a way to enforce featureful adapters with TypeScript

/**
 * Slice Machine Adapter definition.
 */
export type SliceMachineAdapter<
	TOptions extends Record<string, unknown> = Record<string, unknown>,
> = {
	/**
	 * Not sure how necessary that is, the idea is to have a flag to differentiate
	 * plugins from adapters internally without having to look at `sm.json`.
	 */
	_type: "adapter";

	hooks?: Partial<SliceMachineHooks>;

	setup?: (
		mergedOptions: TOptions,
		sliceMachine: SliceMachineContext,
	) => void | Promise<void>;
} & Omit<SliceMachinePlugin<TOptions>, "_type" | "hooks" | "setup">;

export const defineSliceMachineAdapter = (
	adapter: Omit<SliceMachineAdapter, "_type">,
): SliceMachineAdapter => {
	return {
		_type: "adapter",
		...adapter,
	};
};
