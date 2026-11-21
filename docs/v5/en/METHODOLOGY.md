# NO AI ACT V5 — methodological design

[Italiano](../METHODOLOGY.md) · [English](METHODOLOGY.md) · [Français](../fr/METHODOLOGY.md)

Revision of 21 November 2026. Baseline checked on the local branch from main 527fde5. PR 128 deployment completed successfully. The owner subsequently authorised publication as V5.0.0; release notes and status are available in [RELEASE_NOTES_v5.0.0.en.md](../../RELEASE_NOTES_v5.0.0.en.md) and the GitHub release.

## Design decision

Understanding → Hypothesis → Investigation → Argument → Feedback → Transfer is adopted as a provisional structure, allowing returns from investigation to hypothesis and from feedback to further investigation. A rigid linear progression would prevent the very revision we want to observe. The first hypothesis remains visible when reformulated. The pre-feedback note is fixed before signing and stays distinct from later reflection.

Players choose the guided path inside a case. Short mediation scenes use the fellow inspector's role and the story's own documents. Classification helps decide which checks, measures and actors to consider. Learners must be able to state which information is missing and continue without writing. Do not reward text quantity or revision frequency.

Design coverage of the complete increment: each of the 14 cases has five original supports in Italian, English and French—narrative opening, source provenance, evidence relations, uncertainty and debrief. The opening scene has three short stops; a contextual reminder precedes the decision and can be reopened. The notebook allows rereading opened exhibits, commenting on provenance and freely proposing source pairs with reasons. It does not mark a relation correct or incorrect. Revision history contains only revisions explicitly recorded by the player with a reason, not an automatic behavioural log.

The pre-signature note includes the connection from evidence to classification, measure and responsibility. After feedback, revision, checking feedback against evidence and planning for another case remain separate. Session debrief compares all completed guided cases and supports synthesis. The separate local `research/study02/` laboratory provides structured observation and two independent tasks; it is excluded from the public game. Full operational traceability is in COVERAGE_COMPLETION.md. Technical verification follows the complete implementation; outcomes are recorded in the implementation report.

## A. From feedback to verification

Direct sources were consulted in the authorised emails of 18 and 19 November 2026. The named register and private references remain in the owner's dossier. These IDs support code traceability without reproducing private correspondence.

| ID | Direct feedback, paraphrased | Educational problem | V5 mechanic | Verification criterion |
|---|---|---|---|---|
| A1 | Assessment predominates | Knowledge is required before sufficient mediation | Fellow-inspector scene before exhibits; purpose and context | Beginner explains the task and an investigative question without the solution |
| A2 | Beginners need integrated mediation | Procedural help is detached from understanding | Brief example contrasting a declarative source with observed operation, then a case hypothesis | Distinguish claim from evidence by referring to provenance |
| A3 | A final debrief is needed | The system's verdict closes reflection | Revisit hypothesis, signed note, revision and next-case question | Explain a maintained or revised choice with a reason |
| P1 | Game success cannot establish critical thinking | Outcome and process are conflated | Autonomous note before signing, separate from predefined reasoning | Human raters identify a connection from evidence to judgment |
| P2 | Observe sources, correlations, revisions and uncertainty | Clicks and times admit ambiguous explanations | Notebook with initial hypothesis, source relation, alternative and information gap | Observer links actions to the participant's explanation |
| P3 | Alternatives can teach the system's expected logic | Recognition of the expected answer | Autonomous writing and an external task without answer options | Compare in-game justification with a new task |
| P4 | Feedback needs reworking | Copying explanations after answering | Locked pre-feedback note and separate post-feedback field | Identify what changed the player's criterion |
| P5 | Integrate observation, explanation and transfer | A game report is partial evidence | Study 02 protocol and double-coded rubric | Converging evidence, reported disagreements and explicit limits |

## B. Learning outcomes and evidence

| Local objective | Player action | Evidence observable in an authorised session | Interpretative limit |
|---|---|---|---|
| Understand purpose and context | Rephrase the case problem | Relevant investigative question | May repeat the scene without understanding |
| Assess provenance | Compare a statement with documentary evidence | Explain differing evidential strength | Opening two documents shows access only |
| Connect two exhibits | Select sources and explain support, tension or uncertainty | Named relation with content and provenance | A proposed pair does not establish a valid inference; human reading is required |
| Revise a hypothesis | Compare initial and current interpretations | Specific reason for changing or maintaining it | Frequent changes may reflect guessing |
| Argue | Write before feedback | Claim, evidence, logical connection and alternative | Writing ability, language and scaffolding affect the text |
| Manage uncertainty and rights | Identify missing data and affected people | Information request and a limit on judgment | Stating doubt does not demonstrate managing it |
| Use feedback | Reread note and debrief, formulate a new criterion | Reasoned difference between before and after | Repeating feedback does not prove transfer |
| Transfer | Analyse new sources outside the game | Performance on parallel pre/post forms and follow-up | Validity depends on equivalence, raters and study design |

These objectives are our operationalisation. In-game performance does not assign a DigComp level. The framework considers complexity and autonomy; guided and free profiles must therefore be described separately. The JRC record, descriptors and learning-outcomes annex were checked [4].

