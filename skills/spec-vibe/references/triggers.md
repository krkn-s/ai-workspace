# Triggers & the Reverse Path

This skill is bidirectional. Most work is forward (spec first). Some is reverse (code first, spec generated after). This reference defines exactly what fires the skill, how to detect the reverse path, and the procedure for retroactively generating a spec from vibe-coded work.

Read this for any audit or reverse-path task.

## What counts as spec-worthy

A change is spec-worthy when it changes **behavior a user or downstream system relies on**. The skill fires (forward or reverse) for:

- a new feature, capability, or user-facing behavior
- a modification to an API, data schema, contract, protocol, or config that other code consumes
- a bug fix that alters an observable contract (not a pure typo/format fix)
- a refactor with an externally visible effect
- a change to security, privacy, reliability, or compatibility guarantees

## What does NOT fire

Stay silent — do not propose specs — for:

- prose, documentation, marketing copy, or content creation with no behavior change
- formatting, whitespace, renaming, comments, import sorting
- throwaway experiments the user explicitly marks as throwaway (`// vibe`, `scratch`, `wip-throwaway`)
- config tweaks with no contract impact (cosmetic env vars, log levels)
- dependency version bumps with no behavior change

The discrimination is intelligent: the skill cares about **behavior change**, not file edits. Editing a markdown doc is not spec-worthy; editing a route handler usually is.

## Forward triggers

The forward path fires when intent precedes code. Signals:

- the user says "build", "add", "implement", "refactor", "support", "migrate", "replace" a feature or behavior
- the user asks to "spec", "propose", "write requirements", "define acceptance"
- a change to an API/schema/contract is being planned
- work that will touch more than one module to deliver a behavior

Forward procedure: create `0-draft/<id>/`, write proposal → delta → design → tasks, get the plan approved, then implement. See `workflow.md`.

## Reverse triggers (vibe → spec)

The reverse path fires when **code is being changed without a spec/change folder for it**. This is allowed — exploration can happen live — but the skill then ensures a spec gets generated and validated.

### Detection signals

Fire the reverse path when **any** of these are true during work on code:

- the diff touches files the agent has not mapped to any existing `current/*.spec.md` requirement
- a fix introduces a regression (fixing one thing breaks others the agent did not see)
- more than one contributor is touching the area
- the work will land in production or something production depends on
- scope creeps during a session (the change grew well beyond its initial ask)
- a new behavior, endpoint, schema field, or user-facing capability appears with no corresponding change folder

Do **not** fire the reverse path for pure content/docs/marketing work even if it is extensive — the test is behavior change, not effort.

### Reverse procedure

1. **Detect.** While working, notice that behavior is changing without a spec. Pause before the change grows further.
2. **Surface.** Tell the user plainly: "this changes behavior that has no spec yet. I can reconstruct one from what we built." Do not silently invent requirements.
3. **Scaffold.** Create `0-draft/<new-id>/` with `origin: vibe`.
4. **Reverse-engineer.** From what was **observably built** (read the diff, the code, the conversation), draft:
   - `proposal.md` — intent and scope, reconstructed
   - `specs/<domain>.delta.md` — the behavior that was added/changed/removed, as `ADDED`/`MODIFIED`/`REMOVED` requirements with scenarios
   - `design.md` — the approach actually taken, with the decisions that were made (promote any significant one to an ADR)
   - `tasks.md` — what was done, checked off; plus any remaining steps
5. **Mark uncertainty.** Anything you cannot verify from the code or conversation becomes an `Open question` in the proposal — never a silent assumption.
6. **Validate via Q&A.** Walk the user through the reconstructed spec. For each requirement and each `Open question`, confirm or correct. Record the answers.
7. **Advance.** Once approved, the change follows the normal lifecycle (`0-draft → 1-wip → 2-done → 3-archive`). At archive, the delta merges into `current/`, and the source of truth becomes truthful.

The `origin: vibe` frontmatter records that the spec followed the code, so a future reader understands the provenance.

## Audit (spec drift)

`/spec-audit` is the batch form of the reverse path. It reports drift in three directions:

- **code without spec** — behavior in the codebase that no `current/*.spec.md` documents (the reverse path, applied across the repo)
- **spec without code** — requirements in `current/` that the code no longer satisfies (stale specs)
- **contradicting decisions** — code or proposals that conflict with an accepted ADR

An audit reports; it does not rewrite. For each drift item, propose the smallest fix (add a spec, update a spec, file a change, supersede an ADR) and let the human choose. See `unix-queries.md` for the queries that power the audit.

## Trigger quick reference

```text
SPEC-WORTHY (fire, forward or reverse):
  • new feature / behavior / capability
  • API, schema, contract, protocol change
  • bug fix changing an observable contract
  • refactor with external effect
  • security / privacy / reliability / compatibility change

REVERSE SIGNALS (vibe → spec):
  • diff touches unmapped files
  • regression appears (fix breaks others)
  • >1 contributor / production dependency
  • scope creep in session
  • new behavior with no change folder

DO NOT FIRE:
  • prose, docs, marketing, content (no behavior change)
  • formatting, renaming, comments, import sort
  • throwaway experiments (explicitly marked)
  • config tweaks with no contract impact
```
