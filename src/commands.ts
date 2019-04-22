'use strict';
import * as vscode from 'vscode';
import { Utils } from './utils';
import { Files } from './files';

export function ActivateCommands(context: vscode.ExtensionContext) {

    let toggleCompletion = vscode.commands.registerCommand('extension.toggleCompletion', () => {
        // Get the current line and find the first 2 characters
        const editor = vscode.window.activeTextEditor;
        let currLine = editor.selection.start.line;
        let currDoc = editor.document;

        if (currDoc.lineAt(currLine).text.startsWith("x ")) {
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
    });
    let sortByContext = vscode.commands.registerCommand('extension.sortByContext', () => {
        Utils.sortLines("context");
    });
    let sortByPriority = vscode.commands.registerCommand('extension.sortByPriority', () => {
        Utils.sortLines("priority");
    });
    let sortByProject = vscode.commands.registerCommand('extension.sortByProject', () => {
        Utils.sortLines("project");
    });
    let sortByTag = vscode.commands.registerCommand('extension.sortByTag', () => {
        Utils.sortLines("tag");
    });
    let archiveTasks = vscode.commands.registerCommand('extension.archiveTasks', () => {
        Files.archiveTasks();
    });
    let moveTasksToTodo = vscode.commands.registerCommand('extension.moveTasksToTodo', () => {
        Files.moveTasks(Files.TODO_FILENAME);
    });
    let moveTasksToWaiting = vscode.commands.registerCommand('extension.moveTasksToWaiting', () => {
        Files.moveTasks(Files.WAIT_FILENAME);
    });
    let moveTasksToSomeday = vscode.commands.registerCommand('extension.moveTasksToSomeday', () => {
        Files.moveTasks(Files.SOMEDAY_FILENAME);
    });

    // add to list of disposables so they will be cleaned up when deactivated
    context.subscriptions.push(toggleCompletion);
    context.subscriptions.push(sortByContext);
    context.subscriptions.push(sortByPriority);
    context.subscriptions.push(sortByProject);
    context.subscriptions.push(sortByTag);
    context.subscriptions.push(archiveTasks);
    context.subscriptions.push(moveTasksToTodo);
    context.subscriptions.push(moveTasksToWaiting);
    context.subscriptions.push(moveTasksToSomeday);
}