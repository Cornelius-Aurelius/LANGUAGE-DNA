# LanguageDNA Language Quality Audit

## Scope

This release adds a repeatable regression audit for the learner-facing Spanish content and the production pattern corpus.

### Curated Everyday 100

The automated audit checks that:

- there are exactly 100 entries;
- every rank is unique;
- every English learner prompt is unique;
- every entry has Spanish, an English example, and a Spanish example;
- essential high-risk translations cannot silently regress (for example `Hi → Hola`, `Where is...? → ¿Dónde está...?`, `What time is it? → ¿Qué hora es?`, `I don't understand → No entiendo`, `Help! → ¡Ayuda!`);
- context-sensitive items such as **me, you, I am, know, tomorrow/morning, evening, time, there, lunch, and cash** must retain an explanatory note instead of being presented as universal one-to-one translations.

### Production pattern lexicon

The production pattern dictionaries are checked for:

- 31 expected pattern dictionaries;
- 8,264 production rows;
- no empty English/Spanish pairs;
- no duplicate pair inside the same pattern dictionary.

These checks complement the existing Data Quality v2 corroboration and quarantine pipeline. They do **not** claim that every possible historical/regional sense in all 8,264 rows has been manually expert-reviewed. Live translation results are still explicitly context-dependent and are ranked behind trusted local learner vocabulary.

### Regression safeguards

The quality test also verifies:

- the trusted `man → hombre` override remains present;
- live translation candidate ranking remains enabled;
- four-choice Practice and repeated-mistake scaffolding remain enabled;
- actionable pronunciation feedback remains enabled;
- PWA/profile assets are cached;
- versioned CSS/JS references remain aligned between the page and service worker.

Run locally with:

`node tests/quality-check.js`
