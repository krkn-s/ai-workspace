# Auditing and improving an existing brand site

Audit method, brand grid, credibility research, sales levers, prioritization, benchmark of exemplar sites. Sources at the end.

## Improve or redo? Audit first

1. Is the brand platform still valid (positioning, audience)? No → strategic rebrand first (see `brand-md` audit).
2. Execution aging but foundation sound (recoverable tokens, reusable content, maintainable stack)? → improvement in waves.
3. Technique a glass ceiling (performance, accessibility, unsuitable CMS)? → technical redo keeping the identity.

## 5-step audit method (1-2 weeks for a mid-size site)

1. Metrics-first inventory — collect data first (analytics, Search Console, measured Core Web Vitals, reviews), map pages, assets, existing tokens; then investigate only what the numbers point to (vercel-optimize method).
2. Brand audit — grid below on the 8-10 most visited pages + social media (coherence is judged multichannel).
3. UX and credibility audit — key journeys think-aloud, Stanford grid, Nielsen's 10 usability heuristics: visibility of system status, match with the real world, user control and freedom, consistency and standards, error prevention, recognition over recall, flexibility and efficiency, aesthetic and minimalist design, error recovery, help and documentation.
4. Technical audit — Web Interface Guidelines checklist (Vercel) file by file, Core Web Vitals (PageSpeed Insights), legal compliance.
5. Synthesis and action plan — findings ranked severity × effort, in 3 lots, with before/after measurement.

## Brand audit grid

| Axis | Control questions |
|---|---|
| Logo | Versions up to date? Sizes and clear space respected? Light/dark variants? |
| Palette | Official colors = displayed colors (hex verified)? AA contrast? Identifiable signature color? |
| Typography | Declared fonts = loaded fonts? Consistent scale across pages? Proper fallbacks? |
| Imagery | Coherent regime (photo/illustration/3D)? Homogeneous treatment? Generic stock? |
| Voice and content | Constant tone? Key pages up to date (visible dates)? Typos, broken links, filler? |
| Credibility | Real contact easy? Embodied about page (faces, team)? Proof (clients, press, certifications)? Legal mentions? |
| Journeys | In 5 seconds, who speaks and what is offered? Does each page have ONE clear, specific next action? |
| Multichannel | Same brand on social, emails, PDFs? Same tokens? |

## Credibility: what research says

Stanford Web Credibility Project — 10 web credibility guidelines (B.J. Fogg, 2002; 3 years of research, 4 500+ people):

1. Make it easy to verify information accuracy (sources, links to evidence).
2. Show a real organization behind the site (physical address, office photo).
3. Highlight the team's and content's expertise (credentials, affiliations) — and avoid linking to non-credible sites.
4. Show honest people behind the site (bios, faces).
5. Make contact easy (phone, address, email).
6. Professional design suited to the purpose — people judge a site on looks alone, within seconds.
7. Be easy to use AND useful (aesthetics without usability is not enough).
8. Update content regularly (or show a review date).
9. Restraint with promotional content: separate content from ads, avoid pop-ups, clear and sincere writing.
10. Avoid all errors, however small — typos and broken links cost more credibility than assumed.

NN/g — 4 trust factors: design quality, up-front disclosure (what you do, for whom, prices), comprehensive and current information, connection to the outside world (links to recognized sites, citations, reviews).

E-E-A-T — Google Search Quality Rater Guidelines: Experience, Expertise, Authoritativeness, Trust — Google's grid for perceived content quality. Converges with Stanford: what convinces a human (proven real experience, identified and competent authors, third-party recognized authority, trust signals) convinces the engine too. E-E-A-T is the bridge between credibility and branded SEO: authors with bio and credentials (→ #3), cited sources (#1), dated content (#8), no disguised promo (#9).

