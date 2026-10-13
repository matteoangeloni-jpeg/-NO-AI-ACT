# Player Insights - checklist sicurezza e privacy

Questa e una valutazione tecnica preliminare, non una certificazione o parere
legale. La raccolta e disattivata e nessun account Cloudflare e stato modificato.

## Controlli implementati

- Worker-first per TUTTI gli asset: dashboard.js/CSS non aggirano autenticazione.
- Workers.dev e preview URL disabilitati nel template; dominio non configurato.
- Access JWT RS256 verificato con chiavi del team: issuer, audience, exp, iat,
  max age e allowlist email. Header email senza JWT non e prova di accesso.
- Senza configurazione JWT/allowlist: accesso negato. Errori JWKS negano accesso.
- Fixture JWT firmate realmente nei test, senza account o identita di produzione.
- HTTP Basic ammesso SOLO con LOCAL_TEST=true, URL http loopback e password
  almeno 24 caratteri. Non puo essere usato su dominio remoto/HTTPS.
- Solo query aggregate parametrizzate: nessun endpoint SQL/delete/management.
- Nessun CORS sui dati privati, no-store, CSP self, no framing/referrer.
- Limiter su ingest e letture amministrative; quota SQL transazionale giornaliera.
- Validazione rigorosa, lettura limitata, no contenuti/identificatori personali.
- Nessun log di payload, credenziali, IP, UA o messaggio SQL nel codice.
- Secrets/config identita non inclusi nel repository. Credentials e SQLite
  locali ignorati da Git; accessi Windows dipendono anche dalle ACL del profilo.

## Finalita e flussi

Finalita: individuare problemi di progressione/onboarding e uso degli aiuti,
confrontare descrittivamente le versioni. Non valutazione delle singole persone,
profilazione, advertising, assegnazione di punteggi personali o prova giuridica.

POST futuro: envelope minimizzato, batch UUID casuale -> SHA-256 conservato per
24h senza associazione a eventi. Corpo richieste solo durante validazione.
Contatori giornalieri marginali -> amministratori autorizzati -> CSV aggregati.
Identita amministratore dal JWT solo in memoria per autorizzazione.

Provider Cloudflare potrebbe trattare IP, user-agent, hostname, tempi, geografia,
errori, log di accesso/auth, audit di account e backup. Non vengono cancellati
dal cron applicativo. Confermare termini, regioni, DPA, eventuali trasferimenti,
sub-responsabili e accessi reali prima di un trattamento con giocatori.
Un valore hash o conteggio aggregato non e automaticamente dato anonimo.

## Retention e gestione degli accessi

- Dati primari: 90 giorni UTC inclusivi; cron giornaliero, query out-of-retention
  esclusa anche se cron non gira. Controllare cron e prevedere alert di fallimento.
- Ricevute: 24h; expiry e cleanup. Backup possono estendere disponibilita.
- Backup Time Travel: sempre attivi, finestra del piano; restore seguito da purge.
- CSV: copie sotto controllo dell'amministratore; regola proposta massimo 30 giorni,
  accesso protetto, nessuna condivisione pubblica. Non tecnicamente revocabili.
- Niente archiviazione annuale o esportazioni automatiche implementate.
- Ruolo lettore Access puo leggere/export, non ha API per cancellare o SQL.
- Operazioni D1/migrazioni/purge straordinario solo operatore separato con token
  limitato; nessuna credenziale D1 nel browser e nessuna credenziale cloud locale.
- Revoca tramite policy Access e allowlist, scadenza JWT; autorizzazione ripetuta
  a ogni richiesta. Verificare revoca effettiva con account prima del go-live.
- Contatti/processo richieste privacy e responsabilita del titolare da definire.

## Rischi residui e gate

1. Conteggi non identificano giocatori unici: soglia 10 eventi NON 10 persone.
2. Differencing/complementi possono rivelare celle piccole: margini/versioni e
   periodi sovrapposti non sono differential privacy. Dashboard sempre riservata.
3. Origin falsificabile; limiter per localita e quota SQL limitano abuso, non
   attestano persone reali. Flood puo consumare quota e alterare i conteggi.
4. Dedup solo batch per 24h: nuovo UUID puo ricontare. Nessuna cronologia per
   deduplicare tentativi/persona. Non usare numeri come misure anti-frode.
5. Metadati rete/provider + tempi/versioni/casi possono creare correlazioni.
6. JWT/email admin e cookie di Cloudflare Access sono un trattamento distinto
   dalla telemetria gameplay: vanno inclusi nella valutazione degli accessi.
7. Export/backup e profili Windows hanno controlli di conservazione separati.
8. Runtime Miniflare beta/Wrangler locale testati, non account o carico remoto.
9. Un frontend funzionante non dimostra raccolta reale o qualita di eventi umani.
10. Consenso/ePrivacy/GDPR: nessuna esenzione automatica. Review privacy necessaria
    prima di approvare endpoint, informativa e flag. DNT/GPC non sostituiscono
    una gestione corretta della preferenza/configurazione applicabile.

Per l'attivazione controllata seguire la lista di autorizzazioni in
[PLAYER_INSIGHTS_4_0.md](PLAYER_INSIGHTS_4_0.md), inclusi Access/MFA, WAF, retention,
backup, monitoraggio, informativa e integrazione del client separata.
