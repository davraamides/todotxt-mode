# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

todotxt-mode is a VS Code extension for managing [todo.txt](https://github.com/todotxt/todo.txt) formatted files. It provides syntax highlighting, task management commands, and GTD workflow support.

## Build Commands

```bash
npm run compile         # Build extension with webpack
npm run watch           # Watch mode for development
npm run package         # Production build
npm run lint            # ESLint check
npm test                # Run Mocha tests (includes compile + lint)
npm run compile-tests   # Compile tests only
```

## Architecture

The extension follows a modular namespace-based architecture in `src/`:

- **extension.ts** - Main entry point; handles activation, event listeners, hover providers
- **commands.ts** - Registers all 16 VS Code commands
- **decorations.ts** - Applies syntax highlighting via VS Code text decorations
- **patterns.ts** - Regex patterns for parsing task components (priority, context, project, tags)
- **sorting.ts** - Stable sorting by various fields (context, project, priority, date)
- **files.ts** - Task file movement between todo/done/waiting/someday files
- **completion.ts** - Toggle task completion status
- **priority.ts** - Increment/decrement task priorities
- **note.ts** - Create note files linked to tasks
- **settings.ts** - Centralized configuration management
- **helpers.ts** - Shared utility functions
- **strftime.ts / strptime.ts** - Date formatting/parsing utilities

### Key Data Flow

1. Extension activates on `plaintext` or `markdown` files
2. `decorations.ts` applies styling based on regex patterns from `patterns.ts`
3. Commands modify document text directly via VS Code's edit API
4. File operations (`files.ts`) read/write to configured workflow files

### Output

- Compiled extension: `dist/extension.js`
- Compiled tests: `out/test/`

## Code Conventions

- Many source files use `@ts-nocheck` to suppress strict TypeScript checks
- Core logic relies heavily on regex patterns defined in `patterns.ts`
- All colors and file patterns are configurable via VS Code settings (defined in `package.json`)
- Decorations update on text selection and editor change events

## Testing

Tests use Mocha with `@vscode/test-electron`. Run a single test file:
```bash
npm run compile-tests && node ./out/test/runTest.js
```

## Key Keybindings

- `Ctrl+Shift+X` - Toggle task completion
- `Ctrl+Shift+A` - Increment priority
- `Ctrl+Shift+Z` - Decrement priority
