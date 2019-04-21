//'use strict';

import * as vscode from 'vscode';
import * as Commands from './commands';
import Decorator from './decorations';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	let s = vscode.workspace.getConfiguration("todotxtmode").get("message");
	console.log(s);
	//console.log(JSON.stringify(s, null, 2));
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

