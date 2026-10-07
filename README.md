# LanguageDNA — English → Spanish Pattern Learning

LanguageDNA teaches Spanish through reusable links between English and Spanish rather than isolated vocabulary lists.

## Current experience

- Beginner-first home screen
- English ↔ Spanish translator with offline-first exact lookup across all 8,264 production dictionary rows, then live translation fallback
- Visual, sound, sentence, verb and question pattern families
- WHO / WHAT / WHERE / WHY / WHEN meaning lenses
- Connected next-pattern links
- Five-skill mastery per pattern: See, Hear, Write, Speak, Use
- Writing, speaking, hearing, choice and rapid-recognition practice
- Skip and reveal-answer controls with no penalty
- LanguageDNA map showing pattern growth by family and meaning
- Responsive mobile and desktop layouts
- Offline app shell for the pattern library and practice engine

The current starter library contains 60 hand-authored English → Spanish patterns and is designed to expand into a much larger lexical and grammatical graph.

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

LanguageDNA now combines five learner-facing upgrades while keeping the existing four-tab structure:

- **Translator DNA:** exact dictionary matches and live translations can reveal the reusable pattern, a stress clue, related same-pattern words, slow audio and a direct practice action.
- **Pronunciation coach:** Speak practice uses browser speech recognition, normal/slow model audio, Spanish stress cues, transcript comparison and a recognition-match score. This score measures how closely the browser recognised the intended phrase; it is not a laboratory phoneme/accent score.
- **Adaptive spaced review:** successful retrieval schedules a later review, difficult/revealed items return sooner, and Smart Review selects due material before recommending new high-value links.
- **Sentence DNA Lab:** eight curated sentence frames show fixed structure versus replaceable slots, rotate through examples, play Spanish audio and jump directly into practice.
- **My DNA intelligence:** the learner dashboard now shows strong patterns, due reviews, speech-match history, sentence-frame strength, memory health and an honest estimate of pattern-linked dictionary words in reach.

The scheduling and learner model are local-first and stored in browser storage, so the static GitHub Pages app does not require an account or backend.
