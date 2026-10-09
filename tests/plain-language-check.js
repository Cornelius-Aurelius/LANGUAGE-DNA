'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const read = name => fs.readFileSync(path.join(__dirname, '..', name), 'utf8');

const questSource = read('pattern-quest.js');
const appSource = read('app.js');
const teachingSource = read('pattern-teaching.js');

// Run the actual quest script with an intentionally tiny browser stand-in.
const handlers = [];
const storage = new Map();
const questRoot = {
  innerHTML: '',
  closest: () => ({classList:{toggle(){}}})
};
const dom = {
  getElementById(id){return id === 'patternQuest' ? questRoot : null;},
  querySelector(){return null;},
  addEventListener(type, fn){if(type === 'click')handlers.push(fn);}
};
const context = {
  document: dom,
  window: {scrollTo(){}},
  localStorage: {
    getItem(key){return storage.has(key) ? storage.get(key) : null;},
    setItem(key,value){storage.set(key,String(value));}
  },
  setTimeout(){return 1;},
  clearTimeout(){},
  requestAnimationFrame(){}
};
vm.runInNewContext(questSource, context, {filename:'pattern-quest.js'});
function click(selector, dataset={}){
  const target = {closest(wanted){return wanted === selector ? {dataset} : null;}};
  for(const handler of handlers)handler({target});
}

click('[data-quest-world]',{questWorld:'words'});
assert.match(questRoot.innerHTML,/My pace/,'Beginner pace should wait for Next');
assert.match(questRoot.innerHTML,/How do you say this word in Spanish/);

click('[data-quest-answer]',{questAnswer:'nación'});
const retry = questRoot.innerHTML.match(/<div class="quest-answer-flash retry"[^>]*>(.*?)<\/div>/);
assert.ok(retry,'Wrong attempts should show a helpful message');
assert.match(retry[1],/Look for a Spanish word ending in -ción/);
assert.doesNotMatch(retry[1],/información|information → información/,'Do not reveal the answer after a wrong attempt');
assert.equal(context.window.LanguageDNAQuest.progress().active.helped,true);
click('[data-quest-answer]',{questAnswer:'información'});
assert.match(questRoot.innerHTML,/information → información/,'Explain the correct answer only after success');

click('[data-quest-world]',{questWorld:'sounds'});
const soundChoices = [...questRoot.innerHTML.matchAll(/data-quest-answer="([A-Z])"/g)].map(m=>m[1]);
assert.equal(soundChoices.length,4,'Give four choices for sound checks');
assert.ok(soundChoices.every(x=>['A','E','I','O','U'].includes(x)),'Sound choices must be vowel sounds');
assert.doesNotMatch(questRoot.innerHTML,/What sound starts this Spanish word/);

vm.runInNewContext(teachingSource,context,{filename:'pattern-teaching.js'});
const stress=context.window.LanguageDNATeaching.build({id:'stress-default'});
const accent=context.window.LanguageDNATeaching.build({id:'accent-overrides'});
assert.match(stress.heading,/sounds stronger/);
assert.match(accent.meaning,/little line above a Spanish vowel/);
assert.match(stress.check.question,/doctor/,'Test a new example, not the one just explained');
assert.match(accent.check.question,/mamá/,'Test a new example, not canción');

assert.match(appSource,/Say “hotel” slowly: ho–tel\. Which part sounds stronger/);
assert.match(appSource,/Say “canción” slowly\. Which part sounds stronger/);
assert.match(appSource,/if\(target==='spanish'&&p.id==='accent-overrides'\)return \['can','ción'\]/);
assert.match(appSource,/function practiceRetryClue\(p\)/);
assert.match(appSource,/return seededShuffle\(\[correct\]\.concat\(distractors\),seed\)/,'Multiple choice must always include the correct answer');
assert.match(appSource,/const example=\(p.examples\|\|\[\]\).find/,'Help uses a different example from the current question');

console.log('LanguageDNA plain-language regression checks passed.');
