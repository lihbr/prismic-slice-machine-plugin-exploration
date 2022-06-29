/**
 * Defines a hook handler.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type HookFn<TArgs extends any[] = any[], TReturn = any> = (
	...args: TArgs
) => Promise<TReturn> | TReturn;

/**
 * Extends a function arguments with extra ones.
 */
export type WithExtraArgs<
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	F extends (...args: any[]) => any,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	TExtraArgs extends any[] = any[],
> = (
	...args: [...args: Parameters<F>, ...extraArgs: TExtraArgs]
) => ReturnType<F>;

/**
 * Extends hooks with extra args.
 */
type HookFnsWithExtraArgs<
	THookFns extends Record<string, HookFn> = Record<string, HookFn>,
	TExtraArgs extends unknown[] = never[],
> = {
	[K in keyof THookFns]: WithExtraArgs<THookFns[K], TExtraArgs>;
};

/**
 * Defines the return type of the {@link HookSystem.createScope} functions.
 */
export type CreateScopeReturnType<
	THookFns extends Record<string, HookFn> = Record<string, HookFn>,
	TExtraArgs extends unknown[] = never[],
> = {
	hook: <TName extends Extract<keyof THookFns, string>>(
		name: TName,
		hook: WithExtraArgs<THookFns[TName], TExtraArgs>,
		meta?: Partial<RegisteredHookMeta>,
	) => void;
	unhook: HookSystem<HookFnsWithExtraArgs<THookFns, TExtraArgs>>["unhook"];
};

type RegisteredHookMeta = {
	name: string;
	owner: string;
	external?: HookFn;
	[key: string]: unknown;
};

/**
 * Represents a registered hook.
 */
type RegisteredHook<THookFn extends HookFn = HookFn> = {
	fn: THookFn;
	meta: RegisteredHookMeta;
};

export class HookError<TError = Error | unknown> extends Error {
	hook: string;
	owner: string;
	rawMeta: RegisteredHookMeta;
	rawCause: TError;

	constructor(meta: RegisteredHookMeta, cause: TError) {
		super(
			`Error in \`${meta.owner}\` during \`${meta.name}\` hook: ${
				cause instanceof Error ? cause.message : String(cause)
			}`,
			{ cause: cause instanceof Error ? cause : undefined },
		);

		this.hook = meta.name;
		this.owner = meta.owner;
		this.rawMeta = meta;
		this.rawCause = cause;
	}
}

/**
 * @internal
 */
export class HookSystem<
	THookFns extends Record<string, HookFn> = Record<string, HookFn>,
> {
	private _registeredHooks: {
		[K in keyof THookFns]?: RegisteredHook<THookFns[K]>[];
	} = {};

	hook<TName extends Extract<keyof THookFns, string>>(
		owner: string,
		name: TName,
		hookFn: THookFns[TName],
		meta: Partial<RegisteredHookMeta> = {},
	): void {
		if (!this._registeredHooks[name]) {
			this._registeredHooks[name] = [];
		}

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		this._registeredHooks[name]!.push({
			fn: hookFn,
			meta: {
				...meta,
				owner,
				name,
			},
		});
	}

	unhook<TName extends Extract<keyof THookFns, string>>(
		name: TName,
		hookFn: THookFns[TName],
	): void {
		this._registeredHooks[name] = this._registeredHooks[name]?.filter(
			(registeredHook) => registeredHook.fn !== hookFn,
		);
	}

	async callHook<TName extends Extract<keyof THookFns, string>>(
		name: TName,
		...args: Parameters<THookFns[TName]>
	): Promise<{
		data: Awaited<ReturnType<THookFns[TName]>>[];
		errors: HookError[];
	}> {
		const hooks = this._registeredHooks[name] ?? [];

		const promises = hooks.map(async (hook) => {
			try {
				return (await hook.fn(...args)) as ReturnType<THookFns[TName]>;
			} catch (error) {
				throw new HookError(hook.meta, error);
			}
		});

		const settledPromises = await Promise.allSettled(promises);

		return settledPromises.reduce<{
			data: Awaited<ReturnType<THookFns[TName]>>[];
			errors: HookError[];
		}>(
			(acc, settledPromise) => {
				if (settledPromise.status === "fulfilled") {
					acc.data.push(settledPromise.value);
				} else {
					acc.errors.push(settledPromise.reason);
				}

				return acc;
			},
			{ data: [], errors: [] },
		);
	}

	/**
	 * Returns list of hooks for a given owner
	 */
	hooksForOwner(owner: string): RegisteredHook[] {
		const hooks: RegisteredHook[] = [];

		for (const hookName in this._registeredHooks) {
			const registeredHooks = this._registeredHooks[hookName];

			if (Array.isArray(registeredHooks)) {
				for (const registeredHook of registeredHooks) {
					if (registeredHook.meta.owner === owner) {
						hooks.push(registeredHook);
					}
				}
			}
		}

		return hooks;
	}

	createScope<TExtraArgs extends unknown[] = never[]>(
		owner: string,
		extraArgs: [...TExtraArgs],
		meta: Partial<RegisteredHookMeta> = {},
	): CreateScopeReturnType<THookFns, TExtraArgs> {
		return {
			hook: <TName extends Extract<keyof THookFns, string>>(
				name: TName,
				hookFn: WithExtraArgs<THookFns[TName], TExtraArgs>,
			): void => {
				const internalHook = ((...args: Parameters<THookFns[TName]>) => {
					return hookFn(...args, ...extraArgs);
				}) as THookFns[TName];

				return this.hook(owner, name, internalHook, {
					...meta,
					external: hookFn,
				});
			},
			unhook: (name, hookFn) => {
				this._registeredHooks[name] = this._registeredHooks[name]?.filter(
					(registeredHook) => registeredHook.meta.external !== hookFn,
				);
			},
		};
	}
}
