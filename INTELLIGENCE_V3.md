# LanguageDNA Intelligence v3

Generated: 2026-10-07

## Purpose

Intelligence v3 adds learner-priority intelligence on top of the verified lexical production corpus. It is designed to help LanguageDNA decide what to teach, when to review it, how to explain it, and what caveats to show.

## What remains source-backed lexical data

The production Pattern Dictionaries remain based on the existing Data Quality v2 pipeline:

- English and Spanish lemmas aligned through Open Multilingual Wordnet;
- explicit LanguageDNA spelling/pattern transformations;
- part-of-speech and stem-similarity constraints;
- Spanish lexical/morphology corroboration and English/Spanish frequency signals;
- unsupported automated candidates quarantined outside production.

Those production rows are the lexical backbone. Intelligence v3 does not claim to replace the source pipeline.

## New learner metadata

Every teaching pattern now receives:

- a LanguageDNA course placement (A1, A2 or B1 Bridge);
- a usefulness score derived from the existing pattern power/priority values;
- a teaching-confidence label based on how the pattern is already framed in the authored curriculum;
- membership in one or more guided course units.

These values are **teaching heuristics**, not externally certified CEFR labels or corpus-derived word-frequency percentiles.

## Translator intelligence

When a translation has a recognised LanguageDNA pattern, the learner can now see:

- course placement;
- usefulness heuristic;
- teaching-confidence label;
- spelling/sound rule;
- stress clue;
- related words using the same Pattern Dictionary;
- slow speech;
- direct practice;
- selected false-friend/meaning-trap warnings.

For regular verb families that LanguageDNA explicitly treats as regular, the UI can generate a present-tense family. It deliberately avoids presenting generated conjugations as authoritative for arbitrary irregular verbs.

## Pronunciation intelligence

The browser speech-recognition result is compared with the target phrase and broken into word-level recognition matches. LanguageDNA records recurring focus categories such as stress, r/rr, j/soft-g, ll/y, ñ, qu, c/z, b/v, silent h and stable vowels.

The percentage shown is a **speech-recognition match score**, not a laboratory phonetic, accent or intelligibility assessment.

## Adaptive learning

Correct retrieval schedules later review. Difficult, incorrect or revealed material returns sooner. Guided and Smart Practice sessions mix modes across eight questions, prioritising due material and weak/high-value patterns.

## Course stage

The A1 → A2 → B1 Bridge path is a LanguageDNA curriculum progression. The displayed course-stage estimate is not an official CEFR test result. “B1 Bridge” means the current pattern library is beginning to support broader independent reading and discussion vocabulary; it does not claim complete B1 coverage.

## Next data upgrade

A future source-pipeline pass should add row-level, externally grounded metadata where licenses and source quality permit, including:

- modern sense and usage labels from a current Wiktextract/Kaikki extraction;
- corpus-based frequency bands;
- regional labels;
- explicit false-friend risk;
- row-level confidence/provenance;
- richer inflection and morphology families from UniMorph.

Until then, the site keeps verified lexical evidence and learner-priority heuristics visibly distinct.
