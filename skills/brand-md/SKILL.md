---
name: brand-md
description: Create, audit, and maintain a BRAND.md — a single Markdown source of truth for a brand, readable by humans and consumable by LLM-based agents. Use when setting up a brand book, charte graphique, brand identity, brand guidelines, or brand governance as a living Markdown file; consolidating scattered brand material (PDFs, slides, Figma, Notion) into one canonical BRAND.md; keeping brand voice, tone, visuals, legal classes, and messaging consistent across teams, channels, and countries; exposing brand guardrails to other agents or AI workflows; versioning a rebrand or pivot; or auditing an existing brand setup for drift and gaps. Déclenche aussi en français, par exemple créer ou consolider une charte de marque, un brand book, une identité verbale et visuelle, une charte graphique, un fichier de marque source de vérité lisible par les humains et les agents IA, centraliser la marque éparpillée, gérer la cohérence multi-canal et multi-pays, ou versionner un rebranding.
---

# Brand MD

A single canonical `BRAND.md` that humans read and LLM-based agents consume as the brand's source of truth. One file, two audiences: founders and designers read the rationale; agents grep the facts (HEX codes, forbidden terms, Nice classes, current tagline). A BRAND.md that serves only designers is a PDF charte graphique by another name; one that serves only agents is a system prompt.

Instruction-only: no tools, no generators. Visual production (logo files, color exports) stays in the brand team's design tools.

## The model

- **One canonical file.** PDF chartes, social templates, and agent system prompts derive from `BRAND.md` — never the reverse.
- **Ten sections, two speeds.** Sections 1-4 (foundations, market, verbal, visual) are the operational core; 5-10 (assets, governance, legal, culture, extensions, journal) scale with the company.
- **The machine layer is part of the file, not a bolt-on.** The canonical skeleton ships with frontmatter, numbered anchors, and do/don't lists — see `references/structure.md`.
- **Reachable or invisible.** The project's `AGENTS.md` must point at `BRAND.md` (ask before editing it).

## Task routing

Entry point `/brand <create|audit|rebrand>` loads this skill; it also triggers contextually. Load only the references the task needs:

| Task | Read | Output |
|---|---|---|
| Create a BRAND.md | `references/structure.md` | Draft scoped to phase, fields to confirm, open questions |
| Consolidate scattered material | `references/structure.md`, `references/lifecycle.md` | Intake map, canonical file, consolidation log |
| Audit for drift | `references/lifecycle.md` | Findings + fixes ranked — never a rewrite |
| Rebrand / rename / pivot | `references/lifecycle.md` | Versioned change, journal entry, migration notes |
| Agent consumption / machine layer | `references/machine-readable.md` | Frontmatter, anchors, do/don't contract |

## Workflow

1. **Phase first.** Pre-revenue solo founder ≠ diversified group. Phase decides required, optional, and deferred sections.
2. **Intake what exists.** Notion, PDF decks, Figma, founder notes, trademark filings. Never rewrite from zero when usable material exists.
3. **Scope to now.** A thin correct file beats a thick speculative one, at every phase. Defer with `Open question` rather than invent.
4. **Write with the canonical skeleton** from `references/structure.md` — frontmatter populated only for decided fields.
5. **Journal every meaningful change** — version, date, one-line summary, rationale, author.
6. **Close with the AGENTS.md pointer and the cold-agent test**: the questions a brand-new agent would still ask after reading only the file are its remaining gaps.

## Non-negotiables

1. **Capture, don't invent.** No synthesized positioning, UVP, personas, or values the founders have not expressed. No fabricated legal data.
2. **Canonical fields first** — purpose, voice, palette, tagline, legal classes, forbidden usages; they are what agents actually consume.
3. **Stable numbered anchors.** Agents find `## 3. Verbal identity` without guessing; renames go through the journal.
4. **Preserve history.** Retired taglines, palettes, and names stay findable. A rebrand that erases itself cannot defend its choices.
5. **Avoid brand-book theatre** — mission statements with no operational consequence, values contradicting the tone, colors with no usable codes.

## Stop and ask

- inventing positioning, values, or UVP the user has not stated — capture what is decided, mark the rest
- trademark classes, filings, jurisdictions — flag as human-action items, never assert or file
- conflicting versions of the truth (two taglines, two palettes) — surface, let the user pick, log the choice
- sensitive internal material in a file that may be shared or fed to third-party agents
- creating or editing the project's `AGENTS.md`

## Output contracts

- **Create / consolidate:** the draft scoped to phase (+ intake map and consolidation log when consolidating), fields to confirm, open questions.
- **Audit:** current state, drift findings ranked by impact, priority fixes — no rewrite until the user confirms direction.
- **Rebrand:** the versioned change, the journal entry with rationale, migration notes for derived assets.

End every task with the cold-agent test — the file's remaining gaps, surfaced honestly.
