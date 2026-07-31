---
description: Audit the project's BRAND.md (or scattered brand material) for drift, gaps, and inconsistencies
argument-hint: "[focus area]"
---
Audit the project's brand setup for drift, gaps, and internal inconsistencies. Return findings and proposed fixes — do not rewrite the file.

User guidance / focus:{{  $@  }}

This prompt is the entry point. Load and follow the `brand-md` skill, especially `references/lifecycle.md` (audit section) and `references/structure.md` (phase scoping). Do not improvise the structure.

## Step 1 — Locate the source of truth

- A `BRAND.md` exists at the root → read it fully; this is the canonical input.
- No `BRAND.md` but scattered material exists (Notion, decks, Figma, old PDFs) → audit the scattered set and flag the absence of a canonical file as the top finding.
- Neither → stop and tell the user there is nothing to audit yet; suggest `/brand` to create one.

## Step 2 — Check internal consistency

Compare the file against itself:

- Do the stated values match the voice section?
- Does the tone-by-channel list match the forbidden lexicon?
- Are the frontmatter facts (palette, tagline, classes) consistent with the body?
- Are retired items still referenced anywhere as current?

## Step 3 — Check external drift

Compare the file against what the brand currently publishes: site, social, recent campaigns, support replies, the repo's own copy and comments. The gap between the file and reality is the audit's main output.

## Step 4 — Check completeness vs phase

A brand at scale missing governance or legal sections has a structural gap, not a style preference. But do not over-recommend: a pre-revenue project does not need a house-of-brands architecture. Judge required sections by what the project actually is right now, following less-is-more.

## Step 5 — Report

Return, ranked by impact:

1. **Drift findings** — where the file and reality disagree (voice contradiction > wrong code > stale tagline > cosmetic).
2. **Gaps** — missing sections that matter for this project's phase, plus genuinely open questions still marked as undecided.
3. **Consistency issues** — internal contradictions found in step 2.
4. **Priority fixes** — the small set worth doing now, and what can wait.

## Rules for this task

- An audit is an independent check. Do not rewrite the file during the audit. Propose fixes and let the user confirm direction before any edit.
- If you find that `AGENTS.md` does not reference the `BRAND.md` (or references a wrong path), surface that as a finding — but ask before changing `AGENTS.md`.
- Flag legal and filing gaps as human-action items; never assert registration data.
