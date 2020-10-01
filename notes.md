# notes

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

## Publishing Updates

You can publish new versions with `vsce publish` and auto-increment the version with one of the additional args: `major`, `minor` or `patch` to increment the three pats of the releasve version x.y.z, respectively.

I typically use

    vsce publish patch

to increment the patch portion (i.e. 1.2.3 -> 1.2.4). Make sure you udpate everything including `CHANGELOG.md` and check everything in and push first.

I've also started publishing to OVSX, described here: https://www.gitpod.io/blog/open-vsx/

    npx ovsx publish -p <token>
