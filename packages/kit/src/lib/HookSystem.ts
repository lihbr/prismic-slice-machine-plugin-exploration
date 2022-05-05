import micromatch from "micromatch";
import memoizee from "memoizee";

const canHook = memoizee(micromatch.isMatch);
const canCall = canHook;
const mockFunction = () => {
	/* ... */
};

type ExtendHooks<
	THooks extends Record<string, Hook> = Record<string, Hook>,
	TExtraArgs extends unknown[] = never[],
	THookNames extends keyof THooks & string = keyof THooks & string,
> = {
	[K in THookNames]: (
		...args: [...Parameters<THooks[K]>, ...TExtraArgs]
	) => ReturnType<THooks[K]>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Hook<TArgs extends any[] = any[], TReturn = any> = (
	...args: TArgs
) => Promise<TReturn> | TReturn;

export type HookGroup = {
	canHook: string[];
	canCall: string[];
};

type Hooked<THook extends Hook = Hook, TGroupID extends string = string> = {
	groupID: TGroupID;
	userID: string;
	hook: THook;
	meta: Record<string, unknown>;
};

export class HookSystem<
	THooks extends Record<string, Hook> = Record<string, Hook>,
	TGroups extends Record<string, HookGroup> = Record<string, HookGroup>,
	THookNames extends keyof THooks & string = keyof THooks & string,
	TGroupNames extends keyof TGroups & string = keyof TGroups & string,
> {
	protected groups: TGroups;

	private _hooks: {
		[K in THookNames]?: Hooked<THooks[K], TGroupNames>[];
	} = {};

	constructor(groups: TGroups) {
		this.groups = groups;
	}

	protected getGroup(groupID: keyof TGroups): HookGroup {
		const group = this.groups[groupID];

		if (!group) {
			throw new Error(
				`Hook group \`${groupID}\` does not exist, available hook groups: \`${Object.keys(
					this.groups,
				)}\``,
			);
		}

		return group;
	}

	protected hook<TName extends THookNames>(
		groupID: TGroupNames,
		userID: string,
		name: TName,
		hook: THooks[TName],
		meta: Record<string, unknown> = {},
	): () => void {
		if (!name || typeof hook !== "function") {
			return mockFunction;
		}

		this._hooks[name] ||= [];
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		this._hooks[name]!.push({
			groupID,
			userID,
			hook,
			meta,
		});

		return () => {
			this.unHook(name, hook);
		};
	}

	protected unHook<TName extends THookNames>(
		name: TName,
		hook: THooks[TName],
	): void {
		this._hooks[name] = this._hooks[name]?.filter(
			(hooked) => hooked.hook !== hook,
		);
	}

	protected async callHook<TName extends THookNames>(
		name: TName,
		...args: Parameters<THooks[TName]>
	): Promise<Awaited<ReturnType<THooks[TName]>> | undefined> {
		const hooks = this._hooks[name] ?? [];

		const promises = hooks.map(
			(hooked) => hooked.hook(...args) as ReturnType<THooks[TName]>,
		);

		const [result] = await Promise.all(promises);

		return result;
	}

	/**
	 * Inspects hooks a user hooked to.
	 *
	 * @param userID - The user to inspect.
	 *
	 * @returns A list of hooks that the user hooked to.
	 */
	inspect(userID: string): THookNames[] {
		return (
			Object.entries(this._hooks) as [
				THookNames,
				Hooked<THooks[keyof THooks], TGroupNames>[],
			][]
		).reduce<THookNames[]>((hooks, [name, hookedArray]) => {
			if (hookedArray.find((hooked) => hooked.userID === userID)) {
				hooks.push(name);
			}

			return hooks;
		}, []);
	}

	/**
	 * Use hook system as a user from given group. Additional arguments can be
	 * passed to the hooks.
	 *
	 * @param groupID - The group to use hooks with.
	 * @param userID - The user to use hooks with.
	 * @param extraArgs - Any additional arguments to pass to the hooks used.
	 *
	 * @returns `hook`, `unHook`, and `callHook` functions for the group.
	 */
	useHooks<
		TExtraArgs extends unknown[] = never[],
		TExtendedHooks extends ExtendHooks<THooks, TExtraArgs> = ExtendHooks<
			THooks,
			TExtraArgs
		>,
	>(
		groupID: TGroupNames,
		userID: string,
		...extraArgs: TExtraArgs
	): {
		hook: <TName extends THookNames>(
			name: TName,
			hook: TExtendedHooks[TName],
		) => () => void;
		unHook: HookSystem<TExtendedHooks, TGroups, THookNames>["unHook"];
		callHook: HookSystem<THooks, TGroups, THookNames>["callHook"];
	} {
		const group = this.getGroup(groupID);

		return {
			hook: <TName extends THookNames>(
				name: TName,
				hook: TExtendedHooks[TName],
			): (() => void) => {
				if (!canHook(name, group.canHook)) {
					return mockFunction;
				}

				const internalHook = ((...args: Parameters<THooks[TName]>) => {
					return hook(...args, ...extraArgs);
				}) as THooks[TName];

				return this.hook(groupID, userID, name, internalHook, {
					external: hook,
				});
			},
			unHook: (name, hook) => {
				this._hooks[name] = this._hooks[name]?.filter(
					(hooked) => hooked.meta.external !== hook,
				);
			},
			callHook: (name, ...args) => {
				if (!canCall(name, group.canCall)) {
					return new Promise((resolve) => resolve(undefined));
				}

				return this.callHook(name, ...args);
			},
		};
	}
}
