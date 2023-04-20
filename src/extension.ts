import * as vscode from 'vscode';
import * as Commands from './commands';

import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import {Completion} from './completion';
import Decorator from './decorations';
import {Helpers} from './helpers';
import {Patterns} from './patterns';
import {Settings} from './settings';
//
// Setup and activate the extension
//
export function activate(context: vscode.ExtensionContext) {
	let decorator = new Decorator();
	Commands.ActivateCommands(context);

	vscode.window.onDidChangeTextEditorSelection(editor => {
		decorator.decorateDocument();
	});
	vscode.window.onDidChangeActiveTextEditor(editor => {
		decorator.decorateDocument();
	});

	let disposable: vscode.Disposable;

	// Register a hover provider for the note:xxx tag which reads the
	// note file and displays in a hover message with a link to the file.
	// I've had some issues with note files that are in different paths
	// as the behavior seems to be OS-dependent. Also, note filenames
	// cannot contain spaces since the tag note:xxx is delimited at the
	// end by a space.

	disposable = vscode.languages.registerHoverProvider({scheme: 'file', language: 'plaintext'}, {
		provideHover(document, position, token) {
			const word = document.getText(document.getWordRangeAtPosition(position, Patterns.TagRegex));
            // vscode.window.showInformationMessage(`word: ${word}`);
			if (Helpers.isNoteTag(word)) {
				let bits = word.split(':');
				let fname = bits[1];
				let folder = path.normalize(path.dirname(vscode.window.activeTextEditor.document.fileName));
				// vscode.window.showInformationMessage(`path: ${folder}`);
				try {
					let notePath:string = path.join(folder, fname);
					if (fs.existsSync(notePath)) {
						let note = fs.readFileSync(notePath);
						// this link fails on windows - it probably needs the leading \ but then needs them converted to / or something
						let prefix = 'file://';
						if (os.platform() == 'win32') {
							prefix = 'file:///';
						}
						let encPath = encodeURI(`${prefix}${notePath}`);
						let message = new vscode.MarkdownString(`[Open note](${encPath})\n\n${note}` );
						return new vscode.Hover(message);
					}
				} catch (err) {
					vscode.window.showInformationMessage(`err: ${err}`);
					console.log(err);
				}
			}
			return null;
		}
	});

	context.subscriptions.push(disposable);

	disposable = vscode.workspace.onDidChangeTextDocument(async (event) => {

		const addCreatedAtEnabled = Settings.getSetting<boolean>("addCreatedAt")

		if (!Helpers.isTodoFile(event.document.fileName) || !addCreatedAtEnabled) return;

    const isEnter = event.contentChanges[0]?.text === '\n';

		if (isEnter) await Completion.insertCreatedAt();
  });

	context.subscriptions.push(disposable);


	disposable = vscode.languages.registerHoverProvider({scheme: 'file', language: 'plaintext'}, {
		provideHover(document, position, token) {
			const word = document.getText(document.getWordRangeAtPosition(position, Patterns.ProjectRegex));
            // vscode.window.showInformationMessage(`word: ${word}`);
			let fname = word.substring(1) + '.md';
			let folder = path.normalize(path.dirname(vscode.window.activeTextEditor.document.fileName));
			// vscode.window.showInformationMessage(`path: ${folder}`);
			try {
				let projectPath:string = path.join(folder, fname);
				if (fs.existsSync(projectPath)) {
					let project = fs.readFileSync(projectPath);
					// this link fails on windows - it probably needs the leading \ but then needs them converted to / or something
					let prefix = 'file://';
					if (os.platform() === 'win32') {
						prefix = 'file:///';
					}
					let encPath = encodeURI(`${prefix}${projectPath}`);
					let message = new vscode.MarkdownString(`[Open project](${encPath})\n\n${project}` );
					return new vscode.Hover(message);
				}
			} catch (err) {
				vscode.window.showInformationMessage(`err: ${err}`);
				console.log(err);
			}
			return null;
		}
	});

	context.subscriptions.push(disposable);

	// decorate initially on activation
	decorator.decorateDocument();
}

export function deactivate() {
}

