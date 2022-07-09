import {
	SliceMachinePlugin,
	SliceMachinePluginRunner,
	SliceMachineProject,
} from "@slicemachine/plugin-kit";

import { PluginOptions } from "./src";

declare module "vitest" {
	export interface TestContext {
		project: SliceMachineProject & {
			config: {
				adapter: {
					resolve: SliceMachinePlugin;
					options: PluginOptions;
				};
			};
		};
		pluginRunner: SliceMachinePluginRunner;
	}
}
