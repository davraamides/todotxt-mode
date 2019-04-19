'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { window } from 'vscode';
import ToDoDecorator from './decorators/ToDoDecorator';

export default class ToDoController {

    private _disposable: vscode.Disposable;
    private _toDoDecorator: ToDoDecorator;

    constructor(toDoDecorator: ToDoDecorator) {

        let subscriptions: vscode.Disposable[] = [];
        vscode.window.onDidChangeTextEditorSelection(this._onEvent, this, subscriptions);
        vscode.window.onDidChangeActiveTextEditor(this._onEvent, this, subscriptions);

        this._toDoDecorator = toDoDecorator;
    }

    dispose() {
        this._disposable.dispose();
    }

    private _onEvent() {
        this._toDoDecorator.decorateDocument();
    }
}