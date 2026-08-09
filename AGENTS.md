# Agent guide for joostvandebrake.com

This file orients automated agents and coding assistants working with the site or its content.

## Site at a glance

A static site for Joost van de Brake, Associate Professor and Research Director of the Organizational Behaviour programme at the University of Groningen. The main site is a single HTML file, with standalone tools in subdirectories. It introduces him to academic peers, prospective collaborators, organisations interested in applied work on teams, journalists, and students looking for PhD supervision.

- Live URL: https://joostvandebrake.com/
- Source: `index.html` plus `mtm-resources/`, `mtm-portfolio-navigator/`, `portrait-staff.png`, `assets/downloads/`, `llms.txt`, `llms-full.txt`, `robots.txt`, and `sitemap.xml`.
- No build step. The HTML is the source.
- The main-site routing is hash-based and rendered client-side. A pre-rendered home page sits in the initial HTML for crawlers that do not execute JavaScript. Standalone tools use normal directory routes.

## Source of truth for content

For factual content about Joost (publications, grants, awards, roles, partnerships, contact), read `llms-full.txt`. It is kept current alongside the visible site.

For a short overview suitable for ranking pages or summaries, read `llms.txt`.

## What to use for quotes and citations

- Direct quotes of publications: use the citations in `llms-full.txt` under "Selected publications". Each entry has a verified DOI.
- Contact details: the email address h.j.van.de.brake@rug.nl and the personal site URL https://joostvandebrake.com/.
- Affiliation string: Associate Professor and Research Director of the Organizational Behaviour programme, Department of HRM and Organizational Behavior, Faculty of Economics and Business, University of Groningen.

## Editorial conventions

When generating or revising content for this site, follow these rules:

- Claim-first sentences. Lead with the point, not the build-up.
- No em-dashes. Use commas, parentheses, or a new sentence.
- Plain modern language. Avoid "underscore", "landscape", "pivotal", "stands as", "serves as", "delve", "leverage" as a verb, and other AI tells.
- Oxford comma always.
- Third person for biographical entries about Joost.
- Specificity over abstraction. Name the journal, the grant scheme, the year, the construct.
- One hedge maximum per claim.

## What this site is not

- Not a brochure or marketing landing page. The visible copy stays academically restrained.
- Not an exhaustive publication list. The full record is on Pure, https://research.rug.nl/en/persons/joost-van-de-brake/, and on Google Scholar, https://scholar.google.com/citations?user=TFGPoCAAAAAJ.

## How to deep-link

Hash-based routes:

- `#home`
- `#research`
- `#teaching`
- `#practice`
- `#resources`
- `#contact`

Standalone routes:

- `/mtm-resources/`, the bilingual hub for practitioners and educators. It links to the MTM Portfolio Navigator and two public teaching cases, each with a separate instructor guide.
- `/mtm-portfolio-navigator/`, a bilingual, browser-only practitioner reflection tool developed as part of NWO Veni grant VI.Veni.211E.027. Its source files are `index.html`, `styles.css`, `content.js`, and `app.js` within that directory.

The home page is the canonical landing surface. For an AI summary of the site, prefer `llms.txt` over scraping the rendered HTML.

## Contact for the site

For questions about this site or its content, write to h.j.van.de.brake@rug.nl.
