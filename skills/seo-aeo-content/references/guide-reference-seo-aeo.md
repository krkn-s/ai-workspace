# SEO and AEO Reference Guide

Last updated: April 27, 2026  
Purpose: reference document for writing, creating, optimizing, and maintaining internet content that can be visible in Google, AI Overviews, ChatGPT, Perplexity, Gemini, Copilot, and other answer interfaces.

## 1. Executive Summary

SEO is not being replaced by AEO. SEO is the foundation that AEO builds on.

SEO makes a page findable, understandable, indexable, useful, and trustworthy for search engines. AEO, or Answer Engine Optimization, makes your content, brand, or proof clear and reliable enough to be cited, summarized, or recommended in an AI-generated answer.

The core logic:

- SEO: earn a place in a results page.
- AEO: earn a place in an answer.
- GEO: a related term often used for visibility in generative engines. This guide uses AEO as the primary term.

The best current strategy is not to choose between SEO and AEO. It is to build a content system that works for humans, search engines, and answer engines:

- a technically clean and indexable site;
- pages that answer a precise intent;
- original, useful, up-to-date, citable content;
- a brand mentioned in credible third-party places;
- measurement that tracks clicks, conversions, citations, and share of voice.

The main mistake is treating AEO as a separate hack. Google states that SEO best practices remain relevant for AI Overviews and AI Mode, without any special technical file or required schema. In the broader LLM and answer-engine ecosystem, however, citations, brand mentions, Reddit, YouTube, media, comparison pages, reviews, and support content matter more.

## 2. Sources and Confidence Level

This guide consolidates six local sources from `Sources/` and enriches them with recent external sources. The local transcripts were used to extract frameworks, practical intuitions, and field experience. External sources were used to verify, qualify, or correct claims.

### Local Research Materials Analyzed

The first version of this guide was drafted from six local research transcripts that are not distributed in the public repository. Their main contributions were:

- a 2026 SEO best-practices session covering the three SEO pillars, brand and non-brand SEO, search intent, auditing, action planning, and caution against mass AI content or artificial backlinks;
- a SEO/GEO strategy session covering multimodal content, brand authority, mentions, the Google and AI ecosystem, and LinkedIn/YouTube/podcast presence;
- an AEO expert interview covering AEO as an SEO extension, citations, conversational long tail, Reddit/YouTube/help-center optimization, AEO tracking, test/control experimentation, and misinformation risks;
- an AI Overviews/AEO tactical session covering AEO keyword research, informational intent, People Also Ask, featured snippets, images, brand monitoring, gap analysis, and a 30-day plan;
- an AEO introduction covering brand narrative control and the four AEO pillars: content, technical, authority, and measurement;
- a marketing strategy session covering strategic AI use, referenceable content, specialization, and distribution.

### External Sources Used

