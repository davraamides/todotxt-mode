import * as fs from 'fs';
let re = /^#+\s+Tasks\s*\n(.*?)\n\n/m;
let txt = fs.readFileSync('todo.txt');
let s = re.exec(txt.toString());
console.log(s);
