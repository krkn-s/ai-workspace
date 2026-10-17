---
description: Ensure the project's shared AGENTS.md contains the multi-agent coordination section (.agents-sync, worktree-first, state.json and messages.jsonl protocol) — append it when missing, no-op when already present, repair when truncated.
argument-hint: "[instructions]"
---
Ensure this project's **shared, versioned `AGENTS.md`** contains the canonical multi-agent coordination section (bottom of this template). This is an idempotent maintenance task — the section must exist exactly once; never rewrite what is already there. Arguments may add instructions or override the target path.

Request:
<user_input>

$@

</user_input>

## Step 1 — Inspect

- Target the shared `AGENTS.md` at the repo root — never `AGENTS.override.md` (the rules must reach every agent through the versioned file) and never a global `~/.pi` file.
- File missing → go to **Step 3** (create).
- File present → read it and search for an existing coordination section — any heading whose text contains `Multi-agent coordination` or `Coordination multi-agents` (French legacy), or the `.agents-sync/` marker.
- If `git status --porcelain` shows `AGENTS.md` already modified, say so before touching it — parallel agents may share this tree.

## Step 2 — Decide

- **Absent** → **Step 3**.
- **Present** — compare the existing section against the canonical block, ignoring heading-level shifts (a demoted append is still a match).
  - **Identical** → report no-op and stop. Do not rewrite, translate, or realign anything.
  - **Different** (rules changed, added, removed, or sections missing/truncated) → expose the differences and ask which version to keep, as described below. Never decide this replacement unilaterally.

### When the section differs

Before touching anything:

- Walk the seven numbered sections one by one; for each divergence, quote the existing wording next to the canonical wording — enough context to judge, no full-file dump.
- Separate cosmetic-only divergences (heading levels, punctuation, typo fixes) from substantive ones (rules added, removed, or changed) so the choice is informed.
- Then ask one question — which version to keep:
  - **Existing** — keep the current section exactly as-is; no modification.
  - **Canonical** — replace the whole section with the canonical block, verbatim, same heading-level rule as **Step 3**.
- Apply only after the answer, and swap the section in one edit — never leave a mix of both versions.

## Step 3 — Apply

Append the canonical block to the end of the file, preceded by one blank line — or, when replacing a divergent section the user chose to overwrite, remove the old section entirely and put the block in its place. Never append a duplicate:

- Keep the block **verbatim** — English wording, structure, code fences — nothing translated, rephrased, or reordered.
- Legacy French sections (containing `Coordination multi-agents`) match detection but are always treated as **different** when compared against the canonical block — the user explicitly approves the replacement, which then rewrites the section in English.
- Single exception — if the file already has a level-1 heading, demote the block's headings one level (`#`→`##`, `##`→`###`, `###`→`####`) so the file keeps a single H1. Detection still matches the `Multi-agent coordination` text.
- File created from scratch → write just the block; its own H1 serves as the title.

Then re-read the file to confirm the section appears exactly once, and report — action taken (`created` / `appended` / `replaced` / `no-op`), `git diff --stat`, and a reminder to commit and push so other agents pick the section up. Do not commit unless asked.

## Canonical block

`````markdown
# AGENTS.md — Multi-agent coordination

Multiple agents work on this repository in parallel. Mandatory rules, two coordination files, zero external tooling.

## 1. Worktree-first

The main checkout is shared and will be overwritten under you. Before editing any file:

```bash
git worktree add ../<repo>-<your-task> -b agent/<your-task> main
cd ../<repo>-<your-task>
```

All changes happen inside this worktree, never elsewhere.

## 2. Coordination `.agents-sync/`

Two versioned files:

```text
.agents-sync/
├── state.json       # who is doing what: active agents, locks, tasks
└── messages.jsonl   # single messaging channel, append-only
```

`state.json` missing? Create it:

```json
{
  "version": 1,
  "agents": {},
  "locks": {},
  "tasks": []
}
```

### Writing `state.json`

Always atomic — read, modify in memory, write `state.json.tmp`, then:

```bash
mv state.json.tmp state.json
git add .agents-sync/state.json
git commit -m "agents: <action> (<your-id>)"
git push origin agent/<your-task>
```

**Push rejected**: another agent modified the state concurrently. `git fetch && git rebase origin/main`, re-apply your change, re-test, re-push. First push wins, you adapt.

### Messaging `messages.jsonl`

One file, append-only: lines are added, never removed.

```jsonl
{"from":"agent-1","to":"agent-2","ts":"2026-01-01T10:00:00Z","type":"info","msg":"I am editing src/auth/types.ts, stay away from it.","context":{"file":"src/auth/types.ts"}}
```

- `type`: `info` | `request` | `ack`; broadcast: `"to":"all"`.
- Read: `jq -c 'select(.to=="<your-id>" or .to=="all")' .agents-sync/messages.jsonl | tail -20`
- Push rejected: same arbitration as `state.json` (rebase, re-append, re-push).

## 3. Session protocol

**Start**

1. Sync to `main`, create your worktree (rule 1).
2. Read `state.json`, clean expired locks, read your messages.
3. Register yourself in `agents`: id, branch, worktree, task, `touches` (planned files).

**During**

- A file in another agent's `touches` or locked: do not touch it, coordinate by message.
- Lock: entry in `locks` (`agent`, `acquired`, `expires` max 2 h), released as soon as done.

**End — task merged**

1. Remove your `agents` entry, your locks, your completed tasks; commit + push.
2. `git worktree remove ../<repo>-<your-task>`; delete your branch.

## 4. Specs first

Architectural decisions and contracts (types, routes, interfaces) live in `specs/`. If your task touches a shared contract: read the spec before coding; to change it: modify and validate the spec **before** parallel work. The spec is the source of truth — not messages, not code.

## 5. Validation before merge

Detect the project's tooling (manifest, scripts, Makefile, CI) and use its native test and lint commands. Nothing detected: say so, validate by manual review.

Tests and lint green before every merge, no exceptions — and re-test after a rebase.

## 6. Git workflow

1. One branch per task, `agent/<your-task>` off `main`.
2. Frequent atomic commits; stage only your files.
3. Sequential merges, one at a time:

```bash
git push origin agent/<your-task>
git fetch origin
git rebase origin/main        # resolve conflicts, re-test
git checkout main && git merge --no-ff agent/<your-task>
git push origin main
```

## 7. Prohibitions

- `git stash` — stack shared across worktrees; use commits or patches instead.
- Non-atomic writes to `state.json`.
- Removing a line from `messages.jsonl`.
- Editing a locked or claimed file without coordination.
- Merging without green tests and lint.
`````