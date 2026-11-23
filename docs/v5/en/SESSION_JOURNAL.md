# V5.2 — Voluntary individual session journal


> V5.3.0 language edition · 23 November 2026. The dossier and local Study 02 materials now have six language versions. Prototype dates, counts and outcomes describe historical executions. The current optional adult journal contract is in SESSION_JOURNAL.md and supersedes the earlier aggregates-only restriction. Translations do not establish instrument equivalence, educational effectiveness or rubric validity. No new tests were run for this content update.


22 November 2026. Implements the owner's subsequent request to extend collection beyond aggregates. The earlier restriction to aggregate data remains in the historical V5.0 dossier. The Study 02 protocol is unchanged. This translation describes the same existing service, without extending its collection.

## Available evidence

Only after an adult consents: a random tab-session identifier, version, channel (production; beta in historical records), initial language and mode, difficulty, selected path and audience; events with UUID, sequence, attempt, case, phase, client-declared time, elapsed time and server receipt time. The selected minute budget is included; it is not actual elapsed play time. Session version is the version at the start.

| Action | Record | Interpretative limit |
|---|---|---|
| Opening, start, resume, navigation | Event and context | Opening does not establish reading |
| Exhibits | Index, opened/cited, additions/removals and draft state | No attention measure |
| Comparison | Pair of displayed indices | Does not establish a correct correlation |
| Decisions | Classification, measure, actor, reason, citations, confidence | Client-declared data can be manipulated |
| Incident | Canonical option, including keyboard selection | Does not measure a stable ethical disposition |
| Report | Signed choices and internal outcome | Game outcome, not validated competence |
| Guided path | Hypothesis saved/revised, relations added/removed, field and revision counts | Counts are not reasoning quality |
| Argument | Submission before feedback distinguished from later reflection | No critical-thinking scoring |
| Self-check | Counts from the optional pre/post exercise | No implied external validation |
| Help, tutorial, feedback, review, accessibility | Events before reduction by the aggregate adapter | Use does not establish learning |
| Activity | Heartbeat with visibility, focus and recent activity | An estimate, without eye tracking |

A **second consent**, initially unselected, permits snapshots of saved guided-path writing: hypotheses, source assessments, reasons for relations/revisions, argument, reflection and transfer plan. No individual keystrokes are recorded. One field per event, at most 1,200 characters; server-side AES-GCM encryption. The interface asks people to avoid personal or sensitive data. Writing receives no automatic assessment.

No names, emails, application-level IP addresses, user agents, fingerprints, location, advertising or links between visits/classes are added. The journal is **pseudonymous**, not described as anonymous.

## Consent and rights

The invitation is available in IT/EN/FR/DE/ES/PT-PT. Refusal does not remove game features. Before consent, no server session is created and no journal events are queued. Previous save history is not uploaded. The same tab can resume its journal for 24 hours, including after reload; consent does not carry to another visit or tab. Minors may play and are not invited to activate the individual journal.

The queue, receipt and private credential use the tab's sessionStorage. Personal export distinguishes received events from local pending events. The downloadable receipt contains an access key and must remain private. It can be reopened to export or erase after the tab closes; it does not restart recording. Without the receipt after closing the tab, the controller may be unable to find the correct record because no personal identity is held.

Withdrawal immediately stops collection. Offline erasure is shown as **pending**, not complete; the client retries. Disabling statistics in the game bar also revokes the journal. DNT/GPC prevent activation; if detected later, they stop recording and request erasure.

Records become inaccessible 90 days after consent and are removed by daily cleanup. Withdrawal removes all events and the session record. Only a technical receipt remains until the same expiry: UUID, credential hash, revocation and expiry dates, to reject delayed resubmissions.

