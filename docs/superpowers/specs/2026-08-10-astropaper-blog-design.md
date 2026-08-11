# Personal Blog — AstroPaper Setup Design

**Date:** 2026-08-10
**Goal:** A simple personal blog/website at `https://lukedh.com`, built on the AstroPaper theme, hosted on GitHub Pages. Keep everything as close to stock as possible.

## Approach

Scaffold with the official template method:

```
npm create astro -- --template satnaing/astro-paper
```

This produces a clean copy (no upstream git history) in `C:\dev\lukedh`. Chosen over cloning/forking because it is the theme's recommended path and keeps the repo independent of upstream.

## Configuration

All personalization lives in AstroPaper's `src/config.ts` and `astro.config.ts`:

- **Site URL:** `https://lukedh.com`
- **Title / author:** Luke Hartley
- **Social links:** single GitHub link only (demo socials removed)
- **Content:** delete all demo posts; add one `hello-world.md` placeholder post
- **About page:** trimmed to a one-line stub to fill in later

Untouched (works out of the box): search, tags, light/dark mode, RSS, sitemap, OG images.

## Deployment

- GitHub Actions workflow builds and deploys to GitHub Pages on every push to `main` (using the official `withastro/action` if AstroPaper doesn't ship a workflow).
- Custom domain `lukedh.com` configured via a `public/CNAME` file.
- Manual steps for Luke after push:
  1. Enable Pages in the repo settings (Source: GitHub Actions).
  2. Add DNS records at the domain registrar: four `A` records on the apex (`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`) and optionally a `www` CNAME to `<username>.github.io`.
- Repo creation/push: done locally; pushed with `gh` if authenticated, otherwise left for Luke to push.

## Success criteria

- `npm run build` completes with no errors.
- Dev server renders the site with Luke's name, the placeholder post, and no demo content.
- Workflow file present and valid so the first push deploys.
