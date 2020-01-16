import * as vscode from 'vscode';

import { Helpers } from './helpers';
import { Settings } from './settings';

// match completed, priority and completed date optionally along with rest of task
const TaskCompletionRegEx = /^(\s*)(x )?(\([A-Z]\) )?(\d{4}-\d{2}-\d{2} )?(.*)$/;

export namespace Completion {

    export function toggleCompletion() {
        const editor = vscode.window.activeTextEditor;
        let [startLine, endLine] = Helpers.getSelectedLineRange(false);
        for (var i = startLine; i <= endLine; i++) {
            let text = editor.document.lineAt(i).text;
            var lead, completed, priority, date, task, _t, newTask;
            [_t, lead, completed, priority, date, task] = text.match(TaskCompletionRegEx);
            if (completed) {
                newTask = lead + (priority || "") + task;
            } else {
                let today = Helpers.getDateTimeParts()[0];
                newTask = lead + Settings.CompletedTaskPrefix + (priority || "") + today + ' ' + task;
            }
            editor.edit(builder => {
                builder.replace(
                    new vscode.Range(
                        new vscode.Position(i, 0),
                        new vscode.Position(i, text.length)),
                        newTask);
            });
        }
        Helpers.triggerSelectionChange();
    }
}