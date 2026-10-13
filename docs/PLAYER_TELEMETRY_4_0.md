# Sprint Analytics A: Player Telemetry

14 ottobre 2026. Base Git `1b41261`, ramo `codex/player-telemetry-v4`.
La base contiene localizzazione francese (`11b5915`), Gameplay UX (`6dc882d`)
e Mobile UX (`1b41261`). Nessun deploy o collegamento a una raccolta reale.

## Audit e decisioni

Il sistema precedente aveva 16 nomi ammessi, provider off/console/Plausible/Umami,
DNT e trasporto iniettabile. Accettava stringhe brevi arbitrarie e numeri non
finiti. `page()` accettava nomi liberi. `game_started` comprendeva anche la
continuazione e `evidence_opened` indicava l'ingresso nella schermata Evidence.
Rientrare nel contesto poteva duplicare un avvio di caso. Due eventi portavano
il completamento e il suo risultato. Le precedenti istruzioni privacy affermavano
un'esenzione dal consenso che il solo codice non poteva dimostrare.

I segnali tutorial, aiuto, citazione errata, debrief e ripasso esistevano gia
nel bus `gameplay-ux`. Il nuovo subscriber li riusa; non crea un secondo bus
o un secondo stato applicativo. Un subscriber per istanza, con teardown.

Il beacon Cloudflare era presente anche nella shell `/play/`: e stato rimosso
da questa route per rendere verificabile l'assenza di invii all'apertura del
gioco. Le pagine pubbliche non sono state modificate. Non sono stati introdotti
SDK, servizi, endpoint, cookie o identificatori del giocatore.

## Schema eseguibile

`src/game/systems/analyticsSchema.ts` e la fonte autoritativa. Il catalogo contiene
32 nomi accettati, uno dei quali e l'alias legacy `case_result`; i payload emessi
usano quindi 31 nomi canonici. `AnalyticsEvent`, `AnalyticsProperties`,
`AnalyticsPayload` e `AnalyticsAggregate` sono tipizzati.
`validatePayload()` e `validateAggregate()` respingono chiavi estranee, versioni
sconosciute, enum non ammessi, casi sconosciuti e conteggi non interi o non finiti.
`track()` sanitizza e valida prima di scrivere nel buffer. Gli eventi che richiedono
un caso vengono scartati se non esiste il corrispondente tentativo osservato.

```json
{
  "schemaVersion": 1,
  "gameVersion": "4.0-candidate",
  "event": "case_completed",
  "properties": {
    "language": "fr",
    "mode": "turno",
    "phase": "decision",
    "caseId": "case_scoring",
    "result": "wrong",
    "durationBucket": "1_to_5m",
    "hintUsed": true
  },
  "count": 1
}
```

| Campo | Vocabolario |
| --- | --- |
| schemaVersion | `1` |
| gameVersion | `4.0-candidate`, versione dello sprint locale, non una dichiarazione di rilascio pubblico |
| language | `it`, `en`, `fr` |
| mode | `turno`, `libera`, `sorpresa`, `ripasso` |
| phase | `menu`, `briefing`, `map`, `case`, `evidence`, `incident`, `decision`, `report`, `consequence`, `norm`, `archive`, `glossary`, `session_end`, `finale`, `learning`, `credits` |
| caseId | Gli identificativi dei 14 casi giocabili, derivati da `PLAYABLE_CASES`; non un ID personale |
| result | Categoria gia calcolata dal gioco: `correct`, `partial`, `wrong` |
| hintUsed | Booleano: almeno una richiesta esplicita di aiuto osservata nel tentativo |
| durationBucket | `<60s`, `[60,300)s`, `[300,900)s`, `[900,1800)s`, `>=1800s`, codificati nelle cinque stringhe di `DURATION_BUCKETS` |
| tutorialVersion | `investigation-v1`, solo per i tre eventi tutorial |
| count | Intero da 1 a 1.000.000, quantita della cella aggregata |

