import { defineSliceMachinePlugin } from "@slicemachine/plugin-kit";

import { name as pkgName } from "../package.json";

type NuxtPluginOptions = {
	typescript: boolean;
};

export default defineSliceMachinePlugin<NuxtPluginOptions>({
	meta: {
		name: pkgName,
	},
	setup({ actions, options }) {
		// Just trying types...
		if (options.typescript) {
			actions.hook("slice:create", (_data, { actions, options }) => {
				if (options.typescript) {
					actions.notify({
						type: "info",
						message: "Typescript is enabled",
					});
				}
			});
		}
		/* ... */
	},
});
