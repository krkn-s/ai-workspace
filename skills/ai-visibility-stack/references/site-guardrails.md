# Site Guardrails

Use this reference when creating, expanding, or redesigning a business website without breaking SEO and AI visibility foundations.

## Goal

System 5 from the original playbook is useful mainly as a reminder that visible pages and invisible infrastructure must ship together.

Treat these as guardrails, not as a mandate to generate a giant one-shot site prompt.

## Preserve These Layers

- crawlable, server-rendered page structure
- `sitemap.xml`
- `robots.txt` and any AI crawler policy or `Content-Signal` values
- canonical URLs
- meta titles and descriptions
- structured data / schema
- internal linking between important pages
- `llms.txt` and markdown delivery when an agent or a coding tool consumes them
- agent readability: semantic HTML, labels tied to inputs, stable layout
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

## Agent Readability

Browser agents and AI tools read the site through the DOM, the accessibility tree, and screenshots. Google's own guidance says the fixes are the same ones accessibility asks for:

- use real `<a>` and `<button>` elements instead of clickable `<div>` or `<span>`
- give every control a role, a name, and a label bound with `for`
- keep layout stable across pages so an action stays where the agent found it
- avoid invisible overlays and ghost elements that hide interactive content
- keep interactive targets large enough and visible in a screenshot
- keep the main text in the served HTML, not only in client-side rendering

Treat WebMCP and other agent protocols as experimental. Do not build a site around them without confirming the user wants that bet.

## Content Quality Rules

- prefer fewer strong pages over many weak near-duplicates
- use real business facts, proof, and constraints
- avoid fake testimonials, invented metrics, and generic AI prose
- make service, audience, geography, and positioning explicit when they matter

## Regression Checklist

After a rebuild or redesign, verify that:

- main content is still readable without JavaScript
- machine-readable files still resolve
- schema still matches the visible page
- titles and descriptions were not reset to placeholders
- key pages remain linked and indexable
- interactive elements are still semantic and labeled
- layout for key actions is still stable
- the site still communicates the same business to humans and machines
- any AI-crawler policy still matches the user's actual intent
