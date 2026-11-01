# Agent swarm on worktrunk

## Objective

Run 4 to 8 pi agents in parallel on one repo, autonomous once launched: each agent claims a branch, works in its own worktree, coordinates through a shared state directory, and merges without stepping on the others.

Adopt the mature tools instead of building: `wt` (worktrunk CLI) for worktree mechanics and the merge pipeline, `pi-worktrunk` for session placement and agent access. The catalog ships only the AGENTS.md section, the coordination protocol in a skill, and an ADR. No bespoke helper, no extension to write, no tool file committed to any repo.

This revision supersedes every earlier architecture in this file: helper in the shared git dir, then helper-less protocol, then bespoke extension. The trail is summarized in History and will be captured in `docs/adr/0001`.

## Research findings (verified 2026-10-31)

- `wt` / worktrunk: Rust, MIT OR Apache-2.0, created 2025-10. About 9.6k stars, 5.4k commits, v0.81.0 (2026-10-20), releases roughly weekly, commits daily. CI, codecov, benchmarks, docs site, plugins for six agent CLIs. Two third-party health indexes score it 90 to 93 over 100. Category leader by adoption: 20 to 75 times the stars of any direct rival.
- `pi-worktrunk` (Matthias Vallentin): the only deep pi integration that exists. `worktrunk` agent tool, `/wt` command, session moves through linked sessions, recovery after worktree removal, activity markers in `wt list`. v0.13.0 (2026-10-23), about 1.7k downloads a month, single maintainer. Requires pi 0.99.1 or later (this machine runs 1.4.0) and a current `wt`.
- Alternatives assessed and rejected:
  - Worktree CLIs (gwq, lazyworktree, gwm, wtp, timvw/wt): far smaller communities, none matches the merge pipeline, hooks, LLM commits and CI status, none has a pi integration. gwq is dormant since 2026-05. gwm is the closest philosophically (daemon, undo, declarative bootstrap) but is the youngest and smallest.
  - Multiplexer tools (workmux, worktree-cockpit): tmux or zellij bound, a different problem.
  - Orchestrators (agent-orchestrator, Conductor, Superset/Paradev, Emdash, Workstreams): GUI task boards, not pi-aware, conflict with the prompts and skills stack, excluded by non-goals.
  - Claude Code `--worktree`: excellent, Claude only.
- Coverage check against our needs. Covered: worktree lifecycle, session placement, merge pipeline, per-worktree ports, preparation hooks, status and markers. Not covered anywhere in the landscape: inter-agent coordination, meaning claims, contracts, messages and the merge lock. That layer stays ours and stays dumb.
- Known frictions, accepted: `wt merge` never fetches, the recipe wraps it. ext4 gets full-copy caches, no reflink. `wt merge` removes the source worktree by default, the release sequence accounts for it. Two single-maintainer projects, both permissively licensed, fork is the exit.

## Constraints verified on this machine

- `bash` is confined to the project cwd. External reads and writes are refused, even `/tmp` and `~/.pi`.
- A script executed from inside the repo can write to the shared git dir, including with a cwd in a linked worktree. The protocol relies on this.
- `read` reads the installed pi package, including catalog AGENTS.md and skills.
- Concurrent `git config --local` writes fail on config locks (13 of 20 in a measured run). The protocol stores state as plain files, never in git config.
- Shell cwd does not persist between pi tool calls. Entering a worktree takes either per-command cd or pi session placement, which pi-worktrunk provides.
- Available: jq, python3, flock, cksum, sha256sum, dash, busybox. Absent: shellcheck. The protocol uses POSIX sh and coreutils only.
- Installed by the owner on 2026-10-31: `wt` v0.81.0 and `pi-worktrunk` v0.13.0 (visible in `pi list`). The smoke test confirms `wt` answers on PATH.

## Architecture

Division of labor:

- `wt`: create, switch and remove worktrees; merge pipeline (commit, squash, rebase, pre-merge hooks, fast-forward, cleanup); preparation hooks (post-start); per-worktree ports (`hash_port`); caches; `wt list` status.
- `pi-worktrunk`: session placement and recovery, the `worktrunk` agent tool (it calls `wt` from the extension process and bypasses bash permission prompts), `/wt` command, activity markers.
- The `agent-swarm` skill: the coordination protocol as copyable POSIX sh blocks, the merge wrapper, failure modes, takeover, scaling.
- The `agents-md-swarm` prompt: owns the AGENTS.md section and carries the invariants, nothing else.

Coordination state lives under `<git-common-dir>/agents-sync/`, never committed, human readable:

- `state/<branch>/`: claim fields, one `key: value` per `printf`, written by the owner only.
- `messages/`: one file per message, nanosecond names, never edited or deleted.
- `acks/<msg-id>/<branch>`: one empty file per acknowledgment.
- `locks/<name>`: `mkdir` locks, atomic by nature, `rmdir` to release.

Invariants kept from earlier revisions: identity is the branch, no JSON on the critical path, no identifiers invented by the model, nothing committed, invariants in the prompt, recipes in the skill.

## Proposed AGENTS.md block

