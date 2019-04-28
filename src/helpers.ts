import * as vscode from 'vscode';

export namespace Helpers {

    // get currente date/time as [yyyy-mm-dd, hh:mm:ss] strings
    export function getDateTimeParts() {
        var dt = new Date();
        var [date, time] = new Date(dt.getTime() - (dt.getTimezoneOffset() * 60000)).toISOString().split('T');
        return [date, time.slice(0, 8)];
    }

    // get the starting and ending lines of the selection
    // if nothing is selected return either the full line range, if defaultToAll is true,
    // or the line the cursor is on, if defaultToAll is false
    export function getSelectedLineRange(defaultToAll: boolean): [number, number] {
        let selection = vscode.window.activeTextEditor.selection;
        if (! selection.isEmpty) {
            return [selection.start.line, selection.end.line];
        }
        if (defaultToAll) {
            return [0, vscode.window.activeTextEditor.document.lineCount - 1];
        }
        return [selection.start.line, selection.start.line];
    }

    export function isCompleted(text: string): boolean {
        return text.startsWith("x ");        
    }

    export function isTodoTypeFile(filename: string): boolean {
        return filename.endsWith(".txt");
    }

    // trigger redecoration of the document by forcing the selection to change
    export function triggerSelectionChange() {
        // move the current selection to the end and then back to the beginning of the current line
        const editor = vscode.window.activeTextEditor;
        let curLine = editor.selection.start.line;
        let curLineLength = editor.document.lineAt(curLine).text.length;
        editor.selection = new vscode.Selection(new vscode.Position(curLine, curLineLength), new vscode.Position(curLine, curLineLength));
        editor.selection = new vscode.Selection(new vscode.Position(curLine, 0), new vscode.Position(curLine, 0));
    }
}