'use strict';
import * as vscode from 'vscode';
import { Files } from './files';
import { Patterns } from './patterns';
import { Priority } from './priority';
import { Settings } from './settings';
import { Sorting } from './sorting';
import { Completion } from './completion';
import { Note } from './note';

// Command definition type
interface CommandDefinition {
    name: string;
    handler: () => void | Promise<void>;
}

//
// Registers all the extension commands
//
export function ActivateCommands(context: vscode.ExtensionContext): void {
    // Define all commands in a single array for cleaner registration
    const commands: CommandDefinition[] = [
        // Completion
        { name: 'toggleCompletion', handler: () => Completion.toggleCompletion() },

        // Sorting
        { name: 'sortByContext', handler: () => Sorting.sortLinesByField("context") },
        { name: 'sortByPriority', handler: () => Sorting.sortLinesByField("priority") },
        { name: 'sortByProject', handler: () => Sorting.sortLinesByField("project") },
        { name: 'sortByTag', handler: () => Sorting.sortLinesByField("tag") },
        { name: 'sortByCreationDate', handler: () => Sorting.sortLinesByField("creationDate") },
        { name: 'sortByDueDate', handler: () => Sorting.sortLinesByDueDate() },

        // Formatting
        { name: 'formatTasks', handler: () => Patterns.formatSelectedTasks() },

        // File operations (async)
        { name: 'archiveTasks', handler: async () => Files.archiveTasks() },
        { name: 'moveTasksToTodo', handler: async () => Files.moveTasks(Settings.TodoFilename()) },
        { name: 'moveTasksToWaiting', handler: async () => Files.moveTasks(Settings.WaitingFilename()) },
        { name: 'moveTasksToSomeday', handler: async () => Files.moveTasks(Settings.SomedayFilename()) },
        { name: 'moveTasksToProject', handler: async () => Files.moveTasksToProject() },

        // Priority
        { name: 'incrementPriority', handler: () => Priority.changePriority(true) },
        { name: 'decrementPriority', handler: () => Priority.changePriority(false) },
        { name: 'removePriorities', handler: () => Priority.removePriorities() },

        // Notes
        { name: 'createTaskNote', handler: async () => Note.createTaskNote() },
    ];

    // Register all commands
    for (const cmd of commands) {
        const disposable = vscode.commands.registerCommand(`extension.${cmd.name}`, cmd.handler);
        context.subscriptions.push(disposable);
    }
}
