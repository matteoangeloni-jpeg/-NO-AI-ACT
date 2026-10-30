# Research mode architecture

Status: conceptual separation boundary only. Research mode is **disabled, not
implemented in the runtime, and not deployed**. Nothing in this document
authorizes collection, recruitment, surveys, participant codes or linkage.

## Boundary

The public product and public aggregate telemetry must remain independent from
research. Public telemetry contains operational counters and cannot establish
learning, educational efficacy or critical-thinking improvement.

Any future study must be a separately governed system:

```text
public game / public aggregate telemetry
        no linkage, no participant code

research protocol approved by accountable humans
  -> external consent/information
  -> external pre/post instruments and comparison design
  -> optional participant-provided local export
  -> separate research storage and analysis
```

Participant codes, consent records, contact details, pre/post answers and roster
mappings must not enter the public telemetry Worker, D1 counters, dashboard or
game save. A teacher/researcher mapping, if a protocol requires one, stays outside
the product under the research controller's safeguards.

## Disabled-state requirements

- No production/beta build flag currently enables research mode.
- No research endpoint, database, migration, event, survey embed or participant
  identifier is present in the telemetry runtime contract.
- Public telemetry activation must never imply research participation.
- The existing local session-summary export is participant-controlled material,
  not automatic research collection and not proof of anonymity or consent.

## Preconditions for any future implementation

Before code or deployment: named controller and processors; protocol and research
questions; ethics review where applicable; lawful basis and ePrivacy analysis;
age/classroom safeguards; consent/withdrawal process; minimisation; retention;
access roles; incident process; data-subject procedures; statistical analysis
plan; missing-data/attrition plan; versioned instruments; and deletion/export
runbooks. These require human legal, privacy, ethics and research-method review.

## Measurement and claims

Usability, engagement, completion and in-game correctness are different
constructs. None is a proxy for critical thinking or educational efficacy.
Evidence for such claims would require an approved study with valid instruments,
appropriate comparison, sampling and analysis. Positive operational telemetry
must never be reported as learning impact.

Missing participants, unmatched pre/post records, withdrawals and attrition must
be reported according to a preregistered plan, not silently imputed from public
telemetry. Public aggregate events cannot supply individual study denominators.

## Future data-flow prohibition

Do not add research fields to schema 1 or a future public schema 2. If research
mode is ever approved, use a separate origin, datastore, credentials, retention,
access policy and notice. There must be no automatic join key with public
telemetry. Deployment must default off and fail closed.

