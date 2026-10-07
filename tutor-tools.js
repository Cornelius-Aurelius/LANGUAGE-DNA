(() => {
  'use strict';

  const CORE = Array.isArray(window.LANGUAGE_DNA_EVERYDAY_100) ? window.LANGUAGE_DNA_EVERYDAY_100 : [];
  const EXPANDED = Array.isArray(window.LANGUAGE_DNA_EVERYDAY_EXPANDED) ? window.LANGUAGE_DNA_EVERYDAY_EXPANDED : [];
  const ALL = CORE.concat(EXPANDED);
  if (!CORE.length) return;

  const SCENARIOS = [
    {
      id:'cafe', icon:'☕', title:'At a café', level:'Starter', aim:'Order a drink and pay.',
      required:[7,8,41,49,50,60,87,99],
      turns:[
        {npc:'Hola. ¿Qué desea?', english:'Hi. What would you like?', replies:['Quiero un café, por favor.','Un café, por favor.'], explain:'Quiero means “I want”. Por favor keeps the request polite.'},
        {npc:'¿Algo más?', english:'Anything else?', replies:['No, gracias.','Agua, por favor.'], explain:'No, gracias is an easy polite way to finish an order.'},
        {npc:'Son tres euros.', english:'That is three euros.', replies:['¿Puedo pagar con tarjeta?','Tarjeta, por favor.'], explain:'¿Puedo pagar con tarjeta? means “Can I pay by card?”'}
      ]
    },
    {
      id:'hotel', icon:'🏨', title:'At a hotel', level:'Starter', aim:'Check in and ask for help.',
      required:[2,7,8,37,42,43,82],
      turns:[
        {npc:'Buenas tardes. ¿Tiene una reserva?', english:'Good afternoon. Do you have a reservation?', replies:['Sí, tengo una reserva.'], explain:'Tengo means “I have”.'},
        {npc:'¿Necesita ayuda?', english:'Do you need help?', replies:['Sí, necesito ayuda.','No, gracias.'], explain:'Necesito is the useful frame “I need…”.'},
        {npc:'Su habitación está aquí.', english:'Your room is here.', replies:['Gracias.','Muchas gracias.'], explain:'A simple gracias is enough.'}
      ]
    },
    {
      id:'airport', icon:'✈️', title:'At the airport', level:'Starter', aim:'Ask where something is and understand a direction.',
      required:[10,27,34,74,75,76,77],
      turns:[
        {npc:'Hola. ¿En qué puedo ayudarle?', english:'Hello. How can I help you?', replies:['¿Dónde está la puerta?','¿Dónde está el baño?'], explain:'¿Dónde está…? is one of the most useful travel frames.'},
        {npc:'Está allí, a la derecha.', english:'It is over there, on the right.', replies:['Gracias.','De acuerdo, gracias.'], explain:'Derecha means right; allí means there.'},
        {npc:'¿Algo más?', english:'Anything else?', replies:['No, gracias.'], explain:'Keep it simple when you are done.'}
      ]
    },
    {
      id:'taxi', icon:'🚕', title:'In a taxi', level:'Starter', aim:'Say where you want to go and understand basic direction language.',
      required:[41,49,73,74,75,76,81],
      turns:[
        {npc:'Hola. ¿Adónde va?', english:'Hello. Where are you going?', replies:['Quiero ir al hotel.','Al hotel, por favor.'], explain:'Quiero ir… means “I want to go…”.'},
        {npc:'¿Aquí está bien?', english:'Is here okay?', replies:['Sí, aquí está bien.','Sí, gracias.'], explain:'Aquí means here.'},
        {npc:'Son diez euros.', english:'That is ten euros.', replies:['¿Puedo pagar con tarjeta?','Sí, gracias.'], explain:'Use the payment phrase you already know.'}
      ]
    },
    {
      id:'shopping', icon:'🛍️', title:'Shopping', level:'Starter', aim:'Ask price, choose something and pay.',
      required:[7,8,31,32,41,58,59,99,100],
      turns:[
        {npc:'Hola. ¿Qué busca?', english:'Hi. What are you looking for?', replies:['Quiero esto, por favor.','Quiero comprar esto.'], explain:'Quiero + noun/verb is a very reusable frame.'},
        {npc:'Cuesta veinte euros.', english:'It costs twenty euros.', replies:['¿Puedo pagar con tarjeta?','Efectivo, por favor.'], explain:'Tarjeta is card; efectivo is cash.'},
        {npc:'Gracias.', english:'Thank you.', replies:['Gracias.','Adiós.'], explain:'Finish with a familiar polite word.'}
      ]
    },
    {
      id:'directions', icon:'🧭', title:'Asking directions', level:'Starter', aim:'Find a place and understand left/right/straight.',
      required:[10,27,34,74,75,76,77,78,79,84],
      turns:[
        {npc:'Hola.', english:'Hi.', replies:['Disculpe, ¿dónde está la estación?','¿Dónde está la estación?'], explain:'Disculpe is a polite way to get attention.'},
        {npc:'Todo recto y después a la izquierda.', english:'Straight ahead and then left.', replies:['De acuerdo, gracias.','Gracias.'], explain:'Todo recto means straight ahead; izquierda means left.'},
        {npc:'Está cerca.', english:'It is near.', replies:['Gracias.'], explain:'Cerca means near.'}
      ]
    },
    {
      id:'doctor', icon:'🩺', title:'At a doctor', level:'Supported', aim:'Say you need a doctor or help.',
      required:[11,37,42,94,95],
      turns:[
        {npc:'Hola. ¿Qué necesita?', english:'Hello. What do you need?', replies:['Necesito un médico.','Necesito ayuda.'], explain:'Necesito… is enough to communicate the need clearly.'},
        {npc:'¿Entiende?', english:'Do you understand?', replies:['No entiendo.','Sí.'], explain:'No entiendo is an essential repair phrase.'},
        {npc:'De acuerdo.', english:'Okay.', replies:['Gracias.'], explain:'Keep the reply small and useful.'}
      ]
    },
    {
      id:'emergency', icon:'🆘', title:'Emergency', level:'Supported', aim:'Ask for urgent help, police or hospital.',
      required:[37,93,94,95,96],
      turns:[
        {npc:'¿Qué pasa?', english:'What is happening?', replies:['¡Ayuda!','Necesito ayuda.'], explain:'Ayuda is the fastest emergency word.'},
        {npc:'¿Necesita la policía o un médico?', english:'Do you need the police or a doctor?', replies:['Necesito la policía.','Necesito un médico.'], explain:'Use Necesito + the thing/person you need.'},
        {npc:'El hospital está cerca.', english:'The hospital is near.', replies:['Gracias.'], explain:'Hospital is a transparent English-Spanish cognate.'}
      ]
    },
    {
      id:'meeting', icon:'👋', title:'Meeting someone', level:'Starter', aim:'Greet someone and exchange a few simple details.',
      required:[1,2,8,16,17,18,24,25,38],
      turns:[
        {npc:'Hola. ¿Cómo está?', english:'Hi. How are you?', replies:['Bien, gracias.','Muy bien, gracias.'], explain:'A short answer is completely natural.'},
        {npc:'¿Habla inglés?', english:'Do you speak English?', replies:['Sí.','Sí, hablo inglés.','No.'], explain:'Spanish often does not need the subject pronoun.'},
        {npc:'Mucho gusto.', english:'Nice to meet you.', replies:['Gracias.','Mucho gusto.'], explain:'Repeating Mucho gusto is a natural response.'}
      ]
    }
  ];

  const state = {
    tab:'daily',
    scenario:'meeting',
    turn:0,
    messages:[],
    dailyStep:0
  };

  function safeParse(v,f){try{return JSON.parse(v)}catch(e){return f}}
  function escapeHtml(v){return String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function normalize(v){return String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9ñ ]/g,'').replace(/\s+/g,' ')}
  function dateKey(){const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
  function item(rank){return ALL.find(x=>x.rank===Number(rank))||CORE[0]}
  function knownSet(){return new Set(safeParse(localStorage.getItem('ldna-everyday-known-v1')||'[]',[]).map(String))}
  function reviewData(){return safeParse(localStorage.getItem('ldna-reviews-v1')||'{}',{})}
  function speechWeaknesses(){return safeParse(localStorage.getItem('ldna-pronunciation-weaknesses-v1')||'{}',{})}
  function dailyData(){return safeParse(localStorage.getItem('ldna-daily5-v1')||'{}',{})}
  function saveDaily(v){localStorage.setItem('ldna-daily5-v1',JSON.stringify(v))}
  function speak(text,rate){if(!('speechSynthesis' in window))return;window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='es-ES';u.rate=rate||.82;const voices=window.speechSynthesis.getVoices();const voice=voices.find(v=>v.lang.toLowerCase().startsWith('es'));if(voice)u.voice=voice;window.speechSynthesis.speak(u)}
  function similarity(a,b){
    a=normalize(a);b=normalize(b);if(!a||!b)return 0;
    const m=a.length,n=b.length,prev=Array.from({length:n+1},(_,i)=>i);
    for(let i=1;i<=m;i++){let diag=i-1;prev[0]=i;for(let j=1;j<=n;j++){const up=prev[j],left=prev[j-1],cost=a[i-1]===b[j-1]?0:1,val=Math.min(up+1,left+1,diag+cost);diag=up;prev[j]=val}}
    return Math.max(0,1-prev[n]/Math.max(m,n))
  }
  function bestSimilarity(answer,replies){return Math.max.apply(null,replies.map(r=>similarity(answer,r)))}
  function familiarCount(){return knownSet().size}
  function coreFamiliarCount(){return Array.from(knownSet()).filter(k=>Number(k)<=100).length}
  function markFamiliar(rank){const set=knownSet();set.add(String(rank));localStorage.setItem('ldna-everyday-known-v1',JSON.stringify(Array.from(set)))}
  function dueCount(){const now=Date.now();return Object.values(reviewData()).filter(r=>r&&r.due<=now).length}
  function weakSpeech(){
    return Object.entries(speechWeaknesses()).map(([id,r])=>({id,avg:r.attempts?Math.round((r.total||0)/r.attempts):100,attempts:r.attempts||0})).filter(x=>x.attempts).sort((a,b)=>a.avg-b.avg)[0]||null
  }
  function unlockedRanks(){
    const set=knownSet();for(let i=1;i<=12;i++)set.add(String(i));return set
  }
  function familiarSpanishWords(){
    const ranks=unlockedRanks(),words=new Set(['si','no','por','favor','gracias','de','la','el','un','una','a','al','en','y','que','me','mi','es','esta','está','son','muy','lo']);
    ALL.forEach(function(x){if(ranks.has(String(x.rank)))String(x.spanish||'').toLowerCase().split(/[^a-záéíóúüñ]+/i).filter(Boolean).forEach(function(w){words.add(normalize(w))})});
    return words
  }
  function unfamiliarReplyWords(answer){
    const allowed=familiarSpanishWords();
    return normalize(answer).split(' ').filter(Boolean).filter(function(w){return w.length>2&&!allowed.has(w)})
  }
  function replyAnalysis(answer,turn){
    const canonical=turn.replies[0],score=bestSimilarity(answer,turn.replies),answerWords=new Set(normalize(answer).split(' ').filter(Boolean));
    const missing=normalize(canonical).split(' ').filter(function(w){return w.length>2&&!answerWords.has(w)}).slice(0,3);
    return{canonical:canonical,score:score,missing:missing,unfamiliar:unfamiliarReplyWords(answer)}
  }
  function coachLabel(who){return who==='tutor'?'Spanish coach':who==='coach'?'LanguageDNA coach':'You'}
  function advanceConversation(answer,analysis){
    const s=SCENARIOS.find(function(x){return x.id===state.scenario}),turn=s.turns[state.turn];
    state.messages.push({who:'learner',text:answer});
    let response=analysis.score>=.86?'That works naturally.':analysis.score>=.56?'That works. A more natural model is: “'+analysis.canonical+'”.':'Use this corrected reply: “'+analysis.canonical+'”.';
    if(analysis.unfamiliar.length)response+=' You used extra Spanish too; I’ll keep my next prompt inside your familiar vocabulary.';
    state.messages.push({who:'coach',text:response,english:'English link: '+turn.explain});
    state.turn+=1;
    if(state.turn<s.turns.length){const next=s.turns[state.turn];state.messages.push({who:'tutor',text:next.npc,english:next.english})}else{markDailyStep('scenario')}
    renderConversation()
  }

  function scenarioReadiness(s){
    const unlocked=unlockedRanks(),have=s.required.filter(r=>unlocked.has(String(r))).length;
    return {have,total:s.required.length,pct:Math.round(have/s.required.length*100)}
  }
  function dailyPlan(){
    const known=knownSet(),unfamiliar=CORE.filter(x=>!known.has(String(x.rank)));
    const seed=Array.from(dateKey()).reduce((n,c)=>n+c.charCodeAt(0),0);
    const first=unfamiliar.length?unfamiliar[seed%unfamiliar.length]:CORE[seed%CORE.length];
    const second=unfamiliar.length>1?unfamiliar[(seed+7)%unfamiliar.length]:CORE[(seed+7)%CORE.length];
    const weak=weakSpeech();
    const scenarios=SCENARIOS.slice().sort((a,b)=>scenarioReadiness(b).pct-scenarioReadiness(a).pct);
    return {first,second,weak,scenario:scenarios[seed%Math.min(3,scenarios.length)],due:dueCount()}
  }
  function markDailyStep(step){
    const all=dailyData(),key=dateKey(),record=all[key]||{done:[]};
    if(!record.done.includes(step))record.done.push(step);
    record.updatedAt=Date.now();all[key]=record;saveDaily(all);renderDaily();renderHomeSummary()
  }
  function dailyDone(){const all=dailyData(),r=all[dateKey()];return r&&Array.isArray(r.done)?r.done:[]}
  function openSmartReview(){
    if(window.LanguageDNACore&&typeof window.LanguageDNACore.reviewOne==='function'){window.LanguageDNACore.reviewOne();return}
    const practice=document.querySelector('[data-view="practice"]');if(practice)practice.click()
  }

  function renderHomeSummary(){
    const el=document.getElementById('dailyFiveHomeText');if(!el)return;
    const plan=dailyPlan(),done=dailyDone().length;
    const parts=[];
    if(plan.due)parts.push(plan.due+' review'+(plan.due===1?'':'s')+' due');
    parts.push(Math.max(0,100-coreFamiliarCount())+' Everyday core items still to discover');
    if(plan.weak)parts.push('speech focus: '+plan.weak.id);
    el.textContent=done>=5?'Today’s Daily 5 is complete. Come back tomorrow for a fresh tiny lesson.':parts.join(' · ')+'.'
  }

  function renderTabs(){
    document.querySelectorAll('[data-tutor-tab]').forEach(btn=>btn.classList.toggle('active',btn.dataset.tutorTab===state.tab));
    const daily=document.getElementById('dailyTutorPanel'),conv=document.getElementById('conversationTutorPanel'),scenarios=document.getElementById('scenarioTutorPanel');
    if(daily)daily.hidden=state.tab!=='daily';if(conv)conv.hidden=state.tab!=='conversation';if(scenarios)scenarios.hidden=state.tab!=='scenarios'
  }

  function renderDaily(){
    const root=document.getElementById('dailyTutorPanel');if(!root)return;
    const plan=dailyPlan(),done=dailyDone(),completed=done.length;
    const weakLabel=plan.weak?plan.weak.id.replace(/-/g,' / '):'clear Spanish vowels';
    const steps=[
      {id:'review',title:'1. Memory first',body:plan.due?plan.due+' review'+(plan.due===1?' is':'s are')+' due now. Do one due link, then come straight back.':'Nothing is due. Do one tiny review link.',action:'review',label:'Review one link'},
      {id:'word1',title:'2. One useful word or phrase',body:plan.first.english+' → '+plan.first.spanish+'. '+plan.first.exampleEn+' → '+plan.first.exampleEs+'.',action:'hear1',label:'Hear Spanish'},
      {id:'word2',title:'3. Add one more',body:plan.second.english+' → '+plan.second.spanish+'. '+plan.second.exampleEn+' → '+plan.second.exampleEs+'.',action:'hear2',label:'Hear Spanish'},
      {id:'speak',title:'4. Say one thing aloud',body:'Speech focus: '+weakLabel+'. Say: “'+plan.first.spanish+'”. Keep it short and clear.',action:'speak',label:'Check my speech'},
      {id:'scenario',title:'5. Use it in real life',body:plan.scenario.icon+' '+plan.scenario.title+': '+plan.scenario.aim,action:'scenario',label:'Try this scenario'}
    ];
    root.innerHTML='<section class="daily-hero"><div><span class="eyebrow">TODAY · ABOUT 5 MINUTES</span><h2>'+completed+' / 5 tiny steps complete</h2><p>No long lesson. No flood of new grammar. Finish five small useful actions.</p></div><div class="daily-progress-ring"><strong>'+Math.round(completed/5*100)+'%</strong><small>today</small></div></section>'+
      '<div class="daily-step-list">'+steps.map((s,i)=>'<article class="daily-step '+(done.includes(s.id)?'done':'')+'"><div class="daily-check">'+(done.includes(s.id)?'✓':i+1)+'</div><div><h3>'+escapeHtml(s.title)+'</h3><p>'+escapeHtml(s.body)+'</p><div class="daily-actions">'+(s.id==='speak'?'<button type="button" class="secondary-btn" data-tutor-speak="'+escapeHtml(plan.first.spanish)+'">🔊 Hear first</button>':'')+'<button type="button" class="secondary-btn" data-daily-action="'+s.action+'">'+escapeHtml(s.label)+'</button><button type="button" class="text-btn" data-daily-done="'+s.id+'">'+(done.includes(s.id)?'Done ✓':'Mark done')+'</button></div></div></article>').join('')+'</div>'
  }

  function resetConversation(id){
    state.scenario=id||state.scenario;state.turn=0;state.messages=[];
    const s=SCENARIOS.find(x=>x.id===state.scenario)||SCENARIOS[0];
    state.messages.push({who:'tutor',text:s.turns[0].npc,english:s.turns[0].english});renderConversation()
  }
  function renderConversation(){
    const root=document.getElementById('conversationTutorPanel');if(!root)return;
    const s=SCENARIOS.find(x=>x.id===state.scenario)||SCENARIOS[0],ready=scenarioReadiness(s),turn=s.turns[Math.min(state.turn,s.turns.length-1)];
    const boundary=unlockedRanks().size;
    root.innerHTML='<div class="conversation-layout"><aside class="conversation-side"><span class="eyebrow">CONVERSATION TUTOR</span><h2>'+s.icon+' '+escapeHtml(s.title)+'</h2><p>'+escapeHtml(s.aim)+'</p><div class="conversation-boundary"><strong>'+boundary+'</strong><small>starter + familiar words available</small></div><div class="readiness-bar"><span style="width:'+ready.pct+'%"></span></div><small>'+ready.have+'/'+ready.total+' scenario essentials already familiar. Missing words stay supported with hints.</small><button type="button" class="secondary-btn" data-tutor-tab="scenarios">Choose another scenario</button></aside>'+
      '<section class="conversation-main"><div class="conversation-note">Beginner-safe coach · accepts close natural replies, corrects mistakes gently, and keeps its own prompts close to vocabulary you have unlocked.</div><div class="chat-stream">'+state.messages.map(m=>'<div class="chat-bubble '+m.who+'"><strong>'+(m.who==='tutor'?'Spanish coach':'You')+'</strong><p>'+escapeHtml(m.text)+'</p>'+(m.english?'<small>'+escapeHtml(m.english)+'</small>':'')+'</div>').join('')+'</div>'+
      (state.turn>=s.turns.length?'<div class="conversation-complete"><strong>✓ Scenario complete</strong><p>You handled '+s.turns.length+' short turns without needing a long lesson.</p><button type="button" class="primary-btn" data-conversation-restart>Try again</button></div>':
      '<form id="conversationForm" class="conversation-form"><label><span class="sr-only">Reply in Spanish</span><input id="conversationInput" autocomplete="off" placeholder="Reply in Spanish…"></label><button type="submit" class="primary-btn">Send</button></form><div class="conversation-support"><button type="button" data-conversation-help>Show English help</button><button type="button" data-conversation-suggest>Show a reply I can use</button><button type="button" data-tutor-speak="'+escapeHtml(turn.npc)+'">🔊 Hear question</button></div><div id="conversationFeedback" class="conversation-feedback" aria-live="polite"></div>')+
      '</section></div>';
    const form=document.getElementById('conversationForm');if(form)form.addEventListener('submit',submitConversation)
  }
  function submitConversation(e){
    e.preventDefault();const input=document.getElementById('conversationInput');if(!input)return;
    const answer=input.value.trim();if(!answer)return;
    const s=SCENARIOS.find(function(x){return x.id===state.scenario}),turn=s.turns[state.turn],analysis=replyAnalysis(answer,turn),feedback=document.getElementById('conversationFeedback');
    const contains=turn.replies.some(function(r){return normalize(answer).includes(normalize(r))||normalize(r).includes(normalize(answer))});
    if(analysis.score>=.56||contains){advanceConversation(answer,analysis);return}
    if(feedback){
      const missing=analysis.missing.length?' Focus on: <b>'+escapeHtml(analysis.missing.join(' · '))+'</b>.':'';
      feedback.innerHTML='<div class="tutor-correction"><strong>Good attempt — change it slightly.</strong><p>You wrote: <em>'+escapeHtml(answer)+'</em></p><p>Better: <b>'+escapeHtml(analysis.canonical)+'</b></p><p>'+escapeHtml(turn.explain)+'</p>'+missing+'<button type="button" class="secondary-btn" data-conversation-use-correction>Use corrected reply</button></div>'
    }
  }

  function renderScenarios(){
    const root=document.getElementById('scenarioTutorPanel');if(!root)return;
    root.innerHTML='<div class="scenario-heading"><div><span class="eyebrow">REAL-LIFE SPANISH</span><h2>Practise situations you may actually face.</h2><p>Each scenario is only three short turns. Readiness is based on starter essentials plus vocabulary you marked Familiar.</p></div></div><div class="scenario-grid">'+SCENARIOS.map(s=>{const r=scenarioReadiness(s);return '<article class="scenario-card"><div class="scenario-icon">'+s.icon+'</div><div><span class="scenario-level">'+escapeHtml(s.level)+'</span><h3>'+escapeHtml(s.title)+'</h3><p>'+escapeHtml(s.aim)+'</p><div class="readiness-bar"><span style="width:'+r.pct+'%"></span></div><small>'+r.have+'/'+r.total+' essential items familiar</small><button type="button" class="primary-btn" data-scenario-start="'+s.id+'">'+(r.pct>=70?'Start conversation':'Start with support')+'</button></div></article>'}).join('')+'</div>'
  }

  function startSpeechCheck(text){
    const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;if(!Recognition){speak(text,.62);return}
    const rec=new Recognition();rec.lang='es-ES';rec.interimResults=false;rec.maxAlternatives=3;
    const box=document.querySelector('[data-daily-action="speak"]');if(box)box.textContent='Listening…';
    rec.onresult=e=>{const heard=e.results[0][0].transcript,score=Math.round(similarity(text,heard)*100);if(box)box.textContent=score>=65?'✓ '+score+'% match':'Try again · '+score+'%';if(score>=65)markDailyStep('speak')};
    rec.onend=()=>{if(box&&box.textContent==='Listening…')box.textContent='Hear slowly'};rec.start()
  }

  document.addEventListener('click',e=>{
    const open=e.target.closest('[data-tutor-open]');if(open){state.tab=open.dataset.tutorOpen||'daily';renderTabs();if(state.tab==='daily')renderDaily();return}
    const tab=e.target.closest('[data-tutor-tab]');if(tab){state.tab=tab.dataset.tutorTab;renderTabs();if(state.tab==='daily')renderDaily();if(state.tab==='conversation'){if(!state.messages.length)resetConversation(state.scenario);else renderConversation()}if(state.tab==='scenarios')renderScenarios();return}
    const done=e.target.closest('[data-daily-done]');if(done){markDailyStep(done.dataset.dailyDone);return}
    const action=e.target.closest('[data-daily-action]');if(action){const plan=dailyPlan(),a=action.dataset.dailyAction;if(a==='review'){markDailyStep('review');openSmartReview()}if(a==='hear1'){speak(plan.first.spanish);markFamiliar(plan.first.rank);markDailyStep('word1')}if(a==='hear2'){speak(plan.second.spanish);markFamiliar(plan.second.rank);markDailyStep('word2')}if(a==='speak'){startSpeechCheck(plan.first.spanish)}if(a==='scenario'){state.scenario=plan.scenario.id;state.tab='conversation';resetConversation(state.scenario);renderTabs()}return}
    const scenario=e.target.closest('[data-scenario-start]');if(scenario){state.scenario=scenario.dataset.scenarioStart;state.tab='conversation';resetConversation(state.scenario);renderTabs();return}
    const correction=e.target.closest('[data-conversation-use-correction]');if(correction){const s=SCENARIOS.find(function(x){return x.id===state.scenario}),turn=s.turns[state.turn],canonical=turn.replies[0];advanceConversation(canonical,replyAnalysis(canonical,turn));return}
    const restart=e.target.closest('[data-conversation-restart]');if(restart){resetConversation(state.scenario);return}
    const help=e.target.closest('[data-conversation-help]');if(help){const s=SCENARIOS.find(x=>x.id===state.scenario),turn=s.turns[state.turn],feedback=document.getElementById('conversationFeedback');if(feedback)feedback.innerHTML='<strong>English:</strong> '+escapeHtml(turn.english);return}
    const suggest=e.target.closest('[data-conversation-suggest]');if(suggest){const s=SCENARIOS.find(x=>x.id===state.scenario),turn=s.turns[state.turn],input=document.getElementById('conversationInput');if(input){input.value=turn.replies[0];input.focus()}return}
    const audio=e.target.closest('[data-tutor-speak]');if(audio){speak(audio.dataset.tutorSpeak);return}
  });

  window.LanguageDNATutor={
    render:function(){renderHomeSummary();renderDaily();renderScenarios();renderTabs()},
    open:function(tab){state.tab=tab||'daily';renderTabs();if(state.tab==='daily')renderDaily();if(state.tab==='scenarios')renderScenarios();if(state.tab==='conversation')resetConversation(state.scenario)}
  };

  renderHomeSummary();renderDaily();renderScenarios();renderTabs();
})();