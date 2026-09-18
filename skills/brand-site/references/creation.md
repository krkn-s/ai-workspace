# Creating a brand site from scratch

Process, ingredients, quality floor, metrics, deliverable trames, stack choice, French legal frame, resources. Sources at the end.

## The 9 phases

0. Discovery and brief — site mission, audience, constraints, references, measurable goals. Founding question (from the frontend-design skill): what is the concrete subject, who is the audience, what is the site's main job? Every aesthetic decision derives from it — a children's toy site has nothing in common with a financial analysts' tool.
1. Brand strategy — market and competitor audit; mission, vision, values, positioning, personality, tone (the brand platform). Prerequisite: you cannot design a brand you cannot describe in one sentence.
2. Design territory — formulate a named aesthetic stance (manifesto: name, principles, refusals), then a token system: 4-6 named colors with roles, 1-2 typefaces with roles, layout concept. canvas-design approach: the philosophy before its expression.
3. UX — information architecture, tree, key journeys, low-fidelity wireframes. Validate structure before styling.
4. UI and design system — high-fidelity mockups, components, states, responsive variants, animated prototypes of signature moments.
5. Content — write with the same rigor as the DA; in parallel with phase 4, never after.
6. Development — faithful integration of the design system; performance and accessibility from the first commit.
7. Tests — functional QA, accessibility (WCAG), performance (Core Web Vitals), user tests, visual self-critique (screenshots, review against the brief: "could this be anyone's site?").
8. Launch and optimization — measure, iterate. A brand site lives (campaigns, seasons, content): plan the system, not just the page.

## Concrete ingredients

- Hero — open on the most characteristic thing in the brand's universe: hook, image, animation, or interactive demo (frontend-design skill).
- Typography — 1-2 families max, clearly distinct if 2; tuned scale; type carries the personality (first identity signal).
- Palette — 4-6 named colors with roles (background, text, accents), not a collection of pleasing hues.
- Voice and copywriting — active, concrete, user's point of view; CTAs that say what they do ("Save changes", not "Submit"); consistent vocabulary across the site.
- Motion design — sparse and intentional: one orchestrated moment beats scattered effects; motion answering an action is welcome.
- Imagery — photo / illustration / 3D: pick one regime and stick to it; avoid generic stock.
- Design system — documented tokens (colors, type, spacing, radii, shadows, motion) to stay coherent as the site grows.

## Restraint

> "Spend your boldness in one place. Let one element be the memorable thing, and everything around it stay quiet and disciplined." — frontend-design skill (Anthropic), quoting Chanel: "before leaving the house, look in the mirror and remove one accessory."

A brand site is not maximalist: one strong choice (an exceptional typeface, a signature color, one animated moment) carries the identity, surrounded by impeccable, discreet execution.

## Quality floor (non-negotiable)

- Accessibility — semantic HTML, contrast, visible focus, `alt`, honored `prefers-reduced-motion`, full keyboard navigation (see Vercel Web Interface Guidelines).
- Performance — Core Web Vitals: LCP < 2,5 s, INP < 200 ms, CLS < 0,1. A slow site erodes the brand; in 2026 only ~66 % of sites reach the "good" LCP threshold.
- Responsive — mobile to very large screens, no exception.
- Branded SEO — tags, structured data, indexable content; the site also answers branded queries.

## Measuring a brand site (distinct from e-commerce)

- Assisted recall / ad recall of the site
- Branded search volume before/after campaigns
- Time on site, pages/session, returning visitors
- Social shares and press (the site as a showable "object")
- Direct traffic (typed URL) — a sign of brand capital
- Lead quality and conversion of relay actions (demo, shop)
- UX side: cross with Google's HEART grid (Happiness, Engagement, Adoption, Retention, Task success) via Goals → Signals → Metrics. These indicators measure brand capital; HEART measures experience quality — complementary.

## Deliverable trames (copy-and-fill)

