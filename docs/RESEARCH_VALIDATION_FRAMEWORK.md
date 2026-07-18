# Research validation framework

How NO AI ACT can be studied rigorously, what it claims and does not claim,
and how future research stays separate from the privacy-preserving public
product. **Nothing in this document is implemented as in-game data
collection, and nothing may be.**

## Theory of change
Playing structured AI Act inspection cases (evidence → classification →
responsibility → measures → consequences → debrief) should improve (1)
conceptual knowledge of the AI Act's risk-based approach, (2) the ability to
apply it to concrete scenarios, and (3) awareness of why regulation matters
— more than passive reading of equivalent material, because decisions have
visible consequences and errors receive explanatory feedback.

## Learning objectives and constructs
- **Knowledge:** risk categories; prohibited practices; transparency duties;
  provider/deployer roles; GPAI basics (mapped per case in the 2.0 learning
  matrix, `src/game/data/learning*`).
- **Application:** classify a novel scenario; select decisive evidence;
  assign the responsible actor; choose proportionate measures.
- **Metacognition (2.0):** calibration between confidence and correctness;
  quality of post-feedback reflection.
Distinguish explicitly: **usability** (can they operate it), **engagement**
(do they persist/enjoy), **learning** (do constructs improve). Positive
usability/engagement results must never be reported as learning results.

## Proposed measures (external to the game)
- Pre/post knowledge test (parallel forms, item-mapped to the learning
  objectives — the in-game optional self-check is formative and local, NOT a
  research instrument).
- Scenario-transfer task (novel case classified on paper).
- Standard usability/engagement short scales, administered outside the game.
- In learning mode 2.0, players can voluntarily export their local, anonymous
  session summary (manual file export) and hand it to a researcher.

## Design and sampling considerations
- Minimum meaningful design: pre/post with comparison group (equivalent
  reading materials), classroom-randomized where feasible.
- Cluster effects: classes, not students, are usually the unit — plan for
  ICC in power analysis; small pilots should be labelled pilots.
- Missing data: report attrition; pre-register handling (complete-case vs
  multiple imputation); never silently drop conditions.

## Anonymous participant-code workflow
Researchers assign codes OUTSIDE the game (e.g. class roster mapping kept by
the teacher). Participants may write their code on paper instruments and on
the manually exported summary filename. The game itself stores no code, no
identifier, and transmits nothing.

## Separation between the public product and research instruments
- The public build never embeds surveys, tracking or identifiers.
- All questionnaires live outside the product (paper or institutional
  survey tools chosen by the research team under their own ethics approval).
- Consent, ethics review and data protection are the research team's
  responsibility and must not alter the shipped product.

## Reproducibility and stimulus version control
- Cite the exact game version (site footer, `package.json`, GitHub tag) —
  see `/en/how-to-cite/`.
- `release.config.json` + the GitHub tag identify cases, scoring rules and
  content for any study; scoring is pinned by `tests/gameplayInvariants.test.ts`
  golden values.
- Analysis plans should be pre-registered; analysis code shared under an open
  licence.

## Current validation status (honest)
As of v2.0.0: **no empirical validation of educational effectiveness has
been conducted or is claimed.** Informal classroom use has informed design
iterations only. Public claims are limited accordingly (enforced by tests
that check the research pages carry this statement).

## Limitations
Simplified legal model (educational, not legal advice); single-developer
content pipeline with traceable sources but no third-party legal review yet;
self-selection of teachers/players; browser-only delivery.
