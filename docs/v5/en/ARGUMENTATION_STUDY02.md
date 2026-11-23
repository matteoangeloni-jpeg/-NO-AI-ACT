# Preliminary rubric and Study 02 transfer task

[Italiano](../ARGUMENTATION_STUDY02.md) · [English](../en/ARGUMENTATION_STUDY02.md) · [Français](../fr/ARGUMENTATION_STUDY02.md) · [Deutsch](../de/ARGUMENTATION_STUDY02.md) · [Español](../es/ARGUMENTATION_STUDY02.md) · [Português](../pt/ARGUMENTATION_STUDY02.md) · [Nederlands](../nl/ARGUMENTATION_STUDY02.md)

> V5.4.0 language edition · 23 November 2026. The dossier and local Study 02 materials now have seven language versions. Prototype dates, counts and outcomes describe historical executions. The current optional adult journal contract is in SESSION_JOURNAL.md and supersedes the earlier aggregates-only restriction. Translations do not establish instrument equivalence, educational effectiveness or rubric validity. No new tests were run for this content update.


Working version of 21 November 2026. Proposed design; no study has been conducted. The rubric requires validation with human raters and participants from the intended audience.

## Preliminary analytic rubric

Each dimension has three ordinal descriptors: 0 means no evidence in the task, 1 partial evidence, 2 articulated evidence. Do not automatically sum dimensions into a critical-thinking score. Distinguish a missing response, a skipped task and unreadable material.

| Dimension | 0 | 1 | 2 |
|---|---|---|---|
| Contextualised claim | No identifiable judgment | Judgment with incomplete context | Judgment addresses purpose, use and affected people |
| Provenance and relevance | Source absent or irrelevant | Source named with relevant content | Content and provenance compared with reliability limits |
| Evidence–conclusion connection | Judgment without a reason | Evidence placed alongside the claim | Explicit logical connection between evidence, rule and measure |
| Alternative interpretation | No alternative considered | Alternative named | Plausible alternative compared against discriminating evidence |
| Uncertainty and rights | Unjustified certainty or generic doubt | Relevant missing information | Judgment limit, requested information and consequence for people |
| Revision after feedback | Repeats the outcome | Describes a change or confirmation | Explains revision or maintenance using evidence and a criterion |

A legally incorrect conclusion may contain documented reasoning. Code legal correctness separately using a reviewed legal key. Likewise, a correct conclusion with weak justification remains distinguishable. Read behaviour and text together, considering alternatives such as language difficulty, reading, memory, gaming experience and topic familiarity.

## Rater-training examples

- Partial evidence of a logical connection: “The sheet says control is human, so I would trust it.” Naming the source does not show that its use was checked.
- Articulated evidence: “The sheet promises review, but the log shows decisions confirmed without access to data. Before accepting the measure I would ask how the reviewer can change it.” This connects claim, observation, request and limit.
- An empty field remains missing. Length or linguistic richness does not automatically earn a higher rating.

These project-authored examples should be replaced by anchors derived from a consented pilot.

## Independent-task specification

Primary question. Does the guided path support documented arguments in a new scenario when content and available time are equivalent?

Recommended design. Compare with the standard version using equivalent content and individual random assignment where context permits. For class-level assignment, account for within-class dependence and effective sample size. Record initial legal familiarity and reading skills. Prespecify outcomes, comparison and analysis before collection. Sample size requires a power justification and a minimum relevant effect agreed by the research team.

| Occasion | Procedure | Evidence | Safeguard |
|---|---|---|---|
| PRE | Parallel task A or B, 10–15 minutes before the game | Initial argument and knowledge | Counterbalance forms |
| Game | Equivalent individual sessions in both groups, structured observation | Consultation, returns, explained correlations, help requested | Treat scaffolding and feedback as part of the intervention |
| Individual explanation | In-game note before feedback, short interview afterwards | Stated reasons and limits | Consent and equivalent modalities in both conditions |
| POST | New independent form without answer menus or automatic correction | Primary near-transfer outcome | Administer before collective debrief to limit contamination |
| Debrief | Reconstruction, comparison and generalisation | Formative reworking | If debrief belongs to the studied intervention, move POST afterwards and state the different estimand |
| Follow-up | Third scenario after 2–4 weeks if feasible | Retention and further transfer | Record intervening exposure and attrition |

