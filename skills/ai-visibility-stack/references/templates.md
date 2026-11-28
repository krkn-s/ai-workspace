# Templates

Use these as reusable instruction patterns inside the conversation. They are not commands and they do not assume any specific toolchain.

## 1. Stack Audit Brief

Use when the user wants a diagnosis before changes.

```text
Audit this website for crawl access, agent readability, and machine-readable surfaces.

Check:
- whether the main content is readable without JavaScript
- whether sitemap.xml and robots.txt exist and agree
- whether any AI crawler policy or Content-Signal value matches the stated intent
- whether important pages are easy for search crawlers and agents to discover
- whether interactive elements are semantic, labeled, and stable across pages
- whether a valid llms.txt exists, and who actually reads it
- whether markdown is served through content negotiation or a declared alternate
- whether any redesign or content change risks breaking invisible infrastructure

Return:
- what exists now
- what is missing
- what to fix first, ordered by retrieval impact
- what must be preserved during future redesigns
- what will not help, stated plainly
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
Plan a markdown delivery strategy for this website.

Decide:
- whether content negotiation, a declared .md URL, or an undeclared .md URL is the right mechanism
- which pages should have markdown
- which pages should be excluded
- which public URL pattern is the most stable
- what metadata each version must preserve
- how llms.txt should reference the highest-value pages

Prefer a durable pattern and a cleaner output over maximum page count.
If the site already has clean markdown or docs, say whether a new surface is unnecessary.
State which agents will actually request it, and do not claim a citation benefit.
```

## 4. Redesign Preservation Brief

Use when visible design work must not damage invisible infrastructure.

```text
Make the requested website changes, but preserve the site's discovery infrastructure.

Do not regress:
- server-rendered main content
- llms.txt when an agent consumes it
- markdown delivery or equivalent machine-readable files
- sitemap.xml
- robots.txt and any AI crawler policy
- schema
- meta titles and descriptions
- canonical URLs
- internal linking to core pages
- semantic elements, labels, and stable layout for key actions

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

## 7. Agent Readiness Brief

Use when browser agents or AI tools must act on the site, not just read it.

```text
Review this site for agent readability.

Check:
- whether main content and key actions appear in the served HTML and DOM
- whether actionable elements use real links, buttons, and labeled inputs
- whether each control exposes a role, a name, and a state in the accessibility tree
- whether layouts keep key actions in a stable position across pages
- whether overlays or ghost elements hide interactive content
- whether interactive targets are large enough to appear in a screenshot

Return the failures ordered by how likely they block a task, the exact element changes, and a re-test plan.
Treat experimental agent protocols as opt-in, not as the baseline.
```
