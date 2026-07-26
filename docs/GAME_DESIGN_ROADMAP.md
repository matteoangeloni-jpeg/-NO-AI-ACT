# NO AI ACT — Design Deep Dive and Feature Roadmap (2.1+)

> Provenance: design research supplied by the project owner (2026-07-26),
> archived here verbatim as the reference design document for the post-2.0
> game evolution. Bracketed reference markers ([1], [2], …) belong to the
> author's original research notes; the bibliography is maintained by the
> author outside this repository. The **implementation mapping** at the end
> of this file is maintained in-repo and updated as features ship.

## Overview

NO AI ACT is best understood not as a conventional videogame genre such as fighting game, platformer, or RPG, but as a **regulatory investigation game**: a serious game built around dossier analysis, classification decisions, and interpretive reasoning under the logic of the EU AI Act.[1][2] Its closest design relatives are not legal-education tools, but investigation and decision-centric games such as *Papers, Please*, *Her Story*, and *Return of the Obra Dinn*, each of which turns information processing into play through a distinct loop.[3][4][5]

The core opportunity is to move NO AI ACT from a strong educational case-based experience into a deeper systemic game structure. The design direction is not to imitate those reference games superficially, but to extract portable mechanics, interface patterns, and progression structures that can intensify interpretive play while preserving legal accuracy and workshop usability.[6][7][8]

## Genre positioning

The current structure of NO AI ACT places the player in the role of an inspector who evaluates fictional AI systems, classifies them by risk level, and observes the consequences of those choices.[1] That places it within the family of investigative simulations, branching case studies, and decision-heavy narrative systems rather than action genres or reflex-based games.[1][9]

In design terms, the game sits at the intersection of four subgenres:

- Investigative simulation, because the player inspects evidence and determines what is legally relevant.[1][5]
- Narrative decision game, because progression is produced by judgments and consequences rather than movement or combat.[1][3]
- Database-driven mystery design, because meaning emerges from documents, fragments, and information retrieval.[4][10]
- Serious game / educational simulation, because the primary goal is AI Act literacy rather than entertainment alone.[1][11]

The most accurate short label is therefore: **investigative serious game with regulatory classification mechanics**.[1][11]

## Reference games

### Papers, Please

*Papers, Please* puts the player in the role of an immigration inspector who controls entry at a border crossing and judges people by checking documentation against evolving rules.[3] Its design importance lies in how it transforms administrative review into tension: small interface gestures, discrepancies, and procedural judgments become morally charged because the player is accountable for both compliance and human consequence.[12][13][14]

What matters for NO AI ACT is not the dystopian setting, but the operationalization of bureaucracy. The desk is the game. The rulebook is the game. The contradiction between documents is the game. This is highly transferable to AI regulation, where legal classification can be made experientially meaningful through document comparison, rule lookup, and judgment under uncertainty.[6][14]

### Her Story

*Her Story* is built around searching a video database using keywords, watching clips returned by those searches, and gradually reconstructing the case through non-linear discovery.[4][10][15] Its key design lesson is epistemic: the player does not merely receive information but learns how to ask better questions, and progress is tied to vocabulary acquisition and interpretive curiosity.[7][16]

For NO AI ACT, this suggests a powerful extension: players should not only classify cases but also investigate them through a searchable archive of definitions, complaints, prior cases, recital summaries, and contextual fragments. That turns legal literacy into an active search practice instead of a linear reading exercise.[4][7]

### Return of the Obra Dinn

*Return of the Obra Dinn* casts the player as an insurance investigator tasked with identifying the fate of a ship's crew through scene reconstruction and structured deduction.[5][17] Its most important contribution is not theme but verification design: the game lets the player build theories across multiple cases and confirms them in batches, which preserves the pleasure of inference and avoids over-correcting the player too early.[8][18]

That pattern is highly relevant for NO AI ACT because legal reasoning often works through cross-case structure, not isolated answers. If the system validates only when several related classifications are coherent, the player experiences regulatory reasoning as a network of inferences rather than a series of quiz prompts.[8][18]

## Framework 1: MDA

The MDA framework clarifies what should be imported from the reference games at three different levels: mechanics, dynamics, and aesthetics.[3][4][5]

