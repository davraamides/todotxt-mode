import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

import { Helpers } from './helpers';
//
// Manage task notes
//
// This is not really part of the todo.txt spec but the spec does allow for
// extension via tags so this implements a note file for tags with
// 'note:filename'. createTaskNote uses the current selection, saves it in new
// note file (prompting for the filename) and then places the note tag with
// filename in the clipboard so it can be easily copied to the relevant todo
// line.
//
export namespace Note {

    export function createTaskNote() {
        const activeEditor = vscode.window.activeTextEditor;
        const selection = activeEditor.selection;
        if (selection.isEmpty) {
            vscode.window.showInformationMessage("No text selected for note");
            return;
        }
        const selectedText = activeEditor.document.getText(selection);
        // move this so only happens if the save below succeeds?
        activeEditor.edit(builder => {
            builder.delete(selection);
        });
 
        let [date, time] = Helpers.getDateTimeParts();
        vscode.window.showInputBox({
            prompt: 'Note file:',
            value: "[Task]-Note-" + date.replace(/-/g, '') + "-" + time.replace(/:/g, '') + ".md",
            valueSelection: [0, 6]
        }).then((noteFile:string) => {
            let folder = path.normalize(path.dirname(vscode.window.activeTextEditor.document.fileName));
            let notePath: string = path.join(folder, noteFile);
            try {
                fs.writeFileSync(notePath, selectedText, 'utf8');
                vscode.env.clipboard.writeText("note:" + noteFile);
                vscode.window.showInformationMessage("Paste the new note tag into the appropriate task");
            } catch(e) {
                vscode.window.showErrorMessage(`Failed to create note file: ${notePath}`);
            }
        });
    }
}