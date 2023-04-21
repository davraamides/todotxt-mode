// @ts-nocheck
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

import { Helpers } from './helpers';
import { Settings } from './settings';
import { Patterns } from './patterns';
//
// Manage movement of tasks to other task files.
//
export namespace Files {

    // Move any completed tasks to the "done" file
    export function archiveTasks() {
        const editor = vscode.window.activeTextEditor;
        let window = vscode.window;
        let document = editor.document;
        let destinationPathName = path.dirname(document.fileName) + path.sep + Settings.DoneFilename;
        let lineDeletes = [];

        if (window.activeTextEditor != undefined) {
            ensureEndsWithEOL(destinationPathName);
            let lastLine = Helpers.getLastTodoLineInDocument(document);
            for (var i = 0; i <= lastLine; i++) {
                let lineObject = document.lineAt(i);
                if (Helpers.isCompleted(lineObject.text)) {
                    fs.appendFileSync(destinationPathName, lineObject.text + Helpers.EOL());
                    lineDeletes.push(i);
                }
            }
            deleteLines(lineDeletes, editor, document);
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
                let lineObject = currDoc.lineAt(i);
                // NOTE - this should really find the last *task* line in destinationPathName and add the
                // task there (in case there is a -- block), but that's not easy to do directly on
                // an external file - much easier within VS code editor
                fs.appendFileSync(destinationPathName, lineObject.text + Helpers.EOL());
                lineDeletes.push(i);
            }
            deleteLines(lineDeletes, editor, currDoc);
        }
    }

    export async function moveTasksToProject() {
        let folder = path.normalize(path.dirname(vscode.window.activeTextEditor.document.fileName));
        let [startLine, endLine] = Helpers.getSelectedLineRange(false);
        // I don't like the behavior for multiplelines so I'm forcing this just for one line at a time
        // But I will leave the loop here for now until I figure out a better way to handle this
        endLine = startLine;
        for (var i = startLine; i <= endLine; i++) {
            let lineObject = vscode.window.activeTextEditor.document.lineAt(i);
            let taskObj = Patterns.parseTask(lineObject.text);
            if (Helpers.isTodoFile(vscode.window.activeTextEditor.document.fileName)) {
                let projectFilename: string;
                if (taskObj['project'].length > 0) {
                    let filename = taskObj['project'][0].substring(1) + '.md';
                    let filepath: string = path.join(folder, filename);
                    if (fs.existsSync(filepath)) {
                        // exact match, move w/out prompting
                        moveTaskToProjectFile(i, filepath);
                        vscode.window.showInformationMessage(`Moved task to: ${filepath}`);
                        continue;
                    } else {
                        // find any project files with the project name in the filename
                        // showOpenDialog does not highlight selected file on macOS so this
                        // isn't helpful, but maybe it works on Windows or Linux so I will leave it
                        let matches: string[] = [];
                        let project = taskObj['project'][0].substring(1).toLowerCase();
                        for (var file of fs.readdirSync(folder)) {
                            if (file.toLowerCase().includes(project) && file.endsWith('.md')) {
                                matches.push(file);
                            }
                        }
                        if (matches) {
                            // just take the first one
                            projectFilename = matches[0];
                            //console.log(`Found matching project: ${projectFilename}`)
                        }
                    }
                }
                let filepath = await promptForFilename(projectFilename);
                if (filepath) {
                    moveTaskToProjectFile(startLine, filepath);
                    vscode.window.showInformationMessage(`Moved task to: ${filepath}`);
                }
            }
        }

        /*
        Test cases
        - move tasks - should repeat above individually
        - destination file doesn't exist, should create and put tasks section in it
        */
        function moveTaskToProjectFile(taskLine, projectFilepath) {
            let taskDocument = vscode.window.activeTextEditor.document;
            let task = taskDocument.lineAt(taskLine).text;

            //console.log('moveTaskToProject, task: ' + task + ', file: ' + projectFilepath);
            // remove line from currentEditor
            vscode.workspace.openTextDocument(projectFilepath).then((projectDocument) => {
                const options: vscode.TextDocumentShowOptions = {
                    preserveFocus: true,
                    preview: false
                };
                vscode.window.showTextDocument(projectDocument, vscode.ViewColumn.Active, true).then((projectEditor) => {
                    let [beginLine, endLine] = Helpers.getDecoratedLineRange(projectDocument);
                    // add task to project file after endLine
                    projectEditor.edit(builder => {
                        let text = task + Helpers.EOL();
                        if (endLine == -1) {
                            // no task range found, append to end of file with Task header
                            text = '## Tasks' + Helpers.EOL() + text;
                            endLine = projectDocument.lineCount - 1;
                        }
                        const position = new vscode.Position(endLine + 1, 0);
                        builder.insert(position, text);
                    }).then(onfulfilled => {
                        // don't remove the task from the original document unless we successfully added it to the project
                        if (onfulfilled) {
                            // showing the project document closed the original one so re-open it
                            vscode.window.showTextDocument(taskDocument, vscode.ViewColumn.Active, false).then((taskEditor) => {
                                taskEditor.edit(builder => {
                                    builder.delete(taskDocument.lineAt(taskLine).rangeIncludingLineBreak);
                                });
                            });
                        }
                    })
                });
            });
        }

        async function promptForFilename(filename: string) {
            const options: vscode.OpenDialogOptions = {
                // neither approach causes the file to be selected, at least on macOS.
                // this SO question on it is unanswered: https://stackoverflow.com/questions/58000935/how-to-open-folder-picker-dialog-in-vscode-with-a-pre-selected-file
                //defaultUri: vscode.Uri.file(path.join(folder, filename)),
                //defaultUri: vscode.Uri.file(path.join(folder, filename)),
                canSelectMany: false,
                openLabel: 'Open',
                filters: {
                    'Markdown files': ['md'],
                    'Text files': ['txt'],
                    'All files': ['*']
                }
            };

            let selectedFile = await vscode.window.showOpenDialog(options).then(fileUri => {
                if (fileUri && fileUri[0]) {
                    //console.log('Selected file: ' + fileUri[0].fsPath);
                    return fileUri[0].fsPath;
                }
                return null;
            });
            return selectedFile;
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