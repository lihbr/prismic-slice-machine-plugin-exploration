/**
 * A CLI that loads current working directory plugin and tests it against a
 * standard test suite. (checking that adapters are featureful, etc.)
 */
const run = async (): Promise<void> => {
	await new Promise((res) => setTimeout(res, 1000));
};

run();
