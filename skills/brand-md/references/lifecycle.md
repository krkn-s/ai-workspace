# BRAND.md Lifecycle

How to create, consolidate, audit, and evolve a `BRAND.md`. A brand file that is never maintained is a brand book that goes stale. The lifecycle is what makes the skill a living practice rather than a one-shot generator.

## Table of Contents

1. Create from scratch
2. Consolidate scattered material
3. Audit for drift
4. Governance
5. Versioning
6. Rebrand and pivot

---

## 1. Create from scratch

When the brand has no canonical file and the source material is thin (solo founder, early idea).

1. Determine the phase and scope the sections (see `references/structure.md`). Resist the urge to fill every section.
2. Interview for decisions, not vibes. Ask concrete questions: "if you had to describe the brand in one sentence to a stranger, what is it?", "name one word you would never want associated with the brand", "what is the single most differentiating thing vs [named competitor]".
3. Capture what is decided. Mark the rest as open questions with a one-line note. Do not synthesize a positioning statement the founder did not make.
4. Draft the file scoped to phase, with the frontmatter block populated only for decided fields.
5. Run the cold-agent test: list what a brand-new agent would still have to ask. Those are the file's gaps, surfaced honestly.
6. Set `status: draft` until the founder confirms the canonical fields. Move to `canonical` only after explicit confirmation.

## 2. Consolidate scattered material

When the brand exists across Notion, PDF decks, Figma, old chartes graphiques, founder notes, and tribal knowledge. This is the most common real-world case and the most error-prone.

1. Build an intake map first: list every source, what it contains, when it was last updated, and who owns it.
2. Extract facts per section, keeping the source noted. When two sources disagree, record every conflicting version verbatim.
3. Surface conflicts to the user before writing. Conflicts are usually: two taglines, two palettes, two names for a sub-brand, an old logo still in some decks. Do not silently pick one.
4. Let the user pick the canonical version for each conflict. Log each choice in the evolution journal with the source it replaced.
5. Produce the canonical BRAND.md, and a consolidation log: which sources were absorbed, which were archived, which superseded which.
6. Recommend deprecating or archiving the superseded sources so they stop contradicting the canonical file. A consolidation that leaves the old PDFs live has not finished.

## 3. Audit for drift

When the brand has a file (or scattered material) and the question is "is it still coherent, and where are the gaps?"

1. Read the current state end to end.
2. Check internal consistency: do the stated values match the voice section? Does the tone-by-channel list match how the brand actually writes on social? Do the forbidden terms still get avoided in the brand's own current copy?
3. Check external drift: compare the file to what the brand currently publishes (site, social, last campaigns, support replies). The gap between the file and reality is the audit's main output.
4. Check completeness against phase: a scale-up brand missing governance or legal sections has a structural gap, not a style preference.
5. Report drift findings, ranked by impact: voice contradiction > wrong palette code > missing governance > stale tagline > cosmetic.
6. Do not rewrite the file during an audit. Return findings and proposed fixes, and let the user confirm direction before any edit. An audit that silently rewrites loses its value as an independent check.

## 4. Governance

Governance becomes load-bearing as soon as more than one person or one agency touches the brand. Without it, every team drifts independently and the canonical file stops being canonical.

1. Define an approval matrix: decision type, owner, required reviewers, expected turnaround. Keep it short. Example rows: new logo variant, new sub-brand name, new tagline, third-party co-branding, use of mark by a partner.
2. Define forbidden usages concretely: specific logo misuses, specific misrepresentations, specific claims the brand will not make. Vague "use good judgment" is not governance.
3. Define licensing terms: what third parties may use, under which conditions, with which approval. This is what partners and agencies actually need.
4. Define access: who can read the file, who can edit, who can publish derived assets. A file everyone can edit stops being canonical.
5. Keep governance in the file itself, not in a separate doc that will go stale. Section 6 of the structure is the home for it.

## 5. Versioning

The evolution journal (section 10) is what lets the file explain itself years later.

1. Use semantic-ish versioning. The exact scheme matters less than consistency: major for rebrand or architecture change, minor for a new section or a changed rule, patch for a correction.
2. Every meaningful change gets an entry: version, date, one-line change summary, one-paragraph rationale, author.
3. The rationale is the point. "Changed tagline" is useless. "Replaced 'The road, reimagined' with 'Drive the difference' because the original read as aspirational rather than operational, per Q3 positioning workshop" is what prevents the next person from reverting it blindly.
4. Keep retired material findable. Old taglines, old palettes, old names belong in the journal or a short retired section, with dates. A rebrand that erases its history cannot defend its current choices.
5. Update `last_updated` and `version` in the frontmatter on every change. Other prompts rely on these to detect staleness.

## 6. Rebrand and pivot

A rebrand or pivot is the highest-stakes lifecycle event. Handle it as a versioned migration, not a silent overwrite.

1. Snapshot the current file before any change. The pre-rebrand state must be recoverable.
2. Decide the scope of the change: name only, visual identity only, positioning only, or full rebrand. Each has a different blast radius on derived assets.
3. Produce the new version with a clear major-version bump and a journal entry explaining the rationale.
4. Produce migration notes for derived assets: old logo files to replace, old tagline references to update in the site, decks, social templates, agent system prompts, email signatures, contracts. A rebrand that updates the BRAND.md but leaves the old logo in every deck is incomplete.
5. Decide what to keep visible from the old brand. Full erasure is rarely right; a retired section or journal entries preserve the ability to explain continuity to customers and staff.
6. Flag legal actions as human steps: new trademark filings, opposition windows, domain changes, social handle migration. Do not assert these are done; prepare the operator checklist.
7. After the rebrand, run the cold-agent test on the new file in isolation, then run it again after re-feeding the derived assets, to catch drift introduced during migration.
