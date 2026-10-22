---
description: "Ensure the project's versioned AGENTS.md carries the multi-agent coordination section: append it when missing, report a no-op when identical, quote and arbitrate divergences when not. State lives in the clone's shared .git directory."
argument-hint: "[instructions]"
---

# Multi-agent coordination section in AGENTS.md

Request:
<user_input>

$@

</user_input>

You own exactly one section of the project's AGENTS.md: `## Multi-agent coordination`. Read the whole file first and report what exists. Touch only your section: every other byte stays identical, appends land after existing content, collisions surface to the user instead of being absorbed. Target the versioned file, never `AGENTS.override.md` or a global `~/.pi` file: the rules must reach every agent through the clone.

If `git status --porcelain` shows AGENTS.md already modified, say so before touching it: parallel agents may share this tree.

Test every line: **does removing it cost a real, silent failure?** If not, delete it.

## Target state

- **Missing**: append the block below, preceded by one blank line.
- **Identical** (ignoring heading levels): report the no-op, change nothing.
- **Different**: quote each divergence, existing wording next to canonical wording, then ask once whether to keep the existing section or replace it wholesale. Never mix halves, never translate or reformat what the user keeps.

Report the action taken, show `git diff --stat`, remind the user to commit and push so other agents pick the section up. Do not commit.

## Block

`````markdown
## Multi-agent coordination

Multiple agents work on this repository in parallel, each in its own worktree. Coordination state lives in this clone's shared `.git` directory: every worktree sees it, and nothing is ever committed, pushed, or merged for coordination. Scope: one machine, agents sandboxed under this repo's tree.

**Start.** Derive the default branch, announce yourself, open your worktree:

```bash
MAIN="$(git symbolic-ref --short refs/remotes/origin/HEAD 2>/dev/null | sed 's|origin/||')"; MAIN="${MAIN:-main}"
TASK="<your-task>"
ID="$TASK-$(printf '%04x' $RANDOM)"
STATE="$(git rev-parse --path-format=absolute --git-common-dir)/agents-sync"
mkdir -p "$STATE/state" "$STATE/messages"
git worktree add "../$(basename "$PWD")-$TASK" -b "agent/$TASK" "$MAIN"
printf '{"id":"%s","branch":"agent/%s","task":"%s","touches":[],"ts":"%s"}\n' "$ID" "$TASK" "$TASK" "$(date -u +%FT%TZ)" > "$STATE/state/$ID.tmp" && mv "$STATE/state/$ID.tmp" "$STATE/state/agent-$ID.json"
```

**Files** in `$STATE` (plain filesystem, always written atomically with `mv <file>.tmp <file>`):
- `state/agent-<id>.json`: one per agent, written only by its owner: id, branch, worktree, task, `touches` (files it plans to change), ts.
- `messages/<ts>-<from>-<to>.json`: one file per message, `type` is `info`, `request`, or `ack`, `to` may be `all`. Read your inbox at start, before your first edit, and before any merge; never edit or delete a message, answer a `request` with an `ack`.

**During.** Declare the files you plan to change in `touches` before your first edit. Liveness comes from `git worktree list`, not from a heartbeat. Before editing a file another agent lists in `touches`, or a shared contract, post a `request` and wait for the `ack`. Lockfiles are never merged: rebase and regenerate them.

**Stale.** A state file older than 15 minutes whose worktree is gone from `git worktree list`: post a `request` and take over only if no `ack` and no objection arrives within 5 minutes.

**End.** Delete your state file, then merge one agent at a time:

```bash
git fetch origin && git rebase "origin/$MAIN"
# in the primary checkout, only with no uncommitted changes
git merge --no-ff "agent/$TASK" && git push origin "$MAIN"
```

**Prohibitions.** No `git stash`: it is shared across every worktree of the clone. No writing another agent's state file, no editing an existing message. No merging without green tests and lint, and no merge while another agent is merging.
`````

Rien d'autre à faire.
