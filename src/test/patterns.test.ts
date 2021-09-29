import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';
import * as Extension from '../extension';
import Decorator from '../decorations';
import { Patterns } from '../patterns';

/*
priority - only latin A-Z
date - only numeric yyyy-mm-dd
context, project, tag - these could be non-latin so can't use things like \b that wouldn't match
  properly. be careful of them being terminated either by a space (within a task) or with an end
  of string $ (at the end of the)

probably wnat a function to test matching one or more and one that can remove them

decorator = new Decorator()
decorator.findMatchingPatterns(regex, line)
*/
const testFolder = '../../src/test/files/';

// https://vscode.rocks/testing/
// https://github.com/Microsoft/vscode/issues/617
suite("Pattern Tests", function () {

    test("context", function() {
        var decorator = new Decorator();
        var matches;

        console.log("here");
        const uri = vscode.Uri.file(
            path.join(__dirname, testFolder, 'test_patterns.txt')
        );

        vscode.workspace.openTextDocument(uri).then((document: vscode.TextDocument) => {
            vscode.window.showTextDocument(document).then((editor: vscode.TextEditor) => {
                editor.document.lineAt(0);
                matches = decorator.findMatchingPatterns(Patterns.ContextRegex, editor.document.lineAt(0));
                assert.strictEqual(["ff"], matches);
            });
        }, (error: any) => {
            console.error(error);
        });
    });
});