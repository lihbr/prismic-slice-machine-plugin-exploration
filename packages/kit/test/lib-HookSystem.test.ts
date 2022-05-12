import { it, expect, vi } from "vitest";

import { HookSystem } from "../src/lib";

// TODO: Refactor tests to clearly separate base usage from createScope usage

it("calls hooks", async () => {
	const system = new HookSystem();

	const foo = vi.fn();
	const bar = vi.fn();
	const baz = vi.fn();

	system.hook("root", "hook1", foo);
	system.hook("root", "hook1", bar);
	system.hook("root", "hook2", baz);

	await system.callHook("hook1");

	expect(foo).toHaveBeenCalledTimes(1);
	expect(bar).toHaveBeenCalledTimes(1);
	expect(baz).not.toHaveBeenCalled();

	await system.callHook("hook2");

	expect(foo).toHaveBeenCalledTimes(1);
	expect(bar).toHaveBeenCalledTimes(1);
	expect(baz).toHaveBeenCalledTimes(1);
});

it("calls hooks with scoped additional args", async () => {
	const system = new HookSystem();

	const { hook: fooHook } = system.createScope("foo", ["fooArg1", "fooArg2"]);
	const { hook: barHook } = system.createScope("bar", ["barArg1"]);

	const foo = vi.fn();
	const bar = vi.fn();

	fooHook("hook", foo);
	barHook("hook", bar);

	await system.callHook("hook", "quxArg1");

	expect(foo).toHaveBeenCalledTimes(1);
	expect(foo).toHaveBeenCalledWith("quxArg1", "fooArg1", "fooArg2");
	expect(bar).toHaveBeenCalledTimes(1);
	expect(bar).toHaveBeenCalledWith("quxArg1", "barArg1");
});

it("stops calling hook when unhooked", async () => {
	const system = new HookSystem();

	const { hook, unhook } = system.createScope("root", []);

	const foo = vi.fn();
	const bar = vi.fn();

	system.hook("root", "hook1", foo);
	hook("hook1", bar);

	await system.callHook("hook1");

	expect(foo).toHaveBeenCalledTimes(1);
	expect(bar).toHaveBeenCalledTimes(1);

	system.unhook("hook1", foo);

	await system.callHook("hook1");

	expect(foo).toHaveBeenCalledTimes(1);
	expect(bar).toHaveBeenCalledTimes(2);

	unhook("hook1", bar);

	await system.callHook("hook1");

	expect(foo).toHaveBeenCalledTimes(1);
	expect(bar).toHaveBeenCalledTimes(2);
});

it("returns an empty array when no hook registered", async () => {
	const system = new HookSystem();

	const result = await system.callHook("hook1");

	expect(result).toStrictEqual([]);
});

it("returns hook returned values in order", async () => {
	const system = new HookSystem();

	const { hook } = system.createScope("root", []);

	const foo = vi.fn(() => "foo");
	const bar = vi.fn(() => "bar");

	system.hook("root", "hook1", foo);
	hook("hook1", bar);

	const result = await system.callHook("hook1");

	expect(result).toStrictEqual(["foo", "bar"]);
});

it("allows inspection of owner registered hooks", () => {
	const system = new HookSystem();

	const { hook } = system.createScope("bar", []);

	system.hook("foo", "hook1", vi.fn());
	system.hook("foo", "hook2", vi.fn());
	system.hook("foo", "hook3", vi.fn());
	hook("hook1", vi.fn());

	expect(
		system
			.hooksForOwner("foo")
			.map((registeredHook) => registeredHook.meta.name),
	).toStrictEqual(["hook1", "hook2", "hook3"]);
	expect(
		system
			.hooksForOwner("bar")
			.map((registeredHook) => registeredHook.meta.name),
	).toStrictEqual(["hook1"]);
});
