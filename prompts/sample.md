---
description: Reference template documenting every pi prompt-template feature (copy patterns from here to author new prompts)
argument-hint: "[topic]"
---
> Source of truth for authoring prompts in this repo. Every feature below is grounded in pi's prompt-template spec.
> Note: `$1`, `$@`, `${1:-default}` are shown **literally** here for reference; they only expand when a template is invoked via `/name`.

## Minimal template

```markdown
---
description: Review staged git changes
---
Review the staged changes (`git diff --cached`). Focus on:
- Bugs and logic errors
- Security issues
- Error handling gaps
```

## Frontmatter

| Field | Required | Notes |
|-------|----------|-------|
| `description` | No | Shown in the `/` autocomplete menu. If omitted, the first non-empty line of the body is used. |
| `argument-hint` | No | Shown before the description in autocomplete. Use `<angle brackets>` for required args and `[square brackets]` for optional ones. |

```yaml
---
description: Review PRs from URLs with structured issue and code analysis
argument-hint: "<PR-URL>"
---
```

## Command name

The filename without `.md` becomes the command. `review.md` → `/review`, `plan.md` → `/plan`. Keep names short, lowercase, kebab-case.

## Invocation

```
/review                           # no args
/component Button                 # one arg
/component Button "click handler" # multiple args (quote args that contain spaces)
```

## Arguments

| Syntax | Meaning |
|--------|---------|
| `$1`, `$2`, … | Positional arguments (1-indexed) |
| `$@` or `$ARGUMENTS` | All arguments, joined |
| `${1:-default}` | Arg 1 if present and non-empty, otherwise `default` |
| `${@:N}` | Arguments from position N onward (1-indexed) |
| `${@:N:L}` | `L` arguments starting at position N |

Examples:

```markdown
---
description: Create a component
---
Create a React component named $1 with features: $@
```

```markdown
Summarize the current state in ${1:-7} bullet points.
```

## Where pi loads templates from

- **Global**: `~/.pi/agent/prompts/*.md`
- **Project**: `.pi/prompts/*.md` (only after the project is trusted)
- **Packages**: `prompts/` directories, or `pi.prompts` entries in `package.json`
- **Settings**: `prompts` array (files or directories)
- **CLI**: `--prompt-template <path>` (repeatable)

Disable discovery entirely with `--no-prompt-templates`.

## Loading rules

- Discovery in `prompts/` is **non-recursive**: place `.md` files directly here, not in subfolders.
- To use subdirectories, declare them explicitly via the `prompts` setting or a package manifest.

## Conventions for this repo

These are our own choices (not part of the pi spec):

- One prompt per `.md` file, placed directly in `prompts/`.
- Always set `description`; add `argument-hint` when the prompt takes arguments.
- Give every positional arg a default (`${N:-...}`) unless it is genuinely required.
- Write the body in English for portability across models.
- One template = one focused workflow; split compound prompts into separate files.
