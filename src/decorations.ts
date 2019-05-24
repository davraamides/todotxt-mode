import * as vscode from 'vscode';
import { Range } from 'vscode';
import * as path from 'path';

import { Helpers } from './helpers';
import { Patterns } from './patterns';
import { Settings } from './settings';
import { finished } from 'stream';
import { createSecurePair } from 'tls';

interface IDecoration {
    regex: RegExp;
    addMatch(match: object): void;
    clear(): void;
    apply(editor: vscode.TextEditor): void;
}

class Decoration implements IDecoration {
    regex: RegExp;
    decorationOptions: vscode.DecorationOptions[];
    decorationType: vscode.TextEditorDecorationType;

    constructor(regex: RegExp, style: vscode.DecorationRenderOptions) {
        this.regex = regex;
        this.decorationOptions = [];
        this.decorationType = vscode.window.createTextEditorDecorationType(style);
    }

    addMatch(match: object) {
        this.decorationOptions.push({ range: match['range'] });
    }

    clear() {
        this.decorationOptions = [];
    }

    apply(editor: vscode.TextEditor) {
        editor.setDecorations(this.decorationType, this.decorationOptions);
    }
}

class PriorityDecoration implements IDecoration {
    regex: RegExp;
    decorationOptionsMap: { [priority: string]: vscode.DecorationOptions[] } = {};
    decorationTypeMap: { [priority: string]: vscode.TextEditorDecorationType } = {};
    defaultDecorationType: vscode.TextEditorDecorationType;
    constructor(
        styleMap: { [priority: string]: vscode.DecorationRenderOptions },
        defaultStyle: vscode.DecorationRenderOptions) {
        this.regex = Patterns.PriorityRegex;
        this.defaultDecorationType = vscode.window.createTextEditorDecorationType(defaultStyle);
        for (var priority in styleMap) {
            this.decorationTypeMap[priority] = vscode.window.createTextEditorDecorationType(styleMap[priority]);
        }
    }

    addMatch(match: object) {
        if (! this.decorationOptionsMap[match['value']]) {
            this.decorationOptionsMap[match['value']] = [];
        }
        this.decorationOptionsMap[match['value']].push({ range: match['range'] });
    }

    clear() {
        for (var priority in this.decorationOptionsMap) {
            this.decorationOptionsMap[priority] = [];
        }
    }

    apply(editor: vscode.TextEditor) {
        for (var priority in this.decorationOptionsMap) {
            if (priority in this.decorationTypeMap) {
                editor.setDecorations(this.decorationTypeMap[priority], this.decorationOptionsMap[priority]);
            } else {
                editor.setDecorations(this.defaultDecorationType, this.decorationOptionsMap[priority]);
            }
        }
    }
}
class DateDecoration implements IDecoration {
    regex: RegExp;
    tag: string;
    pastDecorationOptions: vscode.DecorationOptions[];
    pastDecorationType: vscode.TextEditorDecorationType;
    presentDecorationOptions: vscode.DecorationOptions[];
    presentDecorationType: vscode.TextEditorDecorationType;
    futureDecorationOptions: vscode.DecorationOptions[];
    futureDecorationType: vscode.TextEditorDecorationType;

    constructor(tag: string, pastStyle: vscode.DecorationRenderOptions,
        presentStyle: vscode.DecorationRenderOptions, futureStyle: vscode.DecorationRenderOptions) {
        this.regex = Patterns.TagDateRegex;
        this.tag = tag;
        this.pastDecorationType = vscode.window.createTextEditorDecorationType(pastStyle);
        this.presentDecorationType = vscode.window.createTextEditorDecorationType(presentStyle);
        this.futureDecorationType = vscode.window.createTextEditorDecorationType(futureStyle);
    }

    addMatch(match: object) {
        let bits = match['value'].split(':');
        if (bits[0] != this.tag) {
            return;
        }
        let date: string = bits[1];
        let today: string = Helpers.getDateTimeParts()[0];
        if (date < today) {
            this.pastDecorationOptions.push({ range: match['range'] });
        } else if (date > today) {
            this.futureDecorationOptions.push({ range: match['range'] });
        } else {
            this.presentDecorationOptions.push({ range: match['range'] });
        }
    }

    clear() {
        this.pastDecorationOptions = [];
        this.presentDecorationOptions = [];
        this.futureDecorationOptions = [];
    }

    apply(editor: vscode.TextEditor) {
        editor.setDecorations(this.pastDecorationType, this.pastDecorationOptions);
        editor.setDecorations(this.presentDecorationType, this.presentDecorationOptions);
        editor.setDecorations(this.futureDecorationType, this.futureDecorationOptions);
    }
}

export default class Decorator {

    decorations: IDecoration[] = [
        new Decoration(Patterns.ContextRegex, Settings.ContextStyle),
        new Decoration(Patterns.ProjectRegex, Settings.ProjectStyle),
        new Decoration(Patterns.CompletedRegex, Settings.CompletedStyle),
        new PriorityDecoration({
            '(A)': Settings.HighPriorityStyle,
            '(B)': Settings.MediumPriorityStyle,
            '(C)': Settings.LowPriorityStyle
        }, Settings.LowPriorityStyle),
        new DateDecoration('due',
            Settings.PastDateStyle,
            Settings.PresentDateStyle,
            Settings.FutureDateStyle),
        // first decoration wins so put the general tag one after the specific priority one
        new Decoration(Patterns.TagRegex, Settings.TagStyle)
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
            decoration.clear();
        });

        if (editor != undefined) {
            if (Helpers.isTodoTypeFile(fileName)) {
                let lastLine = Helpers.getLastTodoLineInDocument();
                for (var i = 0; i <= lastLine; i++) {
                    let line = editor.document.lineAt(i);
                    let seenMatches = new Set();
                    this.decorations.forEach(decoration => {
                        let matches = this.findMatchingPatterns(decoration.regex, line);
                        for (var match of matches) {
                            if (! seenMatches.has(match['value'])) {
                                decoration.addMatch(match);
                                seenMatches.add(match['value']);
                            }
                        }
                    })
                }
            }

            // Set final decorations
            this.decorations.forEach(decoration => {
                decoration.apply(editor);
            });
        }
    }

    private findMatchingPatterns(regex: RegExp, line: vscode.TextLine): object[] {
        let matches: object[] = [];
        let result: RegExpExecArray;
        while (result = regex.exec(line.text)) {
            let begPos = new vscode.Position(line.range.start.line, line.firstNonWhitespaceCharacterIndex + result.index);
            let endPos = new vscode.Position(line.range.start.line, line.firstNonWhitespaceCharacterIndex + result.index + result[0].length);
            matches.push({ range: new Range(begPos, endPos), value: result[0]})
        }
        return matches;
    }
}