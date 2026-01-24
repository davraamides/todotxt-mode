import * as vscode from "vscode";

import * as Patterns from "./patterns";
import * as Settings from "./settings";
import * as Helpers from "./helpers";
import { strftime } from "./strftime";
import { strptime } from "./strptime";

//
// Sorting functions
//
// Tasks are sorted by one of the fields: priority, context, project or tag. In
// the special case of a tag, they can also be sorted by the value of the tag.
// (This is currently only exposed for the due: tag to sort by due date). The
// getLineObjects routine extracts the appropriate value of the field for each
// line and then sorting is performed on that field, defaulting to the line
// number if the field is absent. This preserves the existing line order for
// lines without the tag which is what you would expect (the sort is stable).
//

interface LineObject {
  text: string;
  value: string;
  line: number;
}

type FieldParser = (line: string, fieldOrTagName: string, regex: RegExp) => string;

export function sortLinesByField(fieldName: string): void {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }
  const [startLine, endLine] = Helpers.getSelectedLineRange(true);
  const regex = Patterns.FieldRegex[fieldName];
  const lineObjects = getLineObjects(
    editor.document,
    startLine,
    endLine,
    fieldName,
    regex,
    parseField,
  );
  sort(lineObjects, startLine, endLine);
}

export function sortLinesByTagValue(tagName: string): void {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }
  const [startLine, endLine] = Helpers.getSelectedLineRange(true);
  const regex = Patterns.TagValueRegex;
  const lineObjects = getLineObjects(
    editor.document,
    startLine,
    endLine,
    tagName,
    regex,
    parseTagValue,
  );
  sort(lineObjects, startLine, endLine);
}

export function sortLinesByDueDate(): void {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }
  const [startLine, endLine] = Helpers.getSelectedLineRange(true);
  const regex = Patterns.TagValueRegex;
  const lineObjects = getLineObjects(
    editor.document,
    startLine,
    endLine,
    "due",
    regex,
    parseDueDate,
  );
  sort(lineObjects, startLine, endLine);
}

// get the lines of the document as objects with the text, field value and line number
function getLineObjects(
  doc: vscode.TextDocument,
  startLine: number,
  endLine: number,
  fieldOrTagName: string,
  regex: RegExp,
  fieldParser: FieldParser,
): LineObject[] {
  const lineObjects: LineObject[] = [];

  for (let i = startLine; i <= endLine; i++) {
    const text = doc.lineAt(i).text;
    let value = "";
    if (Settings.SortCompletedTasksToEnd() && Helpers.isCompleted(text)) {
      // force to very bottom, include date for sorting
      value = text.replace(Patterns.CompletedRegex, "z ");
    } else {
      value = fieldParser(text, fieldOrTagName, regex);
    }
    lineObjects.push({ text: text, value: value, line: i });
  }
  return lineObjects;
}

// return the first matching portion of a regex in a line
function parseField(line: string, _field: string, regex: RegExp): string {
  const response = regex.exec(line);
  if (response !== null) {
    regex.lastIndex = 0;
    const lastMatch = response.pop();
    return lastMatch ?? "y";
  }
  // force to bottom
  return "y";
}

function parseTagValue(line: string, tagName: string, regex: RegExp): string {
  let value: string = "y"; // default forcing to bottom if not found
  let result: RegExpExecArray | null;
  while ((result = regex.exec(line)) !== null) {
    if (result.length > 2) {
      if (tagName === result[1]) {
        value = result[2];
      }
    }
  }
  return value;
}

function parseDueDate(line: string, tagName: string, regex: RegExp): string {
  let value: string = "y"; // default forcing to bottom if not found
  let result: RegExpExecArray | null;
  while ((result = regex.exec(line)) !== null) {
    if (result.length > 2) {
      if (tagName === result[1]) {
        // parse the date in the specified format and convert to a sortable format
        try {
          const date = strptime(result[2], Settings.TagDatePattern());
          if (date) {
            value = strftime("%Y%m%d", date);
          } else {
            value = result[2];
          }
        } catch (error) {
          value = result[2];
        }
      }
    }
  }
  return value;
}

function sort(lineObjects: LineObject[], startLine: number, endLine: number): void {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }
  const selection = editor.selection;

  // sort the lines by the values of byField. leave lines without a field
  // in their existing order (i.e. a stable sort)
  lineObjects.sort((obja, objb) => {
    if (obja.value > objb.value) {
      return 1;
    }
    if (obja.value < objb.value) {
      return -1;
    }
    // for lines with equal or missing field values, use the line number to make the sort stable
    return obja.line - objb.line;
  });

  const sortedLines: string[] = [];
  for (let i = 0; i < lineObjects.length; i++) {
    sortedLines.push(lineObjects[i].text);
  }

  // replace all the lines in the editor with the new sorted lines
  editor
    .edit((editBuilder) => {
      const range = new vscode.Range(
        startLine,
        0,
        endLine,
        editor.document.lineAt(endLine).text.length,
      );
      editBuilder.replace(range, sortedLines.join("\n"));
    })
    .then(() => {
      editor.selection = selection;
    });
}
