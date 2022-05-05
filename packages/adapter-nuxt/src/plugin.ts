import { defineSliceMachinePlugin } from "@slicemachine/plugin-kit";

import { name as pkgName } from "../package.json";

export default defineSliceMachinePlugin({
	meta: {
		name: pkgName,
	},
	setup() {
		/* ... */
	},
});
