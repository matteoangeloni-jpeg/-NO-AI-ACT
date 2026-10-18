# NO AI ACT 4.0 - Final QA e preparazione playtest

Data: 14 ottobre 2026. Branch `codex/final-qa-v4`, base `a92b264`.
Verdetto: **GO per playtest locali controllati; NO-GO per pubblicazione/invio
stampa e attivazione della telemetria reale**. Nessuna regressione critica nuova
emersa nei percorsi eseguiti; i residui manuali e di integrazione sono espliciti.
Nessun push, merge, deploy, tag o attivazione di raccolta reale.

## Integrita e perimetro

Worktree inizialmente pulito. Catena verificata nella storia: FR `11b5915`,
Gameplay `6dc882d`, Mobile `1b41261`, Analytics A `dcd9665`, Backend B `424b45c`,
Sprint C `a92b264`. Le funzionalita sono state percorse, non dedotte dal changelog.
I tre commit divergenti `2bff4bd`, `f570ba5`, `102e315` dell'altro ramo restano
da riconciliare col proprietario; nessuna integrazione automatica o modifica
dell'altro worktree. Questo non prova di per se una funzione mancante.

Confronto con `11b5915`: dati dei 14 casi, matrice normativa, ReportSystem,
SaveSystem, CaseSystem e NormSystem invariati. Nessun nuovo punteggio, caso,
modalita, schema dei salvataggi o dipendenza.

## Difetti riprodotti e correzioni

1. Sorpresa: `startPlanned` leggeva il piano, poi cambiava il seme prima di
   avviare. Riproduzione nel browser: secondo caso previsto `case_biometria`,
   piano attivo `case_frodi`. Ora l'estrazione avviene aprendo il pannello o
   selezionando Sorpresa; INIZIA non cambia il piano. RIEStrai resta disponibile.
   La prova confronta il piano interno prima/dopo la CTA: il riepilogo visibile
   mostra conteggio, stima e difficolta, non i nomi dei singoli fascicoli.
2. Primo briefing: la CTA e Enter ignoravano la modalita e aprivano sempre
   `firstCaseId()`. Riprodotto scegliendo Libera: aperto `case_scoring` anziche
   la mappa. Ora un unico callback usa mappa Libera o primo fascicolo del piano.
3. Test storico primo minuto: asseriva una chiamata Case inline nel gestore
   Enter. Aggiornato per verificare il callback comune a CTA/tastiera; nuove
   regressioni e percorsi reali verificano il rispetto del piano.
4. Gate: aggiunto diario JSON incrementale con SHA, impronta del diff e indice
   della build, runtime, durata ed esito di ogni job. Nessuna asserzione rimossa,
   nessuna riduzione della matrice, un fallimento non nasconde i job successivi.
5. Protocollo: ora osserva obiettivo e scelta della modalita prima di assegnare
   Turno; scheda uniforme separa usabilita e comprensione esplorativa. Corretto
   "normale" in Base effettiva per Turno casual 15 min; secondo caso dalla
   mappa senza azzeramento e schede compilate fuori dal repository.
6. Smoke FR completo: dopo aver superato desktop e 4K, falliva a 390x844
   cercando `.mg-continue`, nascosto intenzionalmente dalla presentazione
   mobile 4.0. Sostituita l'aspettativa superata con verifiche di reading layer
   direttamente visibile, pulsante NUOVA PARTITA accessibile e assenza del
   vecchio blocco/toggle. Toggle e aria-pressed restano verificati su desktop.

Il report Sprint C dichiara esplicitamente l'interruzione durante inspector-desk
per contenere la prova: non era un gate completato e non documentava un bug in
quel punto. Il timeout FR al boot software WebGL era invece un fallimento distinto.
Il nuovo test di ripresa aveva inizialmente confrontato campi opzionali undefined
in memoria con JSON che li omette: corretto il confronto al contratto persistito,
senza perdere l'asserzione di conservazione di tutti i valori serializzabili.

## Verifiche riproducibili

