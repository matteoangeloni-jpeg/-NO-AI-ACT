# NO AI ACT v2.0.0 — research-grade, internationally discoverable

The 2.0 release turns the stable 1.x serious game into a stronger educational
and research product. Seven PRs (#42–#48), all gates green at every merge.

## Game (Workstream C)
- **Learning architecture**: 9 typed learning objectives, 9 misconceptions,
  per-case objective maps and a machine-readable legal matrix
  (`src/game/data/learningModel.ts`), all pinned to the executable case data.
- **Chapters**: 4 thematic chapters over all cases (intro, objectives,
  recommended order, duration, completion state, chapter debrief) — free case
  selection and teacher mode preserved, nothing is locked.
- **Optional local self-check**: 6 objective-mapped questions before (Briefing)
  and after (Finale) a mission; skippable, formative-only, counts-only result
  in localStorage, deleted by reset. No network, no identifiers.
- **Confidence & reflection**: optional 3-level confidence at the decision's
  final step, a calibration line in the report, one reflection question in the
  debrief. Local only; never a score multiplier (test-enforced).
- **Two new cases (11 → 13)**: "Il quartiere segnato" (individual predictive
  policing on profiling → prohibited, Art. 5(1)(d)) and "L'algoritmo del
  sospetto" (welfare fraud scoring without effective oversight → high risk,
  Annex III(5)); full design dossiers in `docs/CASE_DOSSIERS_2_0.md`.
- **Accessibility**: semantic reading layer synchronized with Phaser state
  (sr-only + aria-live + user-selectable visible mode), full keyboard path for
  the core loop (map arrows/ENTER, evidence number keys, decision keys),
  committed keyboard smoke; dismissable mobile-guard fallback.
- **Scoring unchanged**: golden solutions extended to 13 cases; the evaluation
  engine and 1.x outcomes are untouched.

## Save migration (1.x → 2)
New storage key `no-ai-act-save-v2` with an explicit, tested migration from
`no-ai-act-save-v1`:
- nothing is lost (completed cases, reports, settings, unknown future fields);
- the v1 key is kept as a downgrade snapshot for 1.x clients;
- future-version saves load defaults with a warning, storage untouched;
- corrupted saves recover to defaults without wiping;
- reset deletes both keys (including self-check results).

## Site, SEO and research authority (Workstreams A + B)
- Citation infrastructure: `CITATION.cff`, `/come-citare/` + `/en/how-to-cite/`
  (APA, BibTeX, version citation, pending-DOI field).
- `/ricerca-e-metodologia/` + `/en/research-and-methodology/` (honest
  validation status), `/press-kit/` + `/en/press-kit/`.
- 4 new topic pairs (AI Act timeline, deepfakes, AI at work, classroom lab)
  with content briefs and §9.6 credibility blocks. Public URLs 42 → 56.
- SEO indexability system: route-pair source of truth + full audit as a CI
  gate (`npm run audit:seo`), Search Console runbook, route inventory CSV.
- Printable teacher assets (risk worksheet, discussion rubric) + print CSS.

## Honest limitations (unchanged claims policy)
Educational effectiveness has **not** been empirically validated; the game is
an educational simplification, not legal advice; no third-party legal review
yet; no WCAG conformance claim. See `/en/research-and-methodology/`.

## Migration notes for players and teachers
Saves migrate automatically on first load; nothing to do. To start clean, use
the in-game reset (deletes both save keys). The exported teacher debrief
format is unchanged (txt/JSON/print).
