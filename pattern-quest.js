(() => {
  'use strict';

  // Short, child-friendly practice of existing, verified LanguageDNA patterns.
  // Local-only achievements: no accounts, rankings, timers, purchases or streak penalties.
  const STORAGE = 'ldna-quest-v1';
  const worlds = [
    {
      id:'words', icon:'🌿', label:'Word Garden', type:'words',
      sub:'Spot Spanish words hiding inside English.', pattern:'tion-cion',
      secret:'English -tion often becomes Spanish -ción; -ity often becomes -idad. Look for the shared beginning.',
      questions:[
        {en:'information',answer:'información',choices:['nación','información','actividad','celebración'],pattern:'tion-cion',why:'information → información. The -tion ending becomes -ción.'},
        {en:'nation',answer:'nación',choices:['nación','universidad','información','actividad'],pattern:'tion-cion',why:'nation → nación. The familiar -tion ending becomes -ción.'},
        {en:'activity',answer:'actividad',choices:['celebración','nación','actividad','información'],pattern:'ity-idad',why:'activity → actividad. Here, -ity becomes -idad.'},
        {en:'celebration',answer:'celebración',choices:['actividad','información','nación','celebración'],pattern:'tion-cion',why:'celebration → celebración. You spotted the -ción link!'},
        {en:'university',answer:'universidad',choices:['universidad','celebración','actividad','nación'],pattern:'ity-idad',why:'university → universidad. -ity becomes -idad.'}
      ]
    },
    {
      id:'sounds', icon:'🎵', label:'Sound Safari', type:'sounds',
      sub:'Discover the quiet H in Spanish.', pattern:'h-silent',
      secret:'In standard Spanish the letter H is silent. So hola begins with the sound of O, not an English H.',
      questions:[
        {en:'hola',answer:'O',choices:['A','E','I','O'],pattern:'h-silent',why:'hola starts with the O sound because H is silent.'},
        {en:'hablar',answer:'A',choices:['E','I','O','A'],pattern:'h-silent',why:'hablar begins with the A sound. H stays silent.'},
        {en:'hotel',answer:'O',choices:['A','E','I','O'],pattern:'h-silent',why:'hotel begins with the O sound in Spanish.'},
        {en:'hermano',answer:'E',choices:['A','I','O','E'],pattern:'h-silent',why:'hermano begins with the E sound, not an H sound.'},
        {en:'hilo',answer:'I',choices:['A','E','O','I'],pattern:'h-silent',why:'hilo starts with the I sound. Another silent H!'}
      ]
    },
    {
      id:'sentences', icon:'🚀', label:'Sentence Space', type:'sentences',
      sub:'Turn Spanish verbs into useful negatives.', pattern:'no-before-verb',
      secret:'In Spanish, put no right before the verb: entiendo → no entiendo (I do not understand).',
      questions:[
        {en:"I don't understand",answer:'no entiendo',choices:['entiendo no','no entiendo','no entiendes','entiendo'],pattern:'no-before-verb',why:'Put no before entiendo: no entiendo.'},
        {en:"I don't want",answer:'no quiero',choices:['quiero no','no quieres','no quiero','quiero'],pattern:'no-before-verb',why:'no + quiero = no quiero (I do not want).'},
        {en:"I don't have",answer:'no tengo',choices:['tengo no','no tiene','tengo','no tengo'],pattern:'no-before-verb',why:'no + tengo = no tengo (I do not have).'},
        {en:"I don't speak",answer:'no hablo',choices:['no habla','hablo no','no hablo','hablo'],pattern:'no-before-verb',why:'no + hablo = no hablo (I do not speak).'},
        {en:"I don't know",answer:'no sé',choices:['sé no','no sabes','sé','no sé'],pattern:'no-before-verb',why:'no + sé = no sé (I do not know).'}
      ]
    }
  ];
  const replayRows={
    words:[['education','educación','tion-cion'],['invitation','invitación','tion-cion'],['possibility','posibilidad','ity-idad'],['communication','comunicación','tion-cion'],['curiosity','curiosidad','ity-idad']],
    sounds:[['historia','I'],['humano','U'],['hora','O'],['hacer','A'],['héroe','E']],
    sentences:[['I do not eat','no como'],['I do not live','no vivo'],['I do not work','no trabajo'],['I do not need','no necesito'],['I do not drink','no bebo']]
  };
  const replays={};
  worlds.forEach(w=>{replays[w.id]=replayRows[w.id].map(row=>({en:row[0],answer:row[1],pattern:row[2]||w.pattern,
    choices:w.id==='sounds'?['A','E','I','O','U'].filter(x=>x!==row[1]).slice(0,3).concat(row[1]):replayRows[w.id].map(x=>x[1]).filter(x=>x!==row[1]).slice(0,3).concat(row[1]),
    why:w.id==='sounds'?'The H is silent: '+row[0]+' begins with the '+row[1]+' sound.':w.id==='sentences'?'Put no before the verb: '+row[1]+'.':row[0]+' → '+row[1]+'. Here '+(row[2]==='tion-cion'?'-tion becomes -ción.':'-ity becomes -idad.')
  }))});
  const EVIDENCE='ldna-quest-evidence-v1';
  function evidence(){try{return JSON.parse(localStorage.getItem(EVIDENCE)||'{}')||{}}catch(_){return {}}}
  function recordEvidence(a){const data=evidence();data[a.world]={completedAt:Date.now(),independent:a.independent||0,total:5,replay:Boolean(a.variant)};try{localStorage.setItem(EVIDENCE,JSON.stringify(data))}catch(_){}}
  const badges={words:'🌱 Word Detective',sounds:'🎧 Sound Scout',sentences:'🚀 Sentence Builder'};
  const validId = id => worlds.some(w => w.id === id);
  const unlocked = data => worlds.filter(w => data.best && data.best[w.id] === 5).length >= 2;
  const mystery = {id:'mystery',icon:'🗝️',label:'Mystery Island',type:'mixed',sub:'Mix the Spanish secrets you already know.',pattern:'tion-cion',secret:'Use what you discovered in your earlier adventures.'};
  function mysteryQuestions(){
    const mastered=worlds.filter(w => saved.best[w.id]===5);
    const first=mastered[0],second=mastered[1];
    if(!first||!second)return [];
    return [first.questions[0],second.questions[0],first.questions[1],second.questions[1],first.questions[3]]
      .map((q,i)=>Object.assign({},q,{kind:(i%2===0?first:second).type}));
  }
  function playWorld(id){
    if(id==='mystery')return Object.assign({},mystery,{questions:mysteryQuestions()});
    const w=world(id);return saved.active&&saved.active.world===id&&saved.active.variant?Object.assign({},w,{questions:replays[id]}):w;
  }
  function read() {
    try {
      const d=JSON.parse(localStorage.getItem(STORAGE)||'{}');
      if (!d || typeof d !== 'object') return {best:{},active:null,mysteryWins:0};
      const best={};
      worlds.forEach(w => {best[w.id]=d.best && d.best[w.id] === 5 ? 5 : 0});
      let active=null;
      const a=d.active;
      if (a && (validId(a.world)||(a.world==='mystery'&&unlocked({best}))) && Number.isInteger(a.index) && a.index>=0 && a.index<5)
        active={world:a.world,index:a.index,answered:Boolean(a.answered),seed:Number.isInteger(a.seed)?a.seed:0,variant:Boolean(a.variant),helped:Boolean(a.helped),independent:Math.max(0,Math.min(5,Number(a.independent)||0))};
      return {best,active,mysteryWins:Math.min(999,Math.max(0,Number.parseInt(d.mysteryWins,10)||0))};
    } catch(_) {return {best:{},active:null,mysteryWins:0};}
  }
  let saved=read(),completed=null,clue=false,wrong=null,listing=false,newBadge=false,tilesMode=false,placed=[],listenFirst=false;
  let autoAdvanceTimer=null;
  const PACE_KEY='ldna-quest-pacing-v1';
  let pace=localStorage.getItem(PACE_KEY)==='auto'?'auto':'manual';
  function orderedChoices(q,p){
    const shuffled=q.choices.slice();
    let seed=((p.seed||0)^(Math.imul(p.index+1,2654435761)))>>>0;
    for(let i=shuffled.length-1;i>0;i--){
      seed=(Math.imul(seed,1664525)+1013904223)>>>0;
      const j=seed%(i+1),tmp=shuffled[i];shuffled[i]=shuffled[j];shuffled[j]=tmp;
    }
    return shuffled;
  }
  function focusQuestion(){
    const el=document.querySelector('[data-view-panel="game"].active .quest-question h3');
    if(el)el.focus({preventScroll:true});
  }
  function focusRetry(){
    const el=document.querySelector('[data-view-panel="game"].active .quest-answer:not(:disabled)');
    if(el)el.focus({preventScroll:true});
  }
  function cancelAutoAdvance(){
    if(autoAdvanceTimer!==null){clearTimeout(autoAdvanceTimer);autoAdvanceTimer=null;}
  }
  function positionGameAtTop(){
    if(document.querySelector('[data-view-panel="game"].active')){
      window.scrollTo({top:0,left:0,behavior:'instant'});
    }
  }
  function queueAutoAdvance(){
    if(pace==='manual'||autoAdvanceTimer!==null||!saved.active||!saved.active.answered||listing||!document.querySelector('[data-view-panel="game"].active'))return;
    const id=saved.active.world,index=saved.active.index;
    autoAdvanceTimer=setTimeout(function(){
      autoAdvanceTimer=null;
      if(saved.active&&saved.active.world===id&&saved.active.index===index&&saved.active.answered&&!listing&&document.querySelector('[data-view-panel="game"].active')){
        advance();
      }
    },8000); // Automatic movement is optional; beginners choose when to continue.
  }
  function write(){try{localStorage.setItem(STORAGE,JSON.stringify(saved));}catch(_){}renderProgress()}
  function esc(s){return String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function world(id){return worlds.find(w=>w.id===id);}
  function stars(){return worlds.reduce((sum,w)=>sum+(saved.best[w.id]||0),0);}
  function renderProgress(){
    const box=document.getElementById('questProgressSummary');
    if(box)box.innerHTML='<div class="quest-mini-progress"><span aria-hidden="true">⭐</span><div><strong>'+stars()+' of 15 adventure stars</strong><small>From completed worlds.'+(saved.mysteryWins?' 🏅 Mystery Explorer earned!':' Complete two worlds to unlock Mystery Island.')+' Your rewards stay with you.</small></div><button type="button" class="secondary-btn" data-quest-open>Play a quest →</button></div>';
    const sticker=document.getElementById('questBadgeCount');
    if(sticker)sticker.textContent=String(worlds.filter(w=>saved.best[w.id]===5).length+(saved.mysteryWins?1:0));
    const badge=document.getElementById('questStarTotal');
    if(badge)badge.textContent=String(stars());
  }
  function renderWorlds(){
    const hasProgress=Boolean(saved.active),ready=unlocked(saved);
    const nodes=worlds.map((w,i)=>{
      const complete=Boolean(saved.best[w.id]);
      const resume=hasProgress&&saved.active.world===w.id;
      return '<div class="quest-map-stop quest-map-stop-'+w.type+'"><button type="button" class="quest-world quest-world-'+w.type+'" data-quest-world="'+w.id+'" aria-label="'+esc(w.label)+'. '+(complete?'Five stars earned. ':resume?'Continue where you stopped. ':'')+'Play five questions.">'+
        '<span class="quest-world-icon" aria-hidden="true">'+w.icon+'</span>'+
        '<span class="quest-world-copy"><span class="quest-world-kicker">ADVENTURE '+(i+1)+'</span><strong>'+esc(w.label)+'</strong><small>'+esc(w.sub)+'</small><span class="quest-world-status">'+(complete?'🏅 '+esc(badges[w.id])+' · 5 stars':resume?'▶ Keep playing':'Play 5 questions →')+'</span></span></button>'+
        '<button type="button" class="quest-learn-link" data-open="'+esc(w.pattern)+'">💡 Learn the pattern first <span aria-hidden="true">↗</span></button></div>'
    }).join('');
    return '<div class="quest-intro"><span class="quest-eyebrow">YOUR SPANISH ADVENTURE</span><h2>Where will you explore?</h2>'+
      '<p>Learn a secret. Play five quick questions. Unlock a mystery with the patterns you practise.</p>'+
      '<div class="quest-total" aria-label="'+stars()+' of 15 stars collected"><span aria-hidden="true">⭐</span><strong>'+stars()+' / 15 stars</strong><small>No timers. No lost lives.</small></div></div>'+
      '<div class="quest-map" aria-label="Adventure learning map"><div class="quest-map-trail" aria-hidden="true"></div><div class="quest-world-grid">'+nodes+'</div>'+
      '<div class="quest-map-mystery '+(ready?'unlocked':'locked')+'"><span class="quest-mystery-icon" aria-hidden="true">'+(ready?'🏝️':'🔒')+'</span><div class="quest-mystery-copy"><span class="quest-world-kicker">BONUS DISCOVERY</span><strong>Mystery Island</strong>'+
      '<small>'+(ready?'Unlocked! Mix patterns from two completed worlds.':(worlds.filter(w=>saved.best[w.id]===5).length)+' / 2 worlds completed · Finish any two to unlock.')+'</small>'+
      (saved.mysteryWins?'<span class="quest-world-status">🏅 Mystery Explorer earned</span>':'')+'</div>'+
      '<button type="button" class="primary-btn quest-mystery-button" data-quest-mystery '+(!ready?'disabled aria-disabled="true"':'')+'>'+(ready?(saved.active&&saved.active.world==='mystery'?'Continue mystery →':'Play mystery round →'):'Keep discovering ✨')+'</button></div></div>'+
      '<p class="quest-footer-note">Every world stays available. You can learn its pattern first or replay it any time.</p>';
  }
  function tileDeck(q){
    const pieces=q.answer.split(' ');
    const distractor=['quiero','hablo','sé','tengo','entiendo'].find(x=>!pieces.includes(x))||'hablo';
    return [pieces[pieces.length-1],distractor,pieces[0]];
  }
  function retryHint(q,kind){
    if(kind==='sounds')return 'In Spanish, H is quiet. Listen again. Which vowel sound do you hear first?';
    if(kind==='sentences')return 'Find the Spanish words for the action. Put no just before the action word.';
    return q.pattern==='ity-idad'?'Look for a Spanish word ending in -idad. Does the beginning look like the English word?':'Look for a Spanish word ending in -ción. Does the beginning look like the English word?';
  }
  function renderQuestion(){
    const p=saved.active,w=playWorld(p.world),q=w.questions[p.index];
    if(!q)return renderWorlds();
    const kind=q.kind||w.type,progress=p.index+(p.answered?1:0);
    const connection=kind==='sounds'?'The first sound in '+q.en+' is '+q.answer+'.':q.en+' → '+q.answer;
    const buildAvailable=kind==='sentences',deck=buildAvailable?tileDeck(q):[];
    const heard=kind==='sounds'&&listenFirst&&!p.answered;
    const choices='<div class="quest-choices">'+orderedChoices(q,p).map((choice,i)=>'<button type="button" data-quest-answer="'+esc(choice)+'" class="quest-answer '+(p.answered&&choice===q.answer?'is-correct':wrong===choice?'is-incorrect':'')+'" '+(p.answered||wrong===choice?'disabled':'')+'><span class="quest-option-letter" aria-hidden="true">'+String.fromCharCode(65+i)+'</span><strong>'+esc(choice)+'</strong></button>').join('')+'</div>';
    const tileBuilder='<div class="quest-builder"><div class="quest-built" role="status" aria-live="polite">'+(placed.length?placed.map(i=>'<span>'+esc(deck[i])+'</span>').join(''):'Tap words below to build your answer')+'</div>'+
      '<div class="quest-tiles">'+deck.map((word,i)=>'<button type="button" data-quest-tile="'+i+'" '+(placed.includes(i)?'disabled':'')+'>'+esc(word)+'</button>').join('')+'</div>'+
      '<div class="quest-builder-tools"><button type="button" class="secondary-btn" data-quest-undo '+(placed.length?'':'disabled')+'>↶ Undo</button><button type="button" class="primary-btn" data-quest-check-tiles '+(placed.length?'':'disabled')+'>Check my sentence ✓</button></div></div>';
    return '<div class="quest-play quest-play-'+w.type+'">'+
      (p.answered?'<div class="quest-answer-flash success" role="status" aria-live="polite"><strong>✓ Correct! ⭐ '+esc(connection)+'</strong><small>'+esc(q.why)+'</small><em>'+(pace==='auto'?'Next question soon…':'Take your time. Press Next when ready.')+'</em></div>':
       wrong?'<div class="quest-answer-flash retry" role="status" aria-live="polite">↶ Not yet. '+esc(retryHint(q,kind))+' Try again.</div>':'')+
      '<div class="quest-play-header">'+
      '<button type="button" class="quest-back" data-quest-back aria-label="Back to adventures">← Adventures</button>'+
      '<div class="quest-play-header-controls"><button type="button" class="quest-pace-button" data-quest-pacing aria-pressed="'+(pace==='manual')+'" aria-label="Automatic next question '+(pace==='auto'?'on':'off')+'">'+(pace==='auto'?'⏱ Auto next':'✋ My pace')+'</button><span class="quest-count">'+(p.index===4?'🌟 FINAL DISCOVERY':'QUESTION '+(p.index+1)+' OF 5')+'</span></div>'+
      '</div><div class="quest-stars-earned" aria-label="'+progress+' of 5 stars in this quest">'+Array.from({length:5},(_,i)=>'<span aria-hidden="true">'+(i<progress?'⭐':'☆')+'</span>').join('')+'</div>'+
      '<div class="quest-play-progress" role="progressbar" aria-label="Adventure progress" aria-valuemin="0" aria-valuemax="5" aria-valuenow="'+progress+'"><span style="width:'+(progress*20)+'%"></span></div>'+
      '<div class="quest-question"><span class="quest-eyebrow">'+(w.id==='mystery'?'MYSTERY MIX':kind==='words'?'WORD DETECTIVE':kind==='sounds'?'SOUND DETECTIVE':'SENTENCE BUILDER')+'</span>'+
      '<h3 tabindex="-1" id="questQuestionTitle">'+(kind==='words'?'How do you say this word in Spanish?':kind==='sounds'?'Which vowel sound do you hear first?':'How do you say this in Spanish?')+'</h3>'+
      '<div class="quest-prompt">'+(heard?'🔊 Listen, then choose':esc(q.en))+'</div>'+
      (kind==='sounds'?'<div class="quest-listen-tools"><button type="button" class="quest-listen secondary-btn" data-quest-listen="'+esc(q.en)+'">🔊 Hear the Spanish</button>'+
         (!p.answered?'<button type="button" class="quest-listen-mode" data-quest-listen-mode>'+(heard?'👀 Show the word':'🎧 Listen without reading')+'</button>':'')+'</div>':'')+
      (kind==='sounds'?'<p class="quest-subprompt">Listen to the word. Choose the letter for the first vowel sound. The H is quiet in Spanish.</p>':kind==='sentences'?'<p class="quest-subprompt">Put <strong>no</strong> before the action word.</p>':'')+
      '</div>'+
      (buildAvailable&&!p.answered?'<div class="quest-mode-switch"><button type="button" data-quest-build-mode aria-pressed="'+tilesMode+'">'+(tilesMode?'Choose an answer instead':'🧩 Build it with word tiles')+'</button></div>':'')+
      (tilesMode&&buildAvailable&&!p.answered?tileBuilder:choices)+
      (p.answered?'<div class="quest-feedback quest-feedback-win" aria-hidden="'+(pace==='auto'?'true':'false')+'"><div class="quest-friend"><span class="quest-friend-face" aria-hidden="true">✦<span class="quest-friend-eyes">••</span></span><span class="quest-friend-speech">Nova says: Great discovery!</span></div><span class="quest-reward-icon" aria-hidden="true">🌟</span><strong>Star earned! Brilliant discovery.</strong><span class="quest-word-connection">'+esc(connection)+'</span><span>'+esc(q.why)+'</span></div>'+
        '<div class="quest-bottom-actions"><button type="button" class="secondary-btn" data-quest-next>'+(p.index===4?'See my stars now →':'Next now →')+'</button></div>':
       '<div class="quest-hint-actions"><button type="button" class="secondary-btn" data-quest-clue>💡 Give me a clue</button>'+
         '<button type="button" class="quest-pattern-link" data-open="'+esc(q.pattern)+'">Learn this pattern ↗</button></div>'+
         (clue&&!wrong?'<div class="quest-feedback" role="status"><strong>Here is a clue:</strong><span>'+esc(retryHint(q,kind))+'</span></div>':'')+
         '<p class="quest-no-pressure">No hurry and no penalty for trying again.</p>')+'</div>';
  }
  function renderComplete(){
    const w=completed==='mystery'?mystery:world(completed);
    if(!w)return renderWorlds();
    const mysteryDone=w.id==='mystery';
    return '<section class="quest-victory" role="status"><div class="quest-friend quest-friend-victory"><span class="quest-friend-face" aria-hidden="true">✦<span class="quest-friend-eyes">••</span></span><span class="quest-friend-speech">Nova says: Look how much you learned!</span></div><span class="quest-victory-icon" aria-hidden="true">'+(mysteryDone?'🗝️':'🏆')+'</span>'+
      '<span class="quest-eyebrow">'+(mysteryDone?'MYSTERY SOLVED':'ADVENTURE COMPLETE')+'</span><h2>'+ (mysteryDone?'You cracked the mystery!':'Hooray! Five stars!')+'</h2>'+
      '<p>'+ (mysteryDone?'You remembered and mixed two Spanish patterns. That is real progress!':'You unlocked the secret of <strong>'+esc(w.label)+'</strong>. Every English–Spanish link makes the next one easier to spot.')+'</p>'+
      '<div class="quest-victory-stars" aria-label="Five stars earned">⭐⭐⭐⭐⭐</div>'+
      '<div class="quest-earned-badge"><span aria-hidden="true">🏅</span><div><strong>'+(mysteryDone?'🗝️ Mystery Explorer':esc(badges[w.id]))+'</strong><small>'+(newBadge?'New badge unlocked!':'Badge already yours. Great replay!')+'</small></div></div>'+
      '<div class="quest-victory-actions"><button type="button" class="primary-btn" data-quest-back>Pick another adventure →</button>'+
      (!mysteryDone?'<button type="button" class="secondary-btn" data-open="'+esc(w.pattern)+'">Explore this pattern</button>':'<button type="button" class="secondary-btn" data-view="library">Explore more patterns</button>')+'</div>'+
      '<p class="quest-evidence">Completion reward: five stars. '+((evidence()[completed]||{}).independent||0)+' / 5 answers without hints or retries this round. This is practice evidence, not a mastery certificate.</p><small>You can stop here and be proud. Your rewards stay saved on this device.</small></section>';
  }
  function render(){
    const root=document.getElementById('patternQuest');
    if(root){
      root.innerHTML=completed?renderComplete():(listing||!saved.active)?renderWorlds():renderQuestion();
      const screen=root.closest('[data-view-panel="game"]');
      if(screen){
        screen.classList.toggle('quest-focused',Boolean(saved.active&&!listing&&!completed));
        screen.classList.toggle('quest-paced-manual',pace==='manual');
      }
    }
    renderProgress();
    if(saved.active&&saved.active.answered&&!listing&&!completed)queueAutoAdvance();
  }
  function open(){
    cancelAutoAdvance();
    const nav=document.querySelector('.primary-nav [data-view="game"]');
    if(nav)nav.click();
    const section=document.getElementById('patternQuest');
    if(section){listing=true;render();positionGameAtTop();}
  }
  function selectWorld(id){
    if(!validId(id))return;
    cancelAutoAdvance();
    completed=null;newBadge=false;clue=false;wrong=null;listing=false;tilesMode=false;placed=[];listenFirst=false;
    if(!saved.active || saved.active.world!==id) saved.active={world:id,index:0,answered:false,seed:Math.floor(Math.random()*2147483647),variant:Boolean(saved.best[id]),independent:0,helped:false};
    write();render();positionGameAtTop();focusQuestion();
  }
  function answer(value){
    const a=saved.active;
    if(!a||a.answered)return;
    const q=playWorld(a.world).questions[a.index];
    if(value!==q.answer){a.helped=true;wrong=value;clue=false;write();render();focusRetry();return;}
    if(!a.helped)a.independent=(a.independent||0)+1;
    a.answered=true;wrong=null;clue=false;write();render();
  }
  function advance(){
    cancelAutoAdvance();
    const a=saved.active;if(!a||!a.answered)return;
    if(a.index===4){
      recordEvidence(a);
      completed=a.world;
      if(a.world==='mystery'){
        newBadge=!saved.mysteryWins;
        saved.mysteryWins=(saved.mysteryWins||0)+1;
      }else{
        newBadge=saved.best[a.world]!==5;
        saved.best[a.world]=5;
      }
      saved.active=null;
    }else{a.index++;a.answered=false;a.helped=false;}
    clue=false;wrong=null;tilesMode=false;placed=[];listenFirst=false;write();render();positionGameAtTop();if(saved.active)focusQuestion();
  }
  function listen(wordText) {
    const root=document.getElementById('patternQuest');
    if(!('speechSynthesis' in window) || typeof window.SpeechSynthesisUtterance==='undefined'){
      if(root){const p=root.querySelector('.quest-no-pressure');if(p)p.textContent='Audio is unavailable here. You can still read the word and keep playing.';}
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const u=new SpeechSynthesisUtterance(wordText);u.lang='es-ES';u.rate=.79;
      window.speechSynthesis.speak(u);
    }catch(_){}
  }
  document.addEventListener('click',e=>{
    if(e.target.closest('[data-quest-open]')){open();return;}
    const start=e.target.closest('[data-quest-world]');if(start){selectWorld(start.dataset.questWorld);return;}
    if(e.target.closest('[data-quest-mystery]')){
      if(!unlocked(saved))return;
      cancelAutoAdvance();
      completed=null;newBadge=false;clue=false;wrong=null;listing=false;tilesMode=false;placed=[];listenFirst=false;
      if(!saved.active||saved.active.world!=='mystery')saved.active={world:'mystery',index:0,answered:false,seed:Math.floor(Math.random()*2147483647)};
      write();render();positionGameAtTop();focusQuestion();return;
    }
    if(e.target.closest('[data-quest-pacing]')){
      cancelAutoAdvance();
      pace=pace==='auto'?'manual':'auto';
      localStorage.setItem(PACE_KEY,pace);
      render();
      return;
    }
    if(e.target.closest('[data-quest-build-mode]')){tilesMode=!tilesMode;placed=[];wrong=null;clue=false;render();return;}
    const tile=e.target.closest('[data-quest-tile]');
    if(tile&&saved.active&&!saved.active.answered){
      const n=Number(tile.dataset.questTile);
      if(Number.isInteger(n)&&n>=0&&n<3&&!placed.includes(n)){placed.push(n);render();}
      return;
    }
    if(e.target.closest('[data-quest-undo]')){placed.pop();render();return;}
    if(e.target.closest('[data-quest-check-tiles]')&&saved.active&&!saved.active.answered){
      const q=playWorld(saved.active.world).questions[saved.active.index],deck=tileDeck(q);
      if(placed.map(i=>deck[i]).join(' ')===q.answer){answer(q.answer);}
      else {saved.active.helped=true;write();placed=[];wrong='tiles';clue=true;render();}
      return;
    }
    if(e.target.closest('[data-quest-listen-mode]')){listenFirst=!listenFirst;render();return;}
    const response=e.target.closest('[data-quest-answer]');if(response){answer(response.dataset.questAnswer);return;}
    if(e.target.closest('[data-quest-clue]')){clue=true;if(saved.active){saved.active.helped=true;write()}render();return;}
    if(e.target.closest('[data-quest-next]')){advance();return;}
    if(e.target.closest('[data-quest-back]')){cancelAutoAdvance();completed=null;listing=true;tilesMode=false;placed=[];listenFirst=false;render();positionGameAtTop();return;}
    const audio=e.target.closest('[data-quest-listen]');if(audio){listen(audio.dataset.questListen);return;}
  });
  document.addEventListener('click',function(e){
    const nav=e.target.closest('[data-view]');
    if(nav&&nav.dataset.view!=='game')cancelAutoAdvance();
    if(nav&&nav.dataset.view==='game'&&saved.active&&saved.active.answered&&!listing){
      requestAnimationFrame(render);
    }
  });
  window.LanguageDNAQuest={
    open,render,stars,
    // Read-only progress for learning dashboard and QA.
    progress:()=>({best:{...saved.best},active:saved.active?{...saved.active}:null,stars:stars()})
  };
  render();
})();