### Mechanics

Candidate mechanics for NO AI ACT include:

- Dossier reading and evidence comparison.[1][6]
- Highlighting contradictions across documents or stakeholder accounts.[12]
- Risk classification with explicit legal reasoning.[1][2]
- Search-based archive exploration using keywords.[4][15]
- Notebook-based hypothesis tracking.[5][18]
- Progressive rule complexity through exceptions, derogations, and contextual shifts.[12][14]
- Multi-axis consequence feedback covering legality, rights impact, and institutional cost.[13][19]

### Dynamics

If those mechanics are composed well, they produce much richer dynamics than a simple right/wrong learning exercise:

- **Procedural tension**: a player feels the burden of official judgment when decisions must be justified and processed under soft constraints.[14][20]
- **Interpretive discovery**: a player learns the regulatory language by using terms to unlock relevant material.[7][15]
- **Cross-case deduction**: certainty emerges from linking patterns across multiple scenarios rather than solving one isolated prompt at a time.[8][18]
- **Moral ambiguity**: even formally valid decisions can create social harm, creating space for reflection rather than pure correctness.[13][19]

### Aesthetics

The target aesthetics for NO AI ACT should be framed in experiential terms:

- Competence: the player feels increasingly capable of reading AI Act scenarios.[1][2]
- Responsibility: the player feels the weight of a classification decision.[13][20]
- Discovery: the law becomes explorable rather than static.[7][21]
- Interpretive satisfaction: correct reasoning feels earned through inference, not guessed.[8][18]
- Institutional drama: paperwork becomes meaningful because it shapes people's opportunities, rights, and treatment.[3][13]

The key MDA insight is that the game should produce the feeling of **doing regulatory judgment**, not merely reading about it.[6][14]

## Framework 2: Core loop

### Current loop

The current implicit loop appears to be:

1. Read a fictional AI case.[1]
2. Assign a risk classification.[1]
3. Receive an explanation and consequence.[1]

This loop is pedagogically effective but structurally thin. It teaches classification, but it leaves limited room for search, theory-building, doubt, or mastery.[1][9]

### Proposed loop

A deeper loop would look like this:

1. **Intake** — receive a dossier containing a provider claim, deployment context, affected people, and incomplete evidence.
2. **Interrogation** — inspect documents, compare claims, search the archive, open legal references, and annotate relevant facts.
3. **Hypothesis building** — formulate a provisional classification and identify legal uncertainty.
4. **Decision** — classify the system, justify the classification, and possibly prescribe obligations, mitigations, or enforcement responses.
5. **Resolution** — observe consequences at three levels: legal validity, rights impact, and organizational/systemic outcome.
6. **Meta-learning** — store concepts, patterns, and precedents in the notebook so the next case feels informed rather than reset.

This loop is stronger because it includes three layers of cognition: information gathering, inferential synthesis, and institutional judgment. That structure mirrors the strengths of the three reference games: operational friction from *Papers, Please*, search-driven discovery from *Her Story*, and deductive consolidation from *Obra Dinn*.[14][7][8]

## Framework 3: player cognition

A third useful framework is cognitive task decomposition: what exactly the player is mentally doing at each stage. This is especially important for a legal-regulatory game, because depth comes from structuring thought, not from audiovisual spectacle.

### Cognitive verbs in the current design

The current game primarily asks the player to:

- read,
- recognize,
- classify.

That is a solid baseline, but it leaves some higher-order cognitive verbs underused.

### Cognitive verbs in the expanded design

The redesigned system should also require the player to:

- compare,
- dispute,
- search,
- infer,
- justify,
- prioritize,
- anticipate consequences,
- detect edge cases,
- manage ambiguity.

This matters because legal mastery does not come from memorizing categories alone. It comes from learning to distinguish superficially similar cases, identify legally decisive details, and articulate reasons under imperfect information.[2][13]

### Design implication

Each case should be built not just as a scenario, but as a **cognitive exercise architecture**. A strong case contains:

- one obvious signal,
- one misleading signal,
- one missing piece,
- one contextual factor that changes the interpretation,
- and one downstream consequence that reframes the stakes.

That structure is what allows a case to be replayable, discussable, and pedagogically productive rather than merely checkable.

