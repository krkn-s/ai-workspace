# KRKN's AI Workspace

A personal AI workspace with installable skills and pi prompt templates.

- **skills**
  - [`image-prompt-crafter`](skills/image-prompt-crafter) : Craft production-grade prompts for conversational image generators (GPT Image 2, Nano Banana 2/Pro, Seedream 5 Pro) — hybrid clarification, model-specific English variants, settings, and iteration plans.
  - [`seo-aeo-content`](skills/seo-aeo-content) : SEO and AEO content strategy for briefs, audits, page structures, and editorial plans.
  - [`ai-visibility-stack`](skills/ai-visibility-stack) : AI visibility infrastructure covering `llms.txt`, markdown mirrors, `sitemap.xml`, `robots.txt`, and AI crawler policy.
  - [`human-prose`](skills/human-prose) : Write and rewrite prose so it reads like a real person, without AI tells, in French or English.
  - [`brand-md`](skills/brand-md) : Create, audit, and maintain a `BRAND.md` as a Markdown source of truth readable by humans and consumable by LLM-based agents.
  - [`brand-site`](skills/brand-site) : Design, build, audit, and improve brand websites — typology vs e-commerce/vitrine/landing, 9-phase creation with design philosophy and tokens, credibility audit (Stanford, NN/g, E-E-A-T), conversion levers, stack choice, French legal frame.
  - [`impeccable-lite`](skills/impeccable-lite) : General frontend design judgment for any interface (sites, dashboards, product UI, components) — visual direction, surface modes (persuade/operate/read/experience), typography/color/layout/motion craft, anti-generic AI patterns, production floor (a11y, responsive, states). Derived from Impeccable (Apache-2.0).
  - [`spec-vibe`](skills/spec-vibe) : CLI-free, Markdown-only spec-driven development over a `specs/` tree — forward (spec first) and reverse (vibe-code first, then generate specs) paths, with ADRs and `rg`/`fd`-queryable structure.
  - [`weasyprint-pdf`](skills/weasyprint-pdf) : Generate print-ready PDF documents (brochures, flyers, cards, business cards, slides, invoices, books) from HTML and CSS using WeasyPrint — `@page` paged media, page breaks, TOC, bookmarks, custom fonts, bleed/CMYK/PDF-X.
  - [`reveal-slides`](skills/reveal-slides) : Build single-file HTML presentation decks with reveal.js (Markdown, code highlight, speaker notes, fragments) and export a clean one-slide-per-page vector PDF via html2realpdf — both pinned to jsDelivr CDN URLs.
  - [`compact`](skills/compact) : Compact, LLM-friendly Markdown styling — single H1, H2/H3 outline, short bullets, sparing bold, language-tagged code fences, simple tables, no decorative HTML or emoji; write new docs or restyle bloated `.md` files for humans and agents.
  - [`browser-tools`](skills/browser-tools) : Interactive browser automation via Chrome DevTools Protocol (Chrome on `:9222`) — navigate, evaluate JS, screenshot, cookies, pick elements; imported from [badlogic/pi-skills](https://github.com/badlogic/pi-skills/tree/main/browser-tools) by Mario Zechner (MIT).
- **prompts**
  - [`ship`](prompts/ship.md) : Explore, plan (through `specs/` when present, else `PLAN-<date>.md` for complex tasks), then execute step-by-step with verification, commit & push, and server update commands.
  - [`agents-md`](prompts/agents-md.md) : One prompt to create, improve, or realign any agent instruction file (AGENTS.md, CLAUDE.md, rules files, skill instructions) — creation grounded in the repo and aligned with the global baseline (`~/.pi/agent/`), one audit pass for conflicts, duplication, stale rules, lean failures, and gaps, every real decision surfaced to the user, output always in compact Markdown (compact skill).
  - [`agents-md-swarm`](prompts/agents-md-swarm.md) : Ensure a project's shared `AGENTS.md` contains the multi-agent coordination section (worktree-first, `.agents-sync/` with `state.json` + `messages.jsonl`, session protocol, merge rules) — append when missing, no-op when identical, expose divergences and ask which version to keep when it differs.
  - [`challenge`](prompts/challenge.md) : Adopt a critical intellectual partner that stress-tests your claims for truth over agreement.

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
        "prompts/challenge.md"
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
npx skills add https://github.com/krkn-s/ai-workspace --skill human-prose
npx skills add https://github.com/krkn-s/ai-workspace --skill brand-md
npx skills add https://github.com/krkn-s/ai-workspace --skill spec-vibe
npx skills add https://github.com/krkn-s/ai-workspace --skill image-prompt-crafter
```

## License

This repository uses the MIT License. It is intentionally permissive so these skills can be reused, adapted, forked, and installed in personal, commercial, or open source workflows.
