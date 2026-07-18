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

## 2. GitHub release (5 min)
The `v2.0.0` tag is pushed. On GitHub → Releases → "Draft a new release" →
choose tag `v2.0.0` → title "NO AI ACT v2.0.0" → paste
`docs/RELEASE_NOTES_v2.0.0.md` → publish.
(`release.config.json` and llms.txt already point at this tag.)

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
