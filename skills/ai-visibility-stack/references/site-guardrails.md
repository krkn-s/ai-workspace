# Site Guardrails

Use this reference when creating, expanding, or redesigning a business website without breaking SEO and AI visibility foundations.

## Goal

System 5 from the source playbook is useful mainly as a reminder that visible pages and invisible infrastructure must ship together.

Treat these as guardrails, not as a mandate to generate a giant one-shot site prompt.

## Preserve These Layers

- `llms.txt`
- markdown mirrors or equivalent clean machine-readable pages
- `sitemap.xml`
- `robots.txt`
- canonical URLs
- meta titles and descriptions
- structured data / schema
- internal linking between important pages
- crawlable page structure
- mobile readability and usable page performance

## During Redesigns

When changing layout, branding, copy, or page composition:

- keep machine-readable files in place unless there is an explicit replacement plan
- preserve public URLs where possible
- avoid wiping schema, canonicals, or metadata during template rewrites
- keep core money pages and proof pages easy to reach from the homepage and nav
- maintain or improve content hierarchy rather than flattening it into generic sections

Use a preservation-first matrix:

- keep as-is when the layer still matches the live site
- replace only with an explicit migration plan
- remove only when the user explicitly accepts the discoverability loss or the layer is truly obsolete

## During Net-New Builds

If building a new site, include enough structure for discovery and trust:

- homepage
- service or product detail pages
- about / proof / FAQ
- contact or conversion path
- policy pages when publicly required
- crawl files and machine-readable files

Do not assume every project needs a 40-page site. Build the smallest structure that can support discoverability, clarity, and conversion without thin filler pages.

If the project already has a public docs or markdown layer that machines can parse cleanly, prefer reusing that source of truth over introducing a second redundant mirror system.

## Content Quality Rules

- prefer fewer strong pages over many weak near-duplicates
- use real business facts, proof, and constraints
- avoid fake testimonials, invented metrics, and generic AI prose
- make service, audience, geography, and positioning explicit when they matter

## Regression Checklist

After a rebuild or redesign, verify that:

- machine-readable files still resolve
- schema still matches the visible page
- titles and descriptions were not reset to placeholders
- key pages remain linked and indexable
- the site still communicates the same business accurately to both humans and machines
- any AI-crawler policy still matches the user's actual intent