- A. Brief — context (who, what, why now) • the brand in 5 words • audience (2-3 personas max) • site's dominant mission • measurable goals • constraints (technical, legal, budget, deadlines) • 5 liked + 5 rejected references with why • decision makers.
- B. Brand platform — mission • vision • values (3-5, ranked) • positioning ("For [audience], we are the only brand that [differentiator], because [proof]") • personality (5 adjectives, 2 contrasting) • tone (do / don't, with rewrite examples) • promise + 3 proofs. To go deeper: Kapferer's brand identity prism (6 facets — physique, personality, culture, relationship, reflection, self-image), Aaker's brand equity model, Keller's pyramid — this trame is their minimal operational version.
- C. Design philosophy (canvas-design method) — stance name (2 memorable words) • 4-6 paragraph manifesto (space, color, scale, composition) • palette 4-6 named hex with roles • typography 1-2 families with roles + fallbacks • layout concept (1 sentence + text wireframe) • principles (what makes this site unique) • explicit refusals (banned generic tells).
- D. Audit report — score per axis (brand / UX / credibility / technical / legal) • findings as `page §section` or `file:line` + severity • recommendation + effort • 3-lot plan • baseline measurements.

## Choosing the stack

| Option | Strengths | Limits | Choose if… |
|---|---|---|---|
| Framer | Production speed, rich DA, native animations | Closed platform, weaker technical SEO | Small brand site, fast launch, design team |
| Webflow | Layout control + CMS + SEO, editable by non-devs | Cost, lock-in | Evolving content, autonomous marketing team |
| Astro | Excellent performance, content-first, clean code | Needs devs | Editorial / content-first, headless CMS, extreme performance |
| Next.js | Technical SEO, scalability, app logic | Hour cost, maintenance | Brand + product/app integrated, custom needs |

Heuristic: evolving content → plan a CMS (Webflow native, or headless with Astro/Next); no dev team → no-code; integrated app or deep technical SEO → code. Whatever the stack, the quality floor and the Vercel checklist apply identically.

## French legal frame (practical summary, not legal advice)

- Mentions légales — mandatory for any public site (LCEN, 21 June 2004): editor identity and host; for professionals, SIREN, RCS, etc. Heavy criminal sanctions (up to 1 year imprisonment and 75 000 €). Also a credibility signal (Stanford #2): ~61 % of French sites are reportedly non-compliant.
- RGPD — inform on collected data (CNIL models), prior consent for non-essential cookies, data subject rights (access, rectification, objection, erasure) with a dedicated contact.
- Accessibility (RGAA / EAA) — based on WCAG 2.1 (106 RGAA criteria). Mandatory without threshold for the public sector and companies > 250 M€ revenue in France; the European Accessibility Act (June 2025) extends to private B2C services (e-commerce, banking, transport…). Possible sanctions (~50 000 € per site in some cases); accessibility is both a legal risk and a credibility and market lever.

## Resources

- Curated type pairings — Fontpair (1000+ Google Fonts combos), Typewolf, Google Fonts Knowledge (pairing method), 2025 Figma pairing files by tone.
- Licenses — Google Fonts: free for commercial use; foundries charge per use: budget desktop/web licenses before falling for a paid font.
- Method — 1-2 families max, test each pairing with the client's real content, at all sizes, mobile first.
- Imagery — own production first; else curated banks with homogeneous treatment (grade, cropping); never unreworked raw stock.

## Sources

- Clique Studios — The 7 key stages of web design process — https://cliquestudios.com/university/resources/web-design-process
- Figma — How to make a business website — https://www.figma.com/resource-library/how-to-make-a-business-website/
- Miro — Website wireframe guide — https://miro.com/wireframe/what-is-a-website-wireframe/
- Adobe — Construire une marque en 8 étapes — https://business.adobe.com/fr/blog/basics/how-to-build-a-brand
- HubSpot / Wix / Squarespace / Fidesio — guides identité de marque (FR)
- Shopify — Website branding best practices — https://www.shopify.com/blog/website-branding-best-practices
- web.dev — Web Vitals — https://web.dev/articles/vitals
- Google — Core Web Vitals — https://developers.google.com/search/docs/appearance/core-web-vitals
- Blaaaz — Core Web Vitals 2026 (seuils, stats terrain) — https://www.blaaaz.com/core-web-vitals-2026-le-guide-ultime-pour-passer-de-moyen-a-excellent/
- CNIL — Les mentions légales sur un site web, est-ce obligatoire ? — https://www.cnil.fr/fr/cnil-direct/question/les-mentions-legales-sur-un-site-web-est-ce-obligatoire
- CNIL — RGPD : exemples de mentions d'information — https://www.cnil.fr/fr/passer-laction/rgpd-exemples-de-mentions-dinformation
- Service-public.fr — Mentions obligatoires site internet — https://entreprendre.service-public.gouv.fr/vosdroits/F31228
- info.gouv.fr — Accessibilité : le cadre légal — https://www.info.gouv.fr/accessibilite/le-cadre-legal
- Numérique.gouv — RGAA : champ d'application — https://accessibilite.numerique.gouv.fr/obligations/champ-application/
- SK Web — Obligations RGAA 2026 (seuil 250 M€, EAA, sanctions) — https://sk-web.fr/article/rgaa-obligations-2026
- CCI Haute-Savoie — Mentions légales (~61 % de sites non conformes) — https://www.haute-savoie.cci.fr/blog/mentions-legales-site-web-et-mentions-obligatoires
- Raze — Framer vs Webflow vs Next.js for SaaS — https://razegrowth.com/tools/best-saas-marketing-tech-stack
- Brainy — Framer vs Webflow vs Next.js 2026 — https://brainy.ink/paper/framer-vs-webflow-vs-nextjs-2026
- Contentful — Astro vs Next.js — https://www.contentful.com/blog/astro-next-js-compared/
- Gemeos — Webflow vs Framer (FR) — https://www.gemeosagency.com/fr/blog/webflow-vs-framer-quel-outil-no-code-choisir
- Fontpair — https://fontpair.co/ ; Typewolf — https://www.typewolf.com/google-fonts ; Google Fonts Knowledge — https://fonts.google.com/knowledge/choosing_type/pairing_typefaces ; PageCloud — https://www.pagecloud.com/blog/best-google-fonts-pairings
- Umbrex — Kapferer Brand Identity Prism — https://umbrex.com/resources/frameworks/marketing-frameworks/kapferer-brand-identity-prism/
- Canto — The Aaker Model — https://www.canto.com/blog/aaker-model/
