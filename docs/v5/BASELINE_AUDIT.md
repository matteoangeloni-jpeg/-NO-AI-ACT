# Baseline V4 — 12 novembre 2026

Origine: worktree `no-ai-act-fr` (ed915a1, modifiche locali preservate). Base isolata: GitHub main 2a98f76. package.json: 4.0.0; release.config.json: v4.0.0; ultimo tag nel clone: v2.2.0. La pagina pubblica /play/ risponde e carica play-CkASNhMI.js; il commit del bundle pubblico non è stato verificato. La consultazione delle PR aperte non ha restituito voci.

| Area | Stato | Evidenza |
|---|---|---|
| Casi | Esiste | src/game/data/cases.ts: scoring, lavoro, media, scuola, ospedale, biometria, credito, chatbot, procurement, edtech, gpai, predpol, frodi, bias |
| Lingue | Esiste | release.config.json e src/game/i18n: IT/EN/FR giocabili; DE/ES/PT editoriali |
| Modalità | Esiste | src/game/data/gameModes.ts: Turno, Libera, Sorpresa, Ripasso |
| Salvataggi | Esiste | SaveSystem.ts; chiave no-ai-act-save-v2, migrazione da v1; tests/saveCompat.test.ts |
| Guida | Parziale | InvestigationGuide.ts e InvestigationGuideOverlay.ts: guida contestuale già presente, eleggibilità legata al primo caso del piano |
| Confronto | Parziale | EvidenceCompareOverlay.ts: affianca coppie citate e indica fonti e funzione; non modifica il rapporto |
| Contraddizione | Parziale | EvidenceScene.markContradiction: controlla una coppia predefinita fra i citati, mostra esito e marca le schede nella scena; nessun dato nel punteggio o nel rapporto |
| Decisione / feedback | Esiste | DecisionScene.ts, DecisionDebriefOverlay.ts, DecisionIssues.ts; comprensione da verificare |
| Mobile e accessibilità | Esiste | mobilePresentation.ts e ReadingLayer; verifica con dispositivi e lettori di schermo ancora da svolgere |
| Classe | Esiste | TeacherGuideOverlay.ts, TeacherReportSystem.ts, docs/TEACHER_MODE.md |
| Telemetria | Esiste nel codice | docs/TELEMETRY_SCHEMA_V2.md e docs/TELEMETRY_PRIVACY_SECURITY_V2.md; raccolta live non verificata |
| Ricerca | Solo architettura | docs/RESEARCH_MODE_ARCHITECTURE.md e tests/researchMode.test.ts; nessun flusso attivato da questa modifica |
| CI | Esiste | .github/workflows/deploy.yml, script npm e smoke Playwright; vedere rapporto per gli esiti effettivi |

Le cifre del piano su docenti e utilizzo restano riferimenti storici non verificati qui. Gli eventi non contano persone e non misurano apprendimento.
