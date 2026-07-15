---
name: optimize-agent-instructions
description: Lean audit and rewrite workflow for agent instruction files such as AGENTS.md, CLAUDE.md, system prompts, rules files, and skill instructions. Use when the agent needs to clean up, shorten, or refactor an instruction file, remove redundant or contradictory rules, reduce unnecessary planning, questions, or validation steps, fix a CLAUDE.md or AGENTS.md that feels too long or too strict, review a skill's instructions for leanness, or consolidate overlapping project rules into a minimal high-signal replacement. Déclenche aussi sur les requêtes en français, par exemple alléger, raccourcir, nettoyer ou réécrire un fichier d'instructions (AGENTS.md, CLAUDE.md, prompt système, fichier de règles, skill), supprimer les règles redondantes ou contradictoires, simplifier un CLAUDE.md ou AGENTS.md trop long ou trop strict, ou consolider des règles projet qui se chevauchent en un fichier minimal.
---

# Optimize Agent Instructions

## Mission

Improve a provided agent instruction file such as AGENTS.md, CLAUDE.md, system prompt, rules file, or skill instructions.

Optimize for:
- Correctness and safety proportionate to actual risk
- Fast, direct execution for simple tasks
- Minimal, non-redundant instructions
- Clear decision thresholds
- Compatibility across coding models and agent harnesses

Do not optimize for maximum caution. Do not add rules merely because they sound like good engineering practice.

## Core principle

Every instruction has a cost. Keep a rule only when it:
- Prevents a recurring or costly failure
- Provides information the agent cannot reliably infer from the repository
- Is universal for the file's scope
- Does not conflict with another rule
- Can be stated clearly and acted on consistently

Remove or merge everything else.

## The yardstick: how a lean instruction file should make the agent behave

This is your reference for what "good" looks like. A well-tuned instruction file pushes the agent toward:

For simple, local, and reversible tasks:
- Direct action, not a plan, assumption list, or confirmation loop.
- The cheapest relevant check.

For non-trivial tasks:
- Inspecting only relevant files, conventions, configuration, and tests.
- The smallest solution that fulfills the request.
- Validation proportional to blast radius and risk.

And asking one concise question only when a missing answer materially risks an incorrect, incompatible, destructive, costly, or insecure outcome — otherwise making the most reasonable low-risk assumption and mentioning it only if it matters.

When you audit a file, the file is the thing being judged and this behavior is the ruler. Flag any instruction that pushes the agent the other way: mandatory planning steps, redundant confirmations, or validation heavier than the actual risk warrants.

## Review process

1. Identify the file's scope:
   - Global, project, directory, task-specific, or system-level
   - Determine which instructions belong elsewhere

2. Extract the intended outcomes:
   - Speed, safety, code quality, tool choice, style, communication, or workflow

3. Audit every rule:
   - Is it actionable?
   - Is it specific enough to guide behavior?
   - Is it redundant with another rule?
   - Is it absolute where it should be conditional?
   - Does it require unnecessary planning, questions, tool calls, or validation?
   - Does it conflict with project conventions or other instructions?
   - Would its absence plausibly cause a meaningful failure?

4. Classify each rule:
   - Keep
   - Rewrite
   - Merge
   - Move to local documentation
   - Remove

5. Produce a lean replacement that preserves only high-value constraints.

## Rules to reject by default

Remove or challenge instructions that:
- Require asking permission before ordinary requested code changes
- Require a plan, explanation of assumptions, or status report for every task
- Require Git inspection before every small local change
- Require tests, full builds, or broad checks for every change
- Forbid standard tools absolutely when the project may rely on them
- Impose global naming or style rules that local project conventions should decide
- Invite unrelated cleanup, refactoring, formatting, or "making the codebase better"
- Duplicate instructions already handled by linters, formatters, tests, CI, or the agent harness
- Use vague language such as "be smart", "ensure quality", or "think carefully"
- Add abstractions, dependencies, configurability, or edge-case handling without a demonstrated need

## Required output

Reply in this exact structure.

### Verdict

State whether the file should be kept, shortened, split, or replaced.

### Critical issues

List only issues that materially affect speed, reliability, or instruction conflicts.

For each issue, include:
- Existing rule or concept
- Why it is harmful, redundant, vague, or misplaced
- Recommended action

### Proposed file

Provide a complete replacement in one Markdown code block.

### Optional local rules

List only rules that should live in project-level or directory-level instructions instead.

### Rationale

Use at most five bullets. Explain the main tradeoffs and any deliberate omissions.

Do not include a long theoretical explanation. Do not preserve wording merely because it appears authoritative. Do not invent project facts, commands, tools, conventions, or risks.
