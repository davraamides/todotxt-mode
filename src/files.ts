import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

import { Helpers } from './helpers';
import { Settings } from './settings';
//
// Manage movement of tasks to other task files.
//
export namespace Files {

    // Move any completed tasks to the "done" file
    export function archiveTasks() {
        const editor = vscode.window.activeTextEditor;
        let window = vscode.window;
        let currDoc = editor.document;
        let destinationPathName = path.dirname(currDoc.fileName) + path.sep + Settings.DoneFilename;
        let lineDeletes = [];

        if (window.activeTextEditor != undefined) {
            ensureEndsWithEOL(destinationPathName);
            let lastLine = Helpers.getLastTodoLineInDocument();
            for (var i = 0; i <= lastLine; i++) {
                let lineObject = window.activeTextEditor.document.lineAt(i);
                if (Helpers.isCompleted(currDoc.lineAt(i).text)) {
                    fs.appendFileSync(destinationPathName, lineObject.text + Helpers.EOL());
                    lineDeletes.push(i);
                }
            }
            deleteLines(lineDeletes, editor, currDoc);
        }
    }

    // Move any selected tasks to the destination file. This is similar to archiveTasks above
    // but different in how tasks are selected, thus it requires a separate function
    export function moveTasks(destinationFileName: string) {
        const editor = vscode.window.activeTextEditor;
        let window = vscode.window;
        let currDoc = editor.document;
        let lineDeletes = [];
        let destinationPathName = path.dirname(currDoc.fileName) + path.sep + destinationFileName;

        if (window.activeTextEditor != undefined) {
            ensureEndsWithEOL(destinationPathName);
            let [startLine, endLine] = Helpers.getSelectedLineRange(false);
            for (var i = startLine; i <= endLine; i++) {
                let lineObject = window.activeTextEditor.document.lineAt(i);
                fs.appendFileSync(destinationPathName, lineObject.text + Helpers.EOL());
                lineDeletes.push(i);
            }
            deleteLines(lineDeletes, editor, currDoc);
        }
    }

    // Delete the lines at the specified line numbers. Do so in reverse
    // order as deleting line n will change the line numbers of all lines > n
    function deleteLines(lines: Number[], editor: vscode.TextEditor, document: vscode.TextDocument) {
        if (lines.length > 0) {
            lines = lines.reverse();
            editor.edit(builder => {
                lines.forEach(a => {
                    builder.delete(document.lineAt(a.valueOf()).rangeIncludingLineBreak);
                })
            }).then(() => { });
        }
        Helpers.triggerSelectionChange();
    }

    // Adds an EOL to a file if missing so that when we add a task
    // it doesn't get appended to the end of an existing task
    function ensureEndsWithEOL(fileName: string) {
        if (fs.existsSync(fileName)) {
            let text = fs.readFileSync(fileName);
            if (!text.toString().endsWith(Helpers.EOL())) {
                fs.appendFileSync(fileName, Helpers.EOL());
            }
        }
    }
};