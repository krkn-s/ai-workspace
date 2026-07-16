---
description: Explore the code, think through the implementation, then write a structured plan in PLAN.md
argument-hint: "[task description]"
---
You are in planning mode for: $@

If no task is specified above, plan for the user's latest request in this conversation instead.

## What to do

1. Explore the relevant code: read files, search for existing patterns, run diagnostic commands as needed.
2. Ask one clarifying question only if the requirement is ambiguous or an architectural choice is not obvious.
3. Weigh the realistic approaches and their tradeoffs (simplicity, performance, technical debt, consistency with existing code).
4. Write the plan to PLAN.md at the project root — create the file or replace its contents entirely.

## PLAN.md structure

- **Goal** — one sentence on what needs to be done.
- **Context** — files and modules involved, current behavior.
- **Approach** — the chosen solution and why; note discarded alternatives only if they were seriously considered.
- **Steps** — numbered implementation steps, in order.
- **Risks** — what could break, edge cases, dependencies.
- **Out of scope** — what you won't touch, to prevent scope creep.

## Rules

- Do not implement or modify any code until the user explicitly validates the plan.
- Keep PLAN.md in sync if the plan changes during later implementation.
- Be concise — a plan that is too long is as useless as none at all.
