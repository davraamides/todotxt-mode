import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Extension Activation Test Suite', () => {
    test('Extension should be present', () => {
        const extension = vscode.extensions.getExtension('davraamides.todotxt-mode');
        assert.ok(extension, 'Extension should be found');
    });

    test('Extension should activate', async () => {
        const extension = vscode.extensions.getExtension('davraamides.todotxt-mode');
        if (extension) {
            await extension.activate();
            assert.ok(extension.isActive, 'Extension should be active');
        }
    });

    test('Commands should be registered', async () => {
        const commands = await vscode.commands.getCommands(true);

        const expectedCommands = [
            'extension.toggleCompletion',
            'extension.sortByContext',
            'extension.sortByPriority',
            'extension.sortByProject',
            'extension.sortByTag',
            'extension.sortByCreationDate',
            'extension.sortByDueDate',
            'extension.formatTasks',
            'extension.archiveTasks',
            'extension.moveTasksToTodo',
            'extension.moveTasksToWaiting',
            'extension.moveTasksToSomeday',
            'extension.moveTasksToProject',
            'extension.createTaskNote',
            'extension.incrementPriority',
            'extension.decrementPriority',
            'extension.removePriorities',
        ];

        for (const cmd of expectedCommands) {
            assert.ok(
                commands.includes(cmd),
                `Command ${cmd} should be registered`
            );
        }
    });
});
