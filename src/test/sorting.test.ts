import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';
import * as Extension from '../extension';

const testFolder = '../../src/test/files/';

// https://vscode.rocks/testing/
// https://github.com/Microsoft/vscode/issues/617
suite("Sorting Tests", function () {

    test("sort by project", function() {
        // open known txt file
        const uri = vscode.Uri.file(
            path.join(__dirname, testFolder, 'test_sorting.txt')
        );

        vscode.workspace.openTextDocument(uri).then((document: vscode.TextDocument) => {
            vscode.window.showTextDocument(document).then((editor: vscode.TextEditor) => {
                vscode.commands.executeCommand('todotxt-mode.sortByContext').then(() => {
                    assert.equal(document.lineAt(0).text, '0 @a');
                    assert.equal(document.lineAt(1).text, '1 @b');
                    assert.equal(document.lineAt(2).text, '2 @c');
                });
            });
        }, (error: any) => {
            console.error(error);
        });
    });
});