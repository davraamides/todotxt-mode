import * as vscode from 'vscode';

import { Helpers } from './helpers';
import { Patterns } from './patterns';
import { Settings } from './settings';
//
// Manipulate the priority field
//
export namespace Priority {

    export function changePriority(increment: boolean) {
        const editor = vscode.window.activeTextEditor;
        let [startLine, endLine] = Helpers.getSelectedLineRange(false);
        for (var i = startLine; i <= endLine; i++) {
            let text = editor.document.lineAt(i).text;
            let [oldPriority, newPriority] = Helpers.nextPriority(text, increment);
            editor.edit(builder => {
                builder.replace(
                    new vscode.Range(new vscode.Position(i, Math.max(oldPriority.length - 3, 0)), new vscode.Position(i, oldPriority.length)),
                    newPriority + (oldPriority ? '' : ' ')
                );
            })
        }
        Helpers.triggerSelectionChange();
    }

    export function removePriorities() {
        const editor = vscode.window.activeTextEditor;
        let [startLine, endLine] = Helpers.getSelectedLineRange(true);
        let linesWithPriority: {i, match}[] = [];
        for (var i = startLine; i <= endLine; i++) {
            let text = editor.document.lineAt(i).text;
            if (! Helpers.isCompleted(text)) {
                let match = text.match(Patterns.PriorityWithTrailingSpaceRegex);
                if (match) {
                    linesWithPriority.push({i, match: match});
                }
            }
        }
        editor.edit(builder => {
            linesWithPriority.forEach(elt => {
                builder.delete(
                    new vscode.Range(new vscode.Position(elt.i, elt.match.index),
                    new vscode.Position(elt.i, elt.match.index + elt.match[0].length))
                );
            })
        }).then(() => { });
        Helpers.triggerSelectionChange();
    }
}