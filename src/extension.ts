//'use strict';

import * as vscode from 'vscode';
import * as Commands from './commands';
import Decorator from './decorations';
import { Settings } from './settings';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
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

	// By Default Decorate the document
	decorator.decorateDocument();
}

// this method is called when your extension is deactivated
export function deactivate() {
}

