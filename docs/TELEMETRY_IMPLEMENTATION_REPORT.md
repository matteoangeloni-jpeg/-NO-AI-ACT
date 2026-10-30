# Telemetry v2 documentation implementation report

Date: 30 October 2026

## Review state

**Schema 2 is implemented in the review branch; deployment is neither performed
nor approved.** The implementation includes local categorical derivation,
schema-1-compatible ingestion, separate composite storage, dashboard v2,
scientific aggregate exports and a fail-closed research-mode contract. It does
not provide an active research transport, deletion API or live configuration.

Reviewers should verify product/privacy/legal wording, metric semantics and the
proposed operational procedures before treating these documents as policy.

## Repository evidence reviewed

- Executable client schema/event catalog and bounded aggregation:
  `src/game/systems/analyticsSchema.ts`, `AnalyticsSystem.ts`, and
  `analyticsInstrumentation.ts`.
- Public subset mapping and delivery: `analytics/beta-usage.ts`, client transport,
  and `src/main.ts`.
- Worker validation/auth/read/export path: `analytics/worker.ts`, `auth.ts`,
  `aggregation.ts`, `types.ts`, dashboard source and migrations 0001–0004.
- Current configuration template: collection disabled, no deploy hostname/account
  secrets, daily purge trigger, D1 and limiter placeholders.
- Existing analytics, privacy, research and deployment documentation and telemetry
  test inventory.

The repository proves code/configuration intent; passing tests are reported only
when run in the current worktree. It does
not prove the currently deployed Worker, Cloudflare account settings, live data,
Access/WAF/MFA, alerting, backups or legal approval.

## Delivered documentation

- `TELEMETRY_SCHEMA_V2.md`: architecture, public subset, semantics, missingness,
  denominators and non-claims.
- `TELEMETRY_DATA_DICTIONARY_V2.json`: machine-readable current event/property
  catalog and policies.
- `TELEMETRY_PRIVACY_SECURITY_V2.md`: controls, retention, suppression, export,
  deletion, residual risks and human review gates.
- `TELEMETRY_MIGRATION_V2.md`: schema 1 compatibility and schema 2 rollout gates.
- `RESEARCH_MODE_ARCHITECTURE.md`: separate, disabled/not-deployed research design.
- `ANALYTICS.md`: current-state index and correction of stale local-only wording.

## Deferred items

- Review/merge and controlled rollout of the concurrent schema 2 implementation.
- Per-cell explicit suppression metadata and a formal machine-readable metrics API.
- Operational deletion tooling, monitored purge evidence and export-copy register.
- Live infrastructure inventory and verification of collection state.
- Cloudflare provider/DPA/region/log/backup/subprocessor review.
- Human privacy/legal/ethics decisions, notices and data-subject request ownership.
- Any research mode, participant recruitment, consent, instruments or study.
- Public privacy/research copy in all site languages and human legal review must
  be completed before a production build may enable the richer v2 public subset.
- Any efficacy, learning or critical-thinking claim; no supporting study is present.

## Verification performed for this documentation change

- Compared the dictionary to the executable event catalog and allowed properties.
- Compared public events/properties to the public usage adapter.
- Compared retention, threshold, marginal/composite projection, query and CSV
  language to the current backend worktree.
- Validated that the JSON dictionary parses.
- Checked the final diff is restricted to the seven owned documentation paths.
- `npm run typecheck`: PASS.
- `npm run insights:typecheck`: PASS.
- Targeted Vitest telemetry suite (`analytics`, `betaUsage`, `playerInsights`,
  `telemetryBackendV2`): 4 files and 123 tests PASS outside the Windows sandbox.
  The first sandboxed attempt executed zero tests because Vitest could not reopen
  generated SSR temp files; the identical unsandboxed rerun passed.

## Integrated verification (current worktree)

- Application and analytics TypeScript checks: PASS.
- Full Vitest suite: 92 files, 1,495 tests PASS.
- Production build and deploy-file verification: PASS (155 indexed routes).
- Worker/D1 smoke: PASS, including migration, deduplication, quota 429 and purge.
- Dashboard v2 browser smoke: PASS across five responsive viewports, authenticated
  filters, aggregate/scientific CSV and zero external requests.
- Analytics UI smoke: PASS in Italian, English and French, including DNT/offline.
- Production privacy smoke: PASS; zero gameplay-data requests in the reviewed
  default preview build.

No deployment, live endpoint, Cloudflare account, production database, commit or
push was changed by this task.

