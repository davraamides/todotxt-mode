import * as vscode from 'vscode';
import { Helpers } from './helpers';
//
// Regular Expression patterns and related functions
//
// There are a number of regular expressions here that are used to match fields
// (priority, context, project, tag) as well as the completion status of a task
// line. The regex patterns are used in a few different ways and so there are
// variants of some of them:
//
// - Finding matches for decorations: for context, project and tag fields, it is
//   valid to have multiple occurrences in the same line. Thus the logic in
//   decorations assumes the patterns have the 'global' flag (end in /g). This
//   impacts the behavior of the RegEx object in that it saves state from one
//   call to the next in a loop in the property lastIndex. That way it knows
//   where to start in matching the next invocation. But if you use a global
//   RegEx just once, and then use it later, it won't have the behavior you
//   expect. You either have to reset it by setting lastIndex to 0 or you have
//   to run it through a loop until it exits. So even though a todo can have
//   only one priority, there is a /g option on the PriorityOnlyRegex so we can
//   use it consistently in the decoration logic. Note also that these patterns
//   match only the field and not any surrounding whitespace.
//
// - Extracting fields: in some cases we want to remove a field
//   (removePriorities and formatTasks) so we need a version without the /g
//   option but that consumes the terminating space. For priority, that will be
//   a trailing \s since they can occur at the beginning of a task, but for all
//   other fields it would be a leading \s since they can't occur at the
//   beginning but could at the end.
//
// - Leading whitespace support: this is a possibly non-standard feature I added
//   where task lines can be indented with whitespace. In these cases there are
//   special regex patterns to match priority and the completion tag since they
//   occur at the beginning (i.e. they begin with ^\s*).
//
export namespace Patterns {

    export const ContextField = 'context';
    export const PriorityField = 'priority';
    export const ProjectField = 'project';
    export const TagField = 'tag';

    // The context and project patterns are prefixed with non-word boundary (\B) as they
    // begin with non-word chars (+@). The tag pattern is prefixed with a word bounday (\b)
    // as tags begin with a word char.
    export const ContextRegex = /\B@\S+\b/g;
    export const PriorityWithLeadingSpaceRegex = /^\s*[(][A-Z][)]\B/g;
    export const PriorityWithTrailingSpaceRegex = /[(][A-Z][)]\s/;
    export const PriorityOnlyRegex = /[(][A-Z][)]\B/g;
    export const ProjectRegex = /\B\+\S+\b/g;
    export const TagRegex = /\b[^\s:]+:[^\s]+\b/g;

    export const TagValueRegex = /\b([^\s:]+):(\S+)\b/g;
    export const TagDateRegexString = "\\b(#TAG#):(\\d{4}-\\d{2}-\\d{2})\\b";
    export const CompletedGlobalRegex = /^\s*x .*$/g;
    export const CompletedRegex = /^\s*x\s/;

    // put them in a map so sorting by any field is consistent
    export const FieldRegex = {
        'context': ContextRegex,
        'priority': PriorityOnlyRegex,
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
            // BUG fails for completed task with priority as it resorts and puts priority in fron of "x yyyy-mm-dd"
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
        let taskObj = {line: line, context: [], priority: undefined, project: [], tag: [], lead: ''};
        let task = [];
        taskObj['lead'] = line.match(/^\s*/)[0];
        let words = line.replace(/^\s*/, '').split(/\s+/);
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

    // not currently used but I may refactor logic to use this more
    function parseField(line: string, fieldName: string): object {
        if (line.match(FieldRegex[fieldName])) {
            var value = '';
            return {line: line.replace(FieldRegex[fieldName], ''), field: value}
        }
        return { line, field: '' }
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
        return taskObj['lead'] + words.join(' ');
    }
};
