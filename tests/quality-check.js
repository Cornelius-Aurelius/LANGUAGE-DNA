const fs=require('fs');
const mascotArtwork=['assets/mascot/xabi-hero.webp','assets/mascot/xabi-face.webp'];
const vm=require('vm');

function fail(message){throw new Error(message)}
function read(path){return fs.readFileSync(path,'utf8')}
function syntax(path){new Function(read(path))}

['app.js','pattern-quest.js','cloud-sync.js','learning-wins.js','tutor-tools.js','everyday-game.js','profile-tools.js','pattern-teaching.js','pattern-page.js','service-worker.js'].forEach(syntax);

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

const credit='Created by <a href="https://corneliusaurelius.com/">Cornelius Aurelius</a>';
if(!index.includes(credit)||!read('pattern.html').includes(credit))fail('Subtle linked creator credit must appear on Home and dictionary pages.');
if((index.match(/class="bluxabi-creator-credit"/g)||[]).length!==1||!index.includes('</main>')||!index.includes('aria-label="Site credit"'))fail('Creator link needs a single meaningful footer.');
if(!read('styles.css').includes('.bluxabi-creator-credit')||!read('pattern.css').includes('.bluxabi-creator-credit'))fail('Creator footer must be styled on both page types.');
if(index.indexOf('bluxabi-creator-credit')<index.indexOf('</main>'))fail('Creator credit should not interrupt the learning flow.');

if(manifest.name!=='BluXabi — Learn Spanish Through Patterns'||manifest.short_name!=='BluXabi')fail('BluXabi must be the installable app name.');
if(!index.includes('<strong>BluXabi</strong>')||!index.includes('BluXabi — Learn Spanish Through Patterns'))fail('BluXabi homepage name or title missing.');
if(!index.includes('MEET XABI'))fail('Xabi mascot identity must remain unchanged.');
if(!index.includes('assets/mascot/xabi-logo.webp')||!sw.includes("'./assets/mascot/xabi-logo.webp'"))fail('Reframed Xabi header logo must be present and cached.');
if(!read('styles.css').includes('box-shadow:0 2px 8px rgba(13,91,82,.12)')||!read('styles.css').includes('.mascot-brand-mark img{display:block;width:100%;height:100%;object-fit:contain'))fail('Logo should have a subtle even shadow and no forced cropped image.');
const logoBuf=fs.readFileSync('assets/mascot/xabi-logo.webp');if(logoBuf.length<10000||logoBuf.toString('ascii',0,4)!=='RIFF')fail('New Xabi portrait art is not a valid substantial WebP.');
if(!read('pattern.html').includes('Back to BluXabi')||!read('pattern-page.js').includes('BluXabi Pattern Dictionary'))fail('Dictionary pages must use BluXabi.');
if(!read('profile-tools.js').includes("app:'LanguageDNA'")||!read('cloud-sync.js').includes("app: 'LanguageDNA'"))fail('Legacy learner progress format must be preserved during branding.');
if(!read('profile-tools.js').includes('BluXabi-progress-'))fail('Backups must use new filename branding.');

