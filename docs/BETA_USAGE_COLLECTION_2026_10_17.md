# Optional beta usage collection - 2026-10-17

Authorized scope: public beta usage without names, email addresses, accounts,
individual answers, outcomes or free text. Stable site/game are not deployed.

## Consent and data

- Unchecked checkbox on the beta game; consent is held only for the current page.
- No buffering or delivery before consent. Revocation clears pending counters.
- DNT and GPC disable collection. No analytics cookies or stored consent.
- Whitelisted events: opened, started, resumed, case started/completed/left,
  session completed and phase pageviews. Only language, mode, phase and case ID.
- Application storage contains daily marginal counters, not individual timelines.
- Delivery UUID hashes deduplicate retries; validity is at most 24 hours and
  expired receipts are removed on ingestion or daily cleanup.
- Counters have a 90-day retention window. Private reports suppress daily cells
  below 10 events. These are events, not unique players or learning measures.
- Abrupt closure or network loss cannot establish abandonment.
- Cloudflare processes connection information to serve requests; application
  records do not store IP addresses, user agents or referrers.
- Feedback text remains a local download, separate from optional usage statistics.

## Infrastructure

Public intake is a separate Worker, `no-ai-act-beta-usage`, restricted to
`beta.no-ai-act.eu/collect`, without assets, admin routes or workers.dev URLs.
Version: `a2e3f4c4-d4b6-4b36-baa0-26b48c5bbdef`.

Private Insights Worker remains behind its existing Access application.
Version: `06938535-47c5-4269-86a4-460ace39373f`. Existing secrets preserved.
Both deployments enforce `USAGE_ONLY=true` and share the existing D1 binding.
The exact collector route was reassigned from Insights to the dedicated intake:
removing it from the Insights configuration alone did not remove the old route.

## Verification

- 1389 tests across 82 files passed; game and analytics typechecks passed.
- `scripts/smoke/beta-usage-smoke.mjs` passed with real UI cases at 390 and
  1440 pixels, local Worker/D1, duplicate delivery, opt-out, reload and DNT/GPC.
- Local test counters: two starts and two completions. No live test events seeded.
- Remote invalid JSON batch: 400; wrong origin: 403; beta admin route: 404;
  unauthenticated private Insights: 302 to Access.
- Mobile banner and report screenshot checked without overlap.

## Build and rollback

Explicitly build with `BETA_USAGE_COLLECTION=true` using `scripts/beta/build.mjs`.
Without that opt-in build flag, beta telemetry stays off. Upload only `dist-beta`
to Pages project `no-ai-act-beta`, branch `beta`.

To stop intake independently, deploy the dedicated intake configuration with
`COLLECTION_ENABLED=false`. Do not disable private Insights Access or broaden
its policies. No historical play sessions can be reconstructed by this change.
