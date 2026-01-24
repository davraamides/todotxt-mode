import * as vscode from "vscode";

import * as Helpers from "./helpers";
import * as Patterns from "./patterns";

//
// Manipulate the priority field
//

interface PriorityChange {
  line: number;
  begin: number;
  end: number;
  newPriority: string;
}

interface LineWithPriority {
  line: number;
  match: RegExpMatchArray;
}

export function changePriority(increment: boolean): void {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }
  const selection = editor.selection;
  const [startLine, endLine] = Helpers.getSelectedLineRange(false);
  const linesWithPriorityChange: PriorityChange[] = [];

  for (let i = startLine; i <= endLine; i++) {
    const text = editor.document.lineAt(i).text;
    const [oldPriority, newPriority] = Helpers.nextPriority(text, increment);
    linesWithPriorityChange.push({
      line: i,
      begin: Math.max(oldPriority.length - 3, 0),
      end: oldPriority.length,
      newPriority: newPriority + (oldPriority ? "" : " "),
    });
  }

  editor
    .edit((builder) => {
      linesWithPriorityChange.forEach((elt) => {
        builder.replace(
          new vscode.Range(
            new vscode.Position(elt.line, elt.begin),
            new vscode.Position(elt.line, elt.end),
          ),
          elt.newPriority,
        );
      });
    })
    .then(() => {
      editor.selection = selection;
    });
}

export function removePriorities(): void {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }
  const selection = editor.selection;
  const [startLine, endLine] = Helpers.getSelectedLineRange(true);
  const linesWithPriority: LineWithPriority[] = [];

  for (let i = startLine; i <= endLine; i++) {
    const text = editor.document.lineAt(i).text;
    if (!Helpers.isCompleted(text)) {
      const match = text.match(Patterns.PriorityWithTrailingSpaceRegex);
      if (match && match.index !== undefined) {
        linesWithPriority.push({ line: i, match: match });
      }
    }
  }

  editor
    .edit((builder) => {
      linesWithPriority.forEach((elt) => {
        const matchIndex = elt.match.index ?? 0;
        builder.delete(
          new vscode.Range(
            new vscode.Position(elt.line, matchIndex),
            new vscode.Position(elt.line, matchIndex + elt.match[0].length),
          ),
        );
      });
    })
    .then(() => {
      editor.selection = selection;
    });
}
