import { HookSystem } from "./lib";
import type { SliceMachineHooks, UINotificationType } from "./types";

/**
 * @internal
 */
export const createSliceMachineHookSystem =
	(): HookSystem<SliceMachineHooks> => {
		const hookSystem = new HookSystem<SliceMachineHooks>();

		const actions = {
			sendNotification: (
				type: typeof UINotificationType[keyof typeof UINotificationType],
				message: string,
			) => {
				hookSystem.callHook("ui:notification", { type, message });
			},
		};

		const context = { foo: "bar" };

		const finalHookSystem = hookSystem.cloneWithExtraHookArgs([
			actions,
			context,
		]);

		finalHookSystem.callHook("slice:create", {
			model: {},
			sliceLibraryID: "foo",
		});

		finalHookSystem.hook("@slicemachine/adapter-next", "slice:create");

		return finalHookSystem;
	};
