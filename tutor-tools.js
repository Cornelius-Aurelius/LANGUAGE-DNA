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
      id:'work', icon:'💼', title:'At work', level:'Starter', aim:'Introduce yourself, ask for something and understand a simple task.',
      required:[2,7,8,17,37,41,42,49],
      turns:[
        {npc:'Hola. ¿Cómo se llama?', english:'Hello. What is your name?', replies:['Me llamo Alex.','Soy Alex.'], explain:'Me llamo… and Soy… are both useful ways to introduce yourself.'},
        {npc:'¿Necesita algo?', english:'Do you need anything?', replies:['Necesito ayuda, por favor.','No, gracias.'], explain:'Necesito… is a simple reusable work phrase.'},
        {npc:'Tenemos que empezar ahora.', english:'We have to start now.', replies:['De acuerdo.','Sí, vamos.'], explain:'Tener que + verb expresses “have to”.'}
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


  const EXTRA_TURNS = {
    cafe:[
      {npc:'¿Para aquí o para llevar?',english:'For here or to take away?',replies:['Para aquí, por favor.','Para llevar, por favor.'],explain:'Para aquí means “for here”; para llevar means “to take away”.'},
      {npc:'¿Quiere agua?',english:'Would you like water?',replies:['Sí, agua, por favor.','No, gracias.'],explain:'A short sí/no answer plus the item is enough.'}
    ],
    hotel:[
      {npc:'¿Necesita wifi?',english:'Do you need Wi-Fi?',replies:['Sí, por favor.','No, gracias.'],explain:'Keep the answer small: sí/no + por favor/gracias.'},
      {npc:'¿A qué hora sale?',english:'What time are you leaving?',replies:['Por la mañana.','A las diez.'],explain:'Use a simple time phrase; perfect detail is not required.'}
    ],
    airport:[
      {npc:'¿Tiene su pasaporte?',english:'Do you have your passport?',replies:['Sí, aquí está.','Sí.'],explain:'Aquí está means “here it is”.'},
      {npc:'La puerta está a la izquierda.',english:'The gate is on the left.',replies:['Gracias.','De acuerdo, gracias.'],explain:'Izquierda means left.'}
    ],
    taxi:[
      {npc:'¿Aquí?',english:'Here?',replies:['Sí, aquí, por favor.','No, más adelante.'],explain:'Aquí is “here”; más adelante is “further ahead”.'},
      {npc:'¿Necesita recibo?',english:'Do you need a receipt?',replies:['Sí, por favor.','No, gracias.'],explain:'Short polite replies work well in real life.'}
    ],
    shopping:[
      {npc:'¿Algo más?',english:'Anything else?',replies:['No, gracias.','Sí, esto también.'],explain:'Esto también means “this too”.'},
      {npc:'¿Bolsa?',english:'A bag?',replies:['Sí, por favor.','No, gracias.'],explain:'You can answer with only the words you need.'}
    ],
    directions:[
      {npc:'Después, a la derecha.',english:'Then, to the right.',replies:['De acuerdo.','Gracias.'],explain:'Derecha means right.'},
      {npc:'Está muy cerca.',english:'It is very near.',replies:['Muchas gracias.','Gracias.'],explain:'Muy makes the description stronger: very near.'}
    ],
    doctor:[
      {npc:'¿Le duele aquí?',english:'Does it hurt here?',replies:['Sí, aquí.','No.'],explain:'A short location answer is enough when you need help.'},
      {npc:'Espere aquí, por favor.',english:'Wait here, please.',replies:['De acuerdo.','Gracias.'],explain:'De acuerdo is a useful “okay / understood”.'}
    ],
    emergency:[
      {npc:'¿Dónde está?',english:'Where are you?',replies:['Estoy aquí.','Estoy en el hotel.'],explain:'Estoy… is the useful location frame.'},
      {npc:'La ayuda viene ahora.',english:'Help is coming now.',replies:['Gracias.','De acuerdo.'],explain:'Keep emergency replies short and clear.'}
    ],
    work:[
      {npc:'¿Va a trabajar aquí mañana?',english:'Are you going to work here tomorrow?',replies:['Sí, voy a trabajar aquí.','No, mañana no.'],explain:'Voy a + verb is the easy “going to” frame.'},
      {npc:'¿Puede ayudarme?',english:'Can you help me?',replies:['Sí, claro.','Sí, puedo ayudar.'],explain:'Keep useful work replies short and clear.'},
      {npc:'Perfecto. Gracias.',english:'Perfect. Thank you.',replies:['De nada.','Gracias.'],explain:'De nada is a natural response to thanks.'}
    ],
    meeting:[
      {npc:'¿De dónde es?',english:'Where are you from?',replies:['Soy de Inglaterra.','Soy de Reino Unido.'],explain:'Soy de… means “I am from…”.'},
      {npc:'¿Le gusta España?',english:'Do you like Spain?',replies:['Sí, me gusta.','Sí, mucho.'],explain:'Me gusta is the reusable “I like it” frame.'}
    ]
  };

  const RISKY_EXPANSION = new Set(['actually','realize','realise','eventually','sensible','actualize','actualise','embarrassed','assist']);
  const DAILY_STEPS=['review','link','use','speak','real-life'];
  const PATTERN_SCENARIOS={
    'ser-identity':'meeting','gustar':'meeting','subject-drop':'meeting','estar-gerund':'meeting',
    'question-words':'directions','question-order':'directions','estar-location':'directions','a-en-de':'directions',
    'hay':'hotel','tener-que':'work','regular-ar':'work','regular-er':'work','regular-ir':'work',
    'ir-a':'taxi','no-before-verb':'shopping','direct-object':'shopping','personal-a':'shopping',
    'reflexive':'hotel','hace-weather':'meeting','para-purpose':'work','porque':'work'
  };
  const state={tab:'daily',scenario:'meeting',turn:0,messages:[],dailyFeedback:'',dailyCarry:'',patternFocus:null};

  function safeParse(v,f){try{return JSON.parse(v)}catch(e){return f}}
  function escapeHtml(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function normalize(v){return String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9ñ ]/g,'').replace(/\s+/g,' ')}
  function dateKey(offset){const d=new Date();if(offset)d.setDate(d.getDate()+offset);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
  function knownSet(){return new Set(safeParse(localStorage.getItem('ldna-everyday-known-v1')||'[]',[]).map(String))}
  function reviewData(){return safeParse(localStorage.getItem('ldna-reviews-v1')||'{}',{})}
  function speechWeaknesses(){return safeParse(localStorage.getItem('ldna-pronunciation-weaknesses-v1')||'{}',{})}
  function dailyData(){return safeParse(localStorage.getItem('ldna-daily5-v1')||'{}',{})}
  function saveDaily(v){localStorage.setItem('ldna-daily5-v1',JSON.stringify(v))}
  function signalData(){return safeParse(localStorage.getItem('ldna-learning-signals-v1')||'[]',[])}
  function saveSignals(rows){localStorage.setItem('ldna-learning-signals-v1',JSON.stringify(rows.slice(-300)))}
  function gameProgress(){return safeParse(localStorage.getItem('ldna-game-progress-v1')||'{"unlocked":1,"best":{},"attempts":[]}',{unlocked:1,best:{},attempts:[]})}
  function appActivity(){return safeParse(localStorage.getItem('ldna-activity-v1')||'[]',[])}
  function speak(text,rate,button){
    if(!('speechSynthesis' in window))return;
    if(button&&!button.dataset.audioOriginal)button.dataset.audioOriginal=button.innerHTML;
    if(button){button.disabled=true;button.classList.add('audio-playing');button.textContent='🔊 Loading…'}
    window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='es-ES';u.rate=rate||.82;const voices=window.speechSynthesis.getVoices(),voice=voices.find(function(v){return v.lang.toLowerCase().startsWith('es')});if(voice)u.voice=voice;
    u.onstart=function(){if(button)button.textContent='🔊 Playing…'};
    u.onend=function(){if(button){button.disabled=false;button.classList.remove('audio-playing');button.textContent='✓ Played';setTimeout(function(){if(button&&button.dataset.audioOriginal)button.innerHTML=button.dataset.audioOriginal},850)}};
    u.onerror=function(){if(button){button.disabled=false;button.classList.remove('audio-playing');if(button.dataset.audioOriginal)button.innerHTML=button.dataset.audioOriginal}};
    window.speechSynthesis.speak(u)
  }
  function similarity(a,b){a=normalize(a);b=normalize(b);if(!a||!b)return 0;const m=a.length,n=b.length,prev=Array.from({length:n+1},function(_,i){return i});for(let i=1;i<=m;i++){let diag=i-1;prev[0]=i;for(let j=1;j<=n;j++){const up=prev[j],left=prev[j-1],cost=a[i-1]===b[j-1]?0:1,val=Math.min(up+1,left+1,diag+cost);diag=up;prev[j]=val}}return Math.max(0,1-prev[n]/Math.max(m,n))}
  function bestSimilarity(answer,replies){return Math.max.apply(null,replies.map(function(r){return similarity(answer,r)}))}
  function recordSignal(type,data){const rows=signalData();rows.push(Object.assign({at:Date.now(),day:dateKey(),type:type},data||{}));saveSignals(rows);if(window.LanguageDNACore&&typeof window.LanguageDNACore.trackEvent==='function')window.LanguageDNACore.trackEvent('tutor_'+type,data||{})}
  function coreFamiliarCount(){return Array.from(knownSet()).filter(function(k){return Number(k)<=100}).length}
  function familiarCount(){return knownSet().size}
  function markFamiliar(rank){const set=knownSet();set.add(String(rank));localStorage.setItem('ldna-everyday-known-v1',JSON.stringify(Array.from(set)))}
  function dueCount(){const now=Date.now();return Object.values(reviewData()).filter(function(r){return r&&r.due<=now}).length}
  function weakSpeech(){return Object.entries(speechWeaknesses()).map(function(entry){const id=entry[0],r=entry[1];return{id:id,avg:r.attempts?Math.round((r.total||0)/r.attempts):100,attempts:r.attempts||0}}).filter(function(x){return x.attempts}).sort(function(a,b){return a.avg-b.avg})[0]||null}
  function unlockedRanks(){const set=knownSet();for(let i=1;i<=12;i++)set.add(String(i));return set}
  function familiarSpanishWords(){const ranks=unlockedRanks(),words=new Set(['si','no','por','favor','gracias','de','la','el','un','una','a','al','en','y','que','me','mi','es','esta','son','muy','lo']);ALL.forEach(function(x){if(ranks.has(String(x.rank)))String(x.spanish||'').toLowerCase().split(/[^a-záéíóúüñ]+/i).filter(Boolean).forEach(function(w){words.add(normalize(w))})});return words}
  function unfamiliarReplyWords(answer){const allowed=familiarSpanishWords();return normalize(answer).split(' ').filter(Boolean).filter(function(w){return w.length>2&&!allowed.has(w)})}
  function replyAnalysis(answer,turn){
    const canonical=turn.replies[0],answerWords=new Set(normalize(answer).split(' ').filter(Boolean)),stop=new Set(['por','para','con','una','uno','los','las','del','que','muy']);
    let score=bestSimilarity(answer,turn.replies);
    turn.replies.forEach(function(reply){
      const important=normalize(reply).split(' ').filter(function(w){return w.length>2&&!stop.has(w)}),hits=important.filter(function(w){return answerWords.has(w)}).length;
      const overlap=important.length?hits/important.length:0;if(overlap>=.75)score=Math.max(score,.88);else if(overlap>=.5&&hits>=1)score=Math.max(score,.68)
    });
    const missing=normalize(canonical).split(' ').filter(function(w){return w.length>2&&!answerWords.has(w)}).slice(0,3);
    return{canonical:canonical,score:score,missing:missing,unfamiliar:unfamiliarReplyWords(answer)}
  }
  function correctionMarkup(answer,canonical){const answerWords=normalize(answer).split(' ').filter(Boolean),parts=String(canonical||'').split(/([A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)/),canonicalWords=parts.filter(function(part){return/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+$/.test(part)});let changeIndex=canonicalWords.findIndex(function(word,i){return normalize(word)!==(answerWords[i]||'')});if(changeIndex<0)changeIndex=0;let wordIndex=0;return parts.map(function(part){if(!/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+$/.test(part))return escapeHtml(part);const html=escapeHtml(part),index=wordIndex++;return index===changeIndex?'<strong class="tutor-change">'+html+'</strong>':html}).join('')}
  function coachLabel(who){return who==='tutor'?'Spanish coach':who==='coach'?'LanguageDNA coach':'You'}

  function ensureDailyRecord(){
    const all=dailyData(),key=dateKey(),record=all[key]||{done:[],wrong:0,attempts:0};
    if(!Array.isArray(record.done))record.done=[];
    if(!record.startedAt){record.startedAt=Date.now();recordSignal('daily_start',{day:key})}
    all[key]=record;saveDaily(all);return{all:all,key:key,record:record}
  }
  function dailyDone(){const r=dailyData()[dateKey()];return r&&Array.isArray(r.done)?r.done:[]}
  function incompleteDailyDays(){const all=dailyData(),today=dateKey();return Object.keys(all).filter(function(k){const r=all[k];return k!==today&&r&&r.startedAt&&!r.completedAt&&(r.done||[]).length<5}).length}
  function completedLast7(){const all=dailyData();let n=0;for(let i=0;i<7;i++){const r=all[dateKey(-i)];if(r&&r.completedAt)n++}return n}

  function adaptiveProfile(){
    const known=coreFamiliarCount(),game=gameProgress(),activity=appActivity().filter(function(e){return e&&e.type==='answer'}).slice(-30);
    const correct=activity.filter(function(e){return e.correct}).length,accuracy=activity.length?correct/activity.length:null,weak=weakSpeech();
    let score=0;
    if(known>=20)score++;if(known>=60)score++;
    if((game.unlocked||1)>=2)score++;if((game.unlocked||1)>=4)score++;
    if(activity.length>=8&&accuracy>=.82)score++;if(activity.length>=8&&accuracy<.6)score--;
    if(dueCount()>=8)score--;if(weak&&weak.avg<58)score--;
    const band=Math.max(0,Math.min(3,score));
    const labels=['Starter','Growing','Ready','Stretch'];
    return{band:band,label:labels[band],choiceCount:Math.min(4,2+band),conversationTurns:Math.min(6,3+band),accuracy:accuracy,known:known}
  }

  function qualityExpansion(){
    return EXPANDED.filter(function(x){
      const en=normalize(x.english);
      return !RISKY_EXPANSION.has(en)&&Number(x.usefulness||0)>=70&&Number(x.frequencyRankEn||999999)<=8000&&Number(x.frequencyRankEs||999999)<=8000&&String(x.cefrConfidence||'').toLowerCase()!=='low'
    })
  }
  function learnerPool(){return coreFamiliarCount()<100?CORE:qualityExpansion()}
  function seedNumber(text){return Array.from(String(text||'')).reduce(function(n,c){return(n*31+c.charCodeAt(0))>>>0},17)}
  function rotate(values,seed){if(!values.length)return values;const n=seed%values.length;return values.slice(n).concat(values.slice(0,n))}
  function choiceValues(correct,count,values,seed){const seen=new Set([normalize(correct)]),out=[correct];rotate(values.slice(),seed).forEach(function(v){const key=normalize(v);if(out.length<count&&key&&!seen.has(key)){seen.add(key);out.push(v)}});return rotate(out,seed+3)}
  function dailyChoices(item,count){const source=CORE.concat(qualityExpansion()).filter(function(x){return x.rank!==item.rank}).map(function(x){return x.spanish});return choiceValues(item.spanish,count,source,seedNumber(dateKey()+item.rank))}
  function scenarioChoices(s,count){const correct=s.turns[0].replies[0],others=[];SCENARIOS.forEach(function(x){if(x.id!==s.id&&x.turns[0]&&x.turns[0].replies[0])others.push(x.turns[0].replies[0])});return choiceValues(correct,count,others,seedNumber(dateKey()+s.id))}
  function reviewSnapshot(){if(window.LanguageDNACore&&typeof window.LanguageDNACore.getReviewSnapshot==='function')return window.LanguageDNACore.getReviewSnapshot();return null}

  function scenarioReadiness(s){const unlocked=unlockedRanks(),have=s.required.filter(function(r){return unlocked.has(String(r))}).length;return{have:have,total:s.required.length,pct:Math.round(have/s.required.length*100)}}
  function dailyPlan(){
    const known=knownSet(),pool=learnerPool(),unfamiliar=pool.filter(function(x){return!known.has(String(x.rank))}),seed=seedNumber(dateKey()),focus=unfamiliar.length?unfamiliar[Math.min(unfamiliar.length-1,seed%Math.min(12,unfamiliar.length))]:pool[seed%pool.length]||CORE[0],profile=adaptiveProfile();
    const scenarios=SCENARIOS.slice().sort(function(a,b){return scenarioReadiness(b).pct-scenarioReadiness(a).pct});
    return{focus:focus,weak:weakSpeech(),scenario:scenarios[seed%Math.min(3,scenarios.length)],due:dueCount(),profile:profile,review:reviewSnapshot()}
  }
  function nextDailyStep(done){for(let i=0;i<DAILY_STEPS.length;i++)if(!done.includes(DAILY_STEPS[i]))return DAILY_STEPS[i];return null}
  function markDailyStep(step,meta){
    const ctx=ensureDailyRecord(),r=ctx.record;
    if(!r.done.includes(step)){r.done.push(step);r.attempts=(r.attempts||0)+1;recordSignal('daily_step',{step:step})}
    if(meta&&meta.carry)state.dailyCarry=meta.carry;state.dailyFeedback='';
    if(r.done.length>=5&&!r.completedAt){r.completedAt=Date.now();recordSignal('daily_complete',{seconds:Math.round((r.completedAt-r.startedAt)/1000),wrong:r.wrong||0})}
    r.updatedAt=Date.now();ctx.all[ctx.key]=r;saveDaily(ctx.all);renderDaily();renderHomeSummary()
  }
  function dailyWrong(step){const ctx=ensureDailyRecord();ctx.record.wrong=(ctx.record.wrong||0)+1;ctx.record.attempts=(ctx.record.attempts||0)+1;ctx.all[ctx.key]=ctx.record;saveDaily(ctx.all);recordSignal('daily_wrong',{step:step})}
  function renderHomeSummary(){
    const el=document.getElementById('dailyFiveHomeText');if(!el)return;
    const plan=dailyPlan(),done=dailyDone(),next=nextDailyStep(done),names={review:'one quick memory check',link:'one English → Spanish link',use:'one useful choice',speak:'one short speaking turn','real-life':'one real-life choice'};
    if(!next){el.textContent='Today’s Daily 5 is complete. You can stop here — your next review will be chosen automatically.';return}
    el.textContent=done.length+'/5 complete · Next: '+names[next]+'. One thing at a time.'
  }

  function dailyStepHtml(plan,step){
    const item=plan.focus,profile=plan.profile;
    if(step==='review'){
      const r=plan.review;
      if(r){
        const choices=choiceValues(r.answer,profile.choiceCount,(r.choices||[]).filter(function(v){return normalize(v)!==normalize(r.answer)}),seedNumber(dateKey()+r.id));
        return '<span class="eyebrow">STEP 1 · REMEMBER</span><h2>'+escapeHtml(r.prompt)+'</h2><p>Choose the Spanish you remember. If it is difficult, that simply tells LanguageDNA to bring it back sooner.</p><div class="daily-choice-grid">'+choices.map(function(v){return'<button type="button" data-daily-review-choice="'+escapeHtml(v)+'">'+escapeHtml(v)+'</button>'}).join('')+'</div>'
      }
      const choices=dailyChoices(item,profile.choiceCount);
      return '<span class="eyebrow">STEP 1 · WARM UP</span><h2>'+escapeHtml(item.english)+'</h2><p>Which Spanish matches the English you already know?</p><div class="daily-choice-grid">'+choices.map(function(v){return'<button type="button" data-daily-review-choice="'+escapeHtml(v)+'" data-daily-fallback-answer="'+escapeHtml(item.spanish)+'">'+escapeHtml(v)+'</button>'}).join('')+'</div>'
    }
    if(step==='link'){
      const link=item.family||item.morphology||item.note||'English meaning first, then the Spanish form.';
      return '<span class="eyebrow">STEP 2 · SEE THE LINK</span><div class="daily-link-pair"><strong>'+escapeHtml(item.english)+'</strong><span>→</span><strong>'+escapeHtml(item.spanish)+'</strong></div><p><b>Why it sticks:</b> '+escapeHtml(link)+'</p><div class="daily-actions"><button type="button" class="secondary-btn" data-tutor-speak="'+escapeHtml(item.spanish)+'">🔊 Hear Spanish</button><button type="button" class="primary-btn" data-daily-link-done>Got it</button></div>'
    }
    if(step==='use'){
      const choices=dailyChoices(item,profile.choiceCount);
      return '<span class="eyebrow">STEP 3 · USE IT</span><h2>'+escapeHtml(item.english)+'</h2><p>Pick the Spanish. Then LanguageDNA will show the same word in a real sentence.</p><div class="daily-choice-grid">'+choices.map(function(v){return'<button type="button" data-daily-use-choice="'+escapeHtml(v)+'">'+escapeHtml(v)+'</button>'}).join('')+'</div><div class="daily-example-line"><small>REAL USE</small><span>'+escapeHtml(item.exampleEn||item.english)+' → '+escapeHtml(item.exampleEs||item.spanish)+'</span></div>'
    }
    if(step==='speak'){
      const weak=plan.weak?plan.weak.id.replace(/-/g,' / '):'clear Spanish vowels';
      return '<span class="eyebrow">STEP 4 · SAY IT</span><h2>“'+escapeHtml(item.spanish)+'”</h2><p>Keep it short. Your current speech focus is '+escapeHtml(weak)+'.</p><div class="daily-actions"><button type="button" class="secondary-btn" data-tutor-speak="'+escapeHtml(item.spanish)+'">🔊 Hear first</button><button type="button" class="primary-btn" data-daily-speak>🎙 Say it</button><button type="button" class="text-btn" data-daily-self-speak>I said it aloud</button></div>'
    }
    const s=plan.scenario,turn=s.turns[0],choices=scenarioChoices(s,profile.choiceCount);
    return '<span class="eyebrow">STEP 5 · REAL LIFE</span><h2>'+s.icon+' '+escapeHtml(s.title)+'</h2><div class="daily-scenario-prompt"><strong>'+escapeHtml(turn.npc)+'</strong><small>'+escapeHtml(turn.english)+'</small></div><p>Choose a simple reply. You do not need a perfect long sentence.</p><div class="daily-choice-grid">'+choices.map(function(v){return'<button type="button" data-daily-scenario-choice="'+escapeHtml(v)+'">'+escapeHtml(v)+'</button>'}).join('')+'</div>'
  }
  function renderDailyComplete(plan){
    const item=plan.focus,s=plan.scenario,review=plan.review,reviewText=review?'a memory link':'a quick recall';
    return '<section class="daily-complete-card"><span class="eyebrow">DAILY 5 COMPLETE</span><h2>Nice work today.</h2><p>You strengthened '+escapeHtml(reviewText)+', <strong>'+escapeHtml(item.english)+' → '+escapeHtml(item.spanish)+'</strong>, speaking aloud, and '+escapeHtml(s.title.toLowerCase())+'.</p><p>LanguageDNA will quietly use today’s answers to choose what comes back next. You are done for today.</p></section>'
  }
  function renderDaily(){
    const root=document.getElementById('dailyTutorPanel');if(!root)return;
    const plan=dailyPlan(),done=dailyDone(),step=nextDailyStep(done),completed=done.length;
    root.innerHTML='<section class="daily-focus-hero"><div><span class="eyebrow">TODAY · ABOUT 5 MINUTES</span><h2>'+completed+' / 5 complete</h2><p>One small action at a time. Difficulty changes automatically from your recent learning.</p></div><div class="daily-progress-mini"><span style="width:'+Math.round(completed/5*100)+'%"></span></div></section>'+
      (state.dailyCarry?'<div class="daily-carry">✓ '+escapeHtml(state.dailyCarry)+'</div>':'')+
      (step?'<article class="daily-focus-card">'+dailyStepHtml(plan,step)+(state.dailyFeedback?'<div class="daily-feedback">'+state.dailyFeedback+'</div>':'')+'</article>':renderDailyComplete(plan))
  }

  function renderTabs(){document.querySelectorAll('[data-tutor-tab]').forEach(function(btn){btn.classList.toggle('active',btn.dataset.tutorTab===state.tab)});const daily=document.getElementById('dailyTutorPanel'),conv=document.getElementById('conversationTutorPanel'),scenarios=document.getElementById('scenarioTutorPanel');if(daily)daily.hidden=state.tab!=='daily';if(conv)conv.hidden=state.tab!=='conversation';if(scenarios)scenarios.hidden=state.tab!=='scenarios'}

  function conversationTurns(s){const extra=EXTRA_TURNS[s.id]||[],count=adaptiveProfile().conversationTurns;return s.turns.concat(extra).slice(0,count)}
  function patternInfo(id){return window.LanguageDNACore&&typeof window.LanguageDNACore.patternInfo==='function'?window.LanguageDNACore.patternInfo(id):null}
  function scenarioForPattern(id){
    if(PATTERN_SCENARIOS[id])return PATTERN_SCENARIOS[id];
    const info=patternInfo(id);if(!info)return'meeting';
    if((info.tags||[]).includes('questions'))return'directions';
    if((info.tags||[]).includes('verbs'))return'work';
    if((info.tags||[]).includes('sentence'))return'meeting';
    return'meeting'
  }
  function resetConversation(id){
    state.scenario=id||state.scenario;state.turn=0;state.messages=[];
    const s=SCENARIOS.find(function(x){return x.id===state.scenario})||SCENARIOS[0],turns=conversationTurns(s);
    state.messages.push({who:'tutor',text:turns[0].npc,english:turns[0].english});
    recordSignal('conversation_start',{scenario:s.id,turns:turns.length,pattern:state.patternFocus||null});renderConversation()
  }
  function advanceConversation(answer,analysis){
    const s=SCENARIOS.find(function(x){return x.id===state.scenario}),turns=conversationTurns(s);
    state.messages.push({who:'learner',text:answer});
    if(analysis.score>=.86)state.messages.push({who:'coach',text:'That works naturally.'});
    else if(analysis.score>=.68)state.messages.push({who:'coach',html:'<p>Good — that communicates the idea.</p><p>A natural version: '+correctionMarkup(answer,analysis.canonical)+'</p>'});
    else{state.messages.push({who:'coach',html:'<p>That makes sense.</p><p>A more natural way: '+correctionMarkup(answer,analysis.canonical)+'</p>'});recordSignal('conversation_correction',{scenario:s.id,turn:state.turn,pattern:state.patternFocus||null})}
    state.turn+=1;
    if(state.turn<turns.length){const next=turns[state.turn];state.messages.push({who:'tutor',text:next.npc,english:next.english})}
    else{
      recordSignal('conversation_complete',{scenario:s.id,turns:turns.length,pattern:state.patternFocus||null});
      if(state.patternFocus&&window.LanguageDNACore&&typeof window.LanguageDNACore.completePatternConversation==='function')window.LanguageDNACore.completePatternConversation(state.patternFocus)
    }
    renderConversation()
  }
  function renderConversation(){
    const root=document.getElementById('conversationTutorPanel');if(!root)return;
    const s=SCENARIOS.find(function(x){return x.id===state.scenario})||SCENARIOS[0],turns=conversationTurns(s),turn=turns[Math.min(state.turn,turns.length-1)],focus=state.patternFocus?patternInfo(state.patternFocus):null;
    const focusHtml=focus?'<div class="conversation-pattern-focus"><small>USING A PATTERN YOU LEARNED</small><strong>'+escapeHtml(focus.title)+'</strong><span>'+escapeHtml(focus.meaning||'Use it naturally where it fits.')+'</span></div>':'';
    root.innerHTML='<div class="conversation-layout simple-conversation"><aside class="conversation-side"><span class="eyebrow">REAL-LIFE PRACTICE</span><h2>'+s.icon+' '+escapeHtml(s.title)+'</h2><p>'+escapeHtml(s.aim)+'</p>'+focusHtml+'<button type="button" class="secondary-btn" data-tutor-tab="scenarios">Choose another situation</button></aside>'+
      '<section class="conversation-main"><div class="conversation-note">Reply with the Spanish you know. Short answers are fine. Use English help only when you need it.</div><div class="chat-stream">'+state.messages.map(function(m){return'<div class="chat-bubble '+m.who+'"><strong>'+escapeHtml(coachLabel(m.who))+'</strong>'+(m.html?m.html:'<p>'+escapeHtml(m.text)+'</p>')+(m.english?'<small>'+escapeHtml(m.english)+'</small>':'')+'</div>'}).join('')+'</div>'+
      (state.turn>=turns.length?'<div class="conversation-complete"><strong>✓ Real-life practice complete</strong><p>You handled '+turns.length+' short turns.'+(focus?' You also moved <b>'+escapeHtml(focus.title)+'</b> one step closer to mastery.':'')+'</p><button type="button" class="primary-btn" data-conversation-restart>Try again</button></div>':
      '<form id="conversationForm" class="conversation-form"><label><span class="sr-only">Reply in Spanish</span><input id="conversationInput" autocomplete="off" placeholder="Reply in Spanish…"></label><button type="submit" class="primary-btn">Send</button></form><div class="conversation-support"><button type="button" data-conversation-help>English help</button><button type="button" data-conversation-suggest>Show a reply</button><button type="button" data-tutor-speak="'+escapeHtml(turn.npc)+'">🔊 Hear question</button></div><div id="conversationFeedback" class="conversation-feedback" aria-live="polite"></div>')+
      '</section></div>';
    const form=document.getElementById('conversationForm');if(form)form.addEventListener('submit',submitConversation)
  }
  function submitConversation(e){
    e.preventDefault();const input=document.getElementById('conversationInput');if(!input)return;const answer=input.value.trim();if(!answer)return;
    const s=SCENARIOS.find(function(x){return x.id===state.scenario}),turn=conversationTurns(s)[state.turn],analysis=replyAnalysis(answer,turn),feedback=document.getElementById('conversationFeedback');
    const contains=turn.replies.some(function(r){return normalize(answer).includes(normalize(r))||normalize(r).includes(normalize(answer))});
    if(analysis.score>=.56||contains){advanceConversation(answer,analysis);return}
    recordSignal('conversation_wrong',{scenario:s.id,turn:state.turn});
    if(feedback)feedback.innerHTML='<div class="tutor-correction"><p>That makes sense.</p><p>A more natural way: '+correctionMarkup(answer,analysis.canonical)+'</p><button type="button" class="secondary-btn" data-conversation-use-correction>Use this reply</button></div>'
  }
  function renderScenarios(){
    const root=document.getElementById('scenarioTutorPanel');if(!root)return;const turns=adaptiveProfile().conversationTurns;
    root.innerHTML='<div class="scenario-heading"><div><span class="eyebrow">REAL-LIFE SPANISH</span><h2>Choose a situation.</h2><p>Start speaking immediately. LanguageDNA keeps the conversation short and adds more turns only when you are ready.</p></div></div><div class="scenario-grid">'+SCENARIOS.map(function(s){const r=scenarioReadiness(s);return'<article class="scenario-card"><div class="scenario-icon">'+s.icon+'</div><div><h3>'+escapeHtml(s.title)+'</h3><p>'+escapeHtml(s.aim)+'</p><small>'+(r.pct>=70?'You know enough to try this now.':'English help will be available.')+'</small><button type="button" class="primary-btn" data-scenario-start="'+s.id+'">Start</button></div></article>'}).join('')+'</div>'
  }

  function startSpeechCheck(text){
    const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!Recognition){speak(text,.62);state.dailyFeedback='Speech recognition is unavailable here. Listen once, say it aloud, then tap “I said it aloud”.';renderDaily();return}
    const rec=new Recognition();rec.lang='es-ES';rec.interimResults=false;rec.maxAlternatives=3;state.dailyFeedback='Listening…';renderDaily();
    rec.onresult=function(e){const heard=e.results[0][0].transcript,score=Math.round(similarity(text,heard)*100);recordSignal('daily_speech',{score:score});if(score>=62){markDailyStep('speak',{carry:'Your Spanish was recognised at '+score+'%.'})}else{dailyWrong('speak');state.dailyFeedback='Close. I heard “'+escapeHtml(heard)+'”. Hear it once more and try again.';renderDaily()}};
    rec.onerror=function(){state.dailyFeedback='I could not capture that clearly. You can try again or use the self-check.';renderDaily()};rec.start()
  }

  function signalSummary(){const rows=signalData(),week=Date.now()-7*86400000,recent=rows.filter(function(r){return r.at>=week});return{events:rows.length,wrong:recent.filter(function(r){return r.type==='daily_wrong'||r.type==='conversation_wrong'}).length,dailyCompleted:recent.filter(function(r){return r.type==='daily_complete'}).length,incompleteDays:incompleteDailyDays()}}
  function tutorSummary(){const p=adaptiveProfile(),signals=signalSummary(),ready=SCENARIOS.filter(function(s){return scenarioReadiness(s).pct>=70});return{knownWords:familiarCount(),coreKnown:coreFamiliarCount(),scenariosReady:ready.length,readyTitles:ready.map(function(s){return s.title}),dailyCompleted7:completedLast7(),adaptiveLabel:p.label,weakSpeech:weakSpeech(),signals:signals}}

  document.addEventListener('click',function(e){
    const open=e.target.closest('[data-tutor-open]');if(open){state.tab=open.dataset.tutorOpen||'daily';renderTabs();if(state.tab==='daily'){ensureDailyRecord();renderDaily()}return}
    const tab=e.target.closest('[data-tutor-tab]');if(tab){state.tab=tab.dataset.tutorTab;renderTabs();if(state.tab==='daily'){ensureDailyRecord();renderDaily()}if(state.tab==='conversation'){if(!state.messages.length)resetConversation(state.scenario);else renderConversation()}if(state.tab==='scenarios')renderScenarios();return}
    const reviewChoice=e.target.closest('[data-daily-review-choice]');if(reviewChoice){const plan=dailyPlan(),answer=plan.review?plan.review.answer:(reviewChoice.dataset.dailyFallbackAnswer||plan.focus.spanish),chosen=reviewChoice.dataset.dailyReviewChoice;if(normalize(chosen)===normalize(answer)){if(plan.review&&window.LanguageDNACore&&typeof window.LanguageDNACore.completeReview==='function')window.LanguageDNACore.completeReview(plan.review.id,4);markDailyStep('review',{carry:'Memory strengthened.'})}else{dailyWrong('review');state.dailyFeedback='Not quite. Try once more — no penalty.';renderDaily()}return}
    const linkDone=e.target.closest('[data-daily-link-done]');if(linkDone){const plan=dailyPlan();markFamiliar(plan.focus.rank);markDailyStep('link',{carry:plan.focus.english+' → '+plan.focus.spanish}) ;return}
    const useChoice=e.target.closest('[data-daily-use-choice]');if(useChoice){const plan=dailyPlan(),chosen=useChoice.dataset.dailyUseChoice;if(normalize(chosen)===normalize(plan.focus.spanish)){markFamiliar(plan.focus.rank);markDailyStep('use',{carry:(plan.focus.exampleEn||plan.focus.english)+' → '+(plan.focus.exampleEs||plan.focus.spanish)})}else{dailyWrong('use');state.dailyFeedback='Nearly. Look back at the English link and try again.';renderDaily()}return}
    const dailySpeak=e.target.closest('[data-daily-speak]');if(dailySpeak){startSpeechCheck(dailyPlan().focus.spanish);return}
    const selfSpeak=e.target.closest('[data-daily-self-speak]');if(selfSpeak){recordSignal('daily_speech_selfcheck',{});markDailyStep('speak',{carry:'You said it aloud.'});return}
    const scenarioChoice=e.target.closest('[data-daily-scenario-choice]');if(scenarioChoice){const plan=dailyPlan(),correct=plan.scenario.turns[0].replies[0],chosen=scenarioChoice.dataset.dailyScenarioChoice;if(normalize(chosen)===normalize(correct)){markDailyStep('real-life',{carry:'Real-life reply handled.'})}else{dailyWrong('real-life');state.dailyFeedback='That reply belongs in a different situation. Try the simplest answer that fits this prompt.';renderDaily()}return}
    const scenario=e.target.closest('[data-scenario-start]');if(scenario){state.patternFocus=null;localStorage.removeItem('ldna-tutor-pattern-focus-v1');state.scenario=scenario.dataset.scenarioStart;state.tab='conversation';resetConversation(state.scenario);renderTabs();return}
    const correction=e.target.closest('[data-conversation-use-correction]');if(correction){const s=SCENARIOS.find(function(x){return x.id===state.scenario}),turn=conversationTurns(s)[state.turn],canonical=turn.replies[0];advanceConversation(canonical,replyAnalysis(canonical,turn));return}
    const restart=e.target.closest('[data-conversation-restart]');if(restart){resetConversation(state.scenario);return}
    const help=e.target.closest('[data-conversation-help]');if(help){const s=SCENARIOS.find(function(x){return x.id===state.scenario}),turn=conversationTurns(s)[state.turn],feedback=document.getElementById('conversationFeedback');if(feedback)feedback.innerHTML='<strong>English:</strong> '+escapeHtml(turn.english);return}
    const suggest=e.target.closest('[data-conversation-suggest]');if(suggest){const s=SCENARIOS.find(function(x){return x.id===state.scenario}),turn=conversationTurns(s)[state.turn],input=document.getElementById('conversationInput');if(input){input.value=turn.replies[0];input.focus()}return}
    const audio=e.target.closest('[data-tutor-speak]');if(audio){speak(audio.dataset.tutorSpeak,undefined,audio);return}
  });

  window.LanguageDNATutor={
    render:function(){renderHomeSummary();renderDaily();renderScenarios();renderTabs()},
    open:function(tab){state.tab=tab||'daily';renderTabs();if(state.tab==='daily'){ensureDailyRecord();renderDaily()}if(state.tab==='scenarios')renderScenarios();if(state.tab==='conversation')resetConversation(state.scenario)},
    summary:tutorSummary,
    openPatternConversation:function(id){state.patternFocus=id||null;if(id)localStorage.setItem('ldna-tutor-pattern-focus-v1',JSON.stringify({id:id,at:Date.now()}));state.scenario=scenarioForPattern(id);state.tab='conversation';resetConversation(state.scenario);renderTabs()}
  };

  renderHomeSummary();renderDaily();renderScenarios();renderTabs();
})();