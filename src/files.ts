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

            // Only Decorate Document if it's in the classic filenaming convention
            let fileName = path.basename(window.activeTextEditor.document.fileName);
            //let eol = TaskUtils.determineEOL(vscode.window.activeTextEditor.document.eol);
            let eol = vscode.window.activeTextEditor.document.eol;

            let totalLines = window.activeTextEditor.document.lineCount;
            for (var i = 0; i <= totalLines - 1; i++) {
                let lineObject = window.activeTextEditor.document.lineAt(i);

                if (currDoc.lineAt(i).text.endsWith("x ")) {
                    //fs.appendFileSync(destinationFileName, lineObject.text + eol);
                    lineDeletes.push(i);
                }
            }

            //TaskUtils.deleteLines(lineDeletes, editor, currDoc);
            editor.selection = new vscode.Selection(new vscode.Position(0, 0), new vscode.Position(0, 0));
        }
    }
    export function moveTasks(destinationFileName: string) {

        const editor = vscode.window.activeTextEditor;
        let window = vscode.window;
        let currDoc = editor.document;
        //let destinationFileName = path.dirname(currDoc.fileName) + path.sep + DONE_FILENAME;
        let lineDeletes = [];

        if (window.activeTextEditor != undefined) {
            let fileName = path.basename(window.activeTextEditor.document.fileName);
            //let eol = TaskUtils.determineEOL(vscode.window.activeTextEditor.document.eol);
            let eol = vscode.window.activeTextEditor.document.eol;

            for (var i = editor.selection.start.line; i <= editor.selection.end.line; i++) {
                let lineObject = window.activeTextEditor.document.lineAt(i);
                //create file if doesn't exist and pop info message
                //fs.appendFileSync(destinationFileName, lineObject.text + eol);
                lineDeletes.push(i);
            }

            //TaskUtils.deleteLines(lineDeletes, editor, currDoc);
            editor.selection = new vscode.Selection(new vscode.Position(0, 0), new vscode.Position(0, 0));
        }
    }

};