---
description: "Ensure the project's versioned AGENTS.md carries the wt-based multi-agent coordination section: append it when missing, report a no-op when identical, quote and arbitrate divergences when not. Coordination state lives in the clone's shared .git directory, never committed."
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

Several agents may work in this clone at once, one branch and one worktree per task, managed with `wt` (worktrunk). Read the `agent-swarm` skill before claiming a branch, editing shared contracts, or merging.

- Identity is the branch. Claim it under `agents-sync/` in the shared git dir before your first edit, release after the merge. Nothing there is ever committed.
- Enter your worktree before editing: pi uses the `worktrunk` tool or `/wt switch --create`; other agents run `wt switch --create`. `wt switch` in a pi bash shell creates the worktree but never moves the session.
- Declare shared contracts and lockfiles, not files: each worktree has its own copy. Before touching another agent's declared contract, post a message and wait for the ack.
- One merge at a time: take the merge lock, `git fetch`, run the merge recipe from the skill, `git push`, release. A rejected push means fetch, rebase, retest, retry.
- Never remove or prune another agent's worktree. A stale claim whose worktree is gone from `git worktree list` follows the takeover recipe: request, wait, take.
- If `wt` or the `worktrunk` tool is missing, say so and stop: the owner installs them. Do not improvise a replacement protocol.
`````
