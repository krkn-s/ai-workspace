# GEO And AI Search: Evidence Reference

Use this reference when the task involves AI search visibility, GEO, LLMO, AIO, citation tracking, or a request to "optimize for ChatGPT, Perplexity, Gemini, Copilot". It records what the evidence supports, with dates and confidence, so this skill does not recycle laboratory tactics that fail on live engines.

Checked: November 28, 2026. AI search behavior changes fast. Re-verify anything older than a quarter before relying on it.

## Vocabulary

- SEO: making a site eligible, findable, understandable, and trustworthy for search engines.
- AEO, answer engine optimization: making content usable as an answer, source, or recommendation in an interface that generates the response.
- GEO, generative engine optimization: the same goal, named for generative engines. Academic work and vendors treat it as a synonym for AEO.
- LLMO, AIO, GSO: other labels for the same work. Treat all of them as synonyms, never as separate disciplines.

Google states the position plainly in its own generative AI guide: from Google Search's perspective, optimizing for generative AI search is still SEO, and third-party "AEO" or "GEO" advice should be evaluated against official guidance. Use the vocabulary for routing and for matching what a client asks for, not as a reason to build three plans.

## The Pipeline You Are Optimizing

Every AI answer is produced in stages, and only part of that chain is on-page work:

1. Fan-out: the engine rewrites the question into several short web searches.
2. Retrieval: the engine's own index returns candidate pages. That index is not Google's.
3. Rerank and context: a shortlist is placed in the model's context, in some order.
4. Generation and citation: the model writes the answer and attaches citations to some of those pages.
5. Brand mention: the answer names brands, sometimes from memory instead of from a cited page.

A page that retrieval never returns cannot be cited, whatever its structure. Studies that hand documents directly to a model measure stages 3 to 5 only, so they cannot tell you whether a change gets a page found. Ask which stage a claim comes from before repeating it.

## Evidence Levels

Use these labels when you cite a finding:

- **A**: field trial or quasi-experiment with logs and a control group.
- **B**: live commercial engines, with repeated runs, paraphrases, or several dates.
- **C**: commercial system with URLs supplied by the researcher.
- **D**: reproducible pipeline with retrieval, reranking, and generation.
- **E**: fixed context, synthetic ranker, or LLM judge. Shows a mechanism, not a visibility gain.

Most published GEO tactics rest on level E. Prefer A and B when they contradict E.

## What Holds Up

### Being retrieved dominates

- Chen and Koudas 2026 (level B, preprint): 158,099 answers and 468,037 citations from ChatGPT, Gemini, and Perplexity over 90 days, in a consumer and a niche B2B market. Whether the engine's own search returned a page explained 32% of citation variance between pages, while all on-page features together explained 2.8%.
- Rank inside that search is steep: in replay, ChatGPT cited 43.8% of pages ranked first, 12.2% at ranks 6 to 10, 3.5% at ranks 11 to 20.
- Google's index is a weak proxy. In the same study, 97% of pages ChatGPT retrieved were outside Google's top 50 for the query. Elsewhere, 53% of AI Overview domains were outside the organic top 10, and URL overlap between Google organic, AI Overviews, and Gemini ranged from 0.11 to 0.18 Jaccard.
- Pages whose main text needs JavaScript received 10.6% fewer Gemini citations in that study. Renderability is a retrieval lever.

### Query-content match is the only consistently positive on-page lever

- Same study, within site: a one standard deviation increase in title match to the question went with 14.1% more citations, and the same increase for the best-matching paragraph with 15.5%. Both passed the study's robustness tests.
- Six positive findings out of seven across the wider base, at every evidence level, including live and Chinese-language engines.
- Paired trials across six models (252,000 pairs) found four factors deciding which of two documents is cited first: topic match, price, recency, and list position. Formatting was negligible.

### Brand mentions come from third-party pages and model memory

- In the 90-day study, 46% of brand mentions where the question did not name the brand had no cited page naming it: the model named it from memory.
- Third-party pages carry the weight for unknown brands: in the niche B2B market, a third-party page naming the vendor multiplied the odds of a ChatGPT brand mention by 39.7, and by 4.2 in the consumer market.
- Most citations go to sites the brand does not own: 75.0% third-party in the consumer market, 50.8% in niche B2B, against 11.1% and 2.6% for the client's own sites.
- Ranked "best-of" lists are the format to aim for: listicles were 35.7% of content citations in one vendor dataset, and nearly 90% of third-party brand mentions came from listicles, comparison pages, and review roundups (vendor data, level B at best).
- Recognition is not discovery: one preprint found products recognized 99.4% of the time when named, but surfaced in only 3.32% of unbranded discovery queries on ChatGPT. Single study, treat as a hypothesis.

### Recency and price matter for time-sensitive and commercial questions

- In paired trials, a current timestamp beat an old one in every model tested, and a visible price beat no price in every model tested.
- Live data is weaker: within site, page age moved citations by about -5.1% per standard deviation, and the number of prices on a page had no effect.
- ChatGPT added the current year to 23% of its searches. Pages that show the year are easier to match.

### Structure concentrates credit, it does not buy admission

- Replaying frozen agent transcripts and changing only the rendering added 0.50 citations per answer to the target document, while the effect on whether it was cited at all was not significant.
- Chunks under 150 words fragment text and reduced citation probability by 23% in one study. Paragraphs of 150 to 300 words performed best. There is no evidence that micro-chunking helps.
- Headings went with 7.7% more citations in one market and had no effect in another. Treat structural gains as small and conditional.

## What Does Not Hold Up

### FAQ blocks, schema, summary boxes, author boxes

