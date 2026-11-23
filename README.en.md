# NO AI ACT · v5.3.1

[Italiano](README.md) · [English](README.en.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Español](README.es.md) · [Português](README.pt.md)

**Investigative serious game about the European AI Act**

[▶ Play](https://www.no-ai-act.eu/play/?lang=en) · [Website and resources](https://www.no-ai-act.eu/en/) · [Stable release](https://github.com/matteoangeloni-jpeg/-NO-AI-ACT/releases/tag/v5.3.1)

It is 2032 in a fictional European city where the AI Act never entered into force. As an inspector, reconstruct how AI systems are used through documents, testimony and logs. The game is free, open source and runs in the browser without an account.

## Coverage

The same languages cover the game, website, learning resources, press kits, READMEs and methodology dossier: Italian, English, French, German, Spanish and European Portuguese (pt-PT). Every language includes all 14 cases and the same 37 website sections. Existing URLs are preserved.

## The game journey

- Investigate: open exhibits, assess provenance, cite evidence and compare sources. Decide classification, measure, responsibility and rationale; sign the report and discuss consequences and limits.
- The guided path integrates understanding, hypothesis, investigation, autonomous argument before feedback, debrief and reflection on another case. Return to evidence and explain revisions; writing remains optional.
- Four modes use the same cases: Service Shift, Free Investigation, Surprise Inspection and Review of cases closed with errors. The selected duration is an indicative budget.
- Teacher mode provides a guide and local debrief materials. Activities, three lesson plans, a glossary and focused articles support preparation and discussion.
- Keyboard controls, an accessible reading layer and audio, text and motion settings. Version 2 saves and migration from version 1 remain compatible.

## Method and limits

CEPAJe and LM–GM connect context, mediation, actions and observable evidence. The dossier includes matrices, a preliminary rubric and transfer-task specification. Julian Alvarez and Federica Pelizzari’s feedback informs redesign without implying endorsement or validation. Game scores and success do not establish learning or critical thinking; there is no automatic critical-thinking scoring. This simplified legal simulation provides neither legal advice nor certification.

[Method and limits](docs/v5/README.en.md) · [Methodology, feedback, CEPAJe and LM–GM](docs/v5/en/METHODOLOGY.md) · [Legal matrix of the 14 cases](docs/v5/en/LEGAL_LEARNING_MATRIX.md)

## Data and privacy

Progress stays in the browser. Aggregate counters can be disabled. Adults alone may consent to a pseudonymous session journal retained for 90 days; guided-path writing requires additional consent, initially unselected. Withdrawal, erasure and export are available in the game bar. DNT/GPC are respected. No accounts, advertising profiles or links between visits. Production collection uses telemetry.no-ai-act.eu; previous APIs remain compatible with existing receipts and exports.

[Data and privacy](https://www.no-ai-act.eu/game-statistics.html#en) · [Current session-journal contract](docs/v5/en/SESSION_JOURNAL.md)

## Research materials

Study 02 is a local laboratory outside the public build, with two forms and a human-coded rubric in six languages. It does not activate participant research. Linguistic equivalence, rubric validity and educational effectiveness still require human evaluation. Verification results in the dossier are historical records.

[Rubric and Study 02 transfer task](docs/v5/en/ARGUMENTATION_STUDY02.md) · [Study 02](research/study02/)

## Local development

Node.js 22+ · TypeScript · Phaser 3 · Vite.

```sh
npm ci
npm run dev
# http://localhost:5173/play/?lang=en
npm run site:generate
npm run build
npm run study02:local
# http://127.0.0.1:4262/
```

## Author

Matteo Angeloni: concept, game design, development and educational content. PhD candidate at the University of Tuscia; an independent project without implied institutional approval. Made with AI assistance under human editorial responsibility.

[Matteo Angeloni](https://www.no-ai-act.eu/en/matteo-angeloni/)

## Licences

Code: GPL-3.0-or-later; content: CC BY-SA 4.0. See LICENSE, CREDITS and THIRD_PARTY_LICENSES for attribution and components. Publication and press-article titles remain in their original language.

[LICENSE](LICENSE) · [CREDITS](CREDITS.md) · [THIRD_PARTY_LICENSES](THIRD_PARTY_LICENSES.md)

## Technical documentation and history

[Stable release](docs/RELEASE_NOTES_v5.3.1.en.md) · [Method and limits](docs/v5/README.en.md) · [Press kit](https://www.no-ai-act.eu/en/press-kit/) · [GDD](docs/GDD.md) · [README < v5.3.0](docs/archive/README_pre_v5.3.0.it.md)
