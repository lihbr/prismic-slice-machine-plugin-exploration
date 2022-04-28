import { defineSliceMachineAdapter } from "@slicemachine/plugin-kit";

import { name as pkgName } from "../package.json";

export default defineSliceMachineAdapter({
	meta: {
		name: pkgName,
	},
	hooks: {
		"slice:create": (todo, options) => {
			/* ... */
		},
		"slice:update": () => {
			/* ... */
		},
		"slice:delete": () => {
			/* ... */
		},
		"slice:read": () => {
			/* ... */
		},
	},
});
