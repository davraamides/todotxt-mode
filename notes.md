# notes

## Setup

Install npm and the VS Code extension development tools:

```
    brew install npm
    npm install -g yo generator-code
    npm install -g @vscode/vsce
```

## Packaging

Then to create a `.vsix` package for installing, `cd` to the root folder of the extension and enter

    vsce package

This will create a `.vsix` file that can be installed with `code`. Note that if you get an error about changing README.md, you have to change the first few lines of the file. Apparently, `vsce` checks for this to encourage you to write some real documentation for the extension before publishing it.

You can install the extension with

    code --install-extension todotxt-mode-0.0.1.vsix 

I had to restart VS code to see the effect. You can uninstall it from the UI or using `code --uninstall-extension`.

## Publishing Updates

You can publish new versions with `vsce publish`. I just manually change the version in `package.json` and then package it and publish it.

    vsce publish

NOTE: I ran into some issues where my Personal Access Token had expired but when I created a new one, I still couldn't publish. But then I ran `vsce login davraamides` first, which accepted the new PAT, and then `vsce publish` succeeded.

Make sure you udpate everything including `CHANGELOG.md` and check everything in and push first.

I've also started publishing to OVSX, described here: https://www.gitpod.io/blog/open-vsx/

    npx ovsx publish -p <token>
