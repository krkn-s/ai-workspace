# Workflow, State Machine & Archive

The lifecycle of a change: how it moves between state folders, how deltas merge into `current/` at archive, and the verify gate that runs before merge. Read this for verify and archive tasks.

## The state machine

```text
0-draft ──git mv──▶ 1-wip ──git mv──▶ 2-done ──verify+merge──▶ 3-archive
```

| State | What happens here | Exit gate |
|---|---|---|
| `0-draft/` | Spec/proposal/design/tasks written. Forward: plan approved before code. Reverse: spec reconstructed and validated via Q&A. | Plan approved (forward) **or** spec validated (reverse) |
| `1-wip/` | Implementation against the tasks. Artifacts updated as you learn. | All tasks checked, scenarios pass |
| `2-done/` | Implementation complete, pending verification and archive. | Verify gate passed |
| `3-archive/` | Deltas merged into `current/`; folder preserved. Terminal. | — |

Transitions are `git mv` of the whole folder. The content does not change on a transition — only the location — so Git records a rename and history is preserved.

### Transition commands

```bash
# draft → wip
git mv specs/changes/0-draft/<id> specs/changes/1-wip/

# wip → done
git mv specs/changes/1-wip/<id> specs/changes/2-done/

# done → archive (after verify + merge)
git mv specs/changes/2-done/<id> specs/changes/3-archive/
```

Update each artifact's `updated:` date when you transition. Nothing else in the frontmatter changes — there is no `status` field by design.

## Forward workflow (default)

1. **Read.** `rg '^### Requirement:' specs/current/<domain>.spec.md` to see existing behavior. Check `decisions/` for relevant ADRs. Check `changes/` for in-flight work on the same domain.
2. **Scaffold.** Create `specs/changes/0-draft/<id>/` with `proposal.md`, `specs/<domain>.delta.md`, `design.md`, `tasks.md`. Use the templates in `artifacts.md`.
3. **Specify.** Write behavior-first requirements + scenarios in the delta. State non-goals in the proposal.
4. **Plan.** Fill design (approach + decisions) and tasks (numbered checklist ending in verification).
5. **Approve.** Present the plan to the user. Get explicit approval before touching code.
6. **Implement.** `git mv` to `1-wip/`. Work through `tasks.md`, checking items off. Update artifacts as you learn — design shifts, tasks reorder, the delta gains a `MODIFIED` if scope moves.
7. **Finish.** `git mv` to `2-done/`.
8. **Verify.** Run the verify gate (below).
9. **Archive.** Merge + `git mv` to `3-archive/`.

## Reverse workflow (vibe → spec)

See `triggers.md` for detection. The mechanics:

1. Detect behavior change without a spec; surface it to the user.
2. `0-draft/<id>/` with `origin: vibe`.
3. Reverse-engineer proposal + delta + design + tasks from what was built.
4. Mark uncertainty as `Open question`.
5. Validate via Q&A; record answers.
6. From here the lifecycle is identical: implement any remaining work → `1-wip/` → `2-done/` → verify → archive.

## Stacking & dependencies

Use the frontmatter to model ordering across parallel changes:

```yaml
depends_on:
  - 2025-12-01-add-oauth      # must archive first
provides:
  - theme-system              # capability this exposes
requires:
  - auth-session              # capability this needs
```

- `depends_on` is the source of truth for archive ordering. Archive predecessors first; refuse to archive a change whose `depends_on` entries are not yet in `3-archive/`.
- `provides`/`requires` are capability markers for planning visibility. They do **not** create implicit edges — declare ordering explicitly with `depends_on`.
- If two active changes touch the same requirement, surface the overlap and let the user sequence them; do not archive both blindly.

## Verify gate (before archive)

Before merging, confirm the implementation matches the spec. This is a **lightweight, human-in-control** gate — it reports gaps, it does not auto-fix.

1. **Diff spec ↔ code.** For each `### Requirement:` and `#### Scenario:` in the delta, check whether the code satisfies it.
2. **List gaps.** Classify each:
   - spec says X, code does not (missing implementation)
   - code does X, spec does not say (undocumented behavior — usually a delta gap)
   - spec and code disagree (contradiction)
3. **Ask.** For each gap, ask the user how to resolve: fix code, fix spec, or accept the gap (recorded as a known limitation in the proposal).
4. **Decide.** Do not archive until the user confirms. If real gaps remain, the user may choose to send the change back to `1-wip/` instead of archiving.

The verify gate is what prevents archiving a spec that lies about the code.

## Archive procedure (merge + move)

Archiving completes a change: its deltas merge into the source of truth, and the folder is preserved for history.

```text
Before archive:

specs/
├── current/
│   └── auth.spec.md ◄─────────────────┐
└── changes/2-done/
    └── add-2fa/
        ├── proposal.md
        ├── design.md
        ├── tasks.md
        └── specs/auth.delta.md ───────┘   merge


After archive:

specs/
├── current/
│   └── auth.spec.md        # now includes the 2FA requirements
└── changes/3-archive/
    └── add-2fa/            # preserved, full context intact
```

Steps:

1. **Confirm dependencies.** Every `depends_on` entry is already in `3-archive/`. If not, stop and sequence first.
2. **Run the verify gate.** Do not merge a spec that does not match the code.
3. **Apply the delta** to `current/<domain>.spec.md`:
   - `## ADDED Requirements` → append each requirement (with its scenarios) under `## Requirements`.
   - `## MODIFIED Requirements` → replace the existing requirement in place; keep a one-line `(Previously: …)` note only if the rationale is not obvious from the delta.
   - `## REMOVED Requirements` → delete the requirement from the current spec.
   - Update `current/<domain>.spec.md`'s `updated:` date.
4. **Move the folder.** `git mv specs/changes/2-done/<id> specs/changes/3-archive/`. Do not delete — the archive is the audit trail (proposal, design, tasks, and the original delta all stay readable).
5. **Summarize.** Give the user a one-line statement of what the source of truth now says.

If a change touched multiple domains (multiple `<domain>.delta.md` files), apply each to its corresponding `current/<domain>.spec.md`. If a `current/<domain>.spec.md` does not yet exist (brand-new capability), create it from the delta's `## ADDED Requirements`, seeded with a `## Purpose` from the proposal.

## Failure modes during archive

- **Dependency not archived yet.** Stop; archive the predecessor first, or remove the `depends_on` if it was wrong.
- **Verify gate surfaced real gaps.** Do not archive. Send back to `1-wip/` or update the spec, then re-verify.
- **Delta references a requirement that does not exist in current/.** A `MODIFIED`/`REMOVED` must target an existing requirement. If it does not, either the delta is wrong or the current spec is stale — surface it, do not guess.
- **Two archived changes modified the same requirement.** Acceptable if sequenced via `depends_on`; the later archive wins. If unsequenced, flag the conflict to the user.