Ogni evento ha una propria lista di proprieta obbligatorie/facoltative in
`EVENT_CATALOG`. Lingua, modalita e fase sono comuni. Non vengono trasmessi
indici delle prove, numero delle prove pertinenti, classificazione, misura,
soggetto scelto, motivazione, rapporto, query archivio, riflessioni, seed,
nomi, email, IP, user agent, referrer, schermo, URL corrente o identificatori
permanenti. I valori esclusi non finiscono nei log dei dati scartati.

## Catalogo completo

Nella colonna proprieta sono riportati i campi oltre al contesto comune.
"Tentativo" indica l'unita descritta sotto, non una persona.

| Evento | Punto di osservazione | Proprieta | Deduplicazione |
| --- | --- | --- | --- |
| game_opened | Boot del documento | Nessuna | Una volta per documento |
| game_started | Conferma di una nuova partita in Title | Nessuna | Una volta nel nuovo periodo osservato |
| game_resumed | Continua in Title; ripasso iniziato senza periodo attivo | Nessuna | Una volta nel nuovo periodo osservato |
| game_session_ended | Ritorno a Title, nuova partita o pagehide non-BFCache | durationBucket | Una volta per periodo; nessun flush |
| language_selected | Cambio esplicito della lingua nei comandi | Nessuna | Scarta doppie selezioni consecutive identiche |
| mode_selected | Cambio esplicito della modalita nel pannello | Nessuna | Scarta doppie selezioni consecutive identiche |
| case_started | CaseScene: nuovo tentativo osservato | caseId | Rientro nello stesso tentativo incompleto non ricontato |
| case_completed | Rapporto calcolato e archiviato in memoria dal gioco | caseId, result, durationBucket, hintUsed | Una volta per tentativo |
| case_abandoned | Navigazione osservata fuori dal fascicolo incompleto o sua sostituzione esplicita | caseId, durationBucket, hintUsed | Una volta per tentativo |
| session_completed | SessionEnd con piano non vuoto, concluso e non libero | durationBucket | Primo piano concluso nel periodo osservato |
| evidence_opened | Prima apertura effettiva di un singolo reperto | caseId | Un'apertura per reperto nel tentativo; indice solo interno |
| evidence_cited | Prima citazione effettiva di un singolo reperto | caseId | Un evento per reperto nel tentativo; rimozione/ricitazione non ricontate |
| citation_error | Segnale esistente quando `cluesOk` e falso alla firma | caseId | Una volta per tentativo |
| hint_requested | Segnale esistente help_requested; aperture esplicite di guida, contesto, norma, termini o archivio contestuale | caseId | Una richiesta per apertura; la chiusura non conta |
| decision_submitted | Conferma della decisione completa, valutata alla firma | caseId, hintUsed | Una volta per tentativo |
| report_signed | Dopo archiviazione del rapporto applicativo | caseId, result, hintUsed | Una volta per tentativo |
| tutorial_started | Segnale InvestigationGuide.begin del primo caso eleggibile | caseId, tutorialVersion | Una volta nel tentativo che emette il segnale |
| tutorial_skipped | Segnale di salto esplicito della guida | caseId, tutorialVersion | Una volta per tentativo |
| tutorial_completed | Segnale esistente a firma del primo caso con guida attiva | caseId, tutorialVersion | Una volta per tentativo |
| debrief_opened | Prima apertura effettiva nel ReportScene | caseId, result | Una volta per tentativo; riaperture non ricontate |
| review_started | beginReview riuscito: segnale StateManager esistente | Nessuna | Primo uso nel periodo osservato |
| clues_selected | Avanzamento dalla schermata Evidence | caseId | Legacy, una volta per tentativo; nessun dettaglio delle risposte |
| classification_selected | Prima scelta di classificazione | caseId | Legacy, una volta per tentativo; valore non raccolto |
| measure_selected | Prima scelta di misura | caseId | Legacy, una volta per tentativo; valore non raccolto |
| case_result | Ingresso legacy | Come case_completed dopo normalizzazione | Alias di case_completed: non crea un secondo payload o completamento |
| norm_unlocked | Visualizzazione della carta norma | caseId facoltativo | Legacy, una volta per tentativo noto; non e una misura di sblocchi unici |
| archive_opened | Ingresso in ArchiveScene | Nessuna | Una visita per creazione scena |
| ending_reached | Ingresso nel finale del gioco | Nessuna | Una volta per periodo |
| game_completed | Finale generale, distinto dal piano didattico | Nessuna | Una volta per periodo; non sommare a session_completed |
| credits_opened | Ingresso nei crediti | Nessuna | Una visita per creazione scena |
| reset_game | Comando di reset esistente | Nessuna | Gesto esplicito |
| pageview | Cambiamento fra scene del vocabolario chiuso | Nessuna | Una prima vista e cambiamenti di scena; callback coincidenti non duplicano |

