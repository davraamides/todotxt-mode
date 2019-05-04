import * as vscode from 'vscode';
import { Helpers } from './helpers';
/*
 * Configuration settings and constants
 *
 * Manage them in the same place so it's easy to factor constants into the configuration
 * file without impacting a lot of code
 */
export namespace Patterns {

    export const ContextField = 'context';
    export const PriorityField = 'priority';
    export const ProjectField = 'project';
    export const TagField = 'tag';

    // The context and project patterns are prefixed with non-word boundary (\B) as they
    // begin with non-word chars (+@). The tag pattern is prefixed with a word bounday (\b)
    // as tags begin with a word char.
    export const ContextRegex = /\B@\S+\b/g;
    export const PriorityRegex = /^[(][A-Z][)]\B/g;
    export const ProjectRegex = /\B\+\S+\b/g;
    export const TagRegex = /\b\w+:[^\s]+\b/g;

    export const TagValueRegex = /\b(\w+):(\w+)\b/g;
    export const CompletedRegex = /^x .*$/g;

    // put them in a map so sorting by any field is consistent
    export const FieldRegex = {
        'context': ContextRegex,
        'priority': PriorityRegex,
        'project': ProjectRegex,
        'tag': TagRegex,
    }

    export function formatSelectedTasks() {
        // Get the current line and find the first 2 characters
        const editor = vscode.window.activeTextEditor;
        let [startLine, endLine] = Helpers.getSelectedLineRange(false);

        let newLines = [];
        for (var i = startLine; i <= endLine; i++) {
            let oldText = vscode.window.activeTextEditor.document.lineAt(i).text;
            // BUG fails for completed task with priority as it resorts and puts priorit in fron of "x yyyy-mm-dd"
            let taskObj = parseTask(oldText);
            let newText = spellTask(taskObj);
            newLines.push(newText);
        }

        editor.edit(builder => {
            let lastText = vscode.window.activeTextEditor.document.lineAt(endLine).text;
            const range = new vscode.Range(new vscode.Position(startLine, 0), new vscode.Position(endLine, lastText.length));
            builder.replace(range, newLines.join('\n'));
        })
        // put in utils
        let selectedLineLength = editor.document.lineAt(startLine).text.length;
        editor.selection = new vscode.Selection(new vscode.Position(startLine, selectedLineLength), new vscode.Position(startLine, selectedLineLength));
        editor.selection = new vscode.Selection(new vscode.Position(startLine, 0), new vscode.Position(startLine, 0));
    }

    // parse a task into an object so it's easy to process individual fields
    // ignore completed status since just part of task text
    export function parseTask(line: string): object {
        let taskObj = {line: line, context: [], priority: undefined, project: [], tag: []};
        let task = [];
        let words = line.split(/\s+/);
        for (const word of words) {
            let matched = false;
            for (const fieldName of [ContextField, ProjectField, TagField]) {
                if (word.match(FieldRegex[fieldName])) {
                    taskObj[fieldName].push(word);
                    matched = true;
                    break;
                }
            }
            if (word.match(FieldRegex[PriorityField])) {
                taskObj[PriorityField] = word;
                matched = true;
            }
            if (word.match(FieldRegex[TagField])) {
                let bits = word.split(':');
                taskObj[bits[0]] = bits[1];
            }
            if (! matched) {
                task.push(word);
            }
        }
        taskObj['task'] = task.join(' ');
        return taskObj;
    }

    // convert a task object back to a string using the specified order for the fields
    function spellTask(taskObj: object, fieldOrder: string = "tcp"): string {
        // build a task line back from its parts using the specified order
        const orderMap = { t: TagField, c: ContextField, p: ProjectField};
        let words = [];
        if (taskObj[PriorityField]) {
            words.push(taskObj[PriorityField]);
        }
        words.push(taskObj['task']);
        for (const ch of fieldOrder) {
            if (taskObj[orderMap[ch]].length) {
                words.push(taskObj[orderMap[ch]].sort().join(' '));
            }
        }
        return words.join(' ');
    }
};
