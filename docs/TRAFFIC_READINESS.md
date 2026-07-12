# Traffic-spike readiness

Audit of the static production build and the serving chain
(GitHub Pages origin → Cloudflare → visitor), with the launch-day checklist.

## Architecture posture

The project is a **fully static, self-contained site**: no backend, no
database, no server-side rendering, no accounts, no third-party forms.
Everything a visitor needs is in the `dist/` artifact served by GitHub Pages
and cached by Cloudflare. This is the most spike-resilient architecture
available to the project — under load, Cloudflare serves cached copies and
the origin is barely touched.

## Build audit (v1.2 UX/privacy pass)

| Metric | Value | Assessment |
|---|---|---|
| Total `dist` size | ~6.1 MB | tiny — trivially cacheable in full |
| File count | 71 | tiny |
| Game bundle (`assets/play-*.js`) | ~1.7 MB raw, **~410 KB gzipped** | fine for a Phaser game; loaded only on `/play/` |
| IT landing `/` | **~9 KB gzipped HTML** + small hashed CSS/JS | excellent |
| `/play/` first load | 4 KB HTML + game bundle ≈ **~420 KB gzipped** | good |
| Social cards | ~180–190 KB each, only fetched by link crawlers | fine |
| Largest files | `no_ai_act_cover.png` (2 MB) + `.webp` (0.5 MB) | **not referenced by any page** — standalone press/cover asset, fetched only on direct request; not in any load path |
| Asset filenames | content-hashed (`play-DZAkr34O.js` …) | safe for immutable CDN caching |
| HTML | un-hashed (correct) | must be revalidated → purge Cloudflare after deploy |

## Third-party dependencies at runtime

- **Zero required.** The core game and every page work with no external
  request: fonts are system/monospace, the game engine is bundled, all
  content is same-origin.
- The **only** third-party script is the Cloudflare Web Analytics beacon
  (`static.cloudflareinsights.com`, `defer`, page-view only, cookie-free,
  outside gameplay). If it is slow or blocked, nothing breaks.
- **Tally was removed** (v1.2): no form scripts, embeds or links remain, so
  no external form provider can slow down, break, or rate-limit the product
  during a spike. Enforced by `tests/noExternalForms.test.ts` and by the
  external-form check inside `npm run verify:dist`.
- The game makes **no gameplay network calls** (enforced by the gameplay
  smoke's host allowlist and `tests/privacyGuards.test.ts`).

## Can the chain absorb a spike?

- **Cloudflare** fronts the domain and caches aggressively: for anonymous
  static traffic it absorbs effectively all load. A full cache of the site
  is ~6 MB — every edge PoP can hold it trivially.
- **GitHub Pages origin** has soft limits (~100 GB/month bandwidth
  guidance). With Cloudflare caching, origin traffic is a small fraction of
  visitor traffic; even a viral day is unlikely to touch the limit. If it
  ever did, the failure mode is throttling of *origin* fetches — cached
  content keeps being served.
- **Watch-outs**: Cloudflare Bot Fight Mode / WAF rules can challenge
  legitimate crawlers (Googlebot on the sitemaps — see
  `docs/GUARDRAILS.md`) and, if misconfigured, even real visitors on
  `/play/`. During a spike, check **Cloudflare → Security → Events** before
  changing anything else.

## Launch-day checklist

1. Deploy is green (`build` + `deploy` jobs; `verify:dist` PASS in CI).
2. Cloudflare → **Purge Everything** (HTML is un-hashed; assets are hashed
   and safe).
3. Spot-check `/`, `/en/`, `/play/?lang=it`, `/play/?lang=en`.
4. `node scripts/seo/check-sitemap-live.mjs https://www.no-ai-act.eu` → PASS.
5. Optional: `npm run report:dist` locally to compare against the budget.

## During a spike — monitor

- Cloudflare dashboard: requests, cache-hit ratio (should stay very high,
  ideally >90%), origin fetches, Security Events (false-positive
  challenges).
- GitHub Pages status (https://www.githubstatus.com/) if origin errors
  appear.

## During a spike — do NOT

- Do **not** deploy non-essential changes (every deploy invalidates caches
  and hits the origin).
- Do **not** enable aggressive bot protection blindly — it can challenge
  real visitors and crawlers.
- Do **not** add analytics/telemetry "to see the traffic" — privacy posture
  is a product feature; Cloudflare's aggregate stats are already available.
- Do **not** change sitemap/robots during the event.

## Performance budget (enforced)

`npm run report:dist` fails the build conversation if: total dist > 20 MB,
game bundle > 900 KB gzipped, landing HTML > 60 KB gzipped. Generous on
purpose: it catches runaway regressions, not normal growth.