Runtime effettivo: Node 24.19.0. Su Windows usare il Node LTS prima nel PATH o
invocare direttamente i CLI JavaScript; il Node 23 globale non e il runtime
della candidata verificata. Output generati sotto `scripts/smoke/out/` e
`artifacts/french-localization/`, ignorati da Git; non contengono dati reali.

| Comando | Esito corrente | Perimetro e limiti |
| --- | --- | --- |
| `npm test -- --maxWorkers=2` | PASS, 79 file / 1371 test | Include migrazione v1-v2, schema futuro, originali del Ripasso e nuove regressioni |
| `npm run insights:typecheck` | PASS | Backend separato |
| `npm run typecheck` | PASS | Gioco dopo le correzioni |
| `npm run insights:check` | PASS | Wrangler dry-run, raccolta false; nessun deploy |
| `npm run build` | PASS finale | Typecheck, Vite, notices; warning chunk Phaser preesistente |
| `npm run verify:dist` | PASS finale | 183 file, 107/107 route, 108 HTML senza mojibake |
| `npm run audit:seo` | PASS | 107 route: 33 IT, 37 EN, 37 FR; zero critical/warning |
| `npm run smoke:final-routes` | PASS finale | HTTP locale di tutte le 107 pagine costruite e 5 asset social, non fallback |
| `npm audit --json` | PASS | Zero advisory note nel controllo corrente |
| `npm run smoke:all` | PASS base e finale | Due gate completati, 12/12 job ciascuno; diario finale completed true, exit 0 |
| `node scripts/smoke/final-modes-smoke.mjs` | PASS | 4 modalita x 3 lingue, UI reale 390x844, no richieste esterne |
| `npm run smoke:gameplay-ux` | PASS finale | Tutorial/debrief/ripasso IT/EN desktop, FR mobile e 4K; 14 ulteriori casi completi |
| `npm run smoke:release-a11y` | PASS finale | Ricerca desktop, focus, dialogo e cambio breakpoint IT/EN/FR; non screen reader reale |
| `npm run smoke:release-cases` | PASS | 42 percorsi e reload; selezione fixture, decisione/firma UI |
| `npm run smoke:release-pipeline` | PASS sul nuovo artefatto | 42 firme, 18 batch inviati due volte, 254 contatori D1 riconciliati indipendentemente |
| `npm run smoke:insights-worker` | PASS | workerd/D1, migrazioni, transazioni, dedup, autorizzazione, retention |
| `npm run smoke:insights` | PASS | 6 viewport/24 viste, CSV 546 righe, auth, vuoto/errore, zero richieste esterne |
| `FR_SITE_ONLY=1 npm run smoke:fr` | PASS | 37 route desktop/mobile e tastiera; esclude esplicitamente i profili gioco |
| `npm run smoke:fr` completo | PASS finale dopo correzione del test | 74 percorsi sito + menu 1920/3840/390, persistenza senza query e reading layer |

### Modalita e gameplay

- Turno: tre fascicoli per lingua, esiti errato/parziale/corretto realmente
  firmati, progressione sequenziale, fine sessione e reload con rapporti conservati.
- Libera: mappa reale, scelta di `case_lavoro` fuori dal piano consigliato,
  firma e ritorno alla mappa, reload con esito conservato in IT/EN/FR.
- Sorpresa: anteprima e piano attivo identici, difficolta esperto, ordine
  verificato per ogni fascicolo, assenza della guida contestuale del Turno e
  conclusione della sessione nelle tre lingue.
- Ripasso: avviato dai salvataggi effettivi del Turno, solo casi errati/parziali,
  firme corrette temporanee, fine sessione; storage originale identico byte
  per byte; uscita sulla mappa con ripristino dello stato originale verificata.
  Nessun rapporto originale sovrascritto.
- Perimetro: automazione Chromium, non persone o dispositivi fisici. La
  stabilita dell'itinerario Sorpresa attraverso reload non e attestata qui:
  StateManager mantiene il seme in memoria, non nel save v2. Il ripristino dei
  rapporti non implica il ripristino dell'ordine casuale. Prima della stampa
  verificare questo scenario e chiarire la promessa di ripresa, senza aggiungere
  campi o cambiare la pianificazione silenziosamente in questo sprint.

