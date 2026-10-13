# Sprint Analytics: misure utili senza profilare i giocatori

Stato: Sprint A implementato localmente il 14 ottobre 2026, senza trasporto
attivato. Catalogo, schema, metriche, verifiche e rischi:
[PLAYER_TELEMETRY_4_0.md](PLAYER_TELEMETRY_4_0.md).
Il testo seguente conserva la proposta del 13 ottobre e la sua baseline;
Backend e dashboard dello Sprint B sono ora implementati in ambiente di test:
[PLAYER_INSIGHTS_4_0.md](PLAYER_INSIGHTS_4_0.md). Attivazione e deploy restano
successivi e non autorizzati; la proposta sotto non e una policy in produzione.

## Base esistente

`src/game/systems/AnalyticsSystem.ts` contiene 16 eventi consentiti, allowlist di
proprieta, provider off/console/plausible/umami, rispetto DNT e trasporto
iniettabile. In produzione il default e off. Esistono gia apertura/avvio,
lingua, caso, prove, classificazione, misura, esito, norma, archivio e finale.
Cloudflare sulle pagine pubbliche e un sistema distinto, non un funnel del gioco.

Prima di aggiungere eventi, verificare ogni punto di emissione: una voce nella
allowlist non dimostra che venga emessa, ne che venga emessa una sola volta.
Il filtro attuale non e una prova di anonimizzazione: accetta stringhe brevi
arbitrarie, non valida enum per proprieta e accetta numeri non finiti. `page()`
limita la lunghezza ma non usa un elenco chiuso di scene. Irrigidire questi
contratti prima di qualsiasi trasporto remoto.

## Eventi proposti

| Evento | Momento unico | Proprieta chiuse |
| --- | --- | --- |
| session_configured | Conferma del piano | mode, difficulty, language, caseCountBucket |
| tutorial_step_completed | Prima conclusione del gesto | stepId |
| evidence_compared | Confronto esplicito | caseId, comparisonKind |
| decision_reviewed | Apertura del riepilogo prima della firma | caseId |
| debrief_opened | Primo accesso dopo il rapporto | caseId, result |
| case_resumed | Ripristino bozza salvata | caseId, stepId |
| session_finished | Chiusura naturale del piano | mode, completedCountBucket |

Non inviare testo delle riflessioni, nomi, indirizzi, contenuti dei reperti,
query string, seed della sorpresa o identificativi persistenti. Non aggiungere
un evento di abbandono su chiusura tab: la consegna non e affidabile. Evitare
di duplicare case_completed/case_result: specificarne i denominatori.

## Aggregazione e metriche

- Contare eventi validi per giorno/settimana, versione, lingua e modalita.
  Non chiamarli utenti unici, sessioni uniche o tassi di apprendimento.
- Deduplicare localmente, in memoria, le transizioni della stessa esecuzione;
  documentare che riavvii e nuove partite rimangono nuove osservazioni.
- Rapporto completamenti/avvii: indicatore aggregato, non conversione di una
  coorte. Mostrare entrambi i conteggi, finestra e possibili completamenti tardivi.
- Distribuzione degli esiti per caso; aperture debrief per rapporti prodotti;
  uso confronto per casi avviati. Nessuna inferenza causale o classifica studenti.
- Per studiare davvero un funnel, prima proporre un protocollo separato:
  identificatori anche effimeri, consenso/base giuridica, retention e impatti
  devono essere approvati. Non introdurli implicitamente.
- Sopprimere celle con meno di 10 osservazioni e limitare gli incroci di filtri;
  la soglia riduce la granularita, non certifica anonimato. Retention proposta:
  30 giorni per eventuali eventi grezzi, 12 mesi per aggregati, da approvare.

## Dashboard proposta

Una vista operativa con periodo/versione/lingua/modalita, quattro conteggi
(avvii, casi iniziati, rapporti, debrief), tabella casi con distribuzione esiti,
trend settimanale e pannello qualita dati (eventi scartati, duplicazioni note,
ritardi, schema). Distinguere sempre dati osservati, mancanti e test locali.
Prima consegna: dashboard su fixture o esportazione locale autorizzata,
senza collegamento automatico al pubblico.

## Sequenza e cancelli

1. Un giorno: mappa emissioni e schema versionato; test su enum, NaN, URL,
   email, stringhe arbitrarie, doppie emissioni, DNT e provider assente.
2. Un giorno: nuovi eventi con transport finto/console; zero richieste remote.
3. Un giorno: aggregatore e dashboard su fixture con totali riconciliati.
4. Revisione privacy/infrastruttura: responsabili, destinazioni, log IP del
   fornitore, retention, accessi, consenso dove necessario, aggiornamento delle
   dichiarazioni privacy e allowlist. Verificare i requisiti giuridici allora.
5. Attivazione remota solo con approvazione esplicita, configurazione separata,
   smoke rete e piano di spegnimento. Non fa parte del lavoro francese.
