# LanguageDNA Tutor + Daily 5 + Vocabulary 100/500/1000 v7

Generated: 2026-10-07

## Design goal

Make Spanish easier by using English the learner already knows, keeping each interaction small, and only increasing depth when the learner chooses it.

## Daily 5

The Daily 5 is a deliberately short five-step plan:

1. one due/next-best memory link;
2. one useful Everyday core item;
3. one additional useful Everyday core item;
4. one short pronunciation check, biased toward recurring weak sound categories when available;
5. one three-turn real-life scenario.

The plan uses local learner state: spaced-review due dates, Everyday Familiar progress and pronunciation weakness history.

## Conversation Tutor

The current GitHub Pages build uses a **local constrained conversation coach**, not an unrestricted cloud language model. This avoids embedding a paid/private API key in a public static site.

The coach:

- keeps replies short;
- uses starter essentials plus vocabulary the learner marked Familiar as its readiness boundary;
- offers English help only when requested;
- offers one suggested reply when the learner is stuck;
- accepts close variants using local string similarity;
- explains one useful connection after a successful reply;
- keeps each scenario to three turns.

A future authenticated backend could replace the local dialogue engine with a true generative AI tutor while preserving the same unlocked-vocabulary boundary.

## Real-life scenarios

Nine scenarios are included:

- café;
- hotel;
- airport;
- taxi;
- shopping;
- directions;
- doctor;
- emergency;
- meeting people.

Each scenario shows readiness based on the learner's familiar vocabulary. A supported mode remains available when some required words are new.

## Vocabulary 100 → 500 → 1,000

The first 100 remain the manually curated beginner core.

Ranks 101–1,000 are selected from the existing Data Quality v2 production Pattern Dictionaries. They therefore inherit the project's quality-gated English ↔ Spanish lexical backbone rather than being generated from arbitrary translations.

The expansion adds:

- English and Spanish;
- source Pattern Dictionary;
- approximate LanguageDNA learner level;
- usefulness/priority band;
- word-family/pattern information;
- morphology/pattern transformation;
- a simple example frame;
- source/usage note.

The displayed learner levels and usefulness bands are LanguageDNA teaching heuristics. They are not official CEFR assessments or exact corpus-frequency rankings.

The browser defaults to 100 and shows only 20 items per page, so storing 1,000 entries does not mean showing 1,000 entries to a beginner at once.

## Game Mode

The v7 upgrade deliberately does **not** change Game Mode mechanics, scoring, difficulty ladder, answer reveal behaviour or 37/40 pass rule.
