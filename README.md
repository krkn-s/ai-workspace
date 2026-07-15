# KRKN's AI Workspace

A personal AI workspace with installable skills and pi prompt templates.

- **skills**
  - [`seo-aeo-content`](skills/seo-aeo-content) : SEO and AEO content strategy for briefs, audits, page structures, and editorial plans.
  - [`ai-visibility-stack`](skills/ai-visibility-stack) : AI visibility infrastructure covering `llms.txt`, markdown mirrors, `sitemap.xml`, `robots.txt`, and AI crawler policy.
  - [`optimize-agent-instructions`](skills/optimize-agent-instructions) : Audit and rewrite agent instruction files for leanness, including AGENTS.md, CLAUDE.md, system prompts, and skills.
  - [`human-prose`](skills/human-prose) : Write and rewrite prose so it reads like a real person, without AI tells, in French or English.
- **prompts**
  - [`plan`](prompts/plan.md) : Explore the code, then write a structured implementation plan to PLAN.md.
  - [`init-agentmd`](prompts/init-agentmd.md) : Create or improve the project's AGENTS.md using lean-instruction principles.
  - [`starburst`](prompts/starburst.md) : Run a Starbursting brainstorm. Generate 5W1H clarifying questions, then pause for answers.
  - [`redteam`](prompts/redteam.md) : Adopt a critical intellectual partner that stress-tests your claims for truth over agreement.
  - [`sample`](prompts/sample.md) : Reference template documenting every pi prompt-template feature.

## Skills installation

```bash
npx skills add https://github.com/krkn-s/ai-workspace --skill seo-aeo-content
npx skills add https://github.com/krkn-s/ai-workspace --skill ai-visibility-stack
npx skills add https://github.com/krkn-s/ai-workspace --skill optimize-agent-instructions
npx skills add https://github.com/krkn-s/ai-workspace --skill human-prose
```

## License

This repository uses the MIT License. It is intentionally permissive so these skills can be reused, adapted, forked, and installed in personal, commercial, or open source workflows.
