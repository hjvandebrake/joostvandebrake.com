"""Generates the five page directories from index.html.

Research, Teaching, Practice, Resources, and Contact used to be fragments of
the home page (#research and so on). A fragment is not a document, so search
engines collapsed all five into the home page and none of them could rank on
its own. Each is now a real directory with its own title, description, and
canonical URL.

The pages are thin. Their content is rendered by /assets/js/site.js, which
holds the data and the templates for every page including the home page, so
there is one source of truth for the copy. The nav and the footer are lifted
verbatim out of index.html between the nav: and footer: comment markers, so
the furniture cannot drift between pages either.

Run from the repository root after changing the nav, the footer, or the page
metadata below:

    python tools/build_pages.py

The output is committed. There is no build step at deploy time.
"""

import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SITE = "https://joostvandebrake.com"

# Titles and descriptions are English because the head is static. The Dutch
# rendering of each page is the same URL with ?lang=nl, declared as an
# hreflang alternate below.
PAGES = [
    {
        "slug": "research",
        "title": "Research on teams and multiple team membership",
        "description": (
            "Publications, grants, and work in progress on multiple team membership, "
            "hybrid work, and the strain of modern teamwork. Journal of Applied Psychology, "
            "Personnel Psychology, Journal of Management Studies, and NWO Veni."
        ),
        "og_title": "Research | Joost van de Brake",
    },
    {
        "slug": "teaching",
        "title": "Teaching on teams, leadership, and modern work",
        "description": (
            "BSc, MSc, and executive courses on teams and organisational behaviour at the "
            "University of Groningen, PhD supervision on modern team arrangements, and "
            "invited talks at universities and ministries."
        ),
        "og_title": "Teaching | Joost van de Brake",
    },
    {
        "slug": "practice",
        "title": "Working with organisations on teams and collaboration",
        "description": (
            "Evidence-based help with team design, hybrid work, engagement, and burnout. "
            "Employee surveys and big-data diagnosis, intervention design and evaluation, "
            "and training for team leaders and HR professionals."
        ),
        "og_title": "Working with organisations | Joost van de Brake",
    },
    {
        "slug": "resources",
        "title": "Tools and teaching materials on working across teams",
        "description": (
            "Free resources from Joost van de Brake's research: the MTM Portfolio Navigator, "
            "two classroom cases with separate instructor guides, a teamwork practice exam, "
            "and slides from recent talks."
        ),
        "og_title": "Resources | Joost van de Brake",
    },
    {
        "slug": "contact",
        "title": "Contact",
        "description": (
            "Contact details for Joost van de Brake, formally Hendrik J. van de Brake and also "
            "indexed as H. J. van de Brake or HJ van de Brake. Email, ORCID, Pure, and "
            "Google Scholar."
        ),
        "og_title": "Contact | Joost van de Brake",
    },
]

TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title} | Joost van de Brake</title>
<meta name="description" content="{description}">
<meta name="author" content="Joost van de Brake">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
<link rel="canonical" href="{site}/{slug}/">
<meta property="og:type" content="profile">
<meta property="og:site_name" content="Joost van de Brake">
<meta property="og:title" content="{og_title}">
<meta property="og:description" content="{description}">
<meta property="og:url" content="{site}/{slug}/">
<meta property="og:image" content="{site}/portrait-staff.png">
<meta property="og:image:width" content="420">
<meta property="og:image:height" content="560">
<meta property="og:image:alt" content="Portrait of Joost van de Brake">
<meta property="og:locale" content="en_GB">
<meta property="og:locale:alternate" content="nl_NL">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="{og_title}">
<meta name="twitter:description" content="{description}">
<meta name="twitter:image" content="{site}/portrait-staff.png">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="alternate" hreflang="en" href="{site}/{slug}/">
<link rel="alternate" hreflang="nl" href="{site}/{slug}/?lang=nl">
<link rel="alternate" hreflang="x-default" href="{site}/{slug}/">
<link rel="author" href="{site}/#joost">
<link rel="alternate" type="text/plain" href="{site}/llms.txt" title="Concise machine-readable profile">
<link rel="alternate" type="text/plain" href="{site}/llms-full.txt" title="Full machine-readable profile">
<link rel="me" href="https://www.rug.nl/staff/h.j.van.de.brake/">
<link rel="me" href="https://research.rug.nl/en/persons/joost-van-de-brake/">
<link rel="me" href="https://scholar.google.com/citations?user=TFGPoCAAAAAJ">
<link rel="me" href="https://orcid.org/0000-0001-5690-404X">
<link rel="me" href="https://www.linkedin.com/in/joost-van-de-brake-85620245/">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Source+Sans+3:opsz,wght@9..40,300;9..40,400;9..40,600;9..40,700&display=swap" rel="stylesheet">

