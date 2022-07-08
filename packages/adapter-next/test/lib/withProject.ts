import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as os from "node:os";
import {
	SliceMachinePlugin,
	SliceMachineProject,
} from "@slicemachine/plugin-kit";

import adapter, { PluginOptions } from "../../src";

type WithProjectSliceMachineProject = SliceMachineProject & {
	config: {
		adapter: {
			resolve: SliceMachinePlugin;
			options: PluginOptions;
		};
	};
};

export const withProject = async (
	fn: (project: WithProjectSliceMachineProject) => void | Promise<void>,
): Promise<void> => {
	const tmpRoot = await fs.mkdtemp(
		path.join(os.tmpdir(), "@slicemachine__adapter-next___"),
	);

	const project: WithProjectSliceMachineProject = {
		root: tmpRoot,
		config: {
			_latest: "0.0.0",
			adapter: {
				resolve: adapter,
				options: {
					format: false,
				},
			},
			apiEndpoint: "https://qwerty.cdn.prismic.io/api/v2",
		},
	};

	try {
		await fn(project);
	} finally {
		await fs.rm(project.root, { recursive: true });
	}
};
