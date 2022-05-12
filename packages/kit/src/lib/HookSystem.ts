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
	): Promise<Awaited<ReturnType<THookFns[TName]>>[]> {
		const hooks = this._registeredHooks[name] ?? [];

		const promises = hooks.map((hook) => {
			return hook.fn(...args) as ReturnType<THookFns[TName]>;
		});

		return await Promise.all(promises);
	}

	/**
	 * Returns list of hooks for a given owner
	 */
	hooksForOwner(owner: string): RegisteredHook[] {
		const hooks: RegisteredHook[] = [];

		for (const hookName in this._registeredHooks) {
			const registeredHooks = this._registeredHooks[hookName] ?? [];

			for (const registeredHook of registeredHooks) {
				if (registeredHook.meta.owner === owner) {
					hooks.push(registeredHook);
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

	// createCallHookScope<TExtraArgs extends unknown[] = never[]>(
	// 	extraArgs: TExtraArgs,
	// ) {
	// 	return <TName extends Extract<keyof THookFns, string>>(
	// 		name: TName,
	// 		...args: Parameters<THookFns[TName]>
	// 	): Promise<Awaited<ReturnType<THookFns[TName]>>[]> => {
	// 		return this.callHook(name, ...args, ...extraArgs);
	// 	};
	// }

	// /**
	//  * Additional arguments can be passed to the hooks.
	//  *
	//  * @param extraArgs - Any additional arguments to pass to the hooks used.
	//  *
	//  * @returns `hook`, `unHook`, and `callHook` functions for the group.
	//  */
	// cloneWithExtraHookArgs<TExtraArgs extends unknown[] = never[]>(
	// 	extraArgs: TExtraArgs,
	// ): HookSystem<THookFns> {
	// 	const newSystem = new HookSystem<THookFns>();

	// 	for (const hookName in this.registeredHooks) {
	// 		const registeredHooks = this.registeredHooks[hookName] ?? [];

	// 		for (const registeredHook of registeredHooks) {
	// 			const hookWithExtraArgs = ((
	// 				...args: Parameters<THookFns[typeof hookName]>
	// 			) => {
	// 				return registeredHook.fn(...args, ...extraArgs);
	// 			}) as THookFns[typeof hookName];

	// 			newSystem.hook(registeredHook.meta.owner, hookName, hookWithExtraArgs, {
	// 				external: registeredHook.fn,
	// 			});
	// 		}
	// 	}

	// 	return newSystem;
	// }
}
