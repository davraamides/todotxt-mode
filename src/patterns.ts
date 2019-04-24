/*
 * Configuration settings and constants
 *
 * Manage them in the same place so it's easy to factor constants into the configuration
 * file without impacting a lot of code
 */
export namespace Patterns {

    // The ontext and project patterns are prefixed with non-word boundary (\B) as they
    // begin with non-word chars (+@). The tag pattern is prefixed with a word bounday (\b)
    // as tags begin with a word char.
    export const ContextRegex = /\B@\S+\b/g;
    export const PriorityRegex = /^[(][A-Z][)]\s/g;
    export const ProjectRegex = /\B\+\S+\b/g;
    export const TagRegex = /\b\w+:[^\s]+\b/g;

    //export const TagValueRegex = /\b([^:\s]+):([^:\s]+)\b/g;
    export const TagValueRegex = /\b(\w+):(\w+)\b/g;
    export const CompletedRegex = /^x .*$/g;

    // put them in a map so sorting by any field is consistent
    export const FieldRegex = {
        'context': ContextRegex,
        'priority': PriorityRegex,
        'project': ProjectRegex,
        'tag': TagRegex,
    }

};
