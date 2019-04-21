//'use strict';

import * as vscode from 'vscode';
import * as ToDoCommands from './ToDoCommands';
import Decorator from './decorations';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	let m = vscode.workspace.getConfiguration().get("todotxtmode.message");

	console.log("message: " + m);
	let decorator = new Decorator();
	ToDoCommands.ActivateCommands(context);

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

