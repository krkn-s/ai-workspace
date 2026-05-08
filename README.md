# skills

Personal collection of installable skills for Codex and other agents that support the `SKILL.md` format.

The repository is organized as a multi-skill catalog:

```text
skills/
  seo-aeo-content/
    SKILL.md
    agents/openai.yaml
    references/
  ai-visibility-stack/
    SKILL.md
    agents/openai.yaml
    references/
    test-prompts.json
```

## Available Skills

### `seo-aeo-content`

SEO and AEO content strategy workflow for creating and improving search-ready and answer-engine-ready content.

Use cases:

- SEO/AEO briefs;
- page or article audits;
- landing page structures;
- editorial plans;
- article optimization;
- publication checklists;
- AEO strategy, citations, and brand mentions.

Example:

```text
Use $seo-aeo-content to create a SEO/AEO content brief for "answer engine optimization for B2B SaaS".
```

### `ai-visibility-stack`

AI visibility workflow for business websites that need machine-readable and crawler-readable infrastructure such as `llms.txt`, markdown mirrors, `sitemap.xml`, `robots.txt`, and AI crawler policy guidance.

Use cases:

- create or fix `llms.txt`;
- plan or review markdown mirrors;
- audit `sitemap.xml` and `robots.txt`;
- preserve invisible SEO and AI visibility infrastructure during redesigns;
- define search-engine vs AI-crawler exposure policy.

Example:

```text
Use $ai-visibility-stack to audit this website's llms.txt, markdown mirrors, sitemap.xml, robots.txt, and AI crawler policy.
```

## Choose The Right Skill

Use `seo-aeo-content` when the task is primarily about content strategy, content structure, editorial planning, or improving a page/article so it can perform in search engines and answer engines.

Use `ai-visibility-stack` when the task is about website discoverability infrastructure: `llms.txt`, clean machine-readable pages, crawl files, AI crawler access, or preserving those layers during a rebuild.

## Installation

### With `skills`

Install from the repo root by skill name:

```bash
npx skills add https://github.com/krkn-s/skills --skill seo-aeo-content -a codex -g
npx skills add https://github.com/krkn-s/skills --skill ai-visibility-stack -a codex -g
```

Install from a direct skill folder:

```bash
npx skills add https://github.com/krkn-s/skills/tree/main/skills/seo-aeo-content -a codex -g
npx skills add https://github.com/krkn-s/skills/tree/main/skills/ai-visibility-stack -a codex -g
```

### With Codex

In Codex, ask:

```text
Use $skill-installer to install https://github.com/krkn-s/skills/tree/main/skills/seo-aeo-content
```

```text
Use $skill-installer to install https://github.com/krkn-s/skills/tree/main/skills/ai-visibility-stack
```

## Usage Examples

```text
Use $seo-aeo-content to audit this article for SEO, AEO, intent match, and citation-worthiness.
```

```text
Use $ai-visibility-stack to create or preserve the AI-readable and crawler-readable infrastructure for this website.
```

## License

This repository uses the MIT License. It is intentionally permissive so these skills can be reused, adapted, forked, and installed in personal, commercial, or open source workflows.
