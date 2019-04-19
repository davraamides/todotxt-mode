import * as vscode from 'vscode';
import { window, Range } from 'vscode';
//import StyleConstants from '../utils/StyleConstants';
import * as path from 'path';
//import AppConstants from '../utils/AppConstants';

export default class ToDoDecorator {

    dateDecorations: vscode.DecorationOptions[] = [];
    projectDecorations: vscode.DecorationOptions[] = [];
    priorityDecorations: vscode.DecorationOptions[] = [];
    overdueDecorations: vscode.DecorationOptions[] = [];
    completedDecorations: vscode.DecorationOptions[] = [];
    contextDecorations: vscode.DecorationOptions[] = [];
    activeEditor!: vscode.TextEditor;
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
/*
    private priorityDecorationType = vscode.window.createTextEditorDecorationType({
        light: {
            color: StyleConstants.PRIORITY_LIGHT
        },
        dark: {
            color: StyleConstants.PRIORITY_DARK
        }
    });

    private overdueDecorationType = vscode.window.createTextEditorDecorationType({

    });

    private contextDecorationType = vscode.window.createTextEditorDecorationType({
        light: {
            color: StyleConstants.CONTEXT_LIGHT
        },
        dark: {
            color: StyleConstants.CONTEXT_DARK
        }
    });
*/
    private completedDecorationType = vscode.window.createTextEditorDecorationType({
        textDecoration: 'text-decoration: line-through; opacity: 0.5;'
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
        this.parseRegex(/\B\+[^+@\s]+/g, this.projectDecorations, inputLine);
        //this.parseRegex(AppConstants.CONTEXT_REGEX, this.contextDecorations, inputLine);
        //this.parseRegex(AppConstants.PRIORITY_REGEX, this.priorityDecorations, inputLine);

        if (inputLine.text.startsWith("x ") || inputLine.text.startsWith("X ")) {
            let decoration = { range: inputLine.range };
            this.completedDecorations.push(decoration);
        }
    }

    private clearAllDecorations() {
        this.dateDecorations = [];
        this.projectDecorations = [];
        this.priorityDecorations = [];
        this.contextDecorations = [];
        this.overdueDecorations = [];
        this.completedDecorations = [];
    }

    private setDecorations() {
        // Set all new decorations
        //this.activeEditor.setDecorations(this.dateDecorationType, this.dateDecorations);
        this.activeEditor.setDecorations(this.projectDecorationType, this.projectDecorations);
        //this.activeEditor.setDecorations(this.contextDecorationType, this.contextDecorations);
        this.activeEditor.setDecorations(this.completedDecorationType, this.completedDecorations);
        //this.activeEditor.setDecorations(this.priorityDecorationType, this.priorityDecorations);
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