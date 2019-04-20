import * as vscode from 'vscode';
import { Range } from 'vscode';
import * as path from 'path';


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
let decorations: Decoration[] = [
    new Decoration('context', /\B@[^+@\s]+/g, {
        light: {
            color: 'rgb(40, 161, 86)'
        },
        dark: {
            color: 'rgb(40, 161, 86)'
        }
    }),
    new Decoration('priority', /[(][A-Z][)]/g, {
        light: {
            color: 'rgb(230, 216, 25)'
        },
        dark: {
            color: 'rgb(230, 216, 25)'
        }
    }),
    new Decoration('project', /\B\+[^+@\s]+/g, {
        light: {
            color: 'rgb(25, 172, 230)'
        },
        dark: {
            color: 'rgb(25, 172, 230)'
        }
    }),
    new Decoration('tag', /\b[^+@\s]+:\w+/g, {
        light: {
            color: 'rgb(179, 58, 172)'
        },
        dark: {
            color: 'rgb(179, 58, 172)'
        }
    }),
    new Decoration('completed', /^x .*$/g, {
        textDecoration: "line-through",
        opacity: "0.5"
    })
]

export default class Decorator {

    public decorateDocument() {
        // Clear all current decorations and set active editor
        decorations.forEach(decoration => {
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
                    decorations.forEach(decoration => {
                        this.parseRegex(decoration.regex, decoration.decorationOptions, line);
                    })
                }
            }

            // Set final decorations
            decorations.forEach(decoration => {
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