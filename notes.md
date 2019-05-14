# notes

## references
https://vscode.rocks/decorations/
https://vscode.rocks/testing/
https://vscode.rocks/codelens/

Project that uses settings in package.json and then retrieves them in code.
https://github.com/foxundermoon/vs-shell-format

https://vscode-docs.readthedocs.io/en/stable/

## Setup
Install Node.js from: https://nodejs.org/en/
This installs in /usr/local/bin/node and /usr/local/bin/npm

Thin install Yoeman. I had to Stop Little Snitch even though I wasn in passive mode for some reason.

    sudo npm install -g yo generator-code

NOTE: on Windows at work because of Palo HTTPS decrypt, I kept getting errors from npm about self-signed certs. I finally got around it by telling npm to use the http repository and not the https one:

    npm config set registry http://registry.npmjs.org/

Install the Typescript compiler

    sudo npm install -g typescript

Install the node types

    npm install @types/node

## Packaging

The `vsce` tool is for managing VS Code Extensions. Install the command with

    sudo npm install -g vsce

Then to create a `.vsix` package for installing, `cd` to the root folder of the extension and enter

    vsce package

This will create a `.vsix` file that can be installed with `code`. Note that if you get an error about changing README.md, you have to change the first few lines of the file. Apparently, `vsce` checks for this to encourage you to write some real documentation for the extension before publishing it.

You can install the extension with

    code --install-extension todotxt-mode-0.0.1.vsix 

I had to restart VS code to see the effect. You can uninstall it from the UI or
using `code --uninstall-extension`.

## Handling Waiting tasks
Need to decide if waiting is a tag or presence in a file. Choices:

- move to a file: gets it out of the way but can't have waiting tasks in other files
- context @wait: moves with the task but don't know who we are waiting for unless add a tag or context
- tag wait:tom: moves with the task and indicates who we are waiting on
- priority (W): kludgy but sort of makes sense

I think I'm going to start with a `waiting.txt` file because I want to keep `todo.txt` clean and focused on the things I'm trying to get done now (or this week). The good thing about presence in a file is that you don't need to manage the field if you complete it or move it back to `todo.txt`.

I should also think about adding a context for the person I'm waiting on but for now can just add that to the task before running the moveToWaiting command.

## Handling Deferred tasks
Similar to *waiting* tasks, I could use presence in a file (`incubate.txt` or `deferred.tx`), a context, a tag or a priority for deferred tasks. But these are not the same as *waiting* tasks because it's a decision I'm making to punt them for a while. It's more about priority but without the tediousness of modifying the priority. These are more like things you plan to do in the next few weeks, just not this week.

The one potential difference here is that there may be a date that is relevant to them, such as an upcoming presentation or meeting. So something like "prep for July R&C meeting" might be something I want to defer, but want to make sure I have my sights on it at least a week before the meeting. So then I may want to put a `due:<date>` (or `remind:<date>`?) to get my attention with time to complete it. But that isn't required for all deferred tasks. Maybe I will have a command where when I defer something it will prompt for how many days and then I can just enter something like "2d" or "1w" and it will add a `remind:<date>` (or `defer:<date>`) to that date so my scan process will note those.

## Sorting
I have the basics working but would like to ensure I'm using a stable sort algorithm such that I can sort by multiple fields and it will work (i.e. if I want it sorted by project, then priority, I shoudl be able to sort in reverse order, first by priority, then by project and it should work).

I should add keybindings using a chord so something like Ctrl+Shift+T c/p/j/t (context, priority, project, tag) or maybe Ctrl+Shift+T @(+: for the special characters they each use.

## Operators I Will Need
- get priority: return range and value
- replace priority
- append tag
- delete lines in file
- append lines to file
- open note file