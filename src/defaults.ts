export namespace Defaults {

    // use capturing patterns so they can be used for getting
    // the values for sorting and other commands
    export const CONTEXT_REGEX = /\B(@[^+@\s]+)/g;
    export const PRIORITY_REGEX = /([(][A-Z][)])/g;
    export const PROJECT_REGEX = /\B(\+[^+@\s]+)/g;
    export const TAG_REGEX = /\b([^+@\s]+:\w+)/g;
    export const COMPLETED_REGEX = /^x .*$/g;

    export const FIELD_REGEX_MAP = {
        'content': CONTEXT_REGEX,
        'priority': PRIORITY_REGEX,
        'project': PROJECT_REGEX,
        'tag': TAG_REGEX,
    }

    export const CONTEXT_STYLE = {
        light: {
            color: 'rgb(40, 161, 86)'
        },
        dark: {
            color: 'rgb(40, 161, 86)'
        }
    };
    export const PRIORITY_STYLE = {
        light: {
            color: 'rgb(230, 216, 25)'
        },
        dark: {
            color: 'rgb(230, 216, 25)'
        }
    };
    export const PROJECT_STYLE = {
        light: {
            color: 'rgb(25, 172, 230)'
        },
        dark: {
            color: 'rgb(25, 172, 230)'
        }
    };
    export const TAG_STYLE = {
        light: {
            color: 'rgb(179, 58, 172)'
        },
        dark: {
            color: 'rgb(179, 58, 172)'
        }
    };
    export const COMPLETED_STYLE = {
        textDecoration: "line-through",
        opacity: "0.5"
    };
};
