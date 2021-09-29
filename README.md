# todotxt-mode README

"todotxt-mode" is an extension for working with [todo.txt](https://github.com/todotxt/todo.txt) formatted files. It includes formatting of the different task "axes": *priority*, *project* and *context*, as well as a number of commands for automating and simplifying useful tasks and common workflows.

This extension was inspired by the [todo-txt](https://marketplace.visualstudio.com/items?itemName=rarnoldmobile.todo-txt) VS Code extension and borrows some ideas and features from it, but takes it in a direction to make it easier to implement a GTD-like process using `todo.txt`-formatted files.

## Features

### Highlighting
The extension uses decorators to highlight tags of task items.

- Syntax highlighting of task priority (`(A)`), creation date, context (`@label`) and project (`+label`) tags
- Priority format can vary among A, B and C-Z levels
- Syntax higlighting of metadata tags (`key:value1`)
- Additional formatting for `due:YYYY-MM-DD` date for past, present and future dates

![Highligted Tasks](https://raw.githubusercontent.com/davraamides/todotxt-mode/master/images/highlightedtasks.png)


### Task Management
Commands that help manage the task list include
- Mark tasks as complete
- Sort tasks by project, priority, context, creation date, due date or metadata tag
- Stable sort so tasks without the sort key are not affected
- Reformat task tags to a consistent sequence

![Manage Tsks](https://raw.githubusercontent.com/davraamides/todotxt-mode/master/images/sort-complete.gif)

### File Workflow Commands
There are a number of commands in the extension to support a GTD-like workflow.

- Move tasks from any file to the main *Todo* file (used when processing the *Inbox* file)
- Move tasks to the *Waiting* file
- Move tasks to the *Someday* file
- Move completed tasks to the *Archive* file

![Manage Tsks](https://raw.githubusercontent.com/davraamides/todotxt-mode/master/images/move-tasks.gif)

### Todo.txt enhancements
The extension also includes a few enhancements that, while not part of the todo.txt spec, can be useful.
- Optional delimiter to break file into tasks section and notes section
- Save selection to a note and add to a task as a `note:<file>` metadata tag, with preview

![Create Note](https://raw.githubusercontent.com/davraamides/todotxt-mode/master/images/create-note.gif)
![Preview Note](https://raw.githubusercontent.com/davraamides/todotxt-mode/master/images/preview-note.gif)

- Highlight a section of a Markdown file that contains tasks

![Markdown Highlighting](https://raw.githubusercontent.com/davraamides/todotxt-mode/master/images/highlightedmarkdown.png)

## Extension Settings

### Commands

| Command                           | Description                                                       |
| --------------------------------- | ----------------------------------------------------------------- |
| `todotxt-mode.toggleCompletion`   | Toggle a task as complete                                         |
| `todotxt-mode.sortByContext`      | Sort all/selected tasks by context - `@label`                     |
| `todotxt-mode.sortByPriority`     | Sort all/selected tasks by priority - `(A)`                       |
| `todotxt-mode.sortByProject`      | Sort all/selected tasks by project - `+label`                     |
| `todotxt-mode.sortByTag`          | Sort all/selected tasks by metadata tag - `key:value`             |
| `todotxt-mode.sortByCreationDate` | Sort all/selected tasks by creation date                          |
| `todotxt-mode.sortByDueDate`      | Sort all/selected tasks by due date - `due:YYYY-MM-DD`            |
| `todotxt-mode.formatTasks`        | Format tasks with all tags in consistent order at end of the line |
| `todotxt-mode.archiveTasks`       | Move completed tasks to the *Done* file                           |
| `todotxt-mode.moveTasksToTodo`    | Move selected tasks to the *Todo* file                            |
| `todotxt-mode.moveTasksToWaiting` | Move selected tasks to the *Waiting* file                         |
| `todotxt-mode.moveTasksToSomeday` | Move selected tasks to the *Someday* file                         |
| `todotxt-mode.moveTasksToProject` | Move selected tasks to a Markdown project file                    |
| `todotxt-mode.createTaskNote`     | Create a Markdown note file from the selected note text           |
| `todotxt-mode.incrementPriority`  | Increment priority of selected tasks                              |
| `todotxt-mode.decrementPriority`  | Decrement priority of selected tasks                              |
| `todotxt-mode.removePriorities`   | Remove all priorities from tasks                                  |

### Styles

| Setting                                       | Description                                   | Default                                                         |
| --------------------------------------------- | --------------------------------------------- | --------------------------------------------------------------- |
| `todotxtmode.contextStyle.light.color`        | Color of context field in light mode          | <span style="color:rgb(40, 161, 86);">rgb(40, 161, 86)</span>   |
| `todotxtmode.contextStyle.dark.color`         | Color of context field in dark mode           | <span style="color:rgb(40, 161, 86);">rgb(40, 161, 86)</span>   |
| `todotxtmode.highPriorityStyle.light.color`   | Color of high priority field in light mode    | <span style="color:rgb(240, 226, 25);">rgb(240, 226, 25)</span> |
| `todotxtmode.highPriorityStyle.dark.color`    | Color of high priority field in dark mode     | <span style="color:rgb(240, 226, 25);">rgb(240, 226, 25)</span> |
| `todotxtmode.mediumPriorityStyle.light.color` | Color of medium priority field in light mode  | <span style="color:rgb(201, 189, 22);">rgb(201, 189, 22)</span> |
| `todotxtmode.mediumPriorityStyle.dark.color`  | Color of medium priority field in dark mode   | <span style="color:rgb(201, 189, 22);">rgb(201, 189, 22)</span> |
| `todotxtmode.lowPriorityStyle.light.color`    | Color of low priority field in light mode     | <span style="color:rgb(170, 160, 21);">rgb(170, 160, 21)</span> |
| `todotxtmode.lowPriorityStyle.dark.color`     | Color of low priority field in dark mode      | <span style="color:rgb(170, 160, 21);">rgb(170, 160, 21)</span> |
| `todotxtmode.projectStyle.light.color`        | Color of project field in light mode          | <span style="color:rgb(25, 172, 230);">rgb(25, 172, 230)</span> |
| `todotxtmode.projectStyle.dark.color`         | Color of project field in dark mode           | <span style="color:rgb(25, 172, 230);">rgb(25, 172, 230)</span> |
| `todotxtmode.tagStyle.light.color`            | Color of tag field in light mode              | <span style="color:rgb(179, 58, 172);">rgb(179, 58, 172)</span> |
| `todotxtmode.tagStyle.dark.color`             | Color of tag field in dark mode               | <span style="color:rgb(179, 58, 172);">rgb(179, 58, 172)</span> |
| `todotxtmode.creationDateStyle.light.color`   | Color of creation date field in light mode    | <span style="color:rgb(200, 130, 0);">rgb(200, 130, 0)</span>   |
| `todotxtmode.creationDateStyle.dark.color`    | Color of creation date field in light mode    | <span style="color:rgb(200, 130, 0);">rgb(200, 130, 0)</span>   |
| `todotxtmode.pastDateStyle.light.color`       | Color of past due date field in light mode    | <span style="color:rgb(177, 58, 28);">rgb(177, 58, 28)</span>   |
| `todotxtmode.pastDateStyle.dark.color`        | Color of past due date field in dark mode     | <span style="color:rgb(177, 58, 28);">rgb(177, 58, 28)</span>   |
| `todotxtmode.presentDateStyle.light.color`    | Color of present due date field in light mode | <span style="color:rgb(219, 216, 26);">rgb(219, 216, 26)</span> |
| `todotxtmode.presentDateStyle.dark.color`     | Color of present due date field in dark mode  | <span style="color:rgb(219, 216, 26);">rgb(219, 216, 26)</span> |
| `todotxtmode.futureDateStyle.light.color`     | Color of future due date field in light mode  | <span style="color:rgb(118, 194, 31);">rgb(118, 194, 31)</span> |
| `todotxtmode.futureDateStyle.dark.color`      | Color of future due date field in dark mode   | <span style="color:rgb(118, 194, 31);">rgb(118, 194, 31)</span> |
| `todotxtmode.completedStyle.textDecoration`   | Text decoration for completed tasks           | <span style="text-decoration:line-through;">line-through</span> |
| `todotxtmode.completedStyle.opacity`          | Opacity for completed tasks                   | <span style="opacity:0.5;">0.5</span>                           |

### Files

There are a few special files identifed for certain commands

| Setting                       | Description                              | Default       |
| ----------------------------- | ---------------------------------------- | ------------- |
| `todotxtmode.todoFilename`    | Name of main todo text file              | `todo.txt`    |
| `todotxtmode.doneFilename`    | Name of archive file for completed tasks | `done.txt`    |
| `todotxtmode.somedayFilename` | Name of file for someday/maybe tasks     | `someday.txt` |
| `todotxtmode.waitingFilename` | Name of file for waiting tasks           | `waiting.txt` |

### Keybindings

The extension ships with only one keybinding assigned but any of the commands can be bound to keyboard shortcuts in the usual manner with VS Code.

| Command                       | Default Keybinding |
| ----------------------------- | ------------------ |
| `extension.toggleCompletion`  | `ctrl+shift+x`     |
| `extension.incrementPriority` | `ctrl+shift+a`     |
| `extension.decrementPriority` | `ctrl+shift+z`     |


### Other Settings

The remaining settings define various behavior of the extension including which files should have this extension activate.

| Setting                                        | Descripiton                                                                                                                                  | Default                            |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| `todotxtmode.sortCompletedTasksToEnd`          | Alwasy place completed tasks at end of list when sorting                                                                                     | `true`                             |
| `todotxtmode.sectionDelimiterPattern`          | Regex pattern to delimit todo tasks section from other parts of the file                                                                     | `^--$`                             |
| `todotxtmode.todoFilePattern`                  | Regex pattern of filenames to apply todotxt-mode commands                                                                                    | `^.*\\.txt$`                       |
| `todotxtmode.excludeDecorationsFilePattern`    | Regex pattern of filenames to exclude todotxt-mode decorations                                                                               | `^done\\.txt$`                     |
| `todotxtmode.markdownFilePattern`              | Regex pattern of Markdown filenames to apply todotxt-mode commands using `markdownDecorationBeginPattern` and `markdownDecorationEndPattern` | <code>^.*\\.(md\|markdown)$</code> |
| `todotxtmode.markdownDecorationBeginPattern`   | Regex pattern of range in Markdown files to decorate                                                                                         | `^#+\\s+Tasks\\s*$`                |
| `todotxtmode.markdownDecorationEndPattern`     | Regex pattern of range in Markdown files to decorate                                                                                         | `^$`                               |
| `todotxtmode.removePriorityFromCompletedTasks` | Remove the priority tag from completed tasks                                                                                                 | `false`                            |
| `todotxtmode.noteFilenameFormat`               | Format for new note filenames. Can contain strftime-style format specifiers. The string '[Todo]', if used, will be selected.                 | `[Todo]-Note-%Y%m%d-%H%M%S.md`     |
| `todotxtmode.replaceNoteTextWithNoteTag`       | Automatically replace note text with the note tag when creating a note for a task                                                            | `false`                            |

## Release Notes

See [CHANGELOG](https://github.com/davraamides/todotxt-mode/blob/master/CHANGELOG.md)

