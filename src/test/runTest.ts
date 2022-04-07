import * as path from 'path';

import { runTests } from 'vscode-test';
import { run } from './suite';

async function main() {
	try {
		// The folder containing the Extension Manifest package.json
		// Passed to `--extensionDevelopmentPath`
		// The path to test runner
		// Passed to --extensionTestsPath
		let testOptions = {
			extensionPath: path.resolve(__dirname, '../../'),
			testRunnerPath: path.resolve(__dirname, './suite'),
			testWorkspace: '',
			extensionDevelopmentPath: path.resolve(__dirname, '../'),
			extensionTestsPath: path.resolve(__dirname, './suite/index')
		};
	  
		// Download VS Code, unzip it and run the integration test
		await runTests(testOptions);
	} catch (err) {
		console.error('Failed to run tests');
		process.exit(1);
	}
}

main();
