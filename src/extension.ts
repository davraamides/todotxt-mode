'use strict';

import * as vscode from 'vscode';

const decorationType = vscode.window.createTextEditorDecorationType({
	color: 'rgb(25, 172, 230)',
})

export function activate(context: vscode.ExtensionContext) {
	vscode.workspace.onWillSaveTextDocument(event => {
		const openEditor = vscode.window.visibleTextEditors.filter(editor => editor.document.uri === event.document.uri)[0]
		decorate(openEditor)
	})

	function decorate(editor: vscode.TextEditor) {
		let text = editor.document.getText()
		let regex = /(\+\w+)/
		let decorationsArray: vscode.DecorationOptions[] = []
		const lines = text.split('\n')
		for (let line = 0; line < lines.length; line++) {
			let match = lines[line].match(regex)
			if (match !== null && match.index !== undefined) {
				let range = new vscode.Range(
					new vscode.Position(line, match.index),
					new vscode.Position(line, match.index + match[1].length)
				)
				let decoration = { range }
				decorationsArray.push(decoration)
			}
		}
		editor.setDecorations(decorationType, decorationsArray)
	}
	let disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
		vscode.window.showInformationMessage('Hello VS Code');
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
