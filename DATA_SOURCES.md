# LanguageDNA Data Sources

The learner-facing site layout is unchanged. This file documents the lexical data powering the Pattern Dictionary pages.

## Production sources

**English:** Princeton WordNet, packaged by Open Multilingual Wordnet.
- OMW path: `wns/eng/wn-data-eng.tab`
- Blob: `4ddc0bdeba3323afc6e264243a17bba7bbf0b07a`
- License: WordNet License

**Spanish:** Multilingual Central Repository (MCR), packaged by Open Multilingual Wordnet.
- OMW path: `wns/mcr/wn-data-spa.tab`
- Blob: `86c9e367d64a794300b414e55c78b54dbb07eb27`
- License: CC BY 3.0
- Attribution: Multilingual Central Repository / IXA group

## Acceptance method

An automatically sourced English ↔ Spanish pair is included only when:
1. both lemmas share a WordNet synset;
2. the synset part of speech fits the LanguageDNA pattern;
3. both sides are single-word lemmas;
4. both spellings match an explicit LanguageDNA transformation;
5. normalized stems pass a pattern-specific edit-similarity threshold;
6. the strongest Spanish candidate is chosen when several match;
7. hand-curated LanguageDNA entries override automated candidates.

This build contains **31 full word-pattern dictionaries** with **9,507 English ↔ Spanish rows**.

## Current full word-pattern families

- `-tion → -ción`
- `-sion → -sión`
- `-ity → -idad`
- `-ous → -oso / -osa`
- `-ly → -mente`
- `-ic → -ico / -ica`
- `-ive → -ivo / -iva`
- `-ist → -ista`
- `-ance / -ence → -ancia / -encia`
- `-ism → -ismo`
- `-able / -ible → -able / -ible`
- `-ant / -ent → -ante / -ente`
- `-ize → -izar`
- `-fy → -ficar`
- `-al → -al`
- `-ment → -mento`
- `-ment → -miento`
- `-ary → -ario / -aria`
- `-ory → -orio / -oria`
- `-ture → -tura`
- `-tude → -tud`
- `-logy → -logía`
- `-graphy → -grafía`
- `-cracy → -cracia`
- `-nomy → -nomía`
- `-metry → -metría`
- `-scope → -scopio`
- `-ct → -cto / -cta`
- `-id → -ido / -ida`
- `-ate → -ar`
- `ph → f`

## Next validation layers

Current Wiktionary/Wiktextract (Kaikki) and Spanish UniMorph are suitable additional sources for later sense, morphology and inflection validation. They are not silently mixed into this build: each new source will be tracked explicitly with its license and extraction rules.
