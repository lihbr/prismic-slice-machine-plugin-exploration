import { defineSliceMachinePlugin, REQUIRED_ADAPTER_HOOKS } from "../../src";

export const valid = defineSliceMachinePlugin({
	meta: {
		name: "adapter-valid",
	},
	setup({ hook }) {
		for (const adapterHook of REQUIRED_ADAPTER_HOOKS) {
			hook(adapterHook, () => {
				throw new Error("not implemented");
			});
		}
	},
});

export const invalid = defineSliceMachinePlugin({
	meta: {
		name: "adapter-invalid",
	},
	setup() {
		/* ... */
	},
});
