# NO AI ACT 4.0 - report Sprint C

Data: 14 ottobre 2026, Europe/Rome. Base esaminata: `424b45c`; branch dedicato
`codex/release-readiness-v4`. Revisione del codice, due letture indipendenti,
test locali e ispezione di screenshot. Nessun deploy, push, merge o tag pubblico.

Verdetto: candidata locale utilizzabile per ulteriori prove; **non dichiarata
pronta per pubblicazione/invio stampa**. Playtest umano e verifica assistiva
manuale mancanti; gate generale non completato sulla revisione finale.

## Significato degli stati

- VERIFICATO: evidenza osservata o test completato, limitatamente al perimetro indicato.
- PARZIALE: implementazione presente e campionata, ma mancano combinazioni o contesto reale.
- NON VERIFICATO: nessuna prova adeguata svolta in questa sessione.
- BLOCCANTE: condizione da chiudere prima dell'attivazione/rilascio specificato.
- SUCCESSIVO: miglioramento che non cambia la correttezza del perimetro verificato.

## Integrita Git e funzioni reali

| Componente | Evidenza nel codice/test | Stato |
| --- | --- | --- |
| FR sito e gioco | i18n/fr.ts, src/site/fr*, inventario 37 route, scene in FR realmente percorse | VERIFICATO strutturalmente e funzionalmente; semantica della traduzione PARZIALE |
| Gameplay UX | InvestigationGuide, DecisionScene, ConsequenceScene, DecisionDebriefOverlay, StateManager.beginReview | VERIFICATO nei flussi campionati |
| Mobile UX | mobilePresentation, ActionLayer, ReadingLayer e CSS; 42 casi compatti, check focus/resize | VERIFICATO nel perimetro; hardware/assistive tech PARZIALE |
| Analytics A | schema e singleton riutilizzati, eventi catturati dall'interfaccia | VERIFICATO localmente, non produzione |
| Backend B | Worker/D1, migrazioni, transazioni e query marginali | VERIFICATO workerd/D1 locale |
| Dashboard B | asset autentificati, KPI, filtri, CSV, stati vuoti/errore | VERIFICATO su dati sintetici |

Catena presente: `3c7e344`/`11b5915` FR -> `6dc882d` Gameplay -> `1b41261`
Mobile -> `dcd9665` Analytics A -> `424b45c` Backend B. Non e solo changelog:
i moduli sono stati letti e i percorsi eseguiti.

L'altro worktree e rimasto intatto: `codex/inspector-desk-v23` a `102e315`.
Tre commit non antenati di questa candidata: `2bff4bd`, `f570ba5`, `102e315`;
divergenza dal comune `36df04d`: 26 commit contro 3 prima dello Sprint C.
Modifica locale al suo visual-language-smoke (attesa mappa/fade) preservata.
Non essere antenato NON prova che una funzione manchi: la candidata contiene
implementazioni successive e helper equivalenti in parte. Riconciliazione
integrale con l'altro ramo PARZIALE, nessun cherry-pick o reset eseguito.

Confronto con `11b5915`: nessuna modifica in dati dei casi/matrice normativa,
ReportSystem, SaveSystem, sistemi Case/Norm/Indicator. Schema save v2 invariato.
Le nuove correzioni riguardano presentazione/test e backend, non punteggi.

## Validazione funzionale

- 14 casi x IT/EN/FR = **42 percorsi completati**: reperti citati pertinenti,
  decisione corretta, firma, rapporto salvato, debrief, conseguenze e norma.
- Salvataggi dei 14 rapporti e 14 esiti ripristinati dopo reload in ogni lingua.
- I casi sono selezionati con una fixture di scena: NON 42 persone e NON una
  prova integrale della scoperta dei 14 luoghi sulla mappa. Azioni e valutazione
  effettive appartengono alle scene, nessuna chiamata diretta al calcolo esito.
- Matrice nuova su 390x844 nelle tre lingue, tastiera nelle decisioni e azioni
  HTML nei passaggi. Non sostituisce la matrice mobile completa dello Sprint precedente.
- Sito FR: **37 route x desktop/mobile**, immagini/overflow/navigazione da
  tastiera. Run con FR_SITE_ONLY: esclude esplicitamente i tre profili menu gioco
  del vecchio smoke. FR nel gioco e coperto separatamente dai 14 percorsi e reload.
- IT/EN sito: inventario/build/link unitari verificati; campionamento visuale
  meno esteso del francese. NON dichiarata revisione manuale di tutte le pagine.
- Modalita Libera: tutti i casi della nuova matrice. Turno, Ripasso, tutorial,
  aiuti, firma e flusso di ripresa: smoke analytics nelle tre lingue.
- Sorpresa: tre percorsi, uno per lingua, avviati dal piano realmente estratto,
  con decisione, firma ed esito corretto fino alla norma. Pianificazione/unitari
  verificati; sessioni multi-caso complete restano PARZIALI.

## Accessibilita e controlli visivi

