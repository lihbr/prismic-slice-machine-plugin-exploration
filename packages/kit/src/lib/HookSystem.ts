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
 * Retrieves a map of hook names to hook functions from hooks.
 */
type HookFns<
	THooks extends Record<
		string,
		HookFn | { fn: HookFn; meta: Record<string, unknown> }
	> = Record<string, HookFn>,
> = {
	[key in keyof THooks]: THooks[key] extends HookFn
		? THooks[key]
		: THooks[key] extends { fn: HookFn }
		? THooks[key]["fn"]
		: never;
};

/**
 * Retrieves a map of hook names to hook metas from hooks.
 */
type HookMetas<
	THooks extends Record<
		string,
		HookFn | { fn: HookFn; meta: Record<string, unknown> }
	> = Record<string, HookFn>,
> = {
	[key in keyof THooks]: THooks[key] extends { meta: Record<string, unknown> }
		? THooks[key]["meta"]
		: void;
};

/**
 * Builds hook meta arguments after hook meta requirements.
 */
type HookMetaArg<TMeta extends Record<string, unknown> | void> =
	TMeta extends void
		? [meta?: Partial<RegisteredHookMeta>]
		: [meta: Partial<RegisteredHookMeta> & TMeta];

/**
 * Defines the return type of the {@link HookSystem.createScope} functions.
 */
export type CreateScopeReturnType<
	THooks extends Record<
		string,
		HookFn | { fn: HookFn; meta: Record<string, unknown> }
	> = Record<string, HookFn>,
	TExtraArgs extends unknown[] = never[],
	THookFns extends HookFns<THooks> = HookFns<THooks>,
	THookMetas extends HookMetas<THooks> = HookMetas<THooks>,
> = {
	hook: <TName extends Extract<keyof THookFns, string>>(
		name: TName,
		hookFn: WithExtraArgs<THookFns[TName], TExtraArgs>,
		...args: HookMetaArg<THookMetas[TName]>
	) => void;
	unhook: HookSystem<HookFnsWithExtraArgs<THookFns, TExtraArgs>>["unhook"];
};

type RegisteredHookMeta = {
	id: number;
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
 * Next hook ID, incremented each time a hook is registered.
 */
let nextHookID = 0;

/**
 * @internal
 */
export class HookSystem<
	THooks extends Record<
		string,
		HookFn | { fn: HookFn; meta: Record<string, unknown> }
	> = Record<string, HookFn>,
	THookFns extends HookFns<THooks> = HookFns<THooks>,
	THookMetas extends HookMetas<THooks> = HookMetas<THooks>,
> {
	private _registeredHooks: {
		[K in keyof THookFns]?: RegisteredHook<THookFns[K]>[];
	} = {};

	hook<TName extends Extract<keyof THookFns, string>>(
		owner: string,
		name: TName,
		hookFn: THookFns[TName],
		...args: HookMetaArg<THookMetas[TName]>
	): void {
		if (!this._registeredHooks[name]) {
			this._registeredHooks[name] = [];
		}

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		this._registeredHooks[name]!.push({
			fn: hookFn,
			meta: {
				...args[0],
				owner,
				name,
				id: nextHookID++,
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
		nameOrNameAndHookID: TName | { name: TName; hookID: number },
		...args: Parameters<THookFns[TName]>
	): Promise<{
		data: Awaited<ReturnType<THookFns[TName]>>[];
		errors: HookError[];
	}> {
		const hooks: RegisteredHook<THookFns[TName]>[] = [];

		if (typeof nameOrNameAndHookID === "string") {
			hooks.push(...(this._registeredHooks[nameOrNameAndHookID] ?? []));
		} else {
			hooks.push(
				...(this._registeredHooks[nameOrNameAndHookID.name]?.filter(
					(hook) => hook.meta.id === nameOrNameAndHookID.hookID,
				) ?? []),
			);
		}

		const promises = hooks.map(async (hook) => {
			try {
				return await hook.fn(...args);
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

	/**
	 * Returns list of hooks for a given name
	 */
	hooksForName(name: string): RegisteredHook[] {
		return this._registeredHooks[name] ?? [];
	}

	createScope<TExtraArgs extends unknown[] = never[]>(
		owner: string,
		extraArgs: [...TExtraArgs],
		scopeMeta: Partial<RegisteredHookMeta> = {},
	): CreateScopeReturnType<THooks, TExtraArgs, THookFns, THookMetas> {
		return {
			hook: <TName extends Extract<keyof THookFns, string>>(
				name: TName,
				hookFn: WithExtraArgs<THookFns[TName], TExtraArgs>,
				...args: HookMetaArg<THookMetas[TName]>
			): void => {
				const internalHook = ((...args: Parameters<THookFns[TName]>) => {
					return hookFn(...args, ...extraArgs);
				}) as THookFns[TName];

				const meta = {
					...scopeMeta,
					...args[0],
					external: hookFn,
				};

				return this.hook(
					owner,
					name,
					internalHook,
					...([meta] as HookMetaArg<THookMetas[TName]>),
				);
			},
			unhook: (name, hookFn) => {
				this._registeredHooks[name] = this._registeredHooks[name]?.filter(
					(registeredHook) => registeredHook.meta.external !== hookFn,
				);
			},
		};
	}
}
