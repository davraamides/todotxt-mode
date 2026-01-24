import * as vscode from "vscode";
import * as fs from "fs/promises";
import * as path from "path";

import * as Helpers from "./helpers";
import * as Settings from "./settings";
import * as Patterns from "./patterns";
import { TaskObject } from "./patterns";
import { triggerRedecoration } from "./extension";

//
// Manage movement of tasks to other task files.
//

// Check if a file exists (async)
async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

// Move any completed tasks to the "done" file
export async function archiveTasks(): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }
  const document = editor.document;
  const destinationPathName =
    path.dirname(document.fileName) + path.sep + Settings.DoneFilename();
  const lineDeletes: number[] = [];

  await ensureEndsWithEOL(destinationPathName);
  const lastLine = Helpers.getLastTodoLineInDocument(document);

  // Collect all tasks to archive
  const tasksToArchive: string[] = [];
  for (let i = 0; i <= lastLine; i++) {
    const lineObject = document.lineAt(i);
    if (Helpers.isCompleted(lineObject.text)) {
      tasksToArchive.push(lineObject.text + Helpers.EOL());
      lineDeletes.push(i);
    }
  }

  // Write all tasks at once (more efficient than multiple appends)
  if (tasksToArchive.length > 0) {
    await fs.appendFile(destinationPathName, tasksToArchive.join(""));
  }

  deleteLines(lineDeletes, editor, document);
}

// Move any selected tasks to the destination file. This is similar to archiveTasks above
// but different in how tasks are selected, thus it requires a separate function
export async function moveTasks(destinationFileName: string): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }
  const currDoc = editor.document;
  const lineDeletes: number[] = [];
  const destinationPathName =
    path.dirname(currDoc.fileName) + path.sep + destinationFileName;

  await ensureEndsWithEOL(destinationPathName);
  const [startLine, endLine] = Helpers.getSelectedLineRange(false);

  // Collect all tasks to move
  const tasksToMove: string[] = [];
  for (let i = startLine; i <= endLine; i++) {
    const lineObject = currDoc.lineAt(i);
    // NOTE - this should really find the last *task* line in destinationPathName and add the
    // task there (in case there is a -- block), but that's not easy to do directly on
    // an external file - much easier within VS code editor
    tasksToMove.push(lineObject.text + Helpers.EOL());
    lineDeletes.push(i);
  }

  // Write all tasks at once
  if (tasksToMove.length > 0) {
    await fs.appendFile(destinationPathName, tasksToMove.join(""));
  }

  deleteLines(lineDeletes, editor, currDoc);
}

export async function moveTasksToProject(): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }
  const folder = path.normalize(path.dirname(editor.document.fileName));
  let [startLine, endLine] = Helpers.getSelectedLineRange(false);
  // I don't like the behavior for multiple lines so I'm forcing this just for one line at a time
  // But I will leave the loop here for now until I figure out a better way to handle this
  endLine = startLine;

  for (let i = startLine; i <= endLine; i++) {
    const currentEditor = vscode.window.activeTextEditor;
    if (!currentEditor) {
      return;
    }
    const lineObject = currentEditor.document.lineAt(i);
    const taskObj: TaskObject = Patterns.parseTask(lineObject.text);
    if (Helpers.isTodoFile(currentEditor.document.fileName)) {
      let projectFilename: string | undefined;
      const projectArray = taskObj.project;
      if (projectArray.length > 0) {
        const filename = projectArray[0].substring(1) + ".md";
        const filepath: string = path.join(folder, filename);
        if (await fileExists(filepath)) {
          // exact match, move w/out prompting
          moveTaskToProjectFile(i, filepath);
          vscode.window.showInformationMessage(`Moved task to: ${filepath}`);
          continue;
        } else {
          // find any project files with the project name in the filename
          // showOpenDialog does not highlight selected file on macOS so this
          // isn't helpful, but maybe it works on Windows or Linux so I will leave it
          const matches: string[] = [];
          const project = projectArray[0].substring(1).toLowerCase();
          try {
            const files = await fs.readdir(folder);
            for (const file of files) {
              if (file.toLowerCase().includes(project) && file.endsWith(".md")) {
                matches.push(file);
              }
            }
          } catch {
            // Ignore directory read errors
          }
          if (matches.length > 0) {
            // just take the first one
            projectFilename = matches[0];
          }
        }
      }
      const filepath = await promptForFilename(projectFilename);
      if (filepath) {
        moveTaskToProjectFile(startLine, filepath);
        vscode.window.showInformationMessage(`Moved task to: ${filepath}`);
      }
    }
  }

  function moveTaskToProjectFile(taskLine: number, projectFilepath: string): void {
    const taskEditor = vscode.window.activeTextEditor;
    if (!taskEditor) {
      return;
    }
    const taskDocument = taskEditor.document;
    const task = taskDocument.lineAt(taskLine).text;

    vscode.workspace.openTextDocument(projectFilepath).then((projectDocument) => {
      vscode.window
        .showTextDocument(projectDocument, vscode.ViewColumn.Active, true)
        .then((projectEditor) => {
          let [, decoratedEndLine] = Helpers.getDecoratedLineRange(projectDocument);
          // add task to project file after endLine
          projectEditor
            .edit((builder) => {
              let text = task + Helpers.EOL();
              if (decoratedEndLine === -1) {
                // no task range found, append to end of file with Task header
                text = "## Tasks" + Helpers.EOL() + text;
                decoratedEndLine = projectDocument.lineCount - 1;
              }
              const position = new vscode.Position(decoratedEndLine + 1, 0);
              builder.insert(position, text);
            })
            .then((success) => {
              // don't remove the task from the original document unless we successfully added it to the project
              if (success) {
                // showing the project document closed the original one so re-open it
                vscode.window
                  .showTextDocument(taskDocument, vscode.ViewColumn.Active, false)
                  .then((reopenedEditor) => {
                    reopenedEditor.edit((builder) => {
                      builder.delete(
                        taskDocument.lineAt(taskLine).rangeIncludingLineBreak,
                      );
                    });
                  });
              }
            });
        });
    });
  }

  async function promptForFilename(
    _filename: string | undefined,
  ): Promise<string | null> {
    const options: vscode.OpenDialogOptions = {
      canSelectMany: false,
      openLabel: "Open",
      filters: {
        "Markdown files": ["md"],
        "Text files": ["txt"],
        "All files": ["*"],
      },
    };

    const fileUri = await vscode.window.showOpenDialog(options);
    if (fileUri && fileUri[0]) {
      return fileUri[0].fsPath;
    }
    return null;
  }
}

// Delete the lines at the specified line numbers. Do so in reverse
// order as deleting line n will change the line numbers of all lines > n
function deleteLines(
  lines: number[],
  editor: vscode.TextEditor,
  document: vscode.TextDocument,
): void {
  if (lines.length > 0) {
    const reversedLines = lines.reverse();
    editor
      .edit((builder) => {
        reversedLines.forEach((lineNum) => {
          builder.delete(document.lineAt(lineNum).rangeIncludingLineBreak);
        });
      })
      .then(() => {
        triggerRedecoration();
      });
  }
}

// Adds an EOL to a file if missing so that when we add a task
// it doesn't get appended to the end of an existing task
async function ensureEndsWithEOL(fileName: string): Promise<void> {
  if (await fileExists(fileName)) {
    const text = await fs.readFile(fileName, "utf8");
    if (!text.endsWith(Helpers.EOL())) {
      await fs.appendFile(fileName, Helpers.EOL());
    }
  }
}
