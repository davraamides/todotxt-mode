import * as vscode from 'vscode';

export namespace Helpers {

    // trigger redecoration of the document by forcing the selection to change
    export function triggerSelectionChange() {
        // move the current selection to the end and then back to the beginning of the current line
        const editor = vscode.window.activeTextEditor;
        let curLine = editor.selection.start.line;
        let curLineLength = editor.document.lineAt(curLine).text.length;
        editor.selection = new vscode.Selection(new vscode.Position(curLine, curLineLength), new vscode.Position(curLine, curLineLength));
        editor.selection = new vscode.Selection(new vscode.Position(curLine, 0), new vscode.Position(curLine, 0));
    }
}