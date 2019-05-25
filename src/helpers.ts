import * as vscode from 'vscode';
import { Settings } from './settings';
import { Patterns } from './patterns';

export namespace Helpers {

    export const EOL = vscode.window.activeTextEditor.document.eol == vscode.EndOfLine.CRLF ? '\r\n' : '\n';

    // get currente date/time as [yyyy-mm-dd, hh:mm:ss] strings
    export function getDateTimeParts(dt: Date = undefined) {
        if (! dt) {
            dt = new Date();
        }
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
            return [0, getLastTodoLineInDocument()];
        }
        // selection is empty but defaultToAll is false so just return the current line
        return [selection.start.line, selection.start.line];
    }

    export function isCompleted(text: string): boolean {
        return text.startsWith(Settings.CompletedTaskPrefix);
    }
    export function isDecoratedFile(filename: string): boolean {
        if (filename.match(Settings.TodoFilePattern) != null) {
            return true;
        }
        if (filename.match(Settings.MarkdownFilePattern) != null && Settings.MarkdownDecorationBeginPattern) {
                return true
        }
        return false;
    }
    export function isNoteTag(text: string): boolean {
        if (text.match(Patterns.TagRegex)) {
            return text.split(':')[0] == 'note';
        }
        return false;
    }
    export function excludeDecorations(filename: string): boolean {
        return filename.match(Settings.ExcludeDecorationsFilePattern) != null;
    }

    export function getLastTodoLineInDocument(): number {
        // if the sectionDelimiterPattern setting has been set, find the first matching line
        let document = vscode.window.activeTextEditor.document;
        if (Settings.SectionDelimiterPattern != undefined && Settings.SectionDelimiterPattern.length > 0) {
            for (var i = 0; i < document.lineCount; i++) {
                if (document.lineAt(i).text.match(Settings.SectionDelimiterPattern)) {
                    return i == 0 ? 0 : i - 1; // return the previous line unless the first line has the delimiter
                }
            }
        }
        return document.lineCount - 1;
    }
    export function getDecoratedLineRange(filename: string): number[] {
        // todo files go from the beginning to the end or the optional section delimiter pattern
        if (filename.match(Settings.TodoFilePattern)) {
            return [0, getLastTodoLineInDocument()];
        }
        // markdown files go from the beginning to the end of the range patterns, if found
        if (filename.match(Settings.MarkdownFilePattern)) {
            let editor = vscode.window.activeTextEditor;
            let reBeg = RegExp(Settings.MarkdownDecorationBeginPattern);
            let reEnd = RegExp(Settings.MarkdownDecorationEndPattern);
            let begLine = -1, endLine = -1;

            let i = 0;
            // find the line of the begin pattern
            while (i < editor.document.lineCount) {
                if (reBeg.test(editor.document.lineAt(i).text)) {
                    begLine = i + 1;
                    break;
                }
                i++;
            }
            // continue searching down to find the line of the end pattern
            while (i < editor.document.lineCount) {
                if (reEnd.test(editor.document.lineAt(i).text)) {
                    endLine = i - 1;
                    break;
                }
                i++;
            }
            if (begLine != -1) {
                if (endLine == -1) {
                    // go to the end of the file if the end pattern was never found
                    endLine = editor.document.lineCount - 1;
                }
                return [begLine, endLine];
            }
        }
        return [0, -1]; // invalid range so no lines are decorated
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