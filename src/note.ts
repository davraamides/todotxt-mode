import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs/promises';

import { Settings } from './settings';
import { strftime } from './strftime';

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

    export async function createTaskNote(): Promise<void> {
        const activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor) {
            return;
        }
        const selection = activeEditor.selection;
        if (selection.isEmpty) {
            vscode.window.showInformationMessage("No text selected for note");
            return;
        }
        const selectedText = activeEditor.document.getText(selection);

        const noteFilename = strftime(Settings.NoteFilenameFormat(), new Date());
        let selStart = noteFilename.indexOf("[");
        let selEnd = noteFilename.indexOf("]");
        if (selStart === -1 || selEnd === -1) {
            selStart = selEnd = noteFilename.length;
        } else {
            selEnd += 1;
        }

        const noteFile = await vscode.window.showInputBox({
            prompt: 'Note file:',
            value: noteFilename,
            valueSelection: [selStart, selEnd]
        });

        if (!noteFile) {
            return;
        }

        const currentEditor = vscode.window.activeTextEditor;
        if (!currentEditor) {
            return;
        }

        const folder = path.normalize(path.dirname(currentEditor.document.fileName));
        const notePath: string = path.join(folder, noteFile);

        try {
            await fs.writeFile(notePath, selectedText, 'utf8');
            const noteTag = "note:" + noteFile;
            await vscode.env.clipboard.writeText(noteTag);

            if (Settings.ReplaceNoteTextWithNoteTag()) {
                await activeEditor.edit(builder => {
                    builder.replace(selection, noteTag);
                });
            } else {
                await activeEditor.edit(builder => {
                    builder.delete(selection);
                });
                vscode.window.showInformationMessage("Paste the new note tag into the appropriate task");
            }
        } catch (e) {
            vscode.window.showErrorMessage(`Failed to create note file: ${notePath}`);
        }
    }
}
