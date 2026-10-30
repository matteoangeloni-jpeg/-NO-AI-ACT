# Analytics e telemetria aggregata

Stato documentale: 30 ottobre 2026. Il codice supporta contatori locali e un
trasporto first-party aggregato. Il template Worker nel repository mantiene
`COLLECTION_ENABLED: false`; build beta/produzione possono configurare il client
first-party separatamente. Il repository, da solo, non prova lo stato live del
deploy, del database o della raccolta.

La documentazione v2 e disponibile in:

- [TELEMETRY_SCHEMA_V2.md](TELEMETRY_SCHEMA_V2.md)
- [TELEMETRY_DATA_DICTIONARY_V2.json](TELEMETRY_DATA_DICTIONARY_V2.json)
- [TELEMETRY_PRIVACY_SECURITY_V2.md](TELEMETRY_PRIVACY_SECURITY_V2.md)
- [TELEMETRY_MIGRATION_V2.md](TELEMETRY_MIGRATION_V2.md)
- [RESEARCH_MODE_ARCHITECTURE.md](RESEARCH_MODE_ARCHITECTURE.md)
- [TELEMETRY_IMPLEMENTATION_REPORT.md](TELEMETRY_IMPLEMENTATION_REPORT.md)

Il worktree corrente accetta wire schema 1 e 2 ed emette schema 2. La presenza nel
repository non dimostra che schema 2 sia revisionato, distribuito o live.

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
| `first-party` | Solo build beta/produzione esplicita, origin/endpoint attesi e raccolta automatica configurata; invia celle aggregate minimizzate. |

Per provider non first-party, la configurazione resta deny-by-default. Per il
provider `first-party`, `envConfig()` autorizza l'endpoint solo con release channel
`beta` o `production`, origin attesa e build esplicitamente configurata.
Un provider sconosciuto resta spento. DNT forza `off`, anche in sviluppo.
`enable()` non puo riaccendere un provider risolto a `off`.

Il gioco include un avviso/controllo di disattivazione per la raccolta first-party
e rispetta DNT/GPC. Questo non stabilisce esenzioni dal consenso: informativa,
base giuridica, preferenze applicabili, destinazione e infrastruttura richiedono
verifica umana sul deploy reale.

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
- Con provider first-party autorizzato, il gioco chiama `flush()` periodicamente e
  quando il documento diventa nascosto; usa fetch keepalive, non un beacon.
- `flush()` richiede comunque corrispondenza esatta dell'endpoint e configurazione
  di build. Errori di trasporto non interrompono il gameplay.
- Gli errori sincroni/asincroni vengono gestiti; il gameplay continua e le celle
  non confermate restano nel buffer limitato. Una risposta Plausible marcata
  `x-plausible-dropped: 1` non viene considerata una conferma.

Le statistiche delle pagine pubbliche e i contatori first-party del gioco sono
flussi distinti. I contatori gameplay pubblici includono solo aperture/avvii,
riprese, fasi e completamenti/uscite minimizzati. Schema 2 aggiunge categorie
chiuse e bande su decisione/evidenza, accessibilita ed errori tecnici; non include
testo libero, prove/indici, punteggi numerici o identificatori di giocatore.

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

## Backend aggregato

Il backend riceve celle schema 1/2 validate tramite `validateAggregate()` e somma `count`,
non richieste HTTP. Proietta margini giornalieri indipendenti e sopprime in lettura
le celle sotto 10 eventi. Schema 2 aggiunge report compositi giornalieri chiusi;
la soglia resta per eventi, non persone, e non e privacy differenziale. Conserva
contatori per 90 giorni UTC inclusivi e ricevute
hash di deduplicazione per circa 24 ore. Celle mancanti/soppresse non sono zero.
Non usare metriche native di "visitatori unici" come sinonimo di giocatori.
Rapporti e percentuali devono mostrare numeratore, denominatore, finestra, versione,
dimensione, soglia e clipping di retention. Non sono funnel individuali e non
misurano efficacia, apprendimento o pensiero critico.

## Backend e dashboard dello Sprint B

Implementazione e controlli: [PLAYER_INSIGHTS_4_0.md](PLAYER_INSIGHTS_4_0.md) e
[PLAYER_INSIGHTS_SECURITY_PRIVACY.md](PLAYER_INSIGHTS_SECURITY_PRIVACY.md).
L'esistenza del codice non implica attivazione, accesso Cloudflare, dati reali o
conformita legale. La modalita ricerca e disabilitata, non implementata nel runtime
e non distribuita; resta separata dalla telemetria pubblica.
