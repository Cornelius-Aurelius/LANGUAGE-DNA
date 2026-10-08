(() => {
  'use strict';

  const CUSTOM={
    'vowels':{
      heading:'Spanish vowels keep a clear sound',
      meaning:'In Spanish, each vowel usually keeps one clear, steady sound. The letter a is usually close to the “a” in father — an “ah” sound.',
      example:'House = casa',
      notice:'Casa sounds roughly like KAH-sah. Both a letters use the same clear “ah” sound.',
      audio:'casa',
      why:'Once you know the five vowel sounds, reading new Spanish words becomes much easier.'
    },
    'h-silent':{
      heading:'The Spanish h is silent',
      meaning:'When you see the letter h in Spanish, you normally do not pronounce it.',
      example:'hello = hola',
      notice:'Hola starts with h, but you begin with the vowel sound: roughly OH-lah.',
      audio:'hola',
      why:'This stops English spelling habits from making Spanish words harder than they are.'
    },
    'stress-default':{
      heading:'You can often predict which syllable is stressed',
      meaning:'If a Spanish word ends in a vowel, n or s, the stress is usually on the next-to-last syllable. Most other endings usually stress the last syllable.',
      example:'hotel = hotel',
      notice:'Hotel ends in l, so the final syllable is stressed: ho-TEL.',
      audio:'hotel',
      why:'This lets you make a good pronunciation guess before hearing the word.'
    },
    'accent-overrides':{
      heading:'An accent mark shows you where the stress goes',
      meaning:'A written accent such as á, é, í, ó or ú tells you which vowel belongs to the stressed syllable.',
      example:'song = canción',
      notice:'The accent on ó tells you to stress the end: can-CIÓN.',
      audio:'canción',
      why:'The accent mark is a pronunciation clue, not decoration.'
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
      heading:'Put no directly before the verb',
      meaning:'To make a simple Spanish sentence negative, put no immediately before the conjugated verb.',
      example:'I understand → entiendo · I do not understand → no entiendo',
      notice:'Spanish does not need an extra helper word like English “do”.',
      audio:'no entiendo',
      why:'One small word lets you turn many positive sentences into negatives.'
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
      heading:'Ir a + verb means “going to do something”',
      meaning:'Use a form of ir, then a, then an infinitive to talk about a near-future action.',
      example:'I am going to eat → Voy a comer',
      notice:'Voy changes with the person; comer stays in the infinitive.',
      audio:'Voy a comer',
      why:'This gives you an easy future sentence without learning a new tense first.'
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
      heading:'What you are learning',
      meaning:rule||'This is a reusable Spanish pattern.',
      example:en&&es?en+' → '+es:'',
      notice:en&&es?'The example shows the rule in a real word or sentence.':'Use the rule as a reusable sentence-building clue.',
      audio:es,
      why:input.scoreLabel||'Once you understand the pattern, you can reuse it with new words.'
    }
  }

  window.LanguageDNATeaching={build:build};
})();