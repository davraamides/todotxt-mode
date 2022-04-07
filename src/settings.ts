//
// Configuration settings and constants.
//
// This contains all the settings that are in the package.json file that can be
// customized by the user.
//
import * as vscode from 'vscode';

export class Settings {

    CompletedTaskPrefix = "x ";
    PriorityTagLength = "(A) ".length;

    TodoFilename:string = this.getSetting<string>("todoFilename");
    DoneFilename: string = this.getSetting<string>("doneFilename");
    SomedayFilename: string = this.getSetting<string>("somedayFilename");
    WaitingFilename: string = this.getSetting<string>("waitingFilename");
    
    Message:string = this.getSetting<string>("message");
    SortCompletedTasksToEnd:boolean = this.getSetting<boolean>("sortCompletedTasksToEnd");
    RemovePriorityFromCompletedTasks:boolean = this.getSetting<boolean>("removePriorityFromCompletedTasks");
    TodoFilePattern:string = this.getSetting<string>("todoFilePattern");
    ExcludeDecorationsFilePattern:string = this.getSetting<string>("excludeDecorationsFilePattern");
    SectionDelimiterPattern:string = this.getSetting<string>("sectionDelimiterPattern");
    MarkdownFilePattern:string = this.getSetting<string>("markdownFilePattern");
    MarkdownDecorationBeginPattern:string = this.getSetting<string>("markdownDecorationBeginPattern");
    MarkdownDecorationEndPattern:string = this.getSetting<string>("markdownDecorationEndPattern");
    NoteFilenameFormat:string = this.getSetting<string>("noteFilenameFormat");
    TagDatePattern:string = this.getSetting<string>("tagDatePattern");
    ReplaceNoteTextWithNoteTag:boolean = this.getSetting<boolean>("replaceNoteTextWithNoteTag");

    ContextStyle = {
        light: { color: this.getSetting<string>("contextStyle.light.color") },
        dark: { color: this.getSetting<string>("contextStyle.dark.color") }
    }
    HighPriorityStyle = {
        light: { color: this.getSetting<string>("highPriorityStyle.light.color") },
        dark: { color: this.getSetting<string>("highPriorityStyle.dark.color") }
    }
    MediumPriorityStyle = {
        light: { color: this.getSetting<string>("mediumPriorityStyle.light.color") },
        dark: { color: this.getSetting<string>("mediumPriorityStyle.dark.color") }
    }
    LowPriorityStyle = {
        light: { color: this.getSetting<string>("lowPriorityStyle.light.color") },
        dark: { color: this.getSetting<string>("lowPriorityStyle.dark.color") }
    }
    ProjectStyle = {
        light: { color: this.getSetting<string>("projectStyle.light.color") },
        dark: { color: this.getSetting<string>("projectStyle.dark.color") }
    }
    TagStyle = {
        light: { color: this.getSetting<string>("tagStyle.light.color") },
        dark: { color: this.getSetting<string>("tagStyle.dark.color") }
    }
    CreationDateStyle = {
        light: { color: this.getSetting<string>("creationDateStyle.light.color") },
        dark: { color: this.getSetting<string>("creationDateStyle.dark.color") }
    }
    PastDateStyle = {
        light: { color: this.getSetting<string>("pastDateStyle.light.color") },
        dark: { color: this.getSetting<string>("pastDateStyle.dark.color") }
    }
    PresentDateStyle = {
        light: { color: this.getSetting<string>("presentDateStyle.light.color") },
        dark: { color: this.getSetting<string>("presentDateStyle.dark.color") }
    }
    FutureDateStyle = {
        light: { color: this.getSetting<string>("futureDateStyle.light.color") },
        dark: { color: this.getSetting<string>("futureDateStyle.dark.color") }
    }
    CompletedStyle = {
        textDecoration: this.getSetting<string>("completedStyle.textDecoration"),
        opacity: this.getSetting<string>("completedStyle.opacity")
    };

    getSetting<T>(field:string): T | undefined {
        return vscode.workspace.getConfiguration("todotxtmode").get<T>(field);
    }

}