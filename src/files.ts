import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

import { Helpers } from './helpers';
import { Settings } from './settings';
import { Patterns, TaskObject } from './patterns';

//
// Manage movement of tasks to other task files.
//
export namespace Files {

    // Move any completed tasks to the "done" file
    export function archiveTasks(): void {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        const document = editor.document;
        const destinationPathName = path.dirname(document.fileName) + path.sep + Settings.DoneFilename();
        const lineDeletes: number[] = [];

        ensureEndsWithEOL(destinationPathName);
        const lastLine = Helpers.getLastTodoLineInDocument(document);
        for (let i = 0; i <= lastLine; i++) {
            const lineObject = document.lineAt(i);
            if (Helpers.isCompleted(lineObject.text)) {
                fs.appendFileSync(destinationPathName, lineObject.text + Helpers.EOL());
                lineDeletes.push(i);
            }
        }
        deleteLines(lineDeletes, editor, document);
    }

    // Move any selected tasks to the destination file. This is similar to archiveTasks above
    // but different in how tasks are selected, thus it requires a separate function
    export function moveTasks(destinationFileName: string): void {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        const currDoc = editor.document;
        const lineDeletes: number[] = [];
        const destinationPathName = path.dirname(currDoc.fileName) + path.sep + destinationFileName;

        ensureEndsWithEOL(destinationPathName);
        const [startLine, endLine] = Helpers.getSelectedLineRange(false);
        for (let i = startLine; i <= endLine; i++) {
            const lineObject = currDoc.lineAt(i);
            // NOTE - this should really find the last *task* line in destinationPathName and add the
            // task there (in case there is a -- block), but that's not easy to do directly on
            // an external file - much easier within VS code editor
            fs.appendFileSync(destinationPathName, lineObject.text + Helpers.EOL());
            lineDeletes.push(i);
        }
        deleteLines(lineDeletes, editor, currDoc);
    }

    export async function moveTasksToProject(): Promise<void> {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        const folder = path.normalize(path.dirname(editor.document.fileName));
        let [startLine, endLine] = Helpers.getSelectedLineRange(false);
        // I don't like the behavior for multiple lines so I'm forcing this just for one line at a time
        // But I will leave the loop here for now until I figure out a better way to handle this
        endLine = startLine;

        for (let i = startLine; i <= endLine; i++) {
            const currentEditor = vscode.window.activeTextEditor;
            if (!currentEditor) {
                return;
            }
            const lineObject = currentEditor.document.lineAt(i);
            const taskObj: TaskObject = Patterns.parseTask(lineObject.text);
            if (Helpers.isTodoFile(currentEditor.document.fileName)) {
                let projectFilename: string | undefined;
                const projectArray = taskObj.project;
                if (projectArray.length > 0) {
                    const filename = projectArray[0].substring(1) + '.md';
                    const filepath: string = path.join(folder, filename);
                    if (fs.existsSync(filepath)) {
                        // exact match, move w/out prompting
                        moveTaskToProjectFile(i, filepath);
                        vscode.window.showInformationMessage(`Moved task to: ${filepath}`);
                        continue;
                    } else {
                        // find any project files with the project name in the filename
                        // showOpenDialog does not highlight selected file on macOS so this
                        // isn't helpful, but maybe it works on Windows or Linux so I will leave it
                        const matches: string[] = [];
                        const project = projectArray[0].substring(1).toLowerCase();
                        for (const file of fs.readdirSync(folder)) {
                            if (file.toLowerCase().includes(project) && file.endsWith('.md')) {
                                matches.push(file);
                            }
                        }
                        if (matches.length > 0) {
                            // just take the first one
                            projectFilename = matches[0];
                        }
                    }
                }
                const filepath = await promptForFilename(projectFilename);
                if (filepath) {
                    moveTaskToProjectFile(startLine, filepath);
                    vscode.window.showInformationMessage(`Moved task to: ${filepath}`);
                }
            }
        }

        function moveTaskToProjectFile(taskLine: number, projectFilepath: string): void {
            const taskEditor = vscode.window.activeTextEditor;
            if (!taskEditor) {
                return;
            }
            const taskDocument = taskEditor.document;
            const task = taskDocument.lineAt(taskLine).text;

            vscode.workspace.openTextDocument(projectFilepath).then((projectDocument) => {
                vscode.window.showTextDocument(projectDocument, vscode.ViewColumn.Active, true).then((projectEditor) => {
                    let [, decoratedEndLine] = Helpers.getDecoratedLineRange(projectDocument);
                    // add task to project file after endLine
                    projectEditor.edit(builder => {
                        let text = task + Helpers.EOL();
                        if (decoratedEndLine === -1) {
                            // no task range found, append to end of file with Task header
                            text = '## Tasks' + Helpers.EOL() + text;
                            decoratedEndLine = projectDocument.lineCount - 1;
                        }
                        const position = new vscode.Position(decoratedEndLine + 1, 0);
                        builder.insert(position, text);
                    }).then(success => {
                        // don't remove the task from the original document unless we successfully added it to the project
                        if (success) {
                            // showing the project document closed the original one so re-open it
                            vscode.window.showTextDocument(taskDocument, vscode.ViewColumn.Active, false).then((reopenedEditor) => {
                                reopenedEditor.edit(builder => {
                                    builder.delete(taskDocument.lineAt(taskLine).rangeIncludingLineBreak);
                                });
                            });
                        }
                    });
                });
            });
        }

        async function promptForFilename(_filename: string | undefined): Promise<string | null> {
            const options: vscode.OpenDialogOptions = {
                canSelectMany: false,
                openLabel: 'Open',
                filters: {
                    'Markdown files': ['md'],
                    'Text files': ['txt'],
                    'All files': ['*']
                }
            };

            const fileUri = await vscode.window.showOpenDialog(options);
            if (fileUri && fileUri[0]) {
                return fileUri[0].fsPath;
            }
            return null;
        }
    }

    // Delete the lines at the specified line numbers. Do so in reverse
    // order as deleting line n will change the line numbers of all lines > n
    function deleteLines(lines: number[], editor: vscode.TextEditor, document: vscode.TextDocument): void {
        if (lines.length > 0) {
            const reversedLines = lines.reverse();
            editor.edit(builder => {
                reversedLines.forEach(lineNum => {
                    builder.delete(document.lineAt(lineNum).rangeIncludingLineBreak);
                });
            }).then(() => { });
        }
        Helpers.triggerSelectionChange();
    }

    // Adds an EOL to a file if missing so that when we add a task
    // it doesn't get appended to the end of an existing task
    function ensureEndsWithEOL(fileName: string): void {
        if (fs.existsSync(fileName)) {
            const text = fs.readFileSync(fileName);
            if (!text.toString().endsWith(Helpers.EOL())) {
                fs.appendFileSync(fileName, Helpers.EOL());
            }
        }
    }
}