Legal basis: consent under GDPR Article 6(1)(a). Controller: Matteo Angeloni; contacts appear on the author pages. Cloudflare provides Workers/D1 and processes connection metadata for delivery and security. The existing database is configured in the EU jurisdiction; that does not guarantee anonymity or the absence of transfers across the entire infrastructure. [Six-language privacy notice](https://www.no-ai-act.eu/game-statistics.html).

The purpose is to correct and improve gameplay and learning supports. The 90-day window supports comparisons between iterations without an indefinite individual archive. Consent does not authorise unrelated or disproportionate collection: EDPB Guidelines 05/2020, paragraph 5, retain necessity, proportionality and GDPR Article 5 principles. Collection does not extend to external browsing, named identification, fingerprinting or requests for sensitive player data.

## Technical contract

`https://telemetry.no-ai-act.eu/collect/v3/start`, `/events`, `/export`, `/revoke` use the same production collector. The previous `beta.no-ai-act.eu` host retains API and downloaded-receipt compatibility only; the beta game is retired and redirects to stable. No data migration or deletion.

Stable and historical origins, bounded JSON POST requests, no credentials in URLs, no cookies, payload logging disabled. Migration 0007 adds four tables without rewriting earlier counters. Only a hash of the private credential is stored in the database. `JOURNAL_TEXT_KEY` stays outside the code and identical on both Workers; it is needed to encrypt/read writing. Losing it makes writing unreadable. Do not delete or rotate it without preserving keys still needed. This is not end-to-end encryption: the server can decrypt authorised exports.

Immutable IDs, explicit acknowledgement of individual events, idempotent retries and a queue that survives tab reload. Limits: 30,000 bytes per request, 40 events per batch, 10,000 events per session, 1.4 MB client queue; 5,000 new sessions and 50,000 events per day. Per-session ingestion rate limits apply. Quotas can make coverage incomplete. Keepalive cannot guarantee delivery when the browser closes, the network fails, storage is denied or the 24-hour window expires.

The private Cloudflare Access-protected dashboard shows **individual sessions** first: combined filters, channel, version, received count and writing consent. Language/mode filter initial context; case selects sessions containing an event for that case. Pages contain 50 sessions, progressive timelines load 200 events, JSON/CSV export is available. The private journal has no threshold of 10. It shows gaps before the last sequence, but cannot reveal a final queue never received.

## Historical records and unavailable values

`usage_case_completed`, `usage_case_left`, `usage_session_completed` are reconciled with canonical names in the historical view. Requests for dimensions absent from the backend were removed. Historical records retain aggregation and thresholds: sequences, results and timings discarded by the adapter **cannot be reconstructed**. Missing data is not replaced by zeros, estimates or invented events.

## Verification and open limits

The V5.2 release recorded client/server verification with real SQLite for consent, six languages, all 14 case IDs, exact properties, retries, sequence conflicts, reload, expiry, encryption, unauthorised access, export, offline withdrawal and ingestion races, quotas and retention. It also covered regression, client/Worker types, build, SEO and distribution. Those executions are historical; this translation does not report new test runs.

No smoke or browser tests were run for that release, as requested. Visual and assistive verification on real devices therefore remains limited. Specialist linguistic review, context-specific privacy review, any future path for minors and educational research with validated instruments remain open. No endorsement by Alvarez/Pelizzari and no activation of Study 02.

## Sources consulted in the preceding research

- [Consolidated GDPR](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02016R0679-20160504).
- [EDPB consent guidelines](https://www.edpb.europa.eu/documents/guideline/guidelines-052020-on-consent-under-regulation-2016679_en).
- [EDPB ePrivacy Article 5(3)](https://www.edpb.europa.eu/system/files/documents/2024-10/edpb_guidelines_202302_technical_scope_art_53_eprivacydirective_v2_en_0.pdf).
- [Garante tracking guidelines](https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/9677876).
- [W3C Beacon](https://www.w3.org/TR/beacon/).
- [D1 data location](https://developers.cloudflare.com/d1/configuration/data-location/).
- [Cloudflare rate limiting](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/).
- [Serrano-Laguna et al.](https://pubman.e-ucm.es/drafts/e-UCM_draft_297.pdf), DOI 10.1016/j.csi.2016.09.014: semantic inspiration without claiming xAPI compliance.
