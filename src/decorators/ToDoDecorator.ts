import * as vscode from 'vscode';
import { window, Range } from 'vscode';
//import StyleConstants from '../utils/StyleConstants';
import * as path from 'path';
import { TextDecoder } from 'util';
//import AppConstants from '../utils/AppConstants';


class Decorator {
    name: string;
    regex: RegExp;
    style: Object;
    decorations: vscode.DecorationOptions[];
    decorationType: vscode.TextEditorDecorationType;

    constructor(name:string, regex:RegExp, style:vscode.DecorationRenderOptions) {
        this.name = name;
        this.regex = regex;
        this.style = style;
        this.decorations = [];
        this.decorationType = vscode.window.createTextEditorDecorationType(style);
    }
}
// since + and @ are non-word characters, we use \B in the regex but for
// tags, we use \b since they start with word characters
// need to use g option such that the while loop will terminate
let decorators:Decorator[] = [
    new Decorator('context', /\B@[^+@\s]+/g, {
        light: {
            color: 'rgb(40, 161, 86)'
        },
        dark: {
            color: 'rgb(40, 161, 86)'
        }
    }),
    new Decorator('priority', /[(][A-Z][)]/g, {
        light: {
            color: 'rgb(230, 216, 25)'
        },
        dark: {
            color: 'rgb(230, 216, 25)'
        }
    }),
    new Decorator('project', /\B\+[^+@\s]+/g, {
        light: {
            color: 'rgb(25, 172, 230)'
        },
        dark: {
            color: 'rgb(25, 172, 230)'
        }
    }),
    new Decorator('tag', /\b[^+@\s]+:\w+/g, {
        light: {
            color: 'rgb(179, 58, 172)'
        },
        dark: {
            color: 'rgb(179, 58, 172)'
        }
    }),
    new Decorator('completed', /^x .*$/g, {
        textDecoration: "line-through",
        opacity: "0.5"
    })
]

export default class ToDoDecorator {

    public decorateDocument() {
        // Clear all current decorations and set active editor
        decorators.forEach(decorator => {
            decorator.decorations = [];
        });
        let activeEditor = vscode.window.activeTextEditor;

        if (activeEditor != undefined) {

            // Only Decorate Document if it's in the classic filenaming convention
            let fileName = path.basename(activeEditor.document.fileName);

            if (fileName == "todo.txt") {
                // Iterate over each line and parse accordingl∏
                let totalLines = activeEditor.document.lineCount;
                for (var i = 0; i < totalLines; i++) {
                    let lineObject = activeEditor.document.lineAt(i);
                    decorators.forEach(decorator => {
                        this.parseRegex(decorator.regex, decorator.decorations, lineObject);
                    })
                }
            }

            // Set final decorations
            decorators.forEach(decorator => {
                activeEditor.setDecorations(decorator.decorationType, decorator.decorations);
            });
        }
    }

    private parseRegex(iRegExp: RegExp, decorationOptions: vscode.DecorationOptions[], inputLine: vscode.TextLine) {
        let result: RegExpExecArray;
        while (result = iRegExp.exec(inputLine.text)) {
            let beginPosition = new vscode.Position(inputLine.range.start.line, inputLine.firstNonWhitespaceCharacterIndex + result.index);
            let endPosition = new vscode.Position(inputLine.range.start.line, inputLine.firstNonWhitespaceCharacterIndex + result.index + result[0].length);
            let decoration = { range: new Range(beginPosition, endPosition) };
            decorationOptions.push(decoration);
        }
    }
}