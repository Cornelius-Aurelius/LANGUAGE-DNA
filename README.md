# LanguageDNA — English → Spanish Pattern Learning

LanguageDNA teaches Spanish through reusable links between English and Spanish rather than isolated vocabulary lists.

## Current experience

- Beginner-first home screen
- Guided A1 → A2 → B1 Bridge course path with progressive unit unlocking
- English-first Everyday 100 essentials with examples, learner level, usefulness, morphology and usage notes
- 40-question progression game with four choices, hidden marking during the test and a 37/40 pass threshold
- English ↔ Spanish translator with offline-first exact lookup across all 8,264 production dictionary rows, then live translation fallback
- Visual, sound, sentence, verb and question pattern families
- WHO / WHAT / WHERE / WHY / WHEN meaning lenses
- Connected next-pattern links
- Five-skill mastery per pattern: See, Hear, Write, Speak, Use
- Adaptive 8-question lessons plus writing, speaking, hearing, choice and rapid-recognition practice
- Skip and reveal-answer controls with no penalty
- LanguageDNA map showing pattern growth by family and meaning
- Responsive mobile and desktop layouts
- Offline app shell for the pattern library and practice engine

The current teaching library contains 82 hand-authored English → Spanish patterns and is designed to expand into a much larger lexical and grammatical graph.

This static HTML/CSS/JavaScript app is deployed with GitHub Pages.

## Full Pattern Dictionaries

Selected high-leverage word-link patterns now open dedicated A–Z dictionary pages with search, pagination, English/Spanish table rows, and a Spanish listen button on every word. Current full dictionaries include `-tion → -ción`, `-ity → -idad`, `-ous → -oso/-osa`, `-ly → -mente`, `ph → f`, `-ic → -ico/-ica`, `-ive → -ivo/-iva`, `-ist → -ista`, and `-ance/-ence → -ancia/-encia`.

### Dictionary expansion

LanguageDNA now includes 31 full Pattern Dictionaries. The WordNet-aligned expansion produced 9,507 candidate pairs; Data Quality v2 serves 8,264 production pairs and quarantines 1,243 unsupported automated candidates for review. All 850 hand-curated pairs are preserved.

## Lexical data pipeline

The Pattern Dictionary data now uses English/Spanish lemmas aligned through Open Multilingual Wordnet: Princeton WordNet on the English side and Multilingual Central Repository Spanish on the Spanish side. Automated candidates are accepted only when they share a synset, match the required part of speech, match an explicit LanguageDNA transformation rule, and pass an orthographic stem-similarity threshold. Hand-curated pairs take priority.

See `DATA_SOURCES.md` and `data-build-report.json` for provenance, licenses, build rules, and per-pattern counts.


## Data Quality v2

The production dictionaries now pass an additional corroboration gate using Spanish Wiktionary-derived lexical data, Spanish UniMorph, and English/Spanish frequency lists. Automated OMW rows with no support from any of those layers are moved to a review queue rather than shown to learners. This reduces the learner-facing set from 9,507 aligned candidates to 8,264 stronger production rows while preserving all 850 hand-curated pairs.

The learner-facing layout is unchanged. See `DATA_QUALITY.md`, `data-quality-report.json`, and `data-review-queue.json` for the audit rules and counts.

### Translator intelligence upgrade

The home translator now lazy-loads the production Pattern Dictionary lexicon on first use. Exact English or Spanish matches are resolved locally against all 31 full dictionaries before the app calls the live translation service. The local index covers 8,126 unique English lemmas and 7,664 unique Spanish lemmas across the 8,264 production rows. When multiple local reverse matches exist, LanguageDNA keeps the dictionary candidates as alternatives and can fall back to them if the live service is unavailable. This exposes the Data Quality v2 corpus directly through the existing learner-facing translator without redesigning the page.


## Learning Engine v4

LanguageDNA now combines five learner-facing upgrades while preserving the core product structure:

