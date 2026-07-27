---
description: Plan and apply a rebrand or brand pivot as a versioned migration of BRAND.md
argument-hint: "[new direction or scope]"
---
Handle a rebrand, rename, or brand pivot as a versioned migration of the project's `BRAND.md` — not a silent overwrite. Produce the change, its rationale, and the migration notes for every derived asset.

User guidance / new direction: $@

This prompt is the entry point. Load and follow the `brand-md` skill, especially `references/lifecycle.md` (rebrand section). Do not improvise the structure.

## Step 1 — Snapshot

Before any change, snapshot the current `BRAND.md` (copy to `BRAND.pre-rebrand.md`, or record the current version tag). The pre-rebrand state must be recoverable. Do not skip this even for a small pivot.

## Step 2 — Scope the change

Decide, with the user, the blast radius:

- name only
- visual identity only (logo, palette, typography)
- positioning / messaging only
- full rebrand

Each has a different effect on derived assets. Confirm scope before editing.

## Step 3 — Apply as a versioned change

- Bump the major version in the frontmatter for a full rebrand or architecture change; minor for a new section or changed rule; patch for a correction.
- Update `last_updated` and `version`.
- Add an evolution-journal entry with: version, date, one-line change summary, one-paragraph rationale, author. The rationale is the point — future readers must understand *why*, not just *what*.

## Step 4 — Migration notes for derived assets

A rebrand that updates `BRAND.md` but leaves the old logo in every deck is incomplete. Produce a checklist of derived assets to update:

- old logo files and where they are referenced
- old tagline references across site, docs, social templates
- agent system prompts or prompt templates that hardcode the old voice, name, or palette
- email signatures, contracts, decks, packaging
- social handles and domains (human-action)

Mark each as replace / review / human-action.

## Step 5 — Preserve retired material

Keep old taglines, palettes, and names findable in a retired section or the journal, with dates. Full erasure is rarely right; continuity is how a rebrand stays defensible to customers and staff.

## Step 6 — Legal as human steps

Flag, do not perform: new trademark filings, opposition windows, domain changes, social-handle migration. Prepare the operator checklist and stop.

## Step 7 — Link check

After the rebrand, verify the project's `AGENTS.md` still points correctly to `BRAND.md` (path and any inline references to the old name or tagline). Propose corrections and **ask whether the change is critical before applying it.**

## Step 8 — Cold-agent test on the new file

Run the cold-agent test on the new `BRAND.md` in isolation, then again after the derived assets are updated, to catch drift introduced during migration.
