import * as vscode from 'vscode';
import * as Commands from './commands';
import Decorator from './decorations';
import { Settings } from './settings';

export function activate(context: vscode.ExtensionContext) {
	console.log(Settings.Message);

	let decorator = new Decorator();
	Commands.ActivateCommands(context);

	vscode.window.onDidChangeTextEditorSelection(editor => {
		decorator.decorateDocument();
	});
	vscode.window.onDidChangeActiveTextEditor(editor => {
		decorator.decorateDocument();
	});

	// decorate initially on activation
	decorator.decorateDocument();
}

export function deactivate() {
}