## Framework 4: interface grammar

The most valuable "assets" to borrow are not art assets in the narrow sense, but interface grammars: recurring spatial and procedural patterns that teach the player how to think.

### Borrowed from Papers, Please

- **Inspector desk layout**: a primary workspace where all decisions occur.[6][14]
- **Document juxtaposition**: the player compares two or more sources side by side to find contradictions.[12]
- **Rulebook friction**: legal rules are not passively displayed; they are consulted as working instruments.[14]
- **Consequential stamp/action**: the final decision feels formal and irreversible enough to matter.[3]

### Borrowed from Her Story

- **Search-first interaction**: the player can type concepts and retrieve evidence fragments.[4][15]
- **Fragmented evidence architecture**: meaning comes from assembling incomplete materials rather than reading a single linear explanation.[10][16]
- **Player-authored sequencing**: the order of discovery is shaped by curiosity and hypothesis.[7][21]

### Borrowed from Obra Dinn

- **Notebook as external cognition**: the game provides a structured place for identities, hypotheses, uncertainty, and linkage.[5][18]
- **Batch verification**: the system confirms clusters of correct reasoning only after enough structure has been built.[8]
- **Networked case logic**: understanding one case clarifies another.[22][18]

## Feature map

### Quick wins

These can materially deepen the game without changing its identity.

#### 1. Inspector workspace
A single persistent interface should house the dossier, legal references, notes, evidence tray, and decision panel. This would reduce the "web page" feel and replace it with a sense of situated judgment, similar to how *Papers, Please* turns one desk into an entire game space.[6][14]

#### 2. Contradiction marking
Players should be able to select two statements or documents and mark them as inconsistent. For example, a provider may describe a system as merely assistive while deployment evidence shows automated exclusion in hiring. This shifts the interaction from passive reading to audit practice.[12][14]

#### 3. Mandatory reasoning field
A classification should require a justification composed of tagged legal grounds, key facts, and one free-text rationale. This transforms the act of choosing into structured legal argumentation.[1][2]

#### 4. Multi-layer feedback
Every resolved case should produce feedback in three columns: legal correctness, fundamental-rights impact, and institutional/social consequence. That would surface the difference between formal compliance and substantive harm.[13][19]

#### 5. Case difficulty anatomy
Each case should contain visible complexity design: one obvious indicator, one deceptive clue, one missing document, and one contextual twist. This creates learnable difficulty rather than arbitrary obscurity.

### Medium features

These features would move NO AI ACT from a case library into a systemic regulatory game.

#### 6. Searchable archive
Players should be able to search prior cases, glossary entries, short article summaries, complaints, provider memos, and scenario fragments. The search bar should not be cosmetic; it should be a primary learning mechanic modeled on *Her Story*'s database interaction.[4][10][15]

#### 7. Investigative notebook
The notebook should have tabs for facts, actors, legal hooks, unresolved issues, likely obligations, and comparison cases. It should behave as a structured partner in reasoning, not as a simple save log.[5][18]

#### 8. Progressive complexity
Cases should unlock new doctrinal layers over time: prohibited practices, high-risk systems, transparency duties, GPAI obligations, and borderline interpretive disputes. This reproduces *Papers, Please*'s evolving rule environment without importing its punitive intensity wholesale.[12][14]

#### 9. Cross-case recurrence
Actors, vendors, regulators, or social sectors should recur across cases. When the same deployer appears in several contexts, the player begins to see governance patterns rather than isolated examples.

#### 10. Deferred verification
Rather than validating every answer instantly, the system should sometimes wait until several related cases are completed, then confirm that a coherent pattern has been identified. This borrows one of *Obra Dinn*'s most elegant strengths.[8][18]

### Stretch ideas

These would significantly expand the game's research and teaching value.

#### 11. Role-based play
Different roles should create different informational asymmetries and incentives: regulator, compliance officer, civil society advocate, procurement official, school administrator, or developer. The same case would feel different depending on what the player can see and what they are accountable for.[11][2]

#### 12. Institutional simulation layer
The game could track regulatory backlog, litigation risk, media pressure, public trust, or audit capacity. Wrong decisions would then have systemic effects rather than isolated score penalties.

