# ai-workspace

Personal catalog of installable pi extensions, skills, and prompt templates. 

`README.md` lists every extension, skill, and prompt: keep it in sync when adding or removing one.

## Extensions

- Each extension documents itself in its own `README.md`; the root `README.md` lists one-liners only.

## Skills

- `description` in the frontmatter is a router, not a summary: English, 150 to 300 characters, naming the situations and artifacts that should load the skill. 
- Keep `SKILL.md` under 400 lines; push depth into `references/` subfolder.
- Third-party skills: copy verbatim, add a note at the top of the body crediting repo, author, and license, and keep the license file in the skill folder (`skills/browser-tools`).

## Prompts

- One prompt per file, directly in `prompts/`: discovery is non-recursive. English body and frontmatter.

## Frontmatter

- Avoid `: ` in an unquoted value: it breaks parsing. Re-check the frontmatter after editing a `SKILL.md` or a prompt.
