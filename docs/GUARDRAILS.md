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
- Index: **`https://www.no-ai-act.eu/sitemap.xml`** · Children: **`/sitemap-it.xml`**, **`/sitemap-en.xml`** · Robots: **`https://www.no-ai-act.eu/robots.txt`**
- **`/sitemap.xml` is a sitemap *index*** (a Search Console compatibility structure — some setups read an index more reliably than a large flat `urlset`). It starts **exactly** with `<?xml version="1.0" encoding="UTF-8"?>`, has a `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` root, and lists the two language children (each with a `<lastmod>`):
  - `https://www.no-ai-act.eu/sitemap-it.xml` — the root `/` + all Italian pages
  - `https://www.no-ai-act.eu/sitemap-en.xml` — the `/en/` pages
- The child sitemaps are the `<urlset>`s. `tests/sitemapGscReadiness.test.ts` enforces (build-independent, from source): valid, well-formed XML with the `0.9` namespace; the **combined children are exactly the 42** absolute-HTTPS canonical public URLs — all on the **`https://www.no-ai-act.eu/` www host**, never `http://`, never the apex `https://no-ai-act.eu/`, no localhost / `github.io` / `.pages.dev`, no query strings, hashes, duplicates (within or across children), assets, or `/play/` — split by language with no overlap, every URL mapping to a real page whose **self-canonical equals the sitemap URL**; `robots.txt` advertises **exactly one** sitemap — the index — never the stale `http://`/apex variant nor a direct child.
- **Live check after deploy** (opt-in — needs external egress, so it is not in CI):
  - `node scripts/seo/check-sitemap-live.mjs`
  - `node scripts/seo/check-sitemap-live.mjs https://www.no-ai-act.eu`
  It detects whether `/sitemap.xml` is a `sitemapindex` or a `urlset`, **fetches the child sitemaps** when it is an index, and prints a diagnostic block — HTTP status, final URL, content-type, **root type**, XML-declaration presence, **child-sitemap count**, **total URL count across children**, any `http://` / non-www / query / `/play/` URLs, whether a **Googlebot-like user-agent gets the same XML** (bot-challenge detector), and HTML / Cloudflare-challenge / GitHub-404 detection — then checks `/robots.txt` (200 + the exact HTTPS www index directive, no stale `http://` variant, exactly one directive) and samples page URLs (200, not `noindex`, self-canonical).

### Post-deploy owner checklist
1. GitHub Pages deploy is green.
2. Cloudflare → **Purge Everything**.
3. Open `https://www.no-ai-act.eu/sitemap.xml`, `/sitemap-it.xml` and `/sitemap-en.xml` in a browser (each should render XML, no login).
4. Run `node scripts/seo/check-sitemap-live.mjs` → **PASS**.
5. Submit the sitemap in Google Search Console (see the Domain-property note below).
6. If GSC says **"Couldn't fetch" / "Impossibile recuperare"**, wait and retry *after* the live script passes.

### Google Search Console — Domain property (`no-ai-act.eu`)
The active property is the **Domain property** `sc-domain:no-ai-act.eu`, which covers every scheme/subdomain. Submit **only the index**:

> `https://www.no-ai-act.eu/sitemap.xml`

Google discovers `/sitemap-it.xml` and `/sitemap-en.xml` from the index — **do not submit the child sitemaps manually** unless you are debugging a specific child. **Delete any stale/duplicate submissions**, e.g. `http://www.no-ai-act.eu/sitemap.xml` or `https://no-ai-act.eu/...`. Do **not** keep submitting HTTP + HTTPS (or www + apex) variants — duplicate submissions do not help fetching and just create noise.

### If Search Console still says "Impossibile recuperare" while the sitemap opens as XML
The files themselves are fine (200, real XML, correct namespace, 42 canonical URLs across the two children) — the fetch is being blocked or cached upstream. Work the deploy path, not the files:
- Open `/sitemap.xml`, `/sitemap-it.xml`, `/sitemap-en.xml` in the browser — all three should render as XML.
- Run `node scripts/seo/check-sitemap-live.mjs https://www.no-ai-act.eu` → **PASS**.
- **Purge Cloudflare** (Purge Everything) so a stale/error response isn't cached.
- Check **Cloudflare → Security → Events** for `/sitemap.xml` (and the children) — confirm Googlebot is **not** being challenged or blocked (Bot Fight Mode / a WAF rule / a managed challenge can trigger "Couldn't fetch").
- Confirm a Googlebot-like fetch returns the XML (the live script's *"Googlebot same XML"* line).
- **Wait 24–72 hours and retry** — GSC re-fetches on its own schedule; "Couldn't fetch" often clears on its own.
- **Do not** keep re-submitting duplicate HTTP/HTTPS or www/apex variants.

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
