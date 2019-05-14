import * as vscode from 'vscode';
import * as Commands from './commands';

import Decorator from './decorations';
import { Settings } from './settings';
import { Patterns } from './patterns';
import { Helpers } from './helpers';
//import { fstat } from 'fs';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
	let decorator = new Decorator();
	Commands.ActivateCommands(context);

	vscode.window.onDidChangeTextEditorSelection(editor => {
		decorator.decorateDocument();
	});
	vscode.window.onDidChangeActiveTextEditor(editor => {
		decorator.decorateDocument();
	});

	vscode.languages.registerHoverProvider('plaintext', {
		provideHover(document, position, token) {
			const word = document.getText(document.getWordRangeAtPosition(position, Patterns.TagRegex));
			if (Helpers.isNoteTag(word)) {
				let bits = word.split(':');
				let fname = bits[1];
				// looks like in debugger this is undefined and the current working dir is ./out
				// so almost need to check both here
				let path:string;
				if (__dirname.endsWith('/out')) {
					path = __dirname;
				} else {
					path = vscode.workspace.workspaceFolders[0].name;
				}
				// get the first N bytes of the note file? all of it?
				let note = fs.readFileSync(`${path}/${fname}`);
				let message = new vscode.MarkdownString(`[Open note](file://${path}/${fname})\n\n${note}` );
				return new vscode.Hover(message);
			} else {
				return null;
			}
		}
	});
	// decorate initially on activation
	decorator.decorateDocument();
}

export function deactivate() {
}