`````markdown
## Multi-agent coordination

Several agents may work in this clone at once, one branch and one worktree per task, managed with `wt` (worktrunk). Read the `agent-swarm` skill before claiming a branch, editing shared contracts, or merging.

- Identity is the branch. Claim it under `agents-sync/` in the shared git dir before your first edit, release after the merge. Nothing there is ever committed.
- Enter your worktree before editing: pi uses the `worktrunk` tool or `/wt switch --create`; other agents run `wt switch --create`.
- Declare shared contracts and lockfiles, not files: each worktree has its own copy. Before touching another agent's declared contract, post a message and wait for the ack.
- One merge at a time: take the merge lock, `git fetch`, run the merge recipe from the skill, `git push`, release. A rejected push means fetch, rebase, retest, retry.
- Never remove or prune another agent's worktree. A stale claim whose worktree is gone from `git worktree list` follows the takeover recipe: request, wait, take.
- If `wt` or the `worktrunk` tool is missing, say so and stop: the owner installs them. Do not improvise a replacement protocol.
`````

## Deliverables

- `prompts/agents-md-swarm.md`: rewritten section with the block above; the JSON and random-id block is gone.
- `skills/agent-swarm/SKILL.md`: under 400 lines, description 150 to 300 characters, router style.
- `skills/agent-swarm/references/protocol.md`: state formats, messages, locks, takeover, failure modes.
- `skills/agent-swarm/references/scaling.md`: 4 to 8 agents, ports, caches on ext4, review load, rebase cost.
- `skills/agent-swarm/tests/protocol.test.sh`: exercises the blocks in a throwaway repo created under the git common dir, which stays inside the allowed cwd.
- `README.md`: one line for the skill.
- `docs/adr/0001-adopt-worktrunk.md`: adopt versus build, evidence, rejected alternatives, risks, the lifted no-tooling constraint.
- Catalog `AGENTS.md`: the section applied to this repo too.

## Verification

1. `sh -n skills/agent-swarm/tests/protocol.test.sh`, then run it.
2. Frontmatter and description length checks on the new skill.
3. `rg -n 'agent-swarm|worktrunk|wt merge' README.md AGENTS.md prompts/ skills/`
4. Smoke test with 3 agents on a throwaway repo: parallel claims, one message round trip, one `wt merge`, status before and after, cleanup.
5. `git diff` read back, then the repo's own commit convention.
6. After push, refresh the pi package, rerun the prompt on a real repo, confirm the section lands and the tools answer.

## Steps

- [x] Step 0: owner installs `wt` and `pi-worktrunk` (done 2026-10-31: wt v0.81.0, pi-worktrunk v0.13.0).
- [x] Step 1: rewrite `prompts/agents-md-swarm.md` with the new block.
- [x] Step 2: write the skill, its references and the protocol tests.
- [x] Step 3: write the ADR, sync `README.md`, apply the section to the catalog `AGENTS.md`.
- [x] Step 4: run the full verification, including the 3-agent smoke test.
- [ ] Step 5: short-lived branch off main, verify, merge, push, refresh the pi package.
- [ ] Step 6: apply to a real repo and measure for two weeks: merge conflicts, lock waits, orphan states, agent mistakes.

## Risks

- Single maintainer on both tools. Exit: permissive licenses, fork. If pi-worktrunk stops, degrade to worktrunk's official pi plugin (markers only) plus direct `wt` calls; the protocol does not depend on the extension.
- Never install both `wt config plugins pi install` and pi-worktrunk: both write activity markers and would race.
- ext4: caches copy in full. Plan disk for 8 worktrees.
- Skipping the fetch and push around `wt merge` breaks the discipline: the recipe is the only merge path taught.
- `wt merge` removes the source worktree by default. Release the claim after cleanup, not before.
- A skill is only read if the router fires; the section names the skill explicitly.
- Agents may call `wt` through bash and hit permission prompts; the `worktrunk` tool is the preferred path.
- Autonomy raises the stakes of the merge policy; the open decision below must be closed before the smoke test.

## Non-goals

- No orchestrator, launcher, GUI or CI integration.
- No bespoke extension: the A3 plan is withdrawn.
- No helper script in the git dir or on the system: `wt` is the system helper.
- No tool file committed to any repo: repos carry only their AGENTS.md section.

## Open decisions

- Merge policy under autonomy: automatic whenever checks pass, automatic except conflicts, red checks or oversized diff, or never without the owner. Recommendation: the second, the agent pushes its branch and posts a request instead of blocking. The threshold needs a definition: lines changed or contracts touched.
- Lock stealing: recommend none. Stale locks are reported and waited on. Takeover applies to claims, never to held locks.
- Applying the section to the catalog repo itself: recommended, this repo is the first user.

## History

- 2026-10-31, revision 1: helper installed in the shared git dir, reached through a git alias. Withdrawn: install and drift cost, config lock failures.
- Revision 2 (A1 and A2): helper-less dumb protocol, recipes in the skill. Kept: it becomes the coordination layer.
- Revision 3 (A3): bespoke pi extension for autonomy, 400 to 600 lines estimated. Withdrawn: the estimate ignored session placement, and 1.6k maintained lines of it already exist in pi-worktrunk.
- Revision 4 (this one): the owner lifted the no-tooling constraint. Research compared worktrunk against the field. Adopt `wt` plus `pi-worktrunk`, keep the dumb protocol for coordination.

## Outcome

pending