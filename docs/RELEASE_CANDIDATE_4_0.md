# NO AI ACT 4.0 - candidata locale, Sprint C

Identificatore interno: `4.0-rc.1-local`. Non e una release pubblicata.
Branch: `codex/release-readiness-v4`, base `424b45c`. SHA conclusivo nella storia
Git: il commit che aggiunge questo documento e le verifiche dello Sprint C.
Non aggiornati package 3.0.0, tag pubblici o metadati del sito a "4.0 pubblicata".

## Release notes candidate

- Gioco e sito disponibili in italiano, inglese e francese; 14 casi invariati.
- Guida contestuale, motivazioni della valutazione, indicatori prima/dopo,
  debrief e ripasso senza sovrascrivere il salvataggio originale.
- Presentazione compatta HTML collegata alle azioni Phaser, senza duplicare
  logica investigativa; desktop conserva canvas e comandi da tastiera.
- Analytics tipizzato/versionato, contatori limitati in memoria, trasporto
  pubblico OFF e rispetto della configurazione privacy dello Sprint A.
- Backend aggregato e dashboard privata pronti per prove locali sintetiche,
  non attivati sull'account Cloudflare e non inclusi nella build pubblica.
- Sprint C: filtro applicato unico per dashboard/CSV, indicazione dei periodi
  troncati dalla retention, focus visibile della ricerca e semantica modale
  ripristinata attraversando la soglia responsive.

Non dichiarare efficacia educativa, conformita WCAG/GDPR/ePrivacy o giocatori
unici. La validazione automatica non sostituisce il playtest umano.

## Checklist pre-deploy

1. Leggere [RELEASE_VALIDATION_4_0.md](RELEASE_VALIDATION_4_0.md) e chiudere i
   blocchi della versione che si intende pubblicare, non solo il build verde.
2. Identificare lo SHA approvato e l'ultimo artefatto realmente pubblicato;
   non assumere che il branch remoto locale identifichi la produzione corrente.
3. Riconciliare con il proprietario i tre commit dell'altro branch e il suo
   smoke modificato non committato. Nessun cherry-pick/reset automatico.
4. Eseguire da ambiente pulito Node LTS: installazione dal lockfile, typecheck
   gioco/backend, test, build completa con copie licenze e verify-dist.
5. Completare il gate browser generale su macchina adeguata, includendo i nuovi
   controlli aggiuntivi: sito FR, 42 casi, accessibility mirata, pipeline locale,
   backend e dashboard. Un processo interrotto non e un PASS.
6. Eseguire playtest a sei partecipanti e verifica assistiva/manuale indicata
   nel report. Nessun P0/P1 irrisolto nei compiti essenziali.
7. Decidere il numero di release pubblica e sincronizzare package/CITATION,
   press kit, metadati e changelog solo dopo approvazione, poi rifare i controlli.
8. Confermare analytics OFF anche nelle variabili del build: il ponte backend
   resta scollegato. Controllare /play/ senza richieste di telemetria all'uscita.
9. Separare eventuale deploy del sito da eventuale attivazione Worker/D1:
   quest'ultima richiede tutte le autorizzazioni privacy/Access/WAF dello Sprint B.
10. Ottenere autorizzazione esplicita a push/merge/deploy dello SHA. Il workflow
    esistente pubblica automaticamente dopo push a main/manual dispatch: NON
    usare questi comandi per la sola revisione della candidata.
11. Dopo un deploy autorizzato, verificare URL reali IT/EN/FR e /play/ con cache
    aggiornata, lingua persistita, navigazione, firma, salvataggio e network;
    non confondere il test su localhost con la produzione.

## Comandi riproducibili

```text
npm ci
npm run typecheck
npm run insights:typecheck
npm test -- --maxWorkers=2
npm run build
npm run verify:dist
npm run smoke:all
npm run smoke:fr
npm run smoke:gameplay-ux
npm run smoke:release-cases
npm run smoke:release-surprise
npm run smoke:release-pipeline
npm run smoke:insights-worker
npm run smoke:insights
npm run insights:check
```

I controlli che richiedono BASE devono essere eseguiti con un preview della build
finale e BASE impostato al suo URL: gameplay-ux, release-a11y, privacy, mobile UX.
`release-cases` possiede il suo server DEV 4217 e registra contatori solo locali;
`release-pipeline` usa quell'artefatto, mai endpoint o account Cloudflare remoti.
`insights:check` e dry-run, non deploy. Usare `WRANGLER_SEND_METRICS=false` per la CLI.
`smoke:release-surprise`, come release-a11y, richiede BASE con preview avviato.
Il gate storico smoke:all NON comprende automaticamente tutti i controlli
aggiuntivi sopra: eseguirli esplicitamente, senza dedurre un PASS da uno script.

## Rollback

Prima di un deploy autorizzato conservare artefatto/SHA corrente realmente
verificato, configurazioni pubbliche, flag OFF e stato dell'account; nessuna
credenziale nel pacchetto. Questa sessione non verifica la produzione corrente.

Trigger: firma o ripresa rotta, regressione mobile essenziale, perdita dati,
nuove richieste di telemetria inattese, accesso pubblico a dashboard/dati.

- Sito: interrompere la distribuzione e ripubblicare SOLO l'artefatto noto buono
  tramite workflow autorizzato. Non usare reset --hard o forzare branch altrui.
- Salvataggi: conservare localStorage originale; schema v2 invariato. Non
  cancellare dati degli utenti come soluzione a una regressione del client.
- Analytics: disabilitare COLLECTION_ENABLED e lasciare scollegato il ponte;
  bloccare la route di raccolta se necessario. Questo non elimina backup/log.
- Dashboard: chiudere accessi a monte e revocare policy/allowlist interessata.
- D1: evitare restore distruttivo per problemi del sito. Se strettamente
  necessario, snapshot di sicurezza, autorizzazione specifica, restore e purge
  di retention prima di riaprire; Time Travel puo reintrodurre dati cancellati.
- Verifica finale: ripetere firma/ripresa e controlli network/accesso negato,
  annotare incidente e SHA ripristinato. Non dichiarare rollback avvenuto qui.

## Decisione

Candidata locale verificabile, **non autorizzata alla pubblicazione**.
Invio stampa e produzione con telemetria hanno gate diversi: il primo necessita
playtest/usabilita/manuale, la seconda anche la review privacy e Cloudflare reale.
