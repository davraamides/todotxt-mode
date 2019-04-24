/*
 * Configuration settings and constants
 *
 * Manage them in the same place so it's easy to factor constants into the configuration
 * file without impacting a lot of code
 */
import * as vscode from 'vscode';

export namespace Settings {

    function getSetting<T>(field:string, defaultValue?: T): T | undefined {
        return vscode.workspace.getConfiguration("todotxtmode").get(field, defaultValue);
    }
//    export const Message:string = vscode.workspace.getConfiguration("todotxtmode").get("message");
//    export const SortCompletedTasksToEnd:boolean = vscode.workspace.getConfiguration('todotxtmode').get("sortCompletedTasksToEnd", false);
    export const Message:string = getSetting("message");
    export const SortCompletedTasksToEnd:boolean = getSetting("sortCompletedTasksToEnd", false);

    export const ContextStyle = Object.assign({}, getSetting("contextStyle"), 
//    export const ContextStyle = {
    {
        light: {
            color: 'rgb(40, 161, 86)'
        },
        dark: {
            color: 'rgb(40, 161, 86)'
        }
    });
    export const PriorityStyle = {
        light: {
            color: 'rgb(230, 216, 25)'
        },
        dark: {
            color: 'rgb(230, 216, 25)'
        }
    };
    export const ProjectStyle = {
        light: {
            color: 'rgb(25, 172, 230)'
        },
        dark: {
            color: 'rgb(25, 172, 230)'
        }
    };
    export const TagStyle = {
        light: {
            color: 'rgb(179, 58, 172)'
        },
        dark: {
            color: 'rgb(179, 58, 172)'
        }
    };
    export const CompletedStyle = {
        textDecoration: "line-through",
        opacity: "0.5"
    };

}