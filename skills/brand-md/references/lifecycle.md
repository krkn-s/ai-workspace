# BRAND.md Lifecycle

The procedures behind each routed task: create, consolidate, audit, version, rebrand. Single source of truth — the prompts route here.

## Create

For a brand with no canonical file and thin source material.

1. Pick the phase and scope sections with the table in `structure.md`. Resist filling every section.
2. Interview for decisions, not vibes: "describe the brand in one sentence to a stranger", "one word you never want associated with it", "the single most differentiating thing vs [named competitor]".
3. Capture what is decided; mark the rest `Open question`. Never synthesize a positioning the founder did not make.
4. Draft from the canonical skeleton, frontmatter populated only for decided fields; `status: draft` until the founder confirms canonical fields.
5. Close with the cold-agent test — the file's gaps, surfaced honestly.

## Consolidate

For a brand scattered across Notion, PDF decks, Figma, founder notes. The most common real-world case, and the most error-prone.

1. Build an intake map: every source, what it contains, last update, owner.
2. Extract facts per section, source noted; record conflicting versions verbatim.
3. Surface every conflict (two taglines, two palettes, two sub-brand names) before writing; never silently pick one.
4. Let the user pick the canonical version; log each choice in the journal with the source it replaced.
5. Produce the canonical file plus a consolidation log; recommend deprecating superseded sources — a consolidation that leaves old PDFs live has not finished.

## Audit

When the question is "is the brand still coherent, and where are the gaps?" An audit reports; it never rewrites.

1. Check internal consistency: values vs voice, tone-by-channel vs actual writing, forbidden terms vs the brand's own copy.
2. Check external drift: the file vs what the brand publishes (site, social, campaigns, support replies). The gap is the main output.
3. Check completeness vs phase: a scale-up missing governance or legal has a structural gap, not a style preference.
4. Report findings ranked: voice contradiction > wrong palette code > missing governance > stale tagline > cosmetic — with proposed fixes, and let the user confirm direction before any edit.

## Versioning and journal

- SemVer-ish: major for rebrand or architecture change, minor for a new section or changed rule, patch for a correction. Consistency matters more than the exact scheme.
- Every meaningful change gets a journal entry: version, date, one-line summary, rationale paragraph, author. The rationale is the point — "replaced tagline X because it read aspirational rather than operational" is what stops the next person from reverting it blindly.
- Keep retired material findable (old taglines, palettes, names) with dates.
- Update frontmatter `version` and `last_updated` on every change; other prompts detect staleness with them.

## Rebrand and pivot

The highest-stakes event — a versioned migration, never a silent overwrite.

1. Snapshot the current file; the pre-rebrand state must be recoverable.
2. Scope the blast radius with the user: name, visual identity, positioning, or full rebrand.
3. Produce the new version with a major bump and a journal entry explaining the rationale.
4. Write migration notes for derived assets: logo files, tagline references in site/decks/social, agent system prompts, email signatures, contracts. A rebrand that leaves the old logo in every deck is incomplete.
5. Keep the old brand visible in a retired section or the journal — full erasure is rarely right.
6. Flag legal actions as human steps (filings, opposition windows, domains, handles); prepare the operator checklist, assert nothing.
7. Run the cold-agent test on the new file, then again after the derived assets are updated, to catch drift introduced by the migration.
