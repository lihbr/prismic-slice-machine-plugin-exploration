/**
 * Defines a hook handler.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type HookFn<TArgs extends any[] = any[], TReturn = any> = (
	...args: TArgs
) => Promise<TReturn> | TReturn;

/**
 * Defines a hook handler.
 */
export type WithExtraArgs<
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	F extends (...args: any[]) => any,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	TExtraArgs extends any[] = any[],
> = (
	...args: [...args: Parameters<F>, ...extraArgs: TExtraArgs]
) => ReturnType<F>;

// /**
//  * Defines a hook group for users to belong to.
//  */
// export type HookGroup = {
// 	canHook: string[];
// 	canCall: string[];
// };

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
 * Defines the return type of the {@link HookSystem.withExtraArgs} functions.
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
	// callHook: HookSystem<THookFns>["callHook"];
	// hooksForOwner: HookSystem<THookFns>["hooksForOwner"];
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
	private registeredHooks: {
		[K in keyof THookFns]?: RegisteredHook<THookFns[K]>[];
	} = {};

	hook<TName extends Extract<keyof THookFns, string>>(
		owner: string,
		name: TName,
		hookFn: THookFns[TName],
		meta: Partial<RegisteredHookMeta> = {},
	): void {
		if (!this.registeredHooks[name]) {
			this.registeredHooks[name] = [];
		}

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		this.registeredHooks[name]!.push({
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
		this.registeredHooks[name] = this.registeredHooks[name]?.filter(
			(registeredHook) => {
				registeredHook.fn !== hookFn;
			},
		);
	}

	async callHook<TName extends Extract<keyof THookFns, string>>(
		name: TName,
		...args: Parameters<THookFns[TName]>
	): Promise<Awaited<ReturnType<THookFns[TName]>>[]> {
		const hooks = this.registeredHooks[name] ?? [];

		const promises = hooks.map(async (hooked) => {
			return (await hooked.fn(...args)) as ReturnType<THookFns[TName]>;
		});

		return await Promise.all(promises);
	}

	/**
	 * Returns list of hooks
	 */
	hooksForOwner(owner: string): RegisteredHook[] {
		const hooks: RegisteredHook[] = [];

		for (const hookName in this.registeredHooks) {
			const registeredHooks = this.registeredHooks[hookName] ?? [];

			for (const registeredHook of registeredHooks) {
				if (registeredHook.meta.owner === owner) {
					hooks.push(registeredHook);
				}
			}
		}

		return hooks;
	}

	/**
	 * Use hook system as a user from given group. Additional arguments can be
	 * passed to the hooks.
	 *
	 * @param extraArgs - Any additional arguments to pass to the hooks used.
	 *
	 * @returns `hook`, `unHook`, and `callHook` functions for the group.
	 */
	createScope<TExtraArgs extends unknown[] = never[]>(
		owner: string,
		extraArgs: [...TExtraArgs],
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
					external: hookFn,
				});
			},
			unhook: (name, hookFn) => {
				this.registeredHooks[name] = this.registeredHooks[name]?.filter(
					(registeredHook) => {
						registeredHook.meta.external !== hookFn;
					},
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
