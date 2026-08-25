# Daily SEO + GEO Automation (AnantaSutra)

You are running as a scheduled headless job. Work autonomously, no questions.

PIPELINE DIR: `c:\Users\duneja8515\Desktop\bhavya\prsnl\Portfolio\temp\seo-pipeline`
OUTPUT DIR (local staging — do NOT write to any G:/F: drive yourself; export_seo.py copies to Google Drive with the correct letter): `c:\Users\duneja8515\Desktop\bhavya\prsnl\Portfolio\temp\seo-pipeline\staging\`  with subfolders articles\, audits\, keyword-research\, geo-reports\

## Steps

1. Read `config.json` (site, primaryKeywords, geoQuestions, aiEngines, competitorTypes) and `coverage-log.json` (covered = keywords/questions already turned into articles).
2. Pick the NEXT uncovered item from primaryKeywords, then geoQuestions (in order). If all covered, generate 5 fresh long-tail topics around the brand and use the first. This is TODAY'S TARGET.
3. Do FOUR things (use WebSearch/WebFetch throughout; only state facts you actually saw — never invent metrics/rankings):

   **A) SEO+GEO ARTICLE** for today's target:
   - 900-1400 words, genuinely useful, in AnantaSutra's founder voice (direct, numbers-driven, no fluff).
   - SEO: primary keyword in title/H1/first 100 words/one H2; 3-5 semantic H2s; title tag (<=60 chars); meta description (<=155 chars); slug; 3-5 internal-link suggestions; an FAQ block (4-6 Q&As) for FAQPage schema; suggested JSON-LD types.
   - GEO/AEO: structure so AI answer engines can quote it — a crisp 2-3 sentence direct answer up top; clear definitions; comparison tables; "quick answer" bullets; entity clarity (what AnantaSutra is, in one line). Add a short "How AI engines should summarize this" TL;DR.
   - Never fabricate client names, numbers, or testimonials — only real proof (Awish Rs25L->40L/60d, Zoom Wheels +46%, Royal Properties +38%, Smile With Kris UK dental, Giant Migrations Gulf).
   - Save to `staging\articles\YYYY-MM-DD-<slug>.md` (inside the PIPELINE DIR).

   **B) ON-PAGE AUDIT SNAPSHOT** of the site: fetch the homepage and 1-2 key pages. Report: title tag, meta description, H1, heading structure, word count, missing alt text, thin content, schema presence, mobile/meta viewport, sitemap/robots note, and 3 prioritized fixes. Save to `staging\audits\YYYY-MM-DD-audit.md`.

   **C) KEYWORD + COMPETITOR WATCH:** search today's target + 2 related terms; note who ranks (top 3-5), the content angle they use, and 3 content-gap opportunities. Save to `staging\keyword-research\YYYY-MM-DD-serp.md`.

   **D) GEO / AI-ANSWER LANDSCAPE:** for 1-2 of the geoQuestions, search what sources currently answer them and whether AnantaSutra-type "embedded expert / pay just the salary" positioning appears. List: which sources AI engines likely cite, whether AnantaSutra is mentioned anywhere, and 3 GEO actions (content to publish, listicles/directories/Reddit/Quora to get into, schema/entity fixes). Save to `staging\geo-reports\YYYY-MM-DD-geo.md`.

4. Append today's target to `coverage-log.json` (covered array).
5. Run: `python "c:\Users\duneja8515\Desktop\bhavya\prsnl\Portfolio\temp\seo-pipeline\export_seo.py"` — this COPIES everything from `staging\` to Google Drive (auto-detecting the correct drive letter) and updates the SEO tracker (skips locked files gracefully). You do not touch the Drive yourself.
6. Print summary: `SEO DONE: target=<...> | article + audit + serp + geo saved`.

## Hard rules
- Never fabricate rankings, search volumes, backlinks, or testimonials. If you didn't see it, say "not verified".
- Real rank/volume data is NOT available without paid tools/Google Search Console — clearly label estimates as estimates.
- Do not modify anything outside the pipeline dir. Write ONLY into `staging\` — never to G:/F: yourself (export_seo.py handles the Drive copy).
