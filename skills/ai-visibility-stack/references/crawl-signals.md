# Crawl Signals

Use this reference for `sitemap.xml`, `robots.txt`, AI crawler policy, `Content-Signal`, and Google Search Console handoff.

## Objective

Crawl hygiene is the highest-value layer in this skill, because a page an engine never retrieves can never be cited. Keep both layers healthy:

- search-engine crawl and indexing signals
- access policy for AI training, retrieval, and agents

## Rendering Comes First

Before any crawl file, check that the main content is readable without client-side rendering. In a within-site study of 158,099 AI answers, pages whose main text needed JavaScript received 10.6% fewer Gemini citations. Verify:

- the main text is present in the served HTML
- important content is not behind a click, a tab, or an infinite scroll
- canonical, `hreflang`, and metadata match the rendered page
- the page returns `200` to a plain text fetch without cookies

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

## Sitemap Metadata

- Include only canonical public URLs that should be discovered.
- Use `lastmod` only when it reflects a real substantive modification date.
- Do not invent default `priority` or `changefreq` values. Keep site-specific values only when the operator has a documented reason for them.
- Do not use sitemap metadata to compensate for duplicate, non-canonical, or stale pages.

## `robots.txt`

`robots.txt` should:

- allow crawling for public pages unless the user wants stricter rules
- point to the sitemap URL
- avoid accidental blocking of key pages, assets, or mirror files

Do not treat `robots.txt` as hard access control, and do not tell the user it is one. Compliance is voluntary, and audits find cited pages that disallowed the crawler citing them. It is a declared policy, not enforcement.

Common crawler names worth checking for:

- `Googlebot`: search indexing, which also grounds Google's AI features
- `Google-Extended`: Google's control token for AI training and grounding
- `GPTBot`: OpenAI training
- `OAI-SearchBot`: ChatGPT search retrieval
- `ChatGPT-User`: user-triggered fetch during a conversation
- `ClaudeBot`: Anthropic training
- `Claude-SearchBot`, `Claude-User`: retrieval and user-triggered fetch
- `PerplexityBot`, `Perplexity-User`: retrieval and user-triggered fetch

Blocking `Google-Extended` is not free. Sites that block it were significantly less likely to be retrieved by AI Overviews, and several major publishers that block it were never cited by Gemini in one study. If the user wants to block AI training, say what it costs and let them decide.

## Content Signals

`Content-Signal` is a 2025 convention, carried inside `robots.txt` or as an HTTP header, that states preferences per use case instead of per bot:

```text
User-Agent: *
Content-Signal: search=yes, ai-input=yes, ai-train=no
Allow: /
```

- `search`: indexing for search results
- `ai-input`: use as input for real-time AI answers
- `ai-train`: use for model training

Adoption is still low, single-digit to low double-digit percentages of monitored sites in 2026. Propose it when a site wants to separate search visibility from training and answer use. Explain that it declares a preference, honored only by crawlers that choose to, and keep it consistent with any per-bot `Disallow` rules rather than mixing contradictory signals.

## Google Search Console

Treat Search Console as a user or operator handoff step.

The agent should:

- explain the property type to use
- identify what DNS verification requires
- tell the user where to submit the sitemap
- mention the eligibility setting for generative AI features, since a site must be included in AI features in Search Console to be eligible for display there
- point to the Generative AI performance report to see how content performs in those features
- explain what data to inspect after collection starts

The agent should not imply it can complete account, DNS, or ownership verification on its own.

## Reading The Data

Once data exists, guide the user toward:

- high impressions and low clicks
- terms ranking just off page one
- pages with weak CTR relative to impression volume
- generative AI impressions and clicks, reported separately from classic search

Translate this into concrete next actions: stronger titles, clearer descriptions, better page structure, richer supporting content, or stronger internal linking.

## Validation Checklist

- main content is readable without JavaScript
- key pages return `200` to a plain fetch
- sitemap lists canonical public URLs only
- `lastmod` is accurate where used, with no invented `priority` or `changefreq` defaults
- sitemap and robots agree on crawlable surfaces
- sitemap URL is discoverable from `robots.txt`
- mirror URLs are not blocked accidentally
- `Content-Signal` values, when used, match the stated policy per use case
- any selective AI-crawler policy is explicit, internally consistent, and its cost explained
- Search Console steps cover verification, sitemap submission, AI features eligibility, and generative AI reporting
- manual Search Console steps are clearly separated from repo changes
