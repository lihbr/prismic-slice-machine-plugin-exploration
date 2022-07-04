import { HookSystem } from "../src/lib";

// Placeholder function
const fn = () => null;

// Hook system hooks
type Hooks = {
	hook1: () => null;
	hook2: { fn: () => null; meta: { foo: string } };
};

// System
const system = new HookSystem<Hooks>();

// Scoped variant
const { hook } = system.createScope("_", []);

/**
 * Hooks requiring no meta don't require a meta argument.
 */
system.hook("_", "hook1", fn);
hook("hook1", fn);

/**
 * Hooks requiring no meta accept an optional meta argument.
 */
system.hook("_", "hook1", fn, { foo: "bar" });
hook("hook1", fn, { foo: "bar" });

/**
 * Hooks requiring meta error about missing meta argument.
 */
// @ts-expect-error - errors about missing meta argument.
system.hook("_", "hook2", fn);
// @ts-expect-error - errors about missing meta argument.
hook("hook2", fn);

/**
 * Hooks requiring meta error about mistyped meta argument.
 */
// @ts-expect-error - errors about mistyped meta argument.
system.hook("_", "hook2", fn, { foo: 1 });
// @ts-expect-error - errors about mistyped meta argument.
hook("hook2", fn, { foo: 1 });

/**
 * Hooks requiring meta accept a meta argument.
 */
system.hook("_", "hook2", fn, { foo: "bar" });
hook("hook2", fn, { foo: "bar" });

/**
 * Hooks requiring meta accept a meta argument with additional arbitrary properties.
 */
system.hook("_", "hook2", fn, { foo: "bar", qux: "quux" });
hook("hook2", fn, { foo: "bar", qux: "quux" });