### Mobile, rendering e accessibilita

Matrice completa sulla base e sulla build finale PASS: 36 profili, 12 per lingua,
zero eccezioni browser. Il gate include
320x800, 360x800, 390x844, 412x915, 768x1024, 800x360, 844x390, 915x412,
1024x768, 1280x720, 1920x1080, 3840x2160 nelle tre lingue. Le risoluzioni grandi
non equivalgono a un percorso completo su tutte le schermate desktop.
Le scene del percorso compatto hanno testo HTML e comandi connessi a Phaser.

Ispezionati screenshot FR del rapporto desktop 1920 e fine turno 390:
testi lunghi leggibili, pulsanti distinti, nessun taglio essenziale osservato.
Ispezionati inoltre menu FR 4K, testo IT 200% e dashboard mobile sintetica.
Il menu FR ha canvas effettivo 1920x1080 e 3840x2160 nei rispettivi profili;
nel profilo smartphone il canvas interno e 1280x720 e la vista leggibile e HTML.
Screenshot rappresentativi conservati in [qa/final-qa](qa/final-qa/README.md).
Non e una revisione visuale di ogni screenshot o test su hardware reale.
Il riferimento e WCAG 2.2 AA, non una certificazione. Focus/DOM/contrasto
automatici non sostituiscono lettura vocale e valutazione manuale completa.
NVDA e VoiceOver: NON ESEGUITI; istruzioni e scheda in
[SCREEN_READER_CHECK_4_0.md](SCREEN_READER_CHECK_4_0.md).

### Localizzazione e SEO

Inventario reale 107 route, sitemap e canonical/hreflang controllati dal gate
SEO; link/asset/traduzioni strutturali dai test. 37 route francesi percorse
a 1440x900 e 390x844, immagini e menu tastiera inclusi. Nessuna prova di
indicizzazione o validazione semantica madrelingua derivata da questi test.
Politiche privacy effettive del gioco e pagine didattiche sulla privacy sono
oggetti diversi; nessuna attestazione legale automatica.

## Analytics, sicurezza e privacy

Backend e dashboard restano isolati dalla build pubblica. Configurazione
`remoteApproved:false`, allowlist vuota, `COLLECTION_ENABLED:false`, observability
Worker OFF. Le prove di raccolta usano solo ambiente workerd/D1 locale con dati
sintetici; nessun account Cloudflare modificato. Dashboard e asset negano
l'accesso anonimo; autenticazione Basic solo locale, Access reale NON VERIFICATO.

Restano da approvare prima di un'eventuale attivazione: base/consenso applicabile,
informativa, metadati IP e log della piattaforma, policy Access/WAF, retention
e backup/Time Travel, amministratori e cancellazione. Contatori marginali e
soglia minima riducono ma non eliminano inferenze su celle/complementi rari.
Deduplica batch non prova unicita delle persone e non elimina traffico automatizzato.
Denominatori sono eventi osservati; non giocatori unici o effetti causali.

Dipendenze: precedente advisory `GHSA-68fv-2mgg-jv7q` / `CVE-2026-93749`,
source-map-js 1.2.1 nella catena Vite/PostCSS di sviluppo, gia corretto a 1.2.2
nello Sprint C. Nuovo audit zero advisory; nessun aggiornamento indiscriminato.
Assenza di advisory non equivale ad assenza assoluta di vulnerabilita.

## Playtest e gate di rilascio

Sei schede P01-P06 vuote, protocollo e template uniforme disponibili. Nessun
partecipante reclutato, nessuna risposta o esito inventato. Usabilita, autonomia,
aiuti e comprensione sono separati; sei sessioni esplorative non dimostrano
efficacia educativa. Gate stampa e round esterni restano da svolgere.

## Residui espliciti

