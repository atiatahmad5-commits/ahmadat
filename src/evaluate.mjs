import {readFileSync} from 'node:fs';
import {analyze} from './engine.mjs';
const rows=JSON.parse(readFileSync(new URL('../data/evaluation.json',import.meta.url),'utf8'));
const results=rows.map(x=>({...x,score:analyze(x.text).finalScore}));
const confusion={tp:0,fp:0,tn:0,fn:0};
for(const r of results)confusion[r.label?(r.score>=30?'tp':'fn'):(r.score>=30?'fp':'tn')]++;
console.log(JSON.stringify({dataset:'20 authored synthetic smoke cases, separate from training strings, not independent validation',threshold:30,...confusion,precision:confusion.tp/(confusion.tp+confusion.fp)||0,recall:confusion.tp/(confusion.tp+confusion.fn)||0,results},null,2));
