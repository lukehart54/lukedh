# lukedh.com

Personal blog and website, built with [Astro](https://astro.build/) using the
[AstroPaper](https://github.com/satnaing/astro-paper) theme.

## Running locally

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # production build into dist/
```

Requires Node 22.12 or newer.

## Writing a post

Add a Markdown file to `src/content/posts/`. The frontmatter needs at least a
title, description, and publish date:

```markdown
---
title: My post
description: A one-line summary.
pubDatetime: 2026-08-10T00:00:00Z
tags:
  - example
---

Body goes here.
```

Set `draft: true` to keep a post out of the build.

## Site settings

Everything site-wide — title, author, domain, social links, posts per page —
lives in `astro-paper.config.ts`. The About page is `src/content/pages/about.md`.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the site
and publishes it to GitHub Pages at https://lukedh.com. The custom domain is set
by `public/CNAME`.

## License

Theme licensed under MIT — see [LICENSE](LICENSE).
