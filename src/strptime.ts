// a limited implementation of strptime from: https://www.logilab.org/blogentry/6731

import internal = require("stream");

var _DATE_FORMAT_REGXES = {
    'Y': new RegExp('^-?[0-9]+'),
    'd': new RegExp('^[0-9]{1,2}'),
    'm': new RegExp('^[0-9]{1,2}'),
    'H': new RegExp('^[0-9]{1,2}'),
    'M': new RegExp('^[0-9]{1,2}')
}

/*
 * _parseData does the actual parsing job needed by `strptime`
 */
function _parseDate(datestring: string, format: string):
    {Y: number | null, d: number | null, m: number | null, H: number | null, M: number | null, S: number | null} | null {
    var parsed = {Y: null, m: null, d: null, H: null, M: null, S: null};
    for (var i1=0,i2=0;i1<format.length;i1++,i2++) {
    var c1 = format[i1];
    var c2 = datestring[i2];
    if (c1 == '%') {
        c1 = format[++i1];
        // @ts-ignore
        var data = _DATE_FORMAT_REGXES[c1].exec(datestring.substring(i2));
        if (!data.length) {
            return null;
        }
        data = data[0];
        i2 += data.length-1;
        var value = parseInt(data, 10);
        if (isNaN(value)) {
            return null;
        }
        // @ts-ignore
        parsed[c1] = value;
        continue;
    }
    if (c1 != c2) {
        return null;
    }
    }
    return parsed;
}

/*
 * basic implementation of strptime. The only recognized formats
 * defined in _DATE_FORMAT_REGEXES (i.e. %Y, %d, %m, %H, %M)
 */
export function strptime(datestring: string, format: string): Date | null {
    var parsed = _parseDate(datestring, format);
    if (!parsed) {
    return null;
    }
    // create initial date (!!! year=0 means 1900 !!!)
    var date = new Date(0, 0, 1, 0, 0);
    date.setFullYear(0); // reset to year 0
    if (parsed.Y) {
    date.setFullYear(parsed.Y);
    }
    if (parsed.m) {
    if (parsed.m < 1 || parsed.m > 12) {
        return null;
    }
    // !!! month indexes start at 0 in javascript !!!
    date.setMonth(parsed.m - 1);
    }
    if (parsed.d) {
    if (!parsed.m || parsed.m < 1 || parsed.m > 31) {
        return null;
    }
    date.setDate(parsed.d);
    }
    if (parsed.H) {
    if (parsed.H < 0 || parsed.H > 23) {
        return null;
    }
    date.setHours(parsed.H);
    }
    if (parsed.M) {
    if (parsed.M < 0 || parsed.M > 59) {
        return null;
    }
    date.setMinutes(parsed.M);
    }
    return date;
}
