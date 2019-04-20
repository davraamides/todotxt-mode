//'use strict';

import * as vscode from 'vscode';
import * as ToDoCommands from './ToDoCommands';
import ToDoController from './ToDoController';
import ToDoDecorator from './decorators/ToDoDecorator';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	let m = vscode.workspace.getConfiguration().get("todotxtmode.message");

	console.log("message: " + m);
	let toDoDecorator = new ToDoDecorator();
	let toDoController = new ToDoController(toDoDecorator);
	ToDoCommands.ActivateCommands(context);

	// By Default Decorate the document
	toDoDecorator.decorateDocument();
}

// this method is called when your extension is deactivated
export function deactivate() {
}
