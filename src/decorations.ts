import * as vscode from 'vscode';
import { Range } from 'vscode';
import * as path from 'path';

import { Helpers } from './helpers';
import { Patterns } from './patterns';
import { Settings } from './settings';
import { finished } from 'stream';

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

for each line
   for each Decoration
       matches = get matches
       for each match
          add decoration (based on value)

*/
//
// a Decoration is an RE pattern and a decoration style/type
// when deocarting the document, the lines are scanned for matches of 
// the pattern and the ranges of those matches are stored in the decorationOptions array.
// when you actually decorate the document, you apply the pairs of styles and range arrays
// via the setDecorations call
//
/*
I just want to refactor the algorithm such that each decorate can examine teh value
of the matching pattern to apply the decoration in the way they want AND to ignore
the decoration

for each line in the document
    for each decoration
        matches = findMatches(decoration.pattern, line)
        for each match:
            decoration.addMatch(match)

default decoration addMatch(match)
    decorationOptions.push({ begin: match.begPos, end: match.endPos })

custom decoration addMatch(match)
    d = new Decoration(x, y, (match) => {
        dt = toDate(match.value)
        if dt == today()
            decorationOptions.push({ begin: match.begPos, end: match.endPos})
    })

GO BACK TO ORIGINAL AND REWRITE TO THE DEFAULT FORMAT ABOVE SO THEN I CAN OVERRIDE WITH
A DYNAMIC CLASS AND CUSTOM ADDMATCH METHOD
*/
class Decoration {
    name: string; // not currently used
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

    addMatch(match: object) {
        this.decorationOptions.push({ range: match['range' });
    }

    clear() {
        this.decorationOptions = [];
    }

    apply(editor: vscode.TextEditor) {
        editor.setDecorations(this.decorationType, this.decorationOptions);
    }
}
// this needs to have a map of priority to decorationType and priority to decorationOptions[]
// should reallly make an interface
class ProrityDecoration extends Decoration {
    decorationOptionsMap = {}; // how do I ceclare a dict of array?
    decorationTypeMap = { of vscode.TextEditorDecorationType }; // and a map of a type?
    constructor(name: string, styleMap, defaultStyle) {
        super(name, Patterns.PriorityRegex, defaultStyle);
        for (var style in styleMap) {
            this.decorationTypeMap[style.key] = vscode.window.createTextEditorDecorationType(style.value);
        }
    }

    addMatch(match: object) {
        let decOptions = this.decorationOptionsMap[match['value']];
        decOptions.push({ range: match['range'] });
    }

    clear() {
        for (key in this.decorationOptionsMap) {
            this.decorationOptionsMap[key] = [];
        }
    }

    apply(editor: vscode.TextEditor) {
        for (key in this.decorationsOptionsMap) {
            let decType = decorationTypeMap.get(key, this.decorationType);
            editor.setDecorations(decType, this.decorationOptionsMap[key]);
        }
    }
}
class ValueDecoration extends Decoration {
    constructor(name: string, tag: string, (value:string) => {}:object) {
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
        new ValueDecoration('due-past', 'due', (value:string) => {
            let date = toDate(value);
            if (date > today()) {
                return duePastStyle;
            }
            return undefined;
        }),
        new ValueDecoration('due-today', 'due', (value: string) => {
            let date = toDate(value);
            if (date == today()) {
                return dueTodayStyle;
            }
            return undefined;
        }),
        new ValueDecoration('due-future', 'due', (value: string) => {
            let date = toDate(value);
            if (date > today()) {
                return dueFutureStyle;
            }
            return undefined;
        }),
        new ValueDecoration('priority-a', 'priority', (value: string) => {
            if (value == "(A)") {
                return priorityAStyle;
            }
            return undefined;
        }),
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
                    this.decorations.forEach(decoration => {
                        let matches = this.findMatchingPatterns(decoration.regex, line);
                        for (var match of matches) {
                            decoration.addMatch(match);
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

    private parseRegex(regex: RegExp, decorationOptions: vscode.DecorationOptions[], line: vscode.TextLine) {
        let result: RegExpExecArray;
        while (result = regex.exec(line.text)) {
            let begPos = new vscode.Position(line.range.start.line, line.firstNonWhitespaceCharacterIndex + result.index);
            let endPos = new vscode.Position(line.range.start.line, line.firstNonWhitespaceCharacterIndex + result.index + result[0].length);
            let decoration = { range: new Range(begPos, endPos) };
            decorationOptions.push(decoration);
        }
    }

    private findMatchingPatterns(regex: RegExp, line: vscode.TextLine): object[] {
        let matches: object[] = [];
        let result: RegExpExecArray;
        while (result = regex.exec(line.text)) {
            let begPos = new vscode.Position(line.range.start.line, line.firstNonWhitespaceCharacterIndex + result.index);
            let endPos = new vscode.Position(line.range.start.line, line.firstNonWhitespaceCharacterIndex + result.index + result[0].length);
            //let decoration = { range: new Range(begPos, endPos) };
            //decorationOptions.push(decoration);
            matches.push({ range: new Range(begPos, endPos), match: result[0]})
        }
        return matches;
    }
}