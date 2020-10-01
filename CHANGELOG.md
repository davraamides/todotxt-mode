# Change Log

## 1.4.16 - 2020-10-01

- Added option to [remove priority indicator from completed tasks](https://github.com/davraamides/todotxt-mode/issues/20)
    The spec suggests this to allow sorting completed tasks by date. I made an option
    in the extension settings so as not to change behavior in the past. The default
    is false/off. See `todotxtmode.removePriorityFromCompletedTasks`.

- Added feature to [hover project file contents and link to file](https://github.com/davraamides/todotxt-mode/issues/17)
    This behaves like the `note:xxx` tag field but for `+project` tags. If there is a file
    named `project.md` for the corresponding `+project` field, the contents will be displayed when hovering over the project field and a link to open it is display in the hover box.

## 1.4.15 - 2020-05-17

- Fix [todotxt-mode.toggleCompletion should not overwrite creation date with completion date](https://github.com/davraamides/todotxt-mode/issues/15)
    Correct handling of creation date should be working now. There is an ambiguity in the [spec](https://github.com/todotxt/todo.txt) where it says "Optional - Creation Date (must be specified if completion date is)" which doesn't really make sense since an incomplete task would never have a completion date. In any case, there is one ambiguity I don't handle: if you have a task with a creation date such as:

        2020-05-17 a new task created today

    and then you "complete" it by just inserting  `"x "` at the beginning of the line, there is no way to tell if that is a completion date or a creation date. Since this extension always adds completion dates when using the `toggleCompletion` command, I assume in this case this date is also a completion date.

    Also added these related features:

    - Highlighting of creation dates controlled by style `todotxtmode.creationDateStyle.light.color` and `todotxtmode.creationDateStyle.dark.color`.
    - Sort tasks by creation date via command `todotxt-mode: Sort by CreationDate`.

## 1.4.14 - 2020-01-25

- Fix [Unable to figure out functionality of moveTasksToProject](https://github.com/davraamides/todotxt-mode/issues/7).
    This feature was never fully implemented but is now complete. The behavior is as follows:
    - If the current task is in a `todo` task file, the task will be removed from the current file and inserted into the appropriate project file.
    - If the task has a project tag and that tag is an *exact* match for a project file (excluding the       leading `+` character and adding in the `.md` extension), the task will be moved without prompting       the user for a file. Case is sensitive so a tag of `+Foo` will match the file `Foo.md` but not `foo.md`.
    - If the task does not have a project or the project tag is not an exact match with a filename, the user will be prompted to select a file.
    - A side effect of this process is that the project file will be opened in VS Code. The project tab become active for a second because the VS Code API does not currently allow loading a document without making it active.
    - The changes to both files are *not* saved. Thus if you make a mistake, you can easily undo both edits.
    - Multiple tasks are not supported right now as prompting for a file in a loop is not ideal, but it's also not clear if assuming all the tasks should be moved to the same project file is the right behavior.

## 1.4.13 - 2020-01-17

- Fix [move tasks to Someday file' moves tasks to incubate.txt instead](https://github.com/davraamides/todotxt-mode/issues/13). Changing any of the filenames requires restarting the extension, though.

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
