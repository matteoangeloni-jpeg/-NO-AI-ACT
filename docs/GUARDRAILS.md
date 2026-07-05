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
