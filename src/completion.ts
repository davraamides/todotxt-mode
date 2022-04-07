import * as vscode from 'vscode';

import { Helpers } from './helpers';
import { Settings } from './settings';
//
// Logic to toggle a task completed
//
// Match completed flag, priority and completed date optionally along with rest
// of task. Because this regex is mad of all optional fields (leading space, completed flag,
// priority, completed date, creation date and rest of task line) it is guaranteed to
// match any line. (The leading space part, \s*, doesn't need the optional flag,
// ?, because it will match zero or more leading spaces. Thus even if there is
// no leading space, it will return the empty string.)
//
const TaskCompletionRegEx = /^(\s*)(x )?(\([A-Z]\) )?(\d{4}-\d{2}-\d{2} )?(\d{4}-\d{2}-\d{2} )?(.*)$/;

export namespace Completion {
    let setting = new Settings();

    export function toggleCompletion() {
        const editor = vscode.window.activeTextEditor;
        let [startLine, endLine] = Helpers.getSelectedLineRange(false);
        let linesToToggleCompletion: {line, begin, end, newTask}[] = [];
        for (var i = startLine; i <= endLine; i++) {
            let text = editor.document.lineAt(i).text;
            var lead, completed, priority, completionDate, creationDate, task, _t, newTask;
            [_t, lead, completed, priority, completionDate, creationDate, task] = text.match(TaskCompletionRegEx);
            // regex with one date will match the completionDate first regardless so need to fix that here
            if (!completed && completionDate && !creationDate) {
                creationDate = completionDate;
                completionDate = undefined;
            }
            if (completed) {
                // toggle back to incomplete by leaving off the completed flag and date fields
                newTask = lead + (priority || "") + (creationDate || "") + task;
            } else {
                // toggle to completed by adding in the completed flag and date fields
                let today = Helpers.getDateTimeParts()[0];
                if (setting.RemovePriorityFromCompletedTasks) {
                    // NOTE if I wanted to preserve the priority like they suggest in the spec,
                    // I could do this, but don't love it
                    // if (priority) {
                    //     task += " pri:" + priority[1];
                    // }
                    priority = "";
                }
                newTask = lead + setting.CompletedTaskPrefix + (priority || "") + today + ' ' + (creationDate || "") + task;
            }
            linesToToggleCompletion.push({
                line: i,
                begin: 0,
                end: text.length,
                newTask: newTask
            });
        }
        editor.edit(builder => {
            linesToToggleCompletion.forEach(elt => {
                builder.replace(
                    new vscode.Range(new vscode.Position(elt.line, elt.begin),
                    new vscode.Position(elt.line, elt.end)),
                    elt.newTask
                );
            })
        }).then(() => { });

        Helpers.triggerSelectionChange();
    }
}