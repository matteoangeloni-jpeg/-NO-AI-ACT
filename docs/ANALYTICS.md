# Analytics A: contatori locali e trasporto disattivato

Stato: implementazione locale, 14 ottobre 2026. Nessun backend collegato.

Il contratto completo, il catalogo eventi, le metriche, i test e i rischi sono
in [PLAYER_TELEMETRY_4_0.md](PLAYER_TELEMETRY_4_0.md).
La fonte eseguibile degli schemi e `src/game/systems/analyticsSchema.ts`;
il sistema riutilizzato e `src/game/systems/AnalyticsSystem.ts`.

## Configurazione effettiva

| Provider | Comportamento |
| --- | --- |
| `off` | Default produzione. Nessun contatore, log o invio analytics. |
| `console` | Default sviluppo senza variabili. Contatori aggregati in memoria; la console mostra solo quantita diagnostiche. Zero trasporto. |
| `plausible`, `umami` | Adapter preesistenti, bloccati nel singleton distribuito. Testati con trasporti finti. |

`envConfig()` imposta esplicitamente `remoteApproved: false` e una lista vuota
di endpoint autorizzati. Impostare le vecchie variabili `VITE_ANALYTICS_PROVIDER`,
`VITE_PLAUSIBLE_DOMAIN` o `VITE_UMAMI_*` non attiva il trasporto remoto.
Un provider sconosciuto resta spento. DNT forza `off`, anche in sviluppo.
`enable()` non puo riaccendere un provider risolto a `off`.

Non c'e un nuovo banner, un interruttore di consenso o una raccolta pubblica.
Questa implementazione non stabilisce esenzioni dal consenso: informativa,
base giuridica, destinazione e infrastruttura richiedono la verifica successiva.

## Memoria e rete

- I contatori contengono solo combinazioni di valori del vocabolario chiuso.
- Nessuna sequenza di eventi grezzi, identificatore personale o timestamp viene
  memorizzato nel buffer o incluso nei payload.
- Due clock monotoni e gli indici dei reperti dell'attuale tentativo servono
  localmente per durate per intervalli e deduplicazione. Non vengono esportati.
- Massimo 512 celle; massimo 1.000.000 osservazioni per cella. Scarti, duplicati
  e saturazioni hanno contatori diagnostici, senza conservare il dato scartato.
- Nessun tracking in localStorage, sessionStorage, cookie o nel salvataggio.
- Il buffer viene eliminato con `disable()` o distruzione del documento.
- Nessun flush automatico, timer di invio, beacon o invio alla chiusura.
- `flush()` e un'operazione asincrona esplicita: richiede approvazione separata
  dell'infrastruttura e corrispondenza esatta dell'endpoint. Non e chiamata dal gioco.
- Gli errori sincroni/asincroni vengono gestiti; il gameplay continua e le celle
  non confermate restano nel buffer limitato. Una risposta Plausible marcata
  `x-plausible-dropped: 1` non viene considerata una conferma.

`/play/` non carica piu il beacon Cloudflare. Le statistiche delle pagine
pubbliche del sito mantengono la propria configurazione, distinta dal gioco.

## Verifica locale

```text
npm run typecheck
npm test
npm run build
npm run smoke:analytics
BASE=http://localhost:4212 npm run smoke:privacy
```

Su PowerShell usare `$env:BASE='http://localhost:4212'` prima dello smoke privacy.
Serve il preview della build sulla porta scelta.
Lo smoke analytics avvia e chiude autonomamente un server di sviluppo locale
sulla 4213, con provider console, e usa esclusivamente fixture sintetiche.
`ANALYTICS_TEST_PORT` permette di scegliere un'altra porta libera.
Il server 4212 del gioco non viene arrestato dallo smoke.

Solo nelle build di sviluppo `window.playerTelemetry` espone letture di
`snapshot()` e `diagnostics()`, senza comandi di attivazione o invio.
La build di produzione non espone questo handle.

## Collegamento futuro

Il collegamento a un backend autorizzato dovra ricevere celle validate tramite
`validateAggregate()` e sommare `count`, non contare richieste HTTP. La versione
del provider e le sue configurazioni privacy dovranno essere verificate.
Non usare metriche native di "visitatori unici" come sinonimo di giocatori.
Retenzione lato server, accessi, log HTTP, soglie di pubblicazione e idempotenza
non sono implementati in questo sprint e non si possono dedurre dal codice client.
