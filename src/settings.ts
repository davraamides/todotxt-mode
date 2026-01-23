//
// Configuration settings and constants.
//
// This contains all the settings that are in the package.json file that can be
// customized by the user.
//
// Settings are accessed via functions to ensure fresh values are always
// returned when the user changes configuration.
//
import * as vscode from 'vscode';

export namespace Settings {

    // Constants (not user-configurable)
    export const CompletedTaskPrefix = "x ";
    export const PriorityTagLength = "(A) ".length;

    // Helper function to get a setting value fresh from VS Code configuration
    export function getSetting<T>(field: string): T | undefined {
        return vscode.workspace.getConfiguration("todotxtmode").get<T>(field);
    }

    // File settings (with defaults matching package.json)
    export function TodoFilename(): string { return getSetting<string>("todoFilename") ?? "todo.txt"; }
    export function DoneFilename(): string { return getSetting<string>("doneFilename") ?? "done.txt"; }
    export function SomedayFilename(): string { return getSetting<string>("somedayFilename") ?? "someday.txt"; }
    export function WaitingFilename(): string { return getSetting<string>("waitingFilename") ?? "waiting.txt"; }

    // Behavior settings (with defaults matching package.json)
    export function AddCreatedAt(): boolean { return getSetting<boolean>("addCreatedAt") ?? false; }
    export function SortCompletedTasksToEnd(): boolean { return getSetting<boolean>("sortCompletedTasksToEnd") ?? true; }
    export function RemovePriorityFromCompletedTasks(): boolean { return getSetting<boolean>("removePriorityFromCompletedTasks") ?? false; }
    export function ReplaceNoteTextWithNoteTag(): boolean { return getSetting<boolean>("replaceNoteTextWithNoteTag") ?? false; }

    // Pattern settings (with defaults matching package.json)
    export function TodoFilePattern(): string { return getSetting<string>("todoFilePattern") ?? "^.*\\.txt$"; }
    export function ExcludeDecorationsFilePattern(): string { return getSetting<string>("excludeDecorationsFilePattern") ?? "^done\\.txt$"; }
    export function SectionDelimiterPattern(): string { return getSetting<string>("sectionDelimiterPattern") ?? "^--$"; }
    export function MarkdownFilePattern(): string { return getSetting<string>("markdownFilePattern") ?? "^.*\\.(md|markdown)$"; }
    export function MarkdownDecorationBeginPattern(): string { return getSetting<string>("markdownDecorationBeginPattern") ?? "^#+\\s+Tasks\\s*$"; }
    export function MarkdownDecorationEndPattern(): string { return getSetting<string>("markdownDecorationEndPattern") ?? "^$"; }
    export function NoteFilenameFormat(): string { return getSetting<string>("noteFilenameFormat") ?? "[Todo]-Note-%Y%m%d-%H%M%S.md"; }
    export function TagDatePattern(): string { return getSetting<string>("tagDatePattern") ?? "%Y-%m-%d"; }

    // Style settings - these return fresh style objects each time
    export function ContextStyle(): vscode.DecorationRenderOptions {
        return {
            light: { color: getSetting<string>("contextStyle.light.color") ?? "rgb(40, 161, 86)" },
            dark: { color: getSetting<string>("contextStyle.dark.color") ?? "rgb(40, 161, 86)" }
        };
    }
    export function HighPriorityStyle(): vscode.DecorationRenderOptions {
        return {
            light: { color: getSetting<string>("highPriorityStyle.light.color") ?? "rgb(240, 226, 25)" },
            dark: { color: getSetting<string>("highPriorityStyle.dark.color") ?? "rgb(240, 226, 25)" }
        };
    }
    export function MediumPriorityStyle(): vscode.DecorationRenderOptions {
        return {
            light: { color: getSetting<string>("mediumPriorityStyle.light.color") ?? "rgb(201, 189, 22)" },
            dark: { color: getSetting<string>("mediumPriorityStyle.dark.color") ?? "rgb(201, 189, 22)" }
        };
    }
    export function LowPriorityStyle(): vscode.DecorationRenderOptions {
        return {
            light: { color: getSetting<string>("lowPriorityStyle.light.color") ?? "rgb(170, 160, 21)" },
            dark: { color: getSetting<string>("lowPriorityStyle.dark.color") ?? "rgb(170, 160, 21)" }
        };
    }
    export function ProjectStyle(): vscode.DecorationRenderOptions {
        return {
            light: { color: getSetting<string>("projectStyle.light.color") ?? "rgb(25, 172, 230)" },
            dark: { color: getSetting<string>("projectStyle.dark.color") ?? "rgb(25, 172, 230)" }
        };
    }
    export function TagStyle(): vscode.DecorationRenderOptions {
        return {
            light: { color: getSetting<string>("tagStyle.light.color") ?? "rgb(179, 58, 172)" },
            dark: { color: getSetting<string>("tagStyle.dark.color") ?? "rgb(179, 58, 172)" }
        };
    }
    export function CreationDateStyle(): vscode.DecorationRenderOptions {
        return {
            light: { color: getSetting<string>("creationDateStyle.light.color") ?? "rgb(200, 130, 0)" },
            dark: { color: getSetting<string>("creationDateStyle.dark.color") ?? "rgb(200, 130, 0)" }
        };
    }
    export function PastDateStyle(): vscode.DecorationRenderOptions {
        return {
            light: { color: getSetting<string>("pastDateStyle.light.color") ?? "rgb(177, 58, 28)" },
            dark: { color: getSetting<string>("pastDateStyle.dark.color") ?? "rgb(177, 58, 28)" }
        };
    }
    export function PresentDateStyle(): vscode.DecorationRenderOptions {
        return {
            light: { color: getSetting<string>("presentDateStyle.light.color") ?? "rgb(219, 216, 26)" },
            dark: { color: getSetting<string>("presentDateStyle.dark.color") ?? "rgb(219, 216, 26)" }
        };
    }
    export function FutureDateStyle(): vscode.DecorationRenderOptions {
        return {
            light: { color: getSetting<string>("futureDateStyle.light.color") ?? "rgb(118, 194, 31)" },
            dark: { color: getSetting<string>("futureDateStyle.dark.color") ?? "rgb(118, 194, 31)" }
        };
    }
    export function CompletedStyle(): vscode.DecorationRenderOptions {
        return {
            textDecoration: getSetting<string>("completedStyle.textDecoration") ?? "line-through",
            opacity: getSetting<string>("completedStyle.opacity") ?? "0.5"
        };
    }
}