Reading for brand sites: design (#6) opens the door, but 9 of 10 guidelines are factual — proof, transparency, contact, freshness, zero errors. The quality floor becomes a direct credibility lever: a typo, a dead link, a janky CLS are micro-betrayals of the brand promise.

## Sales levers without betraying the brand

- Social proof at decision points — place testimonials, client logos, figures, and press near CTAs, not in a graveyard at page bottom. Orders of magnitude (marketing stats, revalidate by test): ~84 % of consumers trust online reviews as much as personal recommendations; testimonials on a sales page ~+34 % conversion; visible reviews ~+67 % e-commerce conversion in one study; answering negative reviews ~+80 % trust gain.
- Specific CTAs faithful to vocabulary — "Book a demo", not "Learn more"; a Vercel rule, but also a credibility signal (Stanford #9).
- Brand continuity toward conversion — the click to shop/demo must be visually and verbally seamless (same tokens, same tone); an identity break at funnel entry destroys accumulated trust.
- Honest urgency — real scarcity, true counters; a fake countdown is a double failure (short-term conversion, long-term brand).

## Prioritizing improvements

| Lot | Horizon | Examples |
|---|---|---|
| Quick wins | < 1 day | Typos and broken links (Stanford #10), AA contrast, legal mentions, meta/OG, visible dates |
| Consolidation | 1-4 weeks | Token harmonization, social proof at decision points, specific CTAs, images/CWV, embodied about page |
| Structuring | 1-3 months | DA redo, documented design system, stack change, editorial redo |

Each lot is measured: before/after on branded search, direct traffic, time on site, lead quality.

## Benchmarking exemplar sites

Where to look: Awwwards (Business/Corporate and Luxury categories — e.g. Cartier "Le Chœur des Pierres"; Sites of the Year), FWA, Webby Awards, CSS Design Awards; commented selections ("55 award-winning websites" by HireAdrian, "24 sites primés" by Adobe). Build a swipe file: 10-15 saved sites, each annotated on the grid below — raw material for phases 0 and 2.

10-question grid for analyzing a reference:

1. What sticks in 5 seconds? (first impression test)
2. Does the hero open on the most characteristic thing in the brand's universe?
3. What is the site's single bold move? Is the rest disciplined?
4. Does typography carry the personality, or could you swap the font and change nothing?
5. Where is the social proof, and is it near a decision point?
6. Are CTAs specific and faithful to the brand's vocabulary?
7. Does the tone hold from page to page (titles, errors, 404, transactional emails)?
8. Felt performance: first screen in how many seconds on mobile?
9. Is `prefers-reduced-motion` honored? Usable without animations?
10. Stanford filter: contact, transparency, freshness, zero errors?

Competitive benchmark without mimicry: analyze 3 direct competitors + 3 out-of-category references (other sectors, same audience or same aesthetic ambition). Competitors show what is expected (the credibility minimum); out-of-category references reveal free aesthetic territories — where the new brand must settle.

## Sources

- Stanford Web Credibility Project — Guidelines for Web Credibility (Fogg, 2002) — https://credibility.stanford.edu/guidelines/index.html
- Stanford Web Credibility Project (Wikipedia) — https://en.wikipedia.org/wiki/Stanford_Web_Credibility_Project
- NN/g — Trustworthiness in Web Design: 4 Credibility Factors — https://www.nngroup.com/articles/trustworthy-design/
- NN/g — Trust or Bust: Communicating Trustworthiness in Web Design — https://www.nngroup.com/articles/communicating-trustworthiness/
- NN/g — 10 Usability Heuristics — https://www.nngroup.com/articles/ten-usability-heuristics/
- Google — Creating helpful, reliable, people-first content (E-E-A-T) — https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google — Search Quality Rater Guidelines (overview PDF) — https://services.google.com/fh/files/misc/hsw-sqrg.pdf
- Kerry Rodden — The HEART framework (Google) — https://kerryrodden.com/heart/
- Canny Creative — How to Do a Brand Audit — https://www.canny-creative.com/blog/how-to-do-a-brand-audit/
- Dawn — The Complete Brand Audit Checklist — https://www.wearedawn.co.uk/insight/the-complete-b2b-brand-audit-checklist/
- UpSlide — Brand Audits: 7 key steps — https://upslide.com/blog/how-to-do-a-brand-audit-7-key-steps/
- Pugo Designs — Brand audit checklist — https://pugodesigns.com/blog/brand-audit-checklist/
- Trustmary — 65+ statistiques preuve sociale — https://trustmary.com/fr/preuve-sociale/statistiques-de-preuves-sociales-qui-peuvent-vous-surprendre/
- WPForms — 15 exemples de preuve sociale (~84 % avis = reco personnelle) — https://wpforms.com/fr/brilliant-examples-of-social-proof-for-your-sites-forms/
- Mailchimp — Preuve sociale (~80 % confiance accrue si réponse aux avis négatifs) — https://mailchimp.com/fr/resources/social-proof/
- Kromaweb — témoignages et conversion (~+34 %) — https://kromaweb.fr/boostez-vos-conversions-en-utilisant-la-preuve-sociale/
- Awwwards — Business/Corporate — https://www.awwwards.com/websites/business-corporate/ ; Luxury — https://www.awwwards.com/websites/luxury/ ; Sites of the Year — https://www.awwwards.com/websites/sites_of_the_year/
- HireAdrian — 55 award-winning websites — https://hireadrian.com/award-winning-websites/
- Adobe — 24 sites web primés (FR) — https://business.adobe.com/fr/blog/basics/best-website-design-examples
