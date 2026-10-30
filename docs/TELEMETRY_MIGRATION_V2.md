# Telemetry v2 migration plan

Status: implementation under concurrent repository review. Schema 2 code, tests
and migration 0005 are present in the worktree; this documentation task did not
author, deploy or live-verify them and performed no data conversion.

## Compatibility rule

The current validator accepts `schemaVersion: 1` and `2`; the current emitter
constant is 2. Schema 1 remains accepted with the legacy event/property set.
Deployment status is unverified, so repository presence must not be reported as
public availability.

Schema 1 payloads must continue to be strictly validated. Do not silently coerce
unknown schema 2 fields into schema 1, and do not relax the closed vocabulary.
The legacy client event `case_result` is normalized to `case_completed`; incoming
backend batches containing `case_result` remain rejected.

## Proposed phases

### 0. Documentation and decisions — current phase

- Agree purposes, public metrics, denominators and missing-value language.
- Complete human privacy/security/legal review and deployment inventory.
- Decide whether a wire schema 2 is necessary. Documentation improvements alone
  do not require changing the wire schema.

### 1. Contract implementation — present, review pending

- Review schema 2 types and the version-discriminated validator for v1 parity.
- Define explicit query/output metadata for suppression and missingness.
- Keep identifiers, raw timelines, precise event timestamps, free text and
  research fields prohibited.
- Add fixtures and property/negative tests for every event and field.

### 2. Backend compatibility — present locally, deployment deferred

- Migration 0005 adds composite counters; review and rehearse it on a disposable DB.
- Deploy a dark backend that accepts schema 1 and, only if approved, schema 2.
- Store versioned aggregates without combining semantically incompatible cells.
- Keep schema version visible in provenance/export or document a lossless mapping.
- Test duplicate delivery, quota rollback, retention, suppression, malformed
  payloads and mixed-version queries against a non-production database.

### 3. Read path and dashboard — present locally, review pending

- Make missing/suppressed/not-calculable states explicit.
- Pin every rate to numerator, denominator, window, version and dimension.
- Prevent schema 1/schema 2 comparisons where semantics changed.
- Keep research instruments and efficacy/critical-thinking claims absent.

### 4. Controlled client rollout — deferred

- Release behind an explicit build/configuration gate with schema 1 fallback.
- Verify DNT/GPC and the in-product disable control.
- Observe acceptance/rejection and aggregate reconciliation without adding
  individual diagnostics.
- Roll back by disabling schema 2 emission, not by rewriting retained counters.

### 5. Retirement — deferred

Schema 1 retirement requires a documented support window, evidence that no active
clients require it, export/provenance continuity, and approved handling of old
aggregates. Never reinterpret historical schema 1 rows using later semantics.

## Data migration

No row-level migration was run by this documentation task. Existing D1
rows are aggregate margins and should remain immutable historical observations.
If a future schema changes event meaning, create a new event/version rather than
backfilling. Retention will age out old rows after 90 days; backups and exports
follow separate procedures.

## Release gates

A wire schema 2 is not release-ready until all are evidenced: code review; JSON/type and
backend validation; unit/integration/smoke tests; migration/rollback rehearsal;
privacy/security/legal approval; live Access/WAF/retention/alert verification;
documentation and notice updates; controlled deployment; and post-deploy readback.

