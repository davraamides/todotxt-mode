import * as vscode from 'vscode';

import { Helpers } from './helpers';
import { Settings } from './settings';
//
// Logic to toggle a task completed
//
// Match completed flag, priority and completed date optionally along with rest
// of task. Because this regex is four optional fields (leading space,
// completion flag, completed date and rest of task line) it is guaranteed to
// match any line. (The leading space part, \s*, doesn't need the optional flag,
// ?, because it will match zero or more leading spaces. Thus even if there is
// no leading space, it will return the empty string.)
//
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
                // toggle back to incomplete by leaving off the completed flag and date fields
                newTask = lead + (priority || "") + task;
            } else {
                // toggle to completed by adding in the completed flag and date fields
                let today = Helpers.getDateTimeParts()[0];
                newTask = lead + Settings.CompletedTaskPrefix + (priority || "") + today + ' ' + task;
            }
            // replace the old line with the new, toggled line
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