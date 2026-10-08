const fs=require('fs');
const vm=require('vm');

function fail(message){throw new Error(message)}
function read(path){return fs.readFileSync(path,'utf8')}
function syntax(path){new Function(read(path))}

['app.js','cloud-sync.js','learning-wins.js','tutor-tools.js','everyday-game.js','profile-tools.js','pattern-teaching.js','pattern-page.js','service-worker.js'].forEach(syntax);

const everydayWindow={};
vm.runInNewContext(read('everyday-data.js'),{window:everydayWindow});
const core=everydayWindow.LANGUAGE_DNA_EVERYDAY_100;
if(!Array.isArray(core)||core.length!==100)fail('Everyday 100 must contain exactly 100 entries.');
const ranks=new Set(),english=new Set();
core.forEach((item,i)=>{
  if(!item||!item.rank||!String(item.english||'').trim()||!String(item.spanish||'').trim())fail('Empty Everyday entry at index '+i);
  if(ranks.has(item.rank))fail('Duplicate Everyday rank '+item.rank);ranks.add(item.rank);
  const key=item.english.trim().toLowerCase();if(english.has(key))fail('Duplicate Everyday English term '+item.english);english.add(key);
  if(!String(item.exampleEn||'').trim()||!String(item.exampleEs||'').trim())fail('Missing example for '+item.english);
});
const byEnglish=new Map(core.map(x=>[x.english.toLowerCase(),x]));
const required={
  'hi':'Hola','good morning':'Buenos días','thank you':'Gracias','where is...?':'¿Dónde está...?',
  'what time is it?':'¿Qué hora es?','i don\'t understand':'No entiendo','i want...':'Quiero...',
  'i need...':'Necesito...','i have...':'Tengo...','water':'Agua','bathroom / toilet':'Baño',
  'help!':'¡Ayuda!','hospital':'Hospital','money':'Dinero','card':'Tarjeta','cash':'Efectivo'
};
Object.entries(required).forEach(([en,es])=>{const item=byEnglish.get(en);if(!item||item.spanish!==es)fail('Core translation regression: '+en+' should be '+es)});
['me','you','i am...','know','tomorrow','morning','evening','time','there','lunch','cash'].forEach(en=>{
  const item=byEnglish.get(en);if(!item||!String(item.note||'').trim())fail('Context-sensitive Everyday entry needs a note: '+en)
});

const patternWindow={};
vm.runInNewContext(read('pattern-data.js'),{window:patternWindow});
const dictionaries=patternWindow.LANGUAGE_DNA_PATTERN_DICTIONARIES||{};
const ids=Object.keys(dictionaries);
if(ids.length!==31)fail('Expected 31 production pattern dictionaries, found '+ids.length);
let rows=0;const pairSet=new Set();
ids.forEach(id=>{
  const words=dictionaries[id].words||[];
  words.forEach(pair=>{
    rows++;
    if(!Array.isArray(pair)||!String(pair[0]||'').trim()||!String(pair[1]||'').trim())fail('Empty production pair in '+id);
    const key=(String(pair[0]).trim()+'\u0000'+String(pair[1]).trim()).toLowerCase();
    if(pairSet.has(id+'\u0000'+key))fail('Duplicate production pair in '+id+': '+pair[0]+' / '+pair[1]);
    pairSet.add(id+'\u0000'+key)
  })
});
if(rows!==8264)fail('Expected 8,264 production rows, found '+rows);

const app=read('app.js'),index=read('index.html'),sw=read('service-worker.js'),manifest=JSON.parse(read('manifest.webmanifest'));
if(!app.includes("man:'hombre'"))fail('Trusted man → hombre regression guard missing.');
if(!app.includes('rankLiveTranslations'))fail('Live translation ranking guard missing.');
if(!app.includes('PRONUNCIATION_ADVICE'))fail('Actionable pronunciation advice missing.');
if(!app.includes('four-choice'))fail('Four-choice practice rendering missing.');
if(!app.includes('recentWrongStreak'))fail('Practice scaffolding guard missing.');
if(!index.includes('profile-tools.js?v=3'))fail('Profile tools are not loaded.');
if(!manifest.icons||!manifest.icons.length)fail('PWA manifest icon missing.');
if(!sw.includes("'./profile-tools.js?v=3'")||!sw.includes("'./app-icon.svg'"))fail('PWA support assets missing from offline cache.');
if(!index.includes('styles.css?v=23')||!index.includes('app.js?v=24'))fail('Index asset versions are not aligned.');
if(!sw.includes("./styles.css?v=23")||!sw.includes("./app.js?v=24"))fail('Service worker asset versions are not aligned.');

