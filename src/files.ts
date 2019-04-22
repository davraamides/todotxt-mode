import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export namespace Files {

    // move to configuration
    export const TODO_FILENAME = 'todo.txt'
    export const DONE_FILENAME = 'done.txt'
    export const SOMEDAY_FILENAME = 'incubate.txt'
    export const WAIT_FILENAME = 'waiting.txt'

    export function archiveTasks() {

        const editor = vscode.window.activeTextEditor;
        let window = vscode.window;
        let currDoc = editor.document;
        let destinationFileName = path.dirname(currDoc.fileName) + path.sep + DONE_FILENAME;
        let lineDeletes = [];

        if (path.basename(currDoc.fileName) != TODO_FILENAME) {
            vscode.window.showInformationMessage("Archive only available for the " + TODO_FILENAME + " file");
            return;
        }

        if (window.activeTextEditor != undefined) {
            let fileName = path.basename(window.activeTextEditor.document.fileName);
            let eol = vscode.window.activeTextEditor.document.eol == vscode.EndOfLine.CRLF ? '\r\n' : '\n';
            let totalLines = window.activeTextEditor.document.lineCount;
            for (var i = 0; i <= totalLines - 1; i++) {
                let lineObject = window.activeTextEditor.document.lineAt(i);
                if (currDoc.lineAt(i).text.startsWith("x ")) {
                    fs.appendFileSync(destinationFileName, lineObject.text + eol);
                    lineDeletes.push(i);
                }
            }
            deleteLines(lineDeletes, editor, currDoc);
            editor.selection = new vscode.Selection(new vscode.Position(0, 0), new vscode.Position(0, 0));
        }
    }
    export function moveTasks(destinationFileName: string) {
        const editor = vscode.window.activeTextEditor;
        let window = vscode.window;
        let currDoc = editor.document;
        let lineDeletes = [];

        if (window.activeTextEditor != undefined) {
            let fileName = path.basename(window.activeTextEditor.document.fileName);
            let eol = vscode.window.activeTextEditor.document.eol == vscode.EndOfLine.CRLF ? '\r\n' : '\n';
            for (var i = editor.selection.start.line; i <= editor.selection.end.line; i++) {
                let lineObject = window.activeTextEditor.document.lineAt(i);
                fs.appendFileSync(destinationFileName, lineObject.text + eol);
                lineDeletes.push(i);
            }
            deleteLines(lineDeletes, editor, currDoc);
            editor.selection = new vscode.Selection(new vscode.Position(0, 0), new vscode.Position(0, 0));
        }
    }

    function deleteLines(lines: Number[], editor: vscode.TextEditor, document: vscode.TextDocument) {
        if (lines.length > 0) {
            lines = lines.reverse();
            editor.edit(builder => {
                lines.forEach(a => {
                    builder.delete(document.lineAt(a.valueOf()).rangeIncludingLineBreak);
                })
            }).then(() => { });
        }
    }
};