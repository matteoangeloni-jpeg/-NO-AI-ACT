# NO AI ACT 4.0 - Player Insights (Sprint Analytics B)

Stato: implementazione locale, dati sintetici, nessun deploy o raccolta reale.
Base verificata: `dcd9665` (Sprint A), dopo Mobile UX, Gameplay UX e francese.
Branch: `codex/player-insights-v4`. Il commit conclusivo e nella storia Git.

## Infrastruttura osservata e scelta

Il repository contiene il deploy del sito statico su GitHub Pages; prima di
questo sprint non conteneva un Worker/D1 per il gameplay. Un beacon sulle pagine
pubbliche non dimostra disponibilita di Workers, D1, Access o di un account.
Non era disponibile un accesso verificato all'account Cloudflare: nessun login,
enumerazione di risorse, creazione di database o modifica di account eseguita.

| Opzione | Vantaggi | Vincoli | Scelta |
| --- | --- | --- | --- |
| Workers + D1 + Access | Runtime e archivio integrati, SQL transazionale, autenticazione gestita | Account, policy Access, dominio, quote e valutazione privacy da autorizzare | Target preferito |
| Node + PostgreSQL | Controllo operativo e SQL piu ampio | Hosting, TLS, account, patching e backup separati | Non necessario per il volume di questo progetto |
| Node + SQLite | Verifiche locali ripetibili, nessun account | Non sostituisce sicurezza e operativita di produzione | Solo preview sintetica |

Backend e asset privati sono separati dalla build pubblica e dalle scene Phaser.
Dashboard HTML/CSS nativa: CSP restrittiva, poche dipendenze, controlli accessibili,
senza introdurre un secondo framework nel gioco o una piattaforma pubblica BI.
Il riferimento compositivo Product Tracker della skill dashboard e stato letto;
qui le dimensioni individuali/coorti di quel riferimento non sono disponibili.

## Avvio e verifica locale

Node 24 LTS consigliato (verificato con 24.19.0); `node:sqlite` richiede un Node
recente. Node 22 LTS recente e il minimo della toolchain esistente.

```text
npm ci
npm run insights:dev
```

Aprire `http://127.0.0.1:4214/`. Autenticazione HTTP Basic **solo locale**:
username `reviewer`; password casuale generata al primo avvio nel file ignorato
`.player-insights/credentials.local`. Non copiare questa password nel repository,
in screenshot o in configurazioni di produzione. Su Windows applicare le ACL
del profilo utente; il parametro POSIX `mode` non garantisce ACL Windows.
Il server ascolta solo loopback e rifiuta Host diversi da localhost/127.0.0.1.
La preview rigenera fixture sintetiche a ogni avvio; non usarla con dati reali.

```text
npm run insights:typecheck
npm run insights:check
npm run smoke:insights-worker
npm run smoke:insights
npm run typecheck
npm test
npm run build
npm run smoke:privacy
```

`insights:check` e solo un dry-run, non un deploy. Per disattivare diagnostica
della CLI Cloudflare impostare `WRANGLER_SEND_METRICS=false`. Gli smoke non
accedono all'account. Miniflare utilizza workerd e un D1 locali in memoria.
La dipendenza Miniflare 5 beta e quella della release Wrangler utilizzata;
lo smoke usa l'adattatore ufficiale `convertV4MiniflareOptions`. Nessun uso
remoto di quella runtime e stato verificato. Le versioni sono nel lockfile.

## Endpoint pubblico (disattivato)

`POST /collect` riceve un envelope di trasporto, senza nuovo catalogo eventi:

```json
{
  "batchId": "12345678-1234-4234-8234-123456789abc",
  "cells": [{
    "schemaVersion": 1,
    "gameVersion": "4.0-candidate",
    "event": "game_started",
    "properties": { "language": "it", "mode": "turno", "phase": "menu" },
    "count": 10
  }]
}
```

Validazione server riutilizza `validateAggregate` dello Sprint A e aggiunge:
- Solo `batchId` e `cells`, UUID v4 casuale per singola consegna, non giocatore.
- Massimo 32 KiB letti effettivamente anche senza Content-Length; JSON UTF-8.
- Massimo 32 celle, 100 eventi per cella, 1.000 eventi per richiesta.
- Nessuna cella duplicata nel batch, anche con ordine diverso delle proprieta.
- Versione e vocabolari chiusi dello Sprint A; `case_result` legacy non accettato.
- Niente testo libero, ID di giocatore, email, IP, timestamp del client o URL.
- Content-Encoding rifiutato; lettura del corpo limitata a 5 secondi complessivi.
- Origin esatto obbligatorio; niente wildcard CORS o credenziali CORS.
- DNT/Sec-GPC: nessuna registrazione, risposta con `accepted: false`.
- Flag `COLLECTION_ENABLED=true` necessario; default false, 503 senza attivazione.
- Limiter obbligatorio; errori della rete/database danno 503 generico senza log payload.

