import { SliceMachineProject } from "@slicemachine/plugin-kit";

import { MOCK_PROJECT_ROOT } from "./constants";

import adapter from "../../src";

// TODO: Allow extending the resulting project. For example, support providing
// adapter options.
export const createProject = (): SliceMachineProject => {
	return {
		root: MOCK_PROJECT_ROOT,
		config: {
			_latest: "0.0.0",
			adapter,
			apiEndpoint: "https://qwerty.cdn.prismic.io/api/v2",
		},
	};
};
