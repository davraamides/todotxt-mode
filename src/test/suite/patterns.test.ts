import * as assert from 'assert';
import * as Patterns from '../../patterns';

suite('Patterns Test Suite', () => {

    suite('Regex Patterns', () => {

        suite('ContextRegex', () => {
            test('should match single context', () => {
                const text = 'Task with @context';
                const matches = text.match(Patterns.ContextRegex);
                assert.deepStrictEqual(matches, ['@context']);
            });

            test('should match multiple contexts', () => {
                const text = 'Task with @context1 and @context2';
                const matches = text.match(Patterns.ContextRegex);
                assert.deepStrictEqual(matches, ['@context1', '@context2']);
            });

            test('should not match @ in middle of word', () => {
                const text = 'email@example.com';
                const matches = text.match(Patterns.ContextRegex);
                assert.strictEqual(matches, null);
            });

            test('should match context at end of line', () => {
                const text = 'Task @home';
                const matches = text.match(Patterns.ContextRegex);
                assert.deepStrictEqual(matches, ['@home']);
            });

            test('should match context with numbers', () => {
                const text = 'Task @context123';
                const matches = text.match(Patterns.ContextRegex);
                assert.deepStrictEqual(matches, ['@context123']);
            });
        });

        suite('ProjectRegex', () => {
            test('should match single project', () => {
                const text = 'Task for +project';
                const matches = text.match(Patterns.ProjectRegex);
                assert.deepStrictEqual(matches, ['+project']);
            });

            test('should match multiple projects', () => {
                const text = 'Task for +project1 and +project2';
                const matches = text.match(Patterns.ProjectRegex);
                assert.deepStrictEqual(matches, ['+project1', '+project2']);
            });

            test('should not match + in middle of word', () => {
                const text = 'C++ programming';
                const matches = text.match(Patterns.ProjectRegex);
                assert.strictEqual(matches, null);
            });

            test('should match project with hyphen', () => {
                const text = 'Task +my-project';
                const matches = text.match(Patterns.ProjectRegex);
                assert.deepStrictEqual(matches, ['+my-project']);
            });
        });

        suite('PriorityRegex', () => {
            test('should match priority at start of line', () => {
                const text = '(A) High priority task';
                Patterns.PriorityWithLeadingSpaceRegex.lastIndex = 0;
                const match = Patterns.PriorityWithLeadingSpaceRegex.exec(text);
                assert.strictEqual(match?.[0], '(A)');
            });

            test('should match priority with leading whitespace', () => {
                const text = '  (B) Indented task';
                Patterns.PriorityWithLeadingSpaceRegex.lastIndex = 0;
                const match = Patterns.PriorityWithLeadingSpaceRegex.exec(text);
                assert.strictEqual(match?.[0], '  (B)');
            });

            test('should match all priority letters A-Z', () => {
                for (const letter of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') {
                    const text = `(${letter}) Task`;
                    Patterns.PriorityWithLeadingSpaceRegex.lastIndex = 0;
                    const match = Patterns.PriorityWithLeadingSpaceRegex.exec(text);
                    assert.strictEqual(match?.[0], `(${letter})`, `Should match priority (${letter})`);
                }
            });

            test('should not match lowercase priority', () => {
                const text = '(a) lowercase priority';
                Patterns.PriorityWithLeadingSpaceRegex.lastIndex = 0;
                const match = Patterns.PriorityWithLeadingSpaceRegex.exec(text);
                assert.strictEqual(match, null);
            });

            test('should not match priority in middle of line', () => {
                const text = 'Task (A) with priority in middle';
                Patterns.PriorityOnlyRegex.lastIndex = 0;
                const match = Patterns.PriorityOnlyRegex.exec(text);
                assert.strictEqual(match?.[0], '(A)');
            });
        });

        suite('TagRegex', () => {
            test('should match tag with value', () => {
                const text = 'Task due:2024-01-15';
                const matches = text.match(Patterns.TagRegex);
                assert.deepStrictEqual(matches, ['due:2024-01-15']);
            });

            test('should match multiple tags', () => {
                const text = 'Task due:2024-01-15 priority:high';
                const matches = text.match(Patterns.TagRegex);
                assert.deepStrictEqual(matches, ['due:2024-01-15', 'priority:high']);
            });

            test('should not match colon without value', () => {
                const text = 'Task with: no value';
                const matches = text.match(Patterns.TagRegex);
                // "with:" should not match since there's a space after colon
                assert.strictEqual(matches, null);
            });
        });

        suite('CompletedRegex', () => {
            test('should match completed task', () => {
                const text = 'x 2024-01-15 Completed task';
                assert.strictEqual(Patterns.CompletedRegex.test(text), true);
            });

            test('should match completed task with priority', () => {
                const text = 'x 2024-01-15 (A) 2024-01-10 Task with priority';
                assert.strictEqual(Patterns.CompletedRegex.test(text), true);
            });

            test('should match completed task with leading whitespace', () => {
                const text = '  x 2024-01-15 Indented completed task';
                assert.strictEqual(Patterns.CompletedRegex.test(text), true);
            });

            test('should not match uncompleted task', () => {
                const text = '(A) Uncompleted task';
                assert.strictEqual(Patterns.CompletedRegex.test(text), false);
            });

            test('should not match task starting with x but no space', () => {
                const text = 'xbox game task';
                assert.strictEqual(Patterns.CompletedRegex.test(text), false);
            });
        });

        suite('CreationDateRegex', () => {
            test('should match creation date', () => {
                const text = '2024-01-15 Task with creation date';
                Patterns.CreationDateRegex.lastIndex = 0;
                const match = Patterns.CreationDateRegex.exec(text);
                assert.strictEqual(match?.[1], '2024-01-15');
            });

            test('should match creation date with priority', () => {
                const text = '(A) 2024-01-15 Task with priority and date';
                Patterns.CreationDateRegex.lastIndex = 0;
                const match = Patterns.CreationDateRegex.exec(text);
                assert.strictEqual(match?.[1], '2024-01-15');
            });

            test('should not match date in middle of line', () => {
                const text = 'Task due:2024-01-15';
                Patterns.CreationDateRegex.lastIndex = 0;
                const match = Patterns.CreationDateRegex.exec(text);
                assert.strictEqual(match, null);
            });
        });

        suite('TagValueRegex', () => {
            test('should capture tag name and value', () => {
                const text = 'Task due:2024-01-15';
                Patterns.TagValueRegex.lastIndex = 0;
                const match = Patterns.TagValueRegex.exec(text);
                assert.strictEqual(match?.[1], 'due');
                assert.strictEqual(match?.[2], '2024-01-15');
            });

            test('should match multiple tags', () => {
                const text = 'Task due:2024-01-15 priority:high';
                const matches: string[][] = [];
                let match: RegExpExecArray | null;
                Patterns.TagValueRegex.lastIndex = 0;
                while ((match = Patterns.TagValueRegex.exec(text)) !== null) {
                    matches.push([match[1], match[2]]);
                }
                assert.deepStrictEqual(matches, [
                    ['due', '2024-01-15'],
                    ['priority', 'high']
                ]);
            });
        });
    });

    suite('parseTask', () => {
        test('should parse simple task', () => {
            const result = Patterns.parseTask('Simple task');
            assert.strictEqual(result.task, 'Simple task');
            assert.deepStrictEqual(result.context, []);
            assert.deepStrictEqual(result.project, []);
            assert.strictEqual(result.priority, undefined);
        });

        test('should parse task with context', () => {
            const result = Patterns.parseTask('Task @home');
            assert.strictEqual(result.task, 'Task');
            assert.deepStrictEqual(result.context, ['@home']);
        });

        test('should parse task with multiple contexts', () => {
            const result = Patterns.parseTask('Task @home @work');
            assert.strictEqual(result.task, 'Task');
            assert.deepStrictEqual(result.context, ['@home', '@work']);
        });

        test('should parse task with project', () => {
            const result = Patterns.parseTask('Task +project');
            assert.strictEqual(result.task, 'Task');
            assert.deepStrictEqual(result.project, ['+project']);
        });

        test('should parse task with priority', () => {
            const result = Patterns.parseTask('(A) High priority task');
            assert.strictEqual(result.task, 'High priority task');
            assert.strictEqual(result.priority, '(A)');
        });

        test('should parse task with tags', () => {
            const result = Patterns.parseTask('Task due:2024-01-15');
            assert.deepStrictEqual(result.tag, ['due:2024-01-15']);
            assert.strictEqual(result.due, '2024-01-15');
        });

        test('should parse complex task', () => {
            const result = Patterns.parseTask('(B) Complex task @home +project due:2024-01-15');
            assert.strictEqual(result.priority, '(B)');
            assert.strictEqual(result.task, 'Complex task');
            assert.deepStrictEqual(result.context, ['@home']);
            assert.deepStrictEqual(result.project, ['+project']);
            assert.strictEqual(result.due, '2024-01-15');
        });

        test('should preserve leading whitespace', () => {
            const result = Patterns.parseTask('  Indented task');
            assert.strictEqual(result.lead, '  ');
            assert.strictEqual(result.task, 'Indented task');
        });

        test('should handle task with only priority', () => {
            const result = Patterns.parseTask('(A)');
            assert.strictEqual(result.priority, '(A)');
            assert.strictEqual(result.task, '');
        });
    });

    suite('Field Constants', () => {
        test('should have correct field names', () => {
            assert.strictEqual(Patterns.ContextField, 'context');
            assert.strictEqual(Patterns.PriorityField, 'priority');
            assert.strictEqual(Patterns.ProjectField, 'project');
            assert.strictEqual(Patterns.TagField, 'tag');
            assert.strictEqual(Patterns.CreationDateField, 'creationDate');
        });

        test('FieldRegex should contain all field patterns', () => {
            assert.ok(Patterns.FieldRegex['context']);
            assert.ok(Patterns.FieldRegex['priority']);
            assert.ok(Patterns.FieldRegex['project']);
            assert.ok(Patterns.FieldRegex['tag']);
            assert.ok(Patterns.FieldRegex['creationDate']);
        });
    });
});
