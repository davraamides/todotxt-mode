import * as vscode from 'vscode';
import { window, Range } from 'vscode';
//import StyleConstants from '../utils/StyleConstants';
import * as path from 'path';
import { TextDecoder } from 'util';
//import AppConstants from '../utils/AppConstants';

var DEFAULT_STYLE = {
    textDecoration: "line-through",
    opacity: "0.5"
};

export default class ToDoDecorator {

    //dateDecorations: vscode.DecorationOptions[] = [];
    completedDecorations: vscode.DecorationOptions[] = [];
    projectDecorations: vscode.DecorationOptions[] = [];
    priorityDecorations: vscode.DecorationOptions[] = [];
    tagDecorations: vscode.DecorationOptions[] = [];
    //overdueDecorations: vscode.DecorationOptions[] = [];
    contextDecorations: vscode.DecorationOptions[] = [];
    activeEditor: vscode.TextEditor;
    completedTaskStyle: vscode.DecorationRenderOptions;

    constructor() {
        let settings = vscode.workspace.getConfiguration("todotxtmode");
        if (settings) {
            let message: string = settings["message"];
            if (message) {
                vscode.window.showWarningMessage(message);
            }
            let style = Object.assign({}, DEFAULT_STYLE, settings["completedTaskStyle"]);
            this.completedDecorationType = vscode.window.createTextEditorDecorationType(style);
         }
    }
    /*
    private dateDecorationType = vscode.window.createTextEditorDecorationType({
        light: {
            color: StyleConstants.DATE_LIGHT
        },
        dark: {
            color: StyleConstants.DATE_DARK
        }
    });
*/
    private projectDecorationType = vscode.window.createTextEditorDecorationType({
        light: {
            color: 'rgb(25, 172, 230)'
        },
        dark: {
            color: 'rgb(25, 172, 230)'
        }
    });

    private priorityDecorationType = vscode.window.createTextEditorDecorationType({
        light: {
            color: 'rgb(230, 216, 25)'
        },
        dark: {
            color: 'rgb(230, 216, 25)'
        }
    });

    private tagDecorationType = vscode.window.createTextEditorDecorationType({
        light: {
            color: 'rgb(179, 58, 172)'
        },
        dark: {
            color: 'rgb(179, 58, 172)'
        }
    });

/*
    private overdueDecorationType = vscode.window.createTextEditorDecorationType({

    });
*/
    private contextDecorationType = vscode.window.createTextEditorDecorationType({
        light: {
            color: 'rgb(40, 161, 86)'
        },
        dark: {
            color: 'rgb(40, 161, 86)'
        }
    });

    private completedDecorationType = vscode.window.createTextEditorDecorationType({
        textDecoration: 'font-style: italic; text-decoration: line-through; opacity: 0.5;'
    });

    public decorateDocument() {
        // Clear all current decorations and set active editor
        this.clearAllDecorations();
        this.activeEditor = vscode.window.activeTextEditor;

        if (window.activeTextEditor != undefined) {

            // Only Decorate Document if it's in the classic filenaming convention
            let fileName = path.basename(window.activeTextEditor.document.fileName);

            if (fileName == "todo.txt") {
                // Iterate over each line and parse accordingl∏
                let totalLines = window.activeTextEditor.document.lineCount;
                for (var i = 0; i < totalLines; i++) {
                    let lineObject = window.activeTextEditor.document.lineAt(i);
                    this.parseLineObject(lineObject);
                }
            }

            // Set final decorations
            this.setDecorations();
        }

    }

    private parseLineObject(inputLine: vscode.TextLine) {

        /*
            Iterate over regexes and update all arrays
        */
        //this.parseRegex(AppConstants.DATE_REGEX, this.dateDecorations, inputLine);
        // since + and @ are non-word characters, we use \B in the regex but for
        // tags, we use \b since they start with word characters
        this.parseRegex(/\B\+[^+@\s]+/g, this.projectDecorations, inputLine);
        this.parseRegex(/\B@[^+@\s]+/g, this.contextDecorations, inputLine);
        this.parseRegex(/[(][A-Z][)]/g, this.priorityDecorations, inputLine);
        this.parseRegex(/\b[^+@\s]+:\w+/g, this.tagDecorations, inputLine);

        if (inputLine.text.startsWith("x ") || inputLine.text.startsWith("X ")) {
            let decoration = { range: inputLine.range };
            this.completedDecorations.push(decoration);
        }
    }

    private clearAllDecorations() {
        //this.dateDecorations = [];
        this.projectDecorations = [];
        this.priorityDecorations = [];
        this.contextDecorations = [];
        this.tagDecorations = [];
        //this.overdueDecorations = [];
        this.completedDecorations = [];
    }

    private setDecorations() {
        // Set all new decorations
        //this.activeEditor.setDecorations(this.dateDecorationType, this.dateDecorations);
        this.activeEditor.setDecorations(this.projectDecorationType, this.projectDecorations);
        this.activeEditor.setDecorations(this.contextDecorationType, this.contextDecorations);
        this.activeEditor.setDecorations(this.completedDecorationType, this.completedDecorations);
        this.activeEditor.setDecorations(this.priorityDecorationType, this.priorityDecorations);
        this.activeEditor.setDecorations(this.tagDecorationType, this.tagDecorations);
    }

    private parseRegex(iRegExp: RegExp, decorationOptions: vscode.DecorationOptions[], inputLine: vscode.TextLine) {
        let result: RegExpExecArray;
        while (result = iRegExp.exec(inputLine.text)) {
            let beginPosition = new vscode.Position(inputLine.range.start.line, inputLine.firstNonWhitespaceCharacterIndex + result.index);
            let endPosition = new vscode.Position(inputLine.range.start.line, inputLine.firstNonWhitespaceCharacterIndex + result.index + result[0].length);
            let decoration = { range: new Range(beginPosition, endPosition) };
            decorationOptions.push(decoration);
        }
    }
}