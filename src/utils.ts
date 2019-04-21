import * as vscode from 'vscode';
import { isArray } from 'util';
import { Defaults } from './defaults'

export namespace Utils {

    export function sortLines(byField: string) {
        let editor = vscode.window.activeTextEditor;
        let selectionLine = editor.selection.start.line;
        let lineObjects = getLineObjects(editor.document, byField);

        // sort the lines by the values of byField. leave lines without a field
        // in their existing order (i.e. a stable sort)
        lineObjects.sort((obja, objb) => {
            if (obja["value"] > objb["value"]) {
                return 1;
            }
            if (obja["value"] < objb["value"]) {
                return -1;
            }
            // for lines with equal field values, use the line number to make the sort stable
            return obja["line"] - objb["line"];
        })
        let sortedLines: string[] = [];
        for (var i = 0; i < lineObjects.length; i++) {
            sortedLines.push(lineObjects[i]["text"]);
        }
        // replace all the lines in the editor with the new sorted lines
        editor.edit(editBuilder => {
            const range = new vscode.Range(0, 0, sortedLines.length - 1, editor.document.lineAt(sortedLines.length -1).text.length);
            editBuilder.replace(range, sortedLines.join('\n'));
        });
        // this does not alway seem to trigger a redecoration so maybe leave this alone and 
        // just decorate after each sort
        editor.selection = new vscode.Selection(new vscode.Position(selectionLine, 0), new vscode.Position(selectionLine, 0));
    }

    // get the lines of the document as objects with the text, field value and line number
    function getLineObjects(doc: vscode.TextDocument, field: string): object[] {
        var lineObjects: object[] = [];
        let regex = Defaults.FIELD_REGEX_MAP[field];
        let sortCompletedTasksToEnd = vscode.workspace.getConfiguration('todotxtmode').get("sortCompletedTasksToEnd", false);

        for (var i = 0; i < doc.lineCount; i++) {
            let text = doc.lineAt(i).text;
            let value = parseField(text, regex, sortCompletedTasksToEnd);
            lineObjects.push({text: text, value: value, line: i});
        }
        return lineObjects;
    }

    // return the first matching portion of a regex in a line
    function parseField(line: string, regex: RegExp, sortCompletedTasksToEnd: boolean): string {
        if (sortCompletedTasksToEnd && line.startsWith("x ")) {
            // force to very bottom, include date for sorting
            return "z " + line.substr(2, 10);
        }
        let response = line.match(regex);
        if (response != null) {
            return response.pop();
        }
        // force to bottom
        return "y";
    }
};