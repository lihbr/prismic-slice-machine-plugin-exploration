import { defineSliceMachinePlugin } from "@slicemachine/plugin-kit";

import { name as pkgName } from "../package.json";
import { PluginOptions } from "./types";

import { sliceCreate } from "./hooks/slice-create";
import { sliceUpdate } from "./hooks/slice-update";
import { sliceDelete } from "./hooks/slice-delete";
import { sliceRead } from "./hooks/slice-read";
import { customTypeRead } from "./hooks/customType-read";
import { snippetRead } from "./hooks/snippet-read";
import { libraryRead } from "./hooks/library-read";

export default defineSliceMachinePlugin<PluginOptions>({
	meta: {
		name: pkgName,
	},
	defaultOptions: {
		format: true,
	},
	setup({ hook }) {
		hook("slice:create", sliceCreate);
		hook("slice:update", sliceUpdate);
		hook("slice:delete", sliceDelete);
		hook("slice:read", sliceRead);

		hook("custom-type:read", customTypeRead);

		hook("snippet:read", snippetRead);

		hook("library:read", libraryRead);

		hook("slice-simulator:setup:read", () => {
			throw new Error("not implemented");
		});
	},
});
