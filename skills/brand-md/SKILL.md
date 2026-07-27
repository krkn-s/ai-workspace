---
name: brand-md
description: Create, audit, and maintain a BRAND.md — a single Markdown source of truth for a company or product brand that is readable by humans and consumable by LLM-based agents and other prompts. Use when the agent needs to set up a brand book, charte graphique, brand identity file, brand guidelines, employer brand, or brand governance doc as a living Markdown file; consolidate scattered brand material (PDFs, slides, Figma, Notion, ancient PDFs) into one canonical BRAND.md; keep brand voice, tone, visuals, legal classes, and messaging consistent across teams, channels, and countries; expose brand guardrails to other agents or AI workflows; version a rebrand or brand pivot; or audit an existing brand setup for drift and gaps. Déclenche aussi sur les requêtes en français, par exemple créer ou consolider une charte de marque, un brand book, une identité verbale et visuelle, une charte graphique, un fichier de marque source-de-vérité lisible par les humains et les agents IA, centraliser la marque éparpillée, gérer la cohérence de marque multi-canal et multi-pays, exposer les garde-fous de marque à d'autres prompts, ou versionner un rebranding.
---

# Brand MD

Use this skill when the work is about a **brand**, and the goal is not just to produce a pretty brand book, but to land a single canonical `BRAND.md` that humans can read and LLM-based agents can consume as a source of truth.

This skill is instruction-only. Do not assume bundled tools, generators, or design software. Choose the repo-native implementation that fits the project, and defer any pixel-level visual production (logo files, color exports) to the tools the brand team already uses.

## What a BRAND.md is

`BRAND.md` is the brand equivalent of `llms.txt`, `AGENTS.md`, and `README.md`: a single Markdown file that acts as the **canonical source of truth** for a brand, written so that:

- Humans read it directly: founders, marketers, designers, agencies, new hires.
- LLM-based agents read it programmatically to stay on-brand when writing copy, drafting emails, naming products, or producing assets.
- Other prompts and skills can grep it for voice rules, color codes, legal classes, or forbidden terms.

The dual audience is the point. A `BRAND.md` that only serves designers is a PDF charte graphique by another name. A `BRAND.md` that only serves agents is a system prompt. This skill produces one file that serves both, plus a small set of derived artifacts.

## Entry Points

This skill is the shared logic. Users typically start from one of three prompt templates, each of which loads this skill and follows its workflow:

- `/brand` — create or refine a project's `BRAND.md`, scoped to what is relevant now.
- `/brand-audit` — audit an existing `BRAND.md` or scattered brand material for drift and gaps.
- `/brand-rebrand` — plan and apply a rebrand or pivot as a versioned migration.

The skill also triggers contextually when none of these commands is used. In every case the prompts delegate structure and lifecycle rules here, so this file stays the source of truth for how a BRAND.md is built and maintained.

## When To Use This Skill

Use it when the task touches any of these:

- creating a brand book, charte graphique, brand identity, or brand guidelines as a living Markdown file
- consolidating scattered brand material (Notion pages, PDF decks, Figma files, founder lore) into one canonical file
- keeping brand voice, tone, visuals, and messaging consistent across teams, channels, or countries as the company grows
- exposing brand guardrails to other agents, AI workflows, or prompt templates
- auditing an existing brand setup for drift, gaps, or stale decisions
- versioning a rebrand, rename, or brand pivot with a traceable changelog
- setting up brand governance (who approves what, forbidden usages, licensing) for multi-team or multi-agency contexts

Do not use it as the primary skill when:

- the task is purely visual asset production (exporting logo variants, generating social templates) with no documentation goal — point the user at their design tools instead
- the user only wants a one-shot marketing page, ad, or campaign — that is copy, not brand architecture
- the project already has a canonical, maintained brand file and the task is a small content edit that doesn't need structural decisions

## Task Matrix

Route to the right reference before producing output:

