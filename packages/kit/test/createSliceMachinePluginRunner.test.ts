import { it, expect, vi } from "vitest";

import {
	REQUIRED_ADAPTER_HOOKS,
	createSliceMachinePluginRunner,
	SliceMachineProject,
	defineSliceMachinePlugin,
} from "../src";

vi.mock("valid-adapter", () => ({
	default: defineSliceMachinePlugin({
		meta: {
			name: "valid-adapter",
		},
		setup({ hook }) {
			for (const adapterHook of REQUIRED_ADAPTER_HOOKS) {
				hook(adapterHook, () => {
					throw new Error("not implemented");
				});
			}
		},
	}),
}));

const createSliceMachineProject = (
	adapter?: string | null,
	plugins?: string[],
): SliceMachineProject => {
	return {
		root: "/tmp/foo",
		config: {
			_latest: "0.0.0",
			apiEndpoint: "https://qwerty.cdn.prismic.io/api/v2",
			adapter: adapter ?? "valid-adapter",
			plugins,
		},
	};
};

it("inits adapter", async () => {
	const project = createSliceMachineProject();
	const pluginRunner = createSliceMachinePluginRunner({ project });

	await expect(pluginRunner.init()).resolves.not.toThrowError();
	expect(
		pluginRunner.hooksForOwner("valid-adapter").map((hook) => hook.meta.name),
	).toStrictEqual(REQUIRED_ADAPTER_HOOKS);
});

it("throws when adapter is not valid", async (ctx) => {
	vi.mock(ctx.meta.name, () => ({
		default: defineSliceMachinePlugin({
			meta: {
				name: ctx.meta.name,
			},
			setup() {
				/* ... */
			},
		}),
	}));
	const project = createSliceMachineProject(ctx.meta.name);
	const pluginRunner = createSliceMachinePluginRunner({ project });

	await expect(pluginRunner.init()).rejects.toThrowError(
		`Adapter \`${ctx.meta.name}\` is missing hooks:`,
	);

	vi.unmock(ctx.meta.name);
});

it("throws when adapter or plugin could not be loaded", async (ctx) => {
	vi.mock(ctx.meta.name, () => false);

	const project = createSliceMachineProject(ctx.meta.name);
	const pluginRunner = createSliceMachinePluginRunner({ project });

	await expect(pluginRunner.init()).rejects.toThrowError(
		`Could not load plugin: \`${ctx.meta.name}\``,
	);

	vi.unmock(ctx.meta.name);
});

it("throws when adapter or plugin throws on setup", async () => {
	vi.mock("foo", () => ({
		default: defineSliceMachinePlugin({
			meta: {
				name: "foo",
			},
			setup() {
				throw new Error("foo");
			},
		}),
	}));
	const fooProject = createSliceMachineProject("foo");
	const fooPluginRunner = createSliceMachinePluginRunner({
		project: fooProject,
	});

	await expect(fooPluginRunner.init()).rejects.toThrowError(
		`Plugin \`foo\` errored during setup: foo`,
	);

	vi.unmock("foo");

	vi.mock("bar", () => ({
		default: defineSliceMachinePlugin({
			meta: {
				name: "bar",
			},
			setup() {
				throw "bar";
			},
		}),
	}));
	const barProject = createSliceMachineProject("bar");
	const barPluginRunner = createSliceMachinePluginRunner({
		project: barProject,
	});

	await expect(barPluginRunner.init()).rejects.toThrowError(
		`Plugin \`bar\` errored during setup: bar`,
	);

	vi.unmock("bar");
});

it("prevents plugin to hook to adapter only hooks", async (ctx) => {
	vi.mock(ctx.meta.name, () => ({
		default: defineSliceMachinePlugin({
			meta: {
				name: ctx.meta.name,
			},
			setup({ hook }) {
				for (const adapterHook of REQUIRED_ADAPTER_HOOKS) {
					hook(adapterHook, () => {
						throw new Error("not implemented");
					});
				}

				hook("slice:create", () => {
					throw new Error("not implemented");
				});
			},
		}),
	}));

	const project = createSliceMachineProject(null, [ctx.meta.name]);
	const pluginRunner = createSliceMachinePluginRunner({ project });

	await pluginRunner.init();
	expect(
		pluginRunner.hooksForOwner("valid-adapter").map((hook) => hook.meta.name),
	).toStrictEqual(REQUIRED_ADAPTER_HOOKS);
	expect(
		pluginRunner.hooksForOwner(ctx.meta.name).map((hook) => hook.meta.name),
	).toStrictEqual(["slice:create"]);
});
