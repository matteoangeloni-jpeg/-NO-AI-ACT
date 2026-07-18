# v2.0.0 — owner action package

Everything below is a **manual owner action**: the build sandbox has no access
to production, Cloudflare, Search Console, Zenodo or third-party platforms.
Work top-to-bottom; each block is independent.

## 1. Verify the deployment (5 min)
1. GitHub → Actions → latest "Deploy su GitHub Pages" run on `main`: both jobs
   green; the run's commit equals the v2.0.0 merge commit.
2. Cloudflare → Caching → **Purge Everything** (HTML is un-hashed).
3. Live spot-checks (browser or curl):
   - `/` and `/en/` → footer shows **v2.0.0**, hero mentions **13 casi/cases**;
   - `/play/?lang=it` → title screen, start a game, map shows 13 locations
     (incl. "Commissariato di zona", "Ufficio sussidi") and the "Capitoli"
     button; `/play/` response still `noindex, follow`;
   - `/come-citare/`, `/en/how-to-cite/`, `/ricerca-e-metodologia/`,
     `/en/research-and-methodology/`, `/press-kit/`, `/en/press-kit/`,
     `/laboratorio-ai-act-in-classe/`, `/en/ai-act-classroom-lab/` load;
   - `/robots.txt` lists only sitemap-it.xml + sitemap-en.xml;
   - `/sitemap-it.xml` = 26 URLs, `/sitemap-en.xml` = 30 URLs.
4. Optional: `node scripts/seo/check-sitemap-live.mjs https://www.no-ai-act.eu`.

## 2. GitHub release + tag (5 min)
The automation session cannot push tags (branch-only credentials), so the tag
is an owner action. **Do NOT tag `9905338`** — that commit still contained
11/13 case-count inconsistencies. Tag the **merge commit of PR
`fix/v2-release-integrity` on `main`** (the release-integrity repair): find it
with `git log --oneline -5 origin/main` (subject starts "fix: v2 release
integrity") or from the merged PR page.
GitHub → Releases → "Draft a new release" → in "Choose a tag" type `v2.0.0`
and pick **"Create new tag: v2.0.0 on publish"**, target = that merge commit →
title "NO AI ACT v2.0.0" → paste `docs/RELEASE_NOTES_v2.0.0.md` → publish.
Afterwards, update `release.config.json` `lastTaggedRelease` to "v2.0.0" (and
the llms.txt release line) in a small PR — the repo intentionally does not
claim the tag before it exists.

## 2b. Live-production recovery (Cloudflare/origin) — REQUIRED
The GitHub Pages deploys are green, `dist/` is mechanically clean (no Tally,
no playtest strings, v2.0.0 footers), yet the public domain has been observed
serving the old v1.1.0 homepage. That combination means the problem is in the
CDN/origin path, not in the repository. Work through this list in order and
stop at the first step that fixes the live response:

1. **Purge Everything** — Cloudflare → Caching → Configuration → Purge
   Everything. Recheck `https://www.no-ai-act.eu/` in a private window.
2. **Cache Rules / Page Rules** — Caching → Cache Rules (and legacy Page
   Rules): look for any rule that sets "Cache Level: Cache Everything" or a
   long "Edge Cache TTL" on `no-ai-act.eu/*`. HTML must NOT be cached with a
   long edge TTL (the site's HTML is un-hashed). Delete or scope such rules,
   then purge again.
3. **Browser Cache TTL** — Caching → Configuration: if set high (e.g. 1
   year), returning visitors keep stale HTML locally. Set to "Respect
   Existing Headers" (GitHub Pages sends `max-age=600`).
4. **Development Mode** — toggle ON for 3 hours while diagnosing: it bypasses
   the edge cache entirely. If Development Mode shows the correct site, the
   problem is confirmed to be edge caching rules.
5. **DNS / proxied hostname** — DNS tab: `www` must be a CNAME to
   `matteoangeloni-jpeg.github.io` (proxied, orange cloud) and the apex must
   redirect or CNAME-flatten to the same target. If any record points to an
   old host or a stale IP set, fix it.
6. **GitHub Pages custom domain** — repo → Settings → Pages: custom domain
   must read `www.no-ai-act.eu` with a green check and "Enforce HTTPS" on. If
   the CNAME file/custom-domain field was lost, Pages serves at
   `*.github.io` while the old copy remains at the domain — re-add it.
7. **Origin response comparison** — compare origin vs edge:
   `curl -sH "Host: www.no-ai-act.eu" https://matteoangeloni-jpeg.github.io/ | grep -o "v2\.0\.0\|v1\.1\.0\|playtest" | sort -u`
   vs the same grep against `https://www.no-ai-act.eu/`. Origin correct +
   edge stale = Cloudflare cache/rules; origin stale = Pages/DNS problem.
8. **Security Events / WAF** — Security → Events: confirm Googlebot and
   normal traffic are not being challenged or served an alternate response.
9. **Googlebot parity** — after the fix, fetch `/` and `/en/` with
   `-A "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"`
   and confirm byte-identical case counts/version with the normal-browser
   response; then use Search Console URL Inspection ("Test live URL").

Success criteria for every URL in section 1: footer v2.0.0, 13 cases, no
Tally, no playtest CTA, sitemaps 26/30, `/play/` noindex, new pages 200.

## 3. Zenodo archive + DOI (15 min, after step 2)
1. zenodo.org → log in with GitHub → GitHub integration page → flip the
   switch for `matteoangeloni-jpeg/-NO-AI-ACT`.
2. If the release predates the webhook, re-publish the release (edit → update)
   to trigger archiving. Zenodo reads `CITATION.cff` (no `.zenodo.json` by
   design — do not add one).
3. Copy the **Concept DOI** and version DOI. Then, in the repo (small PR):
   - `CITATION.cff`: add `doi:` under the version fields;
   - `/come-citare/` + `/en/how-to-cite/`: replace the "DOI not yet available"
     section with the DOI (both languages);
   - README "Come citare" section: add the DOI badge/link.

## 4. Search Console (30 min, then monthly)
Follow `docs/SEARCH_CONSOLE_RUNBOOK.md`. Immediate actions:
- Sitemaps: confirm sitemap-it.xml / sitemap-en.xml show Success with 26/30.
- URL Inspection → **Request indexing** for the 14 new/materially updated
  URLs: the 6 authority pages, the 8 topic pages (see
  `docs/SEO_ROUTE_INVENTORY.csv` for the canonical list). Do NOT request
  `/play/`.

## 5. Distribution submissions (when ready — no deadline)
Use `docs/DISTRIBUTION_SUBMISSION_PACK.md` (ready-to-paste metadata) and track
outcomes in `docs/OUTREACH_TARGETS.csv`. Recommended order: Zenodo (done in
step 3) → OER Commons → MERLOT → itch.io → Scientix → newsletters/directories.
Honesty rules in the pack apply verbatim (no effectiveness/endorsement claims).

## 6. Optional verification niceties
- LinkedIn company page in the Organization JSON-LD: confirm
  `linkedin.com/company/no-ai-act` is live, or remove it sitewide in a small PR.
- Legacy unwired pages (`about-us/`, `en/about-us/`, `en/changelog/`,
  `en/research-methodology/`, `it/*`): never built or shipped; delete in a
  cleanup PR when convenient.
- Third-party legal review of the 13 case classifications remains recommended
  before formal institutional use (tracked in the dossiers).