mascotArtwork.forEach(file=>{const b=fs.readFileSync(file);if(b.length<1000||b.toString('ascii',0,4)!=='RIFF'||!sw.includes("'./"+file+"'"))fail('Mascot art not locally available and cached: '+file)});
if(!index.includes('mascot-showcase')||!index.includes('mascot-home-art')||!index.includes('mascot-brand-mark'))fail('The mascot must appear on Home and in the header.');
if(!read('pattern-quest.js').includes('xabi-face.webp')||!read('learning-wins.js').includes('mascot-journey-avatar'))fail('Mascot missing from learning feedback or daily journey.');
if(!index.includes('MEET XABI')||!index.includes('xabi-hero.webp')||!read('pattern-quest.js').includes('Xabi says:')||!app.includes('XABI SAYS: GREAT EFFORT!'))fail('Xabi must be consistently named throughout the learning experience.');
if(index.includes('learning-buddy.webp')||sw.includes('learning-buddy.webp'))fail('Retired mascot artwork must not be referenced.');
if(!manifest.icons.some(x=>x.src==='assets/mascot/xabi-icon-192-v2.png')||!manifest.icons.some(x=>x.src==='assets/mascot/xabi-icon-512-v2.png'))fail('Installed app must use Xabi icons.');
for(const file of ['assets/mascot/xabi-icon-192-v2.png','assets/mascot/xabi-icon-512-v2.png']){const buf=fs.readFileSync(file);if(buf.length<1000||buf.subarray(1,4).toString()!=='PNG'||!sw.includes("'./"+file+"'"))fail('Xabi PWA icon missing or uncached: '+file)}
if(!app.includes("man:'hombre'"))fail('Trusted man → hombre regression guard missing.');
if(!app.includes('rankLiveTranslations'))fail('Live translation ranking guard missing.');
if(!app.includes('PRONUNCIATION_ADVICE'))fail('Actionable pronunciation advice missing.');
if(!app.includes('four-choice'))fail('Four-choice practice rendering missing.');
if(!app.includes('recentWrongStreak'))fail('Practice scaffolding guard missing.');
if(!index.includes('profile-tools.js?v=4'))fail('Profile tools are not loaded.');
if(!manifest.icons||!manifest.icons.length)fail('PWA manifest icon missing.');
if(!sw.includes("'./profile-tools.js?v=4'")||!sw.includes("'./app-icon.svg'"))fail('PWA support assets missing from offline cache.');
if(!index.includes('styles.css?v=34')||!index.includes('app.js?v=34'))fail('Index asset versions are not aligned.');
if(!sw.includes("./styles.css?v=34")||!sw.includes("./app.js?v=34"))fail('Service worker asset versions are not aligned.');

if(!index.includes('data-view="library"><span>⌕</span><b>Patterns</b>'))fail('Patterns must be a direct, visible mobile navigation item.');
if(!index.includes('class="home-patterns"')||!index.includes('class="home-pattern-card words"')||!index.includes('class="home-pattern-card sounds"')||!index.includes('class="home-pattern-card sentences"'))fail('Pattern discovery cards are missing from Home.');
if(!index.includes('class="xabi-word-fact"')||!index.includes('XABI\'S FUN FACT')||!index.includes('over 20,000 English–Spanish cognates'))fail('Xabi\'s educational cognate fact missing.');
if(!index.includes('10.3389/feduc.2023.1225169/full')||!index.includes('Word patterns are clues, not rules that work every time.'))fail('Cognate estimate must link to research and include the exception warning.');
if((index.match(/class="xabi-word-reveal"/g)||[]).length!==3||!index.includes('lang="es">nación')||!index.includes('lang="es">posible'))fail('Xabi word-reveal mini lesson missing or mistranslated.');
if(!index.includes('class="secondary-btn xabi-word-fact-cta" data-open="tion-cion"'))fail('Xabi fun fact must lead to a real pattern lesson.');
if(!read('styles.css').includes('.xabi-word-reveal summary:focus-visible')||!read('styles.css').includes('body.dark .xabi-word-fact'))fail('Cognate reveal controls need keyboard focus and dark theme.');
if(!index.includes('data-open="tion-cion"')||!index.includes('data-open="h-silent"')||!index.includes('data-open="no-before-verb"'))fail('Homepage pattern links must lead to real patterns.');
if(!index.includes('class="home-how-disclosure"'))fail('Progressive disclosure for learning explanation is missing.');
if(!index.includes('class="nav-item" type="button" data-view="game"')||!index.includes('data-view="practice"><span>◎</span><strong>Practice</strong>'))fail('Play must be directly visible on mobile, Practice accessible from More.');
if(!app.includes("['course','practice','dna'].includes(name)"))fail('Mobile More active state is misaligned with navigation.');
if(!sw.includes("bluxabi-v47")||!sw.includes("'./pattern.css?v=7'"))fail('Offline cache does not contain updated branded assets.');
if(!index.includes('Free from start to finish.'))fail('Free learning guarantee must stay visible.');
if(!index.includes('id="startBeginner"'))fail('First lesson entry was lost.');
if(!index.includes('id="quickTranslator"'))fail('Translator entry was lost.');

