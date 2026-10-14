# Dashboard - gate di pubblicazione

14 ottobre 2026. Miglioramenti implementati: stato della raccolta derivato dalla
configurazione backend autenticata, ultimo giorno con celle disponibili nel
filtro (NON ultimo evento ricevuto), giorni disponibili e retention parziale.
Nessuna metrica di errori ingest inventata: il monitoraggio cloud non e attivo.
Grafici temporali con interruzioni per dati mancanti, proiezioni tratteggiate e
tabelle accessibili di dettaglio. Logout locale revoca la sessione server;
accesso scaduto/negato rende visibile il collegamento per riautenticarsi.

## Verificato localmente

- 1383 test unitari passati, typecheck backend passato.
- Sei viewport, trenta viste: login, filtri, CSV, grafici, laboratorio, logout,
  API private negate dopo logout, stati vuoti e errori di rete.
- Pipeline di test: 42 firme reali nella UI, 18 batch reinviati due volte,
  254 contatori marginali riconciliati indipendentemente. Nessun traffico reale.
- Configurazione Worker validata con dry-run, raccolta OFF.
- Screenshot aggiornati in scripts/smoke/out/player-insights.

La pipeline usa un ambiente locale deliberatamente abilitato per fixture:
NON dimostra che il client beta in produzione invii eventi (rimane OFF).
Test automatici non dimostrano conformita privacy o validazione umana.

## Controllo infrastruttura corrente

www risponde 200 da GitHub Pages. beta e insights non risolvono pubblicamente.
Il nuovo inventario in sola lettura riceve 403 sulla ricerca zona Cloudflare:
la sessione disponibile non consente oggi di verificare risorse/account/piani.
Non presentare l'inventario precedente come prova della configurazione attuale.
Non sono state modificate risorse remote, DNS o produzione.

## Gate residui, da completare prima della pubblicazione

- [ ] Accesso autorizzato al corretto account/zona e conferma dei piani Free.
- [ ] Scelta esplicita amministratore e tester ammessi.
- [ ] Configurazione Access per ogni alias beta e dashboard, D1 separato vuoto,
      JWT/allowlist e segreti fuori dal repository.
- [ ] Prova cloud di asset/API privati negati senza autorizzazione; esportazione
      consentita soltanto all'amministratore e nessun alias che aggiri Access.
- [ ] Autorizzazione esplicita per pubblicare beta e dashboard, senza produzione.

## Gate ulteriori per telemetria reale

- [ ] Revisione privacy adeguata di finalita, base giuridica, eventuale consenso,
      metadati di rete, cookie Access/email, retention e cancellazione/backup.
- [ ] Informative coerenti e responsabilita/accessi approvati.
- [ ] Riesame bridge client e credenziali con Access; test end-to-end cloud
      controllato e con fixture, inclusi offline, duplicati e richieste abusive.
- [ ] Monitoraggio errori aggregato senza log payload, IP o cronologie individuali.
- [ ] Autorizzazione distinta alla raccolta reale, soglie/quota e rollback OFF.

Non si dichiara conformita GDPR/ePrivacy. Questo gate e una checklist tecnica,
non sostituisce una valutazione giuridica. Nessun costo attivato; non garantire
gratuita senza verifica delle condizioni dell'account.

Operazioni dettagliate e rollback: BETA_INFRASTRUCTURE_4_0.md.
Stato: GO locale; pubblicazione cloud e raccolta reale ancora NON autorizzate
e non validate. Nessun deploy eseguito.
