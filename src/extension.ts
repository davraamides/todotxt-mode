import * as vscode from 'vscode';
import * as Commands from './commands';

import Decorator from './decorations';
import { Settings } from './settings';
import { Patterns } from './patterns';
import { Helpers } from './helpers';
import { Completion } from './completion';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

// Module-level decorator instance so it can be recreated on config changes
let decorator: Decorator;

//
// Setup and activate the extension
//
export function activate(context: vscode.ExtensionContext): void {
    decorator = new Decorator();
    Commands.ActivateCommands(context);

    // Handle configuration changes - recreate decorator when style settings change
    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(e => {
        if (e.affectsConfiguration('todotxtmode')) {
            // Recreate decorator to pick up new style settings
            decorator.dispose();
            decorator = new Decorator();
            decorator.decorateDocument();
        }
    }));

    vscode.window.onDidChangeTextEditorSelection(() => {
        decorator.decorateDocument();
    });
    vscode.window.onDidChangeActiveTextEditor(() => {
        decorator.decorateDocument();
    });

    // Register a hover provider for the note:xxx tag which reads the
    // note file and displays in a hover message with a link to the file.
    // I've had some issues with note files that are in different paths
    // as the behavior seems to be OS-dependent. Also, note filenames
    // cannot contain spaces since the tag note:xxx is delimited at the
    // end by a space.

    const noteHoverProvider = vscode.languages.registerHoverProvider({ scheme: 'file', language: 'plaintext' }, {
        provideHover(document, position): vscode.Hover | null {
            const word = document.getText(document.getWordRangeAtPosition(position, Patterns.TagRegex));
            if (Helpers.isNoteTag(word)) {
                const bits = word.split(':');
                const fname = bits[1];
                const editor = vscode.window.activeTextEditor;
                if (!editor) {
                    return null;
                }
                const folder = path.normalize(path.dirname(editor.document.fileName));
                try {
                    const notePath: string = path.join(folder, fname);
                    if (fs.existsSync(notePath)) {
                        const note = fs.readFileSync(notePath);
                        // this link fails on windows - it probably needs the leading \ but then needs them converted to / or something
                        let prefix = 'file://';
                        if (os.platform() === 'win32') {
                            prefix = 'file:///';
                        }
                        const encPath = encodeURI(`${prefix}${notePath}`);
                        const message = new vscode.MarkdownString(`[Open note](${encPath})\n\n${note}`);
                        return new vscode.Hover(message);
                    }
                } catch (err) {
                    vscode.window.showInformationMessage(`err: ${err}`);
                    console.log(err);
                }
            }
            return null;
        }
    });

    context.subscriptions.push(noteHoverProvider);

    const textChangeHandler = vscode.workspace.onDidChangeTextDocument(async (event) => {
        const addCreatedAtEnabled = Settings.getSetting<boolean>("addCreatedAt");
        if (!Helpers.isTodoFile(event.document.fileName) || !addCreatedAtEnabled) {
            return;
        }

        const changes = event.contentChanges;
        if (changes.length > 0 && changes[0].text === '\n') {
            await Completion.insertCreatedAt();
        }
    });

    context.subscriptions.push(textChangeHandler);

    const projectHoverProvider = vscode.languages.registerHoverProvider({ scheme: 'file', language: 'plaintext' }, {
        provideHover(document, position): vscode.Hover | null {
            const word = document.getText(document.getWordRangeAtPosition(position, Patterns.ProjectRegex));
            const fname = word.substring(1) + '.md';
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                return null;
            }
            const folder = path.normalize(path.dirname(editor.document.fileName));
            try {
                const projectPath: string = path.join(folder, fname);
                if (fs.existsSync(projectPath)) {
                    const project = fs.readFileSync(projectPath);
                    // this link fails on windows - it probably needs the leading \ but then needs them converted to / or something
                    let prefix = 'file://';
                    if (os.platform() === 'win32') {
                        prefix = 'file:///';
                    }
                    const encPath = encodeURI(`${prefix}${projectPath}`);
                    const message = new vscode.MarkdownString(`[Open project](${encPath})\n\n${project}`);
                    return new vscode.Hover(message);
                }
            } catch (err) {
                vscode.window.showInformationMessage(`err: ${err}`);
                console.log(err);
            }
            return null;
        }
    });

    context.subscriptions.push(projectHoverProvider);

    // decorate initially on activation
    decorator.decorateDocument();
}

export function deactivate(): void {
    if (decorator) {
        decorator.dispose();
    }
}
