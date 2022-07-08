import { test, expect } from "vitest";
import { createMockFactory } from "@prismicio/mock";
import { createSliceMachinePluginRunner } from "@slicemachine/plugin-kit";
import * as fs from "node:fs/promises";
import * as path from "node:path";

import { withProject } from "./lib/withProject";

test("creates a Slice component, model, and types file on Slice creation", async (ctx) => {
	const mock = createMockFactory({ seed: ctx.meta.name });
	const model = mock.model.sharedSlice({
		id: "bar_baz",
		variations: [mock.model.sharedSliceVariation()],
	});

	await withProject(async (project) => {
		const pluginRunner = createSliceMachinePluginRunner({ project });
		await pluginRunner.init();

		await pluginRunner.callHook("slice:create", { libraryID: "foo", model });

		expect(await fs.readdir(path.join(project.root, "foo", "BarBaz"))).toEqual([
			"index.js",
			"model.json",
			"types.ts",
		]);
	});
});

test("model.json file matches the given model", async (ctx) => {
	const mock = createMockFactory({ seed: ctx.meta.name });
	const model = mock.model.sharedSlice({
		id: "bar_baz",
		variations: [mock.model.sharedSliceVariation()],
	});

	await withProject(async (project) => {
		const pluginRunner = createSliceMachinePluginRunner({ project });
		await pluginRunner.init();

		await pluginRunner.callHook("slice:create", { libraryID: "foo", model });

		expect(
			JSON.parse(
				await fs.readFile(
					path.join(project.root, "foo", "BarBaz", "model.json"),
					"utf8",
				),
			),
		).toStrictEqual(model);
	});
});
