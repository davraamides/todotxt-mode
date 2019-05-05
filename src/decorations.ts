import * as vscode from 'vscode';
import { Range } from 'vscode';
import * as path from 'path';

import { Helpers } from './helpers';
import { Patterns } from './patterns';
import { Settings } from './settings';

/*
regular one
for each line
  for each decoration
     for each match in the decoratins pattern
        add the decoration options to the list

dated/value one
for each line
   for each dated decoration
       for each match in the pattern
           look at value of match and apply appropriate style
so would need a parse routine that returns the set of match regions and values
*/
class Decoration {
    name: string;
    regex: RegExp;
    //style: Object;
    decorationOptions: vscode.DecorationOptions[];
    decorationType: vscode.TextEditorDecorationType;

    constructor(name: string, regex: RegExp, style: vscode.DecorationRenderOptions) {
        this.name = name;
        this.regex = regex;
        //this.style = style;
        this.decorationOptions = [];
        this.decorationType = vscode.window.createTextEditorDecorationType(style);
    }
}
class DateDecoration extends Decoration {
    beforeDateStyle: object;
    onDateStyle: object;
    afterDateStyle: object;

    constructor(name: string, tag: string) {
        super(name, new RegExp("\\b" + tag + ":\\d{4}-\\d{2}-\\d{2}\\b"), x);
    }
}

export default class Decorator {

    decorations: Decoration[] = [
        new Decoration('context', Patterns.ContextRegex, Settings.ContextStyle),
        new Decoration('priority', Patterns.PriorityRegex, Settings.PriorityStyle),
        new Decoration('project', Patterns.ProjectRegex, Settings.ProjectStyle),
        new Decoration('tag', Patterns.TagRegex, Settings.TagStyle),
        new Decoration('completed', Patterns.CompletedRegex, Settings.CompletedStyle),
        new DateDecoration('due-tag', 'due'),
    ]

    public decorateDocument() {
        let editor = vscode.window.activeTextEditor;
        if (! editor || ! editor.document) {
            return;
        }
        let fileName = path.basename(editor.document.fileName);
        if (Helpers.excludeDecorations(fileName)) {
            return;
        }
        // Clear all current decorations and set active editor
        this.decorations.forEach(decoration => {
            decoration.decorationOptions = [];
        });

        if (editor != undefined) {
            if (Helpers.isTodoTypeFile(fileName)) {
                let lastLine = Helpers.getLastTodoLineInDocument();
                for (var i = 0; i <= lastLine; i++) {
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