//
// Configuration settings and constants.
//
// This contains all the settings that are in the package.json file that can be
// customized by the user.
//
// Settings are accessed via functions to ensure fresh values are always
// returned when the user changes configuration.
//
// @ts-nocheck
import * as vscode from 'vscode';

export namespace Settings {

    // Constants (not user-configurable)
    export const CompletedTaskPrefix = "x ";
    export const PriorityTagLength = "(A) ".length;

    // Helper function to get a setting value fresh from VS Code configuration
    export function getSetting<T>(field: string): T | undefined {
        return vscode.workspace.getConfiguration("todotxtmode").get<T>(field);
    }

    // File settings
    export function TodoFilename(): string { return getSetting<string>("todoFilename"); }
    export function DoneFilename(): string { return getSetting<string>("doneFilename"); }
    export function SomedayFilename(): string { return getSetting<string>("somedayFilename"); }
    export function WaitingFilename(): string { return getSetting<string>("waitingFilename"); }

    // Behavior settings
    export function AddCreatedAt(): boolean { return getSetting<boolean>("addCreatedAt"); }
    export function SortCompletedTasksToEnd(): boolean { return getSetting<boolean>("sortCompletedTasksToEnd"); }
    export function RemovePriorityFromCompletedTasks(): boolean { return getSetting<boolean>("removePriorityFromCompletedTasks"); }
    export function ReplaceNoteTextWithNoteTag(): boolean { return getSetting<boolean>("replaceNoteTextWithNoteTag"); }

    // Pattern settings
    export function TodoFilePattern(): string { return getSetting<string>("todoFilePattern"); }
    export function ExcludeDecorationsFilePattern(): string { return getSetting<string>("excludeDecorationsFilePattern"); }
    export function SectionDelimiterPattern(): string { return getSetting<string>("sectionDelimiterPattern"); }
    export function MarkdownFilePattern(): string { return getSetting<string>("markdownFilePattern"); }
    export function MarkdownDecorationBeginPattern(): string { return getSetting<string>("markdownDecorationBeginPattern"); }
    export function MarkdownDecorationEndPattern(): string { return getSetting<string>("markdownDecorationEndPattern"); }
    export function NoteFilenameFormat(): string { return getSetting<string>("noteFilenameFormat"); }
    export function TagDatePattern(): string { return getSetting<string>("tagDatePattern"); }

    // Style settings - these return fresh style objects each time
    export function ContextStyle(): vscode.DecorationRenderOptions {
        return {
            light: { color: getSetting<string>("contextStyle.light.color") },
            dark: { color: getSetting<string>("contextStyle.dark.color") }
        };
    }
    export function HighPriorityStyle(): vscode.DecorationRenderOptions {
        return {
            light: { color: getSetting<string>("highPriorityStyle.light.color") },
            dark: { color: getSetting<string>("highPriorityStyle.dark.color") }
        };
    }
    export function MediumPriorityStyle(): vscode.DecorationRenderOptions {
        return {
            light: { color: getSetting<string>("mediumPriorityStyle.light.color") },
            dark: { color: getSetting<string>("mediumPriorityStyle.dark.color") }
        };
    }
    export function LowPriorityStyle(): vscode.DecorationRenderOptions {
        return {
            light: { color: getSetting<string>("lowPriorityStyle.light.color") },
            dark: { color: getSetting<string>("lowPriorityStyle.dark.color") }
        };
    }
    export function ProjectStyle(): vscode.DecorationRenderOptions {
        return {
            light: { color: getSetting<string>("projectStyle.light.color") },
            dark: { color: getSetting<string>("projectStyle.dark.color") }
        };
    }
    export function TagStyle(): vscode.DecorationRenderOptions {
        return {
            light: { color: getSetting<string>("tagStyle.light.color") },
            dark: { color: getSetting<string>("tagStyle.dark.color") }
        };
    }
    export function CreationDateStyle(): vscode.DecorationRenderOptions {
        return {
            light: { color: getSetting<string>("creationDateStyle.light.color") },
            dark: { color: getSetting<string>("creationDateStyle.dark.color") }
        };
    }
    export function PastDateStyle(): vscode.DecorationRenderOptions {
        return {
            light: { color: getSetting<string>("pastDateStyle.light.color") },
            dark: { color: getSetting<string>("pastDateStyle.dark.color") }
        };
    }
    export function PresentDateStyle(): vscode.DecorationRenderOptions {
        return {
            light: { color: getSetting<string>("presentDateStyle.light.color") },
            dark: { color: getSetting<string>("presentDateStyle.dark.color") }
        };
    }
    export function FutureDateStyle(): vscode.DecorationRenderOptions {
        return {
            light: { color: getSetting<string>("futureDateStyle.light.color") },
            dark: { color: getSetting<string>("futureDateStyle.dark.color") }
        };
    }
    export function CompletedStyle(): vscode.DecorationRenderOptions {
        return {
            textDecoration: getSetting<string>("completedStyle.textDecoration"),
            opacity: getSetting<string>("completedStyle.opacity")
        };
    }
}
