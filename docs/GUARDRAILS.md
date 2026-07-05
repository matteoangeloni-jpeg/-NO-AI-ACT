# Guardrails — checks before every v1.2 feature PR

Operational contract that protects the shipped v1.1 product. Automated tests
enforce all of it; run `npm test` before opening any feature PR.

## No telemetry
- The game sends **nothing**. `src/game/` contains no `fetch` / `XMLHttpRequest`
  / `sendBeacon` / `WebSocket` / `EventSource` except the single approved,
  gated transport inside `AnalyticsSystem` — which resolves to **`off`** in
  production (`resolveProvider({ dev: false })` → `off`, and Do-Not-Track always
  forces `off`). No analytics provider env is set in the build.
- Enforced by `tests/privacyGuards.test.ts`.

## Save compatibility
- localStorage key is **`no-ai-act-save-v1`** and does not change.
- `SaveData` keeps a stable key set (`version` stays `1`).
- Loading is additive-safe: missing fields are filled from `defaultSave()`,
  unknown future fields are preserved, and an unknown `version` returns the
  defaults **without wiping storage** (no destructive migration).
- If the format ever must change: introduce a **new key** (`…-save-v2`) + an
  explicit, tested migration. Never a silent lossy rewrite.
- Enforced by `tests/saveCompat.test.ts` (and `tests/savesystem.test.ts`).

## Gameplay invariants
- Case solutions (classification, measures, responsible subject, motivation,
  relevant clues), starting indicators, per-outcome deltas, ending thresholds
  and progression constants are **pinned**.
- Changing any of them is a deliberate decision; changing a **case solution**
  additionally requires AI Act / policy review.
- Enforced by `tests/gameplayInvariants.test.ts`.

## `/play/` SEO + privacy policy
- `/play/` stays `noindex, follow`, keeps its self canonical, has social
  metadata, and is **excluded from the sitemap** (which stays at **42** public
  URLs). Enforced by `tests/privacyGuards.test.ts`, `tests/socialMeta.test.ts`,
  `tests/navigationAudit.test.ts`.

## Tally boundary
- The four Tally IDs (`44ENVA`, `5BryXb`, `dWgB5y`, `ZjWp9A`) are fixed and live
  only in `src/game/config/tally.ts`; the pre-game form is embedded only on the
  two landings. The post-game form opens on an explicit user click and carries
  no gameplay data. Do not change the IDs or widen the boundary.

## Search Console / Sitemap readiness
- Sitemap: **`https://www.no-ai-act.eu/sitemap.xml`** · Robots: **`https://www.no-ai-act.eu/robots.txt`**
- `tests/sitemapGscReadiness.test.ts` enforces (build-independent, from source): valid, well-formed XML with the `sitemaps.org/schemas/sitemap/0.9` namespace; exactly 42 absolute-HTTPS canonical public URLs (no `http://`, localhost, `github.io`, `.pages.dev`, query strings, hashes, duplicates, empty locs, assets, or `/play/`); every URL maps to a real page whose **self-canonical equals the sitemap URL**; `robots.txt` advertises the sitemap and blocks nothing.
- **Live check after deploy** (opt-in — needs external egress, so it is not in CI):
  - `node scripts/seo/check-sitemap-live.mjs`
  - `node scripts/seo/check-sitemap-live.mjs https://www.no-ai-act.eu`
  It verifies the deployed `/sitemap.xml` is 200, real XML (not a Cloudflare challenge / GitHub 404 / generic HTML), XML content-type, not redirected; `/robots.txt` is 200 with the sitemap directive; and a sample of sitemap URLs are 200, not `noindex`, self-canonical.

### Post-deploy owner checklist
1. GitHub Pages deploy is green.
2. Cloudflare → **Purge Everything**.
3. Open `https://www.no-ai-act.eu/sitemap.xml` in a browser (should render XML, no login).
4. Run `node scripts/seo/check-sitemap-live.mjs` → **PASS**.
5. Submit `sitemap.xml` in Google Search Console.
6. If GSC says **"Couldn't fetch"**, wait and retry *after* the live script passes.

### If Search Console reports "Couldn't fetch"
- The submitted path is exactly `sitemap.xml`; it opens publicly without login; HTTP 200; response is **XML, not HTML**; Cloudflare is not serving a challenge or a cached error; `robots.txt` points to the sitemap; the sitemap has only canonical public URLs, no `/play/`, no query strings, no redirects; **Cloudflare cache has been purged** after the deploy.

## Before a v1.2 feature PR — checklist
1. `npm run typecheck` — clean.
2. `npm test` — full suite green (includes all guardrails above).
3. `npm run build` — clean.
4. Serve `dist` and run the opt-in gameplay smoke:
   `npm run build && npx vite preview --port 4200` then
   `BASE=http://localhost:4200 node scripts/smoke/gameplay-smoke.mjs`
   (needs Playwright + a Chromium; set `CHROMIUM_PATH` if not bundled).
5. Confirm: no new external host, no console errors, `/play/` noindex, sitemap
   still 42, Tally IDs unchanged, no gameplay/scoring/case/ending/save changes.
