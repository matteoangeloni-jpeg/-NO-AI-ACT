# Final verification of V5 methodological coverage

[Italiano](../TEST_RESULTS.md) · [English](TEST_RESULTS.md) · [Français](../fr/TEST_RESULTS.md)

21 November 2026. Prototype report preceding the V5.0.0 release. Tests began after implementing the entire operational list in COVERAGE_COMPLETION.md; corrections were followed by new runs. These results concern the local clone. Publication checks are documented separately in the release. This translation records those earlier executions; it is not a new smoke-test run for V5.0.1.

| Check | Observed outcome |
|---|---|
| TypeScript | PASS, including the build after the dialog correction |
| Vitest suite | 1,509 tests in 95 files, all passed |
| Vite build | PASS; game-bundle size warning, approximately 1.83 MB minified |
| SEO audit | 155 routes, no critical defects or warnings |
| Dist verification | 155/155 routes, no mojibake in HTML, no external collection form |
| Guided path | 45 journeys passed: all 14 cases × IT/EN/FR plus three layout profiles |
| Catalog regression | 42 standard journeys passed, correct outcomes and reports restored after reload |
| Modes | Shift, Free, Surprise, Review × three languages: 12 configurations passed |
| Study 02 | Two forms × three languages × PRE/POST: 12 configurations passed |
| Game data | Synthetic markers in hypotheses, sources, relations and reflections absent from localStorage and telemetry; reload clears notes |
| Study 02 data | No cookies or browser storage; explicit local copy only; POST rejected with 405; materials excluded from public build |

## What the guided journey covers

Each journey starts from the case, completes three introductory stops, preserves the first hypothesis, opens documents with the game's actual keys and cites evidence. In the notebook, it rereads a source, annotates provenance and limits, records two reasoned revisions and an explained relation. Clicking and typing inside the dialog must not change underlying exhibit selection.

The test continues through the methodological reminder, four decisions and signing. Entering a newline in the note must not sign. Confirmation fixes the text before the report; later attempts cannot alter it. Debrief distinguishes previous note, rule, reflection, feedback use and a new-case plan. Session synthesis includes all completed guided cases. Reload clears the new temporary state. No external request or POST is permitted during the smoke test.

Profiles: IT 1920×1080 and 320×800; EN 390×844 and 640×360; FR 390×844 and 3840×2160. Checks cover focus, Tab, Escape, multiline input and absence of dialog overflow. The final 4K test uses Direct3D11 on Intel Iris Xe; the detected backend is recorded in JSON. The other five profiles use SwiftShader. This does not constitute testing with physical devices, on-screen keyboards or real screen readers.

The 14 cases are selected by fixture; exhibits, decisions and signing use the actual interface. This confirms existing engine outcomes, not participant understanding or independent legal accuracy of the answer key.

## Corrections and technical limits

1. Vite's watcher could observe a test download still locked by Windows, causing EBUSY. Artifact and local-graph folders are now excluded. The complete catalog and guided path passed the new execution.
2. Phaser also listens to mouse events on the window: clicking the native dialog could change a citation. The dialog temporarily disables scene input and stops pointer, mouse and touch propagation. The test reproduces the credit case and verifies unchanged exhibit selection in all 45 final journeys.
3. The external-forms check scanned the growing synthetic-artifact folder and timed out. It now excludes exactly scripts/smoke/out, which is not shipped source. Public-source and dist checks remain active; the final suite passed 1,509 tests.
4. Native software-only 4K startup exceeded 90 seconds in the existing Preload. Direct3D11 diagnosis reached Title in approximately 5.6 seconds, and the entire final 4K journey, including reload, passed. The software timeout remains a limitation of that configuration and is not claimed fixed. The rendering engine was not changed.

## Study 02

The twelve configurations check four sources per form, absence of answer options, free argument, submission locking, debrief unavailable before submission, seven observation rows and six human-coded dimensions. Not observed remains distinct from 0. There is no total or automatic correction. The JSON copy includes submitted text and explicit notes without participant identifiers. Tests use only synthetic text.

## Reproduction

In the local clone, use the commands listed in METHODOLOGY_IMPLEMENTATION.md. To reproduce 4K on this Windows machine, set CHROMIUM_PATH to installed Chrome and INQUIRY_4K_GPU=d3d11. INQUIRY_ONLY and INQUIRY_CASE are diagnostic filters; the complete original verification did not use them. JSON reports record viewport, language, case and actual renderer.

## Human validation still required

Functional feedback coverage is implemented and verified in the stated configurations. Educational effectiveness, argument quality, form equivalence, translations, legal accuracy for administration and assistive-technology accessibility require the protocol's human checks. No participant study has been conducted. No game result becomes an automatic critical-thinking score. At the stage recorded here, this increment had not yet been published to production.
