# Guided-path verification plan

[Italiano](../METHODOLOGY_TEST_PLAN.md) · [English](../en/METHODOLOGY_TEST_PLAN.md) · [Français](../fr/METHODOLOGY_TEST_PLAN.md) · [Deutsch](../de/METHODOLOGY_TEST_PLAN.md) · [Español](../es/METHODOLOGY_TEST_PLAN.md) · [Português](../pt/METHODOLOGY_TEST_PLAN.md) · [Nederlands](../nl/METHODOLOGY_TEST_PLAN.md)

> V5.4.0 language edition · 23 November 2026. The dossier and local Study 02 materials now have seven language versions. Prototype dates, counts and outcomes describe historical executions. The current optional adult journal contract is in SESSION_JOURNAL.md and supersedes the earlier aggregates-only restriction. Translations do not establish instrument equivalence, educational effectiveness or rubric validity. No new tests were run for this content update.


Before the change. Matrices A, B and C were written in METHODOLOGY.md and LEGAL_LEARNING_MATRIX.md. The starting code provides contextual guidance, comparison, a report with predefined reasons, debriefing and review. Autonomous production and an explicit comparison between the initial interpretation and feedback are missing at that baseline.

## Technical criteria

| ID | Scenario | Observable criterion |
|---|---|---|
| T1 | Normal opening from CaseScene | Guided path available as an optional action in IT/EN/FR |
| T2 | Understanding and hypothesis | Read the purpose, write a hypothesis before the exhibits, enter Evidence |
| T3 | Revision during investigation | Initial hypothesis remains readable; current hypothesis is editable |
| T4 | Signing | Autonomous note appears before feedback on the chosen path; skipping remains possible |
| T5 | After feedback | Signed note can be reread and is not overwritten by later reflection |
| T6 | New session and reload | Temporary notes enter neither saves, exports nor telemetry |
| T7 | Escape and modal | Close dialog, restore focus and scene controls; no key signs behind the dialog; notebook clicks do not change underlying exhibit selection |
| T8 | Touch and keyboard | Every action reachable, labelled text input, focus confined to the dialog |
| T9 | Layout | 320/390 px, desktop, simulated 200% zoom, short viewport and 4K with internal scrolling |
| T10 | Catalog | All 14 cases and languages remain available; assessment and V1/V2 migration pass existing fixtures |
| T11 | Recovery | Closing the dialog or changing scene leaves no stuck overlay, listener or focus |
| T12 | Network | Written text absent from collection payloads; no new endpoint |
| T13 | Contextual mediation | Each case has opening, source, relation, uncertainty and debrief support in IT/EN/FR; no solution shown before feedback |
| T14 | Provenance and relations | Reread only opened sources; annotate each source; connect distinct sources with a free explanation; no automatic judgment of the relation |
| T15 | Explicit revision | First hypothesis intact; reasoned revisions available; signed note and relations immutable after feedback |
| T16 | Complete debrief | Choices, rule, earlier note, feedback use and application plan; synthesis of all completed guided cases |
| T17 | Independent task | Two forms × three languages, four new sources, no answer menu; text locked on submission and debrief unavailable beforehand |
| T18 | Observation and rubric | Seven observation rows, six manually coded dimensions, missing distinguished from 0, no total, legal correctness separate |
| T19 | Research/public separation | Study 02 materials and tools excluded from dist and game imports; no POST or automatic persistence in the laboratory |

Planned commands: npm run typecheck, npm test, npm run build, npm run audit:seo, npm run verify:dist, npm run smoke:guided-inquiry, npm run smoke:release-cases and npm run smoke:final-modes. Technical tests do not constitute educational validation or accessibility certification.

Required completion order. Write all mediation, components, transfer materials and observation tools before starting tests. Then run the entire suite, guided smoke coverage of 14 cases × three languages and six layout profiles, Study 02 coverage of two forms × three languages × PRE/POST, and catalog/mode regressions. A correction arising during testing requires rerunning the relevant checks before delivery. Tests use synthetic data and provide no evidence of human learning.

The existing telemetryMetrics.ts includes contradictoryEvidenceRecognized, derived from opening certain exhibit categories. Its name may imply more than the behaviour demonstrates. In Study 02, treat it as a technical exposure proxy; do not infer contradiction recognition without the participant's explanation. This increment does not change the telemetry schema.

## Human protocol still to conduct

Recruit beginners and experienced participants with consent for observation and notes. An initial iteration with 5–8 participants per profile may reveal obstacles without estimating effectiveness. Record CEPAJe context, language, device, assistance, interruptions and reading difficulties.

Tasks: explain the purpose of classification, form a hypothesis, find and connect two sources, identify an alternative, write before signing, reread after feedback and justify revision or confirmation. The facilitator records independent success, success with assistance, non-completion, serious error and the stated reason. Do not classify click counts as critical thinking.

Design-revision criteria. Inability to exit a dialog, accidental signing, loss of text within a session or a prompt that reveals the solution requires correction before expanding the prototype. For understanding, establish an operational pilot threshold, such as at least four out of five beginners explaining the task in their own words. Report discordant cases too. This is a product decision, not a test of effectiveness.

Test real screen readers, dictation or mediated transcription, keyboard navigation and touch with an on-screen keyboard. Provide an equivalent oral response route for people facing writing barriers. All three languages require human review before recruitment for Study 02.

This is the original methodological verification plan. Translating it does not repeat its smoke tests: the V5.0.1 localization correction is checked with static language checks, unit tests and build only, as requested by the owner.
