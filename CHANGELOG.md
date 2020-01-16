# Change Log

## 1.4.12 - 2020-01-15
- Add support for leading whitespace in tasks. Addresses [Whitespace at beginning of line throws of syntax highlighting](https://github.com/davraamides/todotxt-mode/issues/11) although I'm not sure if this is valid `todo.txt` syntax. But it could be useful at times.

## 1.4.10 - 2019-11-29
- Fix for [Task completion format is wrong when used with priority](https://github.com/davraamides/todotxt-mode/issues/6).
- Fix for [Sort by due date doesn't sort](https://github.com/davraamides/todotxt-mode/issues/10)

## 1.4.9 - 2019-09-18
- Added two new commands `incrementPriority` and `decrementPriority` bond to `Ctrl+Shift+A` and `Ctrl+Shift+Z`, by default, to increment or decrement the priority on a task. If the task has no priority, it is initially set to `(A)`.

## 1.4.7 - 2019-08-06
- Fix for ["Open note" link not properly rendered](https://github.com/davraamides/todotxt-mode/issues/2). Thanks to @xgid

## 1.4.6 - 2019-08-05
- Fix for [Unable to open 'file': File is a directory](https://github.com/davraamides/todotxt-mode/issues/3). Thanks to @jdckr

## 1.4.5 - 2019-06-22
- Fixed date decoration bug where only worked if tag was `due`
- Allow archive tasks from any todo text file, not just the main `todo.txt` one

## 1.4.4 - 2019-06-03
- Remove redundant code
- Handle no file in `ensureEndsWithEOL`

## 1.4.3 - 2019-05-25
- Support decoration in sections of Markdown files bracketed by `markdownDecorationBeginPattern` and `markdownDecorationEndPattern`
- Renamed `commandFilePattern` setting to `todoFilePattern`

## 1.4.2 - 2019-05-22
- Fix for [priority highlighting issue](https://github.com/davraamides/todotxt-mode/issues/1). Thanks to @jgoulet1994

## 1.4.0
- Added support for note files and hover preview of the link (e.g. `note:<file.md>`)
- Added styles for different priority levels
- Added styles for past, present and future due dates

## 1.3.0
- Added all settings and styles to package.json to support as User Preferences
- Added commands to move tasks between files
- Wrote README.md documentation file

## 1.0.0
- Initial release with basic decoration functionality

