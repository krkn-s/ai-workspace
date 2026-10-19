---
description: Ensure the project's shared AGENTS.md contains the multi-agent coordination section (.agents-sync, worktree-first, per-agent state files, locks.json, message files, session protocol) — append it when missing, no-op when already present, repair when truncated.
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
- Note every unrelated section you find (brand blocks, rules owned by other prompts or tools, anything you did not write): it stays byte-identical. You own only the coordination section; never reorder, merge, reformat, or delete anything else, and appends never land inside an unrelated section.
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

Multiple agents work on this repository in parallel. Mandatory rules, coordination files, zero external tooling.

## 1. Worktree-first

The main checkout is shared and will be overwritten under you. Before editing any file:

```bash
git worktree add ../<repo>-<your-task> -b agent/<your-task> main
cd ../<repo>-<your-task>
```

All changes happen inside this worktree, never elsewhere.

## 2. Coordination `.agents-sync/`

Coordination files, each agent writing ONLY its own — concurrent writes never conflict on the same file:

```text
.agents-sync/
├── state/
│   └── agent-<id>.json        # one registration file per agent, written only by its owner
├── locks.json                 # shared contracts + non-mergeable files only
└── messages/
    └── <ts>-<from>-<to>.json  # one file per message ("-to" is an agent id or "all")
```

`locks.json` missing? Create it:

```json
{
  "version": 1,
  "locks": {}
}
```

### Writing coordination files

Always atomic — read, modify in memory, write `<file>.tmp`, then:

```bash
mv <file>.tmp <file>
git add .agents-sync
git commit -m "agents: <action> (<your-id>)"
git push origin agent/<your-task>
```

You only ever modify your own `state/agent-<id>.json` and your own entries in `locks.json` — never another agent's file or entries.

**Push rejected**: another agent pushed concurrently. `git fetch && git rebase origin/main`, resolve, re-push. First push wins, you adapt. If the rebase conflicts on `locks.json`, resolve by **union**: keep both sides' entries, write atomically, commit, re-push.

### Messaging `messages/`

One file per message, named `<ts>-<from>-<to>.json` (`to` = a recipient id, or `all`) — adding a message never touches an existing file:

```json
{"from":"agent-auth-a1f2","to":"agent-api-9d3c","ts":"2026-01-01T10:00:00Z","type":"info","msg":"I am editing src/auth/types.ts, stay away from it.","context":{"file":"src/auth/types.ts"}}
```

- `type`: `info` | `request` | `ack`; broadcast: `"to":"all"` (filename ends `-<to>-all`).
- Read your inbox:

```bash
cat .agents-sync/messages/*-<your-id>.json .agents-sync/messages/*-all.json | jq .
```

Order by the `ts` in the filename prefix. Never delete, edit, or re-encode an existing message file — your own messages included. A `request` is answered with an `ack` message addressed back to the sender.

## 3. Session protocol

**Start**

1. Sync to `main`, create your worktree (rule 1).
2. Read `state/` (all agent files) and `locks.json`: expired locks (older than 30 min) are removed; an unknown `version` in `locks.json` → stop and report to the user, never write.
3. Register yourself: id = `agent-<task>-<4 random chars>` (check `ls state/` — if taken, add a suffix), then write `state/agent-<id>.json` with: id, branch, worktree, task, `touches` (planned files), `ts` (a timestamp you update on every later rewrite of this file).
4. Read your messages (rule 2).

**During**

- A file in another agent's `touches`: do not touch it — coordinate by message first, who takes it, then declare it in your `touches`.
- Lock — reserved for shared contracts and non-mergeable files (`specs/` types, lockfiles, binaries), where a merge cannot reconcile two versions: entry in `locks.json` (`agent`, file, `acquired`, `expires` max 30 min), released as soon as done. Ordinary code files rely on `touches`, messages, and merges — never lock them.
- Taking over a stale lock: a lock that expired, or whose agent's `state/` file has not been rewritten for 30 min, may be taken over. For a **live** lock, only after posting a `request` message announcing the takeover and waiting 5 minutes for an objection — then override the lock entry (your `acquired`, your `expires`) and notify.
- Keep your `state/agent-<id>.json` fresh: rewrite it (same atomic write, new `ts`) whenever your `touches` change materially or at least every 30 min while working — it is your liveness marker for the takeover rule.

**End — task merged**

1. Delete your `state/agent-<id>.json`, clear your `locks.json` entries; commit + push.
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
- Non-atomic writes to any `.agents-sync` file.
- Deleting, editing, or re-encoding a `messages/` or `state/` file you do not own.
- Editing a shared contract (`specs/`) or protected file claimed or locked by another agent, without coordination.
- Merging without green tests and lint.
`````