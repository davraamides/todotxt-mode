var fs = require("fs");
var re = /^#+\s+Tasks\s*\n(.*?)\n\n/sm;
var txt = fs.readFileSync('todo.txt');
var s = re.exec(txt.toString());
console.log(s[1]);