| DigComp 3.0 reference | Reference level | Local objective and limit |
|---|---|---|
| LO1.2.02 | Basic | Distinguish source from content in an exhibit |
| LO1.2.07 | Basic | Express an initial reliability assessment with the colleague |
| LO1.2.21 | Intermediate | Compare different sources' reliability and interests |
| LO2.3.15 | Intermediate | Recognise rights and responsibilities relevant to the case |
| LO2.3.25 | Advanced | Distinguish prohibition and high-risk conditions; this complex demand already exists in the game and needs mediation for beginners |

Guidance supports access to an advanced task. Adding a hint does not turn that performance into basic competence. Codes refer to the original JRC text, Annex 2, printed pp. 88–94. The local formulations are project adaptations for which the European Commission is not responsible.

## What to preserve, change and add

| Phase | Preserve | Change | New component |
|---|---|---|---|
| Understanding | CaseScene, narrative and session duration | Explicit entry to the guided path | Short colleague scene, classification purpose and rights |
| Hypothesis | Freedom to reread and choose | Make initial interpretation visible before exhibits | Initial/current hypothesis in temporary memory |
| Investigation | 14 cases, EvidenceScene and comparison | Pause to connect sources | Working notebook with counterevidence and uncertainty |
| Argument | Report choices, possibility of error and signing | Open an autonomous note before feedback on the selected path | Free draft and snapshot at signing |
| Feedback | ReportScene, feedback axes and review | Compare earlier reasoning with later reflection | Separate reflection field and session debrief |
| Transfer | Investigative scenario as a shared language | Assess effectiveness outside the 14 cases | Two complete independent Study 02 tasks in the local laboratory |

## Critical CEPAJe analysis

CEPAJe crosses context, teacher, pedagogy, learner and game with introduction, activity and debriefing. We use it as a design grid [1]. It identifies overlooked conditions; it does not certify product effectiveness.

| Dimension | Introduction | Investigation | Debrief and transfer | Risk to examine |
|---|---|---|---|---|
| Context | Duration, device, language and access to rules | Pauses compatible with noise and individual/pair work | Protected writing and discussion time | School and self-directed learning offer different mediation |
| Teacher | Present purpose and rules without revealing answers | Ask what evidence would change the hypothesis | Facilitate discussion of reasons and limits | An in-game prompt does not replace human mediation |
| Pedagogy | Explicit objectives with an example | Revisable hypotheses and source comparison | Note before feedback, then reworking | Sequence could become a form to fill in |
| Learner | Prior knowledge and reading familiarity established externally | Optional support and permitted skips | Explain strategies through accessible modalities | Writing and language may mask reasoning |
| Game | Preserve role, atmosphere and case | Exploration and consequences remain central | Reuse debrief and review | Too many interruptions reduce agency and pacing |

This provisional decision must be challenged in playtests. If mediation feels like a separate lesson, shorten it and connect it to a selected document. If free writing blocks play, permit skipping and provide mediated oral responses. If everyone repeats hints, reduce scaffolding in the independent task. If beginners remain disoriented, change the example and test understanding before adding more text.

## LM–GM map

LM–GM connects game actions to learning processes [2]. This is a local operational map; our component names are not attributed to the model.

| Game mechanic | Learning mechanic | Connection to verify | Starting state |
|---|---|---|---|
| Inspector role and case opening | Contextualisation, activation of knowledge | Ask a question useful to the decision | Narrative present, mediation needs expansion |
| Colleague scene | Example and scaffolding | Distinguish statement from evidence | New component |
| Free exhibit exploration | Information search and comparison | Explain returning to a source | Opening and citation already present |
| Side-by-side comparison | Analysis and correlation | Argue for support or conflict | Reading present, production to add |
| Revisable hypothesis | Reflection and monitoring interpretation | Maintain or change a view because of specific evidence | New field |
| Note and signing | Self-explanation and committed decision | Make the logical connection explicit before feedback | Signing present, text new |
| Consequences and debrief | Feedback and reflection on experience | Distinguish legal outcome, support and limit | Reuse existing axes |
| Independent external scenario | Application and transfer | Apply criteria to different sources | Forms A/B, four sources each in IT/EN/FR; human rubric |

Report alternatives provide support but may favour recognition, so autonomous production is complementary. The notebook increases observability during a consented session. The public version retains only the existing aggregate counters.

## Scientific basis and verified bibliography

Sources were consulted on 21 November 2026. Selection prioritises European authors, networks and institutions. Actual access levels are reported so an abstract is not presented as a full-text reading.

