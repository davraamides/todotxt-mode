import * as vscode from "vscode";
import { Range } from "vscode";
import * as path from "path";

import * as Helpers from "./helpers";
import * as Patterns from "./patterns";
import * as Settings from "./settings";
import { strptime } from "./strptime";

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

interface DecorationMatch {
  range: vscode.Range;
  value: string;
}

interface IDecoration {
  regex: RegExp;
  addMatch(match: DecorationMatch): void;
  clear(): void;
  apply(editor: vscode.TextEditor): void;
  dispose(): void;
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

  addMatch(match: DecorationMatch): void {
    this.decorationOptions.push({ range: match.range });
  }

  clear(): void {
    this.decorationOptions = [];
  }

  apply(editor: vscode.TextEditor): void {
    editor.setDecorations(this.decorationType, this.decorationOptions);
  }

  dispose(): void {
    this.decorationType.dispose();
  }
}

class CreationDateDecoration extends Decoration {
  addMatch(match: DecorationMatch): void {
    // adjust range so it's just the last 10 chars so ignore leading priority
    const range = match.range;
    const endPos = new vscode.Position(range.end.line, range.end.character);
    const begPos = new vscode.Position(range.start.line, range.end.character - 11);
    this.decorationOptions.push({ range: new Range(begPos, endPos) });
  }
}

class PriorityDecoration implements IDecoration {
  regex: RegExp;
  decorationOptionsMap: { [priority: string]: vscode.DecorationOptions[] } = {};
  decorationTypeMap: { [priority: string]: vscode.TextEditorDecorationType } = {};
  defaultDecorationType: vscode.TextEditorDecorationType;

  constructor(
    styleMap: { [priority: string]: vscode.DecorationRenderOptions },
    defaultStyle: vscode.DecorationRenderOptions,
  ) {
    this.regex = Patterns.PriorityWithLeadingSpaceRegex;
    this.defaultDecorationType =
      vscode.window.createTextEditorDecorationType(defaultStyle);
    for (const priority in styleMap) {
      this.decorationTypeMap[priority] = vscode.window.createTextEditorDecorationType(
        styleMap[priority],
      );
    }
  }

  addMatch(match: DecorationMatch): void {
    // since we allow leading whitespace and the regex matches it, we need to strip it off here so it will
    // properly index into the dicts
    const priority = match.value.trim();
    if (!this.decorationOptionsMap[priority]) {
      this.decorationOptionsMap[priority] = [];
    }
    this.decorationOptionsMap[priority].push({ range: match.range });
  }

  clear(): void {
    for (const priority in this.decorationOptionsMap) {
      this.decorationOptionsMap[priority] = [];
    }
  }

  apply(editor: vscode.TextEditor): void {
    for (const priority in this.decorationOptionsMap) {
      if (priority in this.decorationTypeMap) {
        editor.setDecorations(
          this.decorationTypeMap[priority],
          this.decorationOptionsMap[priority],
        );
      } else {
        editor.setDecorations(
          this.defaultDecorationType,
          this.decorationOptionsMap[priority],
        );
      }
    }
  }

  dispose(): void {
    this.defaultDecorationType.dispose();
    for (const priority in this.decorationTypeMap) {
      this.decorationTypeMap[priority].dispose();
    }
  }
}

class DateDecoration implements IDecoration {
  regex: RegExp;
  tag: string;
  pastDecorationOptions: vscode.DecorationOptions[] = [];
  pastDecorationType: vscode.TextEditorDecorationType;
  presentDecorationOptions: vscode.DecorationOptions[] = [];
  presentDecorationType: vscode.TextEditorDecorationType;
  futureDecorationOptions: vscode.DecorationOptions[] = [];
  futureDecorationType: vscode.TextEditorDecorationType;

  constructor(
    tag: string,
    pastStyle: vscode.DecorationRenderOptions,
    presentStyle: vscode.DecorationRenderOptions,
    futureStyle: vscode.DecorationRenderOptions,
  ) {
    this.regex = new RegExp(Patterns.TagDateRegexString().replace("#TAG#", tag), "g");
    this.tag = tag;
    this.pastDecorationType = vscode.window.createTextEditorDecorationType(pastStyle);
    this.presentDecorationType =
      vscode.window.createTextEditorDecorationType(presentStyle);
    this.futureDecorationType = vscode.window.createTextEditorDecorationType(futureStyle);
  }

