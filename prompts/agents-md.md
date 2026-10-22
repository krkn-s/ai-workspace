---
description: "Audit, realign, or create the project's agent instruction file (AGENTS.md by default, any named file otherwise) so it stays the smallest set of rules that makes an agent effective in this repo: delete dead and duplicated rules, move only-sometimes material into its own file, keep sections owned by other prompts byte-identical, rewrite only after confirmation."
argument-hint: "[instruction, focus, or file]"
---
Read the target file whole (`AGENTS.override.md` when present), then the repo: lockfiles, scripts, linters, CI, and the conventions the code actually follows. Never invent a command, path, or fact. If `git status --porcelain` shows the target modified, say so: another agent may share this tree.

Test every line: **does removing it make the agent make a real, recurring mistake?** If not, delete it. This file loads in every session of every task, so each kept line costs attention on unrelated work.

Request:
<user_input>

$@

</user_input>

## Audit

- **Dead**: stale command or path, restates `~/.pi/agent/AGENTS.md`, already enforced by a linter or CI, or describes what the agent can read itself. Delete.
- **Lean failure**: asks permission for ordinary work, invites unrelated cleanup, vague ("be careful", "ensure quality"). Merge or delete.
- **Only-sometimes**: valid for a subset of tasks. Move to its own file, keep one pointer line saying when to read it.
- **Gap**: a mistake the file does not prevent and the agent cannot infer. Add one line.
- **Conflict**: two rules that cannot both be obeyed, or a divergence from the global baseline. Ask which wins.
- **Protected**: a section owned by another prompt (`## Brand`, the multi-agent coordination block). Byte-identical, listed as present, never touched or reformatted.

Record only what the repo cannot show. No stack identification, no directory listing, no naming or style rules a formatter enforces. Keep the reason behind a rule when the reason is the point: a pinned version, a banned pattern, a destructive command.

## Missing file

Ask one batch: what the project does and for whom, the stack, package manager, the real build/run/test/lint commands, conventions, and operations needing confirmation. Skip what the request already answers.

Draft in this order, dropping empty sections: purpose and audience, constraints the code cannot show, exact commands that are not obvious, conventions, risky operations needing confirmation.

## Reply

1. **Findings**: one bullet per faulty rule, quoted, with its verdict. Never one per existing rule.
2. **Decisions**: one question per real judgment call, options with the tradeoff in one line. Skip when obvious.
3. **Proposed file**: complete, one fenced block, compact Markdown (one H1, H2/H3, bullets, no tables).
4. **Rationale**: three bullets max.

Apply only after confirmation, then show `git diff --stat`. Never commit.
