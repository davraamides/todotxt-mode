import * as vscode from 'vscode';
import { isArray } from 'util';
import { Defaults } from './defaults'

export namespace Utils {

    function getFieldFromLine(regex: RegExp, line: vscode.TextLine) {
        let result: RegExpExecArray = regex.exec(line.text);
        if (result) {
            return result.groups[1];
        }
        return undefined;
    }

    export function sortLines(byField: string) {
        console.log("sorting by " + byField);
        // get lines into array of strings
        // parse out sort key into leading value of array of tuples
        // sort list
        // replace entire buffer
        //slines = sorted([(get(l), l) for l in lines])
        //lines = [_[1] for _ in slines]
        let editor = vscode.window.activeTextEditor;
        let selectionLine = editor.selection.start.line;
        let lineObjects = getLineObjects(editor.document, byField);
        for (var i = 0; i < lineObjects.length; i++) {
            console.log(lineObjects[i]["value"] + ":" + lineObjects[i]["line"] + ":" + lineObjects[i]["text"]);
        }
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
        editor.edit(editBuilder => {
            const range = new vscode.Range(0, 0, sortedLines.length - 1, editor.document.lineAt(sortedLines.length -1).text.length);
            editBuilder.replace(range, sortedLines.join('\n'));
        });
        // this does not alway seem to trigger a redecoration so maybe leave this alone and 
        // just decorate after each sort
        editor.selection = new vscode.Selection(new vscode.Position(selectionLine, 0), new vscode.Position(selectionLine, 0));
    }

    function getLineObjects(doc: vscode.TextDocument, field: string): object[] {
        var lineObjects: object[] = [];
        let regex = Defaults.FIELD_REGEX_MAP[field];

        for (var i = 0; i < doc.lineCount; i++) {
            let text = doc.lineAt(i).text;
            let value = parseField(text, regex);
            lineObjects.push({text: text, value: value, line: i});
        }
        return lineObjects;
    }

    function parseField(line: string, regex: RegExp): string {
        let response = line.match(regex);
        if (response != null) {
            return response.pop();
        }
        // force to bottom
        return "z";
    }

};