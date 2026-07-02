# NO AI ACT v1.0 — Educational Serious Game on AI Governance and the EU AI Act

Play now: <https://www.no-ai-act.eu/play/>
Landing IT: <https://www.no-ai-act.eu/> · Landing EN: <https://www.no-ai-act.eu/en/>

**NO AI ACT v1.0** is the first stable public release of a free, open-source
investigative serious game about the European AI Act (Regulation (EU)
2024/1689). You play an inspector: open the file of an AI system, examine the
evidence, cite the proof and file an inspection report classifying its risk.

It is an **educational simulation** — a learning tool that helps learners
reflect on risk classification, transparency, accountability and human
oversight. It is **not legal advice** and **not an official source**.

## Highlights

- **11 playable cases** (IT/EN), from prohibited social scoring to high-risk
  systems in healthcare, education and public administration, up to GPAI used
  downstream.
- **Full Italian and English** support (game, norms, glossary, landing).
- **Teacher mode** with local, anonymous debrief export — designed for
  classrooms, seminars and professional training.
- **Privacy-conscious by design**: no backend, no accounts, no personal data
  collection in the game; progress lives only in the browser's localStorage.
- **Stabilisation release**: renewed public landing (IT/EN), full pre-release
  visual bug pass (norm archive scrolling, overlay consistency, layout fixes),
  274 automated tests.

## What v1.0 is not

- Not legal advice, not an official legal source, not a compliance or
  certification tool.
- Not an empirically validated learning product: a structured external
  playtest is planned post-1.0 (`docs/PLAYTEST_GUIDE.md`); no claims of
  measured educational effectiveness are made.

## Known limitations

- Optimised for desktop / tablet landscape; portrait phones see a rotate
  guard.
- Game content is unchanged from v0.6 (v0.5/v0.6 saves remain compatible).
- A third-party legal review is recommended before formal institutional use.

## Docs

- Educator quick start: [`docs/TEACHER_QUICK_START.md`](https://github.com/matteoangeloni-jpeg/-NO-AI-ACT/blob/main/docs/TEACHER_QUICK_START.md)
- Full release notes: [`docs/RELEASE_NOTES_v1.0.0.md`](https://github.com/matteoangeloni-jpeg/-NO-AI-ACT/blob/main/docs/RELEASE_NOTES_v1.0.0.md)
- Legal disclaimer: [`docs/LEGAL_DISCLAIMER.md`](https://github.com/matteoangeloni-jpeg/-NO-AI-ACT/blob/main/docs/LEGAL_DISCLAIMER.md)
- Playtest guide: [`docs/PLAYTEST_GUIDE.md`](https://github.com/matteoangeloni-jpeg/-NO-AI-ACT/blob/main/docs/PLAYTEST_GUIDE.md)

## Validation

- 274 automated tests passing; typecheck and production build green.
- Post-merge smoke on `/`, `/en/`, `/play/?lang=it`, `/play/?lang=en`: pages
  load with no relevant console errors; full IT/EN case playthrough verified
  on the built artifact.

MIT code · CC BY 4.0 educational content.
