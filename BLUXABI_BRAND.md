# BluXabi — brand identity and safe migration

**Product name:** BluXabi (capital B and X).
**Mascot name:** Xabi. Use the approved Xabi artwork in `assets/mascot/`.
**Product proposition:** Learn Spanish by spotting reusable connections between English and Spanish. The design can later support other languages, but do not claim that the website currently teaches them.

## User-facing naming
Use **BluXabi** in the homepage, dictionary, lesson explanations, installed-app name, backup UI, and any future on-screen references. Call the character **Xabi**.

## Backward compatibility
The GitHub repository and published GitHub Pages URL remain `Cornelius-Aurelius/LANGUAGE-DNA` for now, so existing links continue working. Do not rename the repository or break cloud-auth redirect URLs as part of a visual rebrand.

Existing `ldna-*` browser storage keys, `window.LanguageDNA*` JavaScript APIs, `LANGUAGE_DNA_*` data globals, and `app: 'LanguageDNA'` backup envelopes are **internal legacy compatibility contracts**. Keep them stable until a separate, tested migration is planned. People must still be able to restore their old exports and sync progress safely.

The filename for newly downloaded backups can show BluXabi without changing the envelope format.

## Brand clearance
Preliminary exact-name web searches did not reveal an obvious established use of `BluXabi`. This is **not** trademark clearance or proof that any domain is available. Perform authoritative UK/international trademark and live domain checks before registering, advertising or migrating domains.
