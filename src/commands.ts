'use strict';
import * as vscode from 'vscode';
import * as path from 'path';
import { Files } from './files';
import { Helpers } from './helpers';
import { Patterns } from './patterns';
import { Settings } from './settings';
import { Sorting } from './sorting';
import * as extension from './extension';
import * as fs from 'fs';

export function ActivateCommands(context: vscode.ExtensionContext) {

    // TODO move the implementation to commands.ts or somewhere else
    let toggleCompletion = vscode.commands.registerCommand('extension.toggleCompletion', () => {
        const editor = vscode.window.activeTextEditor;
        let [startLine, endLine] = Helpers.getSelectedLineRange(false);
        for (var i = startLine; i <= endLine; i++) {
            let text = editor.document.lineAt(i).text;
            if (Helpers.isCompleted(text)) {
                editor.edit(builder => {
                    builder.delete(
                        new vscode.Range(new vscode.Position(i, 0),
                        new vscode.Position(i, Settings.CompletedTagLength))
                    );
                    editor.selection = new vscode.Selection(
                        new vscode.Position(i, Settings.CompletedTagLength + 1), 
                        new vscode.Position(i, Settings.CompletedTagLength + 1)
                    );
                })
            } else {
                editor.edit(builder => {
                    let today = Helpers.getDateTimeParts()[0];
                    builder.insert(new vscode.Position(i, 0), "x " + today + " ");
                })
            }
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
        Files.moveTasks(Settings.WaitingFilename);
    });
    let moveTasksToSomeday = vscode.commands.registerCommand('extension.moveTasksToSomeday', () => {
        Files.moveTasks(Settings.SomedayFilename);
    });
    // TODO move the implementation to commands.ts or somewhere else
    let removePriorities = vscode.commands.registerCommand('extension.removePriorities', () => {
        const editor = vscode.window.activeTextEditor;
        let [startLine, endLine] = Helpers.getSelectedLineRange(true);
        let linesWithPriority:number[] = [];
        for (var i = startLine; i <= endLine; i++) {
            let text = editor.document.lineAt(i).text;
            if (! Helpers.isCompleted(text)) {
                let taskObj = Patterns.parseTask(text);
                if (taskObj[Patterns.PriorityField] != undefined) {
                    linesWithPriority.push(i);
                }
            }
        }
        editor.edit(builder => {
            linesWithPriority.forEach(i => {
                builder.delete(
                    new vscode.Range(new vscode.Position(i, 0),
                    new vscode.Position(i, Settings.PriorityTagLength))
                );
            })
        }).then(() => { });
        Helpers.triggerSelectionChange();
    });

    // TODO move to commands.ts
    let createTaskNote = vscode.commands.registerCommand('extension.createTaskNote', () => {
        const activeEditor = vscode.window.activeTextEditor;
        const selection = activeEditor.selection;
        if (selection.isEmpty) {
            vscode.window.showInformationMessage("No text selected for note");
            return;
        }
        const selectedText = activeEditor.document.getText(selection);
        // move this so only happens if the save below succeeds?
        activeEditor.edit(builder => {
            builder.delete(selection);
        });
 
        let [date, time] = Helpers.getDateTimeParts();
        vscode.window.showInputBox({
            prompt: 'Note file:',
            value: "[Task]-Note-" + date.replace(/-/g, '') + "-" + time.replace(/:/g, '') + ".md",
            valueSelection: [0, 6]
        }).then((noteFile:string) => {
            let folder = path.normalize(path.dirname(vscode.window.activeTextEditor.document.fileName));
            let notePath: string = path.join(folder, noteFile);
            fs.writeFileSync(notePath, selectedText, 'utf8');
            vscode.env.clipboard.writeText("note:" + noteFile);
            vscode.window.showInformationMessage("Paste the new note tag into the appropriate task");
        });
    });
    // TODO finish implementation
    let moveTasksToProject = vscode.commands.registerCommand('extension.moveTasksToProject', () => {
        async function showInputBox() {
            const result = await vscode.window.showInputBox({
                prompt: 'Project file:'
            });
            // vscode.window.showInformationMessage(`Got: ${result}`);
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

    // not working and not sure if it's because settings are const and cached? maybe if I 
    // just make sure they always go back to configuration.get() then I don't even need
    // a "reactivate" function...
    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(e => {
        extension.deactivate();
        for (const sub of context.subscriptions) {
            try {
                sub.dispose();
            } catch (e) {
                console.error(e);
            }
        }
        extension.activate(context);
    }));

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
    context.subscriptions.push(moveTasksToProject);
    context.subscriptions.push(removePriorities);
    context.subscriptions.push(createTaskNote);
}