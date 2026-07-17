# Deployment — GitHub Pages

The site is a static Vite multi-page build deployed to GitHub Pages by
`.github/workflows/deploy.yml`, fronted by Cloudflare at
`https://www.no-ai-act.eu/`.

## Normal deploy path
1. Merge to `main` (or run the workflow manually via **Actions → Deploy su GitHub Pages → Run workflow**).
2. The **build** job runs, on the Node version pinned in `.nvmrc`:
   `npm ci` → `npm run typecheck` → `npm test` → `npm run build` →
   `npm run verify:dist` → `actions/configure-pages` → `actions/upload-pages-artifact` (path `dist`).
3. The **deploy** job (`needs: build`, skipped on PRs) runs
   `actions/deploy-pages@v4` and publishes to the `github-pages` environment.
4. Pull requests run the **build** job only (build + test, no deploy) so
   regressions are caught before merge.

Permissions are `contents: read`, `pages: write`, `id-token: write`.
Concurrency: production deploys share a single **non-cancellable** `pages`
group (never cancel an in-progress deploy); PR builds use a per-branch
cancellable group so they don't block a deploy or pile up.

## Verify a successful deploy
- The workflow run is green (both **build** and **deploy** jobs).
- `verify:dist` printed **PASS** (all deploy-critical files, 48 sitemap URLs, mojibake-free HTML).
- After a Cloudflare **Purge Everything**, spot-check the live site:
  - `https://www.no-ai-act.eu/` and `/en/` render, no `Ã`/`—`-mojibake in the text.
  - `https://www.no-ai-act.eu/robots.txt`, `/sitemap-it.xml`, `/sitemap-en.xml` load.
  - Optional: `node scripts/seo/check-sitemap-live.mjs https://www.no-ai-act.eu` → PASS.

## If a deploy fails — build failure vs Pages infra failure
Open the failed run and look at **which job/step** failed. There are two very
different failure modes:

### A. Build failure (deterministic — the pipeline is doing its job)
The **build** job fails at `npm run typecheck`, `npm test`, `npm run build`, or
`verify:dist`, and the **deploy** job is **skipped**. Reruns will keep failing.
- This is a **code/content problem**, not a Pages problem — the pipeline
  correctly refused to ship a broken build.
- Fix: reproduce locally from a clean checkout and make it green, then push:
  ```
  rm -rf node_modules dist
  npm ci
  npm run typecheck
  npm test
  npm run build
  npm run verify:dist
  ```
  Common cause seen in practice: **mojibake** (double-encoded UTF-8 / botched
  em-dashes) that breaks JSON-LD — caught by `tests/encoding.test.ts` and
  `verify:dist`. Fix the encoding; do not weaken the tests.
- **Do NOT** "rerun failed jobs" for a build failure — it will fail again.

### B. GitHub Pages infrastructure failure (transient)
The **build** job is fully **green** (tests + build + `verify:dist` passed, the
artifact uploaded), and the **deploy** job fails at **`actions/deploy-pages@v4`**
— typically `Deployment failed, try again later.` This is a **transient GitHub
Pages infrastructure** issue, not a code problem.
- **Do NOT change code.** The artifact is valid; the content that would ship is
  identical.
- Owner action: **Actions → the failed run → "Re-run failed jobs"** (re-runs
  only the deploy job, reusing the built artifact). It almost always succeeds on
  the second attempt.
- Note: re-running from an integration/bot may return
  `403 "Resource not accessible by integration"` — this rerun is an **owner
  one-click** action in the GitHub UI.
- If a re-run still fails, wait a few minutes and try again, or push a trivial
  no-op commit to `main` to trigger a fresh run. Check the
  [GitHub status page](https://www.githubstatus.com/) for a Pages incident.

## Traffic spikes
For launch-day checks, what to monitor and what NOT to change during a
traffic spike, see `docs/TRAFFIC_READINESS.md`.

## Deploy-critical files (verified by `verify:dist`)
`dist/index.html`, `dist/en/index.html`, `dist/play/index.html`,
`dist/robots.txt`, `dist/sitemap.xml`, `dist/sitemap-it.xml`,
`dist/sitemap-en.xml`. The verifier also asserts the two child sitemaps total
**48** URLs, robots advertises both child sitemaps, `/play/` keeps its
`noindex`, and **no shipped HTML contains mojibake**.

## When NOT to change code
- The **build** job is green but **deploy-pages** failed → transient infra;
  re-run the deploy job, don't touch code.
- The site already serves the intended content (a previous deploy is live and
  the new commit changed nothing that ships) → a failed run is cosmetic.

## Production sync checklist (owner — run after any content-visible merge)
The build sandbox cannot reach production, so live verification is always an
owner action. In order:
1. **Confirm the deployed commit**: Actions → latest "Deploy su GitHub Pages"
   run on `main` → both jobs green → the run's `head_sha` equals the merge SHA.
2. **Cloudflare → Purge Everything** (HTML is un-hashed; without a purge the
   CDN keeps serving the previous copy).
3. **Live recheck** (browser or `curl`) on `/`, `/en/`, `/play/?lang=it`,
   `/play/?lang=en`, `/robots.txt`, `/sitemap-it.xml`, `/sitemap-en.xml`:
   - no `tally.so`, no `data-tally`, no form IDs (`44ENVA`, `5BryXb`,
     `dWgB5y`, `ZjWp9A`);
   - no "Partecipa al playtest" / "Join the playtest" strings or anchors;
   - privacy claims consistent (no external forms, nothing leaves the browser);
   - robots lists only `sitemap-it.xml` + `sitemap-en.xml`; `/play/` stays
     `noindex, follow`.
4. Optional: `node scripts/seo/check-sitemap-live.mjs https://www.no-ai-act.eu`
   → PASS.
If the live site still shows removed content while `dist/` is clean, that is a
**stale CDN cache**, not a source problem — purge again; do not change code.