if(!index.includes('data-view="library"><span>⌕</span><b>Patterns</b>'))fail('Patterns must be a direct, visible mobile navigation item.');
if(!index.includes('class="home-patterns"')||!index.includes('class="home-pattern-card words"')||!index.includes('class="home-pattern-card sounds"')||!index.includes('class="home-pattern-card sentences"'))fail('Pattern discovery cards are missing from Home.');
if(!index.includes('data-open="tion-cion"')||!index.includes('data-open="h-silent"')||!index.includes('data-open="no-before-verb"'))fail('Homepage pattern links must lead to real patterns.');
if(!index.includes('class="home-how-disclosure"'))fail('Progressive disclosure for learning explanation is missing.');
if(!index.includes('data-view="game"><span>◆</span><strong>Game</strong>'))fail('Game must remain accessible from mobile More.');
if(!app.includes("['course','game','dna'].includes(name)"))fail('Mobile More active state is misaligned with navigation.');
if(!sw.includes("languagedna-v33")||!sw.includes("'./pattern.css?v=6'"))fail('Offline cache does not contain updated branded assets.');
if(!index.includes('Free from start to finish.'))fail('Free learning guarantee must stay visible.');
if(!index.includes('id="startBeginner"'))fail('First lesson entry was lost.');
if(!index.includes('id="quickTranslator"'))fail('Translator entry was lost.');

if(!index.includes('cloud-sync.js?v=2')||!sw.includes("'./cloud-sync.js?v=2'"))fail('Cloud sync safety patch not cache-versioned.');

const css=read('styles.css'),dictionaryCss=read('pattern.css');
if(!css.includes('LanguageDNA Playful Discovery')||!css.includes('--ld-lime:#c1f264')||!css.includes('.simple-home-explore'))fail('Playful original brand tokens or pattern CTA missing.');
if(!css.includes('.home-pattern-card.words')||!css.includes('.home-pattern-card.sounds')||!css.includes('.home-pattern-card.sentences'))fail('Pattern families lost individual colour coding.');
if(!dictionaryCss.includes('Playful Discovery design continuity'))fail('Dictionary branding was not updated.');
if(!index.includes('styles.css?v=23')||!sw.includes("'./styles.css?v=23'")||!sw.includes("'./pattern.css?v=6'"))fail('Branding assets must be PWA cache-versioned.');
if(!manifest.theme_color||manifest.theme_color!=='#0b826d')fail('New PWA theme colour missing.');

if(!app.includes('data-pattern-type=')||!read('styles.css').includes('.learner-pattern-card[data-pattern-type="visual"]'))fail('Semantic pattern family colour coding missing.');


if(!read('styles.css').includes('Whole-site LanguageDNA Playful Discovery system'))fail('Whole-site branding layer is missing.');
for(const family of ['course-progress-hero','practice-stage','daily-hero','scenario-card','game-question-card','dna-outcome-copy','translator-panel','account-dialog','pattern-next-card']){
  if(!read('styles.css').includes('.'+family))fail('Branding missing from '+family);
}
if(!read('pattern.css').includes('v18.1 full-site finish'))fail('Dictionary design continuity missing.');
if(!read('pattern.html').includes('pattern.css?v=6'))fail('Pattern page stylesheet must be versioned.');

if(!app.includes("service-worker.js?v=19"))fail('Updated PWA registration is missing.');
const tutor=read('tutor-tools.js');
if(!app.includes('tutor-tools.js?v=8')||!sw.includes("'./tutor-tools.js?v=8'"))fail('Daily 5 engine not correctly versioned.');
if(!index.includes('learning-wins.js?v=1')||!sw.includes("'./learning-wins.js?v=1'"))fail('Learning milestones must load offline.');
if(!index.includes('id="homeLearningJourney"')||!index.includes('id="journeyMilestones"'))fail('Optional Home continuation and milestone dashboard missing.');
if(!tutor.includes('record.focusRank')||!tutor.includes('data-daily-help')||!tutor.includes('data-tutor-speak-slow')||!tutor.includes('daily-celebration'))fail('New first-five improvements are missing.');
if(!read('styles.css').includes('v19 — Five Small Wins'))fail('v19 learner experience styles not loaded.');

require('./cloud-sync-check.js');

console.log('LanguageDNA quality checks passed:',{everyday:core.length,dictionaries:ids.length,productionRows:rows});
