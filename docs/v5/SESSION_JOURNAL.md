# V5.2 — Registro volontario delle singole sessioni

22 novembre 2026. Attua la successiva richiesta del proprietario di ampliare
la raccolta oltre gli aggregati. Il precedente vincolo «nessun dato individuale»
resta documentato nel dossier storico V5.0. Non cambia il protocollo Study 02.

## Evidenze disponibili

Soltanto dopo il consenso di un maggiorenne: sessione casuale della scheda,
versione, canale (produzione; beta nello storico), lingua/modalità iniziali, difficoltà, percorso e
pubblico scelti; eventi con UUID, sequenza, tentativo, caso, fase, ora dichiarata
dal client, tempo trascorso e ora di ricezione sul server.
È incluso il budget di minuti scelto per il percorso; non è il tempo realmente
trascorso. La versione della sessione è quella iniziale.

| Azione | Registro | Limite interpretativo |
|---|---|---|
| Apertura, avvio, ripresa, navigazione | Evento e contesto | Aprire non significa leggere |
| Reperti | Indice, aperto/citato, aggiunte/rimozioni e stato della bozza | Nessuna misura dell’attenzione |
| Confronto | Coppia di indici mostrata | Non prova correlazione corretta |
| Decisioni | Classificazione, misura, soggetto, motivazione, citazioni, fiducia | Dati dichiarati dal client, manipolabili |
| Incidente | Opzione canonica, anche da tastiera | Non misura una disposizione etica stabile |
| Rapporto | Scelte firmate ed esito interno | Esito del gioco, non competenza validata |
| Percorso guidato | Ipotesi salvata/rivista, relazioni aggiunte/rimosse, conteggi di campi e revisioni | I conteggi non sono qualità del ragionamento |
| Argomentazione | Invio prima del feedback distinto dalla riflessione successiva | Nessuno scoring del pensiero critico |
| Autocontrollo | Conteggi della prova facoltativa pre/post | Nessuna validazione esterna implicita |
| Aiuti, tutorial, feedback, ripasso, accessibilità | Eventi prima della riduzione dell’adapter aggregato | Uso non dimostra apprendimento |
| Attività | Heartbeat con visibilità, focus e attività recente | Stima, senza eye tracking |

Un **secondo consenso**, inizialmente non selezionato, permette l’invio di
istantanee dei testi salvati nel percorso guidato: ipotesi, valutazioni delle
fonti, ragioni delle relazioni/revisioni, argomentazione, riflessione e piano di
trasferimento. Nessuna registrazione dei singoli tasti. Un campo per evento,
massimo 1.200 caratteri; cifratura AES-GCM sul server. L’interfaccia invita a
evitare dati personali o sensibili. I testi non ricevono valutazioni automatiche.

Non si aggiungono nome, email, IP applicativo, user agent, fingerprint,
posizione, pubblicità, collegamenti tra visite o classi. Il registro è
**pseudonimo**, non viene presentato come anonimo.

## Consenso e diritti

Invito in IT/EN/FR/DE/ES/PT-PT e rifiuto senza perdere funzioni. Prima del
consenso non vengono create sessioni sul server o accodati eventi del registro.
Non viene caricata la cronologia del salvataggio precedente. La stessa scheda
può riprendere il registro per 24 ore, anche al ricaricamento; nessun consenso
trasferito a un’altra visita o scheda. Il gioco resta disponibile ai minori,
che non sono invitati ad attivare il registro individuale.

Coda, ricevuta e credenziale privata usano sessionStorage della scheda.
L’export personale distingue eventi ricevuti da quelli locali ancora in attesa.
La ricevuta scaricabile contiene una chiave di accesso: va custodita privata.
Può essere riaperta per esportare o cancellare dopo la chiusura della scheda;
non riattiva la registrazione. Senza ricevuta e dopo la chiusura, il gestore
potrebbe non individuare il registro corretto, non essendoci un’identità personale.

La revoca ferma subito la raccolta. Se manca la rete viene mostrata
**cancellazione in attesa**, non completata, e il client riprova. Disattivare le
statistiche dalla barra revoca anche il registro. DNT/GPC bloccano l’attivazione
e, se rilevati dopo, fermano il registro e richiedono la cancellazione.

Finestra di 90 giorni dal consenso: poi i record diventano inaccessibili e sono
eliminati nella pulizia quotidiana. La revoca rimuove tutti gli eventi e il
record della sessione. Resta fino alla stessa scadenza solo una ricevuta tecnica:
UUID, hash della credenziale, data di revoca e scadenza, contro reinvii ritardati.