if(!index.includes('cloud-sync.js?v=3')||!sw.includes("'./cloud-sync.js?v=3'"))fail('Cloud sync safety patch not cache-versioned.');

const css=read('styles.css'),dictionaryCss=read('pattern.css');
if(!css.includes('LanguageDNA Playful Discovery')||!css.includes('--ld-lime:#c1f264')||!css.includes('.simple-home-explore'))fail('Playful original brand tokens or pattern CTA missing.');
if(!css.includes('.home-pattern-card.words')||!css.includes('.home-pattern-card.sounds')||!css.includes('.home-pattern-card.sentences'))fail('Pattern families lost individual colour coding.');
if(!dictionaryCss.includes('Playful Discovery design continuity'))fail('Dictionary branding was not updated.');
if(!index.includes('styles.css?v=34')||!sw.includes("'./styles.css?v=34'")||!sw.includes("'./pattern.css?v=7'"))fail('Branding assets must be PWA cache-versioned.');
if(!manifest.theme_color||manifest.theme_color!=='#0b826d')fail('New PWA theme colour missing.');

if(!app.includes('data-pattern-type=')||!read('styles.css').includes('.learner-pattern-card[data-pattern-type="visual"]'))fail('Semantic pattern family colour coding missing.');


if(!read('styles.css').includes('Whole-site LanguageDNA Playful Discovery system'))fail('Whole-site branding layer is missing.');
for(const family of ['course-progress-hero','practice-stage','daily-hero','scenario-card','game-question-card','dna-outcome-copy','translator-panel','account-dialog','pattern-next-card']){
  if(!read('styles.css').includes('.'+family))fail('Branding missing from '+family);
}
if(!read('pattern.css').includes('v18.1 full-site finish'))fail('Dictionary design continuity missing.');
if(!read('pattern.html').includes('pattern.css?v=7'))fail('Pattern page stylesheet must be versioned.');

if(!app.includes("service-worker.js?v=32"))fail('Updated PWA registration is missing.');
const tutor=read('tutor-tools.js');
if(!app.includes('tutor-tools.js?v=10')||!sw.includes("'./tutor-tools.js?v=10'"))fail('Daily 5 engine not correctly versioned.');
if(!index.includes('learning-wins.js?v=4')||!sw.includes("'./learning-wins.js?v=4'"))fail('Learning milestones must load offline.');
if(!index.includes('id="homeLearningJourney"')||!index.includes('id="journeyMilestones"'))fail('Optional Home continuation and milestone dashboard missing.');
if(!tutor.includes('record.focusRank')||!tutor.includes('data-daily-help')||!tutor.includes('data-tutor-speak-slow')||!tutor.includes('daily-celebration'))fail('New first-five improvements are missing.');
if(!read('styles.css').includes('v19 — Five Small Wins'))fail('v19 learner experience styles not loaded.');

const quest=read('pattern-quest.js');
if(!index.includes('class="simple-home-actions home-two-paths"')||!index.includes('class="primary-btn home-play-button"')||!index.includes('id="patternQuest"'))fail('Home must offer Discover / Play and quest entry.');
if(!index.includes('id="questProgressSummary"')||!index.includes('pattern-quest.js?v=10')||!sw.includes("'./pattern-quest.js?v=10'"))fail('Quest stars and offline game assets missing.');
for(const family of ['Word Garden','Sound Safari','Sentence Space','tion-cion','ity-idad','h-silent','no-before-verb'])if(!quest.includes(family))fail('Quest learning family missing: '+family);
if(!quest.includes('No timers. No lost lives.')||!quest.includes('No hurry and no penalty'))fail('No-pressure game guard missing.');
if(!read('styles.css').includes('v20 — Two simple paths'))fail('New kid-friendly interface style missing.');

