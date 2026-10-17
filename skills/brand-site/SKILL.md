---
name: brand-site
description: Design, build, audit, and improve brand websites — sites where the brand identity itself is the product, distinct from e-commerce, landing pages, or SaaS marketing sites. Use when creating a brand site from scratch (strategy, design philosophy, tokens, UX/UI, content), auditing or improving an existing brand site for coherence, credibility, or sales (Stanford guidelines, E-E-A-T, NN/g heuristics, Core Web Vitals), choosing a stack (Webflow, Framer, Astro, Next.js), or benchmarking award-winning brand sites. Triggers include refonte de site, site de marque vs site vitrine, améliorer la crédibilité ou l'apparence d'un site, augmenter les ventes d'un site. Loads the brand's BRAND.md as input when it exists. Déclenche aussi en français — créer ou refondre un site de marque, auditer ou améliorer un site de marque (crédibilité, apparence, ventes), choisir la stack, distinguer les types de sites.
---

# Brand Site

Method and reference knowledge for brand websites: what they are (vs e-commerce, vitrine, landing), how to create one from scratch, and how to audit or improve one for coherence, credibility, and sales. Research-backed — Stanford credibility guidelines, NN/g, Google E-E-A-T and HEART, Core Web Vitals, Vercel Web Interface Guidelines — plus lessons distilled from agent design skills (Anthropic, Vercel Labs).

Sibling skill: `brand-md` governs the `BRAND.md` source of truth (capture, don't invent). This skill designs the site where that brand manifests (proposing a territory is the job). The two compose — see Input contract. Once the visual direction is decided, the `impeccable-lite` skill carries the detailed UI craft (components, typography, motion, states). UX copy and any prose on the pages follow the `human-prose` skill.

## Input contract (BRAND.md first)

1. Look for a `BRAND.md` at the project root (or an `AGENTS.md` pointer to it).
2. If found — tokens, voice, palette, forbidden usages come from it. Never contradict or restyle them.
3. If missing — for an existing brand, propose running `brand-md` (create) first. For a new brand where the site is the first brand artifact, proceed, and propose capturing decided fields into a `BRAND.md` at the end.
4. Never fabricate positioning, values, proof, or legal data — ask or mark as open question.

## Task routing

| Task | Read | Output |
|---|---|---|
| Create a brand site from scratch | `references/typology.md`, `references/creation.md` | Design territory + tokens, phased plan, trame-filled deliverables |
| Audit or improve an existing brand site | `references/audit.md` | Audit report, 3-lot action plan (quick wins / consolidation / structurant) |
| Benchmark or seek inspiration | `references/audit.md` (references grid), `references/skills-lessons.md` | Swipe file annotated on the 10-question grid |
| Understand site types, UI vs UX vs brand design | `references/typology.md` | Explanation with comparison tables |
| Design-phase anti-generic check | `references/skills-lessons.md` | Review against the "tells" list |

## Workflow

1. **Phase first.** New site or refonte — position in the 9-phase process (brief, brand strategy, design territory, UX, UI, content, build, tests, launch). See `references/creation.md`.
2. **Capture the brand input.** BRAND.md or user statements; mark the rest as open questions.
3. **Philosophy before pixels.** Named design manifesto, then tokens (4-6 named colors with roles, 1-2 typefaces with roles and fallbacks), then wireframes, then UI.
4. **Anti-generic gate.** Review every plan against the tells list (`references/skills-lessons.md`) — "could this be anyone's site?" is a formal checkpoint, not a feeling.
5. **Quality floor, always.** WCAG, Core Web Vitals (LCP < 2,5 s, INP < 200 ms, CLS < 0,1), `prefers-reduced-motion`, responsive, legal mentions.
6. **Audit path (existing site).** Metrics-first inventory, brand grid, Stanford/NNg/E-E-A-T credibility review, technical checklist, 3-lot prioritized plan. See `references/audit.md`.

## Non-negotiables

1. **BRAND.md wins.** When it exists, its tokens and voice are constraints, not suggestions.
2. **One bold move per site.** A single memorable element; everything around it quiet and disciplined.
3. **Credibility is factual as much as visual.** Real contact, up-to-date content, zero typos and broken links, no fabricated proof, no fake urgency.
4. **The quality floor is not negotiable.** Accessibility, performance, responsive — a slow or inaccessible site erodes the brand it claims to build.
5. **Stack is a decision, not a default.** Choose against content velocity, team skills, and lock-in (`references/creation.md`), and confirm budget implications with the user.

## Stop and ask

- no BRAND.md and the user has not stated positioning, audience, or values — distinguish what is captured vs proposed; never invent brand facts
- mentions légales, RGPD, RGAA compliance — summarize obligations, flag as human-action items, never assert compliance
- stack choices with cost or lock-in consequences — confirm budget and team skills
- audit without analytics or metric access — never invent baseline numbers; say what cannot be measured
- social-proof statistics — present as orders of magnitude to revalidate by test, never as guarantees

## Output contracts

- **Create:** design territory + tokens, phased plan, filled trames (brief, brand platform, philosophy, deliverable list), open questions.
- **Audit:** score per axis (brand / UX / credibility / technical / legal), findings with severity and effort, 3-lot plan, baseline measurements — no rewrite until direction is confirmed.
- **Improve:** prioritized fixes with before/after measures (branded search, direct traffic, lead quality).
- **Benchmark:** annotated swipe file (10-question grid per site), free aesthetic territories identified.
