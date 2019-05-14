/*
 * Configuration settings and constants
 *
 * Manage them in the same place so it's easy to factor constants into the configuration
 * file without impacting a lot of code
 */
import * as vscode from 'vscode';

export namespace Settings {

    export const CompletedTagLength = "x yyyy-mm-dd ".length;
    export const PriorityTagLength = "(A) ".length;

    // move to configuration
    export const TodoFilename:string = 'todo.txt'
    export const DoneFilename:string = 'done.txt'
    export const SomedayFilename:string = 'incubate.txt'
    export const WaitingFilename:string = 'waiting.txt'
    
    export const Message:string = getSetting("message");
    export const SortCompletedTasksToEnd:boolean = getSetting("sortCompletedTasksToEnd", false);
    export const CommandFilePattern:string = getSetting("commandFilePattern");
    export const ExcludeDecorationsFilePattern:string = getSetting("excludeDecorationsFilePattern");
    export const SectionDelimiterPattern:string = getSetting("sectionDelimiterPattern");

    export const ContextStyle = {
        light: { color: getSetting("contextStyle.light.color", "rgb(40, 161, 86)") },
        dark: { color: getSetting("contextStyle.dark.color", "rgb(40, 161, 86)") }
    }
    export const HighPriorityStyle = {
        light: { color: getSetting("highPriorityStyle.light.color", "rgb(230, 216, 25)") },
        dark: { color: getSetting("highPriorityStyle.dark.color", "rgb(230, 216, 25)") }
    }
    export const MediumPriorityStyle = {
        light: { color: getSetting("mediumPriorityStyle.light.color", "rgb(167, 157, 28)") },
        dark: { color: getSetting("mediumPriorityStyle.dark.color", "rgb(167, 157, 28)") }
    }
    export const LowPriorityStyle = {
        light: { color: getSetting("lowPriorityStyle.light.color", "rgb(100, 95, 16)") },
        dark: { color: getSetting("lowPriorityStyle.dark.color", "rgb(100, 95, 16)") }
    }
    export const ProjectStyle = {
        light: { color: getSetting("projectStyle.light.color", "rgb(25, 172, 230)") },
        dark: { color: getSetting("projectStyle.dark.color", "rgb(25, 172, 230)") }
    }
    export const TagStyle = {
        light: { color: getSetting("tagStyle.light.color", "rgb(179, 58, 172)") },
        dark: { color: getSetting("tagStyle.dark.color", "rgb(179, 58, 172)") }
    }
    export const PastDateStyle = {
        light: { color: getSetting("pastDateStyle.light.color", "rgb(177, 58, 28)") },
        dark: { color: getSetting("pastDateStyle.dark.color", "rgb(177, 58, 28)") }
    }
    export const PresentDateStyle = {
        light: { color: getSetting("presentDateStyle.light.color", "rgb(219, 216, 26)") },
        dark: { color: getSetting("presentDateStyle.dark.color", "rgb(219, 216, 26)") }
    }
    export const FutureDateStyle = {
        light: { color: getSetting("futureDateStyle.light.color", "rgb(118, 194, 31)") },
        dark: { color: getSetting("futureDateStyle.dark.color", "rgb(118, 194, 31)") }
    }
    export const CompletedStyle = {
        textDecoration: "line-through",
        opacity: "0.5"
    };

    function getSetting<T>(field:string, defaultValue?: T): T | undefined {
        return vscode.workspace.getConfiguration("todotxtmode").get(field, defaultValue);
    }

}