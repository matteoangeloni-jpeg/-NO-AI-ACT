# Beta e infrastruttura unificata 4.0

## Stato della consegna

Base: `codex/final-qa-v4`, `54e0be4`. Branch: `codex/beta-infrastructure-v4`.
Nessun push, deploy, acquisto, modifica DNS o attivazione di telemetria.
Gli indirizzi `https://beta.no-ai-act.eu` e `https://insights.no-ai-act.eu`
sono destinazioni proposte, NON URL attivi della consegna.

## Inventario verificato il 14 ottobre 2026

- DNS autorevoli Cloudflare; `www.no-ai-act.eu` punta a GitHub Pages e risponde 200.
- Zona attiva con piano Free Website. Questo NON dimostra il piano Workers o Access.
- Nell'account consultato non sono state trovate risorse Pages/Workers riconducibili
  a NO AI ACT; D1 non contiene database. Gli altri progetti non sono stati modificati.
- I due sottodomini proposti non risolvono pubblicamente.
- Lettura dettagli DNS e sottoscrizioni: 403. Fatturazione Workers, idoneita Access
  e permessi per l'associazione DNS richiedono verifica del proprietario.
- `npm run infra:inspect` esegue esclusivamente letture; inventario sanitizzato in
  `.infrastructure/inspection.local.json`, ignorato da Git. Non condividere token.

## Avvio locale

Usare Node 24, dalla radice del repository:

```sh
npm run beta:build
npm run beta:preview
npm run insights:dev
```

Beta: `http://127.0.0.1:4220/play/?lang=it`, anche `en` e `fr`.
Dashboard: `http://127.0.0.1:4214`. Se il servizio e gia avviato, riutilizzarlo.
Le credenziali locali sono in `.player-insights/credentials.local`: non pubblicare
il file, restringerne i permessi Windows. Basic locale non e la protezione cloud.
La dashboard locale usa SQLite con dati dichiarati sintetici; il database remoto
previsto sara separato, vuoto, senza importare il campione sintetico.

## Beta implementata

- Output separato `dist-beta`; `dist` e workflow GitHub Pages restano invariati.
- Build forza provider analytics OFF e canale beta; manifest `beta-release.json`
  riporta commit, stato dirty, versione e data della build.
- IT/EN/FR, banner sperimentale, feedback facoltativo con dialogo accessibile.
- Feedback scaricato come file locale: nessun invio, salvataggio persistente o log.
  Il tester decide se condividerlo attraverso un canale concordato separatamente.
  Non inserire dati personali; il testo libero puo comunque contenerli.
- Salvataggi beta v1/v2 separati, schema invariato; nessuna lettura o migrazione
  dei salvataggi stabili. Lingua di ripristino isolata anche nel reading layer.
- Meta e header noindex, robots Disallow, niente sitemap, canonical/hreflang,
  JSON-LD promozionale, CNAME o beacon analytics nella copia beta.
- Le normali navigazioni restano nell'ambiente beta; il link al sito stabile e
  un'uscita esplicita. Noindex non e una misura di autenticazione.

## Configurazione cloud: solo dopo autorizzazione

Un Pages statico beta, un Worker Player Insights riutilizzato, un D1.
Nessun secondo repository, secondo backend o nuovo dominio.

1. Verificare fatturazione e disponibilita effettiva dei piani gratuiti. Fermarsi
   davanti a richieste di piano a pagamento, carta o nuovi costi non autorizzati.
2. Creare o riutilizzare Pages `no-ai-act-beta` in Direct Upload. Non collegare
   un workflow che pubblichi automaticamente push o PR.
3. Proteggere con Access gli hostname raggiungibili prima di rendere disponibile
   il contenuto: pages.dev principale, preview e dominio beta. Se la policy non
   copre ogni alias, non caricare la beta. Definire esplicitamente i tester ammessi.
4. Il modello `deploy/cloudflare/beta.pages.jsonc` viene copiato nello staging
   ignorato da Git da `scripts/beta/local-pages.mjs`. Pages richiede il nome
   convenzionale `wrangler.jsonc`, non un percorso custom passato con `--config`.
   Dopo build/staging, dalla directory `.infrastructure/pages`, il comando
   autorizzato di pubblicazione e `wrangler pages deploy ../../dist-beta
   --project-name no-ai-act-beta --branch beta`. NON e stato eseguito.
5. Registrare `beta.no-ai-act.eu` nei Custom Domains Pages PRIMA di aggiungere
   il CNAME suggerito dal provider. Non modificare www, apex o nameserver.
6. Creare D1 solo con autorizzazione; sostituire l'ID placeholder nel modello
   Insights, applicare le migrazioni esistenti di `analytics/migrations`.
   Non eseguire seed sintetici su D1 remoto. Verificare binding e limiti.
7. Riutilizzare Worker `no-ai-act-player-insights` con il modello
   `deploy/cloudflare/insights.jsonc` e asset dashboard esistenti. Configurare
   Access sull'hostname Insights, policy amministratore esplicitamente scelto.
   Inserire `ACCESS_TEAM`, `ACCESS_AUD`, `ADMIN_EMAILS` come segreti fuori Git.
   Il Worker verifica JWT Access e allowlist; workers.dev e preview URL disattivati.
8. Verificare senza autenticazione sia HTML/asset sia API private, poi accesso
   autorizzato, CSV, database vuoto, comportamento in errore. Non usare un URL
   nascosto come protezione. Documentare gli URL realmente assegnati solo dopo.

