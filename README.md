# todotxt-mode README

"todotxt-mode" is an extension for working with [todo.txt](https://github.com/todotxt/todo.txt) formatted files. It includes formatting of the different task "axes": *priority*, *project* and *context*, as well as a number of commands for automating and simplifying useful tasks and common workflows.

This extension was inspired by the [todo-txt](https://marketplace.visualstudio.com/items?itemName=rarnoldmobile.todo-txt) VS Code extension and borrows some ideas and features from it, but takes it in a direction to make it easier to implement a GTD-like process using `todo.txt`-formatted files.

## Features

### Highlighting
The extension uses decorators to highlight tags of task items.

- Syntax highlighting of task priority (`(A)`), context (`@label`) and project (`+label`) tags
- Priority format can vary among A, B and C-Z levels
- Syntax higlighting of metadata tags (`key:value1`)
- Additional formatting for `due:YYYY-MM-DD` date for past, present and future dates

![Highligted Tasks](https://raw.githubusercontent.com/davraamides/todotxt-mode/master/images/highlightedtasks.png)


### Task Management
Commands that help manage the task list include
- Mark tasks as complete
- Sort tasks by project, priority, context, due date or metadata tag
- Stable sort so task without the sort key are not effected
- Reformat task tags to a consistent sequence

![Manage Tsks](https://raw.githubusercontent.com/davraamides/todotxt-mode/master/images/sort-complete.gif)

### File Workflow Commands
There are a number of commands in the extension to support a GTD-like workflow.

- Move tasks from any file to the main *Todo* file (used when processing the *Inbox* file)
- Move tasks to the *Waiting* file
- Move tasks to the *Deferred* file
- Move completed tasks to the *Archive* file

![Manage Tsks](https://raw.githubusercontent.com/davraamides/todotxt-mode/master/images/move-tasks.gif)

### Todo.txt enhancements
The extension also includes a few enhancements that, while not part of the todo.txt spec, can be useful.
- Optional delimiter to break file into tasks section and notes section
- Save selection to a note and add to a task as a `note:<file>` metadata tag, with preview
- Optional delimiters in Markdown files for task section

![Create Note](https://raw.githubusercontent.com/davraamides/todotxt-mode/master/images/create-note.gif)
![Preview Note](https://raw.githubusercontent.com/davraamides/todotxt-mode/master/images/preview-note.gif)

## Extension Settings

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release of todotxt-mode

## Future Plans
