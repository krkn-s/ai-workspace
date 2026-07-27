---
description: Archive a change — merge its deltas into current/ and move it to 3-archive/
argument-hint: "<change-id>"
---
Archive a completed change: run the verify gate, merge its deltas into `current/`, and move the folder to `3-archive/`. Terminal step of the lifecycle.

Change id: $1

This prompt loads the `spec-vibe` skill. Read `references/workflow.md` (archive procedure). Archiving is irreversible enough that it always confirms with the user first.

## Step 1 — Confirm the change is archivable

```bash
ls specs/changes/2-done/
rg -n '^#' -g '*.md' specs/changes/2-done/<id>/
```

- The change must be in `2-done/`. If it is in `1-wip/`, send the user to `/spec-verify` first.
- Every `depends_on` entry must already be in `3-archive/`. If a predecessor is not archived yet, stop and sequence first — do not archive out of order.

## Step 2 — Run the verify gate

Before merging, confirm spec↔code alignment (see `/spec-verify`). Do not merge a spec that lies about the code. If gaps surface, hand back to the user and stop.

## Step 3 — Apply the delta to current/

For each `specs/<domain>.delta.md` in the change, apply it to `current/<domain>.spec.md`:

- `## ADDED Requirements` → append each requirement (with its scenarios) under `## Requirements`.
- `## MODIFIED Requirements` → replace the existing requirement in place.
- `## REMOVED Requirements` → delete the requirement from the current spec.
- Update `current/<domain>.spec.md`'s `updated:` date.

If `current/<domain>.spec.md` does not yet exist (brand-new capability), create it from the delta's `## ADDED Requirements`, seeded with a `## Purpose` taken from the proposal.

A `MODIFIED`/`REMOVED` must target a requirement that exists in `current/`. If it does not, the delta or the current spec is wrong — surface it, do not guess.

## Step 4 — Move the folder

```bash
git mv specs/changes/2-done/<id> specs/changes/3-archive/
```

Do not delete anything. The archive is the audit trail — proposal, design, tasks, and the original delta all stay readable.

## Step 5 — Summarize

Give the user a one-line statement of what the source of truth now says (e.g. "`current/auth.spec.md` now includes 2FA; sessions expire after 15 min"). Confirm `current/` reflects the merged behavior with a quick `rg '^### Requirement:' specs/current/<domain>.spec.md`.
