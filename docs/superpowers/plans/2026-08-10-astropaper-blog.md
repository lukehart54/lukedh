# AstroPaper Personal Blog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up a personal blog at `https://lukedh.com` using the AstroPaper theme, deployed to GitHub Pages, with all demo content removed and identity fields set to Luke Hartley.

**Architecture:** Scaffold AstroPaper v6 via its official template command into `C:\dev\lukedh`, which already contains a git repo holding the design spec. All site identity lives in one root file, `astro-paper.config.ts`; `astro.config.ts` derives `site` from it, so the domain is set in exactly one place. Content is file-based: posts in `src/content/posts/`, the About page in `src/content/pages/about.md`. Deployment is a GitHub Actions workflow we author ourselves, since the theme ships only a `ci.yml`.

**Tech Stack:** Astro 7, AstroPaper 6.1.0, TypeScript, Tailwind CSS v4, Pagefind (search), GitHub Actions, GitHub Pages.

## Global Constraints

- Node `>=22.12.0` required by AstroPaper 6.1.0. Local machine has v22.17.1 — satisfied, do not install another Node.
- Target domain is `lukedh.com` (apex). Because a custom domain is used, Astro's `base` stays at its default `/` — do **not** set a `base`.
- Site title and author: `Luke Hartley`.
- Only one social link is kept: GitHub. All other entries in `socials` are removed.
- Deploy branch is `main`. The existing repo was initialized with `master` and must be renamed.
- The scaffolder must write into a directory that already contains `.git/`, `.claude/`, and `docs/`. Do not delete those.
- Preserve the theme's existing key names in `astro-paper.config.ts`; only values change, except for removing `socials` entries.
- Windows note: the stock `build` script ends in `cp -r dist/pagefind public/`, which is not a valid command in cmd.exe (npm's default shell on Windows). Task 4 replaces it with a cross-platform equivalent. Do not attempt `npm run build` before Task 4 — it will fail on that final step even though the Astro build itself succeeded.

---

### Task 1: Scaffold AstroPaper into the existing directory

**Files:**
- Create: the full AstroPaper tree under `C:\dev\lukedh` (notably `package.json`, `astro.config.ts`, `astro-paper.config.ts`, `src/`, `public/`, `.github/workflows/ci.yml`)
- Preserve: `C:\dev\lukedh\.git\`, `C:\dev\lukedh\.claude\`, `C:\dev\lukedh\docs\`

**Interfaces:**
- Consumes: nothing.
- Produces: `astro-paper.config.ts` exporting `defineAstroPaperConfig({ site, posts, features, socials, shareLinks })`; `src/content/posts/` (post collection); `src/content/pages/about.md`; `package.json` with scripts `dev`, `build`, `preview`, `lint`, `format`.

- [ ] **Step 1: Scaffold into a temp directory, not in place**

`npm create astro` refuses to scaffold into a non-empty directory. Build it beside the project, then merge.

```powershell
npm create astro@latest "$env:TEMP\astro-paper-scaffold" -- --template satnaing/astro-paper --install --no-git --skip-houston --yes
```

Expected: dependencies install and the command reports success. If npm prompts interactively despite `--yes`, re-run with `--fail-on-prompt` removed and answer defaults.

- [ ] **Step 2: Merge the scaffold into the project, keeping existing dirs**

```powershell
$src = "$env:TEMP\astro-paper-scaffold"
Get-ChildItem -Path $src -Force | Where-Object { $_.Name -ne '.git' } | ForEach-Object {
  Copy-Item -Path $_.FullName -Destination "C:\dev\lukedh" -Recurse -Force
}
Remove-Item -Recurse -Force $src
```

- [ ] **Step 3: Verify the merge**

```powershell
Test-Path C:\dev\lukedh\astro-paper.config.ts
Test-Path C:\dev\lukedh\node_modules
Test-Path C:\dev\lukedh\docs\superpowers\specs
```

Expected: all three print `True`. If `node_modules` is missing, run `npm install` in `C:\dev\lukedh`.

- [ ] **Step 4: Rename the branch to main**

```powershell
git branch -m master main
```

- [ ] **Step 5: Commit the scaffold**

```powershell
git add -A
git commit -m "chore: scaffold AstroPaper v6 theme"
```

---

### Task 2: Set site identity and trim social links

**Files:**
- Modify: `astro-paper.config.ts` (the `site` block and the `socials` array)

**Interfaces:**
- Consumes: `astro-paper.config.ts` from Task 1.
- Produces: `config.site.url === "https://lukedh.com"`, consumed by `astro.config.ts` as `site:` and by the sitemap/RSS/canonical-URL generation.

- [ ] **Step 1: Replace the `site` block**

Set these values, leaving every other key in the file untouched:

```ts
  site: {
    url: "https://lukedh.com",
    title: "Luke Hartley",
    description: "Personal blog and website of Luke Hartley.",
    author: "Luke Hartley",
    profile: "https://lukedh.com",
    ogImage: "default-og.jpg",
    lang: "en",
    timezone: "Europe/London",
    dir: "ltr",
  },
```

- [ ] **Step 2: Reduce `socials` to GitHub only**

Replace the whole `socials` array:

```ts
  socials: [{ name: "github", url: "https://github.com/lukehart54" }],
```

- [ ] **Step 3: Point "Edit post" at this repo**

In `features.editPost.url`, replace the theme's URL:

```ts
    editPost: {
      enabled: true,
      url: "https://github.com/lukehart54/lukedh/edit/main/",
    },
```

If the repo will not be public, set `enabled: false` instead and delete the `url` line.

- [ ] **Step 4: Type-check the config**

Run: `npx astro check`
Expected: no errors referencing `astro-paper.config.ts`. Errors from demo posts are acceptable here; Task 3 deletes them.

- [ ] **Step 5: Commit**

```powershell
git add astro-paper.config.ts
git commit -m "feat: set site identity to lukedh.com"
```

---

### Task 3: Replace demo content

**Files:**
- Delete: everything under `src/content/posts/`
- Create: `src/content/posts/hello-world.md`
- Modify: `src/content/pages/about.md`

**Interfaces:**
- Consumes: the posts collection schema, which requires `title` (string), `description` (string), and `pubDatetime` (date); `tags` defaults to `["others"]` and `author` defaults to `config.site.author`.
- Produces: exactly one published post, so the index, archives, tags, and RSS pages all have non-empty content to render.

- [ ] **Step 1: Delete the demo posts**

```powershell
Remove-Item -Recurse -Force C:\dev\lukedh\src\content\posts\*
```

- [ ] **Step 2: Create the placeholder post**

Create `src/content/posts/hello-world.md`:

```markdown
---
title: Hello world
description: The first post on this site.
pubDatetime: 2026-08-10T00:00:00Z
tags:
  - meta
---

This site is up. More soon.
```

- [ ] **Step 3: Stub the About page**

Replace the body of `src/content/pages/about.md`, keeping its existing frontmatter keys but updating the values:

```markdown
---
title: About
description: About Luke Hartley.
---

I'm Luke. This is my corner of the web.
```

- [ ] **Step 4: Verify content builds and renders**

Run: `npx astro check`
Expected: PASS with no content-collection schema errors.

Then run `npm run dev` and open `http://localhost:4321`.
Expected: the header reads "Luke Hartley", exactly one post ("Hello world") is listed, `/about` shows the stub, and no AstroPaper demo posts appear anywhere. Stop the dev server afterwards.

- [ ] **Step 5: Commit**

```powershell
git add -A src/content
git commit -m "feat: replace demo content with placeholder post and about stub"
```

---

### Task 4: Make the build script cross-platform

**Files:**
- Modify: `package.json` (the `scripts.build` entry)
- Modify: `.gitignore` (add `public/pagefind` if absent)

**Interfaces:**
- Consumes: `package.json` from Task 1.
- Produces: an `npm run build` that succeeds on both Windows and the Ubuntu GitHub Actions runner. Task 5's workflow depends on this.

- [ ] **Step 1: Confirm the failure before fixing it**

Run: `npm run build`
Expected: `astro check` and `astro build` succeed, `pagefind` succeeds, then the final step fails with `'cp' is not recognized as an internal or external command`. This confirms the diagnosis rather than assuming it. If it unexpectedly passes, skip to Step 4 and leave the script alone.

- [ ] **Step 2: Replace the trailing copy with a Node equivalent**

In `package.json`, change the `build` script from:

```json
"build": "astro check && astro build && pagefind --site dist && cp -r dist/pagefind public/"
```

to:

```json
"build": "astro check && astro build && pagefind --site dist && node -e \"require('fs').cpSync('dist/pagefind','public/pagefind',{recursive:true})\""
```

`fs.cpSync` is available in Node 18+ and behaves identically on both platforms.

- [ ] **Step 3: Verify the build now passes end to end**

Run: `npm run build`
Expected: exits 0. Then confirm the output landed:

```powershell
Test-Path C:\dev\lukedh\dist\index.html
Test-Path C:\dev\lukedh\public\pagefind
```

Expected: both `True`.

- [ ] **Step 4: Ensure the copied search index is not committed**

Check `.gitignore` for `public/pagefind`. If missing, append it — it is generated output and will otherwise be committed on every build.

- [ ] **Step 5: Commit**

```powershell
git add package.json .gitignore
git commit -m "fix: make build script cross-platform"
```

---

### Task 5: Add GitHub Pages deployment and custom domain

**Files:**
- Create: `.github/workflows/deploy.yml`
- Create: `public/CNAME`

**Interfaces:**
- Consumes: the working `npm run build` from Task 4; `config.site.url` from Task 2.
- Produces: a workflow that publishes `dist/` to GitHub Pages on every push to `main`.

- [ ] **Step 1: Create the CNAME file**

Create `public/CNAME` containing exactly one line, no trailing content:

```
lukedh.com
```

Astro copies `public/` verbatim into `dist/`, so this lands at the site root where GitHub Pages expects it.

- [ ] **Step 2: Create the deploy workflow**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Build with Astro
        uses: withastro/action@v4
        with:
          node-version: 22

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

`withastro/action` detects the package manager, runs `npm run build`, and uploads `dist/` as the Pages artifact.

- [ ] **Step 3: Verify the workflow is valid YAML and the CNAME ships**

```powershell
npm run build
Get-Content C:\dev\lukedh\dist\CNAME
```

Expected: build exits 0 and prints `lukedh.com`.

Confirm the workflow parses:

```powershell
node -e "const y=require('fs').readFileSync('.github/workflows/deploy.yml','utf8'); if(!y.includes('actions/deploy-pages@v4')) process.exit(1); console.log('ok')"
```

Expected: prints `ok`. (A full YAML lint happens on GitHub; this catches truncation.)

- [ ] **Step 4: Commit**

```powershell
git add .github/workflows/deploy.yml public/CNAME
git commit -m "ci: deploy to GitHub Pages on push to main"
```

---

### Task 6: Push and hand off manual steps

**Files:**
- None modified.

**Interfaces:**
- Consumes: all prior commits on `main`.
- Produces: a remote repo and a written list of the steps only Luke can perform.

- [ ] **Step 1: Confirm the token has the `workflow` scope**

Run: `gh auth status`

As of planning time the token is authenticated as `lukehart54` but its scopes are `gist, read:org, repo` — **`workflow` is missing**. Without it, any push containing `.github/workflows/deploy.yml` is rejected with:

> refusing to allow an OAuth App to create or update workflow `.github/workflows/deploy.yml` without `workflow` scope

Granting the scope requires an interactive browser login, so it cannot be automated. If `workflow` is absent, stop here and ask Luke to run this himself in the session:

```
! gh auth refresh -h github.com -s workflow
```

Then resume at Step 2.

- [ ] **Step 2: Create the remote and push**

```powershell
gh repo create lukedh --public --source=. --remote=origin --push
```

Expected: the repo is created and `main` is pushed. If the push is rejected for the workflow scope, return to Step 1.

- [ ] **Step 3: Verify the first deploy**

Run: `gh run list --limit 1`
Expected: a `Deploy to GitHub Pages` run appears. It will fail until Pages is enabled in Step 4 — that is expected, and the run can be re-triggered from the Actions tab afterwards.

- [ ] **Step 4: Report the manual steps to Luke**

These cannot be automated and must be listed explicitly in the final summary:

1. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. In the repo: **Settings → Pages → Custom domain**, enter `lukedh.com` and save.
3. At the domain registrar for `lukedh.com`, add four apex `A` records pointing to `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`. Optionally add a `CNAME` for `www` pointing to `lukehart54.github.io`.
4. Once DNS resolves, tick **Enforce HTTPS** in the Pages settings.
5. Re-run the failed deploy workflow from the Actions tab if it ran before Pages was enabled.

---

## Verification Summary

The work is complete when all of the following hold, each confirmed by running the command and reading its output:

- `npm run build` exits 0 on Windows.
- `dist/index.html` and `dist/CNAME` exist, and `dist/CNAME` contains `lukedh.com`.
- `npm run dev` serves a site titled "Luke Hartley" with exactly one post and no AstroPaper demo content.
- `npx astro check` reports zero errors.
- `git log --oneline` shows the scaffold, identity, content, build-fix, and CI commits on `main`.
