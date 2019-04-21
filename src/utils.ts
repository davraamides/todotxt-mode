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
        let editor = vscode.window.activeTextEditor;
        let parsedLines = getParsedLines(editor.document, byField);
        for (var i = 0; i < parsedLines.length; i++) {
            console.log(parsedLines[i]);
        }
        let sortedLines = sortByKey(byField, parsedLines);
        deleteAndPopulate(editor, sortedLines);
    }

    function getParsedLines(doc: vscode.TextDocument, field: string): Array<Object> {
        var parsedLines: Array<Object> = new Array<Object>();

        for (var i = 0; i < doc.lineCount; i++) {
            let lineText = doc.lineAt(i).text;
            let regex = Defaults.FIELD_REGEX_MAP[field];
            let fieldValue = parseRegexResponse(lineText.match(regex));
            parsedLines.push({ "line": i, "lineText": lineText, "field": fieldValue});
        }
        return parsedLines;
    }

    function parseRegexResponse(regexResponse: Array<String>): String {
        if (regexResponse != null) {
            return regexResponse.pop();
        }
        return "z";
    }

    function sortByKey(iKey: String, iArray: Array<Object>): Array<Object> {
        var sortedArray = iArray.sort((obj1, obj2) => {

            if (obj1[iKey.toString()] > obj2[iKey.toString()]) {
                return 1;
            }
            if (obj1[iKey.toString()] < obj2[iKey.toString()]) {
                return -1;
            }
            return 0;
        });

        return sortedArray;
    }

    function deleteAndPopulate(editor: vscode.TextEditor, docObject: Array<Object>) {

        editor.edit(builder => {

            for (var i = 0; i < docObject.length; i++) {
                let replaceRange = editor.document.lineAt(i).range;
                let lineText = docObject[i]["lineText"];
                builder.replace(replaceRange, lineText);
            }
        });

        editor.selection = new vscode.Selection(new vscode.Position(0, 0), new vscode.Position(0, 0));
    }
};
/*
sorting
- sort by field
- replace lines
*/