<script type="application/ld+json">
{{
  "@context": "https://schema.org",
  "@graph": [
    {{
      "@type": "WebPage",
      "@id": "{site}/{slug}/#webpage",
      "url": "{site}/{slug}/",
      "name": "{og_title}",
      "description": "{description}",
      "dateModified": "2026-08-11",
      "inLanguage": ["en", "nl"],
      "isPartOf": {{"@id": "{site}/#website"}},
      "about": {{"@id": "{site}/#joost"}},
      "author": {{"@id": "{site}/#joost"}},
      "publisher": {{"@id": "{site}/#joost"}},
      "primaryImageOfPage": {{"@id": "{site}/#portrait"}},
      "breadcrumb": {{
        "@type": "BreadcrumbList",
        "itemListElement": [
          {{"@type": "ListItem", "position": 1, "name": "Joost van de Brake", "item": "{site}/"}},
          {{"@type": "ListItem", "position": 2, "name": "{og_title_short}"}}
        ]
      }}
    }},
    {{
      "@type": "Person",
      "@id": "{site}/#joost",
      "name": "Joost van de Brake",
      "alternateName": [
        "Hendrik van de Brake",
        "Hendrik J. van de Brake",
        "H. J. van de Brake",
        "H.J. van de Brake",
        "HJ van de Brake"
      ],
      "url": "{site}/",
      "sameAs": [
        "https://www.rug.nl/staff/h.j.van.de.brake/",
        "https://research.rug.nl/en/persons/joost-van-de-brake/",
        "https://scholar.google.com/citations?user=TFGPoCAAAAAJ",
        "https://orcid.org/0000-0001-5690-404X",
        "https://www.linkedin.com/in/joost-van-de-brake-85620245/"
      ]
    }},
    {{
      "@type": "ImageObject",
      "@id": "{site}/#portrait",
      "contentUrl": "{site}/portrait-staff.png",
      "caption": "Portrait of Joost van de Brake",
      "width": 420,
      "height": 560
    }}
  ]
}}
</script>
<link rel="stylesheet" href="/assets/css/tokens.css?rev={rev}">
<link rel="stylesheet" href="/assets/css/base.css?rev={rev}">
<link rel="stylesheet" href="/assets/css/home.css?rev={rev}">
</head>
<body data-page="{slug}">

<a class="skip-link" href="#main" id="skip-link">Skip to content</a>

{nav}

<main id="main">
<noscript>
  <div class="pg-hd"><div class="wrap">
    <h1>{title}</h1>
    <p>{description}</p>
    <p>The rest of this page needs JavaScript. The full record is on <a href="https://research.rug.nl/en/persons/joost-van-de-brake/">Pure</a> and on the <a href="https://www.rug.nl/staff/h.j.van.de.brake/">University of Groningen staff profile</a>. Joost van de Brake, formally Hendrik J. van de Brake and also indexed as H. J. van de Brake or HJ van de Brake, can be reached at <a href="mailto:h.j.van.de.brake@rug.nl">h.j.van.de.brake@rug.nl</a>.</p>
  </div></div>
</noscript>
<div id="pg-{slug}"></div>
</main>

{footer}

<script src="/assets/js/site.js?rev={rev}" defer></script>
</body>
</html>
"""


def block(source, name):
    m = re.search(r"<!-- %s:start -->\n(.*?)\n<!-- %s:end -->" % (name, name), source, re.S)
    if not m:
        sys.exit("index.html is missing the %s:start / %s:end markers" % (name, name))
    return m.group(1)


def main():
    index = (ROOT / "index.html").read_text(encoding="utf-8")

    rev = re.search(r"/assets/css/tokens\.css\?rev=(\w+)", index)
    if not rev:
        sys.exit("could not read the asset revision from index.html")
    rev = rev.group(1)

    nav = block(index, "nav")
    footer = block(index, "footer")

    for page in PAGES:
        slug = page["slug"]

        # mark the current page in the nav that every page shares
        if slug == "contact":
            old_li, new_li = '<li data-pg="contact" class="cta"', '<li data-pg="contact" class="cta act"'
        else:
            old_li, new_li = '<li data-pg="%s"' % slug, '<li data-pg="%s" class="act"' % slug
        old_a = 'data-path="/%s/" id="n-%s"' % (slug, slug)
        new_a = old_a + ' aria-current="page"'
        for old in (old_li, old_a):
            if nav.count(old) != 1:
                sys.exit("nav: expected exactly one %r for %s" % (old, slug))
        page_nav = nav.replace(old_li, new_li).replace(old_a, new_a)

        html = TEMPLATE.format(
            site=SITE,
            slug=slug,
            rev=rev,
            nav=page_nav,
            footer=footer,
            title=page["title"],
            description=page["description"],
            og_title=page["og_title"],
            og_title_short=page["og_title"].split(" | ")[0],
        )

        out = ROOT / slug
        out.mkdir(exist_ok=True)
        (out / "index.html").write_text(html, encoding="utf-8", newline="")
        print("wrote %s/index.html" % slug)


if __name__ == "__main__":
    main()
