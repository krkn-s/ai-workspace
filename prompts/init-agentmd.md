---
description: Create or improve the project's AGENTS.md using lean-instruction principles
---
Create or refine the project's `AGENTS.md` so it gives an agent exactly the context it cannot infer from the repo — and nothing more.

## Step 1 — Check

- No `AGENTS.md` at the project root → go to **Create**.
- It exists → read it fully and go to **Improve**.

In both cases, first inspect the repo to ground every rule in reality: languages/frameworks, lockfiles and package manager, scripts, linters/formatters, test and CI setup, and the conventions the code actually follows. Never invent commands, paths, or conventions.

## Principles — the bar for every line

Every instruction has a cost. Keep a rule only when it prevents a recurring or costly failure, gives info the agent cannot infer from the repo, is universal for the file's scope, does not conflict with another rule, and can be stated clearly. Merge or remove everything else.

Optimize for correctness and safety **proportional to actual risk**, fast direct execution, and minimal instructions — not for maximum caution. Reject by default any rule that:
- asks permission before ordinary requested changes, or requires a plan, status report, or assumption list for every task;
- requires git inspection, tests, or full builds on every change;
- forbids standard tools the project may rely on;
- imposes global naming/style that local conventions should decide;
- invites unrelated cleanup or refactoring;
- duplicates what linters, formatters, tests, CI, or the harness already enforce;
- uses vague language ("be smart", "ensure quality"), or adds abstractions/configurability without a demonstrated need.

The file should make the agent act directly on simple, local, reversible tasks with the cheapest relevant check; inspect only relevant files and prefer the smallest solution on non-trivial tasks; and ask one concise question only when a missing answer materially risks an incorrect, incompatible, destructive, costly, or insecure outcome.

## Create (AGENTS.md missing)

Write a lean `AGENTS.md` with only high-value sections — for example:
- **Stack & tooling** — frameworks, package manager, and the exact build/run/test/lint commands that aren't obvious from lockfiles and scripts.
- **Conventions** — patterns the codebase follows that a stranger would get wrong (structure, naming, error handling, commit style).
- **Boundaries** — irreversible or risky operations that need confirmation (deploys, migrations, force-pushes, secrets), scoped to real risk.

Drop any section that would say nothing. Prefer concrete ("use `bun test`") over blanket ("always run the full suite before committing").

## Improve (AGENTS.md exists)

Audit each existing rule and classify it: **keep / rewrite / merge / move to local docs / remove**. Then propose — do not silently apply:
- A short issue list: for each, the rule, why it is redundant, vague, contradictory, or heavier than the risk warrants, and the recommended action.
- One complete, lean replacement `AGENTS.md` in a code block.

Apply the replacement only after the user confirms.

## Rules for this task

- Ground everything in the actual repo; cite real commands and paths.
- Prefer the smallest file that covers the genuine gaps.
- If it grows long, keep project-wide rules here and move directory- or task-specific rules closer to where they apply.
