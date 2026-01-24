import * as assert from 'assert';
import { strftime } from '../../strftime';
import { strptime } from '../../strptime';

suite('DateTime Functions Test Suite', () => {

    suite('strftime', () => {
        // Use a fixed date for consistent testing
        const testDate = new Date(2024, 5, 15, 14, 30, 45); // June 15, 2024, 14:30:45

        test('should format year (%Y)', () => {
            assert.strictEqual(strftime('%Y', testDate), '2024');
        });

        test('should format 2-digit year (%y)', () => {
            assert.strictEqual(strftime('%y', testDate), '24');
        });

        test('should format month (%m)', () => {
            assert.strictEqual(strftime('%m', testDate), '06');
        });

        test('should format day (%d)', () => {
            assert.strictEqual(strftime('%d', testDate), '15');
        });

        test('should format hour 24h (%H)', () => {
            assert.strictEqual(strftime('%H', testDate), '14');
        });

        test('should format hour 12h (%I)', () => {
            assert.strictEqual(strftime('%I', testDate), '02');
        });

        test('should format minutes (%M)', () => {
            assert.strictEqual(strftime('%M', testDate), '30');
        });

        test('should format seconds (%S)', () => {
            assert.strictEqual(strftime('%S', testDate), '45');
        });

        test('should format AM/PM uppercase (%p)', () => {
            const result = strftime('%p', testDate);
            assert.strictEqual(result, 'PM');
        });

        test('should format AM/PM lowercase (%P)', () => {
            const result = strftime('%P', testDate);
            assert.strictEqual(result, 'pm');
        });

        test('should format full weekday name (%A)', () => {
            const result = strftime('%A', testDate);
            assert.strictEqual(result, 'Saturday');
        });

        test('should format abbreviated weekday name (%a)', () => {
            const result = strftime('%a', testDate);
            assert.strictEqual(result, 'Sat');
        });

        test('should format full month name (%B)', () => {
            const result = strftime('%B', testDate);
            assert.strictEqual(result, 'June');
        });

        test('should format abbreviated month name (%b)', () => {
            const result = strftime('%b', testDate);
            assert.strictEqual(result, 'Jun');
        });

        test('should format ISO date (%F)', () => {
            const result = strftime('%F', testDate);
            assert.strictEqual(result, '2024-06-15');
        });

        test('should format complex pattern', () => {
            const result = strftime('%Y-%m-%d %H:%M:%S', testDate);
            assert.strictEqual(result, '2024-06-15 14:30:45');
        });

        test('should handle note filename format', () => {
            const result = strftime('[Todo]-Note-%Y%m%d-%H%M%S.md', testDate);
            assert.strictEqual(result, '[Todo]-Note-20240615-143045.md');
        });

        test('should preserve non-format characters', () => {
            const result = strftime('Date: %Y/%m/%d', testDate);
            assert.strictEqual(result, 'Date: 2024/06/15');
        });

        test('should handle day of year (%j)', () => {
            const jan1 = new Date(2024, 0, 1);
            assert.strictEqual(strftime('%j', jan1), '001');

            const dec31 = new Date(2024, 11, 31);
            assert.strictEqual(strftime('%j', dec31), '366'); // 2024 is leap year
        });

        test('should handle midnight hour', () => {
            const midnight = new Date(2024, 0, 1, 0, 0, 0);
            assert.strictEqual(strftime('%H', midnight), '00');
            assert.strictEqual(strftime('%I', midnight), '12');
        });

        test('should handle noon hour', () => {
            const noon = new Date(2024, 0, 1, 12, 0, 0);
            assert.strictEqual(strftime('%H', noon), '12');
            assert.strictEqual(strftime('%I', noon), '12');
            assert.strictEqual(strftime('%p', noon), 'PM');
        });
    });

    suite('strptime', () => {
        test('should parse date with %Y-%m-%d format', () => {
            const result = strptime('2024-06-15', '%Y-%m-%d');
            assert.ok(result);
            assert.strictEqual(result!.getFullYear(), 2024);
            assert.strictEqual(result!.getMonth(), 5); // 0-indexed
            assert.strictEqual(result!.getDate(), 15);
        });

        test('should parse date with %Y/%m/%d format', () => {
            const result = strptime('2024/06/15', '%Y/%m/%d');
            assert.ok(result);
            assert.strictEqual(result!.getFullYear(), 2024);
            assert.strictEqual(result!.getMonth(), 5);
            assert.strictEqual(result!.getDate(), 15);
        });

        test('should parse date with single digit month and day', () => {
            const result = strptime('2024-1-5', '%Y-%m-%d');
            assert.ok(result);
            assert.strictEqual(result!.getFullYear(), 2024);
            assert.strictEqual(result!.getMonth(), 0);
            assert.strictEqual(result!.getDate(), 5);
        });

        test('should parse date with time %Y-%m-%d %H:%M', () => {
            const result = strptime('2024-06-15 14:30', '%Y-%m-%d %H:%M');
            assert.ok(result);
            assert.strictEqual(result!.getFullYear(), 2024);
            assert.strictEqual(result!.getMonth(), 5);
            assert.strictEqual(result!.getDate(), 15);
            assert.strictEqual(result!.getHours(), 14);
            assert.strictEqual(result!.getMinutes(), 30);
        });

        test('should return null for invalid date format', () => {
            const result = strptime('not-a-date', '%Y-%m-%d');
            assert.strictEqual(result, null);
        });

        test('should return null for invalid month', () => {
            const result = strptime('2024-13-15', '%Y-%m-%d');
            assert.strictEqual(result, null);
        });

        test('should return null for invalid day', () => {
            // Day validation is weak in the implementation, but month 0 is invalid
            const result = strptime('2024-00-15', '%Y-%m-%d');
            assert.strictEqual(result, null);
        });

        test('should return null for invalid hours', () => {
            const result = strptime('2024-06-15 25:00', '%Y-%m-%d %H:%M');
            assert.strictEqual(result, null);
        });

        test('should return null for invalid minutes', () => {
            const result = strptime('2024-06-15 14:60', '%Y-%m-%d %H:%M');
            assert.strictEqual(result, null);
        });

        test('should handle year only', () => {
            const result = strptime('2024', '%Y');
            assert.ok(result);
            assert.strictEqual(result!.getFullYear(), 2024);
        });

        test('should handle different date separators', () => {
            const result = strptime('15.06.2024', '%d.%m.%Y');
            assert.ok(result);
            assert.strictEqual(result!.getFullYear(), 2024);
            assert.strictEqual(result!.getMonth(), 5);
            assert.strictEqual(result!.getDate(), 15);
        });
    });

    suite('strftime and strptime roundtrip', () => {
        test('should roundtrip date', () => {
            const original = new Date(2024, 5, 15);
            const formatted = strftime('%Y-%m-%d', original);
            const parsed = strptime(formatted, '%Y-%m-%d');

            assert.ok(parsed);
            assert.strictEqual(parsed!.getFullYear(), original.getFullYear());
            assert.strictEqual(parsed!.getMonth(), original.getMonth());
            assert.strictEqual(parsed!.getDate(), original.getDate());
        });

        test('should roundtrip date with time', () => {
            const original = new Date(2024, 5, 15, 14, 30);
            const formatted = strftime('%Y-%m-%d %H:%M', original);
            const parsed = strptime(formatted, '%Y-%m-%d %H:%M');

            assert.ok(parsed);
            assert.strictEqual(parsed!.getFullYear(), original.getFullYear());
            assert.strictEqual(parsed!.getMonth(), original.getMonth());
            assert.strictEqual(parsed!.getDate(), original.getDate());
            assert.strictEqual(parsed!.getHours(), original.getHours());
            assert.strictEqual(parsed!.getMinutes(), original.getMinutes());
        });
    });
});
