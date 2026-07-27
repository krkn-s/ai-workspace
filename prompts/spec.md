---
description: Propose and scaffold a spec-driven change (forward path) under specs/
argument-hint: "<feature or idea>"
---
Propose and scaffold a new change in the project's `specs/` tree, using the spec-driven forward path: spec first, then code.

What to build / the idea: $@

This prompt is the entry point. Load and follow the `spec-vibe` skill for the full structure, artifact templates, and lifecycle rules. Do not improvise the structure.

## Step 1 — Read before writing

Inspect what already exists so you never re-litigate a settled decision or duplicate in-flight work:

- `rg '^### Requirement:' specs/current/` — current behavior, by domain.
- `fd . specs/decisions -e md` and `rg '^# ADR ' specs/decisions` — accepted decisions to honor or supersede.
- `rg '^domain:' specs/changes/1-wip/` — in-flight work on the same area.
- If no `specs/` tree exists, propose scaffolding the empty spine and a one-line pointer in `AGENTS.md` (ask before creating/editing a project-level `AGENTS.md`).

## Step 2 — Scope

Determine the domain, the intent, and the explicit non-goals. Propose a short scope grounded in what the user actually needs now. Confirm before writing. A thin correct change beats a thick speculative one.

## Step 3 — Scaffold

Create `specs/changes/0-draft/<id>/` where `<id>` is `YYYY-MM-DD-<slug>`. Produce all four artifacts (Full is the rule for changes):

- `proposal.md` — intent, in/out scope, approach, links.
- `specs/<domain>.delta.md` — behavior-first requirements + scenarios as `ADDED`/`MODIFIED`/`REMOVED`, using GIVEN/WHEN/THEN and RFC 2119 keywords.
- `design.md` — technical approach, decisions, file changes, risks. Promote any significant decision to an ADR in `decisions/NNNN-<slug>.md` and link it.
- `tasks.md` — numbered checklist ending in a `## Verification` group that maps back to the delta's scenarios.

Use the templates in the skill's `references/artifacts.md` verbatim. Keep the heading taxonomy strict — `rg -n '^#' -g '*.md' specs/` is the project's dashboard.

## Step 4 — Capture, do not invent

For every undecided requirement or constraint, mark it `Open question` in the proposal with a one-line note. Do not synthesize behavior the user has not stated. Surface conflicts (two possible behaviors, two contracts) and let the user pick.

## Step 5 — Approve before code

Present the plan to the user: the delta's requirements, the design's key decisions, and the task outline. Get explicit approval before any implementation. On approval, `git mv` the folder to `1-wip/` and implement.

## Step 6 — Cold-agent test

End by listing the questions a brand-new agent would still need to ask after reading only `current/`. Those are the source of truth's remaining gaps, surfaced honestly.
