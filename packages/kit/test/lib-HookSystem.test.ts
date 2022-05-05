import { it, expect, vi } from "vitest";

import { HookSystem } from "../src/lib";

const root = { canHook: ["*"], canCall: ["*"] };

it("calls hooks", async () => {
	const { hook, callHook } = new HookSystem({ root }).useHooks("root", "root");

	const foo = vi.fn();
	const bar = vi.fn();
	const baz = vi.fn();

	hook("hook1", foo);
	hook("hook1", bar);
	hook("hook2", baz);

	await callHook("hook1");

	expect(foo).toHaveBeenCalledTimes(1);
	expect(bar).toHaveBeenCalledTimes(1);
	expect(baz).not.toHaveBeenCalled();

	await callHook("hook2");

	expect(foo).toHaveBeenCalledTimes(1);
	expect(bar).toHaveBeenCalledTimes(1);
	expect(baz).toHaveBeenCalledTimes(1);
});

it("calls hooks with scoped additional args", async () => {
	const system = new HookSystem({ root });

	const { hook: fooHook } = system.useHooks(
		"root",
		"foo",
		"fooArg1",
		"fooArg2",
	);
	const { hook: barHook, callHook } = system.useHooks("root", "bar", "barArg1");

	const foo = vi.fn();
	const bar = vi.fn();

	fooHook("hook", foo);
	barHook("hook", bar);

	await callHook("hook", "quxArg1");

	expect(foo).toHaveBeenCalledTimes(1);
	expect(foo).toHaveBeenCalledWith("quxArg1", "fooArg1", "fooArg2");
	expect(bar).toHaveBeenCalledTimes(1);
	expect(bar).toHaveBeenCalledWith("quxArg1", "barArg1");
});

it("stops calling hook when unhooked", async () => {
	const { hook, unHook, callHook } = new HookSystem({ root }).useHooks(
		"root",
		"root",
	);

	const foo = vi.fn();
	const bar = vi.fn();

	const unhook = hook("hook1", foo);
	hook("hook1", bar);

	await callHook("hook1");

	expect(foo).toHaveBeenCalledTimes(1);
	expect(bar).toHaveBeenCalledTimes(1);

	unhook();

	await callHook("hook1");

	expect(foo).toHaveBeenCalledTimes(1);
	expect(bar).toHaveBeenCalledTimes(2);

	unHook("hook1", bar);

	await callHook("hook1");

	expect(foo).toHaveBeenCalledTimes(1);
	expect(bar).toHaveBeenCalledTimes(2);
});

it("returns undefined when no hook", async () => {
	const { callHook } = new HookSystem({ root }).useHooks("root", "root");

	const result = await callHook("hook1");

	expect(result).toBeUndefined();
});

it("returns first hook return value", async () => {
	const { hook, callHook } = new HookSystem({ root }).useHooks("root", "root");

	const foo = vi.fn(() => "foo");
	const bar = vi.fn(() => "bar");

	hook("hook1", foo);
	hook("hook1", bar);

	const result = await callHook("hook1");

	expect(result).toBe("foo");
});

it("doesn't allow unauthorized users to hook", async () => {
	const system = new HookSystem({
		root,
		user: { canHook: ["user:*"], canCall: ["*"] },
	});
	const { hook: userHook } = system.useHooks("user", "user");
	const { hook: rootHook, callHook } = system.useHooks("root", "root");

	const foo = vi.fn();
	const bar = vi.fn();
	const baz = vi.fn();
	const qux = vi.fn();

	userHook("hook1", foo);
	userHook("user:hook2", bar);
	rootHook("hook1", baz);
	rootHook("user:hook2", qux);

	await callHook("hook1");

	expect(foo).not.toHaveBeenCalled();
	expect(bar).not.toHaveBeenCalled();
	expect(baz).toHaveBeenCalledTimes(1);
	expect(qux).not.toHaveBeenCalled();

	await callHook("user:hook2");

	expect(foo).not.toHaveBeenCalled();
	expect(bar).toHaveBeenCalledTimes(1);
	expect(baz).toHaveBeenCalledTimes(1);
	expect(qux).toHaveBeenCalledTimes(1);
});

it("doesn't allow unauthorized users to call hook", async () => {
	const system = new HookSystem({
		root,
		user: { canHook: ["*"], canCall: ["user:*"] },
	});
	const { callHook: userCallHook } = system.useHooks("user", "user");
	const { hook, callHook: rootCallHook } = system.useHooks("root", "root");

	const foo = vi.fn();
	const bar = vi.fn();

	hook("hook1", foo);
	hook("user:hook2", bar);

	await userCallHook("hook1");

	expect(foo).not.toHaveBeenCalled();
	expect(bar).not.toHaveBeenCalled();

	await userCallHook("user:hook2");

	expect(foo).not.toHaveBeenCalled();
	expect(bar).toHaveBeenCalledTimes(1);

	await rootCallHook("hook1");

	expect(foo).toHaveBeenCalledTimes(1);
	expect(bar).toHaveBeenCalledTimes(1);

	await rootCallHook("user:hook2");

	expect(foo).toHaveBeenCalledTimes(1);
	expect(bar).toHaveBeenCalledTimes(2);
});

it("allows inspection of user hooks", () => {
	const system = new HookSystem({ root });

	const { hook: fooHook } = system.useHooks("root", "foo");
	const { hook: barHook } = system.useHooks("root", "bar");

	fooHook("hook1", vi.fn());
	fooHook("hook2", vi.fn());
	fooHook("hook3", vi.fn());
	barHook("hook1", vi.fn());

	expect(system.inspect("foo")).toStrictEqual(["hook1", "hook2", "hook3"]);
	expect(system.inspect("bar")).toStrictEqual(["hook1"]);
});
