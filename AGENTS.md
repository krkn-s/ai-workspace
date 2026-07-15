# AGENTS.md

This repository is a **catalog of installable agent skills and pi prompt templates**, not a software project. There is no build, test, or lint step — everything is Markdown.

## Layout

- `skills/<name>/SKILL.md` — one skill per folder; `references/` holds deeper docs.
- `prompts/<name>.md` — pi prompt templates; the filename (without `.md`) becomes the `/name` command.
- `README.md` — two-level catalog list (`skills`, `prompts`). Keep it in sync when adding or removing items.

## Skill conventions

- Frontmatter: `name` and `description` only. `description` is the **primary trigger** — write it bilingual (English core plus a French clause), concrete and pushy (real trigger contexts, file types, phrasings).
- Keep `SKILL.md` under ~500 lines; push detail into `references/`.
- Do **not** add `agents/openai.yaml` or `test-prompts.json` — they were intentionally removed (nothing here consumes them).

## Prompt conventions

- Follow the pi prompt-template format; `prompts/sample.md` is the source of truth (frontmatter fields, argument syntax, loading rules).
- One prompt per file, directly in `prompts/` (discovery is non-recursive).
- Write bodies in English.

## YAML pitfall

Avoid `: ` (colon + space) inside unquoted frontmatter values — it breaks parsing. Re-check the frontmatter after editing any `SKILL.md` or prompt.

## Tooling

- Manage skills with the `skills` CLI (`npx skills add <repo> --skill <name>`). There is no `package.json`.
- GitHub operations via `gh`.

## Git

- Atomic commits with imperative messages (e.g., `Add init-agentmd prompt template`).
- Do not commit `.zip` artifacts, `.DS_Store`, or unrelated changes.
- `.agents/` is gitignored — local dev tooling, not part of the catalog.