const teach=read('pattern-teaching.js'),game=read('pattern-quest.js');
for(const id of ['regular-ar','regular-er','regular-ir']){
  if(!teach.includes("'"+id+"':{"))fail('Missing beginner-friendly verb teaching: '+id);
}
if(!app.includes('pattern-mini-check')||!app.includes('pattern-journey-details')||!app.includes('data-mini-answer'))fail('Tiny check and optional progress disclosure missing.');
if(!teach.includes('check:{question:')||!teach.includes('steps:['))fail('Pattern teaching is missing small-step examples and retrieval checks.');
if(!game.includes('quest-earned-badge')||!game.includes('quest-word-connection')||!game.includes('badges={'))fail('Learning-focused quest celebrations or badges missing.');
if(!index.includes('pattern-teaching.js?v=4')||!index.includes('pattern-quest.js?v=10')||!sw.includes("'./pattern-teaching.js?v=4'")||!sw.includes("'./pattern-quest.js?v=10'"))fail('Updated learning/game scripts must be offline-cached.');
if(!read('styles.css').includes('v21 — rewarding pattern discoveries'))fail('v21 design styles not present.');


const mapGame=read('pattern-quest.js');
if(!mapGame.includes('quest-map-stop')||!mapGame.includes('quest-mystery-button')||!mapGame.includes("mysteryWins"))fail('Adventure map or unlockable mystery missing.');
if(!mapGame.includes('data-quest-tile')||!mapGame.includes('data-quest-check-tiles'))fail('Real sentence tile builder missing.');
if(!mapGame.includes('data-quest-listen-mode')||!mapGame.includes('listenFirst'))fail('Listen-first mission missing.');
if(!mapGame.includes('quest-friend-face')||!mapGame.includes('Xabi says'))fail('Original celebrating friend missing.');
if(!index.includes('pattern-quest.js?v=10')||!sw.includes("'./pattern-quest.js?v=10'"))fail('Adventure script not versioned offline.');
if(!read('styles.css').includes('v22 — Pattern Quest Adventure Map'))fail('Adventure map styling missing.');


const streamlinedQuest=read('pattern-quest.js'),compactCSS=read('styles.css');
for(const guard of ['queueAutoAdvance','cancelAutoAdvance','quest-focused','quest-answer-flash','positionGameAtTop']){
  if(!streamlinedQuest.includes(guard))fail('v23 fast play control missing: '+guard);
}
if(!compactCSS.includes('v23 — One-screen Pattern Quest')||!compactCSS.includes('.quest-focused .quest-choices')||!compactCSS.includes('.quest-answer-flash.retry'))fail('Compact answer layout / feedback styling missing.');
if(!index.includes('pattern-quest.js?v=10')||!sw.includes("'./pattern-quest.js?v=10'")||!sw.includes("'./styles.css?v=34'"))fail('Mobile auto-play cache assets must be updated for offline use.');


const beginnerQuest=read('pattern-quest.js'),beginnerCSS=read('styles.css');
if(!index.includes('home-more-tools')||!index.includes('library-beginner-start')||!index.includes('My Progress'))fail('Beginner-first home navigation/labels are missing.');
if(!app.includes("mode:'choice'")||!index.includes('data-mode="choice"'))fail('Beginner practice must offer recognition by default.');
if(app.includes("markJourney(p.id,'understand');markJourney(p.id,'examples')"))fail('Opening a pattern must not give unearned understanding credit.');
if(!app.includes("markJourney(panel.dataset.miniPatternId,'understand')")||!app.includes("data-pattern-examples"))fail('Pattern progress requires explicit evidence and example exploration.');
if(!beginnerQuest.includes('orderedChoices(q,p)')||!beginnerQuest.includes('data-quest-pacing')||!beginnerQuest.includes('focusQuestion()'))fail('Beginner game shuffle, pace and focus guards missing.');
if(!beginnerCSS.includes('v24 — Beginner-first clarity')||!beginnerCSS.includes('quest-pace-button'))fail('Beginner visual rules missing.');
if(!index.includes('pattern-quest.js?v=10')||!sw.includes("'./pattern-quest.js?v=10'")||!sw.includes("'./styles.css?v=34'"))fail('v24 mobile and offline assets must be versioned.');

require('./plain-language-check.js');
require('./cloud-sync-check.js');

console.log('BluXabi quality checks passed:',{everyday:core.length,dictionaries:ids.length,productionRows:rows});