L'evidence_opened precedente aveva una semantica diversa: lo schema 1 non deve
essere sommato a esportazioni precedenti senza migrazione documentata.
decision_submitted, report_signed e case_completed descrivono momenti dello
stesso gesto applicativo. Sono contatori separati per controllo qualita, non
tre risultati da sommare. Lo sblocco effettivo delle norme resta nel gioco.

## Unita di osservazione e limiti

- **Periodo/sessione osservata:** esecuzione in questo documento iniziata dalla
  conferma nuova/continua. Una nuova conferma chiude la precedente. Il ritorno
  a Title e pagehide con persisted=false la chiudono. Non e un giocatore unico.
  La durata monotona include lettura, pause e inattivita; non e tempo attivo.
- **Completamento didattico:** primo piano naturale concluso mostrato da
  SessionEnd nel periodo; libera non ha questa conclusione. Il finale generale
  usa game_completed e resta una misura distinta.
- **Tentativo:** case_started fino a firma o uscita positiva osservata. Tornare
  al contesto nello stesso tentativo non lo riavvia. Dopo uscita o reload una
  nuova apertura e una nuova osservazione, anche se ripristina una bozza.
- **Abbandono osservabile:** uscita esplicita da un fascicolo ancora incompleto.
  Non viene inferito da un intervallo senza eventi, chiusura tab, crash, offline
  o assenza di case_completed. Nessuna finestra di inferenza viene applicata.
  Un periodo di reporting futuro e la finestra dei conteggi, non una coorte.
- **Errore di citazione:** valutazione cluesOk=false del ReportSystem esistente.
  Puo coesistere con altri errori; non identifica da solo l'errore dominante.
- **Tutorial:** inizializzazione eleggibile osservata e salto/completamento
  segnalati dall'UX esistente. Started non prova lettura o comprensione. Una
  guida saltata e richiamata puo avere sia skipped sia completed.
- **Ripasso:** prima entrata riuscita nel piano temporaneo in memoria. Non
  prova completamento del ripasso o miglioramento dell'apprendimento.
- **Aiuto:** richiesta esplicita nei comandi strumentati. hintUsed=false significa
  nessun aiuto osservato, non assenza di spiegazioni automatiche o aiuti esterni.

Nessuna consegna affidabile alla chiusura viene promessa. BFCache conserva
la stessa esecuzione; un'eventuale espulsione silenziosa puo non avere un end.
Riaperture, reload e nuove conferme non sono riconciliati fra documenti.
Un ripasso dentro una sessione puo cambiare mode negli eventi di caso senza
produrre un altro avvio: i rapporti aggregati non sono conversioni per coorte.

## Definizioni delle metriche

Sia N(e) la somma di count per evento e filtro nel periodo di ricezione del
futuro collettore. Oggi non esistono dati di produzione. Non utilizzare il
numero di richieste HTTP o i "visitatori unici" del provider come N(e).

