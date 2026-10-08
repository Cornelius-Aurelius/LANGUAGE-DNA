# Secure Cloud Sync Integration Contract

LanguageDNA currently runs on static GitHub Pages, so it must not embed authentication secrets or pretend that local storage is a secure multi-device account.

The current app exposes `window.LanguageDNAProfile.getSnapshot()` and `restoreSnapshot(snapshot)`. A future authenticated backend can use that versioned payload without changing the learning engine.

A production cloud implementation should provide:

1. authenticated user identity through a real auth provider;
2. a per-user encrypted/secured data record;
3. server-side authorization so one user cannot read another user's progress;
4. conflict handling using the snapshot timestamp/version;
5. account deletion/export controls;
6. no service-role/admin secret in browser JavaScript.

Until that backend is configured, LanguageDNA provides local progress, installable PWA behavior, and explicit Backup / Restore so progress can be moved safely between devices by the learner.
