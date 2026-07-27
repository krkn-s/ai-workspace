---
description: Create or refine the project's BRAND.md as a lean, project-relevant source of truth
argument-hint: "[context or brand notes]"
---
Create or refine the project's `BRAND.md` so it captures the brand decisions that humans and agents cannot infer from the repo — and nothing more.

User guidance: $@

This prompt is the entry point. Load and follow the `brand-md` skill for the full workflow, structure, machine-readable layer, and lifecycle rules. Do not improvise the structure.

## Core principle — less is more

A `BRAND.md` is not a complete brand book by default. Include only the sections that are **relevant to this project right now**, judged from three inputs:

1. what the user actually needs the file for (copy, assets, governance, onboarding, handoff to another agent)
2. the nature of the project (solo founder, small team, scale-up, multi-brand group)
3. the evolution the user expects over the coming months

Never aim for all ten sections. A thin correct file beats a thick speculative one. Defer a section explicitly ("Open question") rather than inventing its contents. This is the default, not a fallback.

## Step 1 — Inspect

- Look for an existing `BRAND.md` at the project root. Present → read it fully and treat this as a refine / consolidation, not greenfield.
- Look for scattered brand material: Notion exports, PDF decks, Figma references, old chartes graphiques, founder notes, trademark filings. Reuse; do not rewrite from zero.
- Inspect the project itself to judge relevance: what does this repo actually produce, who is the audience, what will agents in this repo need from the brand.

## Step 2 — Scope

Determine, with the user, which sections are relevant now. Propose a short list grounded in the three inputs above. Confirm the scope before writing a single line. If the user is unsure, default to fewer sections.

## Step 3 — Capture, do not invent

Interview for decisions, not vibes. For every undecided field, mark it `Open question` with a one-line note. Do not synthesize a positioning, UVP, or values the user has not actually expressed. Legal details (Nice classes, registration numbers) are human-action items — flag them, never fabricate.

## Step 4 — Write

Draft the `BRAND.md` following the skill's section model and machine-readable rules:

- populate the frontmatter only for decided fields; omit undecided ones
- use stable section anchors so agents and other prompts can find content
- keep a thin machine-readable layer (frontmatter + extractable do/don't lists); do not bolt on extra files
- set `status: draft` until the user confirms the canonical fields

## Step 5 — Link to AGENTS.md

A `BRAND.md` that nothing points to is invisible to the project's agents. After writing:

- If the project has an `AGENTS.md` at the root, check whether it references `BRAND.md`. If it does not, propose adding a one-line pointer (e.g. under a Brand section or the existing context). If it references a stale or wrong path, propose a correction.
- If there is no `AGENTS.md`, propose creating a minimal one whose only job here is to point to `BRAND.md` — but ask first, since creating a project-level `AGENTS.md` is a broader decision.

In every case, **ask the user whether the change is critical before applying it.** If the user declines, leave the `AGENTS.md` as-is and note the gap.

## Step 6 — Cold-agent test

List the questions a brand-new agent would still need to ask after reading only the `BRAND.md`. Those are the file's remaining gaps, surfaced honestly. End with that list.
