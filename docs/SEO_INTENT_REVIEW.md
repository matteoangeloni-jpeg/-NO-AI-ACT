# Multilingual search-intent review

## Scope and privacy

This first improvement pass audits all 146 public routes in six languages.
Search Console evidence was collected directly from the authorized domain
property, with equivalent final-data periods, separate query/page and property
aggregations, and URL Inspection. Performance exports and the detailed diagnostic
report remain only in ignored local `.seo-cache/`, not in this public repository.
Do not publish those private analytics without the owner's separate approval.

`SEO_CONTENT_INTENTS.csv` contains public website content only: each route's
topic, language, editorial intent, title, H1, description and main-content depth.
These focus labels are not keyword-volume estimates or promises of rankings.
The new languages have no useful post-release performance history yet.

## Changes

- All six home headings explicitly name NO AI ACT and the game category.
- IT/EN/FR introductory copy labels the fictional premise; it no longer presents
  the absence of the AI Act as an unqualified current-law headline.
- German copy naturally pairs EU AI Act with KI-Verordnung.
- FR/DE/ES/PT teacher introductions distinguish school AI uses, purposes and
  responsibilities from instructions for using the game in a classroom.
- French teacher material links to the separate educator-session resources.
- IT/EN home language labels and public machine-readable project facts now
  reflect the published game/site languages and partial translation coverage.
- All six already-public language sitemaps and the existing sitemap index were
  resubmitted through Search Console. Receipt is not a guarantee of indexing.
- No new URLs, fake search volumes, meta-keywords, bulk legal claims or
  duplicated keyword landing pages. No gameplay or telemetry changes.

## Reproduction

- `node scripts/seo/content-intents.mjs --write`: public editorial inventory.
- `node scripts/seo/capture-search-console.mjs`: read-only dated evidence capture
  to ignored local cache; requires the user's authorized Google helper setup.
- `python scripts/seo/submit-language-sitemaps.py`: validate current live XML.
  Submissions require the explicit `--submit` flag; `--include-index` also refreshes
  the existing index. This uses the Sitemap API, not the restricted Indexing API.
- Existing SEO/typecheck/build/dist gates remain enabled.
- 1,446 tests passed locally with one worker and the default test timeout.
- Browser checks cover all 39 DE/ES/PT pages at three widths, six-language home
  layouts, open menus, images, carousel and no-JavaScript navigation.

## Infrastructure candidate, not automatically deployed

The live apex `https://no-ai-act.eu/` returned 526; www returned 200. HTTP apex
redirected to HTTPS apex. The cause of any historical search trend is not
established by this observation.

`infra/canonical-redirect/` is an independently deployable, tested exact-apex
redirect candidate. It preserves path/query, targets HTTPS www, uses 301 for
GET/HEAD and 308 for other methods, and never fetches the failing origin. No
DNS, SSL mode, beta or dashboard setting is changed. Its local build passed;
external deployment requires the owner's explicit approval and live checks.

## Remaining work

- Native and specialist review, then deepen the shorter localized introductions
  where useful. The teacher additions are not complete legal-guide translations.
- Recheck new-language URL discovery and indexing after Google has had time to
  crawl; do not infer indexing from a successful publication or sitemap receipt.
- Measure real-user CWV separately. No usable PageSpeed/CrUX API key was found,
  so source checks are not represented as performance measurements.
- Assess post-release query intent over comparable periods before broad rewrites,
  redirects, merges or additional keyword-targeted pages.

## Official guidance

- Clear descriptive page headings/titles:
  https://developers.google.com/search/docs/appearance/title-link
- Search Console filtering and aggregation caveats:
  https://developers.google.com/search/blog/2022/10/performance-data-deep-dive
- Localized equivalents:
  https://developers.google.com/search/docs/specialty/international/localized-versions
- Cloudflare 526 explanation:
  https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-5xx-errors/error-526/
