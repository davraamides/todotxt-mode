import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
//import AppConstants from '../utils/AppConstants';
import { TaskUtils } from '../utils/TaskUtils';
//import { ToDoSort } from '../commands/TodoSort';

export namespace ToDoTasks {

    export function toggleCompletedTasks() {
        // Get the current line and find the first 2 characters
        const editor = vscode.window.activeTextEditor;
        let currLine = editor.selection.start.line;
        let currDoc = editor.document;

        if (TaskUtils.isTaskComplete(currDoc.lineAt(currLine).text)) {
            editor.edit(builder => {
                builder.delete(new vscode.Range(new vscode.Position(currLine, 0), new vscode.Position(currLine, 13)));
                editor.selection = new vscode.Selection(new vscode.Position(currLine, 14), new vscode.Position(currLine, 14));
            })
        } else {
            editor.edit(builder => {
                let today = new Date().toJSON().slice(0, 10);
                builder.insert(new vscode.Position(currLine, 0), "x " + today + " ");
            })
        }
        editor.selection = new vscode.Selection(new vscode.Position(currLine, 0), new vscode.Position(currLine, 0));
    }
/*
    export function bulkArchiveTasks() {

        const editor = vscode.window.activeTextEditor;
        let window = vscode.window;
        let currDoc = editor.document;
        let destinationFileName = path.dirname(currDoc.fileName) + path.sep + AppConstants.ARCHIVE_FILENAME;
        let lineDeletes = [];

        if (path.basename(currDoc.fileName) != AppConstants.TODO_FILENAME) {
            vscode.window.showInformationMessage("Archive only available for the " + AppConstants.TODO_FILENAME + " file");
            return;
        }

        if (window.activeTextEditor != undefined) {

            // Only Decorate Document if it's in the classic filenaming convention
            let fileName = path.basename(window.activeTextEditor.document.fileName);
            let eol = TaskUtils.determineEOL(vscode.window.activeTextEditor.document.eol);

            let totalLines = window.activeTextEditor.document.lineCount;
            for (var i = 0; i <= totalLines - 1; i++) {
                let lineObject = window.activeTextEditor.document.lineAt(i);

                if (TaskUtils.isTaskComplete(currDoc.lineAt(i).text)) {
                    fs.appendFileSync(destinationFileName, lineObject.text + eol);
                    lineDeletes.push(i);
                }
            }

            TaskUtils.deleteLines(lineDeletes, editor, currDoc);
            editor.selection = new vscode.Selection(new vscode.Position(0, 0), new vscode.Position(0, 0));
        }
    }

    export function reactivateTask() {
        const editor = vscode.window.activeTextEditor;
        let currLine = editor.selection.start.line;
        let currDoc = editor.document;

        if (path.basename(currDoc.fileName) != AppConstants.ARCHIVE_FILENAME) {
            vscode.window.showInformationMessage("Reactivate only available for the " + AppConstants.ARCHIVE_FILENAME + " file");
            return;
        }

        // Migrate the task to the main file
        let destinationFileName = path.dirname(currDoc.fileName) + path.sep + AppConstants.TODO_FILENAME;
        let lineObject = editor.document.lineAt(currLine);
        let eol = TaskUtils.determineEOL(vscode.window.activeTextEditor.document.eol);
        let lineText = lineObject.text;
        if (lineText.substring(0, 2).toLowerCase() == 'x ') {
            lineText = lineText.substring(2);
        }
        fs.appendFileSync(destinationFileName, eol + lineText + eol);
        let lineDeletes = [currLine];
        TaskUtils.deleteLines(lineDeletes, editor, currDoc);
    }
*/
}