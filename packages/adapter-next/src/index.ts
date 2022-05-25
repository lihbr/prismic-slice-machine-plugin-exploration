import { defineSliceMachinePlugin } from "@slicemachine/plugin-kit";

import { name as pkgName } from "../package.json";
import { PluginOptions } from "./types";

import { sliceCreate } from "./hooks/slice-create";
import { sliceUpdate } from "./hooks/slice-update";
import { sliceDelete } from "./hooks/slice-delete";
import { sliceRead } from "./hooks/slice-read";
import { customTypeCreate } from "./hooks/customType-create";
import { customTypeDelete } from "./hooks/customType-delete";
import { customTypeRead } from "./hooks/customType-read";
import { snippetRead } from "./hooks/snippet-read";
import { libraryRead } from "./hooks/library-read";
import { sliceSimulatorSetupRead } from "./hooks/sliceSimulator-setup-read";

export default defineSliceMachinePlugin<PluginOptions>({
	meta: {
		name: pkgName,
	},
	defaultOptions: {
		format: true,
	},
	setup({ actions: { hook } }) {
		hook("slice:create", sliceCreate);
		hook("slice:update", sliceUpdate);
		hook("slice:delete", sliceDelete);
		hook("slice:read", sliceRead);

		hook("custom-type:create", customTypeCreate);
		hook("custom-type:update", customTypeCreate);
		hook("custom-type:delete", customTypeDelete);
		hook("custom-type:read", customTypeRead);

		hook("snippet:read", snippetRead);

		hook("library:read", libraryRead);

		hook("slice-simulator:setup:read", sliceSimulatorSetupRead);
	},
});
