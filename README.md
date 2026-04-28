# skills

Personal collection of skills for Codex and other agents that support the `SKILL.md` format.

The repository is organized to host multiple skills:

```text
skills/
  seo-aeo-content/
    SKILL.md
    agents/openai.yaml
    references/
```

## Available Skills

### `seo-aeo-content`

SEO/AEO workflow for creating and improving content that can perform in search engines and answer engines.

Use cases:

- SEO/AEO briefs;
- page or article audits;
- landing page structures;
- editorial plans;
- article optimization;
- publication checklists;
- AEO strategy, citations, and brand mentions.

## Installation

### With `skills`

Global installation for Codex:

```bash
npx skills add https://github.com/<owner>/skills --skill seo-aeo-content -a codex -g
```

Installation from the direct skill folder:

```bash
npx skills add https://github.com/<owner>/skills/tree/main/skills/seo-aeo-content -a codex -g
```

Replace `<owner>` with the GitHub account or organization that hosts this repository.

### With Codex

In Codex, ask:

```text
Use $skill-installer to install https://github.com/<owner>/skills/tree/main/skills/seo-aeo-content
```

## Usage Examples

```text
Use $seo-aeo-content to create a SEO/AEO content brief for "answer engine optimization for B2B SaaS".
```

```text
Use $seo-aeo-content to audit this article for SEO, AEO, intent match, and citation-worthiness.
```

## Publishing to GitHub with `gh`

This repository is intended to be published as `skills`.

Before public publication, do not push the raw local transcripts in `Sources/`. They are ignored by Git in the public version, but if they exist in local history, publish from a clean export.

### Recommended Option: Create a Clean Public Repository from an Export

From this folder:

```bash
mkdir -p /tmp/skills-public
rsync -av --exclude='.git' --exclude='.DS_Store' --exclude='Sources' ./ /tmp/skills-public/
cd /tmp/skills-public
git init
git add .
git commit -m "Initial public skills repository"
gh repo create skills --public --source=. --remote=origin
git push -u origin main
```

This avoids publishing local history that contains raw source transcripts.

### If the GitHub Repository Already Exists

```bash
cd /tmp/skills-public
git remote add origin git@github.com:<owner>/skills.git
git push -u origin main
```

## Submitting to skills.sh / agentskill.sh

Once the GitHub repository is public:

1. Open the submission page on `skills.sh` or `agentskill.sh`.
2. Paste the repository or skill URL:

   ```text
   https://github.com/<owner>/skills/tree/main/skills/seo-aeo-content
   ```

3. Connect GitHub to verify repository ownership if requested.
4. Add the GitHub webhook if the platform offers one to sync updates faster.

## License

This repository uses the MIT License.

Why MIT:

- simple and widely understood;
- compatible with personal, commercial, and open source use;
- easy to reuse, fork, modify, and redistribute;
- well suited to a collection of skills that other people can install and adapt.

MIT is intentionally permissive. If a future skill includes more sensitive code, complex dependencies, or patent-related concerns, Apache-2.0 can be reconsidered for that skill or for a dedicated repository.
