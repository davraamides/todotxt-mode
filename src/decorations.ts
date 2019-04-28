import * as vscode from 'vscode';
import { Range } from 'vscode';
import * as path from 'path';

import { Helpers } from './helpers';
import { Patterns } from './patterns';
import { Settings } from './settings';

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

export default class Decorator {

    decorations: Decoration[] = [
        new Decoration('context', Patterns.ContextRegex, Settings.ContextStyle),
        new Decoration('priority', Patterns.PriorityRegex, Settings.PriorityStyle),
        new Decoration('project', Patterns.ProjectRegex, Settings.ProjectStyle),
        new Decoration('tag', Patterns.TagRegex, Settings.TagStyle),
        new Decoration('completed', Patterns.CompletedRegex, Settings.CompletedStyle),
    ]

    public decorateDocument() {
        let editor = vscode.window.activeTextEditor;
        let fileName = path.basename(editor.document.fileName);

        if (Helpers.excludeDecorations(fileName)) {
            return;
        }
        // Clear all current decorations and set active editor
        this.decorations.forEach(decoration => {
            decoration.decorationOptions = [];
        });

        if (editor != undefined) {
            // Only Decorate Document if it's in the classic filenaming convention
            if (Helpers.isTodoTypeFile(fileName)) {
                // Iterate over each line and parse accordingl∏
                for (var i = 0; i < editor.document.lineCount; i++) {
                    let line = editor.document.lineAt(i);
                    this.decorations.forEach(decoration => {
                        this.parseRegex(decoration.regex, decoration.decorationOptions, line);
                    })
                }
            }

            // Set final decorations
            this.decorations.forEach(decoration => {
                editor.setDecorations(decoration.decorationType, decoration.decorationOptions);
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