  addMatch(match: DecorationMatch): void {
    const bits = match.value.split(":");
    if (bits[0] !== this.tag) {
      return;
    }
    const today: Date = new Date(new Date().setHours(0, 0, 0, 0));
    let date: Date | null = null;
    try {
      date = strptime(bits[1], Settings.TagDatePattern());
    } catch (error) {
      // Invalid date format, treat as past
    }
    if (!date || date < today) {
      this.pastDecorationOptions.push({ range: match.range });
    } else if (date > today) {
      this.futureDecorationOptions.push({ range: match.range });
    } else {
      this.presentDecorationOptions.push({ range: match.range });
    }
  }

  clear(): void {
    this.pastDecorationOptions = [];
    this.presentDecorationOptions = [];
    this.futureDecorationOptions = [];
  }

  apply(editor: vscode.TextEditor): void {
    editor.setDecorations(this.pastDecorationType, this.pastDecorationOptions);
    editor.setDecorations(this.presentDecorationType, this.presentDecorationOptions);
    editor.setDecorations(this.futureDecorationType, this.futureDecorationOptions);
  }

  dispose(): void {
    this.pastDecorationType.dispose();
    this.presentDecorationType.dispose();
    this.futureDecorationType.dispose();
  }
}

export default class Decorator {
  decorations: IDecoration[] = [
    new Decoration(Patterns.ContextRegex, Settings.ContextStyle()),
    new Decoration(Patterns.ProjectRegex, Settings.ProjectStyle()),
    new CreationDateDecoration(Patterns.CreationDateRegex, Settings.CreationDateStyle()),
    new Decoration(Patterns.CompletedGlobalRegex, Settings.CompletedStyle()),
    new PriorityDecoration(
      {
        "(A)": Settings.HighPriorityStyle(),
        "(B)": Settings.MediumPriorityStyle(),
        "(C)": Settings.LowPriorityStyle(),
      },
      Settings.LowPriorityStyle(),
    ),
    new DateDecoration(
      "due",
      Settings.PastDateStyle(),
      Settings.PresentDateStyle(),
      Settings.FutureDateStyle(),
    ),
    // first decoration wins so put the general tag one after the specific priority one
    new Decoration(Patterns.TagRegex, Settings.TagStyle()),
  ];

  public decorateDocument(): void {
    const editor = vscode.window.activeTextEditor;
    if (!editor || !editor.document) {
      return;
    }
    const fileName = path.basename(editor.document.fileName);
    if (Helpers.excludeDecorations(fileName)) {
      return;
    }
    // Clear all current decorations and set active editor
    this.decorations.forEach((decoration) => {
      decoration.clear();
    });

    if (Helpers.isDecoratedFile(fileName)) {
      const [begLine, endLine] = Helpers.getDecoratedLineRange(editor.document);
      for (let i = begLine; i <= endLine; i++) {
        const line = editor.document.lineAt(i);
        const seenMatches = new Set<string>();
        this.decorations.forEach((decoration) => {
          const matches = this.findMatchingPatterns(decoration.regex, line);
          for (const match of matches) {
            if (!seenMatches.has(match.value)) {
              decoration.addMatch(match);
              seenMatches.add(match.value);
            }
          }
        });
      }
    }

    // Set final decorations
    this.decorations.forEach((decoration) => {
      decoration.apply(editor);
    });
  }

  public findMatchingPatterns(regex: RegExp, line: vscode.TextLine): DecorationMatch[] {
    const matches: DecorationMatch[] = [];
    let result: RegExpExecArray | null;
    while ((result = regex.exec(line.text)) !== null) {
      const begPos = new vscode.Position(line.range.start.line, result.index);
      const endPos = new vscode.Position(
        line.range.start.line,
        result.index + result[0].length,
      );
      matches.push({ range: new Range(begPos, endPos), value: result[0] });
    }
    return matches;
  }

  public dispose(): void {
    this.decorations.forEach((decoration) => {
      decoration.dispose();
    });
  }
}
