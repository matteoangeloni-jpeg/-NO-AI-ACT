# Operational coverage of the feedback

[Italiano](../COVERAGE_COMPLETION.md) · [English](../en/COVERAGE_COMPLETION.md) · [Français](../fr/COVERAGE_COMPLETION.md) · [Deutsch](../de/COVERAGE_COMPLETION.md) · [Español](../es/COVERAGE_COMPLETION.md) · [Português](../pt/COVERAGE_COMPLETION.md) · [Nederlands](../nl/COVERAGE_COMPLETION.md)

> V5.4.0 language edition · 23 November 2026. The dossier and local Study 02 materials now have seven language versions. Prototype dates, counts and outcomes describe historical executions. The current optional adult journal contract is in SESSION_JOURNAL.md and supersedes the earlier aggregates-only restriction. Translations do not establish instrument equivalence, educational effectiveness or rubric validity. No new tests were run for this content update.


Increment requested by the owner on 21 November 2026. This list defines the work to implement before starting the new final verification.

| Requirement | Implementation | Verifiable component |
|---|---|---|
| A1 — beginners' understanding | Case-specific mediation for all 14 cases in the three languages | inquiryCases.ts; dialog, 42 case cards |
| A2 — scenes within the sequence | Progressive introduction, contextual help between exhibits and classification, reopenable guidance | CaseScene, three short stops; DecisionScene, method |
| A3 — final debrief | Reconstruct reasons, compare with the case's rules and feedback, synthesise at session end | ReportScene; SessionEndScene; feedback and session |
| P1 — source exploration | Reread opened exhibits and assess their provenance and reliability with reasons | sources and writeSource; separate human observation |
| P2 — correlation | Player-created source pairs, with a relation and explanation | relate, supports/challenges/uncertain relation, no automatic correction |
| P3 — hypotheses and revision | Preserve the first hypothesis and record explicit, reasoned revisions | finishIntroduction; recordRevision; snapshot |
| P4 — autonomous argument | Claim, evidence, alternative, logical connection to a measure and responsibility before feedback | argument, reasoning; submit before resolve |
| P5 — uncertainty | Missing information and consequences for people and rights | uncertainty; different mediation for each case |
| P6 — use of feedback | Compare with the earlier text, maintain or revise a criterion, plan for a new case | reflection, feedbackUse, transferPlan; session synthesis |
| P7 — observation and triangulation | Separate local tool for structured observation and human rubric coding | Study 02: seven observation rows, six dimensions, CEPAJe context |
| P8 — independent transfer | Two complete IT/EN/FR forms, original documents, free response sealed before debrief, functioning local tool | research/study02; local GET/HEAD server; 12 configurations |
| Boundaries | Original 14 cases, existing migrations and scoring, temporary in-game notes, research materials excluded from the public build | Catalog, save, privacy, network and dist tests |

Operational coverage concerns content and functions. Effectiveness and the validity of inferences require participants, reviewers and analysis under the Study 02 protocol. The final report distinguishes implementation, technical verification and human verification.

Tests started after all rows had been implemented. Corrections arising during final verification were followed by new runs. TEST_RESULTS.md records 1,509 unit tests, 45 guided journeys, 42 standard journeys, 12 mode/language configurations and 12 Study 02 configurations passed, with the actual limits of verification.

These operational IDs expand feedback P1–P5 in methodological matrix A: operational P1–P5 mainly expand its P2 row; P6 expands P4; P7/P8 implement P3/P5. They attribute no new observations to the people consulted. Educational criteria and interpretative limits remain those of matrices A/B.
