//
// Configuration settings and constants.
//
// This contains all the settings that are in the package.json file that
// can be customized by the user.
//
import * as vscode from 'vscode';

export namespace Settings {

    export const CompletedTaskPrefix = "x ";
    export const CompletedTagLength = "x yyyy-mm-dd ".length;
    export const PriorityTagLength = "(A) ".length;

    // move to configuration
    export const TodoFilename:string = 'todo.txt'
    export const DoneFilename:string = 'done.txt'
    export const SomedayFilename:string = 'incubate.txt'
    export const WaitingFilename:string = 'waiting.txt'
    
    export const Message:string = getSetting<string>("message");
    export const SortCompletedTasksToEnd:boolean = getSetting<boolean>("sortCompletedTasksToEnd");
    export const TodoFilePattern:string = getSetting<string>("todoFilePattern");
    export const ExcludeDecorationsFilePattern:string = getSetting<string>("excludeDecorationsFilePattern");
    export const SectionDelimiterPattern:string = getSetting<string>("sectionDelimiterPattern");
    export const MarkdownFilePattern:string = getSetting<string>("markdownFilePattern");
    export const MarkdownDecorationBeginPattern:string = getSetting<string>("markdownDecorationBeginPattern");
    export const MarkdownDecorationEndPattern:string = getSetting<string>("markdownDecorationEndPattern");

    export const ContextStyle = {
        light: { color: getSetting<string>("contextStyle.light.color") },
        dark: { color: getSetting<string>("contextStyle.dark.color") }
    }
    export const HighPriorityStyle = {
        light: { color: getSetting<string>("highPriorityStyle.light.color") },
        dark: { color: getSetting<string>("highPriorityStyle.dark.color") }
    }
    export const MediumPriorityStyle = {
        light: { color: getSetting<string>("mediumPriorityStyle.light.color") },
        dark: { color: getSetting<string>("mediumPriorityStyle.dark.color") }
    }
    export const LowPriorityStyle = {
        light: { color: getSetting<string>("lowPriorityStyle.light.color") },
        dark: { color: getSetting<string>("lowPriorityStyle.dark.color") }
    }
    export const ProjectStyle = {
        light: { color: getSetting<string>("projectStyle.light.color") },
        dark: { color: getSetting<string>("projectStyle.dark.color") }
    }
    export const TagStyle = {
        light: { color: getSetting<string>("tagStyle.light.color") },
        dark: { color: getSetting<string>("tagStyle.dark.color") }
    }
    export const PastDateStyle = {
        light: { color: getSetting<string>("pastDateStyle.light.color") },
        dark: { color: getSetting<string>("pastDateStyle.dark.color") }
    }
    export const PresentDateStyle = {
        light: { color: getSetting<string>("presentDateStyle.light.color") },
        dark: { color: getSetting<string>("presentDateStyle.dark.color") }
    }
    export const FutureDateStyle = {
        light: { color: getSetting<string>("futureDateStyle.light.color") },
        dark: { color: getSetting<string>("futureDateStyle.dark.color") }
    }
    export const CompletedStyle = {
        textDecoration: getSetting<string>("completedStyle.textDecoration"),
        opacity: getSetting<string>("completedStyle.opacity")
    };

    function getSetting<T>(field:string): T | undefined {
        return vscode.workspace.getConfiguration("todotxtmode").get<T>(field);
    }

}