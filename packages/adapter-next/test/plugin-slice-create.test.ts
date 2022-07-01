import { test, expect, beforeEach, afterEach } from "vitest";
import * as prismicM from "@prismicio/mock";
import { createSliceMachinePluginRunner } from "@slicemachine/plugin-kit";
import mockFs from "mock-fs";
import * as fs from "node:fs/promises";
import * as path from "node:path";

import { MOCK_PROJECT_ROOT } from "./lib/constants";
import { createProject } from "./lib/createSliceMachineProject";

import plugin from "../src";

beforeEach(() => {
	mockFs({
		[MOCK_PROJECT_ROOT]: {},
	});
});

afterEach(() => {
	mockFs.restore();
});

test("creates a Slice component, model, and types file on Slice creation", async (ctx) => {
	const seed = ctx.meta.name;
	const model = prismicM.model.sharedSlice({
		seed,
		id: "bar_baz",
		variations: [prismicM.model.sharedSliceVariation({ seed })],
	});

	const project = createProject();
	const pluginRunner = createSliceMachinePluginRunner({
		project,
		staticPlugins: {
			"@slicemachine/adapter-next": plugin,
		},
	});

	await pluginRunner.init();
	await pluginRunner.callHook("slice:create", { libraryID: "foo", model });

	expect(
		await fs.readdir(path.join(MOCK_PROJECT_ROOT, "foo", "BarBaz")),
	).toEqual(["index.js", "model.json", "types.ts"]);
});
