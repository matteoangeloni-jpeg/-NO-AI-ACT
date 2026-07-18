# 2.0 case pack — design dossiers (mission §12)

Two new cases (of the three allowed — fewer, stronger per §19), designed only
after the learning architecture and legal matrix landed (PR #46). Both fill
documented educational gaps, are legally traceable, and use "contestable"
outcomes where the scenario admits real uncertainty. **Legal-review status:
internal editorial review only; third-party legal review recommended before
formal institutional use (as for all cases).**

---

## Dossier 1 — case_predpol · "Il quartiere segnato" / "The marked district"

- **Working title:** Il quartiere segnato (IT) / The marked district (EN)
- **Factual scenario:** the city police deploy a system that assigns residents
  an individual "criminal propensity" score built from profiling (address,
  acquaintances, family history, prior contacts with services). Patrols and
  stops are tasked from the ranked list; officers receive the list with no
  individual assessment.
- **Educational gap:** predictive policing is the most-discussed Art. 5
  practice absent from the current 11 cases; strong civic-debate potential.
- **Target learning objective:** primary `obj_prohibited_boundary`;
  secondary `obj_decisive_evidence`, `obj_context_dependence`.
- **Relevant provisions:** Art. 5(1)(d) (individual crime-risk prediction
  based solely on profiling/personality traits); matrix row `art5`.
- **Legal uncertainty (kept contestable):** Art. 5(1)(d) does not cover
  systems supporting human assessment based on objective, verifiable facts
  directly linked to a criminal activity — the vendor's defence in the case.
  The dossier shows the human step is absent in practice, so the ban applies;
  a player who reads the accuracy report as decisive gets a "contestable",
  explained outcome, not a trick.
- **Risk classification:** `vietata` (prohibited).
- **Responsible actors:** correct `autorita` (the police authority ordering
  and running the practice); partial `provider` (defensible, incomplete).
- **Evidence list:** (0) generation log — scores built from profiling
  categories only, no individual facts [decisive]; (1) service order —
  stops tasked from the list, individual review "not required" [decisive,
  concrete effect]; (2) vendor accuracy study, 92% claimed [distractor].
- **Distractor rationale:** accuracy does not legalise a prohibited practice
  (`mis_accuracy_equals_lawful`).
- **Correct path:** cite 0+1 → vietata → blocco → autorità → motivation 1.
- **Contestable paths:** alto_rischio + oversight (treats an Art. 5 ban as a
  governance problem); provider as subject (shifts practice responsibility).
- **Corrective measures:** correct `blocco`; partial `audit`, `oversight`.
- **City consequences:** rights and trust rise on block; efficiency dips
  (standard vietata-case deltas — no scoring change).
- **Accessibility:** 3 exhibits, standard keyboard flow, reading layer as all
  scenes; no flashing content.
- **Sources:** EUR-Lex Reg. (EU) 2024/1689 Art. 5(1)(d); Commission AI-framework
  pages (see /pratiche-vietate-ai-act/ and /en/prohibited-ai-practices/).
- **Legal-review checklist:** classification traced to Art. 5(1)(d) ✓;
  exemption nuance represented in-game via the weak motivation ✓; no claim of
  legal advice ✓; third-party review pending (tracked in docs) ✓.

## Dossier 2 — case_frodi · "L'algoritmo del sospetto" / "The suspicion algorithm"

- **Working title:** L'algoritmo del sospetto (IT) / The suspicion algorithm (EN)
- **Factual scenario:** the benefits office scores welfare files for "fraud
  risk". Flagged benefits are suspended automatically; the human review only
  happens if the citizen appeals. Error analysis shows most flags are wrong
  and concentrated on specific household profiles (echoes of real EU welfare
  scandals, fictionalised).
- **Educational gap:** essential public services (Annex III(5)) — the most
  consequential high-risk area not yet covered; contrasts with case_credito
  (there the practice was banned scoring; here it is a lawful-but-mismanaged
  high-risk system → trains the banned vs badly-governed distinction).
- **Target learning objective:** primary `obj_decisive_evidence` (the only
  objective without a primary case); secondary `obj_human_oversight`,
  `obj_risk_classification`.
- **Relevant provisions:** Annex III(5)(a) + Chapter III; Art. 14 (oversight);
  matrix rows `annex3`, `art14`.
- **Legal uncertainty (kept contestable):** disparate error rates raise an
  Art. 5 question (is this de-facto social scoring?); the dossier keeps it
  high-risk because scoring is purpose-bound to fraud in one context, but the
  vietata answer is treated as contestable-with-explanation, not simply wrong.
- **Risk classification:** `alto_rischio`.
- **Responsible actors:** correct `deployer` (the office running it);
  partial `fornitore_esterno` (vendor defensible, incomplete).
- **Evidence list:** (0) error analysis — 71% of flags closed without fraud,
  concentrated on single-parent and foreign-born households [supports risk];
  (1) internal workflow — automatic suspension at flag, human check only on
  appeal [decisive: oversight exists only on paper]; (2) vendor press sheet on
  savings [distractor].
- **Correct path:** cite 0+1 → alto_rischio → oversight → deployer → motivation 1.
- **Contestable paths:** vietata + blocco (over-caution, explained); measure
  `informare` alone (partial — transparency without fixing oversight).
- **Corrective measures:** correct `oversight`, `audit`, `dati_logging`;
  partial `informare`.
- **City consequences:** standard alto-rischio deltas (no scoring change).
- **Accessibility:** as dossier 1.
- **Sources:** EUR-Lex Annex III(5)(a), Arts. 14 and 26; Commission pages
  (see /sistemi-ai-ad-alto-rischio/ and /en/high-risk-ai-systems/).
- **Legal-review checklist:** classification traced ✓; Art. 5 boundary
  discussed as contestable, not asserted ✓; fictionalised (no real-country
  claims) ✓; third-party review pending ✓.

---

## Shared engineering notes
- Scoring rules untouched: both cases plug into the existing evaluation with
  golden solutions added to `tests/gameplayInvariants.test.ts` (13 cases).
- Chapters: predpol → "Pratiche vietate" (5 cases); frodi → "Alto rischio"
  (4 cases); durations updated; free selection unchanged.
- Map: two new locations (`commissariato`, `sussidi`); the `sussidi` marker
  reuses the `icon_doc` glyph (no new binary assets introduced).
- All public "11 cases" mentions (site pages, llms.txt, press kit, README,
  release.config.json) move to 13 in this PR — enforced where test-pinned.
