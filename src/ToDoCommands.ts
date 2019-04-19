'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
//import { TaskUtils } from './utils/TaskUtils';
//import { ToDoSort } from './commands/ToDoSort';
import { ToDoTasks } from './commands/ToDoTasks';


export function ActivateCommands(context: vscode.ExtensionContext) {

    let toggleCompletion = vscode.commands.registerCommand('extension.toggleCompletion', () => {
        ToDoTasks.toggleCompletedTasks();
    });
/*
    let archiveTasks = vscode.commands.registerCommand('extension.archiveTasks', () => {
        ToDoTasks.bulkArchiveTasks();
    });
    let reactivateCompletedTask = vscode.commands.registerCommand('extension.reactivateTask', () => {
        ToDoTasks.reactivateTask();
    });

    let sortByProject = vscode.commands.registerCommand('extension.sortProject', () => {
        ToDoSort.SortLines(ToDoSort.SortType.PROJECT);
    });

    let sortByPriority = vscode.commands.registerCommand('extension.sortPriority', () => {
        ToDoSort.SortLines(ToDoSort.SortType.PRIORITY);
    });

    let sortByDueDate = vscode.commands.registerCommand('extension.sortDueDate', () => {
        ToDoSort.SortLines(ToDoSort.SortType.DUE_DATE);
    });

    let sortByContext = vscode.commands.registerCommand('extension.sortContext', () => {
        ToDoSort.SortLines(ToDoSort.SortType.CONTEXT);
    });
*/
    context.subscriptions.push(toggleCompletion);
//    context.subscriptions.push(archiveTasks);
//    context.subscriptions.push(reactivateCompletedTask);
//    context.subscriptions.push(sortByProject);
//    context.subscriptions.push(sortByPriority);
//    context.subscriptions.push(sortByDueDate);
}