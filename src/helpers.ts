import * as vscode from "vscode";
import * as Settings from "./settings";
import * as Patterns from "./patterns";

//
// Useful functions used across the extension
//

export function EOL(): string {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return "\n";
  }
  return editor.document.eol === vscode.EndOfLine.CRLF ? "\r\n" : "\n";
}

// get current date/time as [yyyy-mm-dd, hh:mm:ss] strings
export function getDateTimeParts(dt?: Date): [string, string] {
  if (!dt) {
    dt = new Date();
  }
  const [date, time] = new Date(dt.getTime() - dt.getTimezoneOffset() * 60000)
    .toISOString()
    .split("T");
  return [date, time.slice(0, 8)];
}

// Get the starting and ending lines of the selection. If nothing is selected
// return either the full line range, if defaultToAll is true, or the line the
// cursor is on, if defaultToAll is false.
export function getSelectedLineRange(defaultToAll: boolean): [number, number] {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return [0, 0];
  }
  const selection = editor.selection;
  if (!selection.isEmpty) {
    return [selection.start.line, selection.end.line];
  }
  if (defaultToAll) {
    return [0, getLastTodoLineInDocument(editor.document)];
  }
  // selection is empty but defaultToAll is false so just return the current line
  return [selection.start.line, selection.start.line];
}

export function isCompleted(text: string): boolean {
  return Patterns.CompletedRegex.test(text);
}

export function isDecoratedFile(filename: string): boolean {
  return isTodoFile(filename) || isProjectFile(filename);
}

export function isTodoFile(filename: string): boolean {
  return filename.match(Settings.TodoFilePattern()) !== null;
}

export function isProjectFile(filename: string): boolean {
  return (
    filename.match(Settings.MarkdownFilePattern()) !== null &&
    Settings.MarkdownDecorationBeginPattern() !== ""
  );
}

export function isNoteTag(text: string): boolean {
  if (text.match(Patterns.TagRegex)) {
    return text.split(":")[0] === "note";
  }
  return false;
}

export function excludeDecorations(filename: string): boolean {
  return filename.match(Settings.ExcludeDecorationsFilePattern()) !== null;
}

export function getLastTodoLineInDocument(document: vscode.TextDocument): number {
  // if the sectionDelimiterPattern setting has been set, find the first matching line
  const sectionDelimiterPattern = Settings.SectionDelimiterPattern();
  if (sectionDelimiterPattern && sectionDelimiterPattern.length > 0) {
    for (let i = 0; i < document.lineCount; i++) {
      if (document.lineAt(i).text.match(sectionDelimiterPattern)) {
        return i === 0 ? 0 : i - 1; // return the previous line unless the first line has the delimiter
      }
    }
  }
  return document.lineCount - 1;
}

export function getDecoratedLineRange(document: vscode.TextDocument): [number, number] {
  // todo files go from the beginning to the end or the optional section delimiter pattern
  if (document.fileName.match(Settings.TodoFilePattern())) {
    return [0, getLastTodoLineInDocument(document)];
  }
  // markdown files go from the beginning to the end of the range patterns, if found
  if (document.fileName.match(Settings.MarkdownFilePattern())) {
    const reBeg = new RegExp(Settings.MarkdownDecorationBeginPattern());
    const reEnd = new RegExp(Settings.MarkdownDecorationEndPattern());
    let begLine = -1;
    let endLine = -1;

    let i = 0;
    // find the line of the begin pattern
    while (i < document.lineCount) {
      if (reBeg.test(document.lineAt(i).text)) {
        begLine = i + 1;
        break;
      }
      i++;
    }
    // continue searching down to find the line of the end pattern
    while (i < document.lineCount) {
      if (reEnd.test(document.lineAt(i).text)) {
        endLine = i - 1;
        break;
      }
      i++;
    }
    if (begLine !== -1) {
      if (endLine === -1) {
        // go to the end of the file if the end pattern was never found
        endLine = document.lineCount - 1;
      }
      return [begLine, endLine];
    }
  }
  return [0, -1]; // invalid range so no lines are decorated
}

// Get the next priority for this task. The increment arg defines whether it's the
// next "higher" priority (lower in the alphabet) if true, or "lower" priority
// (higher in the alphabet) if false. If there is no priority it always starts at (A).
export function nextPriority(text: string, increment: boolean): [string, string] {
  let oldPriority = "";
  let newPriority = "(A)";
  const match = text.match(Patterns.PriorityWithLeadingSpaceRegex);
  if (match) {
    oldPriority = match[0];
    let priorityChar = oldPriority[oldPriority.length - 2]; // since there could be leading space
    if (priorityChar === "A" && increment) {
      priorityChar = "Z";
    } else if (priorityChar === "Z" && !increment) {
      priorityChar = "A";
    } else {
      priorityChar = String.fromCharCode(
        priorityChar.charCodeAt(0) + (increment ? -1 : 1),
      );
    }
    newPriority = "(" + priorityChar + ")";
  }
  return [oldPriority, newPriority];
}
