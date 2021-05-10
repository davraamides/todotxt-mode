import { start } from 'repl';
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
        let linesWithPriorityChange: {line, begin, end, newPriority}[] = [];
        for (var i = startLine; i <= endLine; i++) {
            let text = editor.document.lineAt(i).text;
            let [oldPriority, newPriority] = Helpers.nextPriority(text, increment);
            linesWithPriorityChange.push({
                line: i,
                begin: Math.max(oldPriority.length - 3, 0),
                end: oldPriority.length,
                newPriority: newPriority + (oldPriority ? '' : ' ')
            });
        }
        editor.edit(builder => {
            linesWithPriorityChange.forEach(elt => {
                builder.replace(
                    new vscode.Range(new vscode.Position(elt.line, elt.begin),
                    new vscode.Position(elt.line, elt.end)),
                    elt.newPriority
                );
            })
        }).then(() => { });
        Helpers.triggerSelectionChange();
    }

    export function removePriorities() {
        const editor = vscode.window.activeTextEditor;
        let [startLine, endLine] = Helpers.getSelectedLineRange(true);
        let linesWithPriority: {line, match}[] = [];
        for (var i = startLine; i <= endLine; i++) {
            let text = editor.document.lineAt(i).text;
            if (! Helpers.isCompleted(text)) {
                let match = text.match(Patterns.PriorityWithTrailingSpaceRegex);
                if (match) {
                    linesWithPriority.push({line: i, match: match});
                }
            }
        }
        editor.edit(builder => {
            linesWithPriority.forEach(elt => {
                builder.delete(
                    new vscode.Range(new vscode.Position(elt.line, elt.match.index),
                    new vscode.Position(elt.line, elt.match.index + elt.match[0].length))
                );
            })
        }).then(() => { });
        Helpers.triggerSelectionChange();
    }
}