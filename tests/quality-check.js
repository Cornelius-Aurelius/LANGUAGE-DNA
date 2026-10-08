const fs=require('fs');
const vm=require('vm');

function fail(message){throw new Error(message)}
function read(path){return fs.readFileSync(path,'utf8')}
function syntax(path){new Function(read(path))}

['app.js','cloud-sync.js','tutor-tools.js','everyday-game.js','profile-tools.js','pattern-teaching.js','pattern-page.js','service-worker.js'].forEach(syntax);

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
if(!index.includes('styles.css?v=17')||!index.includes('app.js?v=21'))fail('Index asset versions are not aligned.');
if(!sw.includes("./styles.css?v=17")||!sw.includes("./app.js?v=21"))fail('Service worker asset versions are not aligned.');

if(!index.includes('data-view="library"><span>⌕</span><b>Patterns</b>'))fail('Patterns must be a direct, visible mobile navigation item.');
if(!index.includes('class="home-patterns"')||!index.includes('class="home-pattern-card words"')||!index.includes('class="home-pattern-card sounds"')||!index.includes('class="home-pattern-card sentences"'))fail('Pattern discovery cards are missing from Home.');
if(!index.includes('data-open="tion-cion"')||!index.includes('data-open="h-silent"')||!index.includes('data-open="no-before-verb"'))fail('Homepage pattern links must lead to real patterns.');
if(!index.includes('class="home-how-disclosure"'))fail('Progressive disclosure for learning explanation is missing.');
if(!index.includes('data-view="game"><span>◆</span><strong>Game</strong>'))fail('Game must remain accessible from mobile More.');
if(!app.includes("['course','game','dna'].includes(name)"))fail('Mobile More active state is misaligned with navigation.');
if(!sw.includes("languagedna-v25")||!sw.includes("'./pattern.css?v=4'"))fail('Offline cache does not contain updated branded assets.');
if(!index.includes('Free from start to finish.'))fail('Free learning guarantee must stay visible.');
if(!index.includes('id="startBeginner"'))fail('First lesson entry was lost.');
if(!index.includes('id="quickTranslator"'))fail('Translator entry was lost.');

if(!index.includes('cloud-sync.js?v=2')||!sw.includes("'./cloud-sync.js?v=2'"))fail('Cloud sync safety patch not cache-versioned.');

require('./cloud-sync-check.js');

console.log('LanguageDNA quality checks passed:',{everyday:core.length,dictionaries:ids.length,productionRows:rows});
