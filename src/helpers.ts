import * as vscode from 'vscode';
import { Settings } from './settings';
import { Patterns } from './patterns';
//
// Useful functions used across the extension
//
export namespace Helpers {
    let setting = new Settings();

    export function EOL() {
        return vscode.window.activeTextEditor.document.eol === vscode.EndOfLine.CRLF ? '\r\n' : '\n';
    }

    // get current date/time as [yyyy-mm-dd, hh:mm:ss] strings
    export function getDateTimeParts(dt: Date = undefined) {
        if (! dt) {
            dt = new Date();
        }
        var [date, time] = new Date(dt.getTime() - (dt.getTimezoneOffset() * 60000)).toISOString().split('T');
        return [date, time.slice(0, 8)];
    }

    // Get the starting and ending lines of the selection. If nothing is selected
    // return either the full line range, if defaultToAll is true, or the line the
    // cursor is on, if defaultToAll is false.
    export function getSelectedLineRange(defaultToAll: boolean): [number, number] {
        let selection = vscode.window.activeTextEditor.selection;
        if (! selection.isEmpty) {
            return [selection.start.line, selection.end.line];
        }
        if (defaultToAll) {
            return [0, getLastTodoLineInDocument(vscode.window.activeTextEditor.document)];
        }
        // selection is empty but defaultToAll is false so just return the current line
        return [selection.start.line, selection.start.line];
    }

    export function isCompleted(text: string): boolean {
        return Patterns.CompletedRegex.test(text);
    }
    export function isDecoratedFile(filename: string): boolean {
        return isTodoFile(filename) || isProjectFile(filename);
    }
    export function isTodoFile(filename: string): boolean {
        if (filename.match(setting.TodoFilePattern) !== null) {
            return true;
        }
    }
    export function isProjectFile(filename: string): boolean {
        if (filename.match(setting.MarkdownFilePattern) !== null && setting.MarkdownDecorationBeginPattern) {
            return true;
        }
    }
    export function isNoteTag(text: string): boolean {
        if (text.match(Patterns.TagRegex)) {
            return text.split(':')[0] === 'note';
        }
        return false;
    }
    export function excludeDecorations(filename: string): boolean {
        return filename.match(setting.ExcludeDecorationsFilePattern) !== null;
    }

    export function getLastTodoLineInDocument(document: vscode.TextDocument): number {
        // if the sectionDelimiterPattern setting has been set, find the first matching line
        //let document = vscode.window.activeTextEditor.document;
        if (setting.SectionDelimiterPattern !== undefined && setting.SectionDelimiterPattern.length > 0) {
            for (var i = 0; i < document.lineCount; i++) {
                if (document.lineAt(i).text.match(setting.SectionDelimiterPattern)) {
                    return i === 0 ? 0 : i - 1; // return the previous line unless the first line has the delimiter
                }
            }
        }
        return document.lineCount - 1;
    }
    export function getDecoratedLineRange(document: vscode.TextDocument): number[] {
        // todo files go from the beginning to the end or the optional section delimiter pattern
        if (document.fileName.match(setting.TodoFilePattern)) {
            return [0, getLastTodoLineInDocument(document)];
        }
        // markdown files go from the beginning to the end of the range patterns, if found
        if (document.fileName.match(setting.MarkdownFilePattern)) {
            let reBeg = RegExp(setting.MarkdownDecorationBeginPattern);
            let reEnd = RegExp(setting.MarkdownDecorationEndPattern);
            let begLine = -1, endLine = -1;

            let i = 0;
            // find the line of the begin pattern
            while (i < document.lineCount) {
                if (reBeg.test(document.lineAt(i).text)) {
                    begLine = i + 1;
                    break;
                }
                i++;
            }
            // continue searching down to find the line of the end pattern
            while (i < document.lineCount) {
                if (reEnd.test(document.lineAt(i).text)) {
                    endLine = i - 1;
                    break;
                }
                i++;
            }
            if (begLine !== -1) {
                if (endLine === -1) {
                    // go to the end of the file if the end pattern was never found
                    endLine = document.lineCount - 1;
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

    // Get the next priorit for this task. The increment arg defines whether it's the
    // next "higher" priority (lower in the alphabet) if true, or "lower" priority 
    // (higher in the alphabet) if false. If there is no priority it always starts at (A).
    export function nextPriority(text: string, increment: boolean): [string, string] {
        const editor = vscode.window.activeTextEditor;
        let oldPriority = '';
        let newPriority = '(A)';
        let priorityChar = '';
        let match = text.match(Patterns.PriorityWithLeadingSpaceRegex);
        if (match) {
            oldPriority = match[0];
            priorityChar = oldPriority[oldPriority.length - 2]; // since there could be leading space
            if (priorityChar === 'A' && increment) {
                priorityChar = 'Z';
            } else if (priorityChar === 'Z' && ! increment) {
                priorityChar = 'A';
            } else {
                priorityChar = String.fromCharCode(priorityChar.charCodeAt(0) + (increment ? -1 : 1));
            }
            newPriority = '(' + priorityChar + ')';
        }
        return [oldPriority, newPriority];
    }
}