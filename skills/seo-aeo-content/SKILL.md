---
name: seo-aeo-content
description: "Plan or audit content that ranks and gets cited: SEO, AEO and GEO briefs, page outlines, landing structure, content audits, editorial calendars, keyword-to-question maps, AI-search measurement. Use to rank in Google or be cited in AI Overviews, ChatGPT, Perplexity, Gemini, Copilot."
---

# SEO/AEO Content

## Overview

Use this skill to create content that can rank in search engines and be cited or summarized by answer engines. Optimize for user intent first, then structure for search crawlers, AI Overviews, ChatGPT, Perplexity, Gemini, Copilot, and similar answer surfaces.

Keep outputs operational: briefs, outlines, audits, checklists, content plans, revision instructions, and measurement plans.

This skill owns the content layer only. If the task is about `llms.txt`, markdown mirrors, `sitemap.xml`, `robots.txt`, or AI crawler access, use the `ai-visibility-stack` skill instead. If the open question is which awareness level or which lead to write for, load the `copy-angle` skill when it is installed, or settle the lead with the user before drafting. Wording and AI-tell avoidance follow the `prose` skill when it is installed; otherwise apply its principle: plain sentences, no stock phrases, no unearned superlatives.

## Scope And Vocabulary

Treat SEO, AEO, GEO, LLMO, and AIO as one discipline under several names, not as separate plans. GEO and AEO describe the same goal, and Google states that optimizing for its generative AI features is still SEO.

Separate two questions on every request:

- retrieval: can the engine find the page at all;
- citation: once found, is the page worth citing.

Retrieval dominates. Do not present on-page tricks as a substitute for being retrievable.

## Reference Loading

Load references only when needed:

- Read `references/templates.md` for reusable brief, audit, page structure, and checklist formats.
- Read `references/guide-reference-seo-aeo.md` when the task needs deeper SEO/AEO reasoning, definitions, playbooks, source-backed nuance, or a complete methodology.
- Read `references/geo-ai-search-2026.md` when the request involves AI search visibility, GEO or LLMO wording, citation or share-of-voice tracking, or any "optimize for ChatGPT/Perplexity" claim. It carries the current evidence levels, the tactics that fail on live engines, and the measurement protocol.

Do not paste large reference sections into the answer. Apply them.

## Core Workflow

1. Clarify the business role of the content: acquisition, conversion, retention, proof, brand protection, support, or AEO visibility.
2. Identify the audience, funnel stage, search intent, and likely follow-up questions.
3. Separate brand SEO from non-brand SEO. Do not force brand storytelling into non-brand informational content unless it genuinely helps the user.
4. Analyze available inputs: existing page, target query, SERP notes, competitor pages, Search Console data, product docs, sales/support questions, or user-provided sources.
5. Create a direct answer first, then add depth: definitions, steps, examples, proof, comparisons, limitations, FAQ, and CTA.
6. Make the content referenceable: concise extractable answers, clear headings, named entities, sources, author/proof signals, internal links, and update cues.
7. Add an AEO/GEO layer: likely questions, citation opportunities, third-party mentions, list and comparison formats, YouTube/forum/help-center angles, and share-of-voice tracking.
8. Finish with an action checklist and measurement plan that reports per engine, over several runs, and splits branded from unbranded prompts.

## Output Rules

- Start from intent, not just keywords.
- Prefer one strong page per intent over many thin variants.
- Use clear H1/H2/H3 structures that match real questions and decisions.
- Include a short answer near the top for snippets and answer engines.
- Add original value: examples, experience, data, screenshots to request, methodology, customer proof, or explicit limitations.
- Avoid generic AI content, keyword stuffing, invented sources, unsupported claims, and vague marketing language.
- Treat SEO and AEO metrics as separate but connected: rankings/clicks/conversions plus citations/mentions/share of voice.
- For current facts, volatile platform rules, rankings, studies, laws, or model/search product behavior, verify with current authoritative sources before making recommendations.
- Prefer evidence from live engines and within-site comparisons over cross-site correlations and fixed-context laboratory tests. Label the level when a claim drives a recommendation.
- Refuse the tactics the evidence does not support: statistics or quotation padding for AI gain, AI-specific schema, micro-chunking, `llms.txt` or markdown copies sold as citation levers. Explain what the evidence shows instead.

## Common Deliverables

### SEO/AEO Brief

Include objective, audience, intent, target questions, SERP/AEO observations, angle, evidence, recommended structure, internal links, CTA, schema opportunities, distribution, and KPIs.

### Page Or Article Outline

Provide H1, direct answer, section-by-section H2/H3 structure, key points, examples/proofs to add, FAQ, CTA, and notes for AEO citation-worthiness.

### Content Audit

Assess intent match, technical basics, structure, usefulness, originality, E-E-A-T signals, internal links, brand/non-brand fit, AEO readiness, and priority fixes.

### Editorial Plan

Group topics by cluster and intent. Prioritize by business value, feasibility, available proof, SERP/AEO opportunity, and funnel role.

### AEO/GEO Visibility Plan

Map target questions, current answer surfaces, competitors cited, citation sources, missing content, off-site opportunities, and tracking method. Add a retrieval check: is the page renderable, crawlable, and returned by the engine's own search at all. Weight the plan toward one page per main question and toward the third-party formats that carry most citations: comparison pages, listicles, review roundups.

## Quality Bar

A good output should let a writer, editor, SEO consultant, or founder act immediately. It should answer:

- what to create or change;
- why it matters;
- what exact structure to use;
- what proof is needed;
- how to publish and distribute it;
- how to measure whether it worked.

When uncertain, state assumptions and choose the conservative option that protects long-term trust.
