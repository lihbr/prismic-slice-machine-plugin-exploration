export type { SliceMachinePlugin } from "./sliceMachinePlugin";
export { defineSliceMachinePlugin } from "./sliceMachinePlugin";

export type { SliceMachineAdapter } from "./sliceMachineAdapter";
export { defineSliceMachineAdapter } from "./sliceMachineAdapter";

export type { SliceMachineContext } from "./sliceMachineContext";
export { useSliceMachine } from "./sliceMachineContext";

export type { SliceMachineHooks } from "./sliceMachineHooks";

export {
	// Dir
	existsDir,
	readDir,
	writeDir,
	removeDir,
	useDir,
	// Any file
	existsFile,
	readFile,
	writeFile,
	removeFile,
	useFile,
	// JSON
	existsJSON,
	readJSON,
	writeJSON,
	removeJSON,
	useJSON,
	// Notification
	notify,
	useNotification,
} from "./actions";

/**
 * TODO:
 *
 * - Read hooks need to return value
 * - TypeScript & Runtime validation for hooks depending on if the plugin is an
 *   adapter or not
 */