| Metrica | Numeratore | Denominatore | Unita e limite interpretativo |
| --- | --- | --- | --- |
| Avvii osservati | N(game_started)+N(game_resumed) | Nessuno | Periodi iniziati; non persone o browser unici |
| Nuove partite / riprese | N(game_started) / N(game_resumed), separati | Avvii osservati, se serve la quota | Conferme; salvataggi possono essere piu vecchi della finestra |
| Fine osservata | N(game_session_ended) | Avvii osservati | Copertura degli end, non retention o durata media; chiusure perse e finestre tagliate |
| Cambio lingua / modalita | N(language_selected) / N(mode_selected), separati | Nessuno | Selezioni esplicite; non distribuzione dei giocatori |
| Tentativi iniziati | N(case_started) | Nessuno | Tentativi per caso; reload e rientri dopo uscita contano di nuovo |
| Completamenti / avvii | N(case_completed) | N(case_started) | Rapporto aggregato di eventi; puo superare 1 in finestre diverse, non conversione individuale |
| Abbandoni osservati / avvii | N(case_abandoned) | N(case_started) | Quota di uscite positive osservate; sottostima le cessazioni non osservabili |
| Esiti per caso | N(case_completed filtrato per result) | N(case_completed) | Distribuzione di categorie; difficolta manuale non raccolta, nessuna misura causale di competenza |
| Decisioni / firme | N(decision_submitted) e N(report_signed) | L'uno rispetto all'altro per qualita strumentazione | Momenti accoppiati nella stessa azione; non sommare come risultati diversi |
| Piani conclusi | N(session_completed) | Avvii osservati esclusa libera, solo come rapporto descrittivo | Primo piano per periodo; cambi modalita, ripasso e completamenti tardivi impediscono un funnel individuale |
| Reperti aperti / citati | N(evidence_opened) e N(evidence_cited) | N(case_started), se serve la media osservata | Gesti distinti per reperto/tentativo; bozze ripristinate non ricontate, numero di reperti diverso per caso |
| Errori di citazione | N(citation_error) | N(decision_submitted) | Tentativi valutati con errore sulle prove; non errori per singola risposta |
| Richieste di aiuto | N(hint_requested) | N(case_started) | Aperture medie osservate; puo superare 1 e non misura bisogno cognitivo |
| Rapporti con aiuto | N(case_completed con hintUsed=true) | N(case_completed) | Uso osservato tra rapporti prodotti; associazione, non effetto dell'aiuto sull'esito |
| Tutorial iniziati | N(tutorial_started) | Nessuno | Inizializzazioni eleggibili osservate, non lettori unici |
| Tutorial saltati / conclusi | N(tutorial_skipped) / N(tutorial_completed), separati | N(tutorial_started) | Rapporti descrittivi; non categorie esclusive, guida persistente puo attraversare tentativi |
| Debrief consultati | N(debrief_opened) | N(report_signed) | Prime aperture per rapporto/tentativo; non comprensione e non tasso individuale |
| Uso ripasso | N(review_started) | Avvii osservati senza filtro mode, se serve un rapporto | Prima entrata per periodo; filtrare solo ripasso nel denominatore perderebbe le entrate da una partita normale |
| Durate | N(e filtrato per durationBucket) | N(e con durationBucket), separatamente per completamento, abbandono, fine periodo e piano | Istogrammi separati; nessuna media esatta, pause incluse |

Un denominatore zero produce "non calcolabile", non zero percento. Mostrare
sempre numeratore, denominatore, finestra di ricezione e scarti. Non combinare
versioni di schema o gameVersion senza verificare la semantica. Ricezione e
momento effettivo del gesto possono differire: non c'e una data-evento client.

## Aggregazione, retention e accessi

Buffer locale di sole celle, massimo 512, count massimo 1.000.000. Le celle
scartate e i conteggi saturati sono diagnosticati. Il codice aggiorna comunque
il ciclo del tentativo: un buffer pieno non trasforma un caso firmato in abbandono.
Il buffer non e persistito e disable() lo cancella. Nessun timer di invio o flush
di uscita. Il provider off non costruisce neppure i contatori.

