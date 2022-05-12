import {
	createSliceMachineHookSystem,
	createSliceMachinePluginRunner,
	SliceMachineProject,
} from "@slicemachine/plugin-kit";
import { test, expect, vi } from "vitest";
// import mockFs from "mock-fs";
import * as prismicM from "@prismicio/mock";

import * as plugin from "../src";

vi.mock("@slicemachine/adapter-next", () => {
	return plugin;
});

// WARNING: This will actually write to the file system in `/tmp/`.
// mock-fs seems to break `import()` used in `@slicemachine/plugin-kit`.
const MOCK_PROJECT_ROOT = "/tmp/slicemachine-test";

// beforeEach(() => {
// 	mockFs({
// 		[MOCK_PROJECT_ROOT]: {},
// 	});
// });

// afterEach(() => {
// 	mockFs.restore();
// });

const createProject = (): SliceMachineProject => {
	return {
		root: MOCK_PROJECT_ROOT,
		config: {
			_latest: "0.0.0",
			adapter: "@slicemachine/adapter-next",
			apiEndpoint: "https://qwerty.cdn.prismic.io/api/v2",
		},
	};
};

test("exports something", async () => {
	const seed = expect.getState().currentTestName;
	const project = createProject();
	const model = prismicM.model.sharedSlice({
		seed,
		variations: [prismicM.model.sharedSliceVariation({ seed })],
	});

	const hookSystem = createSliceMachineHookSystem();
	const pluginRunner = createSliceMachinePluginRunner(project, hookSystem);

	await pluginRunner.init();

	await hookSystem.callHook("slice:create", { libraryID: "foo", model });
});
