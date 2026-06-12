<!-- last-updated: 2026-06-12T20:02:12.300639+00:00 -->

## 2026-01-24

* 2026-01-24 7:17am **Claude:**
  > This project has minimal tests. I'd like to create a more complete set of tests using the recommended VS Code extension testing approach documented here: https://code.visualstudio.com/api/working-with-extensions/testing-extension

* 2026-01-24 7:27am **Claude:**
  > I ran the tests and got one failure: [Pasted text #1 +23 lines]

* 2026-01-24 7:28am **Claude:**
  > Great, they all pass now!

* 2026-01-24 7:31am **Commit:**
  > Updated tests to be more comprehensive. Fixed bug in strptime.
  changed src/strptime.ts (+1, -1)
  deleted src/test/extension.test.ts
  added src/test/files/test_completion.txt (+6)
  changed src/test/files/test_sorting.txt (+4, -3)
  deleted src/test/patterns.test.ts
  deleted src/test/sorting.test.ts
  added src/test/suite/commands.test.ts (+317)
  added src/test/suite/datetime.test.ts (+216)
  changed src/test/suite/extension.test.ts (+43, -10)
  added src/test/suite/helpers.test.ts (+189)
  changed src/test/suite/index.ts (+28, -29)
  added src/test/suite/patterns.test.ts (+279)

* 2026-01-24 7:31am **Commit:**
  > Ignore out and .vscode-test folders
  changed .gitignore (+4, -2)

* 2026-01-24 8:07am **Commit:**
  > Merge pull request #56 from davraamides/dependabot/npm_and_yarn/word-wrap-1.2.4

* 2026-01-24 8:18am **Commit:**
  > Merge pull request #63 from wagner-sousa/feat/markdown-updates

* 2026-01-24 8:27am **Commit:**
  > merge pr 63, update notes

* 2026-01-24 8:32am **Commit:**
  > Bump js-yaml from 4.1.0 to 4.1.1
  changed package-lock.json (+1154, -423)

* 2026-01-24 8:35am **Commit:**
  > Release v1.4.33
  changed CHANGELOG.md (+9)
  changed package.json (+1, -1)

* 2026-01-24 8:36am **Commit:**
  > Merge pull request #68 from davraamides/dependabot/npm_and_yarn/js-yaml-4.1.1

## 2026-01-23

* 2026-01-23 7:46am **Commit:**
  > Update  markdown decoration range detection
  changed src/helpers.ts (+8, -3)

* 2026-01-23 3:06pm **Claude:**
  > /init

* 2026-01-23 3:09pm **Claude:**
  > This is a VS Code extension I wrote a long time ago and have not been keeping up to date. It was my first time programming in TypeScript. Can you review it to see if it's using the most up-to-date extension APIs and also if there are any improvements you can suggest in terms of how the code is organized or implemented?

* 2026-01-23 3:13pm **Claude:**
  > yes, please start with the settings caching bug

* 2026-01-23 3:22pm **Commit:**
  > Change settings to always refresh values from VS Code configuration. Added dispose support to decorations.ts.
  changed src/commands.ts (+6, -17)
  changed src/completion.ts (+1, -1)
  changed src/decorations.ts (+37, -13)
  changed src/extension.ts (+15, -1)
  changed src/files.ts (+1, -1)
  changed src/helpers.ts (+10, -9)
  changed src/note.ts (+2, -2)
  changed src/settings.ts (+87, -57)
  changed src/sorting.ts (+2, -2)

* 2026-01-23 3:24pm **Claude:**
  > yes, continue with the TypeScript fixes

* 2026-01-23 3:36pm **Commit:**
  > Remove @ts-nocheck from all files and fixed TypeScript errors
  changed src/commands.ts (+20, -23)
  changed src/completion.ts (+40, -22)
  changed src/decorations.ts (+85, -84)
  changed src/extension.ts (+46, -41)
  changed src/files.ts (+90, -95)
  changed src/helpers.ts (+44, -33)
  changed src/note.ts (+20, -11)
  changed src/patterns.ts (+53, -45)
  changed src/priority.ts (+49, -27)
  changed src/settings.ts (+41, -42)
  changed src/sorting.ts (+79, -45)

* 2026-01-23 3:37pm **Commit:**
  > Updated test package
  changed package-lock.json (+334, -237)
  changed package.json (-3)

* 2026-01-23 3:38pm **Claude:**
  > Can you continue with the other suggestions from the code review?

* 2026-01-23 3:41pm **Claude:**
  > /rate-limit-options

* 2026-01-23 8:53pm **Claude:**
  > resume

* 2026-01-23 8:57pm **Commit:**
  > Converted file operations to async. Consolidated duplicate code. Simplified command registration.
  changed src/commands.ts (+40, -72)
  changed src/extension.ts (+73, -70)
  changed src/files.ts (+50, -16)
  changed src/note.ts (+34, -30)

* 2026-01-23 8:58pm **Claude:**
  > Please fix the remaining issues

* 2026-01-23 9:32pm **Commit:**
  > Convert imports to ES modules. Update vscode.
  changed package.json (+15, -15)
  changed src/commands.ts (+63, -48)
  changed src/completion.ts (+95, -82)
  changed src/decorations.ts (+214, -197)
  changed src/extension.ts (+127, -113)
  changed src/files.ts (+220, -202)
  changed src/helpers.ts (+130, -138)
  changed src/note.ts (+56, -57)
  changed src/patterns.ts (+140, -121)
  changed src/priority.ts (+75, -70)
  added src/review.md (+146)
  changed src/settings.ts (+92, -95)
  changed src/sorting.ts (+162, -137)
  changed src/test/patterns.test.ts (+1, -1)

## 2023-07-20

* 2023-07-20 6:50am **Commit:**
  > Bump word-wrap from 1.2.3 to 1.2.4
  changed package-lock.json (+5, -4)

* _2023-07-20 (no LLM activity on mini — check other machines if you used an assistant that day)_

## 2023-04-21

* 2023-04-21 10:10am **Commit:**
  > updated project to latest version of VS Code extension development tools
  added .eslintrc.json (+24)
  changed .gitignore (+1, -3)
  changed .vscodeignore (+5, -4)
  changed package-lock.json (+3147, -3191)
  changed package.json (+345, -340)
  changed tsconfig.json (+5, -10)
  deleted tslint.json
  changed vsc-extension-quickstart.md (+12, -6)
  added webpack.config.js (+48)

* 2023-04-21 11:30am **Commit:**
  > merge changes from PR 55. had to ignore type errors until get around to cleaning it up
  changed CHANGELOG.md (+4)
  changed README.md (+1)
  changed package-lock.json (+171, -27)
  changed package.json (+13, -5)
  changed src/completion.ts (+20)
  changed src/decorations.ts (+1)
  changed src/extension.ts (+96, -82)
  changed src/files.ts (+1)
  changed src/helpers.ts (+1)
  changed src/note.ts (+1)
  changed src/patterns.ts (+1)
  changed src/priority.ts (+1)
  changed src/settings.ts (+3, -1)
  changed src/sorting.ts (+1)
  changed src/strftime.ts (+1)
  changed src/strptime.ts (+5, -3)
  deleted src/test/index.ts
  changed src/test/runTest.ts (+7, -14)

* _2023-04-21 (no LLM activity on mini — check other machines if you used an assistant that day)_

## 2021-11-17

* 2021-11-17 1:24pm **Commit:**
  > Merge pull request #43 from willburden/master

* 2021-11-17 1:24pm **Commit:**
  > 1.4.30
  changed package-lock.json (+1, -1)
  changed package.json (+1, -1)

* 2021-11-17 1:29pm **Commit:**
  > changes after updating npm
  changed package-lock.json (+2259, -94)

* _2021-11-17 (no LLM activity on mini — check other machines if you used an assistant that day)_

## 2021-11-16

* 2021-11-16 2:28pm **Commit:**
  > Unregister hover providers when unloaded
  changed src/extension.ts (+10, -2)

* 2021-11-16 3:08pm **Commit:**
  > Updated changelog
  changed CHANGELOG.md (+4)

* _2021-11-16 (no LLM activity on mini — check other machines if you used an assistant that day)_

## 2021-10-30

* 2021-10-30 2:06pm **Commit:**
  > ignore images used in documentation
  changed .vscodeignore (+3, -1)

* 2021-10-30 2:06pm **Commit:**
  > 1.4.29
  changed package-lock.json (+1, -1)
  changed package.json (+1, -1)

* _2021-10-30 (no LLM activity on mini — check other machines if you used an assistant that day)_

## 2021-10-09

* 2021-10-09 4:35pm **Commit:**
  > add tagDatePattern setting to allow specification of due date pattern
  changed package.json (+5)
  changed src/commands.ts (+1, -1)
  changed src/decorations.ts (+10, -4)
  changed src/patterns.ts (+12, -1)
  changed src/settings.ts (+1)
  changed src/sorting.ts (+29)
  added src/strptime.ts (+85)

* 2021-10-09 4:38pm **Commit:**
  > added entry for issue 33
  changed CHANGELOG.md (+5, -1)

* 2021-10-09 4:38pm **Commit:**
  > 1.4.28
  changed package-lock.json (+1, -1)
  changed package.json (+1, -1)

* _2021-10-09 (no LLM activity on mini — check other machines if you used an assistant that day)_

## 2021-09-28

* 2021-09-28 9:19pm **Commit:**
  > stuff
  changed package-lock.json (+3, -3)
  changed package.json (+4, -2)
  changed src/decorations.ts (+1, -1)
  changed src/test/extension.test.ts (+7, -3)
  added src/test/files/test_patterns.txt (+5)
  added src/test/patterns.test.ts (+45)
  added src/test/runTest.ts (+30)
  added src/test/suite/extension.test.ts (+15)
  added src/test/suite/index.ts (+37)

* 2021-09-28 9:19pm **Commit:**
  > Merge branch 'master' of https://github.com/davraamides/todotxt-mode

* 2021-09-28 9:20pm **Commit:**
  > Bump url-parse from 1.5.1 to 1.5.3
  changed package-lock.json (+3, -3)

* 2021-09-28 9:22pm **Commit:**
  > Merge pull request #40 from davraamides/dependabot/npm_and_yarn/url-parse-1.5.3

* 2021-09-28 10:25pm **Commit:**
  > fix for issue 30
  changed CHANGELOG.md (+4)
  changed package-lock.json (+278, -575)
  changed package.json (+9, -9)
  changed src/completion.ts (-1)
  changed src/note.ts (-1)
  changed src/patterns.ts (+4, -1)
  changed src/priority.ts (+8, -4)
  changed src/sorting.ts (+3, -1)

* 2021-09-28 10:25pm **Commit:**
  > 1.4.26
  changed package-lock.json (+1, -1)
  changed package.json (+1, -1)

* 2021-09-28 10:29pm **Commit:**
  > 1.4.27
  changed package-lock.json (+1, -1)
  changed package.json (+1, -1)

* _2021-09-28 (no LLM activity on mini — check other machines if you used an assistant that day)_

## 2021-07-14

* 2021-07-14 6:58am **Commit:**
  > Merge pull request #35 from hukacode/patch-1

* _2021-07-14 (no LLM activity on mini — check other machines if you used an assistant that day)_

## 2021-07-13

* 2021-07-13 11:17am **Commit:**
  > Update README.md
  changed README.md (-1)

* _2021-07-13 (no LLM activity on mini — check other machines if you used an assistant that day)_

## 2021-05-31

* 2021-05-31 8:51am **Commit:**
  > Merge pull request #31 from dehero/master

* 2021-05-31 8:51am **Commit:**
  > Merge branch 'master' of https://github.com/davraamides/todotxt-mode Merging pull request from @dehro to support non-latin contexts, projects and tags. This simply removes the `\b` word boundary tags from the various regexes. I may need to make other adjustments once I test this more thoroughly.

* 2021-05-31 9:00am **Commit:**
  > release comment for fix to issue #31
  changed CHANGELOG.md (+5)

* 2021-05-31 9:00am **Commit:**
  > 1.4.25
  changed package-lock.json (+1, -1)
  changed package.json (+1, -1)

* _2021-05-31 (no LLM activity on mini — check other machines if you used an assistant that day)_

## 2021-05-27

* 2021-05-27 5:49am **Commit:**
  > Allow tag names and values to contain non-Latin characters
  changed src/patterns.ts (+2, -2)

* _2021-05-27 (no LLM activity on mini — check other machines if you used an assistant that day)_

## 2021-05-26

* 2021-05-26 8:48am **Commit:**
  > Allow projects and contexts to contain non-Latin characters
  changed src/patterns.ts (+2, -2)

* _2021-05-26 (no LLM activity on mini — check other machines if you used an assistant that day)_

## 2021-05-10

* 2021-05-10 8:17am **Commit:**
  > Merge pull request #29 from davraamides/dependabot/npm_and_yarn/lodash-4.17.21

* 2021-05-10 8:22am **Commit:**
  > Merge branch 'master' of https://github.com/davraamides/todotxt-mode Merged dependabot update of lodash to 4.17.21

* 2021-05-10 9:49am **Commit:**
  > fixed issue 30 where multi-line commands weren't working. seems like TextEditor.edit cannot be called multiple times in a loop so I queue up changes in a list and then apply them in one edit call. updated README which was a little out of date
  changed CHANGELOG.md (+3)
  changed README.md (+5, -3)
  changed package.json (+1, -1)
  changed src/completion.ts (+16, -7)
  changed src/priority.ts (+19, -8)

* 2021-05-10 9:49am **Commit:**
  > 1.4.23
  changed package-lock.json (+1, -1)
  changed package.json (+1, -1)

* 2021-05-10 9:51am **Commit:**
  > updates for out of date packages
  changed CHANGELOG.md (+1, -1)
  changed package-lock.json (+233, -154)
  changed package.json (+1, -1)

* 2021-05-10 9:51am **Commit:**
  > 1.4.24
  changed package-lock.json (+1, -1)
  changed package.json (+1, -1)

* _2021-05-10 (no LLM activity on mini — check other machines if you used an assistant that day)_

## 2021-05-08

* 2021-05-08 12:10pm **Commit:**
  > Bump lodash from 4.17.20 to 4.17.21
  changed package-lock.json (+3, -3)
  changed package.json (+1, -1)

* _2021-05-08 (no LLM activity on mini — check other machines if you used an assistant that day)_

## 2021-05-07

* 2021-05-07 9:29am **Commit:**
  > Bump url-parse from 1.4.6 to 1.5.1
  changed package-lock.json (+4, -4)

* 2021-05-07 11:55am **Commit:**
  > Merge pull request #28 from davraamides/dependabot/npm_and_yarn/url-parse-1.5.1

* 2021-05-07 12:15pm **Commit:**
  > fixe issue 27, adding option to automatically replace note text with note tag
  changed CHANGELOG.md (+4)
  changed package.json (+5)
  changed src/note.ts (+13, -6)
  changed src/settings.ts (+1, -1)

* 2021-05-07 12:23pm **Commit:**
  > 1.4.21
  changed package-lock.json (+1, -1)
  changed package.json (+1, -1)

* _2021-05-07 (no LLM activity on mini — check other machines if you used an assistant that day)_

## 2021-02-10

* 2021-02-10 5:16pm **Commit:**
  > implement issue 25, customizable note filename
  changed CHANGELOG.md (+5)
  changed package.json (+5)
  changed src/decorations.ts (+11, -7)
  changed src/helpers.ts (+12, -12)
  changed src/note.ts (+14, -4)
  changed src/settings.ts (+1)
  added src/strftime.ts (+73)

* 2021-02-10 5:16pm **Commit:**
  > 1.4.19
  changed package-lock.json (+1, -1)
  changed package.json (+1, -1)

* 2021-02-10 5:20pm **Commit:**
  > fix error with JS Date
  changed src/strftime.ts (+1, -1)

* 2021-02-10 5:20pm **Commit:**
  > 1.4.20
  changed package-lock.json (+1, -1)
  changed package.json (+1, -1)

* 2021-02-10 7:11pm **Commit:**
  > fixed typo
  changed CHANGELOG.md (+1, -1)

* _2021-02-10 (no LLM activity on mini — check other machines if you used an assistant that day)_

## 2020-11-06

* 2020-11-06 8:18am **Commit:**
  > cleanup ignored files
  deleted .DS_Store
  changed .gitignore (+2)
  deleted .vscode/extensions.json
  deleted .vscode/launch.json
  deleted .vscode/settings.json
  deleted .vscode/tasks.json

* _2020-11-06 (no LLM activity on mini — check other machines if you used an assistant that day)_

## 2020-10-05

* 2020-10-05 2:01pm **Commit:**
  > Add missing commands and settings
  changed README.md (+12, -9)

* _2020-10-05 (no LLM activity on mini — check other machines if you used an assistant that day)_

## 2020-10-01

* 2020-10-01 12:46pm **Commit:**
  > Changes for issues #17 and #20
  changed CHANGELOG.md (+11)
  changed notes.md (+4)
  changed package-lock.json (+54, -40)
  changed package.json (+9, -3)
  changed src/completion.ts (+11, -2)
  changed src/extension.ts (+37, -9)
  changed src/settings.ts (+1)

* 2020-10-01 12:50pm **Commit:**
  > 1.4.17
  changed package-lock.json (+1, -1)
  changed package.json (+1, -1)

* 2020-10-01 12:57pm **Commit:**
  > 1.4.18
  changed package-lock.json (+1, -1)
  changed package.json (+1, -1)

* _2020-10-01 (no LLM activity on mini — check other machines if you used an assistant that day)_

## 2020-05-18

* 2020-05-18 11:54am **Commit:**
  > add version for minimist to fix security issue
  changed package.json (+1)

* 2020-05-18 11:54am **Commit:**
  > 1.4.16
  changed package-lock.json (+1, -1)
  changed package.json (+1, -1)

* 2020-05-18 11:57am **Commit:**
  > updates
  changed notes.md (-58)

* _2020-05-18 (no LLM activity on mini — check other machines if you used an assistant that day)_

## 2020-05-17

* 2020-05-17 4:57pm **Commit:**
  > Merge branch 'master' of https://github.com/davraamides/todotxt-mode

* 2020-05-17 8:55pm **Commit:**
  > Support creation dates, add license, update documentation
  changed CHANGELOG.md (+30, -3)
  added LICENSE (+21)
  changed README.md (+34, -37)
  changed package.json (+26, -12)
  changed src/commands.ts (+4)
  changed src/completion.ts (+10, -5)
  changed src/decorations.ts (+11)
  changed src/patterns.ts (+3, -1)
  changed src/settings.ts (+4, -1)
  deleted t.js

* 2020-05-17 8:56pm **Commit:**
  > 1.4.15
  changed package-lock.json (+1, -1)
  changed package.json (+1, -1)

* _2020-05-17 (no LLM activity on mini — check other machines if you used an assistant that day)_

## 2020-04-15

* 2020-04-15 1:20pm **Commit:**
  > Fix typo
  changed package.json (+2, -2)

* _2020-04-15 (no LLM activity on mini — check other machines if you used an assistant that day)_

## 2020-01-25

* 2020-01-25 10:48am **Commit:**
  > Implement moveTasksToProject
  changed CHANGELOG.md (+10)
  changed src/commands.ts (+3, -65)
  changed src/decorations.ts (+1, -1)
  changed src/files.ts (+125, -7)
  changed src/helpers.ts (+18, -15)

* 2020-01-25 10:49am **Commit:**
  > 1.4.14
  changed package-lock.json (+1, -1)
  changed package.json (+1, -1)

* _2020-01-25 (no LLM activity on mini — check other machines if you used an assistant that day)_

## 2020-01-23

* 2020-01-23 3:18pm **Commit:**
  > Pseudo code for move-to-project feature
  changed src/commands.ts (+38)
  changed src/files.ts (+6, -1)

* 2020-01-23 3:19pm **Commit:**
  > Merge branch 'master' of https://github.com/davraamides/todotxt-mode

* _2020-01-23 (no LLM activity on mini — check other machines if you used an assistant that day)_

## 2020-01-17

* 2020-01-17 8:46am **Commit:**
  > Grammar fix
  changed src/note.ts (+2, -2)
  changed src/sorting.ts (+1, -1)

* 2020-01-17 10:38am **Commit:**
  > Reformat comments using 'rewrap' extension
  changed src/completion.ts (+6, -4)
  changed src/decorations.ts (+13, -12)
  changed src/note.ts (+6, -5)
  changed src/patterns.ts (+24, -19)
  changed src/settings.ts (+2, -2)
  changed src/sorting.ts (+7, -7)

* 2020-01-17 11:57am **Commit:**
  > Fix bug where filenames were not being pulled from settings
  changed CHANGELOG.md (+3)
  changed src/settings.ts (+4, -4)

* 2020-01-17 11:57am **Commit:**
  > 1.4.13
  changed package-lock.json (+1, -1)
  changed package.json (+1, -1)

* _2020-01-17 (no LLM activity on mini — check other machines if you used an assistant that day)_

## 2020-01-16

* 2020-01-16 5:51pm **Commit:**
  > Commented files
  changed notes.md (+21)
  changed src/completion.ts (+7, -1)
  changed src/decorations.ts (+16, -1)

* 2020-01-16 7:01pm **Commit:**
  > Added full pass of comments
  changed notes.md (-21)
  changed src/commands.ts (+3)
  changed src/completion.ts (+4, -1)
  changed src/decorations.ts (+3, -2)
  changed src/extension.ts (+10, -8)
  changed src/files.ts (+5, -1)
  changed src/helpers.ts (+10, -5)
  changed src/note.ts (+9, -1)
  changed src/patterns.ts (+30, -6)
  changed src/priority.ts (+3, -1)
  changed src/settings.ts (+6, -6)
  changed src/sorting.ts (+11, -1)

* _2020-01-16 (no LLM activity on mini — check other machines if you used an assistant that day)_

## 2020-01-15

* 2020-01-15 9:54am **Commit:**
  > Test python script
  added parse.py (+55)

* 2020-01-15 5:33pm **Commit:**
  > Test files for supporting leading spaces
  changed .vscode/launch.json (+10, -2)
  changed parse.py (+91, -6)
  added t.js (+3)

* 2020-01-15 10:30pm **Commit:**
  > Support leading whitespace
  changed parse.py (+55, -14)
  changed src/completion.ts (+5, -5)
  changed src/decorations.ts (+11, -8)
  changed src/helpers.ts (+3, -3)
  changed src/patterns.ts (+17, -6)
  changed src/priority.ts (+8, -8)
  changed src/sorting.ts (+8, -9)
  added test.txt (+19)
  changed todo.txt (+1, -1)

* 2020-01-15 10:34pm **Commit:**
  > Updated for new release
  changed CHANGELOG.md (+3)

* 2020-01-15 10:35pm **Commit:**
  > 1.4.11
  changed package-lock.json (+1, -1)
  changed package.json (+1, -1)

* 2020-01-15 10:39pm **Commit:**
  > updates for new library versions
  changed package-lock.json (+3, -3)
  changed package.json (+2, -1)

* 2020-01-15 10:39pm **Commit:**
  > 1.4.12
  changed package-lock.json (+1, -1)
  changed package.json (+1, -1)

* 2020-01-15 10:40pm **Commit:**
  > Bumped version because of vsce error
  changed CHANGELOG.md (+1, -1)

* _2020-01-15 (no LLM activity on mini — check other machines if you used an assistant that day)_

## 2019-12-04

* 2019-12-04 10:56am **Commit:**
  > Fixed some typos
  changed README.md (+18, -18)

* 2019-12-04 11:42am **Commit:**
  > Add preview of styles since Github won't render them
  changed README.md (+4)
  added images/styles.png

* _2019-12-04 (no LLM activity on mini — check other machines if you used an assistant that day)_

## 2019-12-03

* 2019-12-03 10:37am **Commit:**
  > Updated packages to address lodash security vulnerability
  changed package-lock.json (+28, -10)
  changed package.json (+1, -1)

* _2019-12-03 (no LLM activity on mini — check other machines if you used an assistant that day)_

## 2019-11-29

* 2019-11-29 9:31am **Commit:**
  > Bug fix for completion syntax with priority
  changed src/completion.ts (+16, -15)
  changed tsconfig.json (+1, -1)

* 2019-11-29 4:03pm **Commit:**
  > Bug fix for sorting by due date
  changed CHANGELOG.md (+4)
  changed notes.md (+11, -1)
  changed src/decorations.ts (+4, -4)
  changed src/patterns.ts (+2, -2)

* 2019-11-29 4:03pm **Commit:**
  > 1.4.10
  changed package-lock.json (+1, -1)
  changed package.json (+1, -1)

* 2019-11-29 4:14pm **Commit:**
  > Add reminders for packaging
  changed todo.txt (+2)

* _2019-11-29 (no LLM activity on mini — check other machines if you used an assistant that day)_

## 2019-09-18

* 2019-09-18 5:45pm **Commit:**
  > 1.4.8
  changed package-lock.json (+1, -1)
  changed package.json (+1, -1)

* 2019-09-18 5:46pm **Commit:**
  > Merge branch 'master' of https://github.com/davraamides/todotxt-mode

* 2019-09-18 5:48pm **Commit:**
  > Fix version
  changed CHANGELOG.md (+1, -1)

* 2019-09-18 5:48pm **Commit:**
  > 1.4.9
  changed package-lock.json (+1, -1)
  changed package.json (+1, -1)

* _2019-09-18 (no LLM activity on mini — check other machines if you used an assistant that day)_

## 2019-09-17

* 2019-09-17 5:59pm **Commit:**
  > Add inc/dec priority commmands and refactor code a bit.
  changed CHANGELOG.md (+3)
  changed done.txt (+2)
  changed package.json (+20)
  changed src/commands.ts (+14, -76)
  added src/completion.ts (+33)
  changed src/decorations.ts (-2)
  changed src/helpers.ts (+21)
  added src/note.ts (+39)
  changed src/patterns.ts (+1, -1)
  added src/priority.ts (+48)
  changed todo.txt (+1, -23)

* _2019-09-17 (no LLM activity on mini — check other machines if you used an assistant that day)_

## 2019-09-03

* 2019-09-03 7:57am **Commit:**
  > Added todo to move to new vscode.workspace.fs API
  changed todo.txt (+1)

* _2019-09-03 (no LLM activity on mini — check other machines if you used an assistant that day)_

## 2019-08-06

* 2019-08-06 9:24am **Commit:**
  > Fixed issue 2 with note file path bug
  changed CHANGELOG.md (+5, -2)
  changed src/commands.ts (+7, -3)
  changed src/extension.ts (+2, -1)

* 2019-08-06 9:25am **Commit:**
  > 1.4.7
  changed package-lock.json (+1, -1)
  changed package.json (+1, -1)

* _2019-08-06 (no LLM activity on mini — check other machines if you used an assistant that day)_

## 2019-08-05

* 2019-08-05 9:02am **Commit:**
  > Change file prefix based on OS platform
  changed src/extension.ts (+6, -1)

* 2019-08-05 9:03am **Commit:**
  > Merge branch 'master' of https://github.com/davraamides/todotxt-mode

* 2019-08-05 9:06am **Commit:**
  > Updated changelog
  changed CHANGELOG.md (+3)

* 2019-08-05 9:06am **Commit:**
  > 1.4.6
  changed package-lock.json (+1, -1)
  changed package.json (+1, -1)

* _2019-08-05 (no LLM activity on mini — check other machines if you used an assistant that day)_

## 2019-06-22

* 2019-06-22 5:39pm **Commit:**
  > Fixed date bug. Allow archive from any file
  changed done.txt (+3)
  changed src/decorations.ts (+6, -1)
  changed src/files.ts (-5)
  changed src/patterns.ts (+1, -1)
  changed todo.txt (+1, -2)

* 2019-06-22 5:42pm **Commit:**
  > Updated log
  changed CHANGELOG.md (+8)

* 2019-06-22 5:43pm **Commit:**
  > 1.4.5
  changed package-lock.json (+1, -1)
  changed package.json (+1, -1)

* _2019-06-22 (no LLM activity on mini — check other machines if you used an assistant that day)_

## 2019-06-03

* 2019-06-03 5:38pm **Commit:**
  > Handle no file in ensureEndsWithEOL
  changed src/files.ts (+10, -12)
  changed src/helpers.ts (+3, -1)

* 2019-06-03 5:42pm **Commit:**
  > Remove redundat code
  changed src/files.ts (-4)

* 2019-06-03 5:42pm **Commit:**
  > 1.4.4
  changed package-lock.json (+1, -1)
  changed package.json (+1, -1)

* _2019-06-03 (no LLM activity on mini — check other machines if you used an assistant that day)_

## 2019-05-25

* 2019-05-25 4:59pm **Commit:**
  > Add Markdown section decorations
  changed .vscode/tasks.json (+5)
  changed CHANGELOG.md (+17, -4)
  changed notes.md (+9)
  changed package.json (+18, -2)
  changed src/decorations.ts (+3, -3)
  changed src/extension.ts (+2, -1)
  changed src/helpers.ts (+47, -2)
  changed src/settings.ts (+4, -1)
  changed todo.txt (+3)

* 2019-05-25 4:59pm **Commit:**
  > 1.4.3
  changed package-lock.json (+1, -1)
  changed package.json (+1, -1)

* 2019-05-25 5:28pm **Commit:**
  > Update README for Markdown highlighting
  changed README.md (+14, -11)
  added images/highligtedmarkdown.png

* 2019-05-25 5:30pm **Commit:**
  > Rename file
  moved images/highligtedmarkdown.png → images/highlightedmarkdown.png

* _2019-05-25 (no LLM activity on mini — check other machines if you used an assistant that day)_

## 2019-05-24

* 2019-05-24 4:54pm **Commit:**
  > Refactoring and EOL bug fix
  changed src/commands.ts (+1, -1)
  changed src/decorations.ts (-12)
  changed src/files.ts (+20, -5)
  changed src/helpers.ts (+3, -1)
  changed src/settings.ts (+1)
  changed src/sorting.ts (+1, -1)
  added test.js (+5)
  added test.ts (+5)
  changed todo.txt (+21, -5)

* 2019-05-24 5:24pm **Commit:**
  > remove test files
  deleted test.js
  deleted test.ts

* _2019-05-24 (no LLM activity on mini — check other machines if you used an assistant that day)_

## 2019-05-22

* 2019-05-22 5:26pm **Commit:**
  > 1.4.0
  changed package-lock.json (+1, -1)
  changed package.json (+1, -1)

* 2019-05-22 5:29pm **Commit:**
  > 1.4.1
  changed package-lock.json (+1, -1)
  changed package.json (+1, -1)

* 2019-05-22 8:16pm **Commit:**
  > Fixed regex for priorities

* 2019-05-22 8:19pm **Commit:**
  > 1.4.2
  changed package-lock.json (+1, -1)
  changed package.json (+1, -1)

* _2019-05-22 (no LLM activity on mini — check other machines if you used an assistant that day)_

## 2019-05-21

* 2019-05-21 1:08pm **Commit:**
  > Added a few tasks
  changed todo.txt (+5)

* _2019-05-21 (no LLM activity on mini — check other machines if you used an assistant that day)_

## 2019-05-20

* 2019-05-20 9:56am **Commit:**
  > Fixed bug in prority pattern which failed to match Priority decorator
  changed src/patterns.ts (+1, -1)

* 2019-05-20 9:57am **Commit:**
  > 1.3.0
  changed package-lock.json (+1, -1)
  changed package.json (+1, -1)

* _2019-05-20 (no LLM activity on mini — check other machines if you used an assistant that day)_

## 2019-05-19

* 2019-05-19 8:08am **Commit:**
  > Added GIFs for README
  added images/create-note.gif
  added images/move-tasks.gif
  added images/preview-note.gif
  added images/sort-complete.gif

* 2019-05-19 8:13am **Commit:**
  > Updates for README
  changed .DS_Store
  changed README.md (+43, -9)
  added colors.html (+5)
  added demo.md (+16)
  added demo.orig (+15)
  added demo.txt (+15)
  added images/.DS_Store
  deleted images/hovernote.png
  added incubate.txt (+17)
  changed notes.md (+10, -1)
  changed package.json (+8, -8)
  added spec.txt (+11)
  changed src/commands.ts (+18, -1)
  changed src/decorations.ts (+5, -1)
  changed src/extension.ts (+7, -2)
  changed src/settings.ts (+27, -27)
  changed todo.txt (+10, -11)
  changed waiting.txt (+2)

* 2019-05-19 1:45pm **Commit:**
  > Added setttings to README.md
  changed .DS_Store
  changed README.md (+82, -4)
  changed done.txt (+6)
  changed package.json (+1, -1)
  changed todo.txt (+6, -10)

* 2019-05-19 4:30pm **Commit:**
  > 1.1.0
  changed package-lock.json (+1, -1)
  changed package.json (+1, -1)

* 2019-05-19 4:41pm **Commit:**
  > Cleaned up after publishing
  deleted colors.html
  deleted demo.md
  deleted demo.orig
  deleted demo.txt
  changed done.txt (+3)
  deleted incubate.txt
  deleted test.txt
  changed todo.txt (-3)
  deleted waiting.txt

* 2019-05-19 4:45pm **Commit:**
  > Fix type
  changed todo.txt (+1, -1)

* 2019-05-19 4:46pm **Commit:**
  > 1.2.0
  changed package-lock.json (+1, -1)
  changed package.json (+1, -1)

* 2019-05-19 8:46pm **Commit:**
  > Fixed path for note file. Changed RE for priority
  changed done.txt (+2)
  changed spec.txt (+1, -1)
  changed src/commands.ts (+2, -8)
  changed src/extension.ts (+3, -3)
  changed src/patterns.ts (+1, -1)
  changed todo.txt (-2)

* 2019-05-19 8:47pm **Commit:**
  > 1.3.0
  changed package-lock.json (+1, -1)
  changed package.json (+1, -1)

* _2019-05-19 (no LLM activity on mini — check other machines if you used an assistant that day)_

## 2019-05-18

* 2019-05-18 5:25pm **Commit:**
  > Add screenshot
  added images/highlightedtasks.png

* 2019-05-18 5:42pm **Commit:**
  > Added hover image
  added images/hovernote.png

* _2019-05-18 (no LLM activity on mini — check other machines if you used an assistant that day)_

## 2019-05-14

* 2019-05-14 10:51am **Commit:**
  > Get working with Windows path
  changed notes.md (+4)
  changed src/extension.ts (+12, -6)
  changed todo.txt (+3, -1)

* 2019-05-14 5:56pm **Commit:**
  > Fixed Windows path
  changed src/extension.ts (+1, -5)

* _2019-05-14 (no LLM activity on mini — check other machines if you used an assistant that day)_

## 2019-05-13

* 2019-05-13 8:00pm **Commit:**
  > Add note preview in hover
  changed package.json (+120, -15)
  changed src/commands.ts (+8, -7)
  changed src/extension.ts (+27)
  changed src/helpers.ts (+7, -1)
  changed src/settings.ts (+31, -69)
  changed test.txt (+11, -3)
  changed todo.txt (+3, -3)

* 2019-05-13 8:38pm **Commit:**
  > Update manifest and add icon
  changed done.txt (+3)
  added images/todotxt-mode.png
  changed package.json (+8)
  changed todo.txt (+6, -8)

* 2019-05-13 9:11pm **Commit:**
  > Fixed hover file preview for correct folder
  changed package-lock.json (+1, -1)
  changed package.json (+6, -2)
  changed src/extension.ts (+11, -11)
  changed todo.txt (+1)

* _2019-05-13 (no LLM activity on mini — check other machines if you used an assistant that day)_

## 2019-05-08

* 2019-05-08 6:21am **Commit:**
  > Updates
  changed src/decorations.ts (+111, -12)

* 2019-05-08 9:05pm **Commit:**
  > Format dates and priorities by value
  changed done.txt (+3)
  changed src/decorations.ts (+97, -113)
  changed src/helpers.ts (+4, -2)
  changed src/patterns.ts (+1)
  changed src/settings.ts (+41, -1)
  changed test.txt (+1, -1)
  changed todo.txt (+3, -8)

* _2019-05-08 (no LLM activity on mini — check other machines if you used an assistant that day)_

## 2019-05-05

* 2019-05-05 8:27pm **Commit:**
  > Refactoring decoration for dates

* 2019-05-05 8:27pm **Commit:**
  > Updates
  changed src/decorations.ts (+5, -3)

* _2019-05-05 (no LLM activity on mini — check other machines if you used an assistant that day)_

## 2019-05-04

* 2019-05-04 10:11am **Commit:**
  > Added removePriorities and sectionDelimiterPattern
  changed package.json (+10, -1)
  changed src/commands.ts (+26, -1)
  changed src/decorations.ts (+6, -3)
  changed src/files.ts (+4, -3)
  changed src/helpers.ts (+15, -1)
  changed src/patterns.ts (+4, -4)
  changed src/settings.ts (+2)
  changed test.txt (+18, -12)
  changed todo.txt (+6, -6)
  changed waiting.txt (+2)

* 2019-05-04 8:30pm **Commit:**
  > Design of date tag formatting
  changed src/decorations.ts (+26, -4)
  changed todo.txt (+1, -2)

* 2019-05-04 8:32pm **Commit:**
  > updates
  changed todo.txt (+8, -5)

* _2019-05-04 (no LLM activity on mini — check other machines if you used an assistant that day)_

## 2019-05-03

* 2019-05-03 1:22pm **Commit:**
  > Updates
  changed notes.md (+17)
  changed package-lock.json (+3, -3)
  changed package.json (+4, -4)
  changed todo.txt (+1)

* _2019-05-03 (no LLM activity on mini — check other machines if you used an assistant that day)_

## 2019-04-28

* 2019-04-28 7:27pm **Commit:**
  > Put more settings in package.json. Fixed waiting command
  changed .DS_Store
  changed done.txt (+2)
  changed notes.md (+2, -15)
  changed package.json (+10, -8)
  changed src/commands.ts (+1, -1)
  changed src/decorations.ts (+6, -2)
  changed src/extension.ts (-2)
  changed src/files.ts (+4, -5)
  changed src/helpers.ts (+6, -2)
  changed src/settings.ts (+3, -1)
  changed test.txt (+1)
  changed todo.txt (+1, -3)
  added waiting.txt (+1)

* _2019-04-28 (no LLM activity on mini — check other machines if you used an assistant that day)_

## 2019-04-27

* 2019-04-27 8:54pm **Commit:**
  > Clean up and refactoring
  changed src/commands.ts (+26, -33)
  changed src/decorations.ts (+8, -7)
  changed src/extension.ts (+1)
  changed src/helpers.ts (+29)
  changed src/patterns.ts (+2, -2)
  changed src/settings.ts (+2)
  changed src/sorting.ts (+2, -14)
  deleted src/t.html
  deleted src/t.js
  changed todo.txt (+1)

* _2019-04-27 (no LLM activity on mini — check other machines if you used an assistant that day)_

## 2019-04-26

* 2019-04-26 4:12pm **Commit:**
  > Sort by selected range. Format task fields.
  added .DS_Store
  changed package.json (+8)
  changed src/commands.ts (+47, -3)
  changed src/patterns.ts (+80, -2)
  changed src/sorting.ts (+34, -15)
  changed test.txt (+7, -4)
  changed todo.txt (+21, -7)

* 2019-04-26 7:55pm **Commit:**
  > Added first test case
  changed package-lock.json (+336, -38)
  changed package.json (+9, -3)
  changed src/commands.ts (+8, -8)
  changed src/decorations.ts (+1, -3)
  changed src/extension.ts (+1, -6)
  changed src/files.ts (+7, -11)
  added src/helpers.ts (+14)
  changed src/patterns.ts (+5, -5)
  changed src/settings.ts (+10, -5)
  changed src/sorting.ts (+2, -5)
  added src/test/files/test_sorting.txt (+3)
  added src/test/sorting.test.ts (+30)
  changed todo.txt (+10, -2)

* 2019-04-26 10:04pm **Commit:**
  > Added note link feature
  changed package.json (+4)
  changed src/commands.ts (+41, -1)
  changed test.txt (+3)
  changed todo.txt (+2, -16)

* _2019-04-26 (no LLM activity on mini — check other machines if you used an assistant that day)_

## 2019-04-23

* 2019-04-23 9:29pm **Commit:**
  > Refactor sorting and add sorting by tag values
  changed done.txt (+2)
  changed package.json (+4)
  changed src/commands.ts (+7, -4)
  changed src/patterns.ts (+7, -4)
  changed src/settings.ts (+11, -4)
  changed src/sorting.ts (+54, -30)
  changed test.txt (+11, -9)
  changed todo.txt (+1, -4)

* _2019-04-23 (no LLM activity on mini — check other machines if you used an assistant that day)_

## 2019-04-22

* 2019-04-22 9:09pm **Commit:**
  > Refactored code to patterns, settings and sorting
  changed notes.md (+15)
  changed src/commands.ts (+5, -5)
  changed src/decorations.ts (+8, -6)
  deleted src/defaults.ts
  changed src/extension.ts (+3, -3)
  added src/patterns.ts (+26)
  added src/settings.ts (+51)
  moved src/utils.ts → src/sorting.ts
  changed todo.txt (+1, -1)

* _2019-04-22 (no LLM activity on mini — check other machines if you used an assistant that day)_

## 2019-04-21

* 2019-04-21 7:55am **Commit:**
  > Add sorring
  changed package.json (+4)
  changed src/ToDoCommands.ts (+4)
  changed src/decorations.ts (+12, -43)
  deleted src/decorators/ToDoDecorator.ts
  changed src/defaults.ts (+50, -19)
  added src/utils.ts (+78)
  changed todo.txt (+11)

* 2019-04-21 7:57am **Commit:**
  > Added reference
  changed todo.txt (+3)

* 2019-04-21 8:00am **Commit:**
  > Resolved merge conflicgs

* 2019-04-21 12:39pm **Commit:**
  > Made sort stable. Added commands for sorting by all fields
  added notes.md (+54)
  changed package.json (+12)
  changed src/ToDoCommands.ts (+10, -1)
  changed src/decorations.ts (+1, -1)
  changed src/defaults.ts (+9, -7)
  changed src/utils.ts (+44, -49)
  added test.txt (+20)
  changed todo.txt (+13, -77)

* 2019-04-21 5:17pm **Commit:**
  > Added option to sort completed tasks to the end
  changed package.json (+5)
  changed src/extension.ts (+3, -3)
  changed src/utils.ts (+14, -22)
  changed todo.txt (+2, -1)

* 2019-04-21 6:17pm **Commit:**
  > Removed unused files. Added code to move tasks.
  changed notes.md (+3)
  changed package.json (+13, -1)
  deleted src/ToDoCommands.ts
  added src/commands.ts (+58)
  deleted src/commands/ToDoTasks.ts
  changed src/extension.ts (+2, -2)
  added src/files.ts (+72)
  deleted src/utils/TaskUtils.ts

* 2019-04-21 8:38pm **Commit:**
  > Move tasks to files and archive done tasks.
  added done.txt (+14)
  changed package.json (+5, -1)
  changed src/commands.ts (+4)
  changed src/files.ts (+17, -19)
  changed todo.txt (+1, -15)

* _2019-04-21 (no LLM activity on mini — check other machines if you used an assistant that day)_

## 2019-04-20

* 2019-04-20 4:54pm **Commit:**
  > Tested as package. Added style in JSON file
  changed README.md (+9, -50)
  changed package.json (+42, -1)
  changed src/decorators/ToDoDecorator.ts (+54, -19)
  changed src/extension.ts (+2)
  changed src/t.html (+1, -1)
  changed todo.txt (+23, -6)

* 2019-04-20 7:24pm **Commit:**
  > Refactoring
  deleted src/ToDoController.ts
  added src/decorations.ts (+101)
  changed src/decorators/ToDoDecorator.ts (+52, -109)
  added src/defaults.ts (+23)
  changed src/extension.ts (+11, -5)

* _2019-04-20 (no LLM activity on mini — check other machines if you used an assistant that day)_

## 2019-04-19

* 2019-04-19 3:00pm **Commit:**
  > Initial check in
  added README.md (+65)

* 2019-04-19 3:01pm **Commit:**
  > Full check in of project
  added .gitignore (+4)
  added .vscode/extensions.json (+7)
  added .vscode/launch.json (+35)
  added .vscode/settings.json (+11)
  added .vscode/tasks.json (+20)
  added .vscodeignore (+10)
  added CHANGELOG.md (+9)
  added package-lock.json (+916)
  added package.json (+38)
  added src/extension.ts (+41)
  added src/t.html (+5)
  added src/t.js (+1)
  added src/test/extension.test.ts (+22)
  added src/test/index.ts (+23)
  added todo.txt (+58)
  added tsconfig.json (+21)
  added tslint.json (+15)
  added vsc-extension-quickstart.md (+41)

* 2019-04-19 4:57pm **Commit:**
  > Added decorators and a command
  changed package.json (+4, -3)
  added src/ToDoCommands.ts (+45)
  added src/ToDoController.ts (+29)
  added src/commands/ToDoTasks.ts (+87)
  added src/decorators/ToDoDecorator.ts (+129)
  changed src/extension.ts (+13, -32)
  added src/utils/TaskUtils.ts (+30)
  changed todo.txt (+10, -8)
  changed tsconfig.json (+1, -1)

* _2019-04-19 (no LLM activity on mini — check other machines if you used an assistant that day)_

