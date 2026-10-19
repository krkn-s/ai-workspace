# KRKN's AI Workspace

Personal AI workspace: pi extensions, skills, and prompt templates. Doubles as a pi package.

## Extensions

- [`nvidia-live`](extensions/nvidia-live): Live NVIDIA NIM catalog for pi. Free-tier `/v1/models` model list with enriched per-model metadata; commands `/nvidia-refresh` and `/nvidia-models`.
- [`skills-guard`](extensions/skills-guard): Gate enforcing `prose` and `compact` mechanical rules (em dashes, tables, deep heading or list nesting) on every `write`/`edit`/`bash` call, retry-until-clean.

## Skills

- [`ai-visibility-stack`](skills/ai-visibility-stack): `llms.txt`, markdown mirrors, `sitemap.xml`, `robots.txt`, and AI crawler access.
- [`browser-tools`](skills/browser-tools): Browser automation via Chrome DevTools Protocol (Chrome on `:9222`). Imported from [badlogic/pi-skills](https://github.com/badlogic/pi-skills/tree/main/browser-tools) (MIT).
- [`compact`](skills/compact): Compact, LLM-friendly Markdown style for any `.md` file.
- [`image-prompt-crafter`](skills/image-prompt-crafter): Production-grade prompts for GPT Image 2, Nano Banana 2/Pro, and Seedream 5 Pro.
- [`prose`](skills/prose): Human-sounding, AI-tell-free prose in French or English.
- [`reveal-slides`](skills/reveal-slides): Self-contained reveal.js 6 decks in one HTML file, exported to vector PDF via html2realpdf.
- [`seo-aeo-content`](skills/seo-aeo-content): SEO and AEO content strategy: briefs, outlines, audits, editorial plans.
- [`spec-vibe`](skills/spec-vibe): Markdown-only spec-driven development over a `specs/` tree.
- [`web-design`](skills/web-design): Web design fundamentals: visual hierarchy, color, typography, conversion practices, audience fit.
- [`weasyprint-pdf`](skills/weasyprint-pdf): Print-ready PDFs from HTML and CSS via WeasyPrint (`@page`, TOC, bookmarks, CMYK/PDF-X).

## Prompts

- [`agents-md`](prompts/agents-md.md): Create, improve, or realign any agent instruction file against the global baseline.
- [`agents-md-brand`](prompts/agents-md-brand.md): Create, convert, or maintain a `## Brand` section inside AGENTS.md.
- [`agents-md-swarm`](prompts/agents-md-swarm.md): Ensure AGENTS.md contains the multi-agent coordination section (idempotent).
- [`challenge`](prompts/challenge.md): Critical intellectual partner stress-testing claims for truth over agreement.
- [`ship`](prompts/ship.md): Plan, execute with verification, commit & push, and server update commands.

## Installation

```bash
pi install https://github.com/krkn-s/ai-workspace       # global
pi install -l https://github.com/krkn-s/ai-workspace    # project
pi config -l                                            # toggle resources
```

## License

MIT.