Risposte: 202 accettato (anche retry gia contato), 400 schema/JSON, 403 Origin,
405 metodo, 413 dimensione, 415 formato, 429 quota temporanea, 503 disattivato,
limiter/database/quote SQL non disponibili. Non inviare nuovamente richieste
400/403/413/415 senza correggerle; backoff per 429/503.

Origin e un controllo browser, **non prova di autenticita**: un bot puo falsificarlo.
Il limiter usa una chiave globale, non IP/fingerprint: 60 richieste / minuto per
localita Cloudflare, non limite globale strettamente consistente. Un tetto SQL
transazionale limita a 100.000 eventi accettati per giorno UTC nell'intero DB.
Questo limita costi/conteggi, ma un bot puo saturarlo e negare servizio ad altri.
Prima di attivare: autorizzare protezioni edge/WAF, allarmi e prova di carico.
Non introdurre un segreto nel JavaScript pubblico come falsa difesa.

## Duplicazioni e affidabilita

Il server salva solo SHA-256 dell'UUID casuale del batch e scadenza entro 24 ore
(23-24 ore, arrotondata all'ora per non conservare il millisecondo di ricezione);
nessuna associazione a IP, persona, sessione, eventi o loro contenuto. Non hash
del payload: due consegne legittime possono avere identici conteggi.

In un'unica transazione D1: pulizia ricevute scadute, quota giornaliera, upsert
delle proiezioni se ricevuta assente, inserimento della ricevuta. Una perdita
della risposta seguita da retry con **lo stesso UUID** non incrementa i contatori.
Errori annullano tutta la transazione. Anche retry concorrenti sono testati.
Mai generare un nuovo UUID per il retry di una consegna incerta.
Riutilizzare un UUID per un payload diverso non sovrascrive il primo: il primo
batch valido vince, senza conservare un hash correlabile del contenuto.

`analytics/client-bridge.ts` prepara una consegna esplicita con timeout di 2 s,
stesso UUID sui retry, senza storage, credenziali, referrer o unload beacon.
Si ferma dopo 23 ore, prima della scadenza della ricevuta. Non importato dal
gioco e non attivato: e un ponte per una successiva integrazione autorizzata,
non un nuovo provider acceso. Batch fuori dai limiti non vengono inviati.
L'eventuale connessione futura deve anche gestire coda bounded, scelta privacy,
acknowledgement dei delta e suddivisione dei contatori grandi; non resettare
tutto lo snapshot dopo un solo batch. Questi aspetti non sono ancora collegati.

Nuovi UUID fraudolenti o un retry oltre 24 h possono essere ricontati. Nessuna
deduplicazione per persona/tentativo: non sarebbe dimostrabile con questi dati.
I conteggi sono telemetria client non attendibile come prova, audit normativo o
numero di persone. Il server valida schema, peso, dedup e transazioni; non puo
dimostrare che ogni evento provenga da gameplay umano. Questa limitazione e
intrinseca alla scelta di non identificare le sessioni.

## Schema e cardinalita

Migrazioni SQL ordinate e idempotenti:
1. `0001_aggregates.sql`: counters.
2. `0002_receipts.sql`: dedup di trasporto.
3. `0003_quota.sql`: tetto giornaliero SQL.
4. `0004_receipts_index.sql`: indice per cancellazione delle ricevute.

`counters` ha PK `(day,version,event,dimension,value)` e conteggio intero positivo.
Ogni evento produce un totale `all=*` e proiezioni **indipendenti** per language,
mode, caseId, phase, result, durationBucket, hintUsed e tutorialVersion, se presenti.
Esempio: un evento italiano/turno/caso A non viene archiviato come combinazione
italiano + turno + A. Le proiezioni non si sommano tra dimensioni: rappresentano
gli stessi eventi osservati sotto prospettive diverse. Esiti per caso/lingua
incrociati non sono disponibili per scelta di minimizzazione.

Non esiste una tabella eventi grezzi o sessioni. Ogni dimensione ha vocabolario
limitato dal catalogo importato; una richiesta non puo creare categorie libere.
Per la versione attuale il massimo conservativo e 31 eventi x 49 valori di
dimensione x 90 giorni = 136.710 celle; molti incroci evento/dimensione non sono
ammessi dal catalogo. Ogni nuova versione richiede revisione esplicita dello
schema Sprint A e della cardinalita. Non inventare versioni storiche sintetiche
non accettate dal validatore. La dashboard evidenzia se e presente una sola release.

## Interrogazioni, metriche, CSV

GET `/api/stats` e `/api/export.csv` richiedono autenticazione e accettano soltanto
`from`, `to`, `dimension`, opzionale `version`; massimo 90 giorni, date valide,
nessun futuro, nessuna chiave ripetuta o altro filtro. Non si possono interrogare
combinazioni language+mode+case, ne eseguire SQL. Versioni chiuse nello schema A.
Una query puo includere date piu vecchie, ma non leggere dati oltre retention.

Soglia: almeno 10 **eventi** per cella giornaliera, applicata prima di sommare.
JSON e CSV hanno la stessa soppressione; neppure gli amministratori usano una
API raw. Questo non equivale a 10 persone e non e anonimizzazione garantita.
Soppressione indipendente: totali e distribuzioni possono divergere; piccoli
gruppi potrebbero essere inferiti per sottrazione o differenze tra query.
Per questo accesso strettamente privato, no export pubblico, non un data portal.

Dashboard: Panoramica, Gameplay, Confronti, Dati e definizioni. Filtri data/versione,
confronti separati lingua/modalita/versione e periodo precedente di pari durata,
fascicoli, aiuti, esiti, intervalli di durata, tutorial, debrief e ripasso.
La vista dati offre anche fase, aiuti usati e versione tutorial con export.
Stati di caricamento, rete fallita, dato assente e unica versione sono espliciti.
Un periodo senza celle non viene presentato come una baseline a zero.

| Metrica | Numeratore | Denominatore / unita | Limite |
| --- | --- | --- | --- |
| Sessioni osservate | game_started + game_resumed | conferme, non persone | Riprese/riavvii possono moltiplicare osservazioni |
| Avvii | game_started | eventi | Non unici per giocatore |
| Completamenti piano | session_completed | eventi | Distinto da game_completed |
| Rapporto completamento | session_completed | game_started + game_resumed | Non conversione di coorte; puo superare 100% |
| Rapporto casi | case_completed | case_started | Tentativi non collegati; margini temporali |
| Segnale difficolta | citation_error | case_started | Segnale UX descrittivo, non causalita o difficolta legale |
| Aiuti | hint_requested | richieste | Possono ripetersi; non percentuale di persone |
| Esiti | case_completed per result | completamenti visibili della dimensione result | Non confrontabili per caso con questo grain |
| Durate | case_completed per durationBucket | completamenti visibili | Intervalli, inattivita inclusa, non mediana esatta |
| Tutorial | started/skipped/completed | eventi separati | Saltato/completato possono coesistere |
| Debrief / ripasso | debrief_opened / review_started | eventi | Non misura di lettura o apprendimento |

Denominatori e limiti appaiono nella dashboard. Il catalogo completo e le altre
definizioni rimangono in [PLAYER_TELEMETRY_4_0.md](PLAYER_TELEMETRY_4_0.md).
Non inferire abbandono dall'assenza di eventi; l'evento observed case_abandoned
e disponibile nell'export, con la semantica dello Sprint A.

CSV: `classification,day_utc,game_version,event,dimension,value,event_count`.
`classification` e synthetic nella preview, observed nel backend configurato.
Date = ricezione UTC, non data personale di gioco. Versione/evento/dimensione
sono vocabolari dello schema. value e un valore chiuso o `*` per totale.
event_count e un conteggio additivo **dentro una sola dimensione**; non sommare
dimensioni o celle sovrapposte. Intestazioni documentate, quoting RFC-style e
protezione formule spreadsheet. L'esportazione non contiene righe individuali.

## Sicurezza e privacy

Dettagli e checklist: [PLAYER_INSIGHTS_SECURITY_PRIVACY.md](PLAYER_INSIGHTS_SECURITY_PRIVACY.md).
La privacy review deve decidere la base/configurazione applicabile e l'eventuale
consenso; nessuna dichiarazione automatica GDPR/ePrivacy o consenso non necessario.

Flussi: gioco disattivato -> futuro POST solo dopo approvazione -> Worker valida
-> transazione D1 di conteggi -> amministratore autenticato -> dashboard/CSV.
Cloudflare puo vedere IP, UA e metadati di rete; non vengono presi dal codice
applicativo, ma il provider potrebbe conservarli. Access tratta identita degli
amministratori: email lette nel JWT solo per allowlist, non copiate nei contatori.
Ricevute temporanee possono essere correlate ai metadati di rete: valutare anche
questa possibilita, senza chiamarle anonime per definizione.

Retention proposta/implementata: 90 giorni UTC inclusivi di contatori, cleanup
cron giornaliero 03:15 UTC, query che non leggono dati fuori retention anche se
cleanup fallisce; ricevute 24h, rimosse a ingest e cron. Se nessun cron/ingest
opera, la cancellazione fisica richiede l'operatore: verificare esecuzione/allarmi.
Quota giornaliera cancellata allo stesso cutoff. Local preview conserva solo
fixture nel profilo locale fino alla sua cancellazione esplicita.

D1 Time Travel e sempre attivo; le cancellazioni applicative non cancellano
immediatamente i backup del provider (finestra dipendente dal piano). Dopo un
restore rieseguire purge prima di riaprire gli accessi. Valutare queste finestre
e ogni copia CSV nella policy effettiva. Non e implementato archivio annuale.

## Verifiche eseguite

- Typecheck del gioco e del backend: PASS.
- Suite unitaria completa: 1.368 test PASS in 79 file, di cui 44 nuovi test su
  schema, PII, limiti, quote/rollback, dedup, JWT RS256, origin, accesso negato,
  soppressione, retention, CSV e ponte client offline/disattivato.
- Smoke workerd/D1: migrazioni reali, ingest, retry concorrenti, rollback quota,
  autenticazione, rifiuto interrogazioni granulari, cron di cancellazione.
- Smoke browser: 360x800, 390x844, 768x1024, 1280x720, 1920x1080, 3840x2160;
  quattro viste, riconciliazione KPI, filtro/confronto, CSV, dato assente e rete
  fallita; zero richieste esterne della dashboard locale.
- Screenshot: `scripts/smoke/out/player-insights/` (artefatti locali ignorati).
- Smoke privacy del gioco sulla build candidata: PASS, zero richieste esterne,
  zero all'uscita e nessun corpo di telemetria dopo un caso giocato e firmato.
- Dry-run Wrangler: binding/asset riconosciuti, nessun deploy.
- Audit dipendenze: source-map-js aggiornato alla patch compatibile, nessuna
  vulnerabilita rilevata nell'audit conclusivo.
- Build pubblica e verify-dist: PASS, 107/107 pagine e 108/108 HTML senza mojibake;
  warning preesistente sul bundle Phaser oltre soglia, nessun backend nel dist.
- Nessuna prova con account, identita Access reale, WAF o database Cloudflare remoto.
- Nessun dato reale, test di persone uniche, inferenza causale o certificazione WCAG.

## File e autorizzazioni successive

Implementazione in `analytics/`: tipi, aggregazione, worker, autenticazione,
ponte disattivato, adattatore SQLite, fixture, server locale, dashboard,
config Wrangler/TS e quattro migrazioni. Test: `tests/playerInsights.test.ts`,
`scripts/smoke/insights-smoke.mjs`, `scripts/smoke/insights-worker-smoke.mjs`.
Aggiornati package/lock, gitignore, changelog e documentazione analytics.
Nessuna modifica al gioco, catalogo Sprint A, casi, punteggi, salvataggi o lingue.

Prima di intervenire sull'account servono autorizzazioni esplicite per:
1. Verificare account/piano, creare D1 e selezionare localita/requisiti applicabili.
2. Creare un Worker, binding limiter, dominio/custom route e policy DNS/TLS.
3. Configurare Access sul **dominio intero**, con allowlist nominativa e MFA.
4. Salvare ACCESS_TEAM, ACCESS_AUD, ADMIN_EMAILS e ALLOWED_ORIGIN fuori dal repo;
   usare token di deploy con soli permessi necessari al Worker/D1, non chiavi globali.
5. Applicare migrazioni, cron e allarmi; confermare retention/log/backup provider.
6. Configurare WAF/abuse protection e prove di carico; non usare tracking individuale.
7. Testare privatamente Access reale, revoche, scadenze, export e nessun bypass asset.
8. Approvare informativa/base giuridica/consenso e flussi di gestione richieste.
9. Solo dopo review, connettere il ponte allo Sprint A e cambiare il flag raccolta.

Non sono autorizzati ne eseguiti push, merge, deploy o attivazione.

## Riferimenti primari verificati

- [D1 batch e transazioni](https://developers.cloudflare.com/d1/worker-api/d1-database/).
- [Rate limiter: binding e limiti operativi](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/).
- [Validazione JWT Access](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/validating-json/).
- [Backup e Time Travel D1](https://developers.cloudflare.com/d1/reference/time-travel/).
- [Permessi Workers](https://developers.cloudflare.com/workers/authorization/workers/).
