# LanguageDNA Cloud Sync — Release Checklist

Cloud sync is **optional** and stays **OFF** until `supabase-config.js` has a project URL and publishable key. Never expose service-role credentials in browser assets.

## Provisioned Supabase backend

- Organisation: CORNELIUS AURELIUS
- Project: LanguageDNA — `cjqjiijbperdxglnvpmy` (London / eu-west-2)
- API endpoint: `https://cjqjiijbperdxglnvpmy.supabase.co`
- Table: `public.learner_progress`
- RLS: enabled; four owner-only policies; no table SELECT permission for `anon`
- Migration 002 introduces an incrementing `revision` column and server-side trigger for compare-and-swap writes.
- Edge Function `delete-account`: deployed with JWT verification enabled; requires the current account password and explicit confirmation; cascades progress deletion through `auth.users`.
- Browser may use only the **publishable** project key. The service-role key stays in the Edge Function environment.

## Why progress is protected

1. The first sign-in on a device **never automatically chooses** between local and cloud progress.
2. On new sign-in or account switch, learners explicitly select which copy to use.
3. Every successful sync writes against the last-seen **revision**, so concurrent stale devices cannot silently overwrite the cloud.
4. When both local and cloud have changed, syncing pauses and shows a choice. Before replacing either one, a safety copy is kept in local browser storage.
5. Account-specific sync counters and revisions stay separate. Exports intentionally exclude `ldna-cloud-*` metadata and cached safety copies.
6. Learning works entirely without accounts, online sync, or the Supabase CDN.

## Remaining dashboard steps before enabling accounts

1. In the Supabase project dashboard, visit **Authentication → URL Configuration**.
2. Set **Site URL** to the production LanguageDNA page (verify the live domain first; for standard GitHub Pages this is `https://cornelius-aurelius.github.io/LANGUAGE-DNA/`).
3. Add allowed redirect URLs for the actual production entry points, including `/LANGUAGE-DNA/`, `/LANGUAGE-DNA/index.html` and the password recovery entry path/query. Use exact production URLs rather than loose wildcards.
4. Verify email/password signup and confirmation settings, email delivery limits, and the user-visible recovery email template.
5. Register two separate test accounts through the deployed site. Test signup, confirmation, password reset, signin, signout, account switching, two-device conflicting changes, exports, and account deletion. Confirm the two accounts cannot read each other's database rows.
6. Add the API endpoint and the publishable key in `supabase-config.js` **only after** those tests and redirect settings are verified. Never add a secret key. Version `supabase-config.js` and the service-worker cache for the activation release.
7. Confirm browser behaviour on current iOS Safari and Android Chrome, including returning from email links and offline re-entry.

## Current release policy

v17 can ship the improved learning experience and mobile design with cloud sync inactive. Do **not** claim that optional accounts are live or fully verified until the dashboard configuration and live auth integration tests are complete. The server-side database and delete-account function are provisioned, but deployment alone does not prove that email auth works.

## Developer verification

- `node tests/quality-check.js` — learning data, core functionality markers and simulated cloud sync safety tests.
- `npx playwright test tests/mobile-browser.spec.cjs` — real Chromium responsive homepage and navigation smoke checks.
- Supabase database checks: RLS, policies, grants, CAS revision trigger and security advisor.
