# V5 methodological increment — complete coverage

[Italiano](../METHODOLOGY_IMPLEMENTATION.md) · [English](../en/METHODOLOGY_IMPLEMENTATION.md) · [Français](../fr/METHODOLOGY_IMPLEMENTATION.md) · [Deutsch](../de/METHODOLOGY_IMPLEMENTATION.md) · [Español](../es/METHODOLOGY_IMPLEMENTATION.md) · [Português](../pt/METHODOLOGY_IMPLEMENTATION.md) · [Nederlands](../nl/METHODOLOGY_IMPLEMENTATION.md)

> V5.4.0 language edition · 23 November 2026. The dossier and local Study 02 materials now have seven language versions. Prototype dates, counts and outcomes describe historical executions. The current optional adult journal contract is in SESSION_JOURNAL.md and supersedes the earlier aggregates-only restriction. Translations do not establish instrument equivalence, educational effectiveness or rubric validity. No new tests were run for this content update.


Working branch `codex/v5-methodology-guided-path`, main baseline `527fde5`. Revision of 21 November 2026. This report records local completion before release. The owner subsequently authorised publication as V5.0.0; release status and notes are available on GitHub and in [RELEASE_NOTES_v5.0.0.en.md](../../RELEASE_NOTES_v5.0.0.en.md).

## Implemented changes

| Component | Behaviour |
|---|---|
| CaseScene and inquiryCases | Three introductory stops and five case-specific supports for each of the 14 cases, in IT/EN/FR |
| EvidenceScene and notebook | Reread opened documents, assess provenance, freely connect two sources with a reason |
| GuidedInquirySession | Preserve the first hypothesis, explicitly record reasoned revisions, seal a copy of argument, sources and relations before feedback |
| DecisionScene | Contextual reminder, reopenable support and autonomous note covering claim, evidence, reasoning, alternative and uncertainty before signing |
| ReportScene | Case choices and rule, earlier note, reflection, checking of feedback and application plan kept distinct |
| SessionEndScene | Debrief of all completed guided cases, cross-case synthesis and strategy for new contexts |
| Accessible dialog | Semantic HTML, labels, native selects/details, Escape, confined and restored focus, internal scrolling; isolate pointer and keyboard from the scene |
| Local Study 02 | Two new forms with four original sources each in three languages, free text locked on submission, no automatic correction |
| Observation and rubric | CEPAJe context, seven observation rows, six human-coded dimensions, legal correctness separate |
| Data separation | Game notes held only in memory; laboratory outside dist, loopback GET/HEAD server, explicit local download only |

The path preserves the narrative, 14 cases, predefined reasons, original outcomes and scores. Writing or proposing a relation awards no points and produces no critical-thinking assessment. Mediation asks about evidence and circumstances without revealing a legal solution before feedback. Matrix C documents alignment with the EU consolidation of 27 July 2026 checked on EUR-Lex.

## Traceability and materials

Matrices A/B, the LM–GM map, CEPAJe analysis and bibliography are in METHODOLOGY.md; matrix C is in LEGAL_LEARNING_MATRIX.md. COVERAGE_COMPLETION.md links the requested behaviours to components. ARGUMENTATION_STUDY02.md contains rubrics, design, triangulation and the analysis plan. Original emails were read; references and private traceability remain in the owner's dossier, outside the public build. No feedback is presented as endorsement.

## Final verification

Implementation was completed before starting the new tests, as requested. Results from the earlier partial version do not certify this increment. Final verification and its outcomes are recorded in TEST_RESULTS.md after execution. Automated tests use only synthetic materials and explicit fixtures.

Commands: `npm run typecheck`, `npm test`, `npm run build`, `npm run audit:seo`, `npm run verify:dist`, `npm run smoke:guided-inquiry`, `npm run smoke:study02`, `npm run smoke:release-cases`, `npm run smoke:final-modes`.

## Local use

Game: `npm run dev`, open `/play/?lang=en`, select a case and GUIDED PATH. Mediation precedes the exhibits. Notes are optional and disappear on reload or a new game; written text enters neither game saves, exports nor telemetry.

Study: `npm run study02:local`, open `http://127.0.0.1:4262/` and select English. PRE/POST use separate tabs and counterbalanced forms. The tool does not manage identity, consent, randomisation, recruitment or institutional retention: these belong to the externally authorised protocol. Debrief remains disabled before submission. Explicit download saves submitted text and human notes on the device.

Smoke reference: `CHROMIUM_PATH` can select installed Chrome. `INQUIRY_PORT` chooses the port. `INQUIRY_ONLY` limits a profile for diagnosis; the original complete methodological verification used all profiles. Guided coverage comprises 14 cases × three languages plus three layout profiles: 45 journeys. Study 02 comprises two forms × three languages × PRE/POST: 12 configurations. These commands document that verification; they are not rerun for the localization correction.

On this Windows machine, `INQUIRY_4K_GPU=d3d11` requests Direct3D for the 3840×2160 profile only; other profiles use the test's software renderer. Each result records the actual backend, and reproductions must disclose this difference. Software-only 4K startup exceeded the 90-second timeout in the existing Preload. GPU diagnosis reached Title in about 5.6 seconds. This is not a generalisable performance estimate.

## Open limits

- Content/function coverage is distinct from educational validity. Beginner pilots, observation, productions and an independent task are needed; no human study has been conducted.
- Rubric, form equivalence and translations are preliminary: bilingual review, cognitive interviews, anchors and inter-rater agreement remain necessary.
- Mediation is textual. Density, pacing and autonomy must be checked in the CEPAJe context; equivalent oral responses require authorised mediation.
- Real screen readers, dictation, on-screen keyboards and physical devices need human testing. Automated checks do not certify universal accessibility.
- The autonomous note follows the report alternatives. Their possible cueing effect is addressed methodologically through the external task.
- The first note is the player's statement. Previous exposure to a case may influence it; the research baseline is an independent PRE before gameplay in a new session.
- Game notes are not individual tracking. An opening or revision does not demonstrate understanding: triangulation relies on explanations and external human observation.
- New materials require human legal review before administration. The 14 cases' answers have not been changed.
- The bibliography is a targeted survey; each entry discloses limits on full-text access.
- The original technical report precedes publication; release status is recorded separately in V5.0.0.

## Deliverables

| Request | Result |
|---|---|
| Method and European bibliography | METHODOLOGY.md |
| Feedback matrix | Matrix A and COVERAGE_COMPLETION.md; private dossier separate |
| LM–GM | METHODOLOGY.md |
| CEPAJe | METHODOLOGY.md; laboratory context |
| Guided path | inquiryCases, GuidedInquiryDialog and game scenes |
| Investigation cycle and feedback | Revisions, sealed note and separate reflection |
| Rubric | ARGUMENTATION_STUDY02.md and manual laboratory |
| Study 02 transfer | Two complete forms in research/study02 |
| Tests | METHODOLOGY_TEST_PLAN.md and TEST_RESULTS.md |
| Changes and limits | This document |
