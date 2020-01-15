"""
parse/spell tasks to test out logic
"""
import re

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
        parseTask(line)

def parseTask(line):
    taskObj = {'line': line, 'context': [], 'project': [], 'tag': [], 'priority': None, 'completed': None, 'prefix': '', 'offset': 0}
    # DECISION - should I strip off the leading whitespace here and then make all the logic and patterns
    # work as if there were no lead and then manage it back in when I do all the other logic like decoration
    # and converting back to a string?
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

def spellTask(line):
    pass

if __name__ == '__main__':
    main()