| Task Type | Load First | Expected Output |
|---|---|---|
| Create a new BRAND.md | `references/structure.md` and `references/machine-readable.md` | A draft BRAND.md scoped to the company's current phase, plus a short list of fields to confirm with the user |
| Consolidate scattered brand material | `references/structure.md` and `references/lifecycle.md` | A single canonical BRAND.md with an intake map of sources and a consolidation log |
| Audit existing brand for drift | `references/lifecycle.md` | Current-state audit, drift findings, priority fixes, and a gap list |
| Make BRAND.md consumable by agents | `references/machine-readable.md` | A machine-readable layer (frontmatter block, stable section anchors, extractable do/don't lists) |
| Rebrand / rename / pivot | `references/lifecycle.md` | Versioned change, changelog entry, migration notes for derived assets, and decision rationale |
| Governance setup | `references/structure.md` | Approval matrix, forbidden-usage rules, and licensing notes added to the file |

## Reference Loading

Load only the reference that matches the task. Keep context narrow.

- Read `references/structure.md` for the canonical section model, the fields inside each section, and how to scope the file to the company's phase (pre-revenue, early, scale-up, diversified). This is the backbone of the file itself.
- Read `references/machine-readable.md` for how to make the file consumable by agents and other prompts: the frontmatter block, stable anchors, extractable rules, and the boundary between human prose and machine-parsable data. This is the differentiator of BRAND.md over a classic brand book.
- Read `references/lifecycle.md` for the create / consolidate / audit / evolve cycle, governance, versioning, the evolution journal, and how to handle a rebrand without losing history.

Do not load every reference by default. The structure reference is enough for a straightforward creation task; the machine-readable and lifecycle references are for their specific tasks.

## Core Workflow

1. Figure out the company's phase before writing anything. A pre-revenue solo founder does not need an architecture-of-brands section; a diversified group does not need a lean one-page file. Phase drives which sections are required, optional, or deferred.
2. Inspect what already exists: any Notion page, PDF deck, Figma library, old charte graphique, founder notes, trademark filings, existing tone-of-voice guides. Do not rewrite from zero when usable source material exists.
3. Decide whether the task is create, consolidate, audit, or evolve. They have different outputs and different stop-and-ask rules.
4. Scope to what is relevant now, not to a complete brand book. Less is more. Judge which sections to include from three inputs: what the user needs the file for, the nature of the project, and the evolution expected over the coming months. Never aim for all ten sections. Defer a section explicitly ("Open question") rather than inventing its contents. This applies at every phase, not just early ones — a scale-up may still defer house-of-brands architecture until it actually diversifies.
5. Structure the file with stable section anchors so agents and other prompts can find the voice rules, color codes, and legal classes without reading the whole file.
6. Add a machine-readable layer where it adds value: a frontmatter block with the core facts (name, legal name, tagline, primary palette, class of Nice, version), and do/don't lists that other prompts can grep.
7. Capture decisions, not just states. Every meaningful change goes in the evolution journal with a reason, so the file stays traceable over years.
8. Finish with a validation pass: does a cold agent reading only this file stay on-brand? If not, the file has a gap, not the agent.
9. Ensure the `BRAND.md` is reachable from the project's `AGENTS.md` (see AGENTS.md Linkage). A file nothing points to is invisible to the project's agents.

## Decision Order

Apply this order to avoid wasted work and invented content:

1. Reuse existing brand material as the source. Do not fabricate positioning, values, or personas that the founders have not actually expressed.
2. Scope to the phase. Ship a thinner correct file over a thick speculative one.
3. Land canonical fields first: purpose, voice, palette, tagline, legal classes, forbidden usages. These are the fields other agents and prompts actually consume.
4. Add the machine-readable layer only after the human-readable file is coherent. A machine block bolted onto a fictional file just makes the fiction faster to parse.
5. Add governance and evolution journal once more than one person or team touches the brand.

## AGENTS.md Linkage

A `BRAND.md` that nothing points to is invisible to the project's agents. After creating or significantly changing the file, ensure the project's root `AGENTS.md` references it:

- If `AGENTS.md` exists and does not mention `BRAND.md`, propose adding a one-line pointer.
- If it references a stale or wrong path, propose a correction.
- If there is no `AGENTS.md`, propose creating a minimal one — but treat that as a broader decision and ask first.

Always ask the user whether the change is critical before applying it. If the user declines, leave `AGENTS.md` as-is and note the gap. This applies on creation, on rebrand, and whenever the file is moved or renamed.

## Stop-And-Ask Checkpoints

Pause and confirm with the user before doing any of these, because they are hard to reverse and often imply decisions the founder has not actually made:

- inventing brand positioning, values, or a UVP that the user has not stated — ask instead of filling gaps
- picking trademark classes, filing jurisdictions, or legal protection advice — flag the need and prepare the human-facing steps, do not file or assert anything
- changing an existing established brand voice, name, or logo direction as part of an audit
- consolidating material that includes conflicting versions of the truth (two taglines, two palettes) — surface the conflict, do not silently pick one
- exposing sensitive internal material (compensation, unreleased product, unreleased name) in a file that may be shared externally or fed to third-party agents
- creating, editing, or correcting a project-level `AGENTS.md` to reference `BRAND.md` — ask whether the change is critical before applying it (see AGENTS.md Linkage)

If none of these apply, proceed with the conservative option that preserves existing truth and defers undecided sections.

## Default Rules

- Treat `BRAND.md` as the canonical source. Other artifacts (PDF charte, social templates, agent system prompts) are derived from it, not the reverse.
- Scope to project relevance, not to completeness. Less is more. Include a section only when the project actually needs it now; defer the rest explicitly. A clearly marked "Open question" is more valuable than plausible filler, at every phase.
- Keep legal assertions minimal and clearly marked as human-action items. Do not fabricate registration numbers, classes, or jurisdictions.
- Prefer stable, predictable section headers. Agents and other prompts rely on finding "Voice and tone" or "Primary palette" without guessing.
- Separate human prose from machine-parsable data. A designer reads the rationale; an agent greps the HEX codes. Both should coexist.
- Preserve the evolution journal. A rebrand that erases its own history loses the ability to explain itself later.
- Avoid brand-book theatre: mission statements with no operational consequences, values that contradict the tone section, color systems with no usable codes.
- Keep the file lean. Push deep reference material (full persona dossiers, extended competitor teardowns, full photography briefs) into linked files, not into BRAND.md itself.

## Failure Modes

Handle these explicitly instead of improvising:

- The founders have not actually decided their positioning:
  capture what they have decided, mark the rest as open questions, and stop. Do not synthesize a UVP from vibes.
- Conflicting brand material exists across sources:
  surface every conflicting version, let the user pick the canonical one, and log the choice in the evolution journal.
- The brand is mature but the file is being created fresh:
  treat it as a consolidation, not a greenfield creation. Audit first, then write.
- The user wants the file to double as a system prompt for a specific agent:
  keep BRAND.md human-first and expose a compact machine-readable layer; do not warp the whole file into a system prompt.
- Visual assets are missing (no logo file, no confirmed palette):
  document the gap and the expected format; do not invent codes or pretend assets exist.
- Legal details are unknown:
  flag them as human-action items with guidance, never fabricate registration data.

## Output Contracts

Match the response shape to the task:

- Create / consolidate:
  return a draft BRAND.md scoped to phase, an intake map of sources used, a short list of fields to confirm, and any deferred sections marked as open.
- Audit:
  return current state, drift findings, priority fixes, and a gap list — not a rewritten file until the user confirms direction.
- Machine-readable layer:
  return the frontmatter block, the stable anchors, and the extractable do/don't lists, with a note on how other prompts should consume them.
- Rebrand / pivot:
  return the versioned change, the changelog entry, the rationale, and migration notes for derived assets (old logo files, old tagline references, existing social templates).
- Governance:
  return the approval matrix, forbidden-usage rules, and licensing notes as additions to the existing file.

Always end with the cold-agent test: list the questions a brand-new agent would still need to ask after reading only the file. Those are the file's remaining gaps.