## Transfer materials reserved for the facilitator

Form A is written in full in `research/study02/materials.mjs`, outside the 14 game cases. A civic archive recommends workshops to visitors. Four original fictional sources comprise a provider sheet, management procedure, operating log and visitor report. A promise of guidance does not establish how invitations are actually activated; a limited log does not establish the cause of every refusal. Information about notice, actual educational purpose and review outcomes is missing. Conditional conclusions and reasoned alternatives are permitted.

Form B is in the same module. A craft cooperative recommends practical learning meetings to members. Four sources have the same documentary roles and gaps but a different narrative surface. Both forms and instructions exist in IT/EN/FR. Matching structure and length is a design choice, not demonstrated psychometric equivalence. A legal expert must review intended purpose and Annex III conditions before administration.

Shared instruction. Explain what needs deciding, which two sources carry most weight and why, an alternative reading, information still needed and a proportionate measure. Give both groups the same essential legal excerpts. Do not reuse titles, wording or decisive pairs from the game cases. No automatic suggestions before submission.

## Local laboratory and observation grid

Start with `npm run study02:local`, open `http://127.0.0.1:4262/` and choose English. There is no link from the public game and the laboratory is absent from `dist`. The loopback server accepts GET/HEAD only and receives no written answers. Work stays in memory, without telemetry, cookies or automatic saving. A local JSON copy requires an explicit command and includes the argument only after submission. No identifiers are generated. This is a trial tool with fictional materials, not authorisation to recruit or collect real participant data.

The participant page presents a scenario, four sources, a common legal framework and one free-text field. Submission locks text and configuration. Facilitator debrief becomes available only after submission and an explicit action; it neither corrects nor classifies the argument. PRE and POST use separate tabs. The facilitator assigns A→B or B→A according to prespecified counterbalancing. Common materials may be printed for uniform administration. Any external consultation of legal texts must be equivalent between conditions and documented.

The observation sheet has seven rows: exploration/returns/help; provenance and limits; explained correlations; maintaining or revising a hypothesis; pre-feedback argument; uncertainty/rights; feedback use/new strategy. For each row, separate the observed action or statement and episode order from interpretation and alternative explanations. CEPAJe context records mediation, learner, objective, game and device conditions without names. Distinguish observed, prompted and inferred behaviour.

Complete the rubric manually with not observed/not applicable, 0, 1 or 2 and a written rationale. Do not total it. The post-feedback revision dimension concerns the game's debrief and remains not applicable in independent PRE/POST tasks. Legal correctness has a separate field. For equivalent oral responses, use mediated transcription under the authorised protocol; the tool activates neither microphones nor speech recognition.

Contamination control. Do not show a Study 02 form inside the game or public training materials. The game's generalisation question is formative reflection, separate from the transfer outcome. People already familiar with a form must not receive it as a new task. The facilitator documents exposure and adaptations without retrospectively changing the outcome.

## Validation and analysis

Before the trial, obtain content review by a legal expert, teacher and methodologist. Conduct cognitive interviews on tasks and instructions in all three languages. Use bilingual translation review and check difficulty differences. Train two raters with shared anchors, assign texts without condition labels and double-code at least a prespecified subset. Calculate agreement per dimension, confidence intervals and weighted kappa where appropriate, before resolving disagreements. Examine floor/ceiling effects and systematic disagreement.

Primary analysis adjusts for PRE, sample dependencies and confidence intervals. Separate legal correctness from argumentative dimensions. Treat game time, clicks, revisions and outcomes as descriptive variables. Declare missing data and sensitivity analyses. For a modest qualitative collection, prioritise triangulation and describe discordant cases. Aggregate events alone support no causal inference.

## Data boundary

The public version collects no texts, hypotheses, individual answers, participant codes or prototype timelines. The game notebook exists temporarily in the tab and resets on session change or reload. A researcher may observe a session only under a separate authorised protocol. Before recruitment, the controller must determine retention, access, deletion, information, treatment of minors and legal basis. Study identifiers remain in the research system, separate from operational counters.
