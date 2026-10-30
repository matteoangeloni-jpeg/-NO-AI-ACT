# Telemetry v2 schema and public aggregates

Status: documentation baseline for review, 30 October 2026. Concurrent work in
the current worktree implements a version-discriminated contract accepting
schema 1 and schema 2, with new clients emitting `schemaVersion: 2`. This review
did not deploy it and does not establish that schema 2 is live.

## Scope and non-claims

Telemetry is intended to describe product operation and aggregate use: openings,
starts, resumptions, phase/case progress, bounded decision/evidence quality bands,
accessibility settings, technical error categories and observed completions. It is
not a participant record, cohort tracker, anti-fraud system, assessment, or proof
of learning, educational efficacy, legal knowledge, or critical thinking.

The public pipeline is designed around bounded counters, not raw event rows:

```text
browser (closed vocabulary, in-memory counters)
  -> POST /collect (batch UUID + aggregate cells)
  -> strict Worker validation and global limits
  -> D1 daily marginal counters (UTC receipt day)
  -> authenticated aggregate API / CSV / dashboard
```

No player, account, device, visit or stable session identifier is included in an
analytics cell. A batch UUID is used only for 24-hour request deduplication; the
backend stores its SHA-256 receipt, not a linkable event history. Cloud/network
providers can nevertheless process request metadata; see the privacy document.

## Current wire envelope (schema 2 emitter)

```json
{
  "batchId": "UUIDv4",
  "cells": [{
    "schemaVersion": 2,
    "gameVersion": "4.0.0",
    "event": "game_started",
    "properties": {
      "language": "it",
      "mode": "turno",
      "phase": "menu"
    },
    "count": 1
  }]
}
```

Server limits are 32 cells per request, 100 observations per cell, 1,000 total
observations and 32,768 request bytes. The client buffer is bounded at 512 cells.
Unknown top-level fields, events, properties and enum values are rejected.

Required common properties are `language`, `mode`, and `phase`. Event-specific
fields are drawn only from `caseId`, `result`, `hintUsed`, `durationBucket`, and
`tutorialVersion`. The authoritative executable catalog remains
`src/game/systems/analyticsSchema.ts`.

## Public aggregate subset

The first-party public usage adapter maps or permits only:

| Public event | Source event | Meaning |
| --- | --- | --- |
| `game_opened` | `game_opened` | Game runtime opened in the document; not a unique person. |
| `game_started` | `game_started` | New observed play period started. |
| `game_resumed` | `game_resumed` | Saved play resumed; may be the same person or play period as another count. |
| `usage_case_completed` | `case_completed` | A case reached completion; outcome, duration and hint use are removed. |
| `usage_case_left` | `case_abandoned` | A started case was left through an observed transition. |
| `usage_session_completed` | `session_completed` | A configured plan reached its completion trigger; duration is removed. |
| `pageview` | `pageview` | A supported game phase became current. |
| `case_quality_assessed` | same | Bounded closed-category decision/evidence indicators for a completed case. |
| `decision_revised` | same | Bounded revision count/direction categories. |
| `accessibility_used` | same | One of the closed accessibility-setting categories. |
| `interface_error` | same | One of the closed technical error categories. |

Schema 1 public events retain only `language`, `mode`, `phase`, and optional
`caseId`. Schema 2 additionally permits closed values for selected/reference
classification, selected measure/actor, match and quality bands, evidence-count
bands, contradiction/revision indicators, accessibility setting and error code.
No evidence text/index, reasoning text, report, numeric score, precise count,
local save data, player identifier or research answer is included.

## Stored model

On receipt, each accepted cell is projected into independent daily margins:
`all`, `language`, `mode`, `caseId`, `phase`, `result`, `durationBucket`,
`hintUsed`, and `tutorialVersion`, when the source property exists. Stored rows
contain receipt day, game version, event, one dimension, one value, and count.

Schema 2 also projects selected events into three joint, bounded composite
reports: `case_performance`, `decision_evidence`, and `technical_quality`.
Composite rows preserve only their documented closed dimensions and count; they
remain aggregates, not participant records. Margins are not joint records. Never
join or sum different dimensions as though
they described the same people. The `all` margin uses `*`. Dates are UTC receipt
dates, not user-provided play dates.

## Missing, suppressed and zero

- No returned row means **unavailable**, not zero. It may be below the privacy
  threshold, outside retention, never emitted, rejected, delayed or genuinely zero.
- Counts below 10 are suppressed at the stored daily cell grain before sums.
- Suppressed cells are omitted; the API does not return their exact count or a
  suppression flag per cell.
- A denominator of zero or unavailable yields “not calculable”, never 0%.
- Empty CSV/API results do not establish absence of play.
- Totals and distributions may not reconcile because suppression is applied to
  each margin independently.

## Denominators

Ratios are descriptive ratios of independent aggregate counters, not funnels or
cohort conversion rates.

| Question | Numerator | Denominator | Required label / caveat |
| --- | --- | --- | --- |
| Plan completion | `usage_session_completed` (public) or `session_completed` (full catalog) | `game_started + game_resumed` in the same query window and compatible slice | “Observed completions per observed starts/resumptions”; can exceed 100% at window boundaries. |
| Case completion | completed case count | `case_started` for the same case/slice | Independent counts; no individual linkage. |
| Case left | `usage_case_left` or `case_abandoned` | `case_started` for the same case/slice | Observed navigation only; absence does not prove continuation or abandonment. |
| Help use | `hint_requested` | `case_started` for the same case/slice | Requests can repeat; not a share of players. Not available in the public subset. |
| Citation errors | `citation_error` | `case_started` for the same case/slice | Descriptive interaction signal, not normative difficulty or competence. Not public subset. |
| Opening-to-start | `game_started + game_resumed` | `game_opened` | Event ratio, not unique-user conversion. |

Always publish the numerator, denominator, UTC window, game version/filter,
dimension, threshold, retention clipping state and classification (`observed` or
`synthetic`) beside a rate.

## Schema 1 compatibility

The validator accepts schema 1 and 2. Schema 1 is restricted to the legacy event
set and legacy properties; the four v2 events and all v2 properties are rejected
under schema 1. Existing marginal reports can contain both versions, while v2
composite reports store `schema_version=2` and expose schema/game version in CSV
provenance. Historical schema 1 rows must not be reinterpreted as v2 observations.

The current worktree implementation still requires code review, passing tests,
privacy/legal review, migration rehearsal and live deployment verification. It
must not add persistent identifiers, raw timelines, free text, precise timestamps,
research responses or cross-session linkage.