- **Translator DNA:** exact dictionary matches and live translations can reveal the reusable pattern, a stress clue, related same-pattern words, slow audio and a direct practice action.
- **Pronunciation coach:** Speak practice uses browser speech recognition, normal/slow model audio, Spanish stress cues, transcript comparison and a recognition-match score. This score measures how closely the browser recognised the intended phrase; it is not a laboratory phoneme/accent score.
- **Adaptive spaced review:** successful retrieval schedules a later review, difficult/revealed items return sooner, and Smart Review selects due material before recommending new high-value links.
- **Sentence DNA Lab:** eight curated sentence frames show fixed structure versus replaceable slots, rotate through examples, play Spanish audio and jump directly into practice.
- **My DNA intelligence:** the learner dashboard now shows strong patterns, due reviews, speech-match history, sentence-frame strength, memory health and an honest estimate of pattern-linked dictionary words in reach.

The scheduling and learner model are local-first and stored in browser storage, so the static GitHub Pages app does not require an account or backend.


## Learning Platform v5

LanguageDNA now adds a guided course layer and a deeper adaptive learner model on top of the existing pattern engine.

- **Guided A1 → A2 → B1 Bridge course:** structured units unlock progressively from prior mastery. The displayed course stage is a LanguageDNA learning-path estimate, not an official CEFR assessment.
- **Adaptive 8-question lessons:** course lessons and Smart Review mix question modes, prioritise due reviews and weak/high-value patterns, auto-advance after correct answers, and finish with a session summary plus mistake-repair option.
- **Intelligence v3 learner metadata:** every pattern receives a course-level placement, usefulness heuristic and teaching-confidence label. Translator results can also show known false-friend alerts and regular present-tense families for safely handled regular verb patterns.
- **Advanced speech coaching:** Speak mode now gives word-by-word recognition scores, remembers recurring sound categories, and lets learners re-practise a difficult word with the microphone.
- **My DNA command centre:** adds a personalised next action, seven-day activity view, strongest/weakest pattern families, recurring speech focus and a seven-day review calendar.
- **Local-first activity model:** practice, speech and session history stay in browser storage and power the learner dashboard without requiring an account.

See `INTELLIGENCE_V3.md` for the distinction between verified lexical data and LanguageDNA's learner-priority heuristics.


## Everyday Learning + Game Mode v6

The beginner experience now has a deliberately small **Everyday 100** layer built around English words and phrases learners already use: greetings, questions, needs, time, places, food/drink, safety and payment language. Items are shown 20 at a time, begin with English, and include a Spanish equivalent, short usage example, learner-level placement, usefulness heuristic, word family, morphology/forms where useful, usage notes and speech playback.

The Everyday 100 ordering is a LanguageDNA teaching priority for day-to-day usefulness, **not an exact corpus-frequency ranking**.

A dedicated **40-question Game Mode** now provides five increasing difficulty levels. Every question has four choices and no right/wrong answer is revealed while the test is in progress. After all 40 are answered, the learner receives a full colour-coded review. A pass requires **37/40 (92.5%)**; passing unlocks the next level, while a failed attempt keeps the learner at the same level and offers a missed-concepts review.

See `EVERYDAY_100_GAME.md` for the full behaviour and difficulty ladder.


## Tutor + Daily Learning + Vocabulary Expansion v7

LanguageDNA now adds four beginner-first upgrades while deliberately leaving the 40-question Game Mode rules and progression unchanged.

- **Daily 5:** a five-step lesson of roughly five minutes built from reviews due, unfamiliar Everyday vocabulary, recurring speech-focus data and a short real-life scenario. It is designed to add very little new information at once.
- **Conversation Tutor:** a local constrained conversation coach for short Spanish replies. It uses starter essentials plus vocabulary the learner marked Familiar, provides English help only when requested, and keeps conversations to three short turns rather than open-ended chat. It does not claim to be an unrestricted cloud LLM.
- **Real-life scenarios:** café, hotel, airport, taxi, shopping, directions, doctor, emergency and meeting-people practice, each with readiness based on familiar vocabulary and supported mode when some words are still new.
- **Vocabulary 100 → 500 → 1,000:** the first 100 remain hand-curated day-to-day essentials. Ranks 101–1,000 are drawn from the existing quality-gated production Pattern Dictionaries and retain English/Spanish links, pattern family, teaching-level heuristic, usefulness band, morphology/pattern information and simple example frames. The expansion labels are teaching heuristics, not official CEFR certification or exact corpus-frequency ranks.

