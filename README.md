# skills

Personal collection of installable skills for Codex and other agents that support the `SKILL.md` format.

## Available Skills

- [`seo-aeo-content`](skills/seo-aeo-content) : SEO/AEO content strategy — briefs, audits, page structures, editorial plans.
- [`ai-visibility-stack`](skills/ai-visibility-stack) : AI visibility infrastructure — `llms.txt`, markdown mirrors, `sitemap.xml`, `robots.txt`, AI crawler policy.
- [`optimize-agent-instructions`](skills/optimize-agent-instructions) : Audit & rewrite agent instruction files (AGENTS.md, CLAUDE.md, system prompts, skills) for leanness.

> `skill-creator` (in `.agents/skills/`) is the dev meta-skill for building and benchmarking skills; it is not part of the installable catalog.

## Installation

### With `skills`

Install from the repo root by skill name:

```bash
npx skills add https://github.com/krkn-s/skills --skill seo-aeo-content -a codex -g
npx skills add https://github.com/krkn-s/skills --skill ai-visibility-stack -a codex -g
npx skills add https://github.com/krkn-s/skills --skill optimize-agent-instructions -a codex -g
```

Install from a direct skill folder:

```bash
npx skills add https://github.com/krkn-s/skills/tree/main/skills/seo-aeo-content -a codex -g
npx skills add https://github.com/krkn-s/skills/tree/main/skills/ai-visibility-stack -a codex -g
npx skills add https://github.com/krkn-s/skills/tree/main/skills/optimize-agent-instructions -a codex -g
```

## Usage Examples

```text
Use $seo-aeo-content to audit this article for SEO, AEO, intent match, and citation-worthiness.
```

```text
Use $ai-visibility-stack to create or preserve the AI-readable and crawler-readable infrastructure for this website.
```

```text
Use $optimize-agent-instructions to audit my CLAUDE.md and return a lean replacement that removes redundant rules and over-cautious steps.
```

## License

This repository uses the MIT License. It is intentionally permissive so these skills can be reused, adapted, forked, and installed in personal, commercial, or open source workflows.
