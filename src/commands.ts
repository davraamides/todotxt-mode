'use strict';
import * as vscode from 'vscode';
import { Files } from './files';
import { Patterns } from './patterns';
import { Priority } from './priority';
import { Settings } from './settings';
import { Sorting } from './sorting';
import { Completion } from './completion';
import { Note } from './note';

//
// Registers all the extension commands
//
export function ActivateCommands(context: vscode.ExtensionContext): void {

    const toggleCompletion = vscode.commands.registerCommand('extension.toggleCompletion', () => {
        Completion.toggleCompletion();
    });
    const sortByContext = vscode.commands.registerCommand('extension.sortByContext', () => {
        Sorting.sortLinesByField("context");
    });
    const sortByPriority = vscode.commands.registerCommand('extension.sortByPriority', () => {
        Sorting.sortLinesByField("priority");
    });
    const sortByProject = vscode.commands.registerCommand('extension.sortByProject', () => {
        Sorting.sortLinesByField("project");
    });
    const sortByTag = vscode.commands.registerCommand('extension.sortByTag', () => {
        Sorting.sortLinesByField("tag");
    });
    const sortByCreationDate = vscode.commands.registerCommand('extension.sortByCreationDate', () => {
        Sorting.sortLinesByField("creationDate");
    });
    const sortByDueDate = vscode.commands.registerCommand('extension.sortByDueDate', () => {
        Sorting.sortLinesByDueDate();
    });
    const formatTasks = vscode.commands.registerCommand('extension.formatTasks', () => {
        Patterns.formatSelectedTasks();
    });
    const archiveTasks = vscode.commands.registerCommand('extension.archiveTasks', () => {
        Files.archiveTasks();
    });
    const moveTasksToTodo = vscode.commands.registerCommand('extension.moveTasksToTodo', () => {
        Files.moveTasks(Settings.TodoFilename());
    });
    const moveTasksToWaiting = vscode.commands.registerCommand('extension.moveTasksToWaiting', () => {
        Files.moveTasks(Settings.WaitingFilename());
    });
    const moveTasksToSomeday = vscode.commands.registerCommand('extension.moveTasksToSomeday', () => {
        Files.moveTasks(Settings.SomedayFilename());
    });
    const moveTasksToProject = vscode.commands.registerCommand('extension.moveTasksToProject', () => {
        Files.moveTasksToProject();
    });
    const incrementPriority = vscode.commands.registerCommand('extension.incrementPriority', () => {
        Priority.changePriority(true);
    });
    const decrementPriority = vscode.commands.registerCommand('extension.decrementPriority', () => {
        Priority.changePriority(false);
    });
    const removePriorities = vscode.commands.registerCommand('extension.removePriorities', () => {
        Priority.removePriorities();
    });
    const createTaskNote = vscode.commands.registerCommand('extension.createTaskNote', () => {
        Note.createTaskNote();
    });

    // Configuration changes are now handled in extension.ts.
    // Most settings work dynamically since they're now functions that read fresh values.
    // Only style-related settings require recreating the Decorator.

    // add to list of disposables so they will be cleaned up when deactivated
    context.subscriptions.push(toggleCompletion);
    context.subscriptions.push(sortByContext);
    context.subscriptions.push(sortByPriority);
    context.subscriptions.push(sortByProject);
    context.subscriptions.push(sortByTag);
    context.subscriptions.push(sortByCreationDate);
    context.subscriptions.push(sortByDueDate);
    context.subscriptions.push(formatTasks);
    context.subscriptions.push(archiveTasks);
    context.subscriptions.push(moveTasksToTodo);
    context.subscriptions.push(moveTasksToWaiting);
    context.subscriptions.push(moveTasksToSomeday);
    context.subscriptions.push(moveTasksToProject);
    context.subscriptions.push(incrementPriority);
    context.subscriptions.push(decrementPriority);
    context.subscriptions.push(removePriorities);
    context.subscriptions.push(createTaskNote);
}
