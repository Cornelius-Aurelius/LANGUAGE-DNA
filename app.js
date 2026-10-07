(() => {
  'use strict';

  const patterns = [
    {id:'tion-cion', rank:1, type:'visual', importance:'essential', power:98, tags:['cognates','sentence'], lenses:['WHAT'], title:'-tion → -ción', rule:'Many English nouns ending in -tion map to Spanish -ción.', note:'A powerful recognition pattern, but treat it as a strong tendency rather than a universal rule.', examples:[['information','información'],['nation','nación'],['celebration','celebración']], practice:{prompt:'information', answers:['información'], hearing:['information','información'], wrong:'informatión'}, scoreLabel:'Hundreds of recognizable words'},
    {id:'ity-idad', rank:2, type:'visual', importance:'essential', power:96, tags:['cognates'], lenses:['WHAT'], title:'-ity → -idad', rule:'Many English -ity nouns correspond to Spanish -idad.', examples:[['activity','actividad'],['university','universidad'],['possibility','posibilidad']], practice:{prompt:'activity', answers:['actividad'], hearing:['activity','actividad'], wrong:'activitá'}, scoreLabel:'High-value cognate family'},
    {id:'ous-oso', rank:3, type:'visual', importance:'high', power:90, tags:['cognates'], lenses:['WHAT','WHO'], title:'-ous → -oso / -osa', rule:'Many English adjectives ending -ous map to Spanish -oso/-osa.', examples:[['famous','famoso'],['curious','curioso'],['nervous','nervioso']], practice:{prompt:'famous (masculine)', answers:['famoso'], hearing:['famous','famoso'], wrong:'famouso'}, scoreLabel:'Fast adjective recognition'},
    {id:'ly-mente', rank:4, type:'visual', importance:'high', power:89, tags:['cognates'], lenses:['WHAT'], title:'-ly → -mente', rule:'Many adverbs are formed with -mente, often from the feminine adjective form.', examples:[['rapidly','rápidamente'],['normally','normalmente'],['exactly','exactamente']], practice:{prompt:'normally', answers:['normalmente'], hearing:['normally','normalmente'], wrong:'normalmenteo'}, scoreLabel:'Productive adverb pattern'},
    {id:'h-silent', rank:5, type:'sound', importance:'essential', power:97, tags:['pronunciation'], lenses:['WHAT','WHO'], title:'H is silent', rule:'In standard Spanish, the letter h is not pronounced.', examples:[['hola','OH-la'],['hotel','oh-TEL'],['ahora','a-O-ra']], practice:{prompt:'Which word begins with a silent letter?', answers:['hola'], hearing:['hello','hola'], wrong:'jola'}, scoreLabel:'Immediate pronunciation win'},
    {id:'vowels', rank:6, type:'sound', importance:'essential', power:99, tags:['pronunciation'], lenses:['WHAT','WHO','WHERE','WHY','WHEN'], title:'5 stable vowels', rule:'Spanish vowels are relatively stable: a, e, i, o, u keep consistent core sounds.', examples:[['casa','a ≈ ah'],['mesa','e ≈ eh'],['vino','i ≈ ee']], practice:{prompt:'Which Spanish vowel usually sounds closest to “ee”?', answers:['i'], hearing:['vino','wine'], wrong:'e'}, scoreLabel:'Foundation for every spoken word'},
    {id:'stress-default', rank:7, type:'sound', importance:'essential', power:95, tags:['pronunciation'], lenses:['WHAT','WHO','WHERE','WHY','WHEN'], title:'Default stress rule', rule:'Words ending in a vowel, n or s usually stress the next-to-last syllable; most others stress the last.', examples:[['casa','CA-sa'],['hablan','HA-blan'],['hotel','ho-TEL']], practice:{prompt:'Where is the stress in “hotel”?', answers:['last','final'], hearing:['hotel','hotel'], wrong:'first'}, scoreLabel:'Predict pronunciation before hearing'},
    {id:'accent-overrides', rank:8, type:'sound', importance:'essential', power:94, tags:['pronunciation'], lenses:['WHAT','WHO','WHERE','WHY','WHEN'], title:'Accent mark = stress signal', rule:'A written accent normally marks the stressed syllable when it departs from the default stress pattern.', examples:[['teléfono','LÉ'],['canción','CIÓN'],['rápido','RÁ']], practice:{prompt:'Which syllable is stressed in “canción”?', answers:['ción','cion'], hearing:['canción','song'], wrong:'can'}, scoreLabel:'Read stress visually'},
    {id:'subject-drop', rank:9, type:'writing', importance:'essential', power:99, tags:['verbs','sentence'], lenses:['WHO'], title:'Spanish often drops the subject', rule:'Verb endings often show who is acting, so yo/tú/él etc. can be omitted when context is clear.', examples:[['I speak','(Yo) hablo'],['We eat','(Nosotros) comemos'],['They live','(Ellos) viven']], practice:{prompt:'I speak', answers:['hablo','yo hablo'], hearing:['hablo','I speak'], wrong:'yo habla'}, scoreLabel:'Core sentence compression'},
    {id:'no-before-verb', rank:10, type:'writing', importance:'essential', power:97, tags:['sentence','verbs'], lenses:['WHAT'], title:'no + verb', rule:'To make a basic negative sentence, place no directly before the conjugated verb.', examples:[['I understand','entiendo'],['I do not understand','no entiendo'],['We do not know','no sabemos']], practice:{prompt:'I do not understand', answers:['no entiendo'], hearing:['no entiendo','I do not understand'], wrong:'entiendo no'}, scoreLabel:'Instant negatives'},
    {id:'question-words', rank:11, type:'writing', importance:'essential', power:99, tags:['questions','sentence'], lenses:['WHO','WHAT','WHERE','WHY','WHEN'], title:'5 question anchors', rule:'Quién, qué, dónde, por qué and cuándo map directly onto WHO, WHAT, WHERE, WHY and WHEN.', examples:[['Who?','¿Quién?'],['Where?','¿Dónde?'],['When?','¿Cuándo?']], practice:{prompt:'Where?', answers:['dónde','¿dónde?','donde'], hearing:['¿dónde?','where?'], wrong:'¿quién?'}, scoreLabel:'Unlocks information-seeking'},
    {id:'hay', rank:12, type:'writing', importance:'essential', power:96, tags:['sentence'], lenses:['WHAT','WHERE'], title:'hay = there is / there are', rule:'Use hay for existence: “there is” and “there are” use the same word.', examples:[['There is a problem','Hay un problema'],['There are two cafés','Hay dos cafés'],['Is there water?','¿Hay agua?']], practice:{prompt:'There is a problem', answers:['hay un problema'], hearing:['hay un problema','there is a problem'], wrong:'está un problema'}, scoreLabel:'High-frequency location/existence frame'},
    {id:'estar-location', rank:13, type:'writing', importance:'essential', power:95, tags:['sentence','verbs'], lenses:['WHERE'], title:'estar for location', rule:'Use estar to say where a person or thing is located.', examples:[['I am here','Estoy aquí'],['Madrid is in Spain','Madrid está en España'],['Where are you?','¿Dónde estás?']], practice:{prompt:'I am here', answers:['estoy aquí','estoy aqui'], hearing:['estoy aquí','I am here'], wrong:'soy aquí'}, scoreLabel:'Core WHERE pattern'},
    {id:'ir-a', rank:14, type:'writing', importance:'essential', power:97, tags:['verbs','sentence'], lenses:['WHAT','WHERE','WHEN'], title:'ir a + infinitive', rule:'Use ir + a + infinitive for “going to do” and ir + a + place for movement toward a place.', examples:[['I am going to eat','Voy a comer'],['We are going to study','Vamos a estudiar'],['I go to Madrid','Voy a Madrid']], practice:{prompt:'I am going to eat', answers:['voy a comer'], hearing:['voy a comer','I am going to eat'], wrong:'voy comer'}, scoreLabel:'Future + movement in one frame'},
    {id:'tener-que', rank:15, type:'writing', importance:'essential', power:96, tags:['verbs','sentence'], lenses:['WHAT','WHY'], title:'tener que + infinitive', rule:'Use tener que + infinitive to express “have to / must do”.', examples:[['I have to work','Tengo que trabajar'],['We have to go','Tenemos que ir'],['Do you have to study?','¿Tienes que estudiar?']], practice:{prompt:'I have to work', answers:['tengo que trabajar'], hearing:['tengo que trabajar','I have to work'], wrong:'tengo trabajar'}, scoreLabel:'Everyday obligation frame'},
    {id:'porque', rank:16, type:'writing', importance:'essential', power:97, tags:['questions','sentence'], lenses:['WHY'], title:'por qué ↔ porque', rule:'Por qué asks “why?”; porque gives “because”.', examples:[['Why?','¿Por qué?'],['Because I am tired','Porque estoy cansado'],['Why are you here?','¿Por qué estás aquí?']], practice:{prompt:'Because I am tired', answers:['porque estoy cansado','porque estoy cansada'], hearing:['porque estoy cansado','because I am tired'], wrong:'por qué estoy cansado'}, scoreLabel:'Core reason pattern'},
    {id:'para-purpose', rank:17, type:'writing', importance:'essential', power:94, tags:['sentence'], lenses:['WHY','WHAT'], title:'para + infinitive = in order to', rule:'Use para + infinitive to express purpose: “in order to do”.', examples:[['to learn','para aprender'],['I study to improve','Estudio para mejorar'],['for eating','para comer']], practice:{prompt:'I study to improve', answers:['estudio para mejorar'], hearing:['estudio para mejorar','I study to improve'], wrong:'estudio por mejorar'}, scoreLabel:'Simple purpose builder'},
    {id:'adjective-after', rank:18, type:'writing', importance:'essential', power:92, tags:['sentence'], lenses:['WHAT','WHO'], title:'noun + adjective', rule:'Many descriptive adjectives commonly come after the noun in Spanish.', examples:[['a red car','un coche rojo'],['a big house','una casa grande'],['an interesting book','un libro interesante']], practice:{prompt:'a red car', answers:['un coche rojo','un carro rojo'], hearing:['un coche rojo','a red car'], wrong:'un rojo coche'}, scoreLabel:'High-frequency word-order pattern'},
    {id:'agreement', rank:19, type:'writing', importance:'essential', power:93, tags:['sentence'], lenses:['WHAT','WHO'], title:'gender & number agreement', rule:'Many adjectives change to agree with the noun in gender and number.', examples:[['red car','coche rojo'],['red house','casa roja'],['red houses','casas rojas']], practice:{prompt:'red houses', answers:['casas rojas'], hearing:['casas rojas','red houses'], wrong:'casas rojo'}, scoreLabel:'Grammar that repeats everywhere'},
    {id:'regular-ar', rank:20, type:'writing', importance:'essential', power:98, tags:['verbs'], lenses:['WHO','WHAT','WHEN'], title:'Present -AR verb endings', rule:'For regular -ar verbs: -o, -as, -a, -amos, -áis, -an.', examples:[['I speak','hablo'],['you speak','hablas'],['we speak','hablamos']], practice:{prompt:'we speak', answers:['hablamos'], hearing:['hablamos','we speak'], wrong:'hablan'}, scoreLabel:'Huge verb family'},
    {id:'regular-er', rank:21, type:'writing', importance:'high', power:92, tags:['verbs'], lenses:['WHO','WHAT','WHEN'], title:'Present -ER verb endings', rule:'For regular -er verbs: -o, -es, -e, -emos, -éis, -en.', examples:[['I eat','como'],['you eat','comes'],['we eat','comemos']], practice:{prompt:'we eat', answers:['comemos'], hearing:['comemos','we eat'], wrong:'comimos'}, scoreLabel:'Core present-tense family'},
    {id:'regular-ir', rank:22, type:'writing', importance:'high', power:91, tags:['verbs'], lenses:['WHO','WHAT','WHEN'], title:'Present -IR verb endings', rule:'For regular -ir verbs: -o, -es, -e, -imos, -ís, -en.', examples:[['I live','vivo'],['you live','vives'],['we live','vivimos']], practice:{prompt:'we live', answers:['vivimos'], hearing:['vivimos','we live'], wrong:'vivemos'}, scoreLabel:'Core present-tense family'},
    {id:'gustar', rank:23, type:'writing', importance:'high', power:95, tags:['verbs','sentence'], lenses:['WHO','WHAT'], title:'me gusta / me gustan', rule:'Spanish frames liking as “it is pleasing to me”: me gusta + singular/verb, me gustan + plural.', examples:[['I like coffee','Me gusta el café'],['I like books','Me gustan los libros'],['I like to travel','Me gusta viajar']], practice:{prompt:'I like books', answers:['me gustan los libros'], hearing:['me gustan los libros','I like books'], wrong:'me gusta los libros'}, scoreLabel:'Very common but structurally different'},
    {id:'al-del', rank:24, type:'visual', importance:'high', power:88, tags:['sentence'], lenses:['WHERE','WHAT'], title:'a + el = al · de + el = del', rule:'The combinations a + el and de + el contract to al and del.', examples:[['to the market','al mercado'],['from the hotel','del hotel'],['I go to the park','Voy al parque']], practice:{prompt:'to the market', answers:['al mercado'], hearing:['al mercado','to the market'], wrong:'a el mercado'}, scoreLabel:'Frequent contraction pattern'},
    {id:'personal-a', rank:25, type:'writing', importance:'high', power:87, tags:['sentence'], lenses:['WHO'], title:'personal a', rule:'A specific person as a direct object is commonly introduced with a.', examples:[['I see María','Veo a María'],['I know Juan','Conozco a Juan'],['I call my friend','Llamo a mi amigo']], practice:{prompt:'I see María', answers:['veo a maría','veo a maria'], hearing:['veo a María','I see María'], wrong:'veo María'}, scoreLabel:'Core WHO structure'},
    {id:'g-j-sounds', rank:26, type:'sound', importance:'high', power:92, tags:['pronunciation'], lenses:['WHAT'], title:'g / j sound pattern', rule:'J is a strong breathy sound; g before e/i is similar, while g before a/o/u is hard as in “go”.', examples:[['jamón','strong j'],['gente','strong g'],['gato','hard g']], practice:{prompt:'Which word has the hard g sound?', answers:['gato'], hearing:['gato','cat'], wrong:'gente'}, scoreLabel:'Predict common consonant sounds'},
    {id:'c-z', rank:27, type:'sound', importance:'high', power:88, tags:['pronunciation'], lenses:['WHAT'], title:'c / z regional pattern', rule:'Before e/i, c is usually /s/ in Latin America and much of the Spanish-speaking world, and /θ/ in much of Spain; z follows the same regional contrast.', examples:[['cine','SEE-neh / THEE-neh'],['cero','SEH-ro / THEH-ro'],['zapato','sa-PA-to / tha-PA-to']], practice:{prompt:'In much of Latin America, “c” before e/i sounds like…', answers:['s','s sound'], hearing:['cine','cinema'], wrong:'k'}, scoreLabel:'Listening across regions'},
    {id:'qu', rank:28, type:'sound', importance:'high', power:90, tags:['pronunciation'], lenses:['WHAT'], title:'qu + e/i = k', rule:'In que/qui, qu represents a k sound and the u is normally silent.', examples:[['que','keh'],['quiero','KYE-ro'],['aquí','a-KEE']], practice:{prompt:'How does “qu” sound in “que”?', answers:['k','k sound'], hearing:['quiero','I want'], wrong:'kw'}, scoreLabel:'Frequent sound-spelling shortcut'},
    {id:'ll-y', rank:29, type:'sound', importance:'useful', power:84, tags:['pronunciation'], lenses:['WHAT'], title:'ll / y often converge', rule:'In many dialects, ll and y are pronounced alike or very similarly, though the exact sound varies by region.', examples:[['yo','y/j-like by region'],['llamo','y/j-like by region'],['calle','regionally variable']], practice:{prompt:'Which two spellings often share a sound in many dialects?', answers:['ll and y','y and ll','ll/y'], hearing:['yo','I'], wrong:'rr and h'}, scoreLabel:'Dialect-aware listening'},
    {id:'enye', rank:30, type:'sound', importance:'high', power:89, tags:['pronunciation'], lenses:['WHAT'], title:'ñ = “ny” sound', rule:'Ñ represents a palatal nasal similar to the “ny” in canyon.', examples:[['niño','NEE-nyo'],['mañana','ma-NYA-na'],['español','es-pa-NYOL']], practice:{prompt:'Which spelling gives the “ny” sound?', answers:['ñ','ñ'], hearing:['mañana','tomorrow'], wrong:'n'}, scoreLabel:'Instant reading/pronunciation link'},
    {id:'r-rr', rank:31, type:'sound', importance:'high', power:89, tags:['pronunciation'], lenses:['WHAT'], title:'r vs rr', rule:'Single r between vowels is usually a tap; rr is a stronger trill. Word-initial r is also strong.', examples:[['pero','tap r'],['perro','strong rr'],['rojo','strong initial r']], practice:{prompt:'Which word has the stronger r?', answers:['perro'], hearing:['perro','dog'], wrong:'pero'}, scoreLabel:'Meaning can depend on the sound'},
    {id:'b-v', rank:32, type:'sound', importance:'useful', power:82, tags:['pronunciation'], lenses:['WHAT'], title:'b and v largely share a sound system', rule:'In standard Spanish, b and v do not form an English-like sound contrast; pronunciation varies by position.', examples:[['vino','b/v family'],['beber','b/v family'],['vivir','b/v family']], practice:{prompt:'Do b and v contrast like English “boat” vs “vote” in standard Spanish?', answers:['no'], hearing:['vivir','to live'], wrong:'yes'}, scoreLabel:'Removes an English-speaking trap'},
    {id:'plural', rank:33, type:'visual', importance:'high', power:91, tags:['sentence'], lenses:['WHAT','WHO'], title:'plural: -s / -es', rule:'Nouns ending in an unstressed vowel usually add -s; many ending in a consonant add -es.', examples:[['casa','casas'],['hotel','hoteles'],['doctor','doctores']], practice:{prompt:'hotel → plural', answers:['hoteles'], hearing:['hoteles','hotels'], wrong:'hotels'}, scoreLabel:'Simple reusable noun pattern'},
    {id:'gender-o-a', rank:34, type:'visual', importance:'high', power:86, tags:['sentence'], lenses:['WHAT','WHO'], title:'-o / -a gender tendency', rule:'Many nouns/adjectives ending -o are masculine and many ending -a are feminine — useful as a tendency, not a guarantee.', examples:[['libro rojo','masculine pattern'],['casa roja','feminine pattern'],['amigo / amiga','paired forms']], practice:{prompt:'Complete: casa roj__', answers:['a'], hearing:['casa roja','red house'], wrong:'o'}, scoreLabel:'Fast agreement clue'},
    {id:'inverted-punct', rank:35, type:'visual', importance:'useful', power:80, tags:['questions'], lenses:['WHO','WHAT','WHERE','WHY','WHEN'], title:'¿ ? and ¡ ! frame the sentence', rule:'Spanish uses opening and closing question/exclamation marks.', examples:[['Where?','¿Dónde?'],['What a surprise!','¡Qué sorpresa!'],['Why not?','¿Por qué no?']], practice:{prompt:'Write Spanish punctuation around: Dónde estás', answers:['¿dónde estás?','¿donde estas?'], hearing:['¿dónde estás?','where are you?'], wrong:'Dónde estás?'}, scoreLabel:'Visual cue for sentence type'},
    {id:'question-order', rank:36, type:'writing', importance:'high', power:90, tags:['questions','sentence'], lenses:['WHO','WHAT','WHERE','WHY','WHEN'], title:'Questions often need no “do”', rule:'Spanish does not use English do/does support. A statement can become a question through intonation/punctuation or question words.', examples:[['Do you speak Spanish?','¿Hablas español?'],['Do you eat meat?','¿Comes carne?'],['Where do you live?','¿Dónde vives?']], practice:{prompt:'Do you speak Spanish?', answers:['¿hablas español?','hablas español','hablas espanol'], hearing:['¿hablas español?','do you speak Spanish?'], wrong:'¿haces hablar español?'}, scoreLabel:'Removes English helper verbs'},
    {id:'tengo-anos', rank:37, type:'writing', importance:'high', power:89, tags:['sentence'], lenses:['WHO','WHEN'], title:'tener + años for age', rule:'Spanish expresses age with tener (“to have”), not ser/estar.', examples:[['I am 20 years old','Tengo 20 años'],['How old are you?','¿Cuántos años tienes?'],['She is 30','Tiene 30 años']], practice:{prompt:'I am 20 years old', answers:['tengo 20 años','tengo veinte años','tengo 20 anos'], hearing:['tengo veinte años','I am twenty years old'], wrong:'soy 20 años'}, scoreLabel:'Common English → Spanish structural switch'},
    {id:'hace-weather', rank:38, type:'writing', importance:'useful', power:82, tags:['sentence'], lenses:['WHAT','WHEN'], title:'hace + weather', rule:'Many weather expressions use hacer: hace calor, hace frío, hace viento.', examples:[['It is hot','Hace calor'],['It is cold','Hace frío'],['It is windy','Hace viento']], practice:{prompt:'It is cold', answers:['hace frío','hace frio'], hearing:['hace frío','it is cold'], wrong:'está frío'}, scoreLabel:'Reusable weather frame'},
    {id:'estar-gerund', rank:39, type:'writing', importance:'high', power:87, tags:['verbs','sentence'], lenses:['WHAT','WHEN'], title:'estar + -ando / -iendo', rule:'Use estar + gerund for an action in progress: “am/is/are doing”.', examples:[['I am speaking','Estoy hablando'],['We are eating','Estamos comiendo'],['She is living','Está viviendo']], practice:{prompt:'I am speaking', answers:['estoy hablando'], hearing:['estoy hablando','I am speaking'], wrong:'soy hablando'}, scoreLabel:'Present-in-progress pattern'},
    {id:'reflexive', rank:40, type:'writing', importance:'high', power:86, tags:['verbs','sentence'], lenses:['WHO','WHAT'], title:'me / te / se + reflexive verb', rule:'Reflexive actions use pronouns such as me, te, se, nos before the conjugated verb.', examples:[['I get up','Me levanto'],['You call yourself…','Te llamas…'],['She gets dressed','Se viste']], practice:{prompt:'I get up', answers:['me levanto'], hearing:['me levanto','I get up'], wrong:'levanto me'}, scoreLabel:'Huge everyday verb family'},
    {id:'more-than', rank:41, type:'writing', importance:'high', power:85, tags:['sentence'], lenses:['WHAT','WHO'], title:'más … que', rule:'Use más + adjective/adverb/noun + que for “more … than”.', examples:[['more important than','más importante que'],['bigger than','más grande que'],['I have more than you','Tengo más que tú']], practice:{prompt:'more important than', answers:['más importante que','mas importante que'], hearing:['más importante que','more important than'], wrong:'más importante de'}, scoreLabel:'Simple comparison engine'},
    {id:'muy-mucho', rank:42, type:'writing', importance:'high', power:88, tags:['sentence'], lenses:['WHAT'], title:'muy vs mucho', rule:'Muy usually modifies adjectives/adverbs; mucho changes with nouns or can modify verbs.', examples:[['very good','muy bueno'],['a lot of water','mucha agua'],['I work a lot','Trabajo mucho']], practice:{prompt:'very good', answers:['muy bueno','muy buena'], hearing:['muy bueno','very good'], wrong:'mucho bueno'}, scoreLabel:'Frequent quantity distinction'},
    {id:'direct-object', rank:43, type:'writing', importance:'useful', power:82, tags:['sentence'], lenses:['WHO','WHAT'], title:'lo / la / los / las before the verb', rule:'Direct-object pronouns usually go before a conjugated verb.', examples:[['I see it (m.)','Lo veo'],['I know her','La conozco'],['I buy them (f.)','Las compro']], practice:{prompt:'I see it (masculine)', answers:['lo veo'], hearing:['lo veo','I see it'], wrong:'veo lo'}, scoreLabel:'Common pronoun placement'},
    {id:'desde-hace', rank:44, type:'writing', importance:'useful', power:81, tags:['sentence'], lenses:['WHEN'], title:'desde hace + duration', rule:'Use desde hace + duration for an action/state that started in the past and continues now.', examples:[['for two years','desde hace dos años'],['I have lived here for a year','Vivo aquí desde hace un año'],['for a long time','desde hace mucho tiempo']], practice:{prompt:'for two years', answers:['desde hace dos años','desde hace dos anos'], hearing:['desde hace dos años','for two years'], wrong:'por dos años'}, scoreLabel:'High-value time frame'},
    {id:'ya-todavia', rank:45, type:'writing', importance:'useful', power:83, tags:['sentence'], lenses:['WHEN'], title:'ya / todavía', rule:'Ya often means already/now; todavía often means still/yet. Together they handle many time-state contrasts.', examples:[['I already know','Ya sé'],['I still live here','Todavía vivo aquí'],['Not yet','Todavía no']], practice:{prompt:'Not yet', answers:['todavía no','todavia no','aún no','aun no'], hearing:['todavía no','not yet'], wrong:'ya no'}, scoreLabel:'Everyday timing words'},
    {id:'acabar-de', rank:46, type:'writing', importance:'useful', power:84, tags:['verbs','sentence'], lenses:['WHAT','WHEN'], title:'acabar de + infinitive', rule:'Use acabar de + infinitive for “to have just done something”.', examples:[['I just arrived','Acabo de llegar'],['We just ate','Acabamos de comer'],['She just left','Acaba de salir']], practice:{prompt:'I just arrived', answers:['acabo de llegar'], hearing:['acabo de llegar','I just arrived'], wrong:'acabo llegar'}, scoreLabel:'Compact recent-past frame'},
    {id:'se-impersonal', rank:47, type:'writing', importance:'useful', power:79, tags:['sentence'], lenses:['WHO','WHAT'], title:'se for general / impersonal statements', rule:'Se can express general or impersonal meanings similar to “people/one/you” or passive-like English.', examples:[['Spanish is spoken here','Se habla español aquí'],['How do you say…?','¿Cómo se dice…?'],['Cars are sold','Se venden coches']], practice:{prompt:'How do you say…?', answers:['¿cómo se dice?','como se dice','¿como se dice?'], hearing:['¿cómo se dice?','how do you say?'], wrong:'¿cómo tú dices?'}, scoreLabel:'Native-like general statements'},
    {id:'ph-f', rank:48, type:'visual', importance:'useful', power:76, tags:['cognates','pronunciation'], lenses:['WHAT'], title:'ph → f in many learned cognates', rule:'English ph often appears as f in Spanish cognates of Greek/Latin origin.', examples:[['photo','foto'],['philosophy','filosofía'],['telephone','teléfono']], practice:{prompt:'photo', answers:['foto'], hearing:['foto','photo'], wrong:'photo'}, scoreLabel:'Quick spelling recognition'},
    {id:'ic-ico', rank:49, type:'visual', importance:'useful', power:78, tags:['cognates'], lenses:['WHAT'], title:'-ic → -ico / -ica', rule:'Many English adjectives/nouns ending -ic correspond to Spanish -ico/-ica.', examples:[['basic','básico'],['public','público'],['automatic','automático']], practice:{prompt:'basic (masculine)', answers:['básico','basico'], hearing:['básico','basic'], wrong:'basic'}, scoreLabel:'Large cognate family'},
    {id:'ist-ista', rank:50, type:'visual', importance:'useful', power:77, tags:['cognates'], lenses:['WHO'], title:'-ist → -ista', rule:'Many professions and identity nouns ending -ist map directly to -ista.', examples:[['artist','artista'],['tourist','turista'],['pianist','pianista']], practice:{prompt:'artist', answers:['artista'], hearing:['artista','artist'], wrong:'artisto'}, scoreLabel:'WHO vocabulary shortcut'},
    {id:'ance-encia', rank:51, type:'visual', importance:'useful', power:74, tags:['cognates'], lenses:['WHAT'], title:'-ance / -ence → -ancia / -encia', rule:'Many abstract English nouns map predictably to Spanish -ancia/-encia.', examples:[['importance','importancia'],['difference','diferencia'],['experience','experiencia']], practice:{prompt:'difference', answers:['diferencia'], hearing:['diferencia','difference'], wrong:'differencia'}, scoreLabel:'Recognition booster'},
    {id:'ive-ivo', rank:52, type:'visual', importance:'useful', power:75, tags:['cognates'], lenses:['WHAT'], title:'-ive → -ivo / -iva', rule:'Many English -ive adjectives/nouns correspond to Spanish -ivo/-iva.', examples:[['active','activo'],['creative','creativo'],['positive','positivo']], practice:{prompt:'active (masculine)', answers:['activo'], hearing:['activo','active'], wrong:'activeo'}, scoreLabel:'Productive cognate family'},
    {id:'months-lowercase', rank:53, type:'visual', importance:'useful', power:69, tags:['sentence'], lenses:['WHEN'], title:'months & weekdays stay lowercase', rule:'Spanish normally writes months and weekdays with lowercase initial letters.', examples:[['Monday','lunes'],['October','octubre'],['January','enero']], practice:{prompt:'October', answers:['octubre'], hearing:['octubre','October'], wrong:'Octubre'}, scoreLabel:'Clean writing habit'},
    {id:'a-en-de', rank:54, type:'writing', importance:'high', power:91, tags:['sentence'], lenses:['WHERE'], title:'a · en · de = to/at/from-of', rule:'A core location trio: a often marks destination, en location, de origin/possession.', examples:[['to Madrid','a Madrid'],['in Madrid','en Madrid'],['from Madrid','de Madrid']], practice:{prompt:'in Madrid', answers:['en madrid'], hearing:['en Madrid','in Madrid'], wrong:'a Madrid'}, scoreLabel:'Core WHERE toolkit'},
    {id:'aqui-alli', rank:55, type:'writing', importance:'high', power:84, tags:['sentence'], lenses:['WHERE'], title:'aquí / ahí / allí', rule:'Spanish commonly distinguishes here, there-near-you, and there-farther-away.', examples:[['here','aquí'],['there (near you)','ahí'],['there (farther)','allí']], practice:{prompt:'here', answers:['aquí','aqui'], hearing:['aquí','here'], wrong:'allí'}, scoreLabel:'Fast location vocabulary'},
    {id:'si-if', rank:56, type:'writing', importance:'high', power:87, tags:['sentence'], lenses:['WHY','WHEN'], title:'si + condition', rule:'Si means “if” and introduces conditions. Do not confuse it with sí (“yes”).', examples:[['If I can…','Si puedo…'],['If you want…','Si quieres…'],['Yes','Sí']], practice:{prompt:'If you want…', answers:['si quieres'], hearing:['si quieres','if you want'], wrong:'sí quieres'}, scoreLabel:'Core conditional connector'},
    {id:'cuando-present', rank:57, type:'writing', importance:'useful', power:78, tags:['sentence'], lenses:['WHEN'], title:'cuando + time clause', rule:'Cuando (“when”) links actions and time; present tense is common for habitual actions.', examples:[['when I work','cuando trabajo'],['when we eat','cuando comemos'],['when you arrive','cuando llegas']], practice:{prompt:'when I work', answers:['cuando trabajo'], hearing:['cuando trabajo','when I work'], wrong:'qué trabajo'}, scoreLabel:'Time-linking sentence frame'},
    {id:'que-connector', rank:58, type:'writing', importance:'high', power:90, tags:['sentence'], lenses:['WHAT','WHO','WHY'], title:'que = that / which / who connector', rule:'Que is one of Spanish’s most common linking words, connecting clauses and ideas.', examples:[['I think that…','Creo que…'],['the book that…','el libro que…'],['I know that…','Sé que…']], practice:{prompt:'I think that…', answers:['creo que'], hearing:['creo que','I think that'], wrong:'creo de'}, scoreLabel:'One connector, countless sentences'},
    {id:'articles', rank:59, type:'writing', importance:'high', power:92, tags:['sentence'], lenses:['WHO','WHAT'], title:'el/la · los/las · un/una', rule:'Articles mark gender and number and appear very frequently before nouns.', examples:[['the book','el libro'],['the house','la casa'],['a friend (f.)','una amiga']], practice:{prompt:'the house', answers:['la casa'], hearing:['la casa','the house'], wrong:'el casa'}, scoreLabel:'Essential noun framing'},
    {id:'ser-identity', rank:60, type:'writing', importance:'essential', power:98, tags:['verbs','sentence'], lenses:['WHO','WHAT'], title:'ser for identity / classification', rule:'Ser is central for identity, origin, profession and classification; estar handles many states/locations.', examples:[['I am a student','Soy estudiante'],['She is Spanish','Ella es española'],['It is important','Es importante']], practice:{prompt:'I am a student', answers:['soy estudiante'], hearing:['soy estudiante','I am a student'], wrong:'estoy estudiante'}, scoreLabel:'Core identity pattern'},
    {id:'ism-ismo', rank:61, type:'visual', importance:'high', power:92, tags:['cognates'], lenses:['WHAT'], title:'-ism → -ismo', rule:'Many English nouns ending in -ism have a closely related Spanish form ending in -ismo.', examples:[['capitalism','capitalismo'],['realism','realismo'],['tourism','turismo']], practice:{prompt:'capitalism', answers:['capitalismo'], hearing:['capitalismo','capitalism'], wrong:'capitalisma'}, scoreLabel:'A large family of ideas, systems and movements'},
    {id:'able-ible', rank:62, type:'visual', importance:'high', power:88, tags:['cognates'], lenses:['WHAT'], title:'-able / -ible → -able / -ible', rule:'Many English adjectives ending in -able or -ible have a very similar Spanish cognate ending.', examples:[['possible','posible'],['flexible','flexible'],['acceptable','aceptable']], practice:{prompt:'possible', answers:['posible'], hearing:['posible','possible'], wrong:'possiblo'}, scoreLabel:'Useful adjective recognition family'},
    {id:'ant-ent', rank:63, type:'visual', importance:'high', power:87, tags:['cognates'], lenses:['WHO','WHAT'], title:'-ant / -ent → -ante / -ente', rule:'Many English words ending in -ant or -ent have a related Spanish form ending in -ante or -ente.', examples:[['important','importante'],['elegant','elegante'],['intelligent','inteligente']], practice:{prompt:'important', answers:['importante'], hearing:['importante','important'], wrong:'important'}, scoreLabel:'Strong recognition link for common adjectives and nouns'},
    {id:'ize-izar', rank:64, type:'visual', importance:'high', power:90, tags:['cognates','verbs'], lenses:['WHAT'], title:'-ize → -izar', rule:'Many English verbs ending in -ize have a related Spanish infinitive ending in -izar.', examples:[['organize','organizar'],['modernize','modernizar'],['visualize','visualizar']], practice:{prompt:'organize', answers:['organizar'], hearing:['organizar','organize'], wrong:'organizear'}, scoreLabel:'Productive verb-building pattern'},
    {id:'fy-ficar', rank:65, type:'visual', importance:'high', power:88, tags:['cognates','verbs'], lenses:['WHAT'], title:'-fy → -ficar', rule:'Many English verbs ending in -fy have a related Spanish verb ending in -ficar.', examples:[['simplify','simplificar'],['identify','identificar'],['verify','verificar']], practice:{prompt:'simplify', answers:['simplificar'], hearing:['simplificar','simplify'], wrong:'simplifyar'}, scoreLabel:'High-value verb transformation family'},
    {id:'al-al', rank:66, type:'visual', importance:'high', power:91, tags:['cognates'], lenses:['WHAT'], title:'-al → -al', rule:'Many English words ending in -al keep the same -al ending in Spanish, often with small spelling changes in the stem.', examples:[['natural','natural'],['cultural','cultural'],['original','original']], practice:{prompt:'cultural', answers:['cultural'], hearing:['cultural','cultural'], wrong:'culturale'}, scoreLabel:'One of the easiest cognate families to recognise'},
    {id:'sion-sion', rank:67, type:'visual', importance:'high', power:90, tags:['cognates'], lenses:['WHAT'], title:"-sion → -sión", rule:"Many English nouns ending -sion correspond to Spanish -sión.", examples:[["decision","decisión"],["vision","visión"],["profession","profesión"]], practice:{prompt:"decision", answers:["decisión"], hearing:["decisión","decision"], wrong:"decisíon"}, scoreLabel:"Large Latinate noun family"},
    {id:'ment-mento', rank:68, type:'visual', importance:'useful', power:82, tags:['cognates'], lenses:['WHAT'], title:"-ment → -mento", rule:"A useful group of English -ment nouns have close Spanish -mento cognates.", examples:[["document","documento"],["instrument","instrumento"],["argument","argumento"]], practice:{prompt:"document", answers:["documento"], hearing:["documento","document"], wrong:"documenta"}, scoreLabel:"Easy noun recognition family"},
    {id:'ment-miento', rank:69, type:'visual', importance:'useful', power:82, tags:['cognates'], lenses:['WHAT'], title:"-ment → -miento", rule:"Many English nouns ending -ment correspond to Spanish nouns ending -miento.", examples:[["movement","movimiento"],["treatment","tratamiento"],["equipment","equipamiento"]], practice:{prompt:"movement", answers:["movimiento"], hearing:["movimiento","movement"], wrong:"movemento"}, scoreLabel:"Useful abstract-noun family"},
    {id:'ary-ario', rank:70, type:'visual', importance:'high', power:86, tags:['cognates'], lenses:['WHO','WHAT'], title:"-ary → -ario / -aria", rule:"Many English words ending -ary have a related Spanish -ario/-aria form.", examples:[["necessary","necesario"],["vocabulary","vocabulario"],["secondary","secundario"]], practice:{prompt:"necessary", answers:["necesario"], hearing:["necesario","necessary"], wrong:"necessario"}, scoreLabel:"Common adjective and noun family"},
    {id:'ory-orio', rank:71, type:'visual', importance:'useful', power:81, tags:['cognates'], lenses:['WHAT','WHERE'], title:"-ory → -orio / -oria", rule:"Many English words ending -ory correspond to Spanish -orio/-oria.", examples:[["territory","territorio"],["laboratory","laboratorio"],["directory","directorio"]], practice:{prompt:"territory", answers:["territorio"], hearing:["territorio","territory"], wrong:"territoryo"}, scoreLabel:"Strong learned-cognate family"},
    {id:'ture-tura', rank:72, type:'visual', importance:'high', power:88, tags:['cognates'], lenses:['WHAT'], title:"-ture → -tura", rule:"Many English nouns ending -ture have a related Spanish noun ending -tura.", examples:[["culture","cultura"],["structure","estructura"],["literature","literatura"]], practice:{prompt:"culture", answers:["cultura"], hearing:["cultura","culture"], wrong:"culture"}, scoreLabel:"High-value noun transformation"},
    {id:'tude-tud', rank:73, type:'visual', importance:'useful', power:79, tags:['cognates'], lenses:['WHAT'], title:"-tude → -tud", rule:"A useful family of English -tude nouns maps to Spanish -tud.", examples:[["attitude","actitud"],["magnitude","magnitud"],["latitude","latitud"]], practice:{prompt:"magnitude", answers:["magnitud"], hearing:["magnitud","magnitude"], wrong:"magnitudo"}, scoreLabel:"Compact abstract-noun pattern"},
    {id:'logy-logia', rank:74, type:'visual', importance:'high', power:91, tags:['cognates'], lenses:['WHAT'], title:"-logy → -logía", rule:"English fields and concepts ending -logy often map to Spanish -logía.", examples:[["biology","biología"],["technology","tecnología"],["psychology","psicología"]], practice:{prompt:"biology", answers:["biología"], hearing:["biología","biology"], wrong:"biologio"}, scoreLabel:"Huge science and knowledge family"},
    {id:'graphy-grafia', rank:75, type:'visual', importance:'high', power:87, tags:['cognates'], lenses:['WHAT'], title:"-graphy → -grafía", rule:"Many English nouns ending -graphy have a Spanish cognate ending -grafía.", examples:[["geography","geografía"],["photography","fotografía"],["biography","biografía"]], practice:{prompt:"geography", answers:["geografía"], hearing:["geografía","geography"], wrong:"geographía"}, scoreLabel:"Visual spelling + vocabulary shortcut"},
    {id:'cracy-cracia', rank:76, type:'visual', importance:'useful', power:78, tags:['cognates'], lenses:['WHAT','WHO'], title:"-cracy → -cracia", rule:"Many English system/government nouns ending -cracy map to Spanish -cracia.", examples:[["democracy","democracia"],["bureaucracy","burocracia"],["autocracy","autocracia"]], practice:{prompt:"democracy", answers:["democracia"], hearing:["democracia","democracy"], wrong:"democracía"}, scoreLabel:"Politics and systems vocabulary"},
    {id:'nomy-nomia', rank:77, type:'visual', importance:'useful', power:80, tags:['cognates'], lenses:['WHAT'], title:"-nomy → -nomía", rule:"Many English fields ending -nomy have a Spanish cognate ending -nomía.", examples:[["economy","economía"],["astronomy","astronomía"],["autonomy","autonomía"]], practice:{prompt:"astronomy", answers:["astronomía"], hearing:["astronomía","astronomy"], wrong:"astronomio"}, scoreLabel:"Academic vocabulary shortcut"},
    {id:'metry-metria', rank:78, type:'visual', importance:'useful', power:77, tags:['cognates'], lenses:['WHAT'], title:"-metry → -metría", rule:"Measurement fields ending English -metry often correspond to Spanish -metría.", examples:[["geometry","geometría"],["photometry","fotometría"],["optometry","optometría"]], practice:{prompt:"geometry", answers:["geometría"], hearing:["geometría","geometry"], wrong:"geometrio"}, scoreLabel:"Measurement and science family"},
    {id:'scope-scopio', rank:79, type:'visual', importance:'useful', power:76, tags:['cognates'], lenses:['WHAT'], title:"-scope → -scopio", rule:"Many instrument nouns ending English -scope have a Spanish cognate ending -scopio.", examples:[["microscope","microscopio"],["telescope","telescopio"],["endoscope","endoscopio"]], practice:{prompt:"microscope", answers:["microscopio"], hearing:["microscopio","microscope"], wrong:"microscope"}, scoreLabel:"Instrument vocabulary family"},
    {id:'ct-cto', rank:80, type:'visual', importance:'high', power:86, tags:['cognates'], lenses:['WHAT'], title:"-ct → -cto / -cta", rule:"Many English adjectives ending -ct have a Spanish cognate ending -cto/-cta.", examples:[["exact","exacto"],["perfect","perfecto"],["correct","correcto"]], practice:{prompt:"perfect (masculine)", answers:["perfecto"], hearing:["perfecto","perfect (masculine)"], wrong:"perfect"}, scoreLabel:"Fast adjective recognition"},
    {id:'id-ido', rank:81, type:'visual', importance:'high', power:84, tags:['cognates'], lenses:['WHAT'], title:"-id → -ido / -ida", rule:"Many English adjectives ending -id have a related Spanish -ido/-ida form.", examples:[["rapid","rápido"],["solid","sólido"],["timid","tímido"]], practice:{prompt:"rapid (masculine)", answers:["rápido"], hearing:["rápido","rapid (masculine)"], wrong:"rapidoe"}, scoreLabel:"Useful adjective family"},
    {id:'ate-ar', rank:82, type:'visual', importance:'high', power:90, tags:['cognates','verbs'], lenses:['WHAT'], title:"-ate → -ar", rule:"Many Latinate English verbs ending -ate have a related Spanish infinitive ending -ar.", examples:[["activate","activar"],["calculate","calcular"],["participate","participar"]], practice:{prompt:"activate", answers:["activar"], hearing:["activar","activate"], wrong:"activatear"}, scoreLabel:"Large verb-building pattern"}
  ];


  const SKILLS=[{key:'see',icon:'👁',label:'See',mode:'tick'},{key:'hear',icon:'👂',label:'Hear',mode:'hear'},{key:'write',icon:'✍️',label:'Write',mode:'write'},{key:'speak',icon:'🎙️',label:'Speak',mode:'speak'},{key:'use',icon:'⚡',label:'Use',mode:'choice'}];
  const FAMILY_META=[{key:'words',icon:'🔗',title:'Word Links',text:'English words that transform predictably into Spanish.'},{key:'sound',icon:'👂',title:'Sound Links',text:'Hear letters, stress and pronunciation patterns.'},{key:'sentences',icon:'🧱',title:'Sentence Links',text:'Reusable frames that build real Spanish quickly.'},{key:'verbs',icon:'⚙️',title:'Verb Links',text:'Patterns that show who is doing what and when.'},{key:'questions',icon:'❓',title:'Question Links',text:'Ask WHO, WHAT, WHERE, WHY and WHEN.'}];
  const SENTENCE_DNA=[
    {id:'tener-que',title:'I have to…',idea:'Obligation',en:['I have to','{verb}'],es:['Tengo que','{infinitive}'],variants:[['I have to work','Tengo que trabajar'],['I have to study','Tengo que estudiar'],['We have to go','Tenemos que ir']]},
    {id:'ir-a',title:'I am going to…',idea:'Near future',en:['I am going to','{verb}'],es:['Voy a','{infinitive}'],variants:[['I am going to eat','Voy a comer'],['We are going to study','Vamos a estudiar'],['I am going to travel','Voy a viajar']]},
    {id:'hay',title:'There is / are…',idea:'Existence',en:['There is / are','{thing}'],es:['Hay','{thing}'],variants:[['There is a problem','Hay un problema'],['There is water','Hay agua'],['There are two cafés','Hay dos cafés']]},
    {id:'gustar',title:'I like…',idea:'Likes',en:['I like','{thing / action}'],es:['Me gusta / gustan','{thing / action}'],variants:[['I like coffee','Me gusta el café'],['I like books','Me gustan los libros'],['I like to travel','Me gusta viajar']]},
    {id:'no-before-verb',title:'I do not…',idea:'Negatives',en:['I do not','{verb}'],es:['No','{conjugated verb}'],variants:[['I do not understand','No entiendo'],['We do not know','No sabemos'],['I do not speak Spanish','No hablo español']]},
    {id:'estar-gerund',title:'I am …-ing',idea:'Action now',en:['I am','{verb-ing}'],es:['Estoy','{-ando / -iendo}'],variants:[['I am speaking','Estoy hablando'],['We are eating','Estamos comiendo'],['She is living here','Está viviendo aquí']]},
    {id:'ser-identity',title:'I am / it is…',idea:'Identity',en:['I am / it is','{identity / class}'],es:['Soy / Es','{identity / class}'],variants:[['I am a student','Soy estudiante'],['She is Spanish','Ella es española'],['It is important','Es importante']]},
    {id:'question-order',title:'Do you…?',idea:'Questions',en:['Do you','{verb + idea}','?'],es:['¿','{conjugated verb + idea}','?'],variants:[['Do you speak Spanish?','¿Hablas español?'],['Do you eat meat?','¿Comes carne?'],['Where do you live?','¿Dónde vives?']]}
  ];

  const COURSE_LEVELS=[
    {id:'A1',title:'A1 Foundations',subtitle:'Understand the building blocks of everyday Spanish.',units:[
      {id:'a1-links',title:'First language links',desc:'Use familiar English to unlock Spanish spelling and sound.',patterns:['tion-cion','ity-idad','vowels','h-silent','stress-default','accent-overrides']},
      {id:'a1-sentences',title:'Build your first sentences',desc:'Identity, existence, location, articles and simple negatives.',patterns:['subject-drop','no-before-verb','articles','ser-identity','hay','estar-location']},
      {id:'a1-questions',title:'Ask and locate',desc:'Questions, directions and the small words that place things.',patterns:['question-words','question-order','a-en-de','aqui-alli','al-del','inverted-punct']},
      {id:'a1-verbs',title:'Core present-tense verbs',desc:'Regular verbs plus going to, obligation and liking.',patterns:['regular-ar','regular-er','regular-ir','ir-a','tener-que','gustar']},
      {id:'a1-description',title:'Describe people and things',desc:'Agreement, plurals, gender clues, age and people as objects.',patterns:['adjective-after','agreement','plural','gender-o-a','personal-a','tengo-anos']},
      {id:'a1-sounds',title:'Sound confidence',desc:'Read common consonants and regional sound patterns with confidence.',patterns:['g-j-sounds','c-z','qu','enye','r-rr','b-v','ll-y']}
    ]},
    {id:'A2',title:'A2 Everyday Spanish',subtitle:'Connect ideas, time, reasons and richer everyday vocabulary.',units:[
      {id:'a2-time',title:'Actions and time',desc:'Talk about what is happening, what just happened and how long.',patterns:['estar-gerund','reflexive','ya-todavia','acabar-de','desde-hace','cuando-present','months-lowercase']},
      {id:'a2-connect',title:'Reasons and connections',desc:'Build conditions, reasons, purpose, comparisons and linked clauses.',patterns:['porque','para-purpose','si-if','que-connector','more-than','muy-mucho']},
      {id:'a2-natural',title:'More natural sentence tools',desc:'Pronouns, impersonal statements and everyday weather.',patterns:['direct-object','se-impersonal','hace-weather']},
      {id:'a2-cognates',title:'High-yield word families',desc:'Grow recognition through productive adjective and noun families.',patterns:['ous-oso','ly-mente','ph-f','ic-ico','ist-ista','ance-encia','ive-ivo','ism-ismo','able-ible','ant-ent','al-al']},
      {id:'a2-verbs',title:'Build verbs from English',desc:'Recognise productive Latinate verb transformations.',patterns:['ize-izar','fy-ficar','ate-ar']},
      {id:'a2-nouns',title:'Build larger noun families',desc:'Recognise abstract nouns, roles, places and structures.',patterns:['sion-sion','ment-mento','ment-miento','ary-ario','ory-orio','ture-tura','tude-tud']}
    ]},
    {id:'B1',title:'B1 Bridge',subtitle:'A bridge into broader independent reading and discussion vocabulary.',units:[
      {id:'b1-knowledge',title:'Knowledge and science families',desc:'Read academic, scientific and systems vocabulary through shared roots.',patterns:['logy-logia','graphy-grafia','cracy-cracia','nomy-nomia','metry-metria','scope-scopio']},
      {id:'b1-precision',title:'Precision cognates',desc:'Refine adjective recognition and spelling transformations.',patterns:['ct-cto','id-ido']},
      {id:'b1-integration',title:'Integrated communication',desc:'Revisit core sentence engines at higher skill depth and combine them fluently.',patterns:['question-order','que-connector','si-if','direct-object','se-impersonal','estar-gerund','reflexive','ir-a']}
    ]}
  ];

  const LEXICAL_WARNINGS={
    'actual':'False-friend alert: Spanish actual usually means “current/present”, not English “actual”.',
    'asistir':'False-friend alert: asistir usually means “to attend”, not “to assist”.',
    'embarazada':'False-friend alert: embarazada means “pregnant”, not “embarrassed”.',
    'exito':'False-friend alert: éxito means “success”, not “exit”.',
    'libreria':'False-friend alert: librería normally means “bookshop/bookstore”, not “library”.',
    'carpeta':'False-friend alert: carpeta commonly means “folder”, not “carpet”.',
    'sensible':'False-friend alert: Spanish sensible often means “sensitive”, not English “sensible”.',
    'realizar':'Usage note: realizar commonly means “to carry out/perform”; it is not always the same as English “realize”.'
  };
  const SAFE_REGULAR_VERB_PATTERNS=new Set(['regular-ar','regular-er','regular-ir','ize-izar','fy-ficar','ate-ar']);
  const SOUND_CATEGORIES=[
    {id:'stress',label:'word stress',test:function(w){return/[áéíóú]/i.test(w)}},
    {id:'rr',label:'r / rr',test:function(w){return /r/i.test(w)}},
    {id:'j',label:'j / soft g',test:function(w){return /j|g[ei]/i.test(w)}},
    {id:'ll-y',label:'ll / y',test:function(w){return /ll|y/i.test(w)}},
    {id:'n-tilde',label:'ñ',test:function(w){return /ñ/i.test(w)}},
    {id:'qu',label:'qu',test:function(w){return /qu[ei]/i.test(w)}},
    {id:'c-z',label:'c / z',test:function(w){return /z|c[ei]/i.test(w)}},
    {id:'b-v',label:'b / v',test:function(w){return /[bv]/i.test(w)}},
    {id:'h',label:'silent h',test:function(w){return /h/i.test(w)}},
    {id:'vowels',label:'stable vowels',test:function(w){return /[aeiouáéíóú]/i.test(w)}}
  ];

  const els={search:document.getElementById('searchInput'),type:document.getElementById('typeFilter'),level:document.getElementById('levelFilter'),grid:document.getElementById('patternGrid'),summary:document.getElementById('resultsSummary'),empty:document.getElementById('emptyState'),dialog:document.getElementById('patternDialog'),dialogContent:document.getElementById('dialogContent'),toast:document.getElementById('toast'),practiceSelect:document.getElementById('practicePatternSelect'),practiceStage:document.getElementById('practiceStage'),familyTabs:document.getElementById('familyTabs')};

  function safeParse(value,fallback){try{return JSON.parse(value)}catch(e){return fallback}}
  const state={
    view:'home',lens:null,family:'all',quick:'all',mode:'write',currentId:patterns[0].id,
    skills:safeParse(localStorage.getItem('ldna-skills-v3')||'{}',{}),
    reviews:safeParse(localStorage.getItem('ldna-reviews-v1')||'{}',{}),
    pronunciation:safeParse(localStorage.getItem('ldna-pronunciation-v1')||'{}',{}),
    pronunciationWeaknesses:safeParse(localStorage.getItem('ldna-pronunciation-weaknesses-v1')||'{}',{}),
    activity:safeParse(localStorage.getItem('ldna-activity-v1')||'[]',[]),
    session:null,
    courseLevel:localStorage.getItem('ldna-course-level')||'A1',
    sentenceFrame:SENTENCE_DNA[0].id,sentenceExample:0,
    theme:localStorage.getItem('ldna-theme')||'light'
  };
  const legacyMastered=new Set(safeParse(localStorage.getItem('ldna-mastered')||'[]',[]));
  legacyMastered.forEach(function(id){if(!state.skills[id])state.skills[id]={see:true,hear:true,write:true,speak:true,use:true}});
  if(state.theme==='dark')document.body.classList.add('dark');

  function normalize(value){return String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[¿?¡!.,;:]/g,'').replace(/\s+/g,' ')}
  function escapeHtml(value){return String(value==null?'':value).replace(/[&<>"']/g,function(ch){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]})}
  function getPattern(id){return patterns.find(function(p){return p.id===id})||patterns[0]}
  function patternFamilies(p){const f=[];if(p.type==='visual'||p.tags.includes('cognates'))f.push('words');if(p.type==='sound'||p.tags.includes('pronunciation'))f.push('sound');if(p.tags.includes('sentence')||(p.type==='writing'&&!p.tags.includes('verbs')&&!p.tags.includes('questions')))f.push('sentences');if(p.tags.includes('verbs'))f.push('verbs');if(p.tags.includes('questions'))f.push('questions');if(!f.length)f.push('sentences');return Array.from(new Set(f))}
  function typeLabel(type){return type==='visual'?'👁 VISUAL':type==='sound'?'🔊 SOUND':'✍ STRUCTURE'}
  function progressFor(id){const row=state.skills[id]||{};return SKILLS.reduce(function(n,s){return n+(row[s.key]?1:0)},0)}
  function isStrong(id){return progressFor(id)>=4}
  function persistSkills(){localStorage.setItem('ldna-skills-v3',JSON.stringify(state.skills))}
  function persistReviews(){localStorage.setItem('ldna-reviews-v1',JSON.stringify(state.reviews))}
  function persistPronunciation(){localStorage.setItem('ldna-pronunciation-v1',JSON.stringify(state.pronunciation))}
  function persistPronunciationWeaknesses(){localStorage.setItem('ldna-pronunciation-weaknesses-v1',JSON.stringify(state.pronunciationWeaknesses))}
  function persistActivity(){localStorage.setItem('ldna-activity-v1',JSON.stringify(state.activity.slice(-500)))}
  function logActivity(type,data){state.activity.push(Object.assign({at:Date.now(),type:type},data||{}));if(state.activity.length>500)state.activity=state.activity.slice(-500);persistActivity()}
  function courseLevelById(id){return COURSE_LEVELS.find(function(level){return level.id===id})||COURSE_LEVELS[0]}
  function courseUnitById(id){for(let i=0;i<COURSE_LEVELS.length;i++){const unit=COURSE_LEVELS[i].units.find(function(x){return x.id===id});if(unit)return{level:COURSE_LEVELS[i],unit:unit,index:i}}return null}
  function courseLevelForPattern(id){for(let i=0;i<COURSE_LEVELS.length;i++)if(COURSE_LEVELS[i].units.some(function(u){return u.patterns.includes(id)}))return COURSE_LEVELS[i].id;return'B1'}
  function patternUsefulness(p){const bonus=p.importance==='essential'?8:p.importance==='high'?4:0;return Math.min(100,Math.round(p.power*.88+bonus))}
  function patternConfidence(p){if(p.note)return'Strong tendency';if(p.power>=94)return'High teaching confidence';if(p.power>=84)return'Useful pattern';return'Explore with examples'}
  function patternIntelligence(p){return{level:courseLevelForPattern(p.id),usefulness:patternUsefulness(p),confidence:patternConfidence(p)}}
  function normalizeWarningKey(value){return normalize(value).replace(/\s/g,'')}
  function lexicalWarning(query,translated){const keys=[normalizeWarningKey(query),normalizeWarningKey(translated)];for(let i=0;i<keys.length;i++)if(LEXICAL_WARNINGS[keys[i]])return LEXICAL_WARNINGS[keys[i]];return''}
  function unitProgress(unit){const total=unit.patterns.length*SKILLS.length,built=unit.patterns.reduce(function(n,id){return n+progressFor(id)},0);return total?Math.round(built/total*100):0}
  function unitStrongCount(unit){return unit.patterns.filter(function(id){return isStrong(id)}).length}
  function unitUnlocked(levelIndex,unitIndex){
    if(levelIndex===0&&unitIndex===0)return true;
    if(unitIndex>0)return unitProgress(COURSE_LEVELS[levelIndex].units[unitIndex-1])>=60;
    const previous=COURSE_LEVELS[levelIndex-1];return previous.units.filter(function(u){return unitProgress(u)>=70}).length>=Math.ceil(previous.units.length*.67)
  }
  function courseStage(){
    let highest='A1',completedUnits=0,totalUnits=0;
    COURSE_LEVELS.forEach(function(level,li){level.units.forEach(function(unit){totalUnits++;if(unitProgress(unit)>=80){completedUnits++;highest=level.id}})});
    const current=COURSE_LEVELS.find(function(level,li){return level.units.some(function(unit,ui){return unitUnlocked(li,ui)&&unitProgress(unit)<80})})||COURSE_LEVELS[COURSE_LEVELS.length-1];
    return{highest:highest,current:current.id,completedUnits:completedUnits,totalUnits:totalUnits,percent:Math.round(completedUnits/totalUnits*100)}
  }
  function regularVerbFamily(spanish,pattern){
    if(!pattern||!SAFE_REGULAR_VERB_PATTERNS.has(pattern.id))return null;
    const word=String(spanish||'').toLowerCase().trim(),ending=word.slice(-2);if(!['ar','er','ir'].includes(ending))return null;
    const stem=word.slice(0,-2),forms=ending==='ar'?['o','as','a','amos','an']:ending==='er'?['o','es','e','emos','en']:['o','es','e','imos','en'];
    return[['yo',stem+forms[0]],['tú',stem+forms[1]],['él/ella',stem+forms[2]],['nosotros',stem+forms[3]],['ellos',stem+forms[4]]]
  }
  function markSkill(id,skill,silent){if(!state.skills[id])state.skills[id]={};state.skills[id][skill]=true;persistSkills();if(!silent)toast('Nice — one more link strengthened.');renderAllProgress()}
  function toast(message){els.toast.textContent=message;els.toast.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(function(){els.toast.classList.remove('show')},1800)}
  function speakText(text,lang,rate){if(!('speechSynthesis'in window)){toast('Audio playback is not supported in this browser.');return}window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang=lang||'es-ES';u.rate=rate||((u.lang.indexOf('es')===0)?.82:.9);const voices=window.speechSynthesis.getVoices();const target=u.lang.slice(0,2).toLowerCase();const voice=voices.find(function(v){return v.lang.toLowerCase().indexOf(target)===0});if(voice)u.voice=voice;window.speechSynthesis.speak(u)}

  function reviewRecord(id){return state.reviews[id]||null}
  function scheduleReview(id,quality){
    const now=Date.now(),old=state.reviews[id]||{ease:2.5,interval:0,repetitions:0,lapses:0,due:now};
    let ease=Number(old.ease)||2.5,interval=Number(old.interval)||0,repetitions=Number(old.repetitions)||0,lapses=Number(old.lapses)||0,due=now;
    if(quality<3){repetitions=0;lapses+=1;interval=0;due=now+15*60*1000}
    else{
      repetitions+=1;
      if(repetitions===1)interval=1;else if(repetitions===2)interval=3;else interval=Math.max(4,Math.round(Math.max(1,interval)*ease));
      const miss=5-quality;ease=Math.max(1.3,ease+0.1-miss*(0.08+miss*0.02));
      due=now+interval*86400000;
    }
    state.reviews[id]={ease:Number(ease.toFixed(2)),interval:interval,repetitions:repetitions,lapses:lapses,due:due,lastReviewed:now,lastQuality:quality};
    persistReviews();renderReviewBar();
  }
  function reviewSummary(){
    const now=Date.now(),records=Object.values(state.reviews),due=records.filter(function(r){return r&&r.due<=now}).length;
    const scheduled=records.length,strong=records.filter(function(r){return r&&r.interval>=14}).length;
    const next=records.filter(function(r){return r&&r.due>now}).sort(function(a,b){return a.due-b.due})[0]||null;
    return{due:due,scheduled:scheduled,strong:strong,next:next};
  }
  function formatDue(ts){
    if(!ts)return'not scheduled';const diff=ts-Date.now();if(diff<=0)return'due now';
    if(diff<3600000)return'in '+Math.max(1,Math.round(diff/60000))+' min';
    if(diff<86400000)return'in '+Math.max(1,Math.round(diff/3600000))+' hr';
    const days=Math.max(1,Math.round(diff/86400000));return'in '+days+' day'+(days===1?'':'s');
  }
  function duePatterns(){const now=Date.now();return patterns.filter(function(p){const r=reviewRecord(p.id);return r&&r.due<=now}).sort(function(a,b){return reviewRecord(a.id).due-reviewRecord(b.id).due||b.power-a.power})}
  function nextBestPattern(){
    const due=duePatterns();if(due.length)return due[0];
    return patterns.slice().sort(function(a,b){
      const aScore=(5-progressFor(a.id))*24+a.power-(reviewRecord(a.id)?8:0);
      const bScore=(5-progressFor(b.id))*24+b.power-(reviewRecord(b.id)?8:0);
      return bScore-aScore||a.rank-b.rank
    })[0]||patterns[0];
  }
  function recommendedMode(p){
    const row=state.skills[p.id]||{};if(!row.see)return'tick';if(!row.hear)return'hear';if(!row.write)return'write';if(!row.speak)return'speak';if(!row.use)return'choice';
    const r=reviewRecord(p.id);return r&&r.lastQuality<4?'write':'choice';
  }
  function renderReviewBar(){
    const count=document.getElementById('reviewDueCount'),text=document.getElementById('reviewDueText'),button=document.getElementById('reviewStartButton');if(!count||!text||!button)return;
    const s=reviewSummary();count.textContent=s.due;
    if(s.due){text.textContent='Your memory queue has '+s.due+' link'+(s.due===1?'':'s')+' ready for retrieval practice.';button.textContent='Review due links'}
    else if(s.scheduled){text.textContent='Nothing is due. Next scheduled review is '+formatDue(s.next&&s.next.due)+'.';button.textContent='Smart practice'}
    else{text.textContent='Complete a practice item and LanguageDNA will start scheduling memory reviews automatically.';button.textContent='Start smart practice'}
  }
  function startSmartReview(){const p=nextBestPattern();startPractice(p.id,recommendedMode(p));toast(reviewRecord(p.id)&&reviewRecord(p.id).due<=Date.now()?'Reviewing a link that is due now.':'Starting your highest-value next link.')}

  function editDistance(a,b){
    a=normalize(a);b=normalize(b);const m=a.length,n=b.length,prev=Array(n+1).fill(0).map(function(_,i){return i});
    for(let i=1;i<=m;i++){let diag=i-1;prev[0]=i;for(let j=1;j<=n;j++){const up=prev[j],left=prev[j-1],cost=a[i-1]===b[j-1]?0:1,val=Math.min(up+1,left+1,diag+cost);diag=up;prev[j]=val}}
    return prev[n]
  }
  function pronunciationSimilarity(target,heard){const a=normalize(target),b=normalize(heard);if(!a||!b)return 0;return Math.max(0,Math.round((1-editDistance(a,b)/Math.max(a.length,b.length))*100))}
  function recordPronunciation(id,score,heard,target){
    const old=state.pronunciation[id]||{attempts:0,best:0,total:0};
    state.pronunciation[id]={attempts:old.attempts+1,best:Math.max(old.best||0,score),total:(old.total||0)+score,last:score,lastHeard:heard,lastTarget:target,lastAt:Date.now()};persistPronunciation();
  }
  function pronunciationSummary(){
    const rows=Object.values(state.pronunciation).filter(function(r){return r&&r.attempts}),attempts=rows.reduce(function(n,r){return n+r.attempts},0),total=rows.reduce(function(n,r){return n+(r.total||0)},0);
    return{patterns:rows.length,attempts:attempts,average:attempts?Math.round(total/attempts):null,best:rows.length?Math.max.apply(null,rows.map(function(r){return r.best||0})):null}
  }
  function stressIndex(word){
    const clean=String(word||'').toLowerCase().replace(/[^a-záéíóúüñ]/g,'');if(!clean)return-1;
    for(let i=0;i<clean.length;i++)if('áéíóú'.indexOf(clean[i])>=0)return i;
    const vowels=[];for(let i=0;i<clean.length;i++)if('aeiouü'.indexOf(clean[i])>=0)vowels.push(i);
    if(!vowels.length)return-1;const penultimate=/[aeiouns]$/.test(clean);return vowels[Math.max(0,vowels.length-(penultimate?2:1))]
  }
  function stressCueHtml(text){
    return String(text||'').split(/(\s+)/).map(function(word){
      if(/^\s+$/.test(word))return word;const idx=stressIndex(word);if(idx<0)return escapeHtml(word);
      let cleanPos=-1,actual=-1;for(let i=0;i<word.length;i++){if(/[A-Za-zÁÉÍÓÚÜáéíóúüÑñ]/.test(word[i]))cleanPos++;if(cleanPos===idx){actual=i;break}}
      if(actual<0)return escapeHtml(word);return escapeHtml(word.slice(0,actual))+'<span class="stressed">'+escapeHtml(word[actual])+'</span>'+escapeHtml(word.slice(actual+1))
    }).join('')
  }
  function pronunciationTip(target){
    const raw=String(target||''),t=normalize(raw);
    if(t.indexOf('h')>=0)return'Remember: written h is silent in standard Spanish.';
    if(t.indexOf('rr')>=0)return'Give rr a stronger trill; a single r between vowels is usually shorter.';
    if(raw.toLowerCase().indexOf('ñ')>=0)return'Ñ is the “ny” sound, similar to the middle of “canyon”.';
    if(/qu[ei]/.test(t))return'In que/qui, qu gives a k sound and the u is normally silent.';
    if(/[áéíóú]/i.test(raw))return'The written accent marks the stressed vowel.';
    return'Keep Spanish vowels short and stable; use the highlighted vowel as your stress clue.';
  }
  function speakTargetForPattern(p){if(p.type==='sound'&&p.examples&&p.examples[0])return String(p.examples[0][0]);return String((p.practice.answers&&p.practice.answers[0])||(p.examples[0]&&p.examples[0][1])||'')}
  function skillDots(id){const row=state.skills[id]||{};return'<div class="skill-dots" aria-label="'+progressFor(id)+' of 5 skills built">'+SKILLS.map(function(s){return'<span class="skill-dot '+(row[s.key]?'on':'')+'" title="'+s.label+'">'+(row[s.key]?'✓':s.icon)+'</span>'}).join('')+'</div>'}

  function filteredPatterns(){const q=normalize(els.search?els.search.value:'');const type=els.type?els.type.value:'all';const level=els.level?els.level.value:'all';return patterns.filter(function(p){const searchable=normalize([p.title,p.rule,p.note||'',p.scoreLabel||'',p.tags.join(' '),p.lenses.join(' '),p.examples.flat().join(' ')].join(' '));return(!q||searchable.indexOf(q)>=0)&&(type==='all'||p.type===type)&&(level==='all'||p.importance===level)&&(!state.lens||p.lenses.includes(state.lens))&&(state.family==='all'||patternFamilies(p).includes(state.family))&&(state.quick==='all'||p.tags.includes(state.quick))})}
  function renderPatternCard(p){const count=progressFor(p.id),intel=patternIntelligence(p);return'<article class="pattern-card"><div class="pattern-card-top"><span class="mini-badge '+p.type+'">'+typeLabel(p.type)+'</span><span class="starter-number">#'+p.rank+'</span></div><div class="intelligence-tags"><span>'+intel.level+'</span><span>'+intel.usefulness+' usefulness</span><span>'+escapeHtml(intel.confidence)+'</span></div><h3>'+escapeHtml(p.title)+'</h3><p class="rule">'+escapeHtml(p.rule)+'</p><p class="unlock">'+escapeHtml(p.scoreLabel||'Reusable Spanish link')+'</p><div class="lens-tags">'+p.lenses.map(function(x){return'<span class="lens-tag">'+x+'</span>'}).join('')+'</div>'+skillDots(p.id)+'<div class="mini-progress"><span style="width:'+(count/5*100)+'%"></span></div><div class="pattern-card-actions"><button class="card-btn" type="button" data-open="'+p.id+'">See link</button><button class="card-btn primary" type="button" data-practice="'+p.id+'">Practise</button></div></article>'}
  function renderLibrary(){const items=filteredPatterns();if(els.summary)els.summary.textContent=items.length+' pattern'+(items.length===1?'':'s')+' shown · '+patterns.length+' total';if(els.empty)els.empty.hidden=items.length>0;if(els.grid)els.grid.innerHTML=items.map(renderPatternCard).join('')}
  function renderFamilies(){const familyGrid=document.getElementById('familyGrid');if(familyGrid)familyGrid.innerHTML=FAMILY_META.map(function(f){const count=patterns.filter(function(p){return patternFamilies(p).includes(f.key)}).length;return'<button type="button" class="family-card" data-family-jump="'+f.key+'"><span>'+f.icon+'</span><strong>'+f.title+'</strong><small>'+f.text+'</small><b>'+count+' patterns →</b></button>'}).join('');if(els.familyTabs){const tabs=[{key:'all',icon:'🧬',title:'All patterns'}].concat(FAMILY_META);els.familyTabs.innerHTML=tabs.map(function(f){return'<button type="button" class="family-tab '+(state.family===f.key?'active':'')+'" data-family="'+f.key+'">'+f.icon+' '+f.title+'</button>'}).join('')}}
  function renderStarters(){const grid=document.getElementById('starterGrid');if(!grid)return;const starter=patterns.slice().sort(function(a,b){return a.rank-b.rank}).slice(0,6);grid.innerHTML=starter.map(function(p,index){const count=progressFor(p.id);return'<button type="button" class="starter-card" data-open="'+p.id+'"><div class="starter-card-top"><span class="mini-badge '+p.type+'">'+typeLabel(p.type)+'</span><span class="starter-number">STEP '+(index+1)+'</span></div><h3>'+escapeHtml(p.title)+'</h3><p>'+escapeHtml(p.scoreLabel||p.rule)+'</p><div class="mini-progress"><span style="width:'+(count/5*100)+'%"></span></div></button>'}).join('')}
  function firstOpenCourseUnit(){
    for(let li=0;li<COURSE_LEVELS.length;li++)for(let ui=0;ui<COURSE_LEVELS[li].units.length;ui++){const unit=COURSE_LEVELS[li].units[ui];if(unitUnlocked(li,ui)&&unitProgress(unit)<80)return{level:COURSE_LEVELS[li],unit:unit,li:li,ui:ui}}
    const last=COURSE_LEVELS[COURSE_LEVELS.length-1];return{level:last,unit:last.units[last.units.length-1],li:COURSE_LEVELS.length-1,ui:last.units.length-1}
  }
  function renderCourse(){
    const tabs=document.getElementById('courseLevelTabs'),summary=document.getElementById('courseLevelSummary'),grid=document.getElementById('courseUnitGrid'),hero=document.getElementById('courseProgressHero');
    if(!tabs||!summary||!grid||!hero)return;
    const stage=courseStage(),next=firstOpenCourseUnit(),selected=courseLevelById(state.courseLevel);
    tabs.innerHTML=COURSE_LEVELS.map(function(level){const li=COURSE_LEVELS.indexOf(level),available=level.units.some(function(unit,ui){return unitUnlocked(li,ui)}),avg=Math.round(level.units.reduce(function(n,u){return n+unitProgress(u)},0)/level.units.length);return'<button type="button" class="course-level-tab '+(selected.id===level.id?'active':'')+'" data-course-level="'+level.id+'" '+(!available?'disabled':'')+'><strong>'+level.id+'</strong><span>'+avg+'%</span></button>'}).join('');
    const selectedIndex=COURSE_LEVELS.indexOf(selected),completed=selected.units.filter(function(u){return unitProgress(u)>=80}).length;
    summary.innerHTML='<div><span class="eyebrow">'+selected.title+'</span><h2>'+escapeHtml(selected.subtitle)+'</h2><p>'+completed+' of '+selected.units.length+' units at 80%+ · Units unlock when the previous unit reaches 60%.</p></div><div class="course-level-ring"><strong>'+Math.round(selected.units.reduce(function(n,u){return n+unitProgress(u)},0)/selected.units.length)+'%</strong><small>'+selected.id+' progress</small></div>';
    grid.innerHTML=selected.units.map(function(unit,ui){
      const pct=unitProgress(unit),strong=unitStrongCount(unit),unlocked=unitUnlocked(selectedIndex,ui),complete=pct>=80;
      return'<article class="course-unit-card '+(!unlocked?'locked ':'')+(complete?'complete':'')+'"><div class="course-unit-top"><span class="course-unit-number">'+selected.id+' · '+(ui+1)+'</span><span>'+(complete?'✓ Complete':unlocked?pct+'%':'🔒 Locked')+'</span></div><h3>'+escapeHtml(unit.title)+'</h3><p>'+escapeHtml(unit.desc)+'</p><div class="course-pattern-chips">'+unit.patterns.slice(0,6).map(function(id){return'<button type="button" data-unit-pattern="'+id+'" '+(!unlocked?'disabled':'')+'>'+escapeHtml(getPattern(id).title)+'</button>'}).join('')+(unit.patterns.length>6?'<span>+'+(unit.patterns.length-6)+' more</span>':'')+'</div><div class="course-unit-progress"><span style="width:'+pct+'%"></span></div><div class="course-unit-meta"><small>'+strong+'/'+unit.patterns.length+' strong patterns</small><button type="button" class="'+(unlocked?'primary-btn':'secondary-btn')+'" data-unit-lesson="'+unit.id+'" '+(!unlocked?'disabled':'')+'>'+(complete?'Refresh unit':pct?'Continue lesson':'Start lesson')+'</button></div></article>'
    }).join('');
    const nextPct=unitProgress(next.unit);
    hero.innerHTML='<div><span class="eyebrow">YOUR COURSE PATH</span><h2>'+stage.current+' · '+escapeHtml(next.unit.title)+'</h2><p>Course-stage estimate: <strong>'+stage.current+'</strong>. This is a learning-path estimate, not an official CEFR assessment.</p></div><div class="course-hero-actions"><div><strong>'+stage.completedUnits+'/'+stage.totalUnits+'</strong><small>units complete</small></div><button type="button" class="primary-btn" data-unit-lesson="'+next.unit.id+'">'+(nextPct?'Continue next unit':'Start next unit')+'</button></div>'
  }

  function sentenceFrame(){return SENTENCE_DNA.find(function(x){return x.id===state.sentenceFrame})||SENTENCE_DNA[0]}
  function formulaHtml(parts){return parts.map(function(part){const slot=/^\{/.test(part);return'<span class="sentence-token '+(slot?'slot':'fixed')+'">'+escapeHtml(part)+'</span>'}).join('')}
  function renderSentenceDNA(){
    const list=document.getElementById('sentenceFrameList'),stage=document.getElementById('sentenceDnaStage');if(!list||!stage)return;
    list.innerHTML=SENTENCE_DNA.map(function(frame){return'<button type="button" class="sentence-frame-button '+(frame.id===state.sentenceFrame?'active':'')+'" data-sentence-frame="'+frame.id+'"><strong>'+escapeHtml(frame.title)+'</strong><small>'+escapeHtml(frame.idea)+' · '+progressFor(frame.id)+'/5 skills</small></button>'}).join('');
    const frame=sentenceFrame(),example=frame.variants[state.sentenceExample%frame.variants.length];
    stage.innerHTML='<span class="eyebrow">REUSABLE FRAME</span><h3>'+escapeHtml(frame.title)+'</h3><p>Green pieces stay structurally stable. Dashed pieces are the slots you can replace to create new meaning.</p><div class="sentence-formula"><div><small>ENGLISH DNA</small><div class="sentence-line">'+formulaHtml(frame.en)+'</div></div><div><small>SPANISH DNA</small><div class="sentence-line">'+formulaHtml(frame.es)+'</div></div></div><div class="sentence-example"><div><small>English</small><strong>'+escapeHtml(example[0])+'</strong></div><div class="arrow">→</div><div><small>Spanish</small><strong>'+escapeHtml(example[1])+'</strong></div></div><div class="sentence-stage-actions"><button type="button" class="secondary-btn" data-sentence-next>Swap the words</button><button type="button" class="secondary-btn" data-speak="'+escapeHtml(example[1])+'">🔊 Hear Spanish</button><button type="button" class="primary-btn" data-practice="'+frame.id+'">Practise this frame</button></div>';
  }

  function commonPrefixLength(a,b){const max=Math.min(a.length,b.length);let i=0;while(i<max&&a[i].toLowerCase()===b[i].toLowerCase())i++;return i}
  function highlightWordPair(en,es){const cut=commonPrefixLength(en,es);if(cut<3||cut>=Math.min(en.length,es.length)-1)return{en:escapeHtml(en),es:escapeHtml(es)};return{en:escapeHtml(en.slice(0,cut))+'<mark>'+escapeHtml(en.slice(cut))+'</mark>',es:escapeHtml(es.slice(0,cut))+'<mark>'+escapeHtml(es.slice(cut))+'</mark>'}}
  function relatedPatterns(p){return patterns.filter(function(x){return x.id!==p.id}).map(function(x){let score=0;if(x.type===p.type)score+=3;p.tags.forEach(function(t){if(x.tags.includes(t))score+=3});p.lenses.forEach(function(l){if(x.lenses.includes(l))score+=1});if(patternFamilies(p).some(function(f){return patternFamilies(x).includes(f)}))score+=2;score+=Math.max(0,3-Math.abs(x.rank-p.rank)/10);return{p:x,score:score}}).sort(function(a,b){return b.score-a.score||a.p.rank-b.p.rank}).slice(0,4).map(function(x){return x.p})}

  const FULL_PATTERN_DICTIONARIES=new Set(["tion-cion","sion-sion","ity-idad","ous-oso","ly-mente","ic-ico","ive-ivo","ist-ista","ance-encia","ism-ismo","able-ible","ant-ent","ize-izar","fy-ficar","al-al","ment-mento","ment-miento","ary-ario","ory-orio","ture-tura","tude-tud","logy-logia","graphy-grafia","cracy-cracia","nomy-nomia","metry-metria","scope-scopio","ct-cto","id-ido","ate-ar","ph-f"]);
  function openPattern(id){if(FULL_PATTERN_DICTIONARIES.has(id)){window.location.href='pattern.html?id='+encodeURIComponent(id);return}const p=getPattern(id);const examples=p.examples.map(function(pair){const hi=highlightWordPair(String(pair[0]),String(pair[1]));return'<div class="transform-example"><div class="transform-word">'+hi.en+'</div><div class="arrow">→</div><div class="transform-word">'+hi.es+'</div><button type="button" class="small-audio" data-speak="'+escapeHtml(String(pair[1]))+'" aria-label="Hear '+escapeHtml(String(pair[1]))+'">🔊</button></div>'}).join('');const row=state.skills[p.id]||{};const skills=SKILLS.map(function(s){return'<button type="button" class="skill-button '+(row[s.key]?'done':'')+'" data-skill-practice="'+s.mode+'" data-id="'+p.id+'"><span>'+(row[s.key]?'✓':s.icon)+'</span><strong>'+s.label+'</strong></button>'}).join('');const related=relatedPatterns(p).map(function(x){return'<button type="button" class="related-card" data-open="'+x.id+'"><strong>'+escapeHtml(x.title)+'</strong><small>'+escapeHtml(x.scoreLabel||'Connected pattern')+'</small></button>'}).join('');els.dialogContent.innerHTML='<div class="dialog-hero"><span class="mini-badge '+p.type+'">'+typeLabel(p.type)+'</span><h2 id="dialogTitle">'+escapeHtml(p.title)+'</h2><p>'+escapeHtml(p.rule)+'</p><div class="lens-tags">'+p.lenses.map(function(x){return'<span class="lens-tag">'+x+'</span>'}).join('')+'</div></div><div class="pattern-transform"><div class="pattern-transform-label">SEE THE LINK</div>'+examples+'</div><div class="unlock-panel"><h3>🔓 This pattern unlocks more Spanish</h3><p>'+escapeHtml(p.scoreLabel||'Use the same connection when you meet similar words or sentences.')+'</p></div><h3>Build it in five skills</h3><div class="skill-strip">'+skills+'</div><div class="related-section"><h3>🔗 Connected next</h3><div class="related-grid">'+related+'</div></div>';els.dialog.showModal()}
  function goView(name){state.view=name;document.querySelectorAll('.view').forEach(function(v){v.classList.toggle('active',v.dataset.viewPanel===name)});document.querySelectorAll('.nav-item').forEach(function(b){b.classList.toggle('active',b.dataset.view===name)});if(name==='home')renderSentenceDNA();if(name==='course')renderCourse();if(name==='library'){renderFamilies();renderLibrary()}if(name==='practice'){renderReviewBar();renderSessionPanel();renderPractice()}if(name==='dna')renderDNA();window.scrollTo({top:0,behavior:'smooth'})}
  function populatePracticeSelect(){els.practiceSelect.innerHTML=patterns.slice().sort(function(a,b){return a.rank-b.rank}).map(function(p){return'<option value="'+p.id+'">#'+p.rank+' · '+escapeHtml(p.title)+'</option>'}).join('');els.practiceSelect.value=state.currentId}
  function startPractice(id,mode){
    state.session=null;state.currentId=id;state.mode=mode||state.mode||'write';els.practiceSelect.value=id;
    document.querySelectorAll('.mode-card').forEach(function(b){b.classList.toggle('active',b.dataset.mode===state.mode)});
    if(els.dialog.open)els.dialog.close();renderSessionPanel();goView('practice')
  }
  function practiceSkillForMode(mode){return mode==='write'?'write':mode==='speak'?'speak':mode==='hear'?'hear':mode==='choice'?'use':'see'}
  function feedback(ok,text){const f=document.getElementById('practiceFeedback');if(!f)return;f.textContent=text;f.className='feedback '+(ok?'correct':'incorrect')}

  function sessionModeFor(p,index){
    const preferred=recommendedMode(p),cycle=['write','hear','choice','speak','tick'];
    if(index%3===0)return preferred;
    const candidate=cycle[index%cycle.length],row=state.skills[p.id]||{},skill=practiceSkillForMode(candidate);
    return row[skill]?preferred:candidate
  }
  function buildLessonItems(patternIds,count){
    const allowed=new Set((patternIds&&patternIds.length?patternIds:patterns.map(function(p){return p.id})).filter(function(id){return!!patterns.find(function(p){return p.id===id})}));
    let pool=patterns.filter(function(p){return allowed.has(p.id)});
    const due=duePatterns().filter(function(p){return allowed.has(p.id)});
    pool=pool.slice().sort(function(a,b){
      const aWeak=(5-progressFor(a.id))*25+a.power+(reviewRecord(a.id)&&reviewRecord(a.id).lastQuality<3?20:0);
      const bWeak=(5-progressFor(b.id))*25+b.power+(reviewRecord(b.id)&&reviewRecord(b.id).lastQuality<3?20:0);
      return bWeak-aWeak||a.rank-b.rank
    });
    const ordered=[],seen=new Set();
    due.concat(pool).forEach(function(p){if(!seen.has(p.id)){seen.add(p.id);ordered.push(p)}});
    const total=Math.max(1,count||8),items=[];
    for(let i=0;i<total;i++){const p=ordered[i%ordered.length]||patterns[0];items.push({patternId:p.id,mode:sessionModeFor(p,i)})}
    return items
  }
  function startLessonSession(title,patternIds,unitId){
    const items=buildLessonItems(patternIds,8);
    state.session={title:title||'Adaptive lesson',unitId:unitId||null,items:items,index:0,correct:0,skipped:0,mistakes:[],improved:[],startedAt:Date.now(),completed:false};
    loadSessionItem();goView('practice')
  }
  function loadSessionItem(){
    if(!state.session||state.session.completed)return;
    const item=state.session.items[state.session.index];if(!item){finishSession();return}
    state.currentId=item.patternId;state.mode=item.mode;els.practiceSelect.value=state.currentId;
    document.querySelectorAll('.mode-card').forEach(function(b){b.classList.toggle('active',b.dataset.mode===state.mode)});
    renderSessionPanel();renderPractice()
  }
  function renderSessionPanel(){
    const panel=document.getElementById('lessonSessionPanel');if(!panel)return;
    const s=state.session;if(!s){panel.hidden=true;panel.innerHTML='';return}
    panel.hidden=false;
    if(s.completed){panel.innerHTML='<div><span class="eyebrow">LESSON COMPLETE</span><strong>'+escapeHtml(s.title)+'</strong><small>'+s.correct+'/'+s.items.length+' correct · '+s.skipped+' skipped</small></div><div class="session-progress"><span style="width:100%"></span></div>';return}
    const q=Math.min(s.index+1,s.items.length),pct=Math.round(s.index/s.items.length*100);
    panel.innerHTML='<div class="lesson-session-head"><div><span class="eyebrow">ADAPTIVE LESSON</span><strong>'+escapeHtml(s.title)+'</strong><small>Question '+q+' of '+s.items.length+' · '+s.correct+' correct</small></div><span class="review-pill">'+escapeHtml(state.mode.toUpperCase())+'</span></div><div class="session-progress"><span style="width:'+pct+'%"></span></div>'
  }
  function finishSession(){
    if(!state.session)return;state.session.completed=true;state.session.finishedAt=Date.now();logActivity('session',{unitId:state.session.unitId,title:state.session.title,correct:state.session.correct,total:state.session.items.length,skipped:state.session.skipped});
    renderSessionPanel();renderPractice();renderCourse();if(state.view==='dna')renderDNA()
  }
  function renderSessionSummary(){
    const s=state.session;if(!s||!s.completed)return;
    const accuracy=Math.round(s.correct/s.items.length*100),uniqueImproved=Array.from(new Set(s.improved)),mistakes=Array.from(new Set(s.mistakes));
    els.practiceStage.innerHTML='<div class="session-summary"><span class="eyebrow">SESSION SUMMARY</span><h2>'+accuracy+'% retrieval score</h2><p>You completed '+s.items.length+' adaptive questions. Correct answers were scheduled for later review; difficult items will return sooner.</p><div class="session-summary-grid"><article><strong>'+s.correct+'</strong><small>correct</small></article><article><strong>'+uniqueImproved.length+'</strong><small>patterns strengthened</small></article><article><strong>'+mistakes.length+'</strong><small>patterns to revisit</small></article></div>'+(mistakes.length?'<div class="session-mistakes"><small>REVISIT</small>'+mistakes.slice(0,5).map(function(id){return'<span>'+escapeHtml(getPattern(id).title)+'</span>'}).join('')+'</div>':'<div class="session-win">✓ No persistent mistakes recorded in this session.</div>')+'<div class="session-summary-actions">'+(mistakes.length?'<button type="button" class="primary-btn" data-session-retry>Repair mistakes</button>':'')+'<button type="button" class="secondary-btn" data-course-return>Back to course</button><button type="button" class="secondary-btn" data-smart-review>Smart practice</button></div></div>'
  }
  function nextPracticeQuestion(currentId){
    const due=duePatterns().filter(function(p){return p.id!==currentId});if(due.length)return due[0];
    const ordered=patterns.slice().sort(function(a,b){const aScore=(5-progressFor(a.id))*24+a.power-(reviewRecord(a.id)?8:0),bScore=(5-progressFor(b.id))*24+b.power-(reviewRecord(b.id)?8:0);return bScore-aScore||a.rank-b.rank});
    return ordered.find(function(p){return p.id!==currentId})||getPattern(currentId)
  }
  function recordIncorrect(p){
    scheduleReview(p.id,2);logActivity('answer',{pattern:p.id,mode:state.mode,correct:false});
    if(state.session&&!state.session.completed&&!state.session.mistakes.includes(p.id))state.session.mistakes.push(p.id)
  }
  function successForCurrent(quality){
    const completedId=state.currentId,completedMode=state.mode,skill=practiceSkillForMode(completedMode);
    scheduleReview(completedId,quality==null?4:quality);
    if(!state.skills[completedId])state.skills[completedId]={};state.skills[completedId][skill]=true;persistSkills();
    logActivity('answer',{pattern:completedId,mode:completedMode,correct:true,quality:quality==null?4:quality});
    if(state.session&&!state.session.completed){
      state.session.correct+=1;state.session.improved.push(completedId);state.session.index+=1;
      if(state.session.index>=state.session.items.length){toast('✓ Lesson complete.');finishSession();return}
      const item=state.session.items[state.session.index];state.currentId=item.patternId;state.mode=item.mode;els.practiceSelect.value=state.currentId;
      document.querySelectorAll('.mode-card').forEach(function(b){b.classList.toggle('active',b.dataset.mode===state.mode)});
      toast('✓ Correct — next question.');renderAllProgress();renderSessionPanel();return
    }
    const next=nextPracticeQuestion(completedId);state.currentId=next.id;els.practiceSelect.value=next.id;toast('✓ Correct — next question.');renderAllProgress()
  }

  function reviewStatusHtml(p){const r=reviewRecord(p.id),intel=patternIntelligence(p);return'<div class="review-status"><span class="review-pill">'+intel.level+'</span><span class="review-pill">'+intel.usefulness+' usefulness</span><span class="review-pill">'+(r?'Memory: '+formatDue(r.due):'Memory: not scheduled')+'</span>'+(r?'<span class="review-pill">Interval: '+(r.interval?r.interval+' day'+(r.interval===1?'':'s'):'15 min')+'</span>':'')+'</div>'}
  function renderPractice(){
    if(state.session&&state.session.completed){renderSessionSummary();return}
    const p=getPattern(state.currentId);els.practiceSelect.value=p.id;const ex=p.examples[0]||['',p.practice.answers[0]];
    let body='<div class="practice-head"><div><span class="mini-badge '+p.type+'">'+typeLabel(p.type)+'</span><h2>'+escapeHtml(p.title)+'</h2><p>'+escapeHtml(p.rule)+'</p>'+reviewStatusHtml(p)+'</div><span class="practice-score">'+progressFor(p.id)+' / 5 skills</span></div>';
    if(state.mode==='write')body+='<div class="prompt-box"><span class="prompt-label">WRITE IN SPANISH</span><strong>'+escapeHtml(p.practice.prompt)+'</strong></div><form class="answer-form" id="writingForm"><input id="writingAnswer" autocomplete="off" placeholder="Type your Spanish answer…" aria-label="Your Spanish answer"><button class="primary-btn" type="submit">Check</button></form><div class="practice-actions"><button class="secondary-btn" type="button" data-reveal="'+escapeHtml(p.practice.answers[0])+'">Show answer</button><button class="secondary-btn" type="button" data-speak="'+escapeHtml(p.practice.answers[0])+'">🔊 Hear it</button></div>';
    else if(state.mode==='speak'){const target=speakTargetForPattern(p);body+='<div class="pronunciation-coach"><div class="pronunciation-target"><div><small>SAY THIS IN SPANISH</small><strong>'+escapeHtml(target)+'</strong><div class="reading-guide" aria-label="Stress clue">'+stressCueHtml(target)+'</div></div><span class="review-pill">Word-level feedback</span></div><p class="speech-tip">'+escapeHtml(pronunciationTip(target))+'</p><div class="practice-actions"><button class="mic-btn" type="button" id="micButton">🎙 Start speaking</button><button class="secondary-btn" type="button" data-speak="'+escapeHtml(target)+'">🔊 Hear normal</button><button class="secondary-btn" type="button" data-speak-slow="'+escapeHtml(target)+'">🐢 Hear slowly</button><button class="secondary-btn" type="button" id="selfCheckSpeak">Mic unavailable? Self-check ✓</button></div><div class="pronunciation-result empty" id="pronunciationResult">Say the phrase to get word-by-word recognition feedback and recurring sound-focus hints.</div></div>'}
    else if(state.mode==='hear')body+='<button class="big-listen" type="button" data-speak="'+escapeHtml(p.practice.answers[0])+'">🔊 Tap to hear Spanish</button><div class="prompt-box"><span class="prompt-label">WHAT DOES IT MEAN?</span><strong>Choose the closest English meaning.</strong></div><div class="choice-grid"><button class="choice-btn" type="button" data-choice="true">'+escapeHtml(ex[0])+'</button><button class="choice-btn" type="button" data-choice="false">'+escapeHtml(p.practice.wrong)+'</button></div>';
    else if(state.mode==='choice')body+='<div class="prompt-box"><span class="prompt-label">THIS OR THAT</span><strong>'+escapeHtml(p.practice.prompt)+'</strong></div><div class="choice-grid"><button class="choice-btn" type="button" data-choice="true">'+escapeHtml(p.practice.answers[0])+'</button><button class="choice-btn" type="button" data-choice="false">'+escapeHtml(p.practice.wrong)+'</button></div>';
    else{const good2=p.examples[1]?p.examples[1][1]:p.practice.answers[0];body+='<div class="prompt-box"><span class="prompt-label">TICK EVERY EXAMPLE THAT FITS</span><strong>'+escapeHtml(p.title)+'</strong></div><div class="tick-list"><label class="tick-item"><input type="checkbox" data-tick="good"><span>'+escapeHtml(ex[1])+'</span></label><label class="tick-item"><input type="checkbox" data-tick="bad"><span>'+escapeHtml(p.practice.wrong)+'</span></label><label class="tick-item"><input type="checkbox" data-tick="good"><span>'+escapeHtml(good2)+'</span></label></div><button class="primary-btn" type="button" id="checkTicks">Check ticks</button>'}
    body+='<div class="feedback" id="practiceFeedback">Retrieval strengthens memory. Reveal or skip whenever you need to.</div><div class="practice-footer"><small>'+(state.session?'Correct answers move straight to the next question.':'Correct answers schedule a later review and move to the next question.')+'</small><button class="skip-btn" type="button" id="skipPractice">Skip for now →</button></div>';
    els.practiceStage.innerHTML=body;bindPractice(p)
  }
  function bindPractice(p){
    const form=document.getElementById('writingForm');if(form)form.addEventListener('submit',function(e){e.preventDefault();const ans=normalize(document.getElementById('writingAnswer').value),ok=p.practice.answers.some(function(a){return normalize(a)===ans});feedback(ok,ok?'✓ Correct. Moving to the next question…':'Almost. Try again, or tap “Show answer”.');if(ok)successForCurrent(5);else recordIncorrect(p)});
    const mic=document.getElementById('micButton');if(mic)mic.addEventListener('click',function(){startRecognition(p)});
    const selfSpeak=document.getElementById('selfCheckSpeak');if(selfSpeak)selfSpeak.addEventListener('click',function(){feedback(true,'Self-check saved. Moving on.');successForCurrent(3)});
    const ticks=document.getElementById('checkTicks');if(ticks)ticks.addEventListener('click',function(){const boxes=Array.from(els.practiceStage.querySelectorAll('[data-tick]')),ok=boxes.every(function(b){return(b.dataset.tick==='good')===b.checked});feedback(ok,ok?'✓ Exactly. Moving to the next question…':'Not quite. Tick only the examples that fit the target link.');if(ok)successForCurrent(4);else recordIncorrect(p)});
    const skip=document.getElementById('skipPractice');if(skip)skip.addEventListener('click',skipPractice)
  }
  function skipPractice(){
    if(state.session&&!state.session.completed){state.session.skipped+=1;state.session.index+=1;if(state.session.index>=state.session.items.length){finishSession();return}const item=state.session.items[state.session.index];state.currentId=item.patternId;state.mode=item.mode;els.practiceSelect.value=state.currentId;toast('Skipped — no penalty.');renderSessionPanel();renderPractice();return}
    const p=nextBestPattern();if(p.id===state.currentId){const ordered=patterns.slice().sort(function(a,b){return a.rank-b.rank}),i=ordered.findIndex(function(x){return x.id===state.currentId});state.currentId=ordered[(i+1)%ordered.length].id}else state.currentId=p.id;els.practiceSelect.value=state.currentId;toast('Skipped — no penalty. Here is another useful link.');renderPractice()
  }

  function tokeniseSpeech(text){return normalize(text).split(' ').filter(Boolean)}
  function analysePronunciation(target,heard){
    const targetWords=tokeniseSpeech(target),heardWords=tokeniseSpeech(heard),words=targetWords.map(function(word,i){const spoken=heardWords[i]||'',score=spoken?pronunciationSimilarity(word,spoken):0;return{target:word,heard:spoken,score:score,categories:SOUND_CATEGORIES.filter(function(cat){return cat.test(word)}).map(function(cat){return cat.id})}});
    const score=pronunciationSimilarity(target,heard),focus=[];
    words.forEach(function(w){if(w.score<78)w.categories.forEach(function(id){if(!focus.includes(id))focus.push(id)})});
    return{score:score,words:words,focus:focus}
  }
  function recordPronunciationWeaknesses(analysis){
    analysis.words.forEach(function(word){word.categories.forEach(function(id){const old=state.pronunciationWeaknesses[id]||{attempts:0,total:0,misses:0};old.attempts+=1;old.total+=word.score;if(word.score<78)old.misses+=1;old.lastAt=Date.now();state.pronunciationWeaknesses[id]=old})});persistPronunciationWeaknesses()
  }
  function pronunciationWeaknessSummary(){
    return Object.keys(state.pronunciationWeaknesses).map(function(id){const row=state.pronunciationWeaknesses[id],meta=SOUND_CATEGORIES.find(function(x){return x.id===id});return{id:id,label:meta?meta.label:id,attempts:row.attempts,average:row.attempts?Math.round(row.total/row.attempts):100,misses:row.misses||0}}).filter(function(x){return x.attempts>=1}).sort(function(a,b){return a.average-b.average||b.misses-a.misses})
  }
  function renderPronunciationResult(analysis,heard,target){
    const box=document.getElementById('pronunciationResult');if(!box)return;const score=analysis.score,label=score>=90?'Excellent match':score>=75?'Strong match':score>=60?'Close — refine it':'Keep shaping the sound';
    const wordHtml=analysis.words.map(function(w){const cls=w.score>=85?'good':w.score>=60?'warn':'bad';return'<button type="button" class="speech-word '+cls+'" data-pronounce-word="'+escapeHtml(w.target)+'"><strong>'+escapeHtml(w.target)+'</strong><small>'+w.score+'%'+(w.heard?' · '+escapeHtml(w.heard):' · missed')+'</small></button>'}).join('');
    const focusLabels=analysis.focus.map(function(id){const x=SOUND_CATEGORIES.find(function(cat){return cat.id===id});return x?x.label:id});
    box.className='pronunciation-result';box.innerHTML='<div class="pronunciation-score-row"><div><small>SPEECH-RECOGNITION MATCH</small><strong>'+escapeHtml(label)+'</strong></div><strong>'+score+'%</strong></div><div class="pronunciation-meter"><span style="width:'+score+'%"></span></div><div class="speech-word-grid">'+wordHtml+'</div><div class="pronunciation-transcript">You said: <b>'+escapeHtml(heard)+'</b><br>Target: <b>'+escapeHtml(target)+'</b></div>'+(focusLabels.length?'<p class="speech-tip"><b>Focus next:</b> '+escapeHtml(focusLabels.join(' · '))+'. Tap a difficult word above to practise only that word.</p>':'<p class="speech-tip">All target words were recognised strongly. Repeat once more for consistency.</p>')
  }
  function makeRecognition(target,onResult,onEnd){
    const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;if(!Recognition)return null;
    const rec=new Recognition();rec.lang='es-ES';rec.interimResults=false;rec.maxAlternatives=5;
    rec.onresult=function(e){const alternatives=Array.from(e.results[0]).map(function(r){return r.transcript});let best={heard:alternatives[0]||'',score:0};alternatives.forEach(function(heard){const score=pronunciationSimilarity(target,heard);if(score>best.score)best={heard:heard,score:score}});onResult(best)};
    rec.onerror=function(){feedback(false,'I could not capture that clearly. Check microphone permission and try again.')};rec.onend=function(){if(onEnd)onEnd()};return rec
  }
  function startWordRecognition(word,patternId){
    const rec=makeRecognition(word,function(best){const analysis=analysePronunciation(word,best.heard);recordPronunciationWeaknesses(analysis);const box=document.getElementById('pronunciationResult');if(box)box.insertAdjacentHTML('afterbegin','<div class="word-focus-result"><strong>'+escapeHtml(word)+' · '+best.score+'%</strong><small>Recognised as “'+escapeHtml(best.heard)+'”. '+escapeHtml(best.score>=80?'Good — return to the full phrase.':pronunciationTip(word))+'</small></div>')},function(){});
    if(!rec){feedback(false,'Speech recognition is unavailable in this browser. Use slow audio and repeat the word aloud.');return}feedback(true,'Listening for “'+word+'”…');rec.start()
  }
  function startRecognition(p){
    const target=speakTargetForPattern(p),mic=document.getElementById('micButton'),rec=makeRecognition(target,function(best){
      const analysis=analysePronunciation(target,best.heard);recordPronunciation(p.id,best.score,best.heard,target);recordPronunciationWeaknesses(analysis);logActivity('speech',{pattern:p.id,score:best.score});renderPronunciationResult(analysis,best.heard,target);
      const quality=best.score>=92?5:best.score>=78?4:best.score>=62?3:2;
      if(best.score>=62){feedback(true,'✓ Speech recognised. '+best.score+'% match — moving on.');successForCurrent(quality)}else{recordIncorrect(p);feedback(false,'I heard “'+best.heard+'”. Tap a difficult word, use slow audio, then try again.')}
    },function(){if(mic){mic.disabled=false;mic.textContent='🎙 Start speaking'}});
    if(!rec){feedback(false,'Speech recognition is unavailable in this browser. Use “Hear slowly”, repeat aloud, then use self-check.');return}mic.disabled=true;mic.textContent='Listening…';rec.start()
  }

  function renderDNA(){
    const totalSkills=patterns.length*SKILLS.length;let built=0;patterns.forEach(function(p){built+=progressFor(p.id)});const pct=Math.round(built/totalSkills*100),strongPatterns=patterns.filter(function(p){return isStrong(p.id)}).length;
    document.getElementById('dnaPercent').textContent=pct+'%';document.getElementById('dnaRing').style.background='conic-gradient(var(--green) '+(pct*3.6)+'deg, var(--surface-2) 0deg)';document.getElementById('skillSummary').innerHTML=SKILLS.map(function(s){const count=patterns.filter(function(p){return!!(state.skills[p.id]||{})[s.key]}).length;return'<article class="skill-stat"><span>'+s.icon+'</span><strong>'+count+'</strong><small>'+s.label+' links</small></article>'}).join('');
    const review=reviewSummary(),pron=pronunciationSummary(),sentenceStrong=SENTENCE_DNA.filter(function(fr){return isStrong(fr.id)}).length;document.getElementById('dnaPatternStrong').textContent=strongPatterns;document.getElementById('dnaReviewDue').textContent=review.due;document.getElementById('dnaPronunciation').textContent=pron.average==null?'—':pron.average+'%';document.getElementById('dnaSentenceStrong').textContent=sentenceStrong+'/'+SENTENCE_DNA.length;
    document.getElementById('memoryHealth').innerHTML='<span class="eyebrow">MEMORY HEALTH</span><h3>'+review.due+(review.due===1?' review':' reviews')+' due</h3><p>'+(review.scheduled?'LanguageDNA is spacing '+review.scheduled+' practiced pattern'+(review.scheduled===1?'':'s')+'. '+(review.next?'Next future review '+formatDue(review.next.due)+'.':''):'Complete practice items to build your personal review schedule.')+'</p><div class="health-stat-row"><div class="health-stat"><strong>'+review.scheduled+'</strong><small>scheduled</small></div><div class="health-stat"><strong>'+review.strong+'</strong><small>14+ day intervals</small></div></div>';
    document.getElementById('pronunciationHealth').innerHTML='<span class="eyebrow">SPEAKING PROFILE</span><h3>'+(pron.average==null?'No scored attempts yet':pron.average+'% average match')+'</h3><p>'+(pron.attempts?'Across '+pron.attempts+' microphone attempt'+(pron.attempts===1?'':'s')+' on '+pron.patterns+' pattern'+(pron.patterns===1?'':'s')+'. Best match: '+pron.best+'%.':'Use Speak practice with the microphone to build a pronunciation profile.')+'</p><div class="health-stat-row"><div class="health-stat"><strong>'+pron.attempts+'</strong><small>attempts</small></div><div class="health-stat"><strong>'+(pron.best==null?'—':pron.best+'%')+'</strong><small>best match</small></div></div>';
    document.getElementById('dnaMap').innerHTML=FAMILY_META.map(function(f){const list=patterns.filter(function(p){return patternFamilies(p).includes(f.key)}).sort(function(a,b){return progressFor(b.id)-progressFor(a.id)||a.rank-b.rank}).slice(0,6);return'<section class="dna-family"><h3>'+f.icon+' '+f.title+'</h3><div class="dna-nodes">'+list.map(function(p){const r=reviewRecord(p.id);return'<button type="button" class="dna-node" data-open="'+p.id+'"><strong>'+escapeHtml(p.title)+'</strong><small>'+progressFor(p.id)+'/5 skills'+(r&&r.due<=Date.now()?' · review due':'')+'</small></button>'}).join('')+'</div></section>'}).join('');
    const lenses=['WHO','WHAT','WHERE','WHY','WHEN'];document.getElementById('coverageGrid').innerHTML=lenses.map(function(l){const all=patterns.filter(function(p){return p.lenses.includes(l)}),points=all.reduce(function(n,p){return n+progressFor(p.id)},0),max=all.length*5,q=max?Math.round(points/max*100):0;return'<article class="coverage-card"><strong>'+l+'</strong><div class="coverage-bar"><span style="width:'+q+'%"></span></div><small>'+q+'% skill coverage</small></article>'}).join('');
    const next=nextBestPattern();document.getElementById('nextBestTitle').textContent=next.title;document.getElementById('nextBestText').textContent=reviewRecord(next.id)&&reviewRecord(next.id).due<=Date.now()?'This link is due for memory retrieval now.':progressFor(next.id)===0?'A high-value connection you have not started yet.':'Strengthen the weakest remaining skill in this useful link.';document.getElementById('nextBestButton').dataset.pattern=next.id;updateWordReach()
  }
  let wordReachLoading=false;
  function updateWordReach(){
    const el=document.getElementById('dnaWordReach');if(!el)return;
    if(dictionaryIndex){const seen=new Set();Object.keys(dictionaryIndex.byPattern||{}).forEach(function(id){if(progressFor(id)>=3)(dictionaryIndex.byPattern[id].words||[]).forEach(function(pair){seen.add(normalize(pair[0]))})});el.textContent=seen.size.toLocaleString();return}
    if(wordReachLoading)return;wordReachLoading=true;loadDictionaryIndex().then(function(){wordReachLoading=false;if(state.view==='dna')updateWordReach()}).catch(function(){wordReachLoading=false;el.textContent='—'})
  }
  function renderAllProgress(){document.getElementById('headerMastered').textContent=patterns.filter(function(p){return isStrong(p.id)}).length;renderStarters();renderSentenceDNA();renderReviewBar();if(state.view==='library')renderLibrary();if(state.view==='dna')renderDNA();if(state.view==='practice')renderPractice()}

  let dictionaryPromise=null,dictionaryIndex=null;
  function dictionaryPatternRef(dictionary){return getPattern(dictionary.id)||{id:dictionary.id,title:dictionary.title||dictionary.id}}
  function buildDictionaryIndex(){
    if(dictionaryIndex)return dictionaryIndex;
    const db=window.LANGUAGE_DNA_PATTERN_DICTIONARIES||{},en=new Map(),es=new Map();
    Object.keys(db).forEach(function(id){
      const dictionary=db[id],pattern=dictionaryPatternRef(dictionary);
      (dictionary.words||[]).forEach(function(pair){
        const item={english:String(pair[0]||''),spanish:String(pair[1]||''),pattern:pattern};
        const enKey=normalize(item.english),esKey=normalize(item.spanish);
        if(!enKey||!esKey)return;
        if(!en.has(enKey))en.set(enKey,[]);
        if(!es.has(esKey))es.set(esKey,[]);
        en.get(enKey).push(item);es.get(esKey).push(item);
      });
    });
    dictionaryIndex={en:en,es:es,patterns:Object.keys(db).length,byPattern:db};
    return dictionaryIndex;
  }
  function loadDictionaryIndex(){
    if(window.LANGUAGE_DNA_PATTERN_DICTIONARIES)return Promise.resolve(buildDictionaryIndex());
    if(dictionaryPromise)return dictionaryPromise;
    dictionaryPromise=new Promise(function(resolve){
      const existing=document.querySelector('script[data-language-dna-lexicon]');
      if(existing){
        existing.addEventListener('load',function(){resolve(buildDictionaryIndex())},{once:true});
        existing.addEventListener('error',function(){resolve(null)},{once:true});
        return;
      }
      const script=document.createElement('script');
      script.src='pattern-data.js?v=5';
      script.async=true;
      script.dataset.languageDnaLexicon='true';
      script.onload=function(){resolve(buildDictionaryIndex())};
      script.onerror=function(){resolve(null)};
      document.head.appendChild(script);
    });
    return dictionaryPromise;
  }
  function uniqueTexts(values,exclude){
    const seen=new Set(),out=[],blocked=normalize(exclude||'');
    values.forEach(function(value){
      const text=String(value||'').trim(),key=normalize(text);
      if(!text||!key||key===blocked||seen.has(key))return;
      seen.add(key);out.push(text);
    });
    return out;
  }
  async function internalTranslation(query,source,target){
    const q=normalize(query);
    for(let i=0;i<patterns.length;i++){
      const p=patterns[i];
      for(let j=0;j<p.examples.length;j++){
        const en=String(p.examples[j][0]),es=String(p.examples[j][1]);
        if(source==='en'&&normalize(en)===q)return{text:es,pattern:p,alternatives:[],source:'core'};
        if(source==='es'&&normalize(es)===q)return{text:en,pattern:p,alternatives:[],source:'core'};
      }
    }
    const index=await loadDictionaryIndex();
    if(!index)return null;
    const matches=(source==='en'?index.en:index.es).get(q)||[];
    if(!matches.length)return null;
    const values=matches.map(function(item){return source==='en'?item.spanish:item.english});
    const primary=values[0];
    return{
      text:matches.length===1||source==='en'?primary:'',
      fallbackText:primary,
      alternatives:uniqueTexts(values.slice(1),primary).slice(0,3),
      pattern:matches[0].pattern,
      source:'dictionary',
      matchCount:matches.length
    };
  }
  function guessDirection(text){const raw=String(text||'').trim().toLowerCase();if(/[ñáéíóúü¿¡]/i.test(raw))return['es','en'];const spanish=new Set(['el','la','los','las','un','una','de','del','que','qué','y','en','a','al','por','para','con','sin','es','soy','eres','esta','está','estoy','tengo','hola','gracias','casa','comer','hablar','vivir','donde','dónde','cuando','cuándo','porque','quien','quién']);const words=normalize(raw).split(' ');return words.some(function(w){return spanish.has(w)})?['es','en']:['en','es']}
  function inferPattern(sourceText,translatedText,sourceLang){
    const s=normalize(sourceText),t=normalize(translatedText),en=sourceLang==='en'?s:t,es=sourceLang==='en'?t:s;
    if(dictionaryIndex){
      const exact=(dictionaryIndex.en.get(en)||[]).find(function(item){return normalize(item.spanish)===es});
      if(exact)return exact.pattern;
      const byEnglish=(dictionaryIndex.en.get(en)||[])[0];if(byEnglish)return byEnglish.pattern;
      const bySpanish=(dictionaryIndex.es.get(es)||[])[0];if(bySpanish)return bySpanish.pattern;
    }
    for(let i=0;i<patterns.length;i++){const p=patterns[i];for(let j=0;j<p.examples.length;j++){const e=normalize(p.examples[j][0]),sp=normalize(p.examples[j][1]);if((e===en&&sp===es)||e===en||sp===es)return p}}
    const question={who:'question-words',what:'question-words',where:'question-words',why:'question-words',when:'question-words'};if(question[en])return getPattern(question[en]);
    const rules=[[function(){return/tion$/.test(en)&&/cion$/.test(es)},'tion-cion'],[function(){return/ity$/.test(en)&&/idad$/.test(es)},'ity-idad'],[function(){return/ous$/.test(en)&&/os[oa]$/.test(es)},'ous-oso'],[function(){return/ly$/.test(en)&&/mente$/.test(es)},'ly-mente'],[function(){return en.indexOf('ph')>=0&&es.indexOf('f')>=0},'ph-f'],[function(){return/ic$/.test(en)&&/ic[oa]$/.test(es)},'ic-ico'],[function(){return/ist$/.test(en)&&/ista$/.test(es)},'ist-ista'],[function(){return/(ance|ence)$/.test(en)&&/(ancia|encia)$/.test(es)},'ance-encia'],[function(){return/ive$/.test(en)&&/iv[oa]$/.test(es)},'ive-ivo']];
    for(let k=0;k<rules.length;k++)if(rules[k][0]())return getPattern(rules[k][1]);return null;
  }
  function relatedDictionaryPairs(patternId,query,translated){
    if(!dictionaryIndex||!dictionaryIndex.byPattern||!dictionaryIndex.byPattern[patternId])return[];
    const words=dictionaryIndex.byPattern[patternId].words||[],q=normalize(query),t=normalize(translated),i=words.findIndex(function(pair){return normalize(pair[0])===q||normalize(pair[1])===q||normalize(pair[0])===t||normalize(pair[1])===t}),start=Math.max(0,(i<0?0:i)-2),out=[];
    for(let n=start;n<words.length&&out.length<4;n++){const pair=words[n];if(normalize(pair[0])!==q&&normalize(pair[1])!==q&&normalize(pair[0])!==t&&normalize(pair[1])!==t)out.push(pair)}return out
  }
  function translatorDnaHtml(query,translated,source,pattern,local){
    if(!pattern)return'';const spanish=source==='en'?translated:query,related=relatedDictionaryPairs(pattern.id,query,translated),relatedHtml=related.length?'<div class="translator-dna-card"><small>Same DNA pattern</small><div class="translator-related">'+related.map(function(pair){return'<button type="button" data-translate-word="'+escapeHtml(source==='en'?pair[0]:pair[1])+'">'+escapeHtml(pair[0])+' → '+escapeHtml(pair[1])+'</button>'}).join('')+'</div></div>':'',sourceText=local&&local.source==='dictionary'?'Production dictionary match':'Pattern inferred from this translation';
    return'<section class="translator-dna"><div class="translator-dna-head"><div><small>LANGUAGE DNA</small><strong>'+escapeHtml(pattern.title)+'</strong></div><span class="review-pill">'+escapeHtml(sourceText)+'</span></div><p class="translator-dna-rule">'+escapeHtml(pattern.rule||'This word follows a reusable English ↔ Spanish connection.')+'</p><div class="translator-dna-grid"><div class="translator-dna-card"><small>Stress clue</small><strong class="reading-guide">'+stressCueHtml(spanish)+'</strong><p class="speech-tip">'+escapeHtml(pronunciationTip(spanish))+'</p></div>'+relatedHtml+'</div><div class="translator-actions"><button type="button" class="primary-btn" data-practice="'+pattern.id+'">Practise this link</button>'+(FULL_PATTERN_DICTIONARIES.has(pattern.id)?'<button type="button" class="secondary-btn" data-open="'+pattern.id+'">Open full dictionary</button>':'')+'<button type="button" class="secondary-btn" data-speak-slow="'+escapeHtml(spanish)+'">🐢 Hear slowly</button></div></section>'
  }

  function initTranslator(){
    const form=document.getElementById('translationForm'),input=document.getElementById('translationInput'),direction=document.getElementById('translationDirection'),swap=document.getElementById('translationSwap'),button=document.getElementById('translationButton'),result=document.getElementById('translationResult');
    let lastPair=['en','es'];
    input.addEventListener('focus',function(){loadDictionaryIndex()},{once:true});
    async function translate(){
      const query=input.value.trim();
      if(!query){result.innerHTML='<div class="translation-empty"><span>⌕</span><p>Type a word first.</p></div>';input.focus();return}
      const pair=direction.value==='en-es'?['en','es']:direction.value==='es-en'?['es','en']:guessDirection(query);
      lastPair=pair;
      const source=pair[0],target=pair[1],sourceName=source==='en'?'English':'Spanish',targetName=target==='es'?'Spanish':'English';
      button.disabled=true;button.textContent='Translating…';
      result.innerHTML='<div class="translation-loading"><span></span><p>Looking up <strong>'+escapeHtml(query)+'</strong>…</p></div>';
      try{
        const local=await internalTranslation(query,source,target);
        let translated=local&&local.text?local.text:'',alternatives=local&&local.alternatives?local.alternatives.slice():[];
        if(!translated){
          try{
            const controller=new AbortController(),timer=setTimeout(function(){controller.abort()},9000);
            const url='https://api.mymemory.translated.net/get?q='+encodeURIComponent(query)+'&langpair='+encodeURIComponent(source+'|'+target);
            const response=await fetch(url,{signal:controller.signal});clearTimeout(timer);
            if(!response.ok)throw new Error('Lookup failed');
            const data=await response.json();
            translated=String(data&&data.responseData&&data.responseData.translatedText||'').trim();
            const liveAlternatives=Array.from(new Set((data.matches||[]).map(function(m){return String(m.translation||'').trim()}).filter(Boolean))).filter(function(x){return normalize(x)!==normalize(translated)});
            alternatives=uniqueTexts(alternatives.concat(liveAlternatives),translated).slice(0,3);
          }catch(apiError){
            if(local&&local.fallbackText)translated=local.fallbackText;else throw apiError;
          }
        }
        if(!translated)throw new Error('No translation');
        const pattern=local&&local.pattern?local.pattern:inferPattern(query,translated,source);
        const sourceCode=source==='es'?'es-ES':'en-GB',targetCode=target==='es'?'es-ES':'en-GB';
        const hintLabel=local&&local.source==='dictionary'?'LanguageDNA dictionary match':'LanguageDNA link found';
        const hint=pattern?'<button type="button" class="translation-pattern-hint" data-open="'+pattern.id+'"><span>🧬</span><span><small>'+hintLabel+'</small><strong>'+escapeHtml(pattern.title)+'</strong></span><span>→</span></button>':'';
        const alt=alternatives.length?'<div class="translation-alternatives"><small>Other possible matches</small><div>'+alternatives.map(function(a){return'<span>'+escapeHtml(a)+'</span>'}).join('')+'</div></div>':'';
        result.innerHTML='<div class="translation-meta">'+sourceName+' → '+targetName+'</div><div class="translation-pair"><div class="translation-side"><small>'+sourceName+'</small><strong>'+escapeHtml(query)+'</strong><button class="audio-dot" type="button" data-speak-lang="'+sourceCode+'" data-speak="'+escapeHtml(query)+'">🔊</button></div><div class="translation-arrow">→</div><div class="translation-side target"><small>'+targetName+'</small><strong>'+escapeHtml(translated)+'</strong><button class="audio-dot" type="button" data-speak-lang="'+targetCode+'" data-speak="'+escapeHtml(translated)+'">🔊</button></div></div>'+hint+alt+translatorDnaHtml(query,translated,source,pattern,local);
      }catch(err){
        result.innerHTML='<div class="translation-error"><strong>Live translation is unavailable right now.</strong><p>You can still browse and practise every pattern offline.</p></div>';
      }finally{button.disabled=false;button.textContent='Translate'}
    }
    form.addEventListener('submit',function(e){e.preventDefault();translate()});
    swap.addEventListener('click',function(){const pair=direction.value==='auto'?lastPair:direction.value==='en-es'?['en','es']:['es','en'];direction.value=pair[0]==='en'?'es-en':'en-es';if(input.value.trim())translate()});
  }

  document.addEventListener('click',function(e){
    const view=e.target.closest('[data-view]');if(view){goView(view.dataset.view);return}
    const open=e.target.closest('[data-open]');if(open){openPattern(open.dataset.open);return}
    const practice=e.target.closest('[data-practice]');if(practice){startPractice(practice.dataset.practice,'write');return}
    const smart=e.target.closest('[data-smart-review]');if(smart){startSmartReview();return}
    const courseLevel=e.target.closest('[data-course-level]');if(courseLevel&&!courseLevel.disabled){state.courseLevel=courseLevel.dataset.courseLevel;localStorage.setItem('ldna-course-level',state.courseLevel);renderCourse();return}
    const unitLesson=e.target.closest('[data-unit-lesson]');if(unitLesson&&!unitLesson.disabled){const hit=courseUnitById(unitLesson.dataset.unitLesson);if(hit)startLessonSession(hit.unit.title,hit.unit.patterns,hit.unit.id);return}
    const unitPattern=e.target.closest('[data-unit-pattern]');if(unitPattern&&!unitPattern.disabled){openPattern(unitPattern.dataset.unitPattern);return}
    const sentence=e.target.closest('[data-sentence-frame]');if(sentence){state.sentenceFrame=sentence.dataset.sentenceFrame;state.sentenceExample=0;renderSentenceDNA();return}
    const sentenceNext=e.target.closest('[data-sentence-next]');if(sentenceNext){const f=sentenceFrame();state.sentenceExample=(state.sentenceExample+1)%f.variants.length;renderSentenceDNA();return}
    const translateWord=e.target.closest('[data-translate-word]');if(translateWord){const input=document.getElementById('translationInput');input.value=translateWord.dataset.translateWord;document.getElementById('translationForm').requestSubmit();return}
    const familyJump=e.target.closest('[data-family-jump]');if(familyJump){state.family=familyJump.dataset.familyJump;state.lens=null;goView('library');renderFamilies();renderLibrary();return}
    const family=e.target.closest('[data-family]');if(family){state.family=family.dataset.family;renderFamilies();renderLibrary();return}
    const lens=e.target.closest('[data-lens]');if(lens){state.lens=state.lens===lens.dataset.lens?null:lens.dataset.lens;document.querySelectorAll('[data-lens]').forEach(function(x){x.classList.toggle('active',x.dataset.lens===state.lens)});renderLibrary();return}
    const homeLens=e.target.closest('[data-home-lens]');if(homeLens){state.lens=homeLens.dataset.homeLens;state.family='all';goView('library');document.querySelectorAll('[data-lens]').forEach(function(x){x.classList.toggle('active',x.dataset.lens===state.lens)});renderLibrary();return}
    const mode=e.target.closest('[data-mode]');if(mode){state.mode=mode.dataset.mode;document.querySelectorAll('.mode-card').forEach(function(x){x.classList.toggle('active',x===mode)});renderPractice();return}
    const reveal=e.target.closest('[data-reveal]');if(reveal){scheduleReview(state.currentId,1);feedback(true,'Answer: '+reveal.dataset.reveal+' · This link will return soon for retrieval.');return}
    const choice=e.target.closest('[data-choice]');if(choice){const ok=choice.dataset.choice==='true';els.practiceStage.querySelectorAll('.choice-btn').forEach(function(b){b.disabled=true});choice.classList.add(ok?'correct':'incorrect');feedback(ok,ok?'✓ Correct. You recognised the link.':'Not this one. Compare the pattern and try the other option.');if(ok)successForCurrent(4);else scheduleReview(state.currentId,2);return}
    const slow=e.target.closest('[data-speak-slow]');if(slow){speakText(slow.dataset.speakSlow,'es-ES',.62);return}
    const speech=e.target.closest('[data-speak]');if(speech){speakText(speech.dataset.speak,speech.dataset.speakLang||'es-ES');return}
    const skillPractice=e.target.closest('[data-skill-practice]');if(skillPractice){startPractice(skillPractice.dataset.id,skillPractice.dataset.skillPractice);return}
  });
  els.dialog.querySelector('.dialog-close').addEventListener('click',function(){els.dialog.close()});els.dialog.addEventListener('click',function(e){if(e.target===els.dialog)els.dialog.close()});
  [els.search,els.type,els.level].forEach(function(el){el.addEventListener(el===els.search?'input':'change',renderLibrary)});
  document.getElementById('quickFilters').addEventListener('click',function(e){const b=e.target.closest('[data-quick]');if(!b)return;state.quick=b.dataset.quick;document.querySelectorAll('[data-quick]').forEach(function(x){x.classList.toggle('active',x===b)});renderLibrary()});
  document.getElementById('clearLens').addEventListener('click',function(){state.lens=null;document.querySelectorAll('[data-lens]').forEach(function(x){x.classList.remove('active')});renderLibrary()});
  document.getElementById('resetFilters').addEventListener('click',function(){els.search.value='';els.type.value='all';els.level.value='all';state.quick='all';state.lens=null;state.family='all';document.querySelectorAll('[data-quick]').forEach(function(x){x.classList.toggle('active',x.dataset.quick==='all')});document.querySelectorAll('[data-lens]').forEach(function(x){x.classList.remove('active')});renderFamilies();renderLibrary()});
  document.getElementById('startBeginner').addEventListener('click',function(){openPattern(patterns.slice().sort(function(a,b){return a.rank-b.rank})[0].id)});
  els.practiceSelect.addEventListener('change',function(){state.currentId=els.practiceSelect.value;renderPractice()});
  document.getElementById('nextBestButton').addEventListener('click',function(e){const p=getPattern(e.currentTarget.dataset.pattern||patterns[0].id);startPractice(p.id,recommendedMode(p))});
  document.getElementById('themeButton').addEventListener('click',function(){document.body.classList.toggle('dark');state.theme=document.body.classList.contains('dark')?'dark':'light';localStorage.setItem('ldna-theme',state.theme)});
  initTranslator();populatePracticeSelect();renderFamilies();renderStarters();renderSentenceDNA();renderCourse();renderLibrary();renderReviewBar();renderSessionPanel();renderPractice();renderAllProgress();
  if('serviceWorker'in navigator&&location.protocol.indexOf('http')===0)navigator.serviceWorker.register('./service-worker.js?v=5').catch(function(){});

})();
