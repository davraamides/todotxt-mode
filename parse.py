"""
parse/spell tasks to test out logic
"""
import re
import datetime

TESTS = """\
a simple task
a task with a +ProjectA +ProjectB
a task with @context in it @multiple times
a task with a:tag and due:2020-01-01
(A) task with a priority
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
        newline = toggleCompletion(line)
        print(f'removePriority:\n  old: "{line}"\n  new: "{newline}"')
        #parseTask(line)

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
    # and now do I strip that off line before I continue??? if so, the ranges are all off by the length of the prefix
    for field, pattern in FIELD_PATTERNS.items():
        for match in re.finditer(pattern, line):
            #import pdb; pdb.set_trace()
            print(match)
            taskObj[field].append({'match': match.group(), 'range': match.span()})
    match = re.search(PRIORITY_PATTERN, line)
    if match:
        taskObj['priority'] = {'match': match.group(), 'range': match.span()}
    import pprint
    pprint.pprint(taskObj)

def spellTask(taskObj, fieldOrder):
    # should only need this for reformat and then fieldOrder is required
    parts = []
    if taskObj['prefix']:
        parts.append(taskObj['prefix'])
    if taskObj['priority']:
        parts.append(taskObj['priority'])
    taskObj.extend(taskObj['bits'])
    for field in fieldOrder:
        parts.extend(taskObj[field])
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

def formatTask(taskObj):
    # this is the one where parsing off the fields is important
    pass

def sortLines(taskObjs, byField):
    # the way I'm doig tihs now is by using a regex to parse out the field or tag value from each line then sorting on that value, so again, I don't really need the taskObj
    # although it helps if I already have it
    pass

def decorateLines(taskObjs):
    # this is helpful to have because in decoration.ts right now I'm essentially reparsing all this to get the ranges
    pass

if __name__ == '__main__':
    main()
