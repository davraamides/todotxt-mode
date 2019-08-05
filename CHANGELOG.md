# Change Log

## 1.4.6 - 2019-08-05
- Fixed "Open Note" link in `note:xxx` tag to work properly on Windows

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
- Fix for [priority highlighting issue](https://github.com/davraamides/todotxt-mode/issues/1)

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

