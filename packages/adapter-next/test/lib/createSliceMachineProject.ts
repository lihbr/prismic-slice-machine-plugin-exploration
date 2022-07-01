import { SliceMachineProject } from "@slicemachine/plugin-kit";

import { MOCK_PROJECT_ROOT } from "./constants";

// TODO: Allow extending the resulting project. For example, support providing
// adapter options.
export const createProject = (): SliceMachineProject => {
	return {
		root: MOCK_PROJECT_ROOT,
		config: {
			_latest: "0.0.0",
			adapter: "@slicemachine/adapter-next",
			apiEndpoint: "https://qwerty.cdn.prismic.io/api/v2",
		},
	};
};