- Across sites, pages carrying these were cited 7.5% to 20.9% more. Within the same site, the effects collapsed to FAQ -3.4%, schema -5.3%, summary +6.9%, and author -4.6%, none significant. Popular sites use these elements and popular sites get cited.
- A controlled test of 1,885 pages that added JSON-LD against 4,000 control pages found no citation uplift on AI Overviews, AI Mode, or ChatGPT (Ahrefs, May 2026).
- Google states that structured data is not required for generative AI search and that there is no special schema to add. Keep schema for rich results and clarity, never as an AI-citation tactic.

### Rewrite recipes: "add statistics", "add quotations", "sound more authoritative"

- The original GEO paper reported large gains from these rewrites in a fixed context of five documents.
- C-SEO Bench (NeurIPS Datasets and Benchmarks 2025) retested common rewrite methods across six domains: 3 of 54 method-domain cases were significantly positive, and none in question answering. The authors conclude that most conversational SEO methods are ineffective or harmful, that traditional SEO work is more effective, and that gains shrink as more actors adopt the same method.
- In e-commerce, 10 of 15 common heuristics were neutral or negative.
- In the live-web test (LIVE-GEO, October 2026), "Statistics Addition" won the top position for 5.0% to 11.3% of brands against 66.3% to 76.3% for the strongest strategy, and its prompt fabricated numbers in all 80 rewritten descriptions. Unsupported statistics are detectable and win nothing.
- When run through a full retrieval pipeline, body-only rewrites cut top-20 retrieval by about 9% and final citation by 6%.

### `llms.txt` and markdown copies of pages

- 28% of 137,000 monitored domains publish an `llms.txt`, and 97% of those files received zero requests in a month. AI retrieval bots made 1.1% of the few requests that happened. Coding agents such as Claude Code fetched the file more than any retrieval bot (Ahrefs server-log study, June 2026).
- A randomized controlled test on 380 pages found no significant change in AI bot traffic when markdown was served instead of HTML (Profound, February 2026).
- Google states that Search ignores `llms.txt` and does not need markdown versions to appear in generative AI features.
- These files remain useful for coding agents and documentation. They are not citation levers, and saying otherwise is a promise the evidence does not support.

### Stuffing, hidden instructions, and inauthentic mentions

- Keyword stuffing does not transfer from classic SEO and is filtered by retrieval stacks.
- Hidden instructions still work in controlled tests and are being closed with detection and defenses.
- Google lists seeking inauthentic mentions as a myth: ranking systems and spam systems both apply to generative features.

## What This Means For A Content Plan

- One page per main question, with the question in the title and a self-contained answer directly under the heading. A page covering many questions matches none of them as well.
- Write for retrieval, then for credit: renderable HTML, crawlable links, plain text in the main content.
- Paragraphs of 150 to 300 words, headings that mirror real questions, no artificial micro-chunks.
- For commercial questions, show prices, dates, versions, and constraints explicitly.
- Budget distribution to third-party surfaces, comparison pages, and listicles. On-site work alone caps the ceiling.
- Keep schema, FAQ blocks, and author boxes where they serve readers and rich results, and stop counting them as AI tactics.
- Refuse the non-tactics above when a client or a brief asks for them, and say what the evidence is.

## Measurement Protocol

AI visibility is noisy enough that single runs mislead:

- Run each prompt 7 to 8 times per engine and report averages.
- Day-to-day overlap of cited sources is only 0.34 to 0.42 Jaccard, so about two thirds of sources change from one day to the next.
- Repeat overlap decays fast: 63% to 67% inside a test window, but 14% for ChatGPT and 29% for Gemini ten weeks later.
- Report each engine separately. ChatGPT, Gemini, Perplexity, and AI Overviews cite different pages, and only 26% of domains were shared between two engines in one audit.
- Split branded from unbranded prompts. Branded prompts name the brand in 94% to 100% of first runs, unbranded prompts in 12% to 52%. Branded prompts hide the discovery problem.
- Report "brand named in the answer" and "client page cited" as two metrics.
- Report over two to four weeks, never a single day.
- To claim an effect, compare changed pages or prompts with unchanged controls. Only two studies in the current base measure traffic, and neither establishes a causal traffic effect.

## Sources

- Google Search Central, [Optimizing your website for generative AI features on Google Search](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide), 2026: SEO fundamentals, myth list, Search Console generative AI reporting, agentic guidance.
- Google Search Central, [Generative AI performance report](https://support.google.com/webmasters/answer/16984139) and [AI features eligibility setting](https://support.google.com/webmasters/answer/16908024), 2026.
- Chen and Koudas, [What Drives AI Citations?](https://arxiv.org/abs/2610.15033), October 2026, preprint.
- Puerto et al., [C-SEO Bench: Does Conversational SEO Work?](https://arxiv.org/abs/2506.11097), NeurIPS Datasets and Benchmarks 2025.
- Kong et al., [Do GEO Gains Survive the Live Web? LIVE-GEO](https://arxiv.org/abs/2611.01126), October 2026, preprint.
- Martinez, [Optimizing Visibility in Generative Engines: A Critical Survey of GEO, 2023-2026](https://arxiv.org/html/2607.14035), July 2026, 45 studies.
- Waniwani, [What makes AI engines cite a page: a review of 68 studies](https://www.waniwani.ai/research/what-makes-ai-engines-cite-a-page), November 2026. Vendor review, used for its evidence levels and vote counts.
- Ahrefs, [We Analyzed 137K Sites: 97% of llms.txt Files Never Get Read](https://ahrefs.com/blog/llmstxt-study/), June 2026.
- Ahrefs, [We Tracked 1,885 Pages Adding Schema](https://ahrefs.com/blog/schema-ai-citations/), May 2026.
- Profound, randomized test of markdown serving on 380 pages, February 2026.

Vendor studies are self-interested and several key studies are preprints. Use them for direction, and prefer level A and B designs plus official documentation when they disagree.
