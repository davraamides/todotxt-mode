import * as vscode from 'vscode';
import { Range } from 'vscode';
import * as path from 'path';

import { Helpers } from './helpers';
import { Patterns } from './patterns';
import { Settings } from './settings';
//
// Classes to manage decorations for various types of fields or task states.
//
// VS Code decorations consist of two parts: a decoration type and decoration
// options. A decoration type is like a style that is applied to the relevant
// text to change its visual appearance (similar to a CSS style definition, but
// not quite as powerful). Decoration options dictate what ranges of text will
// have a specific decoration type applied to. The decorations are then applied
// to the editor by calling setDecorations and passing in a type and an array of
// options, i.e. a formatting style and an array of ranges to apply that style
// to. This is because you'll typically apply the same style to many locations
// (e.g. a @context field on many taks lines). Below I define a set of classes
// to manage this for different types of decorations. Most of them simply use
// the general Decoration class which uses a regular expression to find matches
// for the ranges. There are special classes for priority and a date tag as
// their style is dependent on the value of the field.
//
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

class CreationDateDecoration extends Decoration {
    addMatch(match: object) {
        //adjust range so it's just the last 10 chars so ignore leading priority
        var range = match['range'];
        let endPos = new vscode.Position(range.end.line, range.end.character);
        let begPos = new vscode.Position(range.start.line, range.end.character - 11);
        this.decorationOptions.push({ range: new Range(begPos, endPos) })
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
        this.regex = Patterns.PriorityWithLeadingSpaceRegex;
        this.defaultDecorationType = vscode.window.createTextEditorDecorationType(defaultStyle);
        for (var priority in styleMap) {
            this.decorationTypeMap[priority] = vscode.window.createTextEditorDecorationType(styleMap[priority]);
        }
    }

    addMatch(match: object) {
        // since we allow leading whitespace and the regex matches it, we need to strip it off here so it will
        // properly index into the dicts
        let priority = match['value'].trim();
        if (! this.decorationOptionsMap[priority]) {
            this.decorationOptionsMap[priority] = [];
        }
        this.decorationOptionsMap[priority].push({ range: match['range'] });
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
        this.regex = RegExp(Patterns.TagDateRegexString.replace("#TAG#", tag), "g");
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
        new CreationDateDecoration(Patterns.CreationDateRegex, Settings.CreationDateStyle),
        new Decoration(Patterns.CompletedGlobalRegex, Settings.CompletedStyle),
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
            if (Helpers.isDecoratedFile(fileName)) {
                let [begLine, endLine] = Helpers.getDecoratedLineRange(editor.document);
                for (var i = begLine; i <= endLine; i++) {
                    let line = editor.document.lineAt(i);
                    //console.log("*** decorating line: " + line.text);
                    let seenMatches = new Set();
                    this.decorations.forEach(decoration => {
                        let matches = this.findMatchingPatterns(decoration.regex, line);
                        for (var match of matches) {
                            if (! seenMatches.has(match['value'])) {
                                decoration.addMatch(match);
                                seenMatches.add(match['value']);
                                //console.log("added match for value=" + match["value"]);
                            } else {
                                //console.log("skipping seen match for value=" + match["value"]);
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
        //console.log("finding matches for " + regex);
        while (result = regex.exec(line.text)) {
            let begPos = new vscode.Position(line.range.start.line,  result.index);
            let endPos = new vscode.Position(line.range.start.line,  result.index + result[0].length);
            matches.push({ range: new Range(begPos, endPos), value: result[0]})
            //console.log("pushed match at begPos=" + begPos.character + " endPos=" + endPos.character + " value=" + result[0]);
        }
        return matches;
    }
}