| Attivita | Stato | Effetto sul rilascio |
| --- | --- | --- |
| Sei partecipanti e round esterni | NON VERIFICATO | BLOCCANTE per il gate stampa adottato, non per prove locali |
| NVDA/VoiceOver e dispositivi fisici | NON VERIFICATO | Non dichiarare accessibilita completa; completare prima delle relative promesse pubbliche |
| Revisione FR da madrelingua | PARZIALE | Verifica strutturale/percorsi non prova qualita semantica |
| Ordine Sorpresa dopo reload | PARZIALE, seme in memoria | Verificare/chiarire prima di promettere ripresa dello stesso itinerario |
| Tre commit divergenti | PARZIALE | Riconciliazione del proprietario prima dell'integrazione; lavoro preservato |
| Access, log/IP, backup e retention reali | NON VERIFICATO | BLOCCANTE per telemetria/Cloudflare in produzione |
| Warning bundle Phaser e prestazioni reali | MIGLIORAMENTO SUCCESSIVO | Misurare su hardware; non aggiornare/chunkare indiscriminatamente durante QA |

VERIFICATO significa test o ispezione completati nel perimetro dichiarato,
non certificazione, validita normativa attuale di ogni frase o efficacia educativa.

| Componente | GO / NO-GO | Motivazione |
| --- | --- | --- |
| Gioco per playtest locale controllato | GO | Gate finale, quattro modalita, casi e salvataggi verificati nei perimetri sopra |
| IT/EN/FR | GO tecnico; revisione semantica PARZIALE | Flussi nelle tre lingue; madrelingua non eseguito |
| Mobile Chromium | GO per prove controllate | 36 profili PASS; hardware reale e assistive tech non verificati |
| Backend/dashboard test locale | GO | Dati sintetici, auth, D1 e CSV verificati |
| Telemetria produzione | NO-GO | Privacy/Access/account reale non approvati |
| Invio stampa / pubblicazione | NO-GO | Mancano playtest umani, assistive tech e autorizzazione |

## File e evidenze

Correzioni applicative limitate a TitleScene e BriefingScene. Test:
gameModes, firstMinute, final-modes-smoke, final-routes-smoke, smoke FR e diario
run-all; package.json aggiunge solo comandi di test. Documentazione:
questo rapporto, CHANGELOG, checklist candidata, protocollo, scheda uniforme,
istruzioni assistive. Nessuna modifica a segreti o lockfile.

Elenco dei file della consegna (oltre agli output ignorati):

```text
src/game/scenes/TitleScene.ts
src/game/scenes/BriefingScene.ts
tests/gameModes.test.ts
tests/firstMinute.test.ts
scripts/smoke/run-all.mjs
scripts/smoke/french-localization-smoke.mjs
scripts/smoke/final-modes-smoke.mjs
scripts/smoke/final-routes-smoke.mjs
package.json
CHANGELOG.md
docs/FINAL_QA_4_0.md
docs/RELEASE_CANDIDATE_4_0.md
docs/PLAYTEST_6_PARTICIPANTS_4_0.md
docs/SCREEN_READER_CHECK_4_0.md
docs/playtest/RESULTS_TEMPLATE.md
docs/qa/final-qa/README.md
docs/qa/final-qa/fr-menu-3840.png
docs/qa/final-qa/fr-menu-390.png
docs/qa/final-qa/fr-rapport-1920.png
docs/qa/final-qa/fr-turno-390.png
docs/qa/final-qa/insights-synthetic-390.png
docs/qa/final-qa/it-text-200-390.png
```

Artefatti: `final-qa/general-gate-results.json`, `final-qa/surprise-before.json`,
`final-qa/modes-results.json`, screenshot `final-qa/*-session.png`,
`release-candidate/cases-results.json`, `release-candidate/analytics-pipeline-results.json`,
`player-insights/results.json`, `mobile-ux/results.json`, `visual/`.
I file JSON parziali/progress non sono evidenza di gate completato.

Il commit conclusivo su `codex/final-qa-v4` che contiene questo rapporto identifica
la candidata. SHA disponibile nella storia Git e nella consegna della chat;
nessuna pubblicazione implicita. Diff finale controllato, nessuna modifica
dei sorgenti protetti, nessuna integrazione dell'altro ramo.