1. Alvarez, J., & Chaumette, P. (2017). Présentation d'un modèle dédié à l'évaluation d'activités ludo-pédagogiques et retours d'expériences. Recherche et pratiques pédagogiques en langues de spécialité, 36(2). DOI [10.4000/apliut.5659](https://doi.org/10.4000/apliut.5659). OpenEdition returned an anti-bot check. The structure is also documented in the institutional [DRANE resource](https://drane.region-academique-idf.fr/article69.html) and the author's [RIHM 2019 publication](https://europia.org/RIHM/V20N2/3-RIHM20%282%29-Alvarez.pdf), partially accessible through indexing. Design use retains this explicit limitation.
2. Arnab, S., Lim, T., Carvalho, M. B., Bellotti, F., de Freitas, S., Louchart, S., Suttie, N., Berta, R., & De Gloria, A. (2015). Mapping learning and game mechanics for serious games analysis. British Journal of Educational Technology, 46(2), 391–411. DOI [10.1111/bjet.12113](https://doi.org/10.1111/bjet.12113). Metadata and abstract checked in the [Heriot-Watt repository](https://researchportal.hw.ac.uk/en/publications/mapping-learning-and-game-mechanics-for-serious-games-analysis/). The TU Eindhoven manuscript returned 403. This European GALA-network work supports traceability between aims and mechanics.
3. Bijl, A., Veldkamp, B. P., Wools, S., & de Klerk, S. (2024). Serious games in high-stakes assessment contexts: a systematic literature review into the game design principles for valid game-based performance assessment. Educational Technology Research and Development, 72, 2041–2064. DOI [10.1007/s11423-024-10362-0](https://doi.org/10.1007/s11423-024-10362-0). Open text checked in the [Twente repository](https://ris.utwente.nl/ws/portalfiles/portal/453330013/s11423-024-10362-0.pdf), particularly introduction and discussion. The 56-study review concerns professional competencies and identifies validity threats, authenticity and adaptivity. Feedback's effect on performance supports separating training from independent measurement.
4. Cosgrove, J., & Cachia, R. (2025). DigComp 3.0: European Digital Competence Framework, Fifth Edition. European Commission, JRC144121. DOI [10.2760/0001149](https://doi.org/10.2760/0001149). [Official record](https://publications.jrc.ec.europa.eu/repository/handle/JRC144121) and [JRC descriptors](https://joint-research-centre.ec.europa.eu/scientific-activities/key-competences-lifelong-learning/digital-competence-framework-digcomp/digcomp-30_en) checked; the record gives 27 November 2025. Game objectives are the author's adaptation, not Commission certification.
5. European Union (2024, consolidation of 27 July 2026). Regulation (EU) 2024/1689, amended by Regulation (EU) 2026/1744. [EUR-Lex consolidated text](https://eur-lex.europa.eu/eli/reg/2024/1689). Articles 4 and 4a, prohibitions, obligations and Annex III informed the legal matrix. Article 4 requires providers and deployers to take measures supporting staff AI literacy, considering knowledge, context and affected people; it does not require guaranteeing a specified individual level. The Commission and Member States support those efforts. Article 113 timing must be distinguished from the fictional 2032 setting.
6. Council of Europe (2026). Recommendation CM/Rec(2026)12, adopted 2 September 2026. [Committee of Ministers text](https://search.coe.int/cm/eng?i=09125948802cde8e) and [institutional page](https://www.coe.int/web/education/-/recommendation-cm/rec-2026-12-of-the-committee-of-ministers-to-member-states-on-artificial-intelligence-literacy) checked. Rights, autonomy and reflective practice inform prompts about affected people and judgment limits. This Council of Europe recommendation differs in institution and legal nature from the EU regulation.
7. Wouters, P. J. M., & van Oostendorp, H. (2013). A meta-analytic review of the role of instructional support in game-based learning. Computers & Education, 60, 412–425. [Utrecht repository](https://research-portal.uu.nl/en/publications/a-meta-analytic-review-of-the-role-of-instructional-support-in-ga/). Metadata verified; publisher full-text access denied. Use is limited to motivating a scaffolding check, without transferring effect estimates to this game.
8. van der Meij, H., Leemkuil, H. H., & Li, J.-L. (2013). Does individual or collaborative self-debriefing better enhance learning from games? Computers in Human Behavior, 29(6), 2471–2479. DOI [10.1016/j.chb.2013.06.001](https://doi.org/10.1016/j.chb.2013.06.001). Metadata and abstract checked in the [Twente repository](https://research.utwente.nl/en/publications/does-individual-or-collaborative-self-debriefing-better-enhance-l/). Domain and sample constrain generalisation; the study motivates comparing individual explanation with facilitated discussion.
9. Noroozi, O., Weinberger, A., Biemans, H. J. A., Mulder, M., & Chizari, M. (2012). Argumentation-based computer supported collaborative learning (ABCSCL): A synthesis of fifteen years of research. Educational Research Review, 7(2), 79–106. DOI [10.1016/j.edurev.2011.11.006](https://doi.org/10.1016/j.edurev.2011.11.006). Metadata and abstract checked in the [Wageningen repository](https://research.wur.nl/en/publications/argumentation-based-computer-supported-collaborative-learning-abc/). It considers prerequisites, environment, processes and outcomes. Applying it to an individual notebook requires caution because the synthesis concerns collaborative settings. Prompts and rubric are a local proposal requiring validation.

This targeted survey is not a systematic review. No study is used to claim that NO AI ACT develops critical thinking. The prototype did not require an additional non-European source. A future protocol must justify any further validity or transfer models regardless of their origin.