The vocabulary browser still shows only 20 items per page and defaults to the core 100, so expanding the underlying data does not make the beginner screen more overwhelming.

See `TUTOR_DAILY_VOCAB_V7.md` for the learner-state logic, scenario design, static-site tutor boundary and vocabulary-tier provenance.


## Mobile + Daily + Tutor Intelligence v8

The learner experience now prioritises the smallest useful next action.

- **Game auto-advance:** choosing one of the four answers saves the selection and moves directly to the next question. Correctness remains hidden until the end, and the 37/40 pass rule is unchanged.
- **Simpler mobile navigation:** phones show five bottom actions — Home, Practice, Tutor, Game and More. Course, Patterns and My DNA remain available inside More, reducing crowding without removing features.
- **Daily 5 first:** the home page's primary CTA now starts the personalised five-minute lesson, and the Daily 5 card appears before secondary exploration sections.
- **Conversation corrections:** the constrained tutor accepts close natural variants, distinguishes learner vs coach messages, shows “you wrote / better reply / why” corrections, and keeps its own prompts close to familiar vocabulary.
- **Frequency-ranked Vocabulary 500/1,000:** ranks 101–1,000 are now re-ranked using both English and Spanish FrequencyWords 2018 50k lists on top of the existing Data Quality v2 production lexicon. Known high-risk false-friend mappings are excluded from the expansion. Cards can show source ranks, CEFR-estimate confidence, pattern family, regular conjugation families where safe, and curated natural examples for high-priority entries.

The first 100 remain hand-curated for everyday usefulness; corpus ranks are used only to improve the expansion order, not to replace beginner-first teaching judgment.


## Beginner Success Loop v9

The beginner path now behaves like one calm adaptive lesson rather than a menu of tasks.

- **One-step Daily 5:** only the current action is shown. The sequence is memory → English/Spanish link → use it → say it → real-life choice, with automatic progression and a quiet completion recap.
- **Silent adaptation:** LanguageDNA adjusts the number of choices and conversation length from familiar Everyday vocabulary, recent retrieval accuracy, Game Mode progression, review load and recurring pronunciation difficulty. The learner is not asked to pick a level before starting.
- **English-first teaching:** Daily 5 introduces one useful item at a time, explicitly shows the English → Spanish connection, reuses it in a natural example and asks the learner to say it aloud.
- **Beginner vocabulary gate:** Daily 5 stays inside the hand-curated Everyday 100 until that foundation is familiar. Expansion vocabulary must then pass stronger learner-priority, English/Spanish frequency and confidence gates; known high-risk false-friend mappings remain excluded.
- **Progressive conversations:** real-life scenarios begin at three short turns and can grow to four or five only when learner evidence supports it. Short correction wording remains “That makes sense. A more natural way: …”.
- **Practical My DNA outcomes:** the dashboard now adds Everyday words familiar, real-life situations ready and Daily 5 completions in the last seven days alongside pattern, review, sentence and pronunciation measures.
- **Local learning signals:** Daily starts/completions, wrong attempts, conversation corrections/completions, Game Mode results and vocabulary-familiar actions are recorded locally in browser storage. They are used for personal adaptation and are not sent to a LanguageDNA analytics server.
- **Spaced-review integration:** Daily 5 can perform a tiny review directly against the existing review scheduler instead of forcing the learner out into a separate lesson.

The current production lexical data does not contain full sense-level Wiktextract/Kaikki labels, so v9 does not fabricate modern-sense or regional-usage metadata. Frequency evidence, existing Data Quality v2 validation and explicit false-friend safeguards are used where supported by the current repository data.


