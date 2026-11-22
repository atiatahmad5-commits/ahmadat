import {readFileSync} from 'node:fs';
export const normalize = text => text.toLowerCase().normalize('NFKC').replace(/[\u064B-\u065F\u0670\u0640]/g,'').replace(/[أإآ]/g,'ا').replace(/ى/g,'ي');
const tokens = text => normalize(text).match(/[\p{L}\p{N}]{2,}/gu) || [];
// Multinomial Naive Bayes, Laplace smoothing. Synthetic baseline, not calibrated.
export function train(rows) {
  const counts=[new Map(),new Map()], totals=[0,0], docs=[0,0], vocab=new Set();
  for(const [label,text] of rows) {docs[label]++; for(const t of tokens(text)) {vocab.add(t); counts[label].set(t,(counts[label].get(t)||0)+1); totals[label]++;}}
  return text => {
    const ts=tokens(text).filter(t=>vocab.has(t));
    if(!ts.length) return {signal:50,knownTokens:0};
    const log=docs.map((n,c)=>Math.log(n/rows.length)+ts.reduce((sum,t)=>sum+Math.log(((counts[c].get(t)||0)+1)/(totals[c]+vocab.size)),0));
    return {signal:Math.round(100/(1+Math.exp(Math.max(-30,Math.min(30,log[0]-log[1]))))),knownTokens:ts.length};
  };
}
export const predict=train(JSON.parse(readFileSync(new URL('../data/training.json',import.meta.url),'utf8')));
