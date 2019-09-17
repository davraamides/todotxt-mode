import * as vscode from 'vscode';

import { Helpers } from './helpers';
import { Settings } from './settings';

export namespace Completion {

    export function toggleCompletion() {
        const editor = vscode.window.activeTextEditor;
        let [startLine, endLine] = Helpers.getSelectedLineRange(false);
        for (var i = startLine; i <= endLine; i++) {
            let text = editor.document.lineAt(i).text;
            if (Helpers.isCompleted(text)) {
                editor.edit(builder => {
                    builder.delete(
                        new vscode.Range(new vscode.Position(i, 0),
                        new vscode.Position(i, Settings.CompletedTagLength))
                    );
                    editor.selection = new vscode.Selection(
                        new vscode.Position(i, Settings.CompletedTagLength + 1), 
                        new vscode.Position(i, Settings.CompletedTagLength + 1)
                    );
                })
            } else {
                editor.edit(builder => {
                    let today = Helpers.getDateTimeParts()[0];
                    builder.insert(new vscode.Position(i, 0), Settings.CompletedTaskPrefix + today + " ");
                })
            }
        }
        Helpers.triggerSelectionChange();
    }
}