La route futura esatta `beta.no-ai-act.eu/collect` e commentata. Permetterebbe
di usare lo stesso Worker senza ulteriore sottodominio. Raccolta OFF, origine e
hostname ammessi sono distinti; API amministrative non servite sul dominio beta.
Il bridge client resta non importato: prima di attivarlo occorre riesaminare
anche `credentials: omit` rispetto a beta protetta da Access, gestione cookie,
policy del collector e test end-to-end. Origin non equivale ad autenticazione.

## Costi e limiti

Nessun nuovo servizio remoto e stato creato e nessun costo ricorrente attivato.
Costo incrementale previsto zero SOLO con piani gratuiti disponibili e quote
rispettate; non e una garanzia di fatturazione dell'account, non verificabile qui.

- [Pages Free](https://developers.cloudflare.com/pages/platform/limits/): 500 build
  al mese, quote condivise con altri progetti.
- [Workers Free](https://developers.cloudflare.com/workers/platform/pricing/):
  100.000 richieste/giorno e 10 ms CPU per invocazione.
- [D1 Free](https://developers.cloudflare.com/d1/platform/pricing/): 5 milioni di
  righe lette/giorno, 100.000 scritte/giorno e 5 GB totali.
- [Access](https://www.cloudflare.com/plans/zero-trust-services/): opzione Free
  documentata; verificare sul proprio account condizioni e disponibilita.

Eventi logici non equivalgono a righe SQL: aggregazioni, indici e deduplica
amplificano le scritture. Misurare prima dell'attivazione e mantenere un budget
inferiore alle quote. Nessun upgrade automatico deve essere autorizzato da questa guida.

## Checklist privacy prima della raccolta reale

- [ ] Finalita, base giuridica e necessita di consenso valutate adeguatamente.
- [ ] Informative coerenti con funzionamento effettivo e destinatari.
- [ ] Verifica metadati IP, log del provider, Access, cookie di autenticazione,
      eventuali email dei tester/amministratori: possono essere dati personali.
- [ ] Vocabolario chiuso e minimizzazione del catalogo esistente confermati.
- [ ] Nessun identificatore persistente o testo libero nei payload analytics.
- [ ] Retention aggregata esistente (90 giorni), cancellazione e copie/backup
      verificati anche sul provider; accessi minimi e responsabilita documentati.
- [ ] Feedback volontario trattato separatamente, con canale e conservazione
      definiti; file personali fuori dal repository e dai log di test.
- [ ] Protezioni contro combinazioni granulari, abuso e duplicati verificate.
- [ ] Autorizzazione esplicita separata per raccolta e pubblicazione ottenuta.

Non si dichiara conformita GDPR/ePrivacy o esenzione automatica dal consenso.
Riferimenti interni: `PLAYER_TELEMETRY_4_0.md`, `PLAYER_INSIGHTS_4_0.md`,
`FINAL_QA_4_0.md`. La definizione degli eventi non viene duplicata.

## Verifiche eseguite

- 80 file di test, 1.378 test passati; typecheck/build beta passati.
- Smoke beta contro Pages/workerd locale: 108 route, header/meta noindex,
  robots, 404, firma IT/EN/FR e salvataggi isolati, feedback senza trasmissioni.
- Matrice FR: 360, 390, 412, 768, 1280, 1920, 3840 pixel di larghezza;
  nessun overflow orizzontale o contenuto coperto dal banner rilevato.
- Dashboard: smoke locale 6 viewport/24 viste, autenticazione e CSV;
  smoke Worker con D1 locale, migrazioni, deduplica e retention passati.
- Build separata in modalita stabile e verifica browser: nessun banner beta,
  nessuna importazione dei salvataggi beta; fingerprint del dist originale invariato.
- Configurazione Worker validata con deploy dry-run, NON caricata in cloud.
- Screenshot e risultati ignorati in `scripts/smoke/out/beta`, incluse schermate
  report IT/EN/FR 390 e titolo FR 360/1280/3840.

Durante lo sviluppo sono stati corretti un posizionamento errato del controllo
hostname e l'uso non supportato di --config con Pages; test rieseguiti senza
indebolire le asserzioni. Non e stato rieseguito l'intero gate generale storico.
Access reale, pubblicazione, DNS, D1 remoto, dispositivi fisici, screen reader e
sei playtest umani NON verificati da questo sprint.

## Rollback e prontezza

Conservare artefatto e manifest per ogni versione. Ripristinare il deployment
precedente del SOLO progetto Pages beta mantenendo il medesimo hostname.
Non cancellare salvataggi, non cambiare lo schema, non modificare GitHub Pages.
Per il Worker mantenere raccolta OFF e ripristinare versione/configurazione
precedente; migrazioni D1 non distruttive, backup/ripristino con autorizzazione.

GO: test locali, build beta, dashboard sintetica e configurazioni preparate.
NO-GO: pubblicazione cloud senza autorizzazione; telemetria reale senza verifica
privacy; dichiarazioni di validazione umana o prontezza stampa senza evidenze.

Guide ufficiali: [Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/),
[Custom Domains](https://developers.cloudflare.com/pages/configuration/custom-domains/),
[Worker routes](https://developers.cloudflare.com/workers/configuration/routing/routes/),
[Access](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/self-hosted-public-app/).
