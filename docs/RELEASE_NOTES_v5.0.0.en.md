# NO AI ACT v5.0.0 — Investigate, argue, reconsider

[Italiano](RELEASE_NOTES_v5.0.0.md) · [English](RELEASE_NOTES_v5.0.0.en.md) · [Français](RELEASE_NOTES_v5.0.0.fr.md)

21 November 2026. Release of the guided learning pathway, preserving the 14 existing cases and all three game languages: Italian, English and French. The website retains 155 routes and six editorial languages. The README and release record report the actual tag and publication status.

## Changes in the game

- Case-specific mediation: three short opening stops, a contextual reminder before the decision and help that can be reopened.
- A notebook for rereading opened documents, assessing provenance, explaining relationships between sources and recording reasoned hypothesis revisions. Relationships are player proposals with no automatic correction.
- Independent argument before signing: claim, evidence, reasoning towards measures and responsibility, alternative and uncertainty. The note is sealed before feedback.
- Reconsideration after the report, explicit use of feedback, a plan for another case and a cross-case debrief at the end of the session.
- A semantic dialog with focus, Escape and scrolling. Mouse, touch and keyboard are isolated from the underlying scene while it is open.
- A version number derived from package.json, also displayed on the title screen and its accessible reading layer.
- Aggregate counters also derive their version from package.json. The service remains compatible with previous 4.0 clients; guided answers and notes remain excluded.

Notes are optional and temporary within the tab. Reloading or starting a new game clears them. They do not enter saves, exported game reports or telemetry. The assessment of the 14 cases and save schema v2, with migration from v1, remain compatible.

## Method and research tools

The [methodology dossier](v5/README.md) contains matrices A/B/C, the LM–GM map, CEPAJe analysis, DigComp 3.0 references, verified European bibliography, preliminary rubric and Study 02 protocol. The feedback received constitutes neither endorsement nor scientific validation.

The Study 02 lab is available in the repository through `npm run study02:local`: two independent forms, four new sources per form, a free response locked on submission, structured observation and human-only coding. It is separate from the public build and does not authorise participant data collection. The game debrief is distinct from the independent transfer task.

## Verification and limits

The methodology cycle was checked across all 14 cases in three languages and three additional screen profiles: 45 guided pathways. Also passed were 42 standard pathways with report restoration, 12 mode/language combinations and 12 Study 02 configurations. Prototype evidence is recorded in [TEST_RESULTS](v5/en/TEST_RESULTS.md); the original release also underwent pipeline build, metadata and browser checks. These are historical V5.0.0 results, not new smoke runs for the localization correction.

Game performance does not demonstrate critical thinking. Educational effectiveness, form equivalence, the rubric, translations and accessibility with real assistive technology still require human evaluation. No automatic critical-thinking score is introduced. No competency certification is issued.

The 4K profile passed with a Direct3D11 GPU. Direct startup at 4K using software rendering exceeded 90 seconds in the pre-existing Preload; this limit remains documented. The game simplifies law for educational purposes and does not replace the current legal text or professional advice.

## Updating

Open the site or reload after deployment. Existing saves are retained. For reproducible research, state the exact version and retain the tag used; V5.0 does not amount to empirical validation.
