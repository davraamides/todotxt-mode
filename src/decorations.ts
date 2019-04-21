import * as vscode from 'vscode';
import { Range } from 'vscode';
import * as path from 'path';
import { Defaults } from './defaults';

class Decoration {
    name: string;
    regex: RegExp;
    style: Object;
    decorationOptions: vscode.DecorationOptions[];
    decorationType: vscode.TextEditorDecorationType;

    constructor(name: string, regex: RegExp, style: vscode.DecorationRenderOptions) {
        this.name = name;
        this.regex = regex;
        this.style = style;
        this.decorationOptions = [];
        this.decorationType = vscode.window.createTextEditorDecorationType(style);
    }
}
// since + and @ are non-word characters, we use \B in the regex but for
// tags, we use \b since they start with word characters
// need to use g option such that the while loop will terminate
export default class Decorator {

    decorations: Decoration[] = [
        new Decoration('context', Defaults.CONTEXT_REGEX, Defaults.CONTEXT_STYLE),
        new Decoration('priority', Defaults.PRIORITY_REGEX, Defaults.PRIORITY_STYLE),
        new Decoration('project', Defaults.PROJECT_REGEX, Defaults.PROJECT_STYLE),
        new Decoration('tag', Defaults.TAG_REGEX, Defaults.TAG_STYLE),
        new Decoration('completed', Defaults.COMPLETED_REGEX, Defaults.COMPLETED_STYLE),
    ]

    public decorateDocument() {
        // Clear all current decorations and set active editor
        this.decorations.forEach(decoration => {
            decoration.decorationOptions = [];
        });

        let activeEditor = vscode.window.activeTextEditor;
        if (activeEditor != undefined) {
            // Only Decorate Document if it's in the classic filenaming convention
            let fileName = path.basename(activeEditor.document.fileName);
            if (fileName == "todo.txt") {
                // Iterate over each line and parse accordingl∏
                for (var i = 0; i < activeEditor.document.lineCount; i++) {
                    let line = activeEditor.document.lineAt(i);
                    this.decorations.forEach(decoration => {
                        this.parseRegex(decoration.regex, decoration.decorationOptions, line);
                    })
                }
            }

            // Set final decorations
            this.decorations.forEach(decoration => {
                activeEditor.setDecorations(decoration.decorationType, decoration.decorationOptions);
            });
        }
    }

    private parseRegex(regex: RegExp, decorationOptions: vscode.DecorationOptions[], line: vscode.TextLine) {
        let result: RegExpExecArray;
        while (result = regex.exec(line.text)) {
            let begPos = new vscode.Position(line.range.start.line, line.firstNonWhitespaceCharacterIndex + result.index);
            let endPos = new vscode.Position(line.range.start.line, line.firstNonWhitespaceCharacterIndex + result.index + result[0].length);
            let decoration = { range: new Range(begPos, endPos) };
            decorationOptions.push(decoration);
        }
    }
}