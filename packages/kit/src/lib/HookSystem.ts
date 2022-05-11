// import micromatch from "micromatch";
// import memoizee from "memoizee";

// const isAuthorized = memoizee(micromatch.isMatch);
// const mockFunction = () => {
// 	/* ... */
// };

/**
 * Defines a hook handler.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Hook<TArgs extends any[] = any[], TReturn = any> = (
	...args: TArgs
) => Promise<TReturn> | TReturn;

// /**
//  * Defines a hook group for users to belong to.
//  */
// export type HookGroup = {
// 	canHook: string[];
// 	canCall: string[];
// };

// /**
//  * Extends hooks with extra args.
//  */
// type ExtendHooks<
// 	THooks extends Record<string, Hook> = Record<string, Hook>,
// 	TExtraArgs extends unknown[] = never[],
// 	THookNames extends keyof THooks & string = keyof THooks & string,
// > = {
// 	[K in THookNames]: (
// 		...args: [...args: Parameters<THooks[K]>, ...extraArgs: TExtraArgs]
// 	) => ReturnType<THooks[K]>;
// };

// /**
//  * Defines the return type of the {@link HookSystem.useHooks} functions.
//  */
// export type UseHooksReturnType<
// 	THooks extends Record<string, Hook> = Record<string, Hook>,
// 	TExtraArgs extends unknown[] = never[],
// 	TGroupNames extends string = string,
// 	THookNames extends keyof THooks & string = keyof THooks & string,
// > = {
// 	hook: <TName extends THookNames>(
// 		name: TName,
// 		hook: ExtendHooks<THooks, TExtraArgs>[TName],
// 	) => () => void;
// 	unHook: HookSystem<
// 		ExtendHooks<THooks, TExtraArgs>,
// 		TGroupNames,
// 		THookNames
// 	>["unHook"];
// 	callHook: HookSystem<THooks, TGroupNames, THookNames>["callHook"];
// };

/**
 * Represents a registered hook.
 */
type RegisteredHook<THook extends Hook = Hook> = {
	owner: string;
	hook: THook;
	meta: Record<string, unknown>;
};

type HookForOwner<
	THooks extends Record<string, Hook> = Record<string, Hook>,
	THook extends Hook = Hook,
> = {
	name: keyof THooks;
	hook: THook;
};

/**
 * @internal
 */
export class HookSystem<
	THooks extends Record<string, Hook> = Record<string, Hook>,
> {
	private registeredHooks: {
		[K in keyof THooks]?: RegisteredHook<THooks[K]>[];
	} = {};

	hook<TName extends keyof THooks>(
		owner: string,
		name: TName,
		hook: THooks[TName],
		meta: Record<string, unknown> = {},
	): void {
		if (!this.registeredHooks[name]) {
			this.registeredHooks[name] = [];
		}

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		this.registeredHooks[name]!.push({
			owner,
			hook,
			meta,
		});
	}

	unhook<TName extends keyof THooks>(name: TName, hook: THooks[TName]): void {
		this.registeredHooks[name] = this.registeredHooks[name]?.filter(
			(hooked) => hooked.hook !== hook,
		);
	}

	async callHook<TName extends keyof THooks>(
		name: TName,
		...args: Parameters<THooks[TName]>
	): Promise<Awaited<ReturnType<THooks[TName]>>[]> {
		const hooks = this.registeredHooks[name] ?? [];

		const promises = hooks.map(async (hooked) => {
			return (await hooked.hook(...args)) as ReturnType<THooks[TName]>;
		});

		return await Promise.all(promises);
	}

	/**
	 * Returns list of hooks
	 */
	hooksForOwner(owner: string): HookForOwner[] {
		const hooks: HookForOwner[] = [];

		for (const hookName in this.registeredHooks) {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const theseHooks = this.registeredHooks[hookName]!;

			for (const hook of theseHooks) {
				if (hook.owner === owner) {
					hooks.push({
						name: hookName,
						hook: hook.hook,
					});
				}
			}
		}

		return hooks;
	}

	// /**
	//  * Inspects hooks a user hooked to.
	//  *
	//  * @param name - The user to inspect.
	//  *
	//  * @returns A list of hooks that the user hooked to.
	//  */
	// inspect(name: string): THookNames[] {
	// 	return (
	// 		Object.entries(this._hooks) as [
	// 			THookNames,
	// 			Hooked<THooks[keyof THooks], TGroupNames>[],
	// 		][]
	// 	).reduce<THookNames[]>((hooks, [name, hookedArray]) => {
	// 		if (hookedArray.find((hooked) => hooked.name === name)) {
	// 			hooks.push(name);
	// 		}

	// 		return hooks;
	// 	}, []);
	// }

	// /**
	//  * Use hook system as a user from given group. Additional arguments can be
	//  * passed to the hooks.
	//  *
	//  * @param groupID - The group to use hooks with.
	//  * @param userID - The user to use hooks with.
	//  * @param extraArgs - Any additional arguments to pass to the hooks used.
	//  *
	//  * @returns `hook`, `unHook`, and `callHook` functions for the group.
	//  */
	// useHooks<TExtraArgs extends unknown[] = never[]>(
	// 	groupID: TGroupNames,
	// 	userID: string,
	// 	...extraArgs: TExtraArgs
	// ): UseHooksReturnType<THooks, TExtraArgs, TGroupNames, THookNames> {
	// 	const group = this.getGroup(groupID);

	// 	return {
	// 		hook: <TName extends THookNames>(
	// 			name: TName,
	// 			hook: ExtendHooks<THooks, TExtraArgs>[TName],
	// 		): (() => void) => {
	// 			if (!isAuthorized(name, group.canHook)) {
	// 				return mockFunction;
	// 			}

	// 			const internalHook = ((...args: Parameters<THooks[TName]>) => {
	// 				return hook(...args, ...extraArgs);
	// 			}) as THooks[TName];

	// 			return this.hook(groupID, userID, name, internalHook, {
	// 				external: hook,
	// 			});
	// 		},
	// 		unHook: (name, hook) => {
	// 			this._hooks[name] = this._hooks[name]?.filter(
	// 				(hooked) => hooked.meta.external !== hook,
	// 			);
	// 		},
	// 		callHook: (name, ...args) => {
	// 			if (!isAuthorized(name, group.canCall)) {
	// 				return new Promise((resolve) => resolve([]));
	// 			}

	// 			return this.callHook(name, ...args);
	// 		},
	// 	};
	// }
}
