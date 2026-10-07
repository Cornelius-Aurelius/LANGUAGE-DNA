# LanguageDNA — English → Spanish Pattern Learning

LanguageDNA teaches Spanish through reusable links between English and Spanish rather than isolated vocabulary lists.

## Current experience

- Beginner-first home screen
- English ↔ Spanish live word translator with subtle pattern detection
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

LanguageDNA now includes 15 dedicated full Pattern Dictionaries containing 850 curated English ↔ Spanish word pairs. New pattern families include `-ism → -ismo`, `-able/-ible`, `-ant/-ent → -ante/-ente`, `-ize → -izar`, `-fy → -ficar`, and `-al → -al`.

## Lexical data pipeline

The Pattern Dictionary data now uses English/Spanish lemmas aligned through Open Multilingual Wordnet: Princeton WordNet on the English side and Multilingual Central Repository Spanish on the Spanish side. Automated candidates are accepted only when they share a synset, match the required part of speech, match an explicit LanguageDNA transformation rule, and pass an orthographic stem-similarity threshold. Hand-curated pairs take priority.

See `DATA_SOURCES.md` and `data-build-report.json` for provenance, licenses, build rules, and per-pattern counts.
