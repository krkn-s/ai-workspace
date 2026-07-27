---
description: Verify spec↔code alignment for a change before archiving it
argument-hint: "<change-id>"
---
Run the verify gate for a change: confirm the implementation matches the spec, surface gaps, and let the human decide before archive.

Change id: ${1:-<detect the latest in 2-done>}

This prompt loads the `spec-vibe` skill. Read `references/workflow.md` (the verify gate). The gate is lightweight and human-in-control — it reports gaps, it does not auto-fix.

## Step 1 — Locate the change

Resolve the id. If none was given, list candidates in `2-done/` (and `1-wip/` if the user is checking early):

```bash
ls specs/changes/2-done/
rg -n '^#' -g '*.md' specs/changes/2-done/<id>/
```

If the id is ambiguous or missing, ask which change to verify.

## Step 2 — Read the spec

Read the change's `specs/<domain>.delta.md` fully. Extract every `### Requirement:` and `#### Scenario:`. These are the claims being verified.

## Step 3 — Diff spec ↔ code

For each requirement and scenario, check whether the code satisfies it. Use `rg`/`fd` to find the implementation; read it; compare behavior, not just names. Classify each finding:

- **spec says X, code does not** — missing implementation.
- **code does X, spec does not say** — undocumented behavior; usually a gap in the delta.
- **spec and code disagree** — contradiction; one is wrong.

Also check the change's `tasks.md`: are all items checked? Is the `## Verification` group satisfied?

## Step 4 — Report gaps, ask, do not archive

List each gap with severity and a proposed resolution (fix code / fix spec / accept as a known limitation recorded in the proposal). For each real gap, ask the user how to resolve it. Do **not** archive until the user confirms.

If real gaps remain, offer to send the change back to `1-wip/` instead of archiving.

## Step 5 — Outcome

- If clean: tell the user the change is ready to archive, and offer `/spec-archive <id>`.
- If gaps remain: hand back the gap list and the recommended next step. Do not archive.