- Google Search Central, [AI features and your website](https://developers.google.com/search/docs/appearance/ai-features): AI Overviews and AI Mode use SEO fundamentals and do not require a special file or schema.
- Google Search Central, [Top ways to ensure your content performs well in Google's AI experiences on Search](https://developers.google.com/search/blog/2025/05/succeeding-in-ai-search): unique, useful, non-commoditized content adapted to longer and more specific questions.
- Google Search Central, [Guidance on using generative AI content](https://developers.google.com/search/docs/fundamentals/using-gen-ai-content): AI can help with research and structure, but large-scale generation without added value can violate spam policies.
- Google Search Central, [Creating helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content): who created the content, how it was produced, and why it exists.
- Google Search Central, [SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide): architecture, URLs, images, videos, useful content, promotion, and false SEO priorities.
- Google Search Central, [Technical requirements](https://developers.google.com/search/docs/essentials/technical): Googlebot not blocked, HTTP 200, indexable content.
- Google Search Central, [Structured data intro](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data) and [structured data guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies): structured data is useful but not guaranteed to produce enhanced results.
- Google Search Central, [Robots meta tags](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag): `nosnippet`, `max-snippet`, `data-nosnippet`, and impact on AI Overviews/AI Mode.
- Google, [AI Overviews and AI Mode in Search](https://search.google/pdf/google-about-AI-overviews-AI-Mode.pdf): AI Overviews rely on ranking systems, the Knowledge Graph, web results, and quality protections.
- Semrush, [AI Overviews Study 2025](https://www.semrush.com/blog/semrush-ai-overviews-study/): growth of AI Overview-triggering queries, intent patterns, zero-click behavior, and SERP co-presence.
- Ahrefs, [AI Overview Brand Visibility Factors](https://ahrefs.com/blog/ai-overview-brand-correlation/): strong correlation between web brand mentions and visibility in AI Overviews.
- Ahrefs, [How to Rank in AI Overviews](https://ahrefs.com/blog/?p=194802): importance of intent density and the risk of diluting content with overly broad coverage.
- Pew Research Center, [Google users are less likely to click on links when an AI summary appears](https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/): observed click behavior on pages with AI summaries.
- Amsive, [Google AI Overviews CTR Study](https://www.amsive.com/insights/seo/google-ai-overviews-new-research-reveals-how-to-navigate-click-drop-off/): observed CTR declines for keyword sets with AI Overviews, especially non-brand queries.

## 3. Useful Definitions

### SEO

Search Engine Optimization. The discipline of making a site eligible, understandable, relevant, and trustworthy for search engines.

SEO is not limited to keywords. Good SEO combines:

- technical: crawl, indexing, speed, mobile, security, HTML, internal links;
- content: intent, usefulness, depth, originality, structure;
- trust: links, mentions, brand, reputation, external proof;
- measurement: Search Console, analytics, conversions, rankings, high-performing pages.

### AEO

Answer Engine Optimization. The discipline of making content usable as an answer, citation, or recommendation in interfaces that generate direct summaries.

Examples of answer surfaces:

- Google AI Overviews;
- Google AI Mode;
- ChatGPT with search;
- Perplexity;
- Gemini;
- Copilot;
- voice assistants or conversational interfaces.

AEO does not replace SEO. It adds a new question:

> Is this content clear, reliable, specific, and referenceable enough to be cited in an answer?

### GEO

Generative Engine Optimization. A term often used to describe visibility optimization in generative engines. In practice, GEO and AEO overlap heavily: content structure, citations, brand mentions, external authority, clear data, and share-of-voice tracking.

This guide uses AEO as the primary term because the goal is the answer.

### AI Overview

An AI-generated summary in Google Search. It synthesizes information from several sources and may include supporting links. Google says AI Overviews rely on its ranking, quality, and safety systems.

Practical implication: to appear in AI Overviews, a page must first be eligible in Google Search. Google also states that there is no special optimization or special schema required for AI Overviews and AI Mode.

### Citation

In AEO, a citation is a source used or displayed by the answer engine. It can be:

- a page on your site;
- a media page;
- a YouTube video;
- a Reddit or forum discussion;
- a review page;
- a product page;
- a comparison page;
- documentation or a help center article.

A citation is not always a visible clickable link. But it influences how AI formulates the answer, selects brands, and presents options.

### Brand Mention

A brand mention is an occurrence of your brand in third-party content, with or without a backlink. The local sources emphasize that unlinked mentions matter more in AEO. Ahrefs observed a strong correlation between web brand mentions and AI Overview visibility. This is not proof of direct causation, but it is an important strategic signal.

### Search Intent

What the user is really trying to accomplish. The most useful categories:

- informational: understand, learn, compare concepts;
- commercial: evaluate a solution, compare offers, choose;
- transactional: buy, book, subscribe, download;
- navigational: reach a brand, site, account, or specific page;
- local: find a nearby or location-specific solution.

A page that misses intent can be well written and still useless for SEO.

## 4. Mental Model: What Changes and What Does Not

### What Does Not Change

The fundamentals still apply:

- content must help the user;
- a page must be indexable;
- intent must be clear;
- structure must make reading easier;
- the brand must inspire trust;
- internal and external links help clarify context;
- pages must be maintained.

Google confirms that SEO fundamentals remain relevant for AI Overviews and AI Mode. This contradicts claims that SEO should be abandoned for a completely new discipline.

### What Changes

Answer interfaces change behavior:

- users ask longer questions;
- follow-up questions become central;
- AI synthesizes multiple sources;
- clicks are no longer guaranteed;
- visibility can exist without an attributed analytics session;
- external mentions become more important;
- support pages, videos, forums, and comparison pages become potential sources;
- brand narrative control also happens off-site.

Pew observed in March 2025 that users clicked traditional results less often when an AI summary appeared. Semrush qualifies the topic: queries with AI Overviews often already have a zero-click tendency, and impact depends on intent. The practical conclusion is that SEO should no longer be measured only through raw organic traffic.

### The New Central KPI

Before, we mostly asked:

- am I ranking?
- how many clicks do I get?
- how many conversions do I get?

Now we must also ask:

- am I cited?
- am I mentioned positively?
- am I absent when competitors are present?
- is my brand understood correctly?
- what share of voice do I have in AI answers?
- which third-party content feeds answers in my market?

## 5. The Unified SEO/AEO Strategy

The reference framework combines five pillars.

### Pillar 1: Technical

Goal: make the site accessible, fast, readable, and indexable.

Minimum viable baseline:

- Googlebot can access important pages;
- important pages return HTTP 200;
- the main content is indexable text;
- pages are not accidentally blocked through `robots.txt`, `noindex`, CDN settings, or server protection;
- the mobile version is usable;
- important images and videos have descriptive text;
- structured data matches visible content;
- Search Console is installed.

Google lists three minimum requirements for indexing: Googlebot must not be blocked, the page must work, and the page must contain indexable content.

For AEO, technical quality has two roles:

- allow engines to find the page;
- make content easy to extract, understand, and cite.

### Pillar 2: Content

Goal: answer a precise intent better than alternatives.

Good SEO/AEO content:

- starts with the expected answer;
- then explains context, nuance, and edge cases;
- uses headings that match real questions;
- adds examples, data, proof, methods, and comparisons;
- avoids diluting intent with tangential sections;
- shows the author's experience or expertise;
- includes visuals or videos when they truly help;
- is updated when facts change.

Ahrefs' AI Overview research highlights an important point: longer is not always better. A page can become less relevant if it adds too many sections that drift away from the primary intent. Intent density matters more than length.

### Pillar 3: Trust and Authority

Goal: create an environment of proof around the brand and content.

This includes:

- legitimate backlinks;
- unlinked mentions;
- customer reviews;
- case studies;
- media citations;
- third-party comparisons;
- expert contributions;
- author profiles;
- presence on platforms where customers search.

The local sources converge on one idea: the trust pillar is not disappearing. It is evolving. Backlinks remain useful, but brand mentions, citation context, and third-party sources matter more in answer engines.

### Pillar 4: Distribution

Goal: avoid depending only on your site.

Answer engines rely on the broader ecosystem. You therefore need to appear where citations appear:

- YouTube for demonstrations, tutorials, comparisons, and niche B2B topics;
- Reddit and forums for authentic questions and field feedback;
- LinkedIn for expert authority, especially in B2B;
- specialist media for comparisons and analysis;
- marketplaces, reviews, and directories for local, commerce, and software categories;
- help centers and documentation for long, specific questions;
- podcasts and newsletters to connect people, expertise, and categories.

Distribution is not an afterthought. It is part of content design.

### Pillar 5: Measurement

Goal: know what actually works.

Rankings and traffic are no longer enough. Track:

- Search Console impressions and clicks;
- organic conversions;
- pages that generate leads or sales;
- brand and non-brand queries;
- presence in AI Overviews;
- visible citations;
- brand mentions;
- answer sentiment or framing;
- competitor presence;
- sources that cite competitors but not you.

AEO tracking is imperfect because answers vary by platform, phrasing, and session. Think in samples and trends, not absolute truth.

## 6. Intent Research and Topic Selection

### Start With the Business Role of the Page

Before searching for a keyword, define the role:

- acquisition: attract people who do not know the brand;
- conversion: help a prospect choose;
- retention: help an existing customer;
- proof: strengthen trust;
- protection: control brand results;
- AEO support: answer long questions that may be asked to an LLM.

A page without a role often becomes interchangeable content.

### Brand SEO and Non-Brand SEO

Non-brand SEO helps people discover you when they do not know you. Examples:

- `freelance invoicing software`;
- `b2b seo agency`;
- `how to choose a crm`;
- `best meeting transcription tool`.

Brand SEO protects and converts people who already know you. Examples:

- `[brand] reviews`;
- `[brand] pricing`;
- `[brand] alternative`;
- `[brand] vs [competitor]`;
- `[brand] issue`;
- common misspellings of the brand name.

Do not force the two together. A non-brand article can mention your solution if useful, but it should not become a sales page. A brand page can be much more proof-, review-, comparison-, or conversion-oriented.

### "Favorite" Keywords

A good strategy does not need to target 500 keywords at first. Identify 5 to 20 keywords or questions with direct business impact:

- clear intent;
- connection to the offer;
- conversion potential;
- competitive feasibility;
- ability to provide a better answer;
- AEO potential or AI Overview presence;
- competitors present in answers.

These topics should be monitored more often than the rest.

### Turn Keywords Into Questions

AEO amplifies long questions. For each target keyword, list:

- the main question;
- clarification questions;
- objections;
- comparisons;
- use cases;
- decision criteria;
- common mistakes;
- alternatives;
- post-purchase or support questions.

Question sources:

- Search Console;
- People Also Ask;
- related searches;
- sales and prospect calls;
- customer support;
- website chat;
- customer reviews;
- Reddit, forums, Quora;
- YouTube comments;
- questions asked in ChatGPT/Perplexity/Gemini;
- paid search data;
- competitor keywords.

### Intent Matrix

Use this matrix before creating content:

| Intent | What the user wants | Main format | Example |
| --- | --- | --- | --- |
| Informational | Understand or learn | Guide, tutorial, definition, checklist | `how to run a seo audit` |
| Commercial | Compare and evaluate | Comparison, buying guide, use case | `best seo tool for freelancers` |
| Transactional | Buy or act | Product page, offer, landing page | `buy seo training` |
| Navigational | Find a brand/page | Brand page, login, reviews, support | `brand name reviews` |
| Local | Find a nearby solution | Local page, GBP profile, reviews | `seo consultant montpellier` |

A page may have a mixed intent, for example informational and commercial. In that case, answer the problem first, then guide the user toward options.

## 7. Content Architecture

### Think in Clusters, Not Isolated Articles

A cluster is a set of pages around a problem, category, or customer journey.

Example for a B2B solution:

- pillar page: `Complete Guide to Expense Management`;
- commercial page: `Expense Management Software`;
- comparison: `Best Expense Management Software`;
- alternative: `[Your Brand] vs [Competitor]`;
- support: `How to Export Expenses to [Accounting Tool]`;
- proof: `Case Study: Reducing Expense Processing Time`;
- FAQ: precise questions from sales and support.

For AEO, clusters help engines understand entities, use cases, proof, and relationships between topics.

### One Page = One Primary Intent

The rule is not "one page = one exact keyword." The rule is:

> A page must satisfy one primary intent and its natural follow-up questions.

Do not create 20 near-identical pages for 20 variants. Create one strong page that covers the topic, then create specific pages only when intent truly changes.

### Internal Linking

Internal linking should help three readers:

- the user who wants to continue the journey;
- Googlebot, which explores and understands structure;
- answer engines looking for relationships between entities, topics, and proof.

Best practices:

- link pages in the same cluster;
- use descriptive anchors;
- link from strong pages to strategic pages;
- add contextual links, not only automatic blocks;
- connect articles, offer pages, case studies, FAQs, and help-center content;
- avoid orphan pages.

### Help Center and Documentation

The local sources and Ethan Smith interview emphasize an often-overlooked point: the help center can become an AEO asset.

Why:

- users ask LLMs very specific questions;
- many of these questions concern features, integrations, compatibility, or use cases;
- competitors often have no page for these micro-questions;
- clear documentation can become the only usable source.

Actions:

- use a subdirectory rather than an isolated subdomain when possible;
- create internal links between support articles;
- add questions from support and sales;
- document integrations, limits, workflows, and use cases;
- keep content up to date;
- connect documentation, product pages, and case studies.

## 8. Ideal SEO/AEO Page Structure

### Basic Format

1. Clear title matching intent.
2. Short introduction that restates the problem.
3. Direct answer near the top.
4. Structured H2/H3 development.
5. Examples, data, proof, or steps.
6. Comparisons or alternatives if intent requires them.
7. Useful FAQ, not artificial FAQ.
8. CTA aligned with the level of intent.
9. Sources, author, date, and update note when relevant.

### The Direct Answer

For AEO and featured snippets, the page should provide a short, extractable answer quickly. Then it can develop.

Example:

```markdown
## What is AEO?

AEO, or Answer Engine Optimization, is the practice of optimizing content so it can be used as an answer or source by answer engines such as Google AI Overviews, ChatGPT, Perplexity, Gemini, or Copilot. It extends SEO: content must remain useful, indexable, reliable, and structured, but it must also be easy to cite.
```

The answer should not be empty. It should be concise, accurate, and usable on its own.

### Depth Sections

After the answer, go deeper:

- why it matters;
- how it works;
- when to use it;
- mistakes to avoid;
- examples;
- decision criteria;
- limits;
- next actions.

### Headings

Headings should match real questions or decisions:

- `How do you choose a project management tool?`
- `Which criteria should you compare before buying?`
- `What is the difference between Asana, Trello, and Monday?`
- `When should you choose an open-source solution?`
- `How much does a project management tool cost?`

Avoid vague marketing headings:

- `Our Innovative Vision`;
- `A Powerful Solution`;
- `A Tool for Tomorrow`.

### FAQ

An FAQ is useful when it answers real additional questions. It should not be a keyword dump.

Good FAQ questions:

- sales question;
- common objection;
- confusion point;
- comparison;
- limitation;
- price;
- timeline;
- compatibility;
- implementation.

Bad FAQ questions:

- invented questions only meant to place a keyword;
- questions whose answers repeat previous content;
- questions the user does not care about.

## 9. Editorial Quality: What Engines and Humans Look For

### The People-First Principle

Google recommends creating content to help people, not to manipulate rankings. The central question is:

> Why does this content exist?

Good reasons:

- help a user make a decision;
- explain a subject clearly;
- share experience or a method;
- solve a problem;
- document proof;
- answer a question nobody covers well.

Bad reasons:

- publishing because a tool generated a keyword list;
- filling an editorial calendar;
- producing 100 pages with little added value;
- copying competitors;
- saturating the page with keywords;
- manipulating AI systems with unverified claims.

### E-E-A-T Without Mythology

E-E-A-T means Experience, Expertise, Authoritativeness, and Trustworthiness.

Important: Google says E-E-A-T is not a single ranking factor that can be added like a tag. It is a quality-evaluation framework.

How to translate it into a page:

- show the author when expected;
- explain useful experience or credentials;
- provide proof: tests, data, screenshots, methodology;
- cite sources;
- date and update content;
- separate facts, opinions, and recommendations;
- avoid unverifiable promises;
- handle sensitive topics carefully.

### Information Gain

Content should add something others do not provide.

Possible sources of information gain:

- internal data;
- customer experience;
- real comparisons;
- observed mistakes;
- screenshots;
- methodology;
- benchmarks;
- concrete examples;
- argued opinions;
- limits and cases where your solution is not a fit.

Content that merely rewrites the top 10 results in a different tone is fragile.

### AI-Assisted, Not Fully Automated

AI is useful for:

- listing angles;
- turning keywords into questions;
- identifying objections;
- restructuring a page;
- comparing a draft against intent;
- detecting vague sections;
- challenging a promise;
- proposing titles or outlines.

AI is risky for:

- mass-producing pages without experience;
- inventing sources;
- smoothing the tone until it becomes generic;
- removing opinion;
- creating untested comparisons;
- publishing without verification.

The right question is not "Can AI write this content?" but:

> Where does this content break down for a real customer?

Use AI as a strategic sparring partner, not as a text factory.

## 10. Structured Data and Machine Readability

### What Structured Data Does

Structured data helps Google understand the type of content and can make a page eligible for some rich results.

It can cover:

- article;
- product;
- reviews;
- organization;
- person;
- local business;
- breadcrumb;
- video;
- FAQ or Q&A depending on current eligibility;
- recipe;
- event;
- software.

Google recommends JSON-LD when possible.

### What It Does Not Do

Structured data does not guarantee:

- better rankings;
- a rich result;
- a citation in AI Overview;
- a recommendation by ChatGPT.

Google also states that there is no special schema to add for AI Overviews or AI Mode.

### Practical Rules

- mark up only what is visible or consistent with the page;
- use the most specific type;
- keep data up to date;
- validate with Rich Results Test;
- check Search Console;
- do not mark fake reviews;
- do not add misleading data;
- do not block marked pages.

### For AEO

Structured data is useful, but the priorities remain:

- clear text content;
- logical structure;
- unambiguous named entities;
- sources and proof;
- internal linking;
- external mentions.

## 11. Authority, Mentions, and External Citations

### Backlinks: Still Useful, But Not Any Backlinks

Backlinks remain a trust signal. But raw quantity matters less than:

- relevance of the source site;
- context of the mention;
- editorial quality;
- site traffic and audience;
- natural diversity;
- credible acquisition pace;
- absence of spammy networks.

Avoid:

- mass link buying without relevance;
- over-optimized anchors;
- weak site networks;
- links from generic content;
- aggressive campaigns that can hurt long term.

### Unlinked Mentions

Answer engines can use text that mentions a brand without a direct link. Mentions help associate:

- brand;
- category;
- problem;
- audience;
- differentiators;
- sentiment;
- proof.

Useful examples:

- a media article that lists your brand among solutions;
- a detailed customer review;
- a forum discussion;
- a third-party comparison;
- a podcast appearance;
- a LinkedIn post that is referenced or discussed;
- a partner page.

### Citation Strategy by Channel

| Channel | AEO Role | Good Practice |
| --- | --- | --- |
| Own site | Official source | Clear pages, proof, schema, FAQ, case studies |
| YouTube | Video source and demonstration | Videos on niche questions, descriptive titles, transcript |
| Reddit/forums | Community proof | Respond as a real, transparent, useful human |
| Media | Third-party authority | Data, expert comments, studies, journalist-friendly angles |
| Reviews | Social proof | Ask for detailed reviews, respond, fix issues |
| Comparisons | Commercial decision support | Appear in relevant lists and alternatives |
| Help center | Functional long tail | Answer integration, limit, and workflow questions |
| LinkedIn | Person/brand authority | Publish reliable ideas that can be reused elsewhere |

### Reddit and Forums: The Red Line

What works:

- a real account;
- transparent affiliation;
- useful answer;
- concrete context;
- no forcing;
- regular participation.

What destroys trust:

- fake accounts;
- spam;
- self-upvotes;
- generic comments;
- hiding commercial interest;
- repeating the same message.

The goal is not to manipulate a community. The goal is to be a useful source where the questions already exist.

## 12. Multimodal Content

The local sources emphasize YouTube, LinkedIn, podcasts, video, and audio. External studies confirm that SERPs with AI Overviews can coexist with videos, forums, People Also Ask, and other modules.

### When to Produce a Video

Video is relevant when:

- the topic is best demonstrated visually;
- the query already shows videos;
- competitors have no good video;
- the B2B topic is niche but high value;
- the video can be transcribed and reused;
- the expert or founder can carry the topic well.

### SEO/AEO Video Format

- descriptive title;
- introduction that answers quickly;
- chapters;
- transcript;
- description with links;
- clear mention of the brand, topic, and use cases;
- dedicated site page with summary, embedded video, and text.

### LinkedIn and Personal Authority

LinkedIn is not a substitute for the site, but it can strengthen:

- recognition of an expert;
- the link between a person and a category;
- idea distribution;
- mentions and reuse;
- B2B brand signals.

Publishing on LinkedIn should fit the same system:

- topics aligned with clusters;
- customer examples;
- argued opinions;
- links to guides or resources;
- reuse as article, video, newsletter, or page.

## 13. SEO/AEO Measurement

### Classic SEO KPIs

Track:

- Search Console impressions;
- organic clicks;
- CTR;
- average position, with caution;
- indexed pages;
- indexing errors;
- Core Web Vitals;
- pages gaining or losing visibility;
- organic conversions;
- brand and non-brand queries;
- backlinks and referring domains;
- revenue or leads from SEO.

### AEO KPIs

Track:

- presence in AI Overviews;
- citations of your domain;
- brand mentions in answers;
- sentiment of the answer;
- cited competitors;
- cited sources;
- share of voice by question;
- presence in ChatGPT, Perplexity, Gemini, Copilot;
- referral traffic from AI engines when available;
- increase in direct or branded search after answer visibility;
- conversions or "how did you hear about us?" declarations.

### Why AEO Measurement Is Difficult

Answers vary depending on:

- phrasing;
- language;
- location;
- user account;
- history;
- platform;
- time;
- available sources;
- model variance.

Measure with samples:

- 50 to 200 strategic questions;
- close variants;
- multiple platforms;
- repeated over time;
- comparison against competitors;
- test and control groups.

### Experimentation

Recommended approach:

1. Select 100 to 200 questions.
2. Measure the baseline for 2 to 4 weeks.
3. Split into a test group and a control group.
4. Intervene only on the test group.
5. Possible intervention: optimize a page, create a video, answer in a forum, earn a media mention, enrich the help center.
6. Measure after 2 to 6 weeks.
7. Compare test vs. control.
8. Repeat what works.

Do not draw conclusions from a single before/after. The channel is too volatile.

## 14. Playbook: Create SEO/AEO Content

### Step 1: Define the Objective

Answer before producing:

- which audience?
- which problem?
- which intent?
- which journey stage?
- which business result?
- which expected action?
- what risk if the page is absent?

### Step 2: Analyze SERP and AI Answers

Check:

- Google top 10;
- AI Overview if present;
- People Also Ask;
- featured snippet;
- videos;
- images;
- forums;
- cited competitors;
- recurring page types;
- recurring third-party sources;
- questions asked in ChatGPT/Perplexity/Gemini.

Note what others cover and what they miss.

### Step 3: Build the Brief

The brief should include:

- primary intent;
- secondary questions;
- distinctive angle;
- target audience;
- knowledge level;
- proof to provide;
- sources to cite;
- CTA;
- internal linking;
- expected format;
- possible schema;
- update date.

### Step 4: Write the Answer

Rules:

- start with what is useful;
- avoid weak introductions;
- give a clear answer;
- develop nuance;
- add examples and proof;
- state limitations;
- make the text scannable;
- do not dilute intent.

### Step 5: Make Content Referenceable

Add:

- short definition;
- step-by-step method;
- comparison table;
- checklist;
- sourced figures;
- explanatory schema or diagram;
- named examples;
- identified author;
- date;
- internal and external links;
- video or visual version if useful.

### Step 6: Publish and Distribute

Minimum distribution:

- verify indexing;
- add to sitemap if needed;
- link from parent pages;
- share on LinkedIn/newsletter;
- reuse as video or carousel if relevant;
- outreach to cited sources or partners;
- useful answer in forums if discussions exist.

### Step 7: Measure and Update

After publication:

- verify indexing;
- track impressions/clicks;
- review emerging queries;
- adjust title and intro if needed;
- enrich FAQ with real questions;
- monitor AI Overview and citations;
- update when the topic changes.

## 15. Playbook: 30-Day SEO/AEO Audit

### Week 1: Baseline Audit

- Install or verify Search Console.
- Identify indexed and non-indexed pages.
- Record technical errors.
- Check robots.txt, noindex, canonical.
- Evaluate mobile and speed.
- List the 20 most important pages.
- List the 20 business-critical queries.
- Separate brand vs. non-brand traffic.

### Week 2: Research and Prioritization

- Map intents.
- Identify priority keywords and questions.
- Turn keywords into AEO questions.
- Check AI Overviews, PAA, snippets, videos, forums.
- Identify visible competitors.
- Identify recurring third-party sources.
- Choose 5 to 10 priority opportunities.

### Week 3: Content Optimization

- Optimize 3 to 5 existing pages.
- Add direct answers.
- Fix intent and structure.
- Strengthen proof and examples.
- Add internal linking.
- Create 1 to 3 new pages for critical gaps.
- Add or fix structured data when relevant.

### Week 4: Authority, Distribution, Measurement

- Set up manual or tool-based AEO tracking.
- Identify missing mentions.
- Contact relevant media, partners, or comparison sources.
- Create a video or external asset for a strategic question.
- Respond to 3 to 5 useful discussions if context exists.
- Create a monthly KPI table.
- Schedule the next review.

## 16. Playbook: Protect Brand SEO

Goal: when someone searches for your brand, they should find accurate, reassuring, and useful results.

### Queries to Monitor

- `[brand] reviews`
- `[brand] pricing`
- `[brand] alternative`
- `[brand] vs [competitor]`
- `[brand] problem`
- `[brand] scam`
- `[brand] contact`
- `[brand] login`
- frequent misspellings

### Pages to Create When Needed

- review and testimonial page;
- pricing page;
- transparent comparison page;
- alternatives page;
- case studies;
- contact/support page;
- security/compliance page;
- brand page covering common misspellings if they truly exist.

### Rule

Do not wait for a competitor or negative review to occupy the space. Brand SEO is insurance.

## 17. Playbook: AEO for B2B SaaS

### Priorities

1. Use-case pages.
2. Comparisons.
3. Alternatives.
4. Integrations.
5. Help center.
6. Case studies.
7. Mentions in media and third-party comparisons.
8. Videos on niche questions.
9. Reddit/forums if the category is active there.

### Question Types

- Which tool does X for Y?
- Does [tool] integrate with [tool]?
- What is an alternative to [competitor]?
- Which software for [specific use case]?
- Which tool should I choose between [A] and [B]?
- How do I solve [problem] with [constraint]?

### Measurement

In B2B, direct or branded traffic may increase without clear attribution. Add a post-conversion question:

> How did you hear about us?

Offer options including:

- Google;
- ChatGPT or another AI tool;
- LinkedIn;
- YouTube;
- recommendation;
- media/comparison;
- other.

## 18. Playbook: E-Commerce and Local

### E-Commerce

Priorities:

- clean product data;
- reviews;
- price and availability;
- Product schema when relevant;
- quality images;
- buying guides;
- comparisons;
- product FAQ;
- useful category pages;
- post-purchase content.

AI interfaces and shopping modules are becoming more clickable. For commerce, structured data, reviews, images, and product feeds are more critical than in pure B2B.

### Local

Priorities:

- up-to-date Google Business Profile;
- consistent NAP: name, address, phone;
- local reviews;
- local pages;
- LocalBusiness schema when relevant;
- recent photos;
- local FAQ;
- presence in directories and local media;
- content that answers local needs.

## 19. Common Mistakes

### Saying "SEO Is Dead"

False and dangerous. SEO remains the eligibility and comprehension foundation. Answer engines still use the web, indexes, sources, and trust signals.

### Producing More Instead of Better

Mass generic content is risky. Google warns that generating many pages without added value can violate spam policies.

### Confusing Schema With Strategy

Structured data helps, but it does not replace intent, quality, proof, and authority.

### Optimizing for AI Against the User

If a page is designed to manipulate a machine while disappointing a human, it is fragile. Systems aim to reward useful, reliable, satisfying content.

### Measuring Only Traffic

With AEO, part of the value may appear as:

- brand presence;
- brand search;
- direct traffic;
- assisted conversions;
- mentions;
- citations;
- increased trust.

### Buying Links Without Strategy

An artificial link campaign can hurt trust. Links should be relevant, progressive, and defensible.

### Forgetting Existing Pages

Optimizing and maintaining existing pages is often more profitable than publishing endlessly.

## 20. Checklists

### Before Creating a Page

- [ ] Clear business objective.
- [ ] Defined audience.
- [ ] Primary intent identified.
- [ ] SERP analyzed.
- [ ] AI Overview or answer engines tested.
- [ ] Follow-up questions listed.
- [ ] Distinctive angle defined.
- [ ] Proof available.
- [ ] CTA adapted.
- [ ] Internal pages to link identified.

### Writing Checklist

- [ ] Direct answer in the first paragraphs.
- [ ] Headings aligned with real questions.
- [ ] One main topic.
- [ ] Concrete examples.
- [ ] Data or sources when needed.
- [ ] Original point of view or experience.
- [ ] Comparison if intent requires it.
- [ ] Useful FAQ.
- [ ] Author or brand clearly identifiable.
- [ ] No keyword stuffing.
- [ ] No unverified AI content.

### Technical Checklist

- [ ] Page accessible without login.
- [ ] HTTP 200.
- [ ] No accidental `noindex`.
- [ ] Not blocked by robots.txt.
- [ ] Correct canonical.
- [ ] Clean title and meta description.
- [ ] Readable headings.
- [ ] Main content in indexable text.
- [ ] Compressed images and useful alt text.
- [ ] Internal links present.
- [ ] Valid structured data if used.
- [ ] Usable on mobile.
- [ ] Acceptable performance.

### AEO Checklist

- [ ] Extractable short definition.
- [ ] Clear answer to the main question.
- [ ] Follow-up questions covered.
- [ ] Table, list, or steps when useful.
- [ ] Sources cited.
- [ ] Original data or proof.
- [ ] Important entities explicitly mentioned.
- [ ] Page connected to its cluster.
- [ ] Video or visual if the SERP suggests it.
- [ ] External presence opportunity identified.
- [ ] Question tracking in place.

### Monthly Checklist

- [ ] Check Search Console.
- [ ] Review priority pages.
- [ ] Monitor brand keywords.
- [ ] Update time-sensitive content.
- [ ] Add questions from sales/support.
- [ ] Monitor new mentions.
- [ ] Identify competitors cited in AI answers.
- [ ] Plan an authority action.
- [ ] Test 20 to 50 AEO questions.
- [ ] Document what improves or declines.

## 21. Templates

### SEO/AEO Content Brief

```markdown
# SEO/AEO Brief

## Objective
- Business role:
- Audience:
- Funnel stage:
- CTA:

## Intent
- Primary intent:
- Secondary intents:
- Main question:
- Follow-up questions:

## Research
- Top competitors:
- AI Overview present?:
- Cited sources:
- People Also Ask:
- Videos/forums/images present?:

## Angle
- What others already say:
- What we add:
- Available proof:
- Internal data:
- Examples:

## Structure
- H1:
- Direct answer:
- H2/H3:
- FAQ:
- Possible schema:

## Distribution
- Internal links:
- External channels:
- Mention opportunities:

## Measurement
- SEO KPIs:
- AEO KPIs:
- Review date:
```

### Direct Answer Format

```markdown
## [Main question]

[Short answer in 40 to 80 words: definition, decision, or method.]

In practice, this means:

- [point 1]
- [point 2]
- [point 3]

Important nuance: [limit or special case].
```

### Prioritization Table

| Topic | Intent | Business value | Difficulty | AI presence | Proof available | Priority |
| --- | --- | --- | --- | --- | --- | --- |
| | | High/Medium/Low | High/Medium/Low | Yes/No | Yes/No | P1/P2/P3 |

## 22. Principles for a Future Skill

If this document becomes a skill, its essential instructions should be:

- Always start with intent, audience, and business role.
- Never produce content only from a keyword.
- Check the SERP, questions, competitors, and cited sources.
- Write for the user first, then structure for engines.
- Produce a direct answer, then useful depth.
- Add experience, proof, examples, and sources.
- Avoid generic AI content, unverified claims, and hollow lists.
- Think about distribution and external citations from the start.
- Include brand SEO and non-brand SEO.
- Measure SEO and AEO with separate indicators.
- Treat AEO figures as moving and time-bound.
- Prefer experimentation over belief in a "best practice."

## 23. Quick Reference

### If You Have One Hour

1. Choose an important business page.
2. Check intent in Google.
3. Test the question in ChatGPT, Perplexity, and Gemini.
4. Add a direct answer at the top.
5. Reorganize H2s around real questions.
6. Add proof, examples, and useful FAQ.
7. Link the page from 2 to 5 internal pages.
8. Verify indexing and tracking.

### If You Have One Day

1. Audit the 10 priority pages.
2. Identify missed intents.
3. Map AEO questions.
4. Optimize 3 existing pages.
5. Create 1 missing resource.
6. Identify 10 third-party sources where competitors appear.
7. Set up a tracking table.

### If You Have One Month

Follow the 30-day playbook:

- audit;
- prioritization;
- optimization;
- creation;
- distribution;
- tracking;
- experimentation.

## 24. Conclusion

The best SEO/AEO content is not the content that checks the most technical boxes. It is the content that becomes the best available source for a given question.

In 2026, the winning strategy is sober:

- understand intent better;
- answer more clearly;
- bring more proof;
- structure more cleanly;
- distribute more intelligently;
- measure more broadly;
- maintain more regularly.

SEO remains the foundation. AEO adds one requirement: become referenceable.
