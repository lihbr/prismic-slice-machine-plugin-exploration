import { it, expect } from "vitest";
import * as prismicM from "@prismicio/mock";

import * as kit from "../src";

it("foo", async () => {
	const project: kit.SliceMachineProject = {
		root: "/tmp/foo",
		config: {
			_latest: "0.0.0",
			adapter: "@slicemachine/plugin-kit",
			apiEndpoint: "https://qwerty.cdn.prismic.io/api/v2",
		},
	};
	const hookSystem = kit.createSliceMachineHookSystem();
	const pluginRunner = kit.createSliceMachinePluginRunner(project, hookSystem);

	await pluginRunner.init();

	const seed = expect.getState().currentTestName;
	const model = prismicM.model.sharedSlice({ seed });

	await hookSystem.callHook("slice:create", { libraryID: "foo", model });
});