#### 13. Workshop mode
A group mode could let multiple players classify the same case from different institutional roles, then compare outputs and reasoning. This would fit higher education, executive training, and policy workshops.[1][11]

#### 14. Regulation engine template
The underlying structure could become reusable for other EU regulatory domains such as GDPR, DSA, DMA, or the Data Act. Once the interaction model is sound, the content layer becomes portable.[2]

## Assets to build

### Visual assets

- Inspector dashboard layout.
- Dossier cards and attachment cards.
- Legal reference panel.
- Evidence tags and contradiction markers.
- Decision stamp / classification chip system.
- Notebook interface.
- Relationship map between actors and systems.

### Informational assets

- Short-form article summaries in plain language.[2][1]
- Mini precedents and analogous cases.
- Actor profiles and deployment contexts.
- Complaints, internal memos, product claims, procurement notes, and citizen testimonies.
- Glossary fragments that can be discovered through play.[1]

### Procedural assets

- Contradiction-detection rules.
- Evidence weighting logic.
- Search index and keyword unlock structure.
- Batch verification logic.
- Consequence engine for rights, compliance, and governance impact.
- Difficulty templates for case design.

The procedural assets are the most strategically important, because they are what turns content into replayable design.

## Mechanics to avoid over-copying

Some elements from the reference games should be translated carefully rather than imported directly.

- *Papers, Please*'s oppressive time pressure is powerful, but too much of it would weaken reflection and discussion.[14][20]
- *Her Story*'s radical ambiguity is elegant, but a legal-learning context still needs interpretive anchors and scaffolding.[4][21]
- *Obra Dinn*'s density is brilliant, but full-strength deductive complexity may overwhelm broader educational audiences if not tiered carefully.[8][22]

The principle is selective translation: keep the epistemic structure, soften the friction where pedagogy requires clarity.

## Screen architecture

A stronger NO AI ACT could be built around six recurrent screens.

### 1. Intake screen
Introduces the case file, the affected domain, the provider claim, and the immediate question.

### 2. Evidence workspace
Displays documents, testimonies, system description, context of use, and comparison mode for contradiction marking.

### 3. Legal lookup panel
Provides plain-language article summaries, definitional aids, and linked concepts without forcing the player to leave the game flow.[2][1]

### 4. Notebook screen
Stores hypotheses, actor relationships, unresolved doubts, and possible risk categories.

### 5. Decision screen
Asks the player to classify, justify, and optionally prescribe obligations or interventions.

### 6. Consequences screen
Shows how the decision affects legality, rights protection, organizational burden, and public outcome.

This architecture would make the game feel less like a sequence of static pages and more like a procedural workstation.

## Scoring and feedback

Scoring should move beyond correctness percentage. A more meaningful system would track at least five dimensions:

| Dimension | Meaning |
|---|---|
| Legal accuracy | Whether the classification aligns with the AI Act logic.[2][1] |
| Evidentiary rigor | Whether the player used the most relevant facts and noticed contradictions. |
| Rights sensitivity | Whether the player recognized downstream impact on individuals or groups.[2] |
| Procedural efficiency | Whether the player reached a justified result without excessive unnecessary steps. |
| Institutional resilience | Whether repeated decisions create a stable governance environment. |

This structure avoids reducing the player's job to "guess the category" and instead frames performance as professional judgment.

## Product vision

The strongest long-term vision is not simply "an educational game about the AI Act." The stronger vision is a reusable **regulatory investigation platform** where legal understanding emerges through evidence work, structured interpretation, and accountable decision-making.[1][2] In that form, NO AI ACT becomes a design model for legal pedagogy: not gamification layered over doctrine, but doctrine turned into interactive reasoning.[11][13]

## Prioritized roadmap

### Phase 1 — immediate depth

- Build inspector workspace.
- Add contradiction marking.
- Add mandatory reasoning field.
- Replace binary feedback with multi-axis feedback.
- Standardize case anatomy around signal, trap, missing fact, and contextual twist.

### Phase 2 — systemic play

- Add searchable archive.
- Add notebook.
- Add recurring actors and linked cases.
- Introduce progressive doctrinal layers.
- Add deferred verification for selected case clusters.

### Phase 3 — platform expansion

