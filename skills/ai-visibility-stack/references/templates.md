# Templates

Use these as reusable instruction patterns inside the conversation. They are not commands and they do not assume any specific toolchain.

## 1. Stack Audit Brief

Use when the user wants a diagnosis before changes.

```text
Audit this website for AI visibility and crawl visibility.

Check:
- whether a valid llms.txt exists and whether it follows the official structure
- whether clean markdown mirrors or equivalent machine-readable page versions exist
- whether sitemap.xml and robots.txt exist and agree
- whether important pages are easy for search crawlers and LLM-based agents to discover
- whether any redesign or content change risks breaking invisible SEO or AI-readable infrastructure

Return:
- what exists now
- what is missing
- what should be fixed first
- what must be preserved during future redesigns
- whether any existing docs or markdown already remove the need for a mirror layer
```

## 2. `llms.txt` Draft Brief

Use when the user needs a new `llms.txt`.

```text
Create a root /llms.txt for this website using the official llmstxt.org structure.

Use:
- one H1 with the site or business name
- one blockquote summary directly under it
- short non-heading guidance only if it helps an agent interpret the linked files
- H2 sections with markdown link lists for the most useful public pages
- an Optional section only for lower-priority links

Do not invent facts. Use the actual public URLs. Keep the top of the file compact and use linked markdown pages for detail.
```

## 3. Mirror Planning Brief

Use when the site needs clean page-level machine-readable content.

```text
Plan a markdown mirror strategy for this website.

Decide:
- which pages should have mirrors
- which pages should be excluded
- which public URL pattern is the most stable
- what metadata each mirror must preserve
- how llms.txt should reference the highest-value mirrors

Prefer a durable pattern and a cleaner output over maximum page count.
If the site already has clean markdown or docs, say whether mirrors are unnecessary.
```

## 4. Redesign Preservation Brief

Use when visible design work must not damage invisible infrastructure.

```text
Make the requested website changes, but preserve the site's discovery infrastructure.

Do not regress:
- llms.txt
- markdown mirrors or equivalent machine-readable files
- sitemap.xml
- robots.txt
- schema
- meta titles and descriptions
- canonical URLs
- internal linking to core pages

If any of these need to change, explain the replacement plan explicitly instead of dropping them silently.
```

## 5. Docs Reuse Brief

Use when the site already has clean public docs or markdown and you need to decide whether mirrors are unnecessary.

```text
Review this site's existing public docs or markdown as the potential machine-readable source of truth.

Decide:
- whether these pages are already clean enough for LLM and crawler consumption
- whether llms.txt should point to them directly
- whether adding markdown mirrors would create unnecessary duplication

Return a keep/reuse/create decision and explain why.
```

## 6. Limited Exposure Brief

Use when the user wants to control AI crawler access instead of maximizing it.

```text
Review this site's crawl policy with two goals kept separate:

- normal search-engine discoverability
- answer-engine / AI crawler access

Decide:
- which public pages should remain indexable for search
- which pages or file types should be visible to AI crawlers
- whether llms.txt or markdown mirrors should exist at all under this policy

Return an explicit policy, the affected files, and any tradeoffs instead of assuming broader AI exposure is always desired.
```
