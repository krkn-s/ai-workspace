---
description: Audit specs/ for drift — code without a spec, spec without code, contradicting ADRs
argument-hint: "[domain or path]"
---
Audit the `specs/` tree (and the code it should describe) for drift. This is the entry point for the reverse path and for keeping the source of truth honest.

Focus (optional): $@

This prompt loads the `spec-vibe` skill. Read `references/triggers.md` (what counts as spec-worthy, reverse detection) and `references/unix-queries.md` (the queries that power the audit). An audit **reports**; it does not rewrite.

## Step 1 — Map the current truth

- `fd 'spec\.md$' specs/current/` — the documented behavior.
- `rg '^### Requirement:' specs/current/` — every requirement the project claims.
- `rg '^#### Scenario:' specs/current/` — every scenario.
- `fd . specs/decisions -e md` and `rg '^status:' specs/decisions` — accepted/ deprecated ADRs.

## Step 2 — Find drift in three directions

- **Code without spec.** Behavior in the codebase that no `current/*.spec.md` documents. Look at route handlers, exported functions, schema definitions, public APIs, config consumed by other code. For each, check whether a requirement covers it.
- **Spec without code.** Requirements or scenarios in `current/` that the code no longer satisfies (stale, removed, or never implemented).
- **Contradicting decisions.** Code or in-flight proposals that conflict with an accepted ADR.

Be intelligent about scope: pure content/docs/marketing files are **not** drift — the test is behavior change, not file edits. Ignore formatting, renaming, comments, and explicitly throwaway experiments.

## Step 3 — Classify and propose the smallest fix

For each drift item, report:

- what is missing or contradictory, with file:line evidence
- direction (code-without-spec / spec-without-code / contradicting-adr)
- the smallest fix: add a spec, update a spec, file a change, supersede an ADR

Do not apply fixes. Let the human choose.

## Step 4 — Offer the reverse path

For the most important code-without-spec items, offer to run the reverse path: scaffold a `0-draft/<id>/` change with `origin: vibe`, reverse-engineer the spec from what was built, and validate it via Q&A. Do not generate specs silently — confirmation first.

## Step 5 — Summarize

End with a ranked list: the drift items that put the source of truth most at risk, and the single next action you recommend.