Riferimento WCAG 2.2: reflow/orientamento, focus visibile, target, contrasto,
tastiera, nome/ruolo/stato, riduzione del movimento. Nessuna certificazione AA.

Prima/dopo riprodotto nelle tre lingue:
1. Ricerca Archive: il focus poteva cadere nell'input del reading layer clipped.
   Ora rivela il pannello di lettura desktop, anche attraversando il breakpoint
   con l'input a fuoco. Non rimosso l'accesso degli screen reader alla ricerca.
2. Modalita aperta mobile -> desktop -> mobile: perdeva ruolo/aria-modal/label e
   isolamento del link esterno. Ora vengono ripristinati, insieme allo stato
   della gestione del focus. Tab circolare nel modal verificato automaticamente.

Screenshot acquisiti in scripts/smoke/out/release-candidate; confronti
before/after-*-modal-breakpoint.png e rapporti case_media/case_biometria.
Ispezione visiva effettiva di un campione da parte dell'assistente; non una
sessione svolta da utenti o da un operatore con NVDA/VoiceOver/TalkBack.

- Smartphone 390x844: contenuti e flussi delle tre lingue, target/focus mirati.
- Desktop 1280x720: ricerca e passaggio breakpoint; gate storico layout completato
  anche su desktop/tablet/telefono IT/EN prima delle correzioni mirate finali.
- Dashboard: 360,390,768,1280,1920,3840 px, quattro viste senza overflow di pagina.
- Testo al 200%, dispositivi fisici, Safari/iOS, VoiceOver, TalkBack e NVDA:
  NON ricontrollati manualmente qui. Efficacia dello screen reader NON VERIFICATA.
- Contrasto canvas completo, tutti i focus naturali e piena accessibilita della
  mappa: PARZIALE. Non inferire conformita dall'assenza di errori JavaScript.

## Analytics: emesso contro ricevuto

42 firme reali di UI automatizzata, contatori catturati dal singleton Analytics
in DEV senza spedizione. Dati sintetici/test, non attivita umana reale.
Replay SOLO nel Worker/D1 locale: **18 batch, ciascuno inviato due volte**.
**254 celle marginali** riconciliate tramite calcolo indipendente dagli input,
senza chiamare il project() del backend. 42 report_signed e case_completed,
soglia di pubblicazione >=10 verificata su tutte le dimensioni; anonimo negato.

Consegna e dedup del batch non equivalgono a unicita di giocatori. Alcune celle
per singolo caso rimangono sotto soglia e non appaiono in API/CSV: comportamento
previsto, non perdita di righe. Nessun endpoint remoto o account Cloudflare usato.

Il primo harness anticipava cambi scena/uscite e reinizializzava il save al
reload: fallimenti di fixture diagnosticati, corretti con attese di frame,
ritorno effettivo alla mappa e seed solo al primo avvio. Non modificata la logica
analytics per "far passare" questi errori. Nessun risultato fallito spacciato per PASS.

Due errori della dashboard riprodotti da revisore indipendente e corretti:
- Periodi di query/CSV potevano differire dopo edit non applicate o durante
  richieste multiple. Ora un solo snapshot applicato, pubblicazione atomica,
  controlli bloccati durante refresh ed export disabilitato su edit/errore.
- Baseline nominale di 14 giorni poteva conservarne solo 3: ora l'API dichiara
  finestra effettiva e confronto non comparabile; CSV conserva le date di
  richiesta/retention e indicatore clipped. Test specifici riproducono il caso.

Gioco senza analytics: build produzione OFF, un caso giocato/firmato nel smoke
privacy della revisione finale senza richieste esterne, corpi o beacon all'uscita.
Ponte di raccolta resta fuori dal bundle del gioco. Non attivato in produzione.

## Privacy e sicurezza

Review tecnica preliminare, NON parere legale o attestazione GDPR/ePrivacy.
Minimizzazione, finalita, storage limitation e controlli progettati sono presenti,
ma l'assenza di cookie/ID persistente non prova anonimato o esenzione dal consenso.

Restano BLOCCANTI per raccolta reale: base/configurazione e consenso se applicabile,
informativa aggiornata, retention/log/backup provider, identita/MFA/revoca Access
reali, WAF/limiti e allarmi, accessi minimi e test su account autorizzato.
Rischi: IP/UA del provider, correlazione batch temporanei, celle inferibili per
sottrazione, bot con nuovi UUID, saturazione quota e copie CSV/backup.

Corretto il runbook Access: una policy amministrativa indiscriminata sull'intero
hostname impedirebbe POST/OPTIONS pubblici a /collect. Servono hostname separati
o eccezione piu specifica SOLO /collect, mantenendo JWT su asset e API privati.
Non configurata alcuna eccezione su account vero.

Le promesse pubbliche "tutto resta locale"/"nessun dato studenti" descrivono la
configurazione gameplay OFF attuale. Prima della raccolta devono diventare
precise rispetto ad aggregati e trattamento provider; non bastano i payload
senza IP. Beacon del sito pubblico e separato: la sua configurazione provider
non e stata verificata e non e automaticamente coperta dalla review gameplay.

