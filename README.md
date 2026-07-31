# KRKN's AI Workspace

A personal AI workspace with installable skills and pi prompt templates.

- **skills**
  - [`seo-aeo-content`](skills/seo-aeo-content) : SEO and AEO content strategy for briefs, audits, page structures, and editorial plans.
  - [`ai-visibility-stack`](skills/ai-visibility-stack) : AI visibility infrastructure covering `llms.txt`, markdown mirrors, `sitemap.xml`, `robots.txt`, and AI crawler policy.
  - [`optimize-agent-instructions`](skills/optimize-agent-instructions) : Audit and rewrite agent instruction files for leanness, including AGENTS.md, CLAUDE.md, system prompts, and skills.
  - [`human-prose`](skills/human-prose) : Write and rewrite prose so it reads like a real person, without AI tells, in French or English.
  - [`brand-md`](skills/brand-md) : Create, audit, and maintain a `BRAND.md` as a Markdown source of truth readable by humans and consumable by LLM-based agents.
  - [`spec-vibe`](skills/spec-vibe) : CLI-free, Markdown-only spec-driven development over a `specs/` tree — forward (spec first) and reverse (vibe-code first, then generate specs) paths, with ADRs and `rg`/`fd`-queryable structure.
  - [`weasyprint-pdf`](skills/weasyprint-pdf) : Generate print-ready PDF documents (brochures, flyers, cards, business cards, slides, invoices, books) from HTML and CSS using WeasyPrint — `@page` paged media, page breaks, TOC, bookmarks, custom fonts, bleed/CMYK/PDF-X.
  - [`reveal-slides`](skills/reveal-slides) : Build single-file HTML presentation decks with reveal.js (Markdown, code highlight, speaker notes, fragments) and export a clean one-slide-per-page vector PDF via html2realpdf — both pinned to jsDelivr CDN URLs.
  - [`alpha-analyst`](skills/alpha-analyst) : Manual-only (`/skill:alpha-analyst`) venture-builder copilot — trend radar, gap detection, TAM/SAM/SOM sizing, investment memo, MVP "Black Car", CAB pre-sale (10 LOIs), GTM kit, Pizza Squad, 0→1M ARR roadmap. Source-backed, French output.
- **prompts**
  - [`plan`](prompts/plan.md) : Explore the code, then write a structured implementation plan to PLAN.md.
  - [`ship`](prompts/ship.md) : Make a plan, then execute it step-by-step with verification, commit & push, and server update commands.
  - [`agents-md`](prompts/agents-md.md) : Create or improve the project's AGENTS.md using lean-instruction principles.
  - [`starburst`](prompts/starburst.md) : Run a Starbursting brainstorm. Generate 5W1H clarifying questions, then pause for answers.
  - [`redteam`](prompts/redteam.md) : Adopt a critical intellectual partner that stress-tests your claims for truth over agreement.
  - [`brand`](prompts/brand.md) : Create or refine the project's `BRAND.md` as a lean, project-relevant source of truth (entry point for the `brand-md` skill).
  - [`brand-audit`](prompts/brand-audit.md) : Audit an existing `BRAND.md` or scattered brand material for drift, gaps, and inconsistencies.
  - [`brand-rebrand`](prompts/brand-rebrand.md) : Plan and apply a rebrand or brand pivot as a versioned migration of `BRAND.md`.
  - [`spec`](prompts/spec.md) : Propose and scaffold a spec-driven change (forward path) under `specs/`.
  - [`spec-audit`](prompts/spec-audit.md) : Audit `specs/` for drift — code without a spec, spec without code, contradicting ADRs.
  - [`spec-verify`](prompts/spec-verify.md) : Verify spec↔code alignment for a change before archiving it.
  - [`spec-archive`](prompts/spec-archive.md) : Archive a change — merge its deltas into `current/` and move it to `3-archive/`.
  - [`sample`](prompts/sample.md) : Reference template documenting every pi prompt-template feature.

## Installation

This repo doubles as a **pi package**: it exposes `skills/` and `prompts/` at the root, so a single source can install both skills and prompt templates together. The `skills` CLI only handles skills, not prompts.

### Via `pi install` (skills + prompts together)

Install everything from this repo into your global config:

```bash
pi install https://github.com/krkn-s/ai-workspace
```

Or install into the current project instead (`-l` writes to `.pi/settings.json`):

```bash
pi install -l https://github.com/krkn-s/ai-workspace
```

### Install only a subset (filtering)

To pull just selected skills and prompts, declare the package with the object form in `.pi/settings.json`. Skill paths point at the skill directory; prompt paths point at the file:

```json
{
  "packages": [
    {
      "source": "https://github.com/krkn-s/ai-workspace",
      "skills": ["skills/brand-md"],
      "prompts": [
        "prompts/brand.md",
        "prompts/brand-audit.md",
        "prompts/brand-rebrand.md"
      ]
    }
  ]
}
```

- Omit a key to load **all** of that type; use `[]` to load **none**.
- `!pattern` excludes, `+path` force-includes, `-path` force-excludes (exact paths relative to the repo root).
- Toggle individual resources interactively with `pi config -l` (Tab switches between global and project scope).

### Via `npx skills add` (skills only)

Installs individual skills but does **not** install prompts. If you use this path, copy the prompt files you need into `~/.pi/agent/prompts/` (global) or `.pi/prompts/` (project) by hand.

```bash
npx skills add https://github.com/krkn-s/ai-workspace --skill seo-aeo-content
npx skills add https://github.com/krkn-s/ai-workspace --skill ai-visibility-stack
npx skills add https://github.com/krkn-s/ai-workspace --skill optimize-agent-instructions
npx skills add https://github.com/krkn-s/ai-workspace --skill human-prose
npx skills add https://github.com/krkn-s/ai-workspace --skill brand-md
npx skills add https://github.com/krkn-s/ai-workspace --skill spec-vibe
```

## License

This repository uses the MIT License. It is intentionally permissive so these skills can be reused, adapted, forked, and installed in personal, commercial, or open source workflows.
