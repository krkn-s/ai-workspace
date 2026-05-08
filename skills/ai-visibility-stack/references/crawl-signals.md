# Crawl Signals

Use this reference for `sitemap.xml`, `robots.txt`, crawler access, and Google Search Console handoff.

## Objective

AI visibility does not replace standard crawl hygiene. Keep both layers healthy:

- LLM-facing index and content surfaces
- search-engine crawl and indexing signals

## `sitemap.xml`

The sitemap should list important canonical pages and omit junk.

Include:

- homepage
- primary service or product pages
- about, contact, pricing, and policy pages when indexable
- blog posts, guides, case studies, and other real content assets

Exclude:

- `404` pages
- thank-you pages
- filtered duplicates
- soft duplicates
- `noindex` pages

## Priority Heuristics

Use simple business-aware defaults when the site does not already define them:

- homepage: `1.0`
- primary money pages: `0.9`
- important supporting pages: `0.8`
- blog posts, guides, and secondary pages: `0.7`

Do not invent false precision. Consistency matters more than over-tuning.

## Freshness Hints

Reasonable default:

- homepage: `weekly`
- most stable pages: `monthly`

If the site already has a reliable content cadence model, follow it instead of forcing these defaults.

## `robots.txt`

`robots.txt` should:

- allow crawling for public pages unless the user wants stricter rules
- point to the sitemap URL
- avoid accidental blocking of key pages, assets, or mirror files

When the site is meant to be readable by answer engines, do not block common AI crawlers unless the user explicitly asks for that policy.

If the user wants a narrower exposure policy:

- define which surfaces remain indexable for standard search
- define which surfaces should stay available or unavailable to AI crawlers
- make the policy explicit in the output instead of half-blocking things by accident

If mirrors are omitted because existing docs are already sufficient, keep normal crawl hygiene intact unless the user explicitly wants a broader policy change.

Common crawler names worth checking for business sites:

- `GPTBot`
- `ClaudeBot`
- `PerplexityBot`
- `Google-Extended`

## Google Search Console

Treat Search Console as a user or operator handoff step.

The agent should:

- explain the property type to use
- identify what DNS verification requires
- tell the user where to submit the sitemap
- explain what data to inspect after collection starts

The agent should not imply it can complete account, DNS, or ownership verification on its own.

## Reading The Data

Once data exists, guide the user toward:

- high impressions and low clicks
- terms ranking just off page one
- pages with weak CTR relative to impression volume

Translate this into concrete next actions: stronger titles, clearer descriptions, better page structure, richer supporting content, or stronger internal linking.

## Validation Checklist

- sitemap lists canonical public URLs only
- sitemap and robots agree on crawlable surfaces
- sitemap URL is discoverable from `robots.txt`
- mirror URLs are not blocked accidentally
- any selective AI-crawler policy is explicit and internally consistent
- manual Search Console steps are clearly separated from repo changes
