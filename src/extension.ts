import * as vscode from "vscode";
import * as Commands from "./commands";

import Decorator from "./decorations";
import * as Settings from "./settings";
import * as Patterns from "./patterns";
import * as Helpers from "./helpers";
import * as Completion from "./completion";
import * as fs from "fs/promises";
import * as path from "path";
import * as os from "os";

// Module-level decorator instance so it can be recreated on config changes
let decorator: Decorator;

// Trigger redecoration of the current document
// This is exported so other modules can request redecoration after making changes
export function triggerRedecoration(): void {
  if (decorator) {
    decorator.decorateDocument();
  }
}

// Check if a file exists (async)
async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

// Create a file hover provider that reads a file and displays its contents
// This is used for both note:xxx tags and +project tags
function createFileHoverProvider(
  wordPattern: RegExp,
  isValidWord: (word: string) => boolean,
  getFilename: (word: string) => string,
  linkText: string,
): vscode.HoverProvider {
  return {
    async provideHover(document, position): Promise<vscode.Hover | null> {
      const word = document.getText(
        document.getWordRangeAtPosition(position, wordPattern),
      );
      if (!isValidWord(word)) {
        return null;
      }

      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return null;
      }

      const fname = getFilename(word);
      const folder = path.normalize(path.dirname(editor.document.fileName));
      const filePath = path.join(folder, fname);

      try {
        if (await fileExists(filePath)) {
          const content = await fs.readFile(filePath, "utf8");
          // File links need different prefixes on Windows
          const prefix = os.platform() === "win32" ? "file:///" : "file://";
          const encPath = encodeURI(`${prefix}${filePath}`);
          const message = new vscode.MarkdownString(
            `[${linkText}](${encPath})\n\n${content}`,
          );
          return new vscode.Hover(message);
        }
      } catch (err) {
        vscode.window.showInformationMessage(`err: ${err}`);
        console.log(err);
      }
      return null;
    },
  };
}

//
// Setup and activate the extension
//
export function activate(context: vscode.ExtensionContext): void {
  decorator = new Decorator();
  Commands.ActivateCommands(context);

  // Handle configuration changes - recreate decorator when style settings change
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration("todotxtmode")) {
        // Recreate decorator to pick up new style settings
        decorator.dispose();
        decorator = new Decorator();
        decorator.decorateDocument();
      }
    }),
  );

  vscode.window.onDidChangeTextEditorSelection(() => {
    decorator.decorateDocument();
  });
  vscode.window.onDidChangeActiveTextEditor(() => {
    decorator.decorateDocument();
  });

  // Register a hover provider for the note:xxx tag which reads the
  // note file and displays in a hover message with a link to the file.
  const noteHoverProvider = vscode.languages.registerHoverProvider(
    { scheme: "file", language: "plaintext" },
    createFileHoverProvider(
      Patterns.TagRegex,
      (word) => Helpers.isNoteTag(word),
      (word) => word.split(":")[1],
      "Open note",
    ),
  );
  context.subscriptions.push(noteHoverProvider);

  // Handle auto-insertion of creation date on new lines
  const textChangeHandler = vscode.workspace.onDidChangeTextDocument(async (event) => {
    const addCreatedAtEnabled = Settings.getSetting<boolean>("addCreatedAt");
    if (!Helpers.isTodoFile(event.document.fileName) || !addCreatedAtEnabled) {
      return;
    }

    const changes = event.contentChanges;
    if (changes.length > 0 && changes[0].text === "\n") {
      await Completion.insertCreatedAt();
    }
  });
  context.subscriptions.push(textChangeHandler);

  // Register a hover provider for +project tags
  const projectHoverProvider = vscode.languages.registerHoverProvider(
    { scheme: "file", language: "plaintext" },
    createFileHoverProvider(
      Patterns.ProjectRegex,
      () => true, // All +project words are valid
      (word) => word.substring(1) + ".md",
      "Open project",
    ),
  );
  context.subscriptions.push(projectHoverProvider);

  // decorate initially on activation
  decorator.decorateDocument();
}

export function deactivate(): void {
  if (decorator) {
    decorator.dispose();
  }
}
