import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

suite('Commands Integration Test Suite', () => {
    let testDir: string;
    let testFile: string;

    // Helper to create a test file with content
    async function createTestFile(content: string): Promise<vscode.TextDocument> {
        fs.writeFileSync(testFile, content);
        const uri = vscode.Uri.file(testFile);
        const document = await vscode.workspace.openTextDocument(uri);
        await vscode.window.showTextDocument(document);
        return document;
    }

    // Helper to get document content
    function getDocumentContent(document: vscode.TextDocument): string {
        return document.getText();
    }

    // Helper to select all text in the editor
    async function selectAll(editor: vscode.TextEditor): Promise<void> {
        const lastLine = editor.document.lineCount - 1;
        const lastChar = editor.document.lineAt(lastLine).text.length;
        editor.selection = new vscode.Selection(0, 0, lastLine, lastChar);
    }

    // Helper to select a specific line
    async function selectLine(editor: vscode.TextEditor, lineNum: number): Promise<void> {
        const line = editor.document.lineAt(lineNum);
        editor.selection = new vscode.Selection(line.range.start, line.range.end);
    }

    // Helper to position cursor on a specific line
    async function setCursorPosition(editor: vscode.TextEditor, line: number, char: number = 0): Promise<void> {
        const position = new vscode.Position(line, char);
        editor.selection = new vscode.Selection(position, position);
    }

    setup(async () => {
        // Create a temporary directory for test files
        testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'todotxt-test-'));
        testFile = path.join(testDir, 'test.txt');
    });

    teardown(async () => {
        // Close all editors
        await vscode.commands.executeCommand('workbench.action.closeAllEditors');

        // Clean up test directory
        if (fs.existsSync(testDir)) {
            fs.rmSync(testDir, { recursive: true });
        }
    });

    suite('Toggle Completion', () => {
        test('should mark task as complete', async () => {
            const document = await createTestFile('(A) Test task');
            const editor = vscode.window.activeTextEditor!;
            await setCursorPosition(editor, 0);

            await vscode.commands.executeCommand('extension.toggleCompletion');

            // Wait for the edit to complete
            await new Promise(resolve => setTimeout(resolve, 100));

            const content = getDocumentContent(document);
            assert.ok(content.startsWith('x '), 'Task should start with "x "');
            assert.ok(content.includes('Test task'), 'Task text should be preserved');
        });

        test('should mark completed task as incomplete', async () => {
            const document = await createTestFile('x 2024-01-15 (A) 2024-01-10 Test task');
            const editor = vscode.window.activeTextEditor!;
            await setCursorPosition(editor, 0);

            await vscode.commands.executeCommand('extension.toggleCompletion');
            await new Promise(resolve => setTimeout(resolve, 100));

            const content = getDocumentContent(document);
            assert.ok(!content.startsWith('x '), 'Task should not start with "x "');
            assert.ok(content.includes('Test task'), 'Task text should be preserved');
        });

        test('should toggle multiple selected tasks', async () => {
            const document = await createTestFile('Task 1\nTask 2\nTask 3');
            const editor = vscode.window.activeTextEditor!;

            // Select all lines
            editor.selection = new vscode.Selection(0, 0, 2, 6);

            await vscode.commands.executeCommand('extension.toggleCompletion');
            await new Promise(resolve => setTimeout(resolve, 100));

            const lines = getDocumentContent(document).split('\n');
            assert.ok(lines[0].startsWith('x '), 'First task should be completed');
            assert.ok(lines[1].startsWith('x '), 'Second task should be completed');
            assert.ok(lines[2].startsWith('x '), 'Third task should be completed');
        });
    });

    suite('Priority Commands', () => {
        test('should add priority (A) to task without priority', async () => {
            const document = await createTestFile('Task without priority');
            const editor = vscode.window.activeTextEditor!;
            await setCursorPosition(editor, 0);

            await vscode.commands.executeCommand('extension.incrementPriority');
            await new Promise(resolve => setTimeout(resolve, 100));

            const content = getDocumentContent(document);
            assert.ok(content.startsWith('(A)'), 'Task should have priority (A)');
        });

        test('should increment priority from B to A', async () => {
            const document = await createTestFile('(B) Task with priority B');
            const editor = vscode.window.activeTextEditor!;
            await setCursorPosition(editor, 0);

            await vscode.commands.executeCommand('extension.incrementPriority');
            await new Promise(resolve => setTimeout(resolve, 100));

            const content = getDocumentContent(document);
            assert.ok(content.startsWith('(A)'), 'Task should have priority (A)');
        });

        test('should decrement priority from A to B', async () => {
            const document = await createTestFile('(A) Task with priority A');
            const editor = vscode.window.activeTextEditor!;
            await setCursorPosition(editor, 0);

            await vscode.commands.executeCommand('extension.decrementPriority');
            await new Promise(resolve => setTimeout(resolve, 100));

            const content = getDocumentContent(document);
            assert.ok(content.startsWith('(B)'), 'Task should have priority (B)');
        });

        test('should wrap priority from A to Z when incrementing', async () => {
            const document = await createTestFile('(A) Task with priority A');
            const editor = vscode.window.activeTextEditor!;
            await setCursorPosition(editor, 0);

            await vscode.commands.executeCommand('extension.incrementPriority');
            await new Promise(resolve => setTimeout(resolve, 100));

            const content = getDocumentContent(document);
            assert.ok(content.startsWith('(Z)'), 'Task should have priority (Z)');
        });

        test('should remove priorities from selected tasks', async () => {
            const document = await createTestFile('(A) Task 1\n(B) Task 2\n(C) Task 3');
            const editor = vscode.window.activeTextEditor!;

            // Select all lines
            editor.selection = new vscode.Selection(0, 0, 2, 10);

            await vscode.commands.executeCommand('extension.removePriorities');
            await new Promise(resolve => setTimeout(resolve, 100));

            const content = getDocumentContent(document);
            assert.ok(!content.includes('(A)'), 'Priority A should be removed');
            assert.ok(!content.includes('(B)'), 'Priority B should be removed');
            assert.ok(!content.includes('(C)'), 'Priority C should be removed');
            assert.ok(content.includes('Task 1'), 'Task text should be preserved');
        });
    });

    suite('Sorting Commands', () => {
        test('should sort by context', async () => {
            const document = await createTestFile('@zebra Task 1\n@apple Task 2\n@mango Task 3');
            const editor = vscode.window.activeTextEditor!;
            await selectAll(editor);

            await vscode.commands.executeCommand('extension.sortByContext');
            await new Promise(resolve => setTimeout(resolve, 100));

            const lines = getDocumentContent(document).split('\n').filter(l => l.trim());
            assert.ok(lines[0].includes('@apple'), 'First line should have @apple');
            assert.ok(lines[1].includes('@mango'), 'Second line should have @mango');
            assert.ok(lines[2].includes('@zebra'), 'Third line should have @zebra');
        });

        test('should sort by project', async () => {
            const document = await createTestFile('+zebra Task 1\n+apple Task 2\n+mango Task 3');
            const editor = vscode.window.activeTextEditor!;
            await selectAll(editor);

            await vscode.commands.executeCommand('extension.sortByProject');
            await new Promise(resolve => setTimeout(resolve, 100));

            const lines = getDocumentContent(document).split('\n').filter(l => l.trim());
            assert.ok(lines[0].includes('+apple'), 'First line should have +apple');
            assert.ok(lines[1].includes('+mango'), 'Second line should have +mango');
            assert.ok(lines[2].includes('+zebra'), 'Third line should have +zebra');
        });

        test('should sort by priority', async () => {
            const document = await createTestFile('(C) Task 1\n(A) Task 2\n(B) Task 3');
            const editor = vscode.window.activeTextEditor!;
            await selectAll(editor);

            await vscode.commands.executeCommand('extension.sortByPriority');
            await new Promise(resolve => setTimeout(resolve, 100));

            const lines = getDocumentContent(document).split('\n').filter(l => l.trim());
            assert.ok(lines[0].startsWith('(A)'), 'First line should have (A)');
            assert.ok(lines[1].startsWith('(B)'), 'Second line should have (B)');
            assert.ok(lines[2].startsWith('(C)'), 'Third line should have (C)');
        });

        test('should sort by due date', async () => {
            const document = await createTestFile('Task 1 due:2024-03-15\nTask 2 due:2024-01-15\nTask 3 due:2024-02-15');
            const editor = vscode.window.activeTextEditor!;
            await selectAll(editor);

            await vscode.commands.executeCommand('extension.sortByDueDate');
            await new Promise(resolve => setTimeout(resolve, 100));

            const lines = getDocumentContent(document).split('\n').filter(l => l.trim());
            assert.ok(lines[0].includes('2024-01-15'), 'First line should have earliest date');
            assert.ok(lines[1].includes('2024-02-15'), 'Second line should have middle date');
            assert.ok(lines[2].includes('2024-03-15'), 'Third line should have latest date');
        });

        test('should place tasks without sort field at bottom', async () => {
            const document = await createTestFile('@context Task 1\nTask without context\n@apple Task 3');
            const editor = vscode.window.activeTextEditor!;
            await selectAll(editor);

            await vscode.commands.executeCommand('extension.sortByContext');
            await new Promise(resolve => setTimeout(resolve, 100));

            const lines = getDocumentContent(document).split('\n').filter(l => l.trim());
            assert.ok(lines[0].includes('@apple'), 'Task with @apple should be first');
            assert.ok(lines[1].includes('@context'), 'Task with @context should be second');
            assert.ok(lines[2].includes('without'), 'Task without context should be last');
        });
    });

    suite('Archive Tasks', () => {
        test('should archive completed tasks to done.txt', async () => {
            const doneFile = path.join(testDir, 'done.txt');

            await createTestFile('x 2024-01-15 Completed task\n(A) Active task');
            const editor = vscode.window.activeTextEditor!;

            await vscode.commands.executeCommand('extension.archiveTasks');
            await new Promise(resolve => setTimeout(resolve, 200));

            // Check done.txt was created and contains the completed task
            assert.ok(fs.existsSync(doneFile), 'done.txt should be created');
            const doneContent = fs.readFileSync(doneFile, 'utf8');
            assert.ok(doneContent.includes('Completed task'), 'done.txt should contain completed task');

            // Check original file no longer has completed task
            const content = getDocumentContent(editor.document);
            assert.ok(!content.includes('x 2024-01-15'), 'Original file should not have completed task');
            assert.ok(content.includes('Active task'), 'Original file should still have active task');
        });
    });

    suite('Format Tasks', () => {
        test('should reorder task fields', async () => {
            // formatTasks reorders fields to: priority, task text, tags, contexts, projects
            const document = await createTestFile('@context +project (A) Task text due:2024-01-15');
            const editor = vscode.window.activeTextEditor!;
            await selectLine(editor, 0);

            await vscode.commands.executeCommand('extension.formatTasks');
            await new Promise(resolve => setTimeout(resolve, 100));

            const content = getDocumentContent(document);
            // Priority should come first
            assert.ok(content.startsWith('(A)'), 'Priority should be first');
            // All parts should still be present
            assert.ok(content.includes('@context'), 'Context should be preserved');
            assert.ok(content.includes('+project'), 'Project should be preserved');
            assert.ok(content.includes('due:2024-01-15'), 'Tag should be preserved');
        });
    });

    suite('Edge Cases', () => {
        test('should handle empty file', async () => {
            await createTestFile('');
            const editor = vscode.window.activeTextEditor!;

            // Should not throw
            await vscode.commands.executeCommand('extension.toggleCompletion');
            await vscode.commands.executeCommand('extension.incrementPriority');
            await vscode.commands.executeCommand('extension.sortByContext');
        });

        test('should handle file with only whitespace', async () => {
            await createTestFile('   \n  \n   ');

            // Should not throw
            await vscode.commands.executeCommand('extension.toggleCompletion');
        });

        test('should preserve indentation when toggling completion', async () => {
            const document = await createTestFile('  Indented task');
            const editor = vscode.window.activeTextEditor!;
            await setCursorPosition(editor, 0);

            await vscode.commands.executeCommand('extension.toggleCompletion');
            await new Promise(resolve => setTimeout(resolve, 100));

            const content = getDocumentContent(document);
            assert.ok(content.startsWith('  x '), 'Indentation should be preserved');
        });
    });
});
