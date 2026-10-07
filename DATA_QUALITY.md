# LanguageDNA Data Quality v2

Generated: 2026-10-07

## Result

- OMW-aligned candidate rows before quality gate: **9,507**
- Production rows after quality gate: **8,264**
- Automated rows quarantined for review: **1,243**
- Hand-curated rows preserved: **850**
- Full Pattern Dictionaries: **31**
- Learner-facing layout changed: **No**

## Quality gate

The existing lexical build already requires a shared English/Spanish Open Multilingual Wordnet synset, compatible part of speech, an explicit LanguageDNA transformation, and orthographic stem similarity.

Data Quality v2 adds independent corroboration from:

1. Spanish Wiktionary-derived lexical data;
2. Spanish UniMorph;
3. an English top-50k frequency list;
4. a Spanish top-50k frequency list.

An automatically generated row is moved out of production only when all of these are true:

1. it is not one of the original hand-curated LanguageDNA rows;
2. its Spanish lemma is absent from the Spanish Wiktionary-derived snapshot used in this audit;
3. its Spanish lemma is absent from Spanish UniMorph;
4. its English lemma is absent from the English top-50k frequency list; and
5. its Spanish lemma is absent from the Spanish top-50k frequency list.

Rows failing this conservative corroboration gate are retained in `data-review-queue.json` instead of being deleted.

## Why this is better

The previous expansion maximized breadth. Data Quality v2 adds a second objective: **corroborated lexical reality and learner usefulness**.

This avoids treating every same-synset cognate candidate as equally suitable for a learner-facing dictionary. Rare technical vocabulary can still survive when independently supported, while unsupported candidates stay out of production until reviewed.

## Important limitation

This pass validates lexical existence and morphology/frequency signals. It does not yet perform full modern-sense disambiguation, regional-label filtering, false-friend scoring, CEFR grading, or corpus-based phrase frequency.

## Next layer

The next upgrade should use a current Wiktextract/Kaikki JSON extraction for sense-level validation, part-of-speech detail, usage labels and false-friend risk. Spanish UniMorph can then power real conjugation and inflection families underneath each lemma.

Frequency should become a **ranking signal**, not a truth test.
