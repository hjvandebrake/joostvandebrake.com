# joostvandebrake.com

Personal website of Joost van de Brake. Research, teaching, and applied work on teams, multiple team membership, hybrid work, and modern team collaboration.

## What this is

A single-file static site with hash-based client-side routing and a pre-rendered home page for crawlers. English and Dutch toggle in the nav. No build step.

## Running locally

From the repo root:

```bash
python -m http.server 8000 --bind 127.0.0.1
```

Then open <http://127.0.0.1:8000/> in a browser.

## Structure

- `index.html`, the whole site (HTML, CSS, JS, data, and a pre-rendered home page).
- `portrait-staff.png`, hero portrait. `portrait.jpg` and `portrait-alt.jpg` are alternates kept for future use.
- `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`, `android-chrome-192.png`, `android-chrome-512.png`, `site.webmanifest`, the favicon set.
- `robots.txt`, `sitemap.xml`, `llms.txt`, `llms-full.txt`, `AGENTS.md`, the discovery and agent-orientation files.

## Editorial conventions

Content additions follow these rules:

- Claim-first sentences. Lead with the point.
- No em-dashes. Use commas, parentheses, or a new sentence.
- Plain modern language. Avoid words like "stands as", "serves as", "delve", "leverage" as a verb, and "pivotal".
- Oxford comma always.
- Third person for biographical entries.
- Specificity over abstraction. Name the journal, the grant scheme, the year, the construct.

## Deployment

The site is static and can be served by any HTTP server. Deployment notes for Railway and the canonical domain go here once configured.

## Contact

[h.j.van.de.brake@rug.nl](mailto:h.j.van.de.brake@rug.nl)
