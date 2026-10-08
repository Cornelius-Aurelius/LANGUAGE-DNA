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
        {en:'hola',answer:'O',choices:['H','A','O','J'],pattern:'h-silent',why:'hola starts with the O sound because H is silent.'},
        {en:'hablar',answer:'A',choices:['A','H','E','J'],pattern:'h-silent',why:'hablar begins with the A sound. H stays silent.'},
        {en:'hotel',answer:'O',choices:['H','J','A','O'],pattern:'h-silent',why:'hotel begins with the O sound in Spanish.'},
        {en:'hermano',answer:'E',choices:['A','E','H','J'],pattern:'h-silent',why:'hermano begins with the E sound, not an H sound.'},
        {en:'hilo',answer:'I',choices:['H','J','I','E'],pattern:'h-silent',why:'hilo starts with the I sound. Another silent H!'}
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
  const validId = id => worlds.some(w => w.id === id);
  function read() {
    try {
      const d=JSON.parse(localStorage.getItem(STORAGE)||'{}');
      if (!d || typeof d !== 'object') return {best:{},active:null};
      const best={};
      worlds.forEach(w => {best[w.id]=d.best && d.best[w.id] === 5 ? 5 : 0});
      let active=null;
      const a=d.active;
      if (a && validId(a.world) && Number.isInteger(a.index) && a.index>=0 && a.index<5)
        active={world:a.world,index:a.index,answered:Boolean(a.answered)};
      return {best,active};
    } catch(_) {return {best:{},active:null};}
  }
  let saved=read(),completed=null,clue=false,wrong=null,listing=false;
  function write(){try{localStorage.setItem(STORAGE,JSON.stringify(saved));}catch(_){}renderProgress()}
  function esc(s){return String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function world(id){return worlds.find(w=>w.id===id);}
  function stars(){return worlds.reduce((sum,w)=>sum+(saved.best[w.id]||0),0);}
  function renderProgress(){
    const box=document.getElementById('questProgressSummary');
    if(box)box.innerHTML='<div class="quest-mini-progress"><span aria-hidden="true">⭐</span><div><strong>'+stars()+' of 15 adventure stars</strong><small>From games you have finished. Your stars never disappear.</small></div><button type="button" class="secondary-btn" data-quest-open>Play a quest →</button></div>';
    const badge=document.getElementById('questStarTotal');
    if(badge)badge.textContent=String(stars());
  }
  function renderWorlds(){
    const hasProgress=Boolean(saved.active);
    return '<div class="quest-intro"><span class="quest-eyebrow">PLAY & LEARN</span><h2>Pick a little adventure!</h2>'+
      '<p>Five quick questions. Discover a Spanish secret and collect five stars. Play at your own pace.</p>'+
      '<div class="quest-total" aria-label="'+stars()+' of 15 stars collected"><span aria-hidden="true">⭐</span><strong>'+stars()+' / 15 stars</strong><small>No timers. No lost lives.</small></div></div>'+
      '<div class="quest-world-grid">'+worlds.map((w,i)=>{
        const complete=Boolean(saved.best[w.id]);
        const resume=hasProgress && saved.active.world===w.id;
        return '<button type="button" class="quest-world quest-world-'+w.type+'" data-quest-world="'+w.id+'" aria-label="'+esc(w.label)+'. '+(complete?'Five stars earned. ':resume?'Continue where you stopped. ':'')+'Play five questions.">'+
          '<span class="quest-world-icon" aria-hidden="true">'+w.icon+'</span>'+
          '<span class="quest-world-copy"><span class="quest-world-kicker">ADVENTURE '+(i+1)+'</span><strong>'+esc(w.label)+'</strong><small>'+esc(w.sub)+'</small><span class="quest-world-status">'+(complete?'⭐⭐⭐⭐⭐ Stars earned':resume?'▶ Keep playing':'Play 5 questions →')+'</span></span></button>'
      }).join('')+'</div>'+
      '<p class="quest-footer-note">All worlds are open. You can also explore the full Pattern Library anytime.</p>';
  }
  function renderQuestion(){
    const p=saved.active,w=world(p.world),q=w.questions[p.index];
    const progress=p.index+(p.answered?1:0);
    return '<div class="quest-play quest-play-'+w.type+'"><div class="quest-play-header">'+
      '<button type="button" class="quest-back" data-quest-back aria-label="Back to adventures">← Adventures</button>'+
      '<span class="quest-count">QUESTION '+(p.index+1)+' OF 5</span>'+
      '</div><div class="quest-stars-earned" aria-label="'+progress+' of 5 stars in this quest">'+Array.from({length:5},(_,i)=>'<span aria-hidden="true">'+(i<progress?'⭐':'☆')+'</span>').join('')+'</div>'+
      '<div class="quest-play-progress" role="progressbar" aria-label="Adventure progress" aria-valuemin="0" aria-valuemax="5" aria-valuenow="'+progress+'"><span style="width:'+(progress*20)+'%"></span></div>'+
      '<div class="quest-question"><span class="quest-eyebrow">'+(w.type==='words'?'WORD DETECTIVE':w.type==='sounds'?'SOUND DETECTIVE':'SENTENCE BUILDER')+'</span>'+
      '<h3>'+(w.type==='words'?'Which Spanish word means…':w.type==='sounds'?'What sound starts this Spanish word?':'How do you say…')+'</h3>'+
      '<div class="quest-prompt">'+esc(q.en)+'</div>'+
      (w.type==='sounds'?'<button type="button" class="quest-listen secondary-btn" data-quest-listen="'+esc(q.en)+'">🔊 Hear the Spanish</button>':'')+
      (w.type==='sentences'?'<p class="quest-subprompt">Tip: you can make negatives by adding <strong>no</strong>.</p>':'')+
      '</div>'+
      '<div class="quest-choices">'+q.choices.map((choice,i)=>'<button type="button" data-quest-answer="'+esc(choice)+'" class="quest-answer '+(p.answered&&choice===q.answer?'is-correct':'')+'" '+(p.answered||wrong===choice?'disabled':'')+'><span class="quest-option-letter" aria-hidden="true">'+String.fromCharCode(65+i)+'</span><strong>'+esc(choice)+'</strong></button>').join('')+'</div>'+
      (p.answered?'<div class="quest-feedback quest-feedback-win" role="status"><strong>⭐ Star earned! You found the link.</strong><span>'+esc(q.why)+'</span></div>'+
        '<div class="quest-bottom-actions"><button type="button" class="primary-btn" data-quest-next>'+(p.index===4?'See my stars ✨':'Next question →')+'</button></div>':
       '<div class="quest-hint-actions"><button type="button" class="secondary-btn" data-quest-clue>💡 Show the secret</button>'+
         '<button type="button" class="quest-pattern-link" data-open="'+esc(q.pattern)+'">Learn this pattern ↗</button></div>'+
         (clue||wrong?'<div class="quest-feedback" role="status"><strong>'+(wrong?'Nice try! You can try again.':'Here is the secret:')+'</strong><span>'+esc(w.secret)+'</span></div>':'')+
         '<p class="quest-no-pressure">No hurry and no penalty for trying again.</p>')+'</div>';
  }
  function renderComplete(){
    const w=world(completed);
    if(!w)return renderWorlds();
    return '<section class="quest-victory" role="status"><span class="quest-victory-icon" aria-hidden="true">🏆</span>'+
      '<span class="quest-eyebrow">ADVENTURE COMPLETE</span><h2>Hooray! Five stars!</h2>'+
      '<p>You unlocked the secret of <strong>'+esc(w.label)+'</strong>. Every English–Spanish link makes the next one easier to spot.</p>'+
      '<div class="quest-victory-stars" aria-label="Five stars earned">⭐⭐⭐⭐⭐</div>'+
      '<div class="quest-victory-actions"><button type="button" class="primary-btn" data-quest-back>Pick another adventure →</button>'+
      '<button type="button" class="secondary-btn" data-open="'+esc(w.pattern)+'">Explore this pattern</button></div>'+
      '<small>You can stop here and be proud. Your stars stay saved on this device.</small></section>';
  }
  function render(){
    const root=document.getElementById('patternQuest');
    if(root){
      root.innerHTML=completed?renderComplete():(listing||!saved.active)?renderWorlds():renderQuestion();
    }
    renderProgress();
  }
  function open(){
    const nav=document.querySelector('.primary-nav [data-view="game"]');
    if(nav)nav.click();
    const section=document.getElementById('patternQuest');
    if(section){listing=true;render();section.scrollIntoView({block:'start',behavior:'auto'});}
  }
  function selectWorld(id){
    if(!validId(id))return;
    completed=null;clue=false;wrong=null;listing=false;
    if(!saved.active || saved.active.world!==id) saved.active={world:id,index:0,answered:false};
    write();render();
  }
  function answer(value){
    const a=saved.active;
    if(!a||a.answered)return;
    const q=world(a.world).questions[a.index];
    if(value!==q.answer){wrong=value;clue=true;render();return;}
    a.answered=true;wrong=null;clue=false;write();render();
  }
  function advance(){
    const a=saved.active;if(!a||!a.answered)return;
    if(a.index===4){
      completed=a.world;
      saved.best[a.world]=5;
      saved.active=null;
    }else{a.index++;a.answered=false;}
    clue=false;wrong=null;write();render();
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
    const response=e.target.closest('[data-quest-answer]');if(response){answer(response.dataset.questAnswer);return;}
    if(e.target.closest('[data-quest-clue]')){clue=true;render();return;}
    if(e.target.closest('[data-quest-next]')){advance();return;}
    if(e.target.closest('[data-quest-back]')){completed=null;listing=true;render();return;}
    const audio=e.target.closest('[data-quest-listen]');if(audio){listen(audio.dataset.questListen);return;}
  });
  window.LanguageDNAQuest={
    open,render,stars,
    // Read-only progress for learning dashboard and QA.
    progress:()=>({best:{...saved.best},active:saved.active?{...saved.active}:null,stars:stars()})
  };
  render();
})();