## Simple Home v10

The landing screen is deliberately much smaller and follows a new product rule: learners should not have to understand the app before they can start learning.

- The first screen explains LanguageDNA in one sentence: **learn Spanish from English you already know**.
- One dominant action starts the personalised five-minute lesson immediately, with no setup or level test.
- One tiny English → Spanish example demonstrates the method before the learner has to read instructions.
- “How it works” is reduced to three steps: start with English → spot the Spanish link → use it straight away.
- Secondary actions are one tap away: Learn, Practice, 40-question Game, and Find a word.
- The full translator remains available as a compact research tool lower on the home page.
- Pattern previews, Sentence DNA, family browsers, meaning lenses and other advanced exploration no longer compete for attention on the landing screen; they remain available through the product navigation.
- The visible “Tutor” navigation label is renamed **Learn** so the purpose is immediately clear to a beginner.

The design goal is clarity and healthy engagement: immediate usefulness, visible progress and easy return paths without dark patterns or unnecessary setup.


## Simple Practice v11

Practice questions now prioritise learner understanding over system metadata.

- Technical badges such as course level, usefulness score, memory due state, review interval and x / 5 skills are removed from the question area.
- Every mode asks the task in plain English: write it, say it, listen and choose, choose the Spanish, or tick every example that matches.
- Every question has a **Need help?** control. It reveals one short hint, one example and practical advice without automatically revealing the full answer.
- Initial memory-system copy is hidden; feedback appears only after the learner answers.
- Review copy uses plain language such as “ready to review” and “practise now” instead of scheduler terminology.
- Skip remains available with no penalty.
- The learning engine still keeps difficulty, scheduling and skill state internally; those details no longer compete with the question itself.

The product rule is: if information does not help the learner understand the current question or decide what to do next, it should not be prominent in the learning flow.


## Translation Trust + One-Screen Practice v12

This release focuses on correctness, low-friction practice and immediate interaction feedback.

- The curated Everyday 100 is preloaded and checked before any live translation fallback is used.
- A checked common-word layer covers additional high-frequency basics such as man → hombre, woman → mujer, person → persona and family terms.
- Live MyMemory results are no longer accepted blindly. Candidate matches are ranked using exact-source match, service match/quality signals and usage evidence; the raw response is given very low priority.
- Live results are clearly labelled as context-dependent. Trusted Everyday/common matches can show their usage note.
- The Everyday 100 audit contains exactly 100 non-empty unique English entries and unique ranks. Context-sensitive items already carry notes for formality, gender, region or meaning where needed.
- The 31 production pattern dictionaries contain 8,264 rows with no empty pairs, duplicate pairs or stray terminal punctuation. Their existing Data Quality v2 gate remains the production lexical safeguard.
- Practice now jumps directly to the current question when opened.
- When there are no due reviews, the empty Quick Review banner is hidden.
- Practice intro, pattern selector and mode controls are compressed so the question and answer controls fit in one viewport much more often.
- Help opens as an overlay rather than pushing the answer field down the page.
- Audio buttons immediately show Loading… → Playing… → Played ✓ in Practice, translation, Tutor and vocabulary/Game areas.

## Pattern Teaching v13

Patterns are the core teaching unit, so every pattern now explains itself before asking the learner to memorise or practise it.

- Pattern popups lead with **What you're learning** in plain English.
- Every pattern shows one worked example plus a short **what to notice** explanation.
- Sound patterns no longer present cryptic mappings such as casa → a ≈ ah without explanation.
- The 5 stable vowels lesson now explicitly explains that Spanish a usually has a clear ah-like sound and uses casa as a worked pronunciation example.
- WHO / WHAT / WHERE / WHY / WHEN tags were removed from the teaching popup because they did not help explain the current pattern.
- Extra examples remain available but are clearly labelled as examples.
- Full Pattern Dictionary pages now begin with the same beginner explanation before the large word list.
- Pattern audio remains one tap away and pattern practice starts directly from the explanation.
- Generic English → Spanish ending patterns explain the ending change in normal language and explicitly say the pattern is a useful clue, not a guarantee for every word.

