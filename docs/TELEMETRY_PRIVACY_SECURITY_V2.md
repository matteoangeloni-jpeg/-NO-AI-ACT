# Telemetry v2 privacy and security review

Status: technical review draft, not legal advice, a DPIA, a certification, or a
statement that collection is lawful. Human privacy/legal review remains required
before changing purposes, fields, recipients, activation, retention or access.

## Data minimisation and purpose boundary

The intended public purpose is aggregate product operation and usability
diagnosis. The application forms closed-vocabulary counters in memory and the
public adapter removes raw text, precise counts and identifiers. Schema 2 may
transmit closed decision/reference categories, quality/count bands, boolean
indicators, accessibility-setting categories and technical error codes. No
free-text answers, report text, evidence content/indexes, numeric score, email,
account, player ID, cookie ID,
device ID, precise event timestamp or raw event sequence belongs in the public
aggregate payload.

Telemetry must not be used to evaluate an individual, rank classes or teachers,
infer protected traits, target advertising, make legal decisions, or claim
learning, educational efficacy or critical-thinking improvement.

## Implemented repository controls

- Exact Origin allowlist, exact host routing, POST/OPTIONS-only collection and
  strict content type/body-size/schema validation.
- DNT and Sec-GPC requests are not ingested.
- Credentials omitted, no-referrer, no-store, redirect rejection and bounded
  client transport.
- Global ingest/admin limiters plus transactional daily quota and UUID receipt
  deduplication.
- Daily marginal counters and bounded schema 2 composite counters; no application
  storage of IP or user-agent.
- Authenticated aggregate reads/CSV; Worker-first assets; deny-by-default JWT
  configuration; local Basic authentication restricted to loopback tests.
- Security headers, no payload/credential/SQL exception logging in Worker code.
- Query-time retention clipping and daily purge.

These controls reduce risk but do not establish anonymity. Origin headers can be
spoofed outside browsers, batch UUIDs can be changed, and global limits do not
prove that events came from distinct humans.

## Retention and suppression

Application marginal/composite counters and quota rows are retained for 90 UTC receipt days,
inclusive. Receipt hashes expire after approximately 24 hours. The scheduled
purge is configured for 03:15 UTC; queries also exclude out-of-retention rows if
purge is delayed. Daily cells below 10 events are omitted at read time before
aggregation.

The threshold is 10 events, not 10 people, and is not differential privacy.
Overlapping windows, complementary margins and version filters create residual
differencing risk. Totals and distributions may not reconcile. The dashboard
and exports must remain access-controlled.

Provider logs, Cloudflare Access identity data, D1 Time Travel/backups, operator
audit trails and downloaded CSV copies have separate retention. The application
cron does not erase them. Their actual terms, region, subprocessors, transfer
mechanisms, access model and retention require account-level verification.

## Access, export and deletion procedures

### Aggregate export

1. Authenticate through the approved administrative access policy.
2. Select a maximum 90-day UTC window, version and one dimension.
3. Record query provenance: requested window, retained-from date, clipping,
   threshold, classification and export time.
4. Treat omitted rows as unavailable, not zero; do not combine dimensions.
5. Store exports only in the approved protected location. The existing policy
   proposal is a maximum of 30 days for downloaded CSVs; this is procedural, not
   enforced by the Worker.
6. Delete local/shared copies and record completion. Exports cannot be remotely
   revoked after download.

### Scheduled deletion

The Worker cron calls the repository purge routine, deleting counters and quota
rows older than the 90-day cutoff and expired receipts. Operations must monitor
cron success. A restore must be followed by purge before reopening access.

### Exceptional deletion

There is no browser or reader-role deletion API and no per-person lookup because
the application stores no player identifier. An authorized D1 operator must:

1. freeze exports and document scope/reason;
2. take only the recovery record required by policy;
3. run a reviewed, bounded delete/purge using least-privilege credentials;
4. verify row counts and retention cutoff without exposing small cells;
5. address Time Travel/backups and all CSV replicas under their own schedules;
6. record approver, operator, query, timestamp and verification result.

An individual-access or erasure request cannot be matched reliably to aggregate
application counters. It must still be triaged by the controller because network,
Access, account or export systems may hold separately identifiable metadata.

## Residual risks and required human decisions

1. Network/provider metadata may be personal data even when the payload is not.
2. Small-cell suppression does not prevent all inference or differencing.
3. Flooding, replay with new UUIDs and automation can distort counts.
4. Lost end events and window boundaries bias denominators; ratios are not cohorts.
5. Admin JWT/email, Access cookies, logs, backups and CSVs are separate processing.
6. Children/classroom contexts, ePrivacy rules, lawful basis, transparency,
   consent/preference handling and data-subject processes require counsel/DPO or
   other accountable human review for the actual deployment and audience.
7. Repository configuration cannot verify live Cloudflare settings, WAF, MFA,
   revocation, alerts, database location, backup window or currently deployed code.
8. Composite schema 2 cells preserve combinations of closed attributes. This
   improves utility but raises singling-out/differencing risk versus margins;
   threshold 10 remains an event threshold and requires human privacy review.

No document should state “anonymous”, “GDPR compliant”, “consent not required”,
or “no personal data” as a blanket conclusion without that review and live-system
evidence.

