# Search Console runbook (owner)

Operational playbook for Google Search Console (GSC) on the
`https://www.no-ai-act.eu/` property. **Everything in this file is a manual
owner action performed in the GSC UI** — the repository has no Search Console
API access and nothing here is automated. This project never pretends to have
inspected Search Console: findings must come from the owner's own console.

Reconcile every check against the committed route inventory
`docs/SEO_ROUTE_INVENTORY.csv` (regenerate any time with
`npm run audit:seo -- --write`; the same audit runs in CI and fails the build
on critical indexability defects, so the repo side is always clean at merge).

## 0. Property verification check
- GSC → Settings → Ownership verification: the `www.no-ai-act.eu` property (or
  the `no-ai-act.eu` domain property) must show **Verified**.
- If verification ever breaks (DNS record removed, HTML token dropped),
  re-verify before trusting any other report — unverified properties stop
  collecting some data.

## 1. Submitted sitemap check (monthly, and after every content release)
- GSC → Sitemaps: exactly two submissions —
  `https://www.no-ai-act.eu/sitemap-it.xml` and
  `https://www.no-ai-act.eu/sitemap-en.xml` (robots.txt advertises these two).
- Expected: Status **Success**, discovered URLs = **22 (IT)** and **26 (EN)**
  — cross-check the exact number against `docs/SEO_ROUTE_INVENTORY.csv`,
  which is the source of truth after each release.
- `sitemap.xml` (the index) may additionally be submitted but is optional; do
  not submit any other file.

## 2. Page-indexing report workflow (monthly)
- GSC → Indexing → Pages. Compare "Indexed" against the inventory CSV.
- For every "Why pages aren't indexed" bucket, act per the workflows below and
  log one record per issue (template in §12).
- Expected non-indexed entries: `/play/` (**noindex is intentional** — never
  "fix" it) and any URL not in the inventory (should not exist; if it appears,
  find who links it).

## 3. URL Inspection workflow (per URL)
1. Paste the exact canonical URL (trailing slash, `https://www`).
2. Check: "URL is on Google" / coverage state; **User-declared canonical** ==
  **Google-selected canonical** == the URL itself; last crawl date.
3. After a deliberate content update: **Request indexing** — only for new or
  materially updated public pages, never for `/play/`.

## 4. Canonical mismatch workflow ("Duplicate, Google chose different canonical")
- Verify the page's `<link rel="canonical">` in view-source equals the sitemap
  URL (CI guarantees this at merge; a live mismatch usually means stale CDN
  cache → Cloudflare Purge Everything, recheck).
- Check no other URL serves identical content (http→https, apex→www, with and
  without trailing slash must all redirect to the canonical form — test with
  `curl -I`).
- After fixing, request indexing and re-inspect in 1–2 weeks.

## 5. "Crawled — currently not indexed" workflow
- Usually a quality/priority signal, not a technical defect.
- Confirm the page is in the sitemap, internally linked (inventory CSV inbound
  count ≥ 1) and not thin; strengthen internal links from related pages before
  touching anything else. Do not mass-request indexing.

## 6. "Discovered — currently not indexed" workflow
- Google knows the URL but hasn't crawled it: typically crawl scheduling.
- Verify the URL returns 200 quickly through Cloudflare, appears in the right
  sitemap, and has inbound links; then wait — recheck next month before acting.

## 7. Soft-404 workflow
- Inspect the URL: if it renders real content, the usual causes are a stale
  CDN error page or an unusually thin render. Purge Cloudflare, verify live
  HTML, request indexing.
- If the URL should not exist, let it 404 honestly (no redirect chains to the
  home page).

## 8. Core Web Vitals workflow (monthly)
- GSC → Experience → Core Web Vitals: IT and EN URLs are grouped; the site is
  static and light (landing ≈ 9 KB gz HTML), so failures usually indicate a
  CDN or third-party regression, not content.
- Cross-check with PageSpeed Insights on `/`, `/en/`, one hub page and one
  guide page. The only third-party script allowed is the Cloudflare beacon.

## 9. Rich-results checks (after structured-data changes)
- Test `/` and `/en/` (WebSite, SoftwareApplication, FAQPage), one FAQ page,
  one glossary page (DefinedTermSet) and one breadcrumbed guide page in the
  Rich Results Test.
- Expected: no errors; FAQ rich results only where a visible FAQ exists. The
  repo forbids Review/AggregateRating/Product/Course schema — if GSC reports
  one, it is a defect; open an issue.

## 10. Monthly query and country review
- GSC → Performance → Search results, last 28 days:
  - queries table: note the top 20 by clicks and by impressions;
  - countries: expect Italy first; watch EN-market growth (IE, NL, DE, Nordics);
  - pages: compare IT vs EN top pages (see §11).
- Record clicks, impressions, CTR, average position for the totals and for the
  branded/non-branded segments (§11) in the log (§12).

## 11. Branded / non-branded segmentation and IT/EN comparison
- Branded filter: Performance → query filter matching `no ai act` (and the
  common misspelling `noaiact`). Everything else = non-branded.
- Non-branded is the SEO health signal; branded reflects outreach/PR.
- IT/EN comparison: Performance → Page filter `/en/` (EN set) vs inverse
  (IT set). Track the EN share of non-branded clicks month over month —
  the 2.0 goal is meaningful non-Italian discovery.

## 12. Record template (one per issue / per monthly review)
```
date:               2026-MM-DD
report:             (Pages | Sitemaps | CWV | Performance | Rich results)
url_or_segment:
status_in_gsc:
expected_state:     (from docs/SEO_ROUTE_INVENTORY.csv)
diagnosis:          (stale-cache | not-crawled-yet | quality | real-defect | intentional-noindex)
action_taken:       (none-wait | purge+recheck | internal-links | fix-in-repo PR#)
recheck_date:
resolved:           (yes/no, date)
```
Keep records in a private owner document (they contain no user data, but they
are operational notes, not site content).

## Boundaries
- Do not request indexing for `/play/` (noindex is by design).
- Do not add third-party SEO scripts or verification files beyond Google's own
  verification method already in use.
- Repo-side fixes always go through a PR and the `npm run audit:seo` gate.