- Add role-based play.
- Add workshop mode.
- Add institutional simulation variables.
- Modularize the engine for reuse across other EU regulations.

## Final synthesis

The most valuable lesson from *Papers, Please*, *Her Story*, and *Return of the Obra Dinn* is not genre imitation but design translation. *Papers, Please* shows how to make administration feel consequential through friction, comparison, and official acts.[6][14] *Her Story* shows how search can become gameplay when knowledge is fragmented and discovery is player-driven.[4][7] *Obra Dinn* shows how deduction becomes satisfying when the game trusts the player enough to validate patterns rather than spoon-feed answers.[8][18]

Applied to NO AI ACT, those lessons point toward a richer model: an investigative regulatory game in which the player does not simply learn the AI Act, but practices it. That is the clearest path to greater depth, stronger replayability, better workshop use, and future portability across other legal domains.[1][2]

---

# Implementation mapping (maintained in-repo)

How each roadmap feature maps to the CURRENT codebase. Status legend:
**shipped** (exists on `main`) · **partial** (embryonic form exists) ·
**planned** (not started). Non-negotiables that bound every phase: no backend,
no accounts, no personal-data collection, no gameplay network calls, no
external forms; scoring/case-solution changes require explicit AI Act review
(see `docs/GUARDRAILS.md` and `tests/gameplayInvariants.test.ts`).

| Roadmap feature | Current subsystem | Status |
|---|---|---|
| §3 Mandatory reasoning | Cite ≥2 exhibits + subject + motivation, graded (`ReportSystem`, "contestabile" outcome) | **shipped** (2.0; free-text rationale: planned, local-only) |
| §4 Multi-axis feedback | `MultiAxisFeedback` + decision-debrief axes strip + reading layer (derived from pinned `OUTCOME_DELTAS`) | **shipped** (2.1, this PR — presentation only) |
| §1 Inspector workspace | Scene flow Case→Evidence→Decision + `CaseContextOverlay`/`CaseNormOverlay` | **partial** — unified desk layout planned (Phase 1) |
| §2 Contradiction marking | `EvidenceStance` data already marks `decisive` vs `minimizes_risk` accounts per case | **partial** — player-facing pair-marking planned (Phase 1, non-scored first) |
| §5 Case anatomy | Clue stances + `CASE_OBJECTIVES` misconceptions cover signal/trap; missing-piece & twist fields | **partial** — typed `CASE_ANATOMY` + debrief surfacing planned (Phase 1) |
| §6 Searchable archive | `ArchiveScene` (norms) + `GlossaryScene` + `CityDossier` | **partial** — keyword search across norms/glossary/cases planned (Phase 2) |
| §7 Investigative notebook | `CityDossier` (systemic effects) + `LearningReportSystem` | **partial** — tabs (facts/actors/legal hooks/doubts) planned (Phase 2) |
| §8 Progressive complexity | Chapters (4 doctrinal layers), missions, difficulty modes | **shipped** (2.0) — derogation/exception layers planned (Phase 2) |
| §9 Cross-case recurrence | `LEGAL_MATRIX` links provisions across cases; case_credito mirrors case_scoring | **partial** — recurring actors planned (Phase 2) |
| §10 Deferred verification | Self-check (6 questions) is immediate | **planned** (Phase 2 — cluster verification per chapter) |
| §11 Role-based play | Teacher mode (single alternate viewpoint) | **planned** (Phase 3) |
| §12 Institutional simulation | 4 indicators + endings + `CityDossier` trends | **partial** — backlog/audit-capacity variables planned (Phase 3) |
| §13 Workshop mode | `DiscussionPauseOverlay` + teacher debrief | **partial** — multi-role comparison planned (Phase 3, still local-only) |
| §14 Regulation engine template | Typed data layer (`cases`/`norms`/`learningModel`) already separates engine from content | **partial** — extraction planned (Phase 3) |

Screen architecture mapping: Intake=`CaseScene` · Evidence workspace=`EvidenceScene` · Legal lookup=`CaseNormOverlay`+`ArchiveScene` · Notebook=`CityDossier` (to grow) · Decision=`DecisionScene` · Consequences=`ConsequenceScene`+`ReportScene` axes strip.
