import * as assert from 'assert';
import * as Helpers from '../../helpers';

suite('Helpers Test Suite', () => {

    suite('getDateTimeParts', () => {
        test('should return date and time strings', () => {
            const testDate = new Date('2024-06-15T14:30:45.000Z');
            const [date, time] = Helpers.getDateTimeParts(testDate);

            // The date should be in yyyy-mm-dd format
            assert.match(date, /^\d{4}-\d{2}-\d{2}$/);
            // The time should be in hh:mm:ss format
            assert.match(time, /^\d{2}:\d{2}:\d{2}$/);
        });

        test('should use current date when no argument provided', () => {
            const [date, time] = Helpers.getDateTimeParts();

            assert.match(date, /^\d{4}-\d{2}-\d{2}$/);
            assert.match(time, /^\d{2}:\d{2}:\d{2}$/);
        });

        test('should return consistent date format', () => {
            // Use a date that's the same in all timezones for this specific test
            const testDate = new Date('2024-01-15T12:00:00.000Z');
            const [date] = Helpers.getDateTimeParts(testDate);

            // Just verify format, actual value may vary by timezone
            const parts = date.split('-');
            assert.strictEqual(parts.length, 3);
            assert.strictEqual(parts[0].length, 4); // year
            assert.strictEqual(parts[1].length, 2); // month
            assert.strictEqual(parts[2].length, 2); // day
        });
    });

    suite('isCompleted', () => {
        test('should return true for completed task', () => {
            assert.strictEqual(Helpers.isCompleted('x 2024-01-15 Completed task'), true);
        });

        test('should return true for completed task with priority', () => {
            assert.strictEqual(Helpers.isCompleted('x 2024-01-15 (A) Task'), true);
        });

        test('should return true for indented completed task', () => {
            assert.strictEqual(Helpers.isCompleted('  x 2024-01-15 Task'), true);
        });

        test('should return false for uncompleted task', () => {
            assert.strictEqual(Helpers.isCompleted('(A) Uncompleted task'), false);
        });

        test('should return false for task starting with x but no space', () => {
            assert.strictEqual(Helpers.isCompleted('xbox task'), false);
        });

        test('should return false for empty string', () => {
            assert.strictEqual(Helpers.isCompleted(''), false);
        });

        test('should return false for task with x in middle', () => {
            assert.strictEqual(Helpers.isCompleted('Task with x in it'), false);
        });
    });

    suite('isNoteTag', () => {
        test('should return true for note tag', () => {
            assert.strictEqual(Helpers.isNoteTag('note:myfile.txt'), true);
        });

        test('should return true for note tag with path', () => {
            assert.strictEqual(Helpers.isNoteTag('note:path/to/file.md'), true);
        });

        test('should return false for other tags', () => {
            assert.strictEqual(Helpers.isNoteTag('due:2024-01-15'), false);
        });

        test('should return false for context', () => {
            assert.strictEqual(Helpers.isNoteTag('@context'), false);
        });

        test('should return false for project', () => {
            assert.strictEqual(Helpers.isNoteTag('+project'), false);
        });

        test('should return false for plain text', () => {
            assert.strictEqual(Helpers.isNoteTag('plain text'), false);
        });
    });

    suite('nextPriority', () => {
        test('should return (A) for task without priority when incrementing', () => {
            const [oldPriority, newPriority] = Helpers.nextPriority('Task without priority', true);
            assert.strictEqual(oldPriority, '');
            assert.strictEqual(newPriority, '(A)');
        });

        test('should return (A) for task without priority when decrementing', () => {
            const [oldPriority, newPriority] = Helpers.nextPriority('Task without priority', false);
            assert.strictEqual(oldPriority, '');
            assert.strictEqual(newPriority, '(A)');
        });

        test('should increment priority from B to A', () => {
            const [oldPriority, newPriority] = Helpers.nextPriority('(B) Task', true);
            assert.strictEqual(oldPriority, '(B)');
            assert.strictEqual(newPriority, '(A)');
        });

        test('should decrement priority from A to B', () => {
            const [oldPriority, newPriority] = Helpers.nextPriority('(A) Task', false);
            assert.strictEqual(oldPriority, '(A)');
            assert.strictEqual(newPriority, '(B)');
        });

        test('should wrap from A to Z when incrementing', () => {
            const [oldPriority, newPriority] = Helpers.nextPriority('(A) Task', true);
            assert.strictEqual(oldPriority, '(A)');
            assert.strictEqual(newPriority, '(Z)');
        });

        test('should wrap from Z to A when decrementing', () => {
            const [oldPriority, newPriority] = Helpers.nextPriority('(Z) Task', false);
            assert.strictEqual(oldPriority, '(Z)');
            assert.strictEqual(newPriority, '(A)');
        });

        test('should handle priority with leading whitespace', () => {
            const [oldPriority, newPriority] = Helpers.nextPriority('  (C) Indented task', true);
            assert.strictEqual(oldPriority, '  (C)');
            assert.strictEqual(newPriority, '(B)');
        });

        test('should increment C to B', () => {
            const [, newPriority] = Helpers.nextPriority('(C) Task', true);
            assert.strictEqual(newPriority, '(B)');
        });

        test('should decrement B to C', () => {
            const [, newPriority] = Helpers.nextPriority('(B) Task', false);
            assert.strictEqual(newPriority, '(C)');
        });

        test('should handle middle priority M', () => {
            const [, newPriorityInc] = Helpers.nextPriority('(M) Task', true);
            assert.strictEqual(newPriorityInc, '(L)');

            const [, newPriorityDec] = Helpers.nextPriority('(M) Task', false);
            assert.strictEqual(newPriorityDec, '(N)');
        });
    });

    suite('isTodoFile', () => {
        // These tests depend on settings, but test the basic pattern matching
        test('should match .txt files by default', () => {
            // Default pattern is ^.*\.txt$
            assert.strictEqual(Helpers.isTodoFile('todo.txt'), true);
            assert.strictEqual(Helpers.isTodoFile('done.txt'), true);
        });

        test('should not match non-.txt files', () => {
            assert.strictEqual(Helpers.isTodoFile('readme.md'), false);
            assert.strictEqual(Helpers.isTodoFile('script.js'), false);
        });
    });

    suite('isDecoratedFile', () => {
        test('should return true for todo files', () => {
            assert.strictEqual(Helpers.isDecoratedFile('todo.txt'), true);
        });

        // Note: isProjectFile depends on settings.MarkdownDecorationBeginPattern
        // which may be empty in test environment
    });

    suite('excludeDecorations', () => {
        test('should exclude done.txt by default', () => {
            // Default pattern is ^done\.txt$
            assert.strictEqual(Helpers.excludeDecorations('done.txt'), true);
        });

        test('should not exclude todo.txt', () => {
            assert.strictEqual(Helpers.excludeDecorations('todo.txt'), false);
        });
    });
});
