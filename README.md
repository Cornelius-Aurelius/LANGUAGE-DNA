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
