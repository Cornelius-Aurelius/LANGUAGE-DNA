(() => {
  'use strict';

  const CUSTOM={
    'regular-ar':{
      heading:'Change the ending to say who!',
      meaning:'A verb is an action word. In Spanish, its ending helps tell us who does the action. Start with hablar (to speak).',
      example:'hablar → hablo = I speak',
      notice:'Take away -ar to leave habl-. Add -o for I: hablo. Add -amos for we: hablamos.',
      steps:['Start with hablar (to speak).','Remove -ar. Now you have habl-.','Add -o → hablo (I speak). Add -amos → hablamos (we speak).'],
      audio:'hablo',
      why:'Learn one verb family and you can begin making lots of sentences.',
      check:{question:'How would you say “we speak”?',choices:['hablan','hablamos','hablo'],answer:'hablamos',why:'habl- + -amos = hablamos. The ending -amos means “we” for regular -ar verbs.'},
      caution:'These endings are for regular -ar verbs in the present tense. Some common verbs are irregular.'
    },
    'regular-er':{
      heading:'Change -er to say who is doing it',
      meaning:'A verb is an action word. Regular -er verbs use a family of endings to show who does the action.',
      example:'comer → como = I eat',
      notice:'Take away -er from comer to get com-. Add -o for I: como. Add -emos for we: comemos.',
      steps:['Start with comer (to eat).','Remove -er. You have com-.','Add -o → como (I eat). Add -emos → comemos (we eat).'],
      audio:'como',
      why:'Now you can change lots of regular -er verbs without memorising every sentence separately.',
      check:{question:'How do you say “we eat”?',choices:['comemos','como','comen'],answer:'comemos',why:'com- + -emos = comemos. -emos means “we” for regular -er verbs.'},
      caution:'These are present-tense endings for regular -er verbs; some verbs change differently.'
    },
    'regular-ir':{
      heading:'Change -ir to say who is doing it',
      meaning:'A verb is an action word. In Spanish, its ending can tell us who does it. Start with vivir (to live).',
      example:'vivir → vivo = I live',
      notice:'Take off -ir to get viv-. Add -o to say I live: vivo. Add -imos to say we live: vivimos.',
      steps:['Start with vivir (to live).','Remove -ir. Now you have viv-.','Add -o → vivo (I live). Add -imos → vivimos (we live).'],
      audio:'vivo',
      why:'The same endings help with many regular -ir verbs.',
      check:{question:'How do you say “we live”?',choices:['viven','vivo','vivimos'],answer:'vivimos',why:'viv- + -imos = vivimos. The -imos ending means “we” for regular -ir verbs.'},
      caution:'This works for regular -ir verbs in the present tense; not every verb is regular.'
    },
    'vowels':{
      heading:'Meet the five Spanish vowel letters',
      meaning:'A vowel is a letter we use to make a voice sound. The five vowel letters are a, e, i, o and u. In Spanish, each usually has a simple sound: a = ah, e = eh, i = ee, o = oh and u = oo.',
      example:'casa means house',
      notice:'Say CA–sa. Hear the “ah” sound twice? Both a letters in casa sound alike. Tap Hear to listen.',
      audio:'casa',
      why:'You can use these same five sounds when you meet a new Spanish word.'
    },
    'h-silent':{
      heading:'The Spanish H is silent',
      meaning:'When you see the letter h in Spanish, you normally do not pronounce it.',
      example:'hello = hola',
      notice:'Hola starts with h, but you begin with the vowel sound: roughly OH-lah.',
      audio:'hola',
      why:'This stops English spelling habits from making Spanish words harder than they are.'
    },
    'stress-default':{
      heading:'Which part of a word sounds stronger?',
      meaning:'Words have little sound parts. We say one part more strongly. This is called stress. If a Spanish word ends in a, e, i, o, u, n or s, the part before the last is usually stronger. For most other endings, the last part is stronger.',
      example:'hotel = hotel',
      notice:'Say ho–TEL. TEL sounds stronger. Hotel ends in l, so the last part is stronger.',
      audio:'hotel',
      why:'Knowing the last letter gives you a clue about how to say a new Spanish word.',
      check:{question:'Say “doctor”: doc–tor. Which part sounds stronger?',choices:['doc (first part)','tor (last part)'],answer:'tor (last part)',why:'Doctor ends in r, so the last part sounds stronger: doc–TOR.'}
    },
    'accent-overrides':{
      heading:'What does the little line above a letter mean?',
      meaning:'Look at ó in canción. See the little line above the o? That is called an accent mark. It shows which part of the word to say a little stronger. The stronger part is called “stress”. You do not need to memorise that name yet.',
      example:'canción means song',
      notice:'Break canción into two parts: can and ción. Say can–CIÓN. Make CIÓN a little stronger. The line above ó points to that part.',
      audio:'canción',
      why:'The little line is a helpful sign for how to say the word. Try mamá: ma–MÁ. The last part is stronger.',
      check:{question:'Look at “mamá”. Which part sounds stronger?',choices:['ma (first part)','má (last part)'],answer:'má (last part)',why:'The mark above á shows that the last part sounds stronger: ma–MÁ.'}
    },
    'g-j-sounds':{
      heading:'G changes sound, while j keeps the strong breathy sound',
      meaning:'Spanish j has a strong breathy sound. G has that same sound before e or i, but a hard g sound before a, o or u.',
      example:'cat = gato',
      notice:'The g in gato is hard, like the g in “go”.',
      audio:'gato',
      why:'Knowing the next vowel helps you predict how g will sound.'
    },
    'c-z':{
      heading:'C and z can sound different by region',
      meaning:'Before e or i, Spanish c is usually an s sound in Latin America and a “th” sound in much of Spain. Z follows the same regional difference.',
      example:'cinema = cine',
      notice:'Cine can begin like SEE- in Latin America or THEE- in much of Spain.',
      audio:'cine',
      why:'Both pronunciations are normal; the important thing is recognising the regional pattern.'
    },
    'qu':{
      heading:'Qu before e or i sounds like k',
      meaning:'In Spanish que and qui, the letters qu make a k sound and the u is normally silent.',
      example:'I want = quiero',
      notice:'Quiero begins with a k sound. Do not pronounce the u as “kw”.',
      audio:'quiero',
      why:'This makes very common words such as que and quiero easier to read.'
    },
    'll-y':{
      heading:'Ll and y often share a similar sound',
      meaning:'In many Spanish accents, ll and y sound the same or very similar. The exact sound changes by region.',
      example:'I = yo',
      notice:'You may hear a y-like, j-like or softer regional sound. The spelling pattern is still useful.',
      audio:'yo',
      why:'Expecting variation makes real Spanish easier to understand.'
    },
    'enye':{
      heading:'Ñ sounds like the “ny” in canyon',
      meaning:'The letter ñ is its own Spanish letter and represents a “ny” sound.',
      example:'child = niño',
      notice:'Niño sounds roughly like NEE-nyoh.',
      audio:'niño',
      why:'Once you know ñ, many words become easy to read at sight.'
    },
    'r-rr':{
      heading:'Single r and rr are not the same sound',
      meaning:'A single r between vowels is usually a quick tap. Double rr is a stronger rolled or trilled sound.',
      example:'but = pero · dog = perro',
      notice:'The stronger rr can change the meaning of the word.',
      audio:'perro',
      why:'This is one of the Spanish sound differences that can affect meaning.'
    },
    'b-v':{
      heading:'Spanish b and v belong to the same sound system',
      meaning:'Spanish does not normally contrast b and v the way English does. Their exact sound changes with position, but learners should not force an English v sound.',
      example:'wine = vino',
      notice:'Vino does not need an English-style “v” sound.',
      audio:'vino',
      why:'Treating b and v as one Spanish sound family removes a common English-speaker trap.'
    },
    'subject-drop':{
      heading:'Spanish often does not need words like I, you or we',
      meaning:'The ending of the verb often already tells you who is doing the action, so the subject pronoun can be left out when the meaning is clear.',
      example:'I speak → hablo',
      notice:'Habla and hablo carry information about who is speaking, so Spanish can often be shorter than English.',
      audio:'hablo',
      why:'This helps Spanish sentences feel natural instead of translated word-for-word from English.'
    },
    'no-before-verb':{
      heading:'Make a Spanish sentence negative with one little word',
      meaning:'To say you do not do something in Spanish, put no just before the action word.',
      example:'I understand → entiendo · I do not understand → no entiendo',
      notice:'Spanish does not need an extra helper word like English “do”.',
      audio:'no entiendo',
      why:'One small word lets you turn many positive sentences into negatives.',
      steps:['Start with entiendo (I understand).','Put no right before the action: no entiendo.','Now say: No entiendo (I do not understand).'],
      check:{question:'How do you say “I do not understand”?',choices:['entiendo no','no entiendo','no entiendo yo no'],answer:'no entiendo',why:'Put no before entiendo. Together, no entiendo means “I do not understand”.'}
    },
    'question-words':{
      heading:'Five question words unlock everyday conversations',
      meaning:'Quién, qué, dónde, por qué and cuándo give you the core ideas WHO, WHAT, WHERE, WHY and WHEN.',
      example:'Where? → ¿Dónde?',
      notice:'Learn these as useful question starters, not as isolated vocabulary.',
      audio:'¿Dónde?',
      why:'They let you ask for the information you actually need.'
    },
    'question-order':{
      heading:'Spanish questions usually do not need English “do” or “does”',
      meaning:'A normal Spanish verb can become a question through question words, punctuation and intonation.',
      example:'Do you speak Spanish? → ¿Hablas español?',
      notice:'There is no extra word for English “do”.',
      audio:'¿Hablas español?',
      why:'Dropping the English helper verb makes questions much simpler.'
    },
    'hay':{
      heading:'Hay means both “there is” and “there are”',
      meaning:'Use hay when you want to say that something exists or is present.',
      example:'There is a problem → Hay un problema',
      notice:'The same word hay works for singular and plural.',
      audio:'Hay un problema',
      why:'It is one of the fastest ways to build useful location and existence sentences.'
    },
    'estar-location':{
      heading:'Use estar to say where someone or something is',
      meaning:'When the main idea is location, Spanish commonly uses a form of estar.',
      example:'I am here → Estoy aquí',
      notice:'This is different from ser, which is used for identity and classification.',
      audio:'Estoy aquí',
      why:'It gives you a reusable frame for places, travel and directions.'
    },
    'ir-a':{
      heading:'Say what you are going to do',
      meaning:'Ir is the Spanish word for “to go”. To say “I am going to…”, Spanish uses voy a. Voy means “I go” and a means “to”. Add an action word such as comer (eat): voy a comer = I am going to eat.',
      example:'I am going to eat → Voy a comer',
      notice:'Say it in three pieces: voy (I go) + a (to) + comer (eat). Together, voy a comer means “I am going to eat”. For “we”, say vamos a comer.',
      audio:'Voy a comer',
      why:'You can use voy a with more action words: voy a estudiar = I am going to study.',
      steps:['Ir means to go. When you say “I go”, use voy.','Add a after voy: voy a = I am going to…','Add what you will do: comer (eat) → voy a comer (I am going to eat).'],
      check:{question:'How do you say “I am going to study”?',choices:['voy a estudiar','voy estudiar','estudiar voy'],answer:'voy a estudiar',why:'Start with voy a (I am going to), then add estudiar (study): voy a estudiar.'}
    },
    'tener-que':{
      heading:'Tener que + verb means “have to do something”',
      meaning:'Use a form of tener, then que, then an infinitive to express obligation.',
      example:'I have to work → Tengo que trabajar',
      notice:'Tengo changes with the person; trabajar stays in the infinitive.',
      audio:'Tengo que trabajar',
      why:'It is an extremely useful everyday sentence frame.'
    },
    'gustar':{
      heading:'Spanish builds “I like…” differently from English',
      meaning:'Spanish commonly uses me gusta for one thing or an action, and me gustan for plural things.',
      example:'I like coffee → Me gusta el café',
      notice:'Do not translate English “I like” word by word.',
      audio:'Me gusta el café',
      why:'Learning the whole frame avoids one of the most common beginner mistakes.'
    },
    'ser-identity':{
      heading:'Use ser for identity and classification',
      meaning:'Ser is commonly used for who someone is, where they are from, their profession, nationality or what something is.',
      example:'I am a student → Soy estudiante',
      notice:'This is different from estar, which handles many locations and temporary states.',
      audio:'Soy estudiante',
      why:'Ser is one of the central building blocks of Spanish sentences.'
    }
  };

  function cleanEnding(part){return String(part||'').replace(/[–—]/g,'-').trim()}
  function firstPair(input){
    const list=input.examples||input.words||[];
    if(!list.length)return['',''];
    return [String(list[0][0]||''),String(list[0][1]||'')]
  }
  function build(input){
    input=input||{};
    const id=String(input.id||''),custom=CUSTOM[id];
    if(custom)return Object.assign({id:id,type:input.type||'teaching'},custom);

    const title=String(input.title||id),rule=String(input.rule||input.explanation||'').trim(),pair=firstPair(input),en=pair[0],es=pair[1];
    const parts=title.split('→').map(cleanEnding);
    const isTransform=parts.length===2&&parts[0]&&parts[1];
    const type=String(input.type||''),tags=Array.isArray(input.tags)?input.tags:[];

    if(isTransform&&(type==='visual'||tags.includes('cognates')||input.words)){
      return{
        id:id,type:'word',
        heading:'Turn an English word into a Spanish clue',
        meaning:'When an English word ends in '+parts[0]+', a related Spanish word often uses '+parts[1]+' instead.',
        example:en&&es?en+' → '+es:'',
        notice:en&&es?'Notice how the ending changes while much of the word stays familiar.':'Look for the ending change rather than memorising the whole word from scratch.',
        audio:es,
        why:'This helps you recognise Spanish vocabulary you partly know already.',
        caution:'It is a strong clue, not a rule that works for every English word.'
      }
    }

    if(type==='sound'||tags.includes('pronunciation')){
      return{
        id:id,type:'sound',
        heading:'What this sound pattern means',
        meaning:rule||'This pattern helps you predict how a Spanish spelling is pronounced.',
        example:en&&es?en+' — '+es:'',
        notice:'Listen to the example, then look for the same spelling pattern in new words.',
        audio:en,
        why:'The goal is to connect the written pattern directly to the sound.'
      }
    }

    return{
      id:id,type:'structure',
      heading:'One small rule you can reuse',
      meaning:rule||'This is a reusable Spanish pattern.',
      example:en&&es?en+' → '+es:'',
      notice:en&&es?'Start with the English meaning. Read the Spanish aloud. See which part does the work.':'Look for the same idea in a new sentence.',
      audio:es,
      why:input.scoreLabel||'Once you understand the pattern, you can reuse it with new words.'
    }
  }

  window.LanguageDNATeaching={build:build};
})();