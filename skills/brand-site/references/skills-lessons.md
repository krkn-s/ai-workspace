# Lessons from other agents' skills

What public agent skills (Anthropic, Vercel Labs) teach about brand-site design, and the coverage check this skill itself passed. Sources at the end.

## Anthropic skills

- brand-guidelines — brand reduced to deterministic tokens: named hex colors with roles (Dark `#141413`, Light `#faf9f5`, orange/blue/green accents), typography by role (Poppins headings, Lora body) with fallbacks (Arial/Georgia). Lesson: a chart useful to agents is a deterministic, ranked set of application rules ("headings ≥ 24pt → Poppins"), not an intentions PDF. Produce tokens before the first mockup.
- canvas-design — produce a design philosophy (a named aesthetic movement manifesto, 4-6 paragraphs on form, space, color, scale, composition) before creating anything; then express it visually. Heavy emphasis on execution level ("must look like it took countless hours") and text restraint. Lesson: separating concept from execution prevents design-by-component-accumulation; naming the stance ("Brutalist Joy", "Chromatic Silence") creates a shared reference.
- theme-factory — 10 curated themes (named palette + type pairing), shown as a showcase, chosen by the user before application. Lesson: type pairing is one indivisible decision with the palette; visual selection (show, choose, confirm, apply) is a good client validation ritual.
- frontend-design — the richest for this subject: "approach the task as the design lead of a studio known for giving each client an identity no one mistakes for another's". Contains the anti-calibration list, the two-pass process (plan → review plan against the brief → build → critique via screenshots), "structure encodes information" (numbered markers only for real sequences), and UX writing rules (user's point of view, active voice, one action name across a flow, errors explaining the fix).
- web-artifacts-builder — component stack (React + Tailwind + shadcn/ui) and a complementary anti-"AI slop" list: excessive centered layouts, purple gradients, uniform rounded corners, default Inter font.
- webapp-testing — test sites with Playwright scripts: navigate, wait for stable network state, capture screenshots, read console logs. Concrete tooling for the tests phase: visual self-critique happens through systematic screenshots, not impressions.

The "tells" of AI-generated design to avoid by default (frontend-design + web-artifacts-builder; legitimate sometimes, but as choices, never defaults):

- cream background `#F4F1EA` + high-contrast serif + terracotta accent `#D97757`
- near-black background with a single acid-green or vermilion accent
- identical SaaS cards, one border-radius for everything, same soft shadow under each
- ALL-CAPS eyebrow label above every heading; meta strings joined by middle dots; "→" appended to links; monospace for small data labels
- fade-and-slide-up entrances on every section; hover transitions on every card
- excessive centered layouts, purple gradients, uniform radii, default Inter font

## Vercel Labs skills

- web-design-guidelines — audit skill: fetches a living ~100-rule checklist (Web Interface Guidelines) and reviews code file by file, terse `file:line` output. Categories: accessibility, focus, forms, animation, typography, content, images, performance, navigation and state, touch, safe areas, dark mode, i18n, hydration, hover, copy, anti-patterns. Lesson: execution quality is verified by mechanical checklist. Notable rules: mandatory `prefers-reduced-motion`; animate only `transform`/`opacity`; visible focus never removed without replacement; explicit image `width`/`height` (anti-CLS); specific button labels; errors including the next step.
- writing-guidelines — reviews prose against 80+ rules of the Vercel writing handbook: tone by content type (tutorial, reference, troubleshooting), banned words ("easy", "simple", "quick" — presumptuous), direct address and active voice, heading structure, editorial typography (curly quotes, ellipses, non-breaking spaces), dedicated pricing-page rules. Lesson: brand voice is auditable by checklist, exactly like UI.
- vercel-optimize — "metrics-first" audit: collect real metrics first (performance, slow routes, costs), then investigate only what they point to. Principle reused in the audit method (step 1).
- react-best-practices, composition-patterns, react-view-transitions — React/Next code-level performance, composition, View Transitions: out of this skill's scope (beyond the quality floor).

## Transversal lessons (the 8 principles)

1. Tokens first (brand-guidelines) — the brand is codified before it is mockupped.
2. Philosophy before pixels (canvas-design) — a named stance governs every decision.
3. Choose, don't default (frontend-design) — every treatment must be defensible for this specific brief; the tells list is the mirror.
4. One bold move per site (frontend-design) — restraint makes a strong choice readable.
5. Audit mechanically (Vercel) — accessibility, performance, typography verified by checklist at every iteration.
6. Show to decide (theme-factory) — validation through comparable visuals, not descriptions.
7. Audit voice like UI (writing-guidelines) — copywriting has its own checklists.
8. Metrics-first (vercel-optimize) — every audit starts from measured data.

## Coverage check (v3 anti-omission pass)

This skill's source research was cross-checked against the full Anthropic and Vercel Labs skill deposits, research frameworks (Stanford, NN/g, Google), and academic brand models (Kapferer, Aaker, Keller). Gaps found and filled: auditable brand voice (writing-guidelines), test tooling (Playwright/webapp-testing), metrics-first method (vercel-optimize), E-E-A-T (credibility-SEO bridge), HEART (UX measurement), named NN/g heuristics, academic brand models, extra anti-slop tells. Voluntarily out of scope: advanced React/Next optimization, paid media and deep analytics, per-project budgets and timelines, sector-specific cases, full legal and SEO audits (separate expertises).

## Sources

- anthropics/skills — brand-guidelines, canvas-design, theme-factory, frontend-design, web-artifacts-builder, webapp-testing — https://github.com/anthropics/skills
- vercel-labs/agent-skills — web-design-guidelines, writing-guidelines, vercel-optimize — https://github.com/vercel-labs/agent-skills
- vercel-labs/web-interface-guidelines — https://github.com/vercel-labs/web-interface-guidelines
