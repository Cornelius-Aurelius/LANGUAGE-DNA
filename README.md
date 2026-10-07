# LanguageDNA — English → Spanish Pattern App

A browser-first prototype built around:

- Pareto-ranked English → Spanish patterns
- Visual, Sound, and Writing/Structure pattern families
- WHO / WHAT / WHERE / WHY / WHEN meaning lenses
- Searchable and filterable Pattern Library
- Five practice modes: Writing, Speaking, Hearing, This or That, Ticking
- Browser speech synthesis for Spanish audio
- Browser speech recognition where supported
- Local progress persistence with `localStorage`
- Responsive mobile/desktop UI
- Offline-capable service worker when served over HTTP/HTTPS

## Run locally

You can open `index.html` directly for most features. For the install/offline service worker, serve the folder over HTTP, for example:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Deploy

This is a static site and can be deployed to GitHub Pages, Netlify, Vercel, Cloudflare Pages, or imported into another web builder as HTML/CSS/JS.

## Current content

The starter library contains 60 hand-authored patterns. It is designed so the pattern dataset can later be moved into JSON/database storage and expanded substantially.
