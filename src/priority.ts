import * as vscode from 'vscode';

import { Helpers } from './helpers';
import { Patterns } from './patterns';
import { Settings } from './settings';

export namespace Priority {

    export function changePriority(increment: boolean) {
        const editor = vscode.window.activeTextEditor;
        let [startLine, endLine] = Helpers.getSelectedLineRange(false);
        for (var i = startLine; i <= endLine; i++) {
            let text = editor.document.lineAt(i).text;
            let [oldPriority, newPriority] = Helpers.nextPriority(text, increment);
            editor.edit(builder => {
                builder.replace(
                    new vscode.Range(new vscode.Position(i, 0), new vscode.Position(i, oldPriority.length)),
                    newPriority + (oldPriority ? '' : ' ')
                );
            })
        }
        Helpers.triggerSelectionChange();
    }

    export function removePriorities() {
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
    }
}