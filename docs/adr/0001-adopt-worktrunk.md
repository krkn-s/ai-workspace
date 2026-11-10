# ADR 0001: Adopt worktrunk instead of building a coordination tool

- Status: Accepted
- Date: 2026-10-31

## Context

The goal is 4 to 8 pi agents working in parallel on one clone, autonomous once launched: one branch and one worktree per task, a shared coordination state, a disciplined merge path. pi's permission sandbox confines each agent to its worktree, the shell cwd does not persist between tool calls, and concurrent `git config` writes fail on lock contention.

Three architectures were studied in `docs/plans/2026-10-31-agent-swarm.md` before this one: a helper script installed in the shared git dir and reached through a git alias, a helper-less protocol of copyable shell blocks, and a bespoke pi extension estimated at 400 to 600 lines. Each was withdrawn for a reason measured or argued in the plan. The original constraint, installing no external tool, was lifted by the owner on 2026-10-31.

Research on the field (same date, numbers rounded): worktrunk is a Rust CLI for git worktree management aimed at parallel AI agents, MIT or Apache-2.0, created 2025-10, about 9.6k stars, 5.4k commits, releases roughly weekly, category leader by a factor of 20 to 75 over gwq, lazyworktree and gwm, with a merge pipeline, hooks, per-worktree ports and cache sharing. `pi-worktrunk` is the only deep pi integration in the landscape: an agent tool, a `/wt` command, session placement through linked sessions, and recovery after worktree removal, about 1.7k downloads a month. Multiplexer tools solve window management, not this. Orchestrators are GUI task boards, not pi-aware, and out of scope. Claude Code's `--worktree` is Claude-only. No tool in the field covers inter-agent coordination; that layer stays ours either way.

## Decision

Adopt `wt` for worktree mechanics and the merge pipeline, and `pi-worktrunk` for session placement and agent access. Do not build a helper, an alias, or an extension. Keep the coordination layer as a dumb protocol of copyable POSIX sh blocks in the `agent-swarm` skill: claims, shared contracts, messages and acks, `mkdir` locks, one merge at a time. Repos carry no coordination section: a single line in the global `~/.pi/agent/AGENTS.md` points sessions to the skill (see the update below).

## Consequences

- Installation becomes a machine-level step owned by the human: `wt` on PATH and `pi install npm:pi-worktrunk`. A fresh machine or collaborator follows the same two steps; agents must refuse to improvise a replacement protocol.
- Two single-maintainer dependencies. Exit is fork: both are permissively licensed. If pi-worktrunk stops working, degrade to worktrunk's own pi plugin (activity markers only) plus direct `wt` calls; the coordination protocol does not depend on the extension.
- Never install worktrunk's pi plugin alongside pi-worktrunk: both write activity markers and would race.
- `wt merge` never fetches and never pushes; the skill's merge recipe wraps it with fetch and push, and keeps the merge lock as our layer, since `wt` has no cross-agent merge serialization.
- On ext4 there are no reflinks: carrying dependency caches into worktrees copies in full. Disk must be budgeted for the number of agents.
- The bespoke-extension option is withdrawn; its hardest part, session placement and recovery, already exists in maintained code. The estimated 400 to 600 lines ignored that component, and the extension we would have written would have been a lesser copy of pi-worktrunk.

## Update 2026-11-10

The per-repo `## Multi-agent coordination` section is dropped, and the `agents-md-swarm` prompt deleted with it. The trigger is one line in the global `~/.pi/agent/AGENTS.md`, read in every project: on a git repo where other agents may work, the agent reads this skill before its first edit, and works directly elsewhere. Repos the prompt had touched lose their section when next visited. The protocol itself did not move.