Product rule: a learner should be able to answer **What is this pattern teaching me?** after reading one short paragraph and one example.

## Learner-first Pattern Library v14

The Patterns screen now prioritises understanding the pattern instead of exposing internal scoring metadata.

- Removed learner-facing rank numbers, CEFR-style level badges, usefulness scores, confidence labels, WHO/WHAT/WHERE/WHY/WHEN chips and five tiny skill icons from pattern cards.
- Added one adaptive **Recommended next** pattern above the library so learners can continue without browsing.
- Each card now shows only: pattern type, pattern name, plain-English meaning, one worked example, simple learning status, Learn pattern and Practise.
- Search is one full-width field with simple category chips for Word patterns, Sounds, Sentences, Verbs and Questions.
- Removed the separate family tabs, meaning-lens panel and technical type/priority dropdowns from the learner interface.
- Progress remains visible only when it is useful: New pattern, Learning, or Strong.
- Mobile collapses to one clear card per row with the same two actions.

Product rule: the pattern itself must be visually more important than the metadata used to rank or schedule it.

## Adaptive Pattern Mastery v15

This release joins the app into one simple learner journey instead of exposing separate systems.

- A hidden next-best engine now weighs review timing, recent mistakes, answer speed, reveals, pronunciation evidence, pattern progress and teaching value.
- Learners do not see those scores. They see one plain recommendation and one Continue action.
- Every authored pattern has a mastery journey: Understand → See examples → Hear it → Practise → Use it → Real life → Review later.
- Word and sound patterns do not force unnecessary conversation; their real-life step is satisfied by successful use practice.
- Sentence, verb and question patterns can open a short real-life conversation focused on the learned pattern.
- Full Pattern Dictionary pages share the same journey and can return directly to the correct Practice item.
- Real-life conversation adds a Work scenario, can grow from 3 to 6 short turns, accepts more natural equivalent short replies, and keeps corrections gentle.
- My DNA now leads with meaningful outcomes: everyday words familiar, patterns usable, sentence frames strong and real-life situations ready.
- Patterns and My DNA use the same central recommendation, preventing conflicting next-step advice.
- Trusted common vocabulary now includes clear regional notes for words such as car, ticket, computer, mobile phone, apartment, juice and potato.

Product rule: complexity belongs in the engine; the learner should see one useful next step, one clear reason and one obvious action.

## Quality + Mobile Polish v16

This release prioritises reliability, clarity and mobile comfort over adding more learner-facing complexity.

- **Practice intelligence:** visual/writing questions rotate through real examples; recognition questions use four choices; repeated misses automatically switch to an easier recognition step and reveal help without making the learner hunt for it.
- **Pronunciation coaching:** browser speech recognition now gives one or two concrete sound/stress suggestions, word-level recognition feedback and an explicit reminder that this is not a phonetic/accent grade.
- **Language quality gate:** CI checks the Everyday 100, required core translations, context-sensitive notes, 31 production dictionaries / 8,264 rows, duplicate/empty rows, translation safety guards and runtime asset alignment.
- **Mobile ergonomics:** safe-area bottom navigation, smaller mobile header, 44px+ tap targets, 16px form fields to avoid iOS input zoom, reduced-motion support, keyboard-friendly practice scrolling and compact four-choice layouts.
- **Installable app:** richer manifest, install icon, app shortcuts and a safer service worker that distinguishes navigation fallback from JavaScript/CSS assets.
- **Daily goal:** one Daily 5 is the simple daily target; no streak pressure is required.
- **Progress portability:** My Spanish includes Backup progress and Restore backup. The export contains only LanguageDNA local progress keys and can be moved between devices by the learner.
- **Cloud-ready profile:** window.LanguageDNAProfile exposes a versioned snapshot/restore contract. Secure sign-in and automatic cross-device sync still require an authenticated backend; no secrets or fake account system are embedded in GitHub Pages.

Quality checks: `node tests/quality-check.js`