I due adapter remoti preesistenti hanno ora un'approvazione strutturale distinta
dalle variabili del provider, lista esatta di endpoint HTTPS, configurazione
copiata e congelata, percorso canonico /play/, nessun referrer o credenziale
del browser. Gli invii sono solo espliciti, asincroni e gestiti in caso di errore.
I payload provider aggiungono solo metadati statici del sito: dominio/website ID,
schema/versione e count. Il formato Umami usa hostname fisso www.no-ai-act.eu,
non location.hostname o informazioni del dispositivo.

Nessun backend e stato implementato o autorizzato. Prima di collegarlo occorrono:
destinazione e titolare, regole sui log HTTP, accessi nominativi autorizzati,
policy effettive di conservazione, informativa/base giuridica e consenso quando
necessario, test di cancellazione, errori e spegnimento. Le soglie proposte nello
sprint originale (celle pubbliche con almeno 10 osservazioni, 30 giorni di dati
pre-aggregazione e 12 mesi di aggregati) sono proposte da riesaminare, non
controlli lato server gia applicati. Limitare incroci e filtri e non pubblicare
celle rare; dieci osservazioni non significano dieci persone diverse.

## Rischi residui e fonti primarie

1. IP e header HTTP possono associare richieste anche con un payload minimo.
   La [Commissione europea](https://commission.europa.eu/law/law-topic/data-protection/information-business-and-organisations/application-gdpr_en)
   include gli indirizzi IP fra gli esempi di dati personali; questa implementazione
   non dichiara anonimo un futuro flusso remoto.
2. I provider possono ricavare propri identificativi e informazioni dai metadati:
   [Plausible Events API](https://plausible.io/docs/events-api) descrive l'uso di
   IP/User-Agent per il conteggio univoco;
   [Umami Sending stats](https://docs.umami.is/docs/api/sending-stats) richiede un
   User-Agent e mostra sessionId/visitId nella risposta. Il client qui non legge
   o conserva tali identificativi, ma il backend richiede una revisione separata.
3. Combinazioni di caso, lingua, modalita, aiuto e durata, o un batch proveniente
   dallo stesso dispositivo, possono essere rare e ricorrelabili. Non sono stati
   introdotti fingerprint o ID client, ma cio non certifica anonimizzazione.
4. Un retry manuale dopo una risposta persa puo duplicare una consegna. Non esiste
   un protocollo di idempotenza remoto; non viene aggiunto di nascosto un ID
   persistente per risolverlo. Il futuro collettore deve dichiarare il compromesso.
5. Il collettore non esiste: retention, accessi, revoca, cancellazione e soppressione
   celle devono essere verificati nell'infrastruttura. I
   [principi GDPR della Commissione](https://commission.europa.eu/law/law-topic/data-protection/information-business-and-organisations/principles-gdpr_en)
   comprendono minimizzazione e limitazione della conservazione; nessuna esenzione
   automatica dal consenso viene dedotta dal codice.
6. Offline, reload, BFCache, finestre temporali, difficolta non raccolta e saturazione
   limitano i rapporti di conteggi. I contatori non sono utenti unici, funnel per
   coorte, una valutazione degli studenti o prova di apprendimento.
7. Il debug locale e le fixture di QA restano sotto controllo dello sviluppatore;
   i risultati sintetici non sono dati di produzione. Gli adapter non sono stati
   provati contro un provider reale e non sono una certificazione della sua privacy.

## Verifiche e riproduzione

I test unitari coprono enum, versioni, campi vietati, NaN/Infinity, richieste
orfane, doppie firme, alias, deduplicazione dei reperti, ripristino bozze,
navigazione/abbandono, durate, saturazione, DNT, sottoscrizione unica, IT/EN/FR,
autorizzazione endpoint, credenziali/referrer, errori sync/async e flush concorrente.
Un vecchio test firma estraeva anche i metodi successivi con una slice testuale:
ora usa il parser TypeScript per verificare esattamente sign(), conservando
le asserzioni su completezza e guardia contro le doppie firme.

Lo smoke analytics usa comandi HTML reali in tre lingue: cambi lingua/modalita,
guida saltata e richiamata, tre reperti aperti, due citati con rimozione/ricitazione,
firma ripetuta sul vecchio comando, debrief riaperto, fine piano, continua,
ripasso e uscita positiva. FR esegue il percorso offline. DNT gioca comunque
un caso ma produce zero celle. Le fixture non escono dalla macchina.
Il test cattura e vieta richieste esterne o POST di telemetria.

Lo smoke privacy sulla build di produzione gioca e firma un caso e osserva
visibilitychange, pagehide, unload e un'uscita reale verso about:blank. Non
consente endpoint remoti o raccolte di pari origine e controlla che l'handle
di debug non sia esposto. Le prove browser sono Chromium emulato.

Risultati: typecheck PASS; build PASS (resta il warning dimensionale Phaser
preesistente); 1.324 test unitari PASS in 78 file. Smoke analytics PASS su
IT/EN/FR, FR offline e DNT, zero tentativi di richieste di telemetria. Ogni
percorso di lingua produce 44 celle aggregate sintetiche validate. Smoke
privacy della build PASS: zero richieste esterne, zero all'uscita, zero corpi
trasmessi. Verifica dist PASS: 107/107 pagine, HTML senza mojibake e senza
form esterni. Il gate completo smoke:all e stato aggiornato, ma non rieseguito
integralmente in questo sprint; sono stati eseguiti i due smoke pertinenti.
I dati, ReportSystem, StateManager e SaveSystem sono invariati rispetto a
1b41261. Non sono stati eseguiti test su un provider remoto reale.

Artefatti sintetici:
`scripts/smoke/out/analytics/results.json` (ignorati da Git).

```text
npm run typecheck
npm test
npm run build
npm run smoke:analytics
npm run smoke:privacy
```

Lo smoke analytics possiede e chiude il server locale 4213. Lo smoke privacy
usa BASE (default 4200); il preview disponibile in questa revisione e 4212.
Tutti i comandi sono eseguibili con Node 24 e Playwright gia presenti nel progetto.

## File modificati

- Schema, sistema e subscriber: `src/game/systems/analyticsSchema.ts`,
  `AnalyticsSystem.ts`, `analyticsInstrumentation.ts`, `InvestigationGuide.ts`.
- Collegamento: `src/main.ts`, `src/game/GameConfig.ts`.
- Scene: `TitleScene.ts`, `CaseScene.ts`, `EvidenceScene.ts`, `DecisionScene.ts`,
  `ReportScene.ts`, `ArchiveScene.ts`, `NormCardScene.ts`, `SessionEndScene.ts`,
  `FinaleScene.ts` in `src/game/scenes/`.
- Shell e configurazione esempio: `play/index.html`, `.env.example`.
- Test: `tests/analytics.test.ts`, `decisionSign.test.ts`, `learningExperience.test.ts`,
  `noExternalForms.test.ts`, `privacyGuards.test.ts`, `navigationAudit.test.ts`,
  `landing.test.ts`, `a11yLayer.test.ts`.
- Smoke: `scripts/smoke/analytics-smoke.mjs`, `privacy-smoke.mjs`, `run-all.mjs`,
  `package.json`.
- Documentazione: `docs/ANALYTICS.md`, `SPRINT_ANALYTICS_4_0.md`, `GUARDRAILS.md`,
  questo documento, `CHANGELOG.md`, nota endpoint in `release.config.json`.

Casi, soluzioni, matrice normativa, ReportSystem, StateManager, SaveSystem e
schema del salvataggio non sono stati modificati.
