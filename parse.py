"""
parse/spell tasks to test out logic
"""
import re
import datetime
import pprint

TESTS = """\
a simple task
a task with a +ProjectA +ProjectB
a task with @context in it @multiple times
a task with a:tag and due:2020-01-01
(A) task with a priority
(C) a task with everything @now due:2020-01-01 +Project @later +Work
x completed task and @context
x (A) 2020-01-01 completed task with priority and completed date
""".splitlines()
# add indented versions
TESTS = TESTS + ['    ' + _ for _ in TESTS]

FIELD_PATTERNS = {
    'context': r'\s+@\S+\b',
    'project': r'\s+\+\S+\b',
    'tag': r'\s+[^\s:]+:[^\s]+\b',
}
PRIORITY_PATTERN = r'\([A-Z]\)' # problem is this should only match at beginning or near begin for completed

#const TaskCompletionRegEx = /^(x )?(\([A-Z]\) )?(\d{4}-\d{2}-\d{2} )?(.*)$/;
def main():
    for line in TESTS:
        #newline = toggleCompletion(line)
        #taskObj = parseTask(line)
        newline = formatTask(line)
        #pprint.pprint(taskObj)
        print(f'test:\n  old: "{line}"\n  new: "{newline}"')

    print('\n'.join(sortLines(TESTS, 'priority')))
# mutators
#   change priority - could just replace using span/range or line = line.replace(/\([A-Z]\)\s/, "")
#    var res = str.replace(/\([A-Z]\)\s/, function (x) {
#       return x.toUpperCase(); but do A-Z -> B-ZA
#    })
#   toggle completion - has to manage the priority: "task" -> "x yyyy-mm-dd task" but "(A) task" -> "x (A) yyyy-mm-dd task"
#   remove priority - could remove using span/range but need to handle trailing space(s)
#   reformat task with sorted tags - this is where saving words/bits is needed
# non-mutators
#   sort - sort taskObj list by appropriate field(s) and then output original line, preserving whitespace
#   decorate - use span/range to do decoration
# DECISION - should match of a field include any surrounding space? I think not
# DECISION - should I strip off the leading whitespace here then make all the logic and patterns work as if there were no lead
#            and then manage it back in when I do all the other logic like decoration and converting back to a string?
#            I think not because only effects first field, usually priority but maybe completed and easier to do other operations with span/range for original line
# DECISION - should I change the line property as the mutators occur or just the obj field and then re-gen the line? 

#context project and tag would usually have leading space
#priority would usually not have leading space
"""
Observations:
- mutators are mostly easier to do directly to string to avoid complexity of rebuilding and managing prefix (exception is reformat which by nature easier to parse into parts)
- non-mutators (which operation on the full set) benefit from the list of parsed objects since we need that info, but they don't need to convert back to strings
- parseTask - should capture ranges as well as parts so can use for decoration
- spellTask - only used for reformat of tasks (which I think only works for incomplete tasks) so can always use field order logic and then ambiguities of parse/spell consistency aren't an issue
"""
def parseTask(line):
    # NOTE shouldn't ever need for a completed task? well, if we use this as a basis for decorations then we need it for the completed, but only for the t/f logic
    taskObj = {'line': line, 'bits': [], 'context': [], 'project': [], 'tag': [], 'priority': None, 'completed': None, 'prefix': '', 'offset': 0, 'changed': False}
    match = re.match('^\s+', line)
    if match:
        taskObj['prefix'] = match.group()
        taskObj['offset'] = len(taskObj['prefix'])

    # TODO need to split into words and then do word by word saving bits like in typescript version

    # and now do I strip that off line before I continue??? if so, the ranges are all off by the length of the prefix
    for field, pattern in FIELD_PATTERNS.items():
        for match in re.finditer(pattern, line):
            #import pdb; pdb.set_trace()
            print(match)
            taskObj[field].append({'match': match.group(), 'range': match.span()})
    match = re.search(PRIORITY_PATTERN, line)
    if match:
        taskObj['priority'] = {'match': match.group(), 'range': match.span()}
    return taskObj

def spellTask(taskObj, fieldOrder):
    # should only need this for reformat and then fieldOrder is required
    parts = []
    if taskObj['prefix']:
        parts.append(taskObj['prefix'])
    if taskObj['priority']:
        parts.append(taskObj['priority']['match'])
    parts.extend(taskObj['bits'])
    for field in fieldOrder:
        for d in taskObj[field]:
            parts.append(d['match'])
    return ' '.join(parts)

# works    
def removePriority(line):
    return re.sub(r'\([A-Z]\)\s', '', line)

# fails on completed task w/out priority: "x completed task" -> "(A) x completed task"
def incPriority(line):
    newline = re.sub(r'\([A-Z]\)', lambda m: changePriority(m, True), line)
    if newline == line:
        newline = re.sub(r'^(\s*)', r'\1(A) ', line)
    return newline

# fails on completed task w/out priority: "x completed task" -> "(Z) x completed task"
def decPriority(line):
    newline = re.sub(r'\([A-Z]\)', lambda m: changePriority(m, False), line)
    if newline == line:
        newline = re.sub(r'^(\s*)', r'\1(Z) ', line)
    return newline

def changePriority(match, increment):
    if not match:
        return '(A)' if increment else '(Z)'
    else:
        x = ord(match.group()[1]) - ord('A')
        i = 1 if increment else - 1
        x = (x + i) % 26
        return '(' + chr(ord('A') + x) + ')'

# works
def toggleCompletion(line):
    m = re.match('^(\s*)(x )?(\([A-Z]\) )?(\d{4}-\d{2}-\d{2} )?(.*)$', line)
    if m.group(2):
        line = (m.group(1) or '') + (m.group(3) or '') + (m.group(5) or '')
    else:
        line = (m.group(1) or '') + 'x ' + (m.group(3) or '') + datetime.date.today().strftime('%Y-%m-%d ') + (m.group(5) or '')
    return line

# works except for getting all occurrences of a field
def formatTask(line):
    #return spellTask(taskObj, fieldOrder=('context', 'tag', 'project'))
    fields, newline = parseFields(line, ('context', 'tag', 'project'))
    return appendFields(newline, fields, ('context', 'tag', 'project'))
    # this is the one where parsing off the fields is important

# these patterns are used for parsing a field out of the line thus they include the bounding whitespace
# (leading for all fields except priority)
PATTERNS = {
    'context': r'\s@\S+\b',
    'project': r'\s\+\S+\b',
    'tag': r'\s[^\s:]+:[^\s]+\b',
    'priority': r'\B\([A-Z]\)\s'
}

def parseFields(line, fields):
    fldvals = {}
    for field in fields:
        fldval, line = parseField(line, PATTERNS[field])
        fldvals[field] = fldval
    return fldvals, line

def parseField(line, pattern):
    # TODO figure out how to sub all
    m = re.search(pattern, line)
    if m:
        return m.group(), re.sub(pattern, '', line)
    else:
        return '', line

def appendFields(line, fields, order):
    return line + ''.join([fields[f] for f in order])

# works for fields
def sortLines(lines, byField):
    data = []
    for i, line in enumerate(lines):
        data.append({'line': line, 'i': i, 'value': parseField(line, PATTERNS[byField])[0]})
    data.sort(key=lambda x: (x['value'] or 'z', x['i']))
    return [_['line'] for _ in data]

def decorateLines(taskObjs):
    # this is helpful to have because in decoration.ts right now I'm essentially reparsing all this to get the ranges
    pass

if __name__ == '__main__':
    main()
