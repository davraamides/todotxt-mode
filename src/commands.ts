'use strict';
import * as vscode from 'vscode';
import { Files } from './files';
import { Helpers } from './helpers';
import { Patterns } from './patterns';
import { Settings } from './settings';
import { Sorting } from './sorting';

function getTaskAtSelection() : [number, string] {
    const editor = vscode.window.activeTextEditor;
    let currLine = editor.selection.start.line;
    let currDoc = editor.document;
    return [currLine, currDoc.lineAt(currLine).text];
}
export function ActivateCommands(context: vscode.ExtensionContext) {

    let toggleCompletion = vscode.commands.registerCommand('extension.toggleCompletion', () => {
        // Get the current line and find the first 2 characters
        const editor = vscode.window.activeTextEditor;
        let [currLine, text] = getTaskAtSelection();

        if (text.startsWith("x ")) {
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
        Helpers.triggerSelectionChange();
    });
    let sortByContext = vscode.commands.registerCommand('extension.sortByContext', () => {
        Sorting.sortLinesByField("context");
    });
    let sortByPriority = vscode.commands.registerCommand('extension.sortByPriority', () => {
        Sorting.sortLinesByField("priority");
    });
    let sortByProject = vscode.commands.registerCommand('extension.sortByProject', () => {
        Sorting.sortLinesByField("project");
    });
    let sortByTag = vscode.commands.registerCommand('extension.sortByTag', () => {
        Sorting.sortLinesByField("tag");
    });
    let sortByDueDate = vscode.commands.registerCommand('extension.sortByDueDate', () => {
        Sorting.sortLinesByTagValue("due");
    });
    let formatTasks = vscode.commands.registerCommand('extension.formatTasks', () => {
        Patterns.formatSelectedTasks();
    });
    let archiveTasks = vscode.commands.registerCommand('extension.archiveTasks', () => {
        Files.archiveTasks();
    });
    let moveTasksToTodo = vscode.commands.registerCommand('extension.moveTasksToTodo', () => {
        Files.moveTasks(Settings.TodoFilename);
    });
    let moveTasksToWaiting = vscode.commands.registerCommand('extension.moveTasksToWaiting', () => {
        Files.moveTasks(Settings.WaitFilename);
    });
    let moveTasksToSomeday = vscode.commands.registerCommand('extension.moveTasksToSomeday', () => {
        Files.moveTasks(Settings.SomedayFilename);
    });
    let moveTasksToProject = vscode.commands.registerCommand('extension.moveTasksToProject', () => {
        async function showInputBox() {
            const result = await vscode.window.showInputBox({
                prompt: 'Project file:'
            });
            vscode.window.showInformationMessage(`Got: ${result}`);
        }
        showInputBox();

        const options: vscode.OpenDialogOptions = {
            canSelectMany: false,
            openLabel: 'Open',
            filters: {
                'Markdown files': ['md'],
                'Text files': ['txt'],
                'All files': ['*']
            }
        };

        vscode.window.showOpenDialog(options).then(fileUri => {
            if (fileUri && fileUri[0]) {
                console.log('Selected file: ' + fileUri[0].fsPath);
            }
        });
    });
    vscode.languages.registerHoverProvider('typescript', {
        provideHover(doc: vscode.TextDocument) {
            return new vscode.Hover('For *all* TypeScript documents.');
        }
    });


    // add to list of disposables so they will be cleaned up when deactivated
    context.subscriptions.push(toggleCompletion);
    context.subscriptions.push(sortByContext);
    context.subscriptions.push(sortByPriority);
    context.subscriptions.push(sortByProject);
    context.subscriptions.push(sortByTag);
    context.subscriptions.push(sortByDueDate);
    context.subscriptions.push(formatTasks);
    context.subscriptions.push(archiveTasks);
    context.subscriptions.push(moveTasksToTodo);
    context.subscriptions.push(moveTasksToWaiting);
    context.subscriptions.push(moveTasksToSomeday);
}