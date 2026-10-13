# Sprint Gameplay 4.0: candidata locale per playtest

Base: `11b5915`, ramo `codex/gameplay-ux-v4`. Nessun deploy, push o merge.

## Implementato

- Primo fascicolo del Turno: indicazione contestuale per consultare, citare,
  confrontare, decidere e firmare. Guida completa richiamabile, salto facoltativo,
  nessun vincolo aggiunto e nessuna soluzione specifica nei testi.
- Riepilogo: esplicita classificazione, misura, responsabile, motivazione e prove;
  lo strato di lettura comprende le scelte, i titoli dei reperti e il rapporto fra
  motivazione ed evidenza. Distinzione fra esito corretto e giustificazione.
- Conseguenze: prima/dopo/variazione dei quattro indicatori gia calcolati,
  insieme alla narrazione esistente. Nessuna anticipazione prima della firma.
- Debrief: prima vista con rilievo principale, prove decisive e lezione del caso;
  seconda con norma, concetti, assi e riflessione. Nessun nuovo voto.
- Ripasso: collegamento dal debrief ai casi parziali/errati selezionati dal piano
  esistente. La sessione e temporanea: gli originali restano nello storage v2,
  i nuovi tentativi non li sostituiscono. Uscire sulla mappa o sul titolo ripristina
  la progressione; ricaricare recupera direttamente il salvataggio originale.
- Modalita: obiettivo, assistenza, difficolta proposta e conclusione leggibili.
  Ripasso vuoto disabilitato; durata stimata, non un timer.

Il ripasso non salva nuovi progressi: e una scelta esplicita per mantenere il
rapporto originale, non un confronto persistente fra tentativi. Un archivio dei
tentativi richiederebbe un intervento separato sul modello dati. Le preferenze
modificate durante la sessione temporanea non sostituiscono quelle originali.
Il salto della guida resta in memoria fino al ricaricamento: non aggiunge campi
al salvataggio. Si puo firmare senza aprire la guida o il confronto.

## Confini preservati

`cases.ts`, `indicators.ts`, `ReportSystem.ts`, `SaveSystem.ts` e `gameModes.ts`
sono invariati rispetto alla base. Restano 14 casi e le stesse regole di
valutazione, selezione e ordine dei piani. Cambia l'esecuzione del ripasso:
non passa piu dal reset distruttivo della partita e mantiene fermo il piano
durante la sessione, anziche ricalcolarlo dai nuovi esiti temporanei.

## Punti eventi futuri

Bus: `StateManager.emit('gameplay-ux', { event, caseId? })`.
Non esistono nuovi subscriber verso AnalyticsSystem, rete o storage.

| Evento | Punto | Significato |
| --- | --- | --- |
| tutorial_started | InvestigationGuide.begin | Primo avvio della guida contestuale in memoria |
| tutorial_skipped | InvestigationGuide.skip | Scelta esplicita di proseguire senza guida |
| tutorial_completed | InvestigationGuide.complete | Prima firma con guida attiva; non prova che ogni consiglio sia stato seguito |
| first_case_completed | DecisionScene.resolve, prima della registrazione | Firma quando non esistono casi completati |
| help_requested | InvestigationGuide.recall | Apertura esplicita della guida investigativa |
| citation_error | DecisionScene.resolve, dopo evaluateReport | Il risultato gia calcolato ha cluesOk=false |
| debrief_opened | ReportScene, azione debrief | Apertura tramite comando del giocatore |
| review_started | StateManager.beginReview | Avvio riuscito del piano temporaneo |

Gli eventi non sono ancora metriche: ricaricamenti possono ripeterli. Gli aiuti
normativi preesistenti non sono conteggiati come aperture della nuova guida.
Non inviare testo libero, scelte di riflessione o contenuti dei reperti.

## Verifiche

- Typecheck e build: PASS con Node 24.19.0. Resta l'avviso dimensionale del
  bundle principale (circa 1.75 MB non compresso), non un errore di compilazione.
- Test unitari: 1261 PASS, 77 file.
- Smoke Gameplay UX: PASS in IT/EN a 1920px, FR a 390px touch e 3840px,
  con movimento ridotto. Guida ignorabile/richiamabile, quattro modalita,
  ripasso vuoto disabilitato, riepilogo e due viste debrief controllati.
- Tutti i 14 casi attraversati fino alla norma acquisita con risultato corretto.
  Ripasso completato e abbandonato senza alterare lo storage originale.
- Audit SEO: 107 percorsi, nessun difetto critico e nessun avviso.
- Verifica dist: 107/107 pagine inventariate, HTML senza mojibake e sitemap valide.
- Regressioni browser preesistenti: gameplay, keyboard, draft, privacy, layout,
  audio, action-layer, inspector-desk, visual-language (8 giri IT/EN/FR) e
  press-pages PASS. Il primo runner aggregato termina con errore perche il vecchio
  test gameplay cercava l'approfondimento prima di aprire la nuova scheda norma;
  aggiornato il percorso del test, la riesecuzione gameplay separata e PASS.
  Non e stato rieseguito l'intero runner aggregato dopo questa modifica al test.
Gli screenshot rigenerabili sono in `scripts/smoke/out/gameplay-ux/`.
Esempi: `it-1920-tutorial.png`, `it-1920-summary.png`,
`it-1280-consequences.png`, `fr-3840-debrief.png`, `fr-390-summary.png`.
Lo smoke UX e gli screenshot precedono tre correzioni non visive (eventi del
ripasso, evento confronto solo con guida attiva, pulizia metadati temporanei),
incluse nei test unitari e nella build finale.

Limiti da non confondere con un PASS automatico: su 390px il canvas mantiene il
layout desktop ridimensionato, quindi il testo e molto piccolo. Restano avviso
mobile e modalita Testo schermata. Non e stata realizzata una nuova UI mobile.
L'esposizione semantica viene verificata nel DOM, non con una sessione reale
NVDA/VoiceOver. La leggibilita e la comprensione vanno osservate con persone.

## File coinvolti

- `src/game/i18n/gameplay.ts`, `it.ts`, `en.ts`, `fr.ts`: nuovi testi tipati.
- `src/game/systems/InvestigationGuide.ts`: progressione guida ed eventi locali.
- `src/game/ui/InvestigationGuideOverlay.ts`: aiuto facoltativo accessibile.
- `src/game/scenes/CaseScene.ts`, `EvidenceScene.ts`, `DecisionScene.ts`: guida
  contestuale e trasparenza del riepilogo.
- `src/game/ui/EvidenceCompareOverlay.ts`: segnala la consultazione del confronto.
- `src/game/scenes/ConsequenceScene.ts`: indicatori prima/dopo/variazione.
- `src/game/scenes/ReportScene.ts`, `src/game/ui/DecisionDebriefOverlay.ts`:
  debrief e accesso al ripasso, reading layer arricchito.
- `src/game/systems/StateManager.ts`, `src/game/scenes/TitleScene.ts`,
  `CityMapScene.ts`, `SessionEndScene.ts`: ripasso non distruttivo e descrizioni.
- `tests/gameplayUx.test.ts`: prove eseguibili su stato, salvataggi e guida.
- `tests/gameModes.test.ts`: delimitazione della funzione nel controllo statico.
- `tests/frenchSite.test.ts`: mantiene parita completa delle chiavi consentendo
  l'aggiunta dei testi Gameplay oltre alle 1408 stringhe della base.
- `scripts/smoke/gameplay-ux-smoke.mjs`, `package.json`: controlli browser mirati.
- `scripts/smoke/gameplay-smoke.mjs`: apre la scheda norma prima di verificare
  il collegamento interno di approfondimento.
- `CHANGELOG.md` e questo documento: consegna e protocollo di playtest.

Per riprodurre con Node 24:

```powershell
npm ci
npm run typecheck
npm test
npm run build
npm run audit:seo
npm run verify:dist
npm run preview -- --port 4212 --strictPort
```

In un secondo terminale: `node scripts/smoke/gameplay-ux-smoke.mjs`.
Gli altri smoke usano `BASE=http://localhost:4212` oppure il loro runner
`npm run smoke:all`, che gestisce autonomamente la porta 4200.

## Playtest con sei partecipanti

Obiettivo: verificare se le persone comprendono indagine, decisioni, valutazione
e conseguenze. Non misurare efficacia didattica da sei osservazioni.

1. Reclutare tre persone senza familiarita con AI Act e tre giocatori abituali,
   senza presumere categorie esclusive. Usare codici P01-P06, non nomi nel gioco.
2. Sessioni individuali da 30-40 minuti, stessa build e primo caso del Turno.
   Spiegare soltanto: "Conduci l'indagine e consegna il rapporto". Registrazioni
   audio/video solo con consenso esplicito e un piano separato di conservazione.
3. Osservare senza guidare: scelta modalita, apertura di un reperto, citazione,
   confronto, motivazione e firma. Annotare esitazioni, tentativi e richieste
   d'aiuto. Intervenire dopo un blocco di due minuti e registrare l'intervento.
4. Dopo la firma chiedere: "Che cosa e stato valutato? Quale prova sostiene la
   motivazione? Che cosa e cambiato nella citta? Una classificazione corretta
   basta?" Non suggerire le risposte durante la prova.
5. Chiedere di aprire il debrief e avviare/uscire dal ripasso se disponibile.
   Verificare che comprendano la conservazione del rapporto originale. Se il
   primo esito e corretto, usare una fixture locale separata chiaramente dichiarata.
6. Assegnare due prove con tastiera, due su schermo piccolo/tocco e due con
   impostazioni abituali. Includere francofoni/anglofoni per giudicare davvero
   quei testi; la sola simulazione del browser non valida la traduzione.
7. Criterio esplorativo: almeno 5/6 citano e firmano senza intervento e spiegano
   la differenza fra conclusione e motivazione. Conservare separatamente esiti
   osservati, interpretazioni del facilitatore e proposte di cambiamento.

Scheda per partecipante: dispositivo/lingua, modalita compresa, cita senza aiuto,
confronta, firma, spiega valutazione, identifica prova, legge variazioni, comprende
ripasso, interventi, ostacoli e breve citazione facoltativa priva di dati personali.
Non chiamare il superamento degli smoke una validazione con persone reali.
