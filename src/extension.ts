import * as vscode from 'vscode';
import * as Commands from './commands';

import Decorator from './decorations';
import { Settings } from './settings';
import { Patterns } from './patterns';
import { Helpers } from './helpers';
//import { fstat } from 'fs';
import * as fs from 'fs';
import * as path from 'path';

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
            //vscode.window.showInformationMessage(`word: ${word}`);
			if (Helpers.isNoteTag(word)) {
				let bits = word.split(':');
				let fname = bits[1];
				let folder = path.dirname(vscode.window.activeTextEditor.document.uri.path);
				//vscode.window.showInformationMessage(`path: ${folder}`);
				try {
					let note = fs.readFileSync(`${folder}/${fname}`);
					let message = new vscode.MarkdownString(`[Open note](file://${folder}/${fname})\n\n${note}` );
					return new vscode.Hover(message);
				} catch (err) {
					//vscode.window.showInformationMessage(`err: ${err}`);
					console.log(err);					
				}
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