Base del registro: consenso, art. 6(1)(a) GDPR. Titolare Matteo Angeloni, con
contatti sulle pagine autore. Cloudflare fornisce Workers/D1 e tratta metadati
di connessione per erogazione e sicurezza. Il database esistente è configurato
nella giurisdizione UE; questo non garantisce anonimato o assenza di trasferimenti
dell’intera infrastruttura. [Informativa nelle sei lingue](https://www.no-ai-act.eu/game-statistics.html).

La finalità è correggere e migliorare il percorso di gioco e i supporti
formativi. La finestra di 90 giorni permette confronti tra iterazioni senza
un archivio individuale indefinito. Il consenso non autorizza raccolte estranee
o sproporzionate: EDPB 05/2020, paragrafo 5, mantiene necessità, proporzionalità
e principi dell’articolo 5. Non si estende il registro a navigazione esterna,
identificazione nominativa, fingerprinting o dati sensibili richiesti al giocatore.

## Contratto tecnico

`https://telemetry.no-ai-act.eu/collect/v3/start`, `/events`, `/export`, `/revoke` sul medesimo collector di produzione. Il precedente host `beta.no-ai-act.eu` mantiene soltanto la compatibilità API e le ricevute già scaricate; il gioco beta è ritirato e reindirizza allo stabile. Nessuna migrazione o cancellazione dei dati.
Origin stabile e storico, POST JSON limitati, niente credenziali negli URL, niente
cookie, logging dei payload disabilitato. La migrazione 0007 aggiunge quattro
tabelle senza riscrivere i contatori precedenti. La credenziale privata ha solo
un hash nel database. `JOURNAL_TEXT_KEY` rimane fuori dal codice, identico sui
due Worker, necessario per cifrare/leggere i testi; la sua perdita li rende
illeggibili. Non si elimina o ruota senza preservare le chiavi ancora necessarie.
Non è cifratura end-to-end: il server può decifrare per gli export autorizzati.

ID immutabili, conferma esplicita dei singoli eventi, retry idempotenti e coda
che sopravvive al ricaricamento della scheda. Limiti: 30.000 byte per richiesta,
40 eventi per lotto, 10.000 eventi per sessione, 1,4 MB di coda client;
5.000 nuove sessioni e 50.000 eventi al giorno. Rate limiting per sessione negli
invii. Le quote possono produrre copertura incompleta. Keepalive non garantisce
consegna se il browser chiude, manca rete, lo storage è negato o scadono le 24 ore.

La dashboard privata protetta da Cloudflare Access mostra prima le **singole
sessioni**: filtri congiunti, canale, versione, conteggio ricevuto e consenso
ai testi. Lingua/modalità filtrano il contesto iniziale; caso seleziona le
sessioni con un evento per quel caso. Pagina da 50 sessioni, timeline progressiva
da 200 eventi, export JSON/CSV. Nessuna soglia di 10 nel registro privato.
Mostra lacune prima dell’ultima sequenza, ma non una coda finale mai arrivata.

## Storico e N.D.

`usage_case_completed`, `usage_case_left`, `usage_session_completed` sono
riconciliati con i nomi canonici nella vista storica. Rimosse le richieste a
dimensioni assenti dal backend. Lo storico mantiene aggregazione e soglie:
vecchie sequenze, risultati e tempi scartati dall’adapter **non si ricostruiscono**.
Non si sostituiscono dati mancanti con zeri, stime o eventi inventati.

## Verifiche e limiti aperti

Test client/server con SQLite reale: consenso, sei lingue e tutti i 14 ID caso,
proprietà esatte, retry, conflitti di sequenza, reload, scadenza, cifratura,
accesso non autorizzato, export, revoca offline e competizione con ingestione,
quote e retention. Suite di regressione, typecheck client/Worker, build,
audit SEO e verifica del dist. Gli esiti effettivi sono registrati dopo l’esecuzione.

Nessuno smoke test o test browser per questa release, come richiesto. Questo
limita la verifica visiva e assistiva sui dispositivi reali. Restano revisione
linguistica specialistica, valutazione dell’informativa nel contesto d’uso,
eventuale percorso per minori e ricerca educativa con strumenti validati.
Nessun endorsement di Alvarez/Pelizzari e nessuna attivazione di Study 02.

## Fonti consultate nella ricerca precedente

- [GDPR consolidato](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02016R0679-20160504).
- [EDPB, consenso](https://www.edpb.europa.eu/documents/guideline/guidelines-052020-on-consent-under-regulation-2016679_en).
- [EDPB, ePrivacy 5(3)](https://www.edpb.europa.eu/system/files/documents/2024-10/edpb_guidelines_202302_technical_scope_art_53_eprivacydirective_v2_en_0.pdf).
- [Garante, tracciamento](https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/9677876).
- [W3C Beacon](https://www.w3.org/TR/beacon/).
- [D1, collocazione dei dati](https://developers.cloudflare.com/d1/configuration/data-location/).
- [Cloudflare, rate limiting](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/).
- [Serrano-Laguna et al.](https://pubman.e-ucm.es/drafts/e-UCM_draft_297.pdf), DOI 10.1016/j.csi.2016.09.014: ispirazione semantica, senza dichiarazione di conformità xAPI.
