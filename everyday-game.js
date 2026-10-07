(() => {
  'use strict';

  const DATA = Array.isArray(window.LANGUAGE_DNA_EVERYDAY_100) ? window.LANGUAGE_DNA_EVERYDAY_100 : [];
  const EXPANDED = Array.isArray(window.LANGUAGE_DNA_EVERYDAY_EXPANDED) ? window.LANGUAGE_DNA_EVERYDAY_EXPANDED : [];
  const VOCAB = DATA.concat(EXPANDED);
  const PASS_SCORE = 37;
  const TOTAL_QUESTIONS = 40;
  const LEVELS = [
    {id:1,title:'Everyday Essentials',subtitle:'The easiest, highest-use words and survival phrases.',mode:'direct',pick:function(){return DATA.slice(0,40)}},
    {id:2,title:'Useful Phrases & Actions',subtitle:'Questions, needs and verbs you can use immediately.',mode:'direct',pick:function(){return DATA.slice(25,65)}},
    {id:3,title:'Real-life Sentences',subtitle:'Choose the Spanish sentence that matches familiar English.',mode:'example',pick:function(){return DATA.slice(40,80)}},
    {id:4,title:'Spanish → English',subtitle:'Recognise familiar Spanish without leaning on the English first.',mode:'reverse',pick:function(){return DATA.slice(60,100)}},
    {id:5,title:'Mixed Real-life Challenge',subtitle:'A mixed test of words, phrases, sentences and reverse recognition.',mode:'mixed',pick:function(){const out=[];for(let i=0;i<40;i++)out.push(DATA[Math.min(DATA.length-1,Math.floor(i*DATA.length/40))]);return out}}
  ];
  const FALSE_FRIENDS=[
    ['actual','actual','current / present','Spanish actual usually means current or present — not English “actual”.'],
    ['embarrassed','embarazada','pregnant','Embarazada means pregnant. Use avergonzado/a for embarrassed.'],
    ['assist','asistir','attend','Asistir usually means to attend. Ayudar is to help/assist.'],
    ['library','librería','bookshop','Librería is a bookshop. Biblioteca is a library.'],
    ['carpet','carpeta','folder','Carpeta usually means a folder. Alfombra is a carpet.'],
    ['sensible','sensible','sensitive','Spanish sensible usually means sensitive; sensato/a means sensible/prudent.']
  ];

  const state = {
    learnPage:1,
    learnCategory:'All',
    learnSearch:'',
    vocabTier:Number(localStorage.getItem('ldna-vocab-tier-v1')||100),
    view:'learn',
    game:null,
    reviewFilter:'all'
  };

  function safeParse(value,fallback){try{return JSON.parse(value)}catch(e){return fallback}}
  const known = new Set(safeParse(localStorage.getItem('ldna-everyday-known-v1')||'[]',[]));
  const progress = safeParse(localStorage.getItem('ldna-game-progress-v1')||'{"unlocked":1,"best":{},"attempts":[]}',{unlocked:1,best:{},attempts:[]});
  if(!progress.unlocked)progress.unlocked=1;if(!progress.best)progress.best={};if(!progress.attempts)progress.attempts=[];

  function escapeHtml(value){return String(value==null?'':value).replace(/[&<>"']/g,function(ch){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]})}
  function normalize(value){return String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9 ]/g,'').replace(/\s+/g,' ')}
  function saveKnown(){localStorage.setItem('ldna-everyday-known-v1',JSON.stringify(Array.from(known)))}
  function saveProgress(){localStorage.setItem('ldna-game-progress-v1',JSON.stringify(progress))}
  function speak(text){if(!('speechSynthesis' in window))return;window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(String(text||''));u.lang='es-ES';u.rate=.82;const voices=window.speechSynthesis.getVoices();const voice=voices.find(function(v){return v.lang.toLowerCase().indexOf('es')===0});if(voice)u.voice=voice;window.speechSynthesis.speak(u)}
  function seededShuffle(items,seed){
    const out=items.slice();let x=(seed>>>0)||123456789;
    for(let i=out.length-1;i>0;i--){x=(x*1664525+1013904223)>>>0;const j=x%(i+1);const tmp=out[i];out[i]=out[j];out[j]=tmp}
    return out
  }
  function simpleHash(text){let h=2166136261;for(let i=0;i<text.length;i++){h^=text.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
  function unique(values){const seen=new Set(),out=[];values.forEach(function(v){const k=normalize(v);if(k&&!seen.has(k)){seen.add(k);out.push(v)}});return out}
  function usefulnessLabel(item){return item.band+' · '+item.usefulness+'/100'}
  function tierLimit(){return [100,500,1000].includes(state.vocabTier)?state.vocabTier:100}
  function tierData(){return VOCAB.filter(function(x){return x.rank<=tierLimit()})}
  function categories(){return ['All'].concat(Array.from(new Set(tierData().map(function(x){return x.category}))))}
  function itemKey(item){return String(item.rank)}

  function renderPreview(){
    const root=document.getElementById('everydayPreview');if(!root)return;
    root.innerHTML=DATA.slice(0,8).map(function(item){
      return '<article class="everyday-preview-card"><span>#'+item.rank+'</span><strong>'+escapeHtml(item.english)+'</strong><b>'+escapeHtml(item.spanish)+'</b><small>'+escapeHtml(item.category)+'</small></article>'
    }).join('');
    const stat=document.getElementById('everydayKnownPreview'),coreKnown=Array.from(known).filter(function(k){return Number(k)<=100}).length;if(stat)stat.textContent=coreKnown+' / 100 familiar';
  }

  function learnItems(){
    const q=normalize(state.learnSearch);
    return tierData().filter(function(item){
      const categoryOk=state.learnCategory==='All'||item.category===state.learnCategory;
      const search=normalize([item.english,item.spanish,item.category,item.exampleEn,item.exampleEs,item.family,item.morphology,item.conjugation,item.note,item.frequencyBand].join(' '));
      return categoryOk&&(!q||search.indexOf(q)>=0)
    })
  }

  function renderLearn(){
    const root=document.getElementById('everydayLearnPanel');if(!root)return;
    const items=learnItems(),perPage=20,pages=Math.max(1,Math.ceil(items.length/perPage));state.learnPage=Math.max(1,Math.min(state.learnPage,pages));
    const visible=items.slice((state.learnPage-1)*perPage,state.learnPage*perPage);
    const limit=tierLimit(),knownInTier=Array.from(known).filter(function(k){return Number(k)<=limit}).length;
    root.innerHTML='<div class="everyday-learn-head"><div><span class="eyebrow">ENGLISH FIRST</span><h2>Everyday '+limit+' vocabulary</h2><p>'+(limit===100?'Start with the most immediately useful day-to-day English you already know.':'Expand through quality-gated English ↔ Spanish pattern links while keeping the first 100 as your core foundation.')+'</p></div><div class="everyday-known-ring"><strong>'+knownInTier+'</strong><small>familiar of '+limit+'</small></div></div>'+
      '<div class="vocab-tier-tabs" aria-label="Vocabulary size"><button type="button" data-vocab-tier="100" class="'+(limit===100?'active':'')+'"><strong>100</strong><small>Core everyday</small></button><button type="button" data-vocab-tier="500" class="'+(limit===500?'active':'')+'"><strong>500</strong><small>Useful expansion</small></button><button type="button" data-vocab-tier="1000" class="'+(limit===1000?'active':'')+'"><strong>1,000</strong><small>Broader vocabulary</small></button></div>'+
      '<p class="vocab-tier-note">'+(limit===100?'Hand-curated for daily life.':'Ranks 101–1,000 come from the quality-gated production Pattern Dictionaries and are re-ranked using English + Spanish FrequencyWords 50k evidence. CEFR labels remain LanguageDNA estimates.')+'</p>'+
      '<div class="everyday-tools"><label class="search-box"><span>⌕</span><input id="everydaySearch" type="search" placeholder="Search: where, action, normal…" value="'+escapeHtml(state.learnSearch)+'"></label><div class="everyday-category-row">'+categories().map(function(cat){return'<button type="button" data-everyday-category="'+escapeHtml(cat)+'" class="'+(state.learnCategory===cat?'active':'')+'">'+escapeHtml(cat)+'</button>'}).join('')+'</div></div>'+
      '<div class="everyday-grid">'+visible.map(renderEverydayCard).join('')+'</div>'+
      '<div class="everyday-pagination"><button type="button" data-everyday-page="'+(state.learnPage-1)+'" '+(state.learnPage<=1?'disabled':'')+'>← Previous</button><span>Page '+state.learnPage+' of '+pages+' · '+items.length+' items</span><button type="button" data-everyday-page="'+(state.learnPage+1)+'" '+(state.learnPage>=pages?'disabled':'')+'>Next →</button></div>'+
      '<details class="meaning-traps"><summary>6 common English → Spanish meaning traps</summary><div class="meaning-trap-grid">'+FALSE_FRIENDS.map(function(row){return'<article><small>'+escapeHtml(row[0])+' ≠ '+escapeHtml(row[1])+'</small><strong>'+escapeHtml(row[2])+'</strong><p>'+escapeHtml(row[3])+'</p></article>'}).join('')+'</div></details>'
  }

  function renderEverydayCard(item){
    const done=known.has(itemKey(item));
    const qualityLabel=item.rank<=100?'Curated everyday core':item.exampleQuality==='curated natural'?'Frequency-backed + curated example':'Frequency-backed production match';
    const detailBits=[];
    detailBits.push('<p><b>Learner quality:</b> '+escapeHtml(qualityLabel)+'.</p>');
    if(item.family)detailBits.push('<p><b>Pattern family:</b> '+escapeHtml(item.family)+'</p>');
    if(item.morphology)detailBits.push('<p><b>Transformation:</b> '+escapeHtml(item.morphology)+'</p>');
    if(item.conjugation)detailBits.push('<p><b>Regular present family:</b> '+escapeHtml(item.conjugation)+'</p>');
    if(item.note)detailBits.push('<p><b>Usage/source note:</b> '+escapeHtml(item.note)+'</p>');
    if(item.frequencyBand)detailBits.push('<p><b>Frequency evidence:</b> '+escapeHtml(item.frequencyBand)+' · English rank '+Number(item.frequencyRankEn).toLocaleString()+' · Spanish rank '+Number(item.frequencyRankEs).toLocaleString()+'.</p>');
    else if(item.frequencyNote)detailBits.push('<p><b>Frequency/usefulness:</b> '+escapeHtml(item.frequencyNote)+'</p>');
    if(item.cefrConfidence)detailBits.push('<p><b>Level confidence:</b> '+escapeHtml(item.cefrConfidence)+' — LanguageDNA estimate, not an official CEFR assessment.</p>');
    return '<article class="everyday-card '+(done?'known':'')+'">'+
      '<div class="everyday-card-top"><span>#'+item.rank+' · '+escapeHtml(item.category)+'</span><span>'+escapeHtml(item.cefr)+' · '+escapeHtml(usefulnessLabel(item))+'</span></div><div class="vocab-quality-chip">'+escapeHtml(qualityLabel)+'</div>'+
      '<h3>'+escapeHtml(item.english)+'</h3><div class="everyday-spanish"><strong>'+escapeHtml(item.spanish)+'</strong><button type="button" data-everyday-speak="'+escapeHtml(item.spanish)+'" aria-label="Hear '+escapeHtml(item.spanish)+'">🔊</button></div>'+
      '<div class="everyday-example"><small>'+(item.exampleQuality==='curated natural'?'NATURAL EXAMPLE':item.exampleQuality==='teaching cue'?'PATTERN CUE':'USE IT')+'</small><p>'+escapeHtml(item.exampleEn)+' <b>→</b> '+escapeHtml(item.exampleEs)+'</p></div>'+
      '<details><summary>More language intelligence</summary><div>'+detailBits.join('')+'<p><b>Learner level:</b> '+escapeHtml(item.cefr)+' · <b>Learner priority:</b> '+item.usefulness+'/100</p></div></details>'+
      '<button type="button" class="everyday-known-btn" data-everyday-known="'+item.rank+'">'+(done?'✓ Familiar':'Mark familiar')+'</button>'+
      '</article>'
  }

  function renderGameHome(){
    const root=document.getElementById('gameModePanel');if(!root)return;
    root.innerHTML='<section class="game-intro-card"><div><span class="eyebrow">40-QUESTION GAME MODE</span><h2>Prove it before the difficulty goes up.</h2><p>Every level has 40 questions and four choices. Your answers stay unmarked until the very end. Score <strong>37 / 40</strong> or better to pass and unlock the next level.</p></div><div class="game-pass-badge"><strong>37</strong><small>to pass</small></div></section>'+
      '<div class="game-level-grid">'+LEVELS.map(function(level){
        const unlocked=level.id<=progress.unlocked,best=progress.best[level.id],passed=best>=PASS_SCORE;
        return '<article class="game-level-card '+(!unlocked?'locked ':'')+(passed?'passed':'')+'"><div class="game-level-top"><span>LEVEL '+level.id+'</span><span>'+(passed?'✓ Passed':unlocked?'Unlocked':'🔒 Locked')+'</span></div><h3>'+escapeHtml(level.title)+'</h3><p>'+escapeHtml(level.subtitle)+'</p><div class="game-level-stats"><span><b>'+TOTAL_QUESTIONS+'</b> questions</span><span><b>4</b> choices</span><span><b>37</b> pass</span></div>'+(best!=null?'<small class="game-best">Best score: '+best+' / 40</small>':'<small class="game-best">No attempt yet</small>')+'<button type="button" class="'+(unlocked?'primary-btn':'secondary-btn')+'" data-game-start="'+level.id+'" '+(!unlocked?'disabled':'')+'>'+(passed?'Play again':best!=null?'Try again':'Start level')+'</button></article>'
      }).join('')+'</div>'+
      '<p class="game-rule-note">During the game, selected answers are shown only as selected — never as right or wrong. Full colour-coded marking appears after you finish all 40.</p>'
  }

  function questionForItem(item,level,index,seed){
    let mode=level.mode;if(mode==='mixed')mode=['direct','example','reverse','direct'][index%4];
    let prompt,correct,label;
    if(mode==='example'){prompt=item.exampleEn;correct=item.exampleEs;label='Choose the Spanish sentence'}
    else if(mode==='reverse'){prompt=item.spanish;correct=item.english;label='Choose the English meaning'}
    else{prompt=item.english;correct=item.spanish;label='Choose the Spanish'}
    const source=DATA.filter(function(x){return x.rank!==item.rank});
    let pool=source.filter(function(x){return x.category===item.category});
    if(pool.length<8)pool=source;
    const candidates=seededShuffle(pool,seed+index*97).map(function(x){
      if(mode==='example')return x.exampleEs;
      if(mode==='reverse')return x.english;
      return x.spanish
    });
    const distractors=unique(candidates).filter(function(v){return normalize(v)!==normalize(correct)}).slice(0,3);
    while(distractors.length<3){
      const fallback=source[distractors.length+index]||DATA[(index+distractors.length+1)%DATA.length];
      const value=mode==='example'?fallback.exampleEs:mode==='reverse'?fallback.english:fallback.spanish;
      if(normalize(value)!==normalize(correct)&&!distractors.some(function(v){return normalize(v)===normalize(value)}))distractors.push(value)
    }
    const options=seededShuffle([correct].concat(distractors),seed+index*211);
    return {index:index,item:item,mode:mode,label:label,prompt:prompt,correct:correct,options:options}
  }

  function startGame(levelId){
    const level=LEVELS.find(function(x){return x.id===Number(levelId)});if(!level||level.id>progress.unlocked)return;
    const attemptNumber=progress.attempts.filter(function(a){return a.level===level.id}).length+1;
    const seed=simpleHash('LanguageDNA-'+level.id+'-'+attemptNumber+'-'+Date.now());
    let items=level.pick().slice(0,TOTAL_QUESTIONS);
    if(items.length<TOTAL_QUESTIONS){const extra=DATA.filter(function(x){return !items.includes(x)});items=items.concat(extra.slice(0,TOTAL_QUESTIONS-items.length))}
    items=seededShuffle(items,seed);
    state.game={level:level,seed:seed,questions:items.map(function(item,i){return questionForItem(item,level,i,seed)}),answers:Array(TOTAL_QUESTIONS).fill(null),current:0,finished:false,score:null,passed:false};
    state.reviewFilter='all';renderGameQuestion()
  }

  function renderGameQuestion(){
    const root=document.getElementById('gameModePanel');if(!root||!state.game)return;const game=state.game,q=game.questions[game.current],answer=game.answers[game.current],answered=game.answers.filter(function(x){return x!==null}).length;
    root.innerHTML='<section class="game-session-head"><div><span class="eyebrow">LEVEL '+game.level.id+' · '+escapeHtml(game.level.title)+'</span><h2>Question '+(game.current+1)+' of 40</h2><p>'+answered+' answered · Answers are hidden until the end.</p></div><div class="game-session-score"><strong>'+answered+'</strong><small>answered</small></div></section>'+
      '<div class="game-progress-track"><span style="width:'+Math.round(answered/40*100)+'%"></span></div>'+
      '<div class="game-question-card"><span class="game-question-label">'+escapeHtml(q.label)+'</span><h3>'+escapeHtml(q.prompt)+'</h3>'+((q.mode==='reverse')?'<button type="button" class="game-audio-prompt" data-everyday-speak="'+escapeHtml(q.prompt)+'">🔊 Hear Spanish</button>':'')+'<div class="game-answer-grid">'+q.options.map(function(opt,i){return'<button type="button" data-game-answer="'+i+'" class="'+(answer===i?'selected':'')+'"><span>'+String.fromCharCode(65+i)+'</span><strong>'+escapeHtml(opt)+'</strong></button>'}).join('')+'</div><p class="game-hidden-note">Tap an answer to save it and move on automatically. Correctness stays hidden until the end.</p></div>'+
      '<div class="game-question-nav"><button type="button" class="secondary-btn" data-game-prev '+(game.current===0?'disabled':'')+'>← Previous</button><div class="game-dot-row">'+game.answers.map(function(a,i){return'<button type="button" data-game-jump="'+i+'" class="'+(i===game.current?'current ':'')+(a!==null?'answered':'')+'" aria-label="Question '+(i+1)+'">'+(i+1)+'</button>'}).join('')+'</div>'+(game.current===39?'<button type="button" class="primary-btn" data-game-finish>Finish game</button>':'<button type="button" class="primary-btn" data-game-next '+(answer===null?'disabled':'')+'>Next →</button>')+'</div>'+
      '<div id="gameMessage" class="game-message" aria-live="polite"></div>'
  }

  function finishGame(){
    const game=state.game;if(!game)return;
    const unanswered=game.answers.filter(function(x){return x===null}).length;
    if(unanswered){const message=document.getElementById('gameMessage');if(message)message.textContent='Answer all 40 questions first. '+unanswered+' still unanswered.';return}
    let score=0;
    game.questions.forEach(function(q,i){if(normalize(q.options[game.answers[i]])===normalize(q.correct))score++});
    game.score=score;game.passed=score>=PASS_SCORE;game.finished=true;
    const oldBest=progress.best[game.level.id];if(oldBest==null||score>oldBest)progress.best[game.level.id]=score;
    if(game.passed&&game.level.id<LEVELS.length)progress.unlocked=Math.max(progress.unlocked,game.level.id+1);
    progress.attempts.push({level:game.level.id,score:score,passed:game.passed,at:Date.now()});if(progress.attempts.length>50)progress.attempts=progress.attempts.slice(-50);saveProgress();
    if(window.LanguageDNACore&&typeof window.LanguageDNACore.trackEvent==='function')window.LanguageDNACore.trackEvent('game_result',{level:game.level.id,score:score,passed:game.passed});
    renderGameResults()
  }

  function explanationFor(q){
    const item=q.item,bits=[item.english+' → '+item.spanish];
    if(item.family)bits.push('Family: '+item.family+'.');
    if(item.note)bits.push(item.note);
    else bits.push('Example: '+item.exampleEn+' → '+item.exampleEs+'.');
    return bits.join(' ')
  }

  function renderGameResults(){
    const root=document.getElementById('gameModePanel');if(!root||!state.game)return;const game=state.game;
    const rows=game.questions.map(function(q,i){const chosen=q.options[game.answers[i]],ok=normalize(chosen)===normalize(q.correct);return{q:q,i:i,chosen:chosen,ok:ok}}).filter(function(row){return state.reviewFilter==='all'||(state.reviewFilter==='correct'&&row.ok)||(state.reviewFilter==='wrong'&&!row.ok)});
    root.innerHTML='<section class="game-result-hero '+(game.passed?'passed':'failed')+'"><div><span class="eyebrow">LEVEL '+game.level.id+' RESULT</span><h2>'+game.score+' / 40</h2><p>'+(game.passed?'Passed — you reached the 37/40 standard.' : 'Not yet — you need 37/40 to move up. Review the missed concepts, then try this level again.')+'</p></div><div class="game-result-mark"><strong>'+Math.round(game.score/40*100)+'%</strong><small>'+(game.passed?'PASS':'RETRY')+'</small></div></section>'+
      '<div class="game-result-actions">'+(game.passed&&game.level.id<LEVELS.length?'<button type="button" class="primary-btn" data-game-start="'+(game.level.id+1)+'">Start Level '+(game.level.id+1)+'</button>':'')+'<button type="button" class="secondary-btn" data-game-retry>Retry Level '+game.level.id+'</button><button type="button" class="secondary-btn" data-game-home>All levels</button></div>'+
      '<section class="game-review-section"><div class="section-heading compact"><div><span class="eyebrow">FULL REVIEW</span><h2>See every answer now.</h2><p>Green = correct. Red = incorrect. Nothing was marked during the test.</p></div></div><div class="game-review-filters"><button type="button" data-game-review="all" class="'+(state.reviewFilter==='all'?'active':'')+'">All 40</button><button type="button" data-game-review="correct" class="'+(state.reviewFilter==='correct'?'active':'')+'">Correct '+game.score+'</button><button type="button" data-game-review="wrong" class="'+(state.reviewFilter==='wrong'?'active':'')+'">Review missed '+(40-game.score)+'</button></div><div class="game-review-list">'+rows.map(function(row){return'<article class="game-review-card '+(row.ok?'correct':'wrong')+'"><div class="game-review-number"><strong>'+(row.i+1)+'</strong><span>'+(row.ok?'✓':'×')+'</span></div><div><small>'+escapeHtml(row.q.label)+'</small><h3>'+escapeHtml(row.q.prompt)+'</h3><p><b>Your answer:</b> '+escapeHtml(row.chosen)+'</p>'+(!row.ok?'<p><b>Correct answer:</b> '+escapeHtml(row.q.correct)+'</p>':'')+'<div class="game-explanation">'+escapeHtml(explanationFor(row.q))+'</div></div></article>'}).join('')+'</div></section>'
  }

  function renderShell(){
    renderPreview();renderLearn();renderGameHome();renderTabs()
  }

  function renderTabs(){
    const learn=document.getElementById('everydayLearnPanel'),game=document.getElementById('gameModePanel'),tabs=document.querySelectorAll('[data-everyday-tab]');
    tabs.forEach(function(btn){btn.classList.toggle('active',btn.dataset.everydayTab===state.view)});
    if(learn)learn.hidden=state.view!=='learn';if(game)game.hidden=state.view!=='game'
  }

  document.addEventListener('input',function(e){
    if(e.target&&e.target.id==='everydaySearch'){state.learnSearch=e.target.value;state.learnPage=1;renderLearn()}
  });

  document.addEventListener('click',function(e){
    const openMode=e.target.closest('[data-everyday-open]');if(openMode){state.view=openMode.dataset.everydayOpen||'learn';renderTabs();if(state.view==='learn')renderLearn();else if(!state.game)renderGameHome();return}
    const tab=e.target.closest('[data-everyday-tab]');if(tab){state.view=tab.dataset.everydayTab;if(state.view==='game'&&!state.game)renderGameHome();renderTabs();return}
    const tier=e.target.closest('[data-vocab-tier]');if(tier){state.vocabTier=Number(tier.dataset.vocabTier)||100;localStorage.setItem('ldna-vocab-tier-v1',String(state.vocabTier));state.learnCategory='All';state.learnPage=1;renderLearn();return}
    const cat=e.target.closest('[data-everyday-category]');if(cat){state.learnCategory=cat.dataset.everydayCategory;state.learnPage=1;renderLearn();return}
    const page=e.target.closest('[data-everyday-page]');if(page&&!page.disabled){state.learnPage=Number(page.dataset.everydayPage)||1;renderLearn();return}
    const familiar=e.target.closest('[data-everyday-known]');if(familiar){const key=String(familiar.dataset.everydayKnown),wasKnown=known.has(key);if(wasKnown)known.delete(key);else known.add(key);saveKnown();if(window.LanguageDNACore&&typeof window.LanguageDNACore.trackEvent==='function')window.LanguageDNACore.trackEvent('vocab_familiar',{rank:Number(key),familiar:!wasKnown});renderPreview();renderLearn();return}
    const audio=e.target.closest('[data-everyday-speak]');if(audio){speak(audio.dataset.everydaySpeak);return}
    const start=e.target.closest('[data-game-start]');if(start&&!start.disabled){state.view='game';startGame(Number(start.dataset.gameStart));renderTabs();return}
    const answer=e.target.closest('[data-game-answer]');if(answer&&state.game&&!state.game.finished){
      const questionIndex=state.game.current;
      state.game.answers[questionIndex]=Number(answer.dataset.gameAnswer);
      renderGameQuestion();
      if(questionIndex<39)setTimeout(function(){
        if(state.game&&!state.game.finished&&state.game.current===questionIndex){
          state.game.current=questionIndex+1;
          renderGameQuestion()
        }
      },180);
      return
    }
    const next=e.target.closest('[data-game-next]');if(next&&state.game&&state.game.answers[state.game.current]!==null){state.game.current=Math.min(39,state.game.current+1);renderGameQuestion();return}
    const prev=e.target.closest('[data-game-prev]');if(prev&&state.game){state.game.current=Math.max(0,state.game.current-1);renderGameQuestion();return}
    const jump=e.target.closest('[data-game-jump]');if(jump&&state.game){state.game.current=Math.max(0,Math.min(39,Number(jump.dataset.gameJump)||0));renderGameQuestion();return}
    const finish=e.target.closest('[data-game-finish]');if(finish){finishGame();return}
    const retry=e.target.closest('[data-game-retry]');if(retry&&state.game){startGame(state.game.level.id);return}
    const home=e.target.closest('[data-game-home]');if(home){state.game=null;renderGameHome();return}
    const filter=e.target.closest('[data-game-review]');if(filter&&state.game&&state.game.finished){state.reviewFilter=filter.dataset.gameReview;renderGameResults();return}
  });

  window.LanguageDNAEverydayGame = {
    showLearn:function(){state.view='learn';renderTabs();renderLearn()},
    showGame:function(){state.view='game';renderTabs();if(!state.game)renderGameHome()},
    render:function(){renderShell()}
  };

  renderShell();
})();