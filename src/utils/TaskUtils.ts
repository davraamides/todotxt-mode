import * as vscode from 'vscode';

export namespace TaskUtils {

    export function determineEOL(eolValue: vscode.EndOfLine): String {
        if (eolValue == vscode.EndOfLine.CRLF) {
            return '\r\n';
        }
        return '\n';
    }

    export function deleteLines(lineDeletes: Number[], editor: vscode.TextEditor, doc: vscode.TextDocument) {
        let sortedLines = lineDeletes.reverse();
        if (sortedLines.length > 0) {
            editor.edit(builder => {
                sortedLines.forEach(a => {
                    builder.delete(doc.lineAt(a.valueOf()).rangeIncludingLineBreak);
                })
            }).then(() => { });
        }
    }

    export function isTaskComplete(lineText: String): Boolean {
        if (lineText.substring(0, 2).toLowerCase() == "x ") {
            return true
        }

        return false
    }
}