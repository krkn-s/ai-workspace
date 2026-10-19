---
name: compact
description: Compact, LLM-friendly Markdown styling for any .md file — a single H1, an H2/H3 outline, short bullet lists, nested lists instead of tables, sparing bold, language-tagged code fences, no decorative HTML or emoji. Use when writing, rewriting, compacting, or cleaning up a Markdown file (README, docs, specs, notes, llms.txt, AGENTS.md), when the user asks for compact, minimal, token-efficient, or AI-readable formatting, when a file feels bloated or over-formatted, or when preparing documentation to be consumed by agents and LLMs. Déclenche aussi en français — compacter, alléger, nettoyer ou restructurer un fichier Markdown (README, documentation, notes, specs), réduire les tokens, supprimer le HTML ou les emojis décoratifs, aplanir une hiérarchie de titres trop profonde, ou appliquer un style Markdown minimaliste lisible par les LLM.
---

# Compact Markdown

Style and restyle Markdown files so they are cheap in tokens, fast to scan for humans, and unambiguous for LLMs. The target is standard minimalist GFM: structure carried by headings and lists, formatting deliberately scarce.

Apply this when creating a new `.md` file, or when the user asks to compact, lighten, clean up, or restructure an existing one. Never drop facts, links, or meaning — compacting is rewriting, not deleting content.

## Two independent axes

Judge every file on two axes: how deep its heading hierarchy goes, and how rich its formatting is.

### Axis 1 — heading depth

- H1 `# Title` — document title, exactly once. Very good for an LLM
- H2 `## Section` — main sections. Excellent
- H3 `### Subsection` — details within a section. Very good
- H4-H6 `####` to `######` — very fine subdivisions. Rarely useful, avoid

The best compromise is a **single H1 plus H2/H3 only**. H4-H6 add nesting but little semantic value — models lose track of deep levels and readers stop seeing the hierarchy. When a draft seems to need an H4, flatten instead: split the parent H3 in two, or turn the detail into a list.

### Axis 2 — formatting richness

- Level 0 — raw text, plain paragraphs. Cheapest in tokens, least structured
- Level 1 — inline `**bold**`, `*italic*`, `` `code` ``. Useful when targeted; overuse adds noise
- Level 2 — simple blocks: `-` / `1.` lists, `>` quotes. Very good
- Level 3 — structural: `#`, `##`, `###` headings. The most important for LLMs
- Level 4 — technical: fenced code, footnotes. Good when simple and necessary
- Level 5 — extensions: HTML, Mermaid, LaTeX, YAML frontmatter. Reserve for real needs

Target profile — levels 1-3 as the backbone, level 4 when the content demands it, level 5 only when nothing standard works.

## The recipe

````markdown
# Document title

## Main section

- Short key point
- **Keyword** — concise explanation
- Another point

### Subsection

```python
code()
```

> Important note
````

Prefer:

- Exactly one H1
- H2 for sections, H3 for subsections
- Short bullet lists
- Bold on 1-3 keywords per section, no more
- Fenced code blocks with a language tag
- Nested lists for comparisons — parent bullet is the row key, children are its values. **Never use a Markdown table**
- Paragraphs of 2-4 lines

Avoid:

- Inline or heavy HTML
- Complex tables with multiline cells
- Any Markdown table, simple or not
- Lists nested 4+ levels deep
- Decorative emojis
- Empty or purely decorative headings
- Over-rich or ambiguous Markdown (mixed emphasis markers, setext headings, unlabeled code fences)

## Restyling an existing file

1. Read the whole file first; keep every fact, link, and instruction.
2. Normalize the heading tree to one H1, then H2s and H3s — demote, merge, or listify anything deeper.
3. Strip decorative formatting — emoji, redundant bold, inline HTML; replace `div`/`span` wrappers with standard Markdown.
4. Tighten paragraphs to 2-4 lines; convert repeated parallel prose into bullet lists.
5. Label every code fence with its language; convert every table into a nested list (one parent bullet per row, sub-bullets for its cells).
6. Check the result renders as plain GFM and that the heading outline alone tells the story.

## Judgment calls

- Frontmatter is level 5 — keep it only when tooling consumes it, not for decoration.
- A comparison that invites a table becomes a nested list: one parent bullet per row, children per cell.
- When the file follows a deliberate house style that conflicts (e.g. generated docs requiring H4+), preserve the intent, note the deviation to the user, and do not silently break the tooling that expects it.
- Compact does not mean terse to the point of loss: a 2-4 line explanation that prevents a mistake outranks a bullet that omits it.
