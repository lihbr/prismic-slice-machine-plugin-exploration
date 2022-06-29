import { defineSliceMachinePlugin } from "@slicemachine/plugin-kit";

import { name as pkgName } from "../package.json";

type NuxtPluginOptions = {
	typescript: boolean;
};

export default defineSliceMachinePlugin<NuxtPluginOptions>({
	meta: {
		name: pkgName,
	},
	setup({ hook, options }) {
		// Just trying types...
		if (options.typescript) {
			hook("slice:create", (_data, { options }) => {
				if (options.typescript) {
				}
			});
		}
		/* ... */
	},
});