## Vulnerabilita precedentemente segnalata

- Pacchetto: source-map-js, dipendenza DEV tramite Vite -> PostCSS.
- Prima (lock dello Sprint A): 1.2.1. Ora installato/lock: **1.2.2**.
- Advisory GHSA-68fv-2mgg-jv7q / CVE-2026-93749, gravita High; GitHub riporta
  CVSS v4 8.7, l'audit npm precedente v3 7.5: scale/versioni diverse.
- Input vulnerabile: offset di sezione di sourcemap non fidata, blocco sincrono
  dell'event loop. Non e prova di exploit del sito o di dati esfiltrati.
- Esposizione rilevata: toolchain build/dev, non un upload sourcemap pubblico
  previsto dal gioco o dal Worker. Servizi dev non vanno esposti a input non fidato.
- Correzione gia applicata nello Sprint B: patch 1.2.2, conservata; nessun
  aggiornamento indiscriminato in questo sprint. Audit corrente: zero advisory rilevati.
- Residuo: audit e temporale, non prova sicurezza totale; toolchain Miniflare
  beta dipende dalla versione Wrangler, testata solo localmente.

## Risultati e limiti di esecuzione

- Typecheck gioco: PASS. Build e copia licenze: PASS; warning Phaser ~1.77 MB
  preesistente. Verify-dist: 107/107 pagine, 108/108 HTML senza mojibake, PASS.
- Suite finale: **1.369 test PASS in 79 file**, con maxWorkers=2. Prima esecuzione
  concorrente aveva tre timeout a 5s su scansioni link, non link rotti: riportata
  come fallita e ripetuta con meno concorrenza, senza alzare timeout degli assert.
- 42 casi/lingue, ripristino, pipeline D1, dashboard e accessibilita mirata: PASS.
- Gate storico smoke:all: completati gameplay, keyboard, draft, privacy, layout,
  audio, action layer; interrotto durante inspector-desk per contenere la prova.
  NON PASS complessivo, NON eseguiti i suoi job successivi in quella invocazione.
- Smoke FR completo: timeout al boot di un profilo gioco in software WebGL;
  prova sito separata PASS. Timeout boot reso coerente a 60s con l'altro smoke,
  senza allentare i controlli di gameplay. Profilo completo FR/4K resta da ripetere.
- Nessun test remoto/live, processo di deploy, verifica Cloudflare Access reale.

## Gate residui

| Ambito | Stato | Effetto |
| --- | --- | --- |
| Playtest sei persone | NON ESEGUITO | BLOCCANTE per dichiarazione press-ready |
| Screen reader/dispositivi fisici | NON VERIFICATO | BLOCCANTE per dichiarazione di accessibilita completa |
| Full gate finale + FR gioco 4K | PARZIALE | BLOCCANTE per autorizzazione della release pubblica |
| Semantic review FR/EN | PARZIALE | Revisore madrelingua prima di claim "localizzazione validata" |
| Sessioni multi-caso delle modalita | PARZIALE | Verificare percorsi interi, oltre al primo caso e ai planning unitari |
| Attivazione telemetria / account Cloudflare | NON VERIFICATO | BLOCCANTE solo per attivazione dati reali; resta OFF |
| Prestazioni software WebGL / bundle | SUCCESSIVO | Ottimizzazione con misure su hardware reale |
| Inferenza causale/efficacia educativa | NON VERIFICATO | Nessuna dichiarazione autorizzata |

Protocollo e sei schede individuali: [PLAYTEST_6_PARTICIPANTS_4_0.md](PLAYTEST_6_PARTICIPANTS_4_0.md),
docs/playtest/P01.md fino a P06.md. Nessun risultato inventato o raccolta eseguita.
Release notes, pre-deploy e rollback: [RELEASE_CANDIDATE_4_0.md](RELEASE_CANDIDATE_4_0.md).

## Fonti primarie

- [WCAG 2.2](https://www.w3.org/TR/WCAG22/).
- [Principi GDPR, Commissione UE](https://commission.europa.eu/law/law-topic/data-protection/information-business-and-organisations/principles-gdpr_en).
- [Applicazione GDPR e dati personali](https://commission.europa.eu/law/law-topic/data-protection/information-business-and-organisations/application-gdpr_en).
- [EDPB, linee guida finali art.5(3) ePrivacy](https://www.edpb.europa.eu/documents/guideline/guidelines-22023-on-technical-scope-of-art-53-of-eprivacy-directive_en).
- [Advisory source-map-js](https://github.com/advisories/GHSA-68fv-2mgg-jv7q).

I testi EUR-Lex richiesti hanno restituito una verifica anti-bot: non sono stati
presentati come letti. La review legale completa rimane da svolgere con fonti
integrali, configurazione effettiva e responsabile competente.
