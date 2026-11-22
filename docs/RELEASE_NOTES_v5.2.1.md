# NO AI ACT v5.2.1 — registro dettagliato con consenso

[Italiano](RELEASE_NOTES_v5.2.1.md) · [English](RELEASE_NOTES_v5.2.1.en.md) · [Français](RELEASE_NOTES_v5.2.1.fr.md) · [Deutsch](RELEASE_NOTES_v5.2.1.de.md) · [Español](RELEASE_NOTES_v5.2.1.es.md) · [Português](RELEASE_NOTES_v5.2.1.pt.md)

2026-11-22

Correzione V5.2.1: ripristina il doctype e i metadati nella testa del documento del gioco, eliminando il BOM serializzato nel corpo. Nuovi controlli DOM statici difendono la modalità standard e la collocazione dei metadati. Il deploy beta usa il ramo di produzione beta, con controllo di versione e commit dell’artefatto.

Il gioco aggiunge un registro facoltativo per ogni sessione di maggiorenni consenzienti: azioni, prove, scelte, confronti, revisioni, aiuti e feedback. I testi salvati del percorso guidato richiedono un consenso aggiuntivo.

Coda per scheda, retry idempotenti, conferma degli eventi ricevuti, revoca e cancellazione, export personale e ricevuta privata. Conservazione di 90 giorni, finestra di registrazione di 24 ore.

La dashboard riservata mostra le singole sessioni e la sequenza degli eventi, con filtri congiunti ed export JSON/CSV. Lo storico aggregato resta separato; corretti i nomi degli eventi che nascondevano le conclusioni dei casi.

Tutte le sei lingue, i 14 casi, i salvataggi v1/v2 e i testi accessibili sono mantenuti. Interfaccia di consenso e informativa tradotte nelle sei lingue.

Non si ricostruiscono le vecchie partite dagli aggregati. Nessuna garanzia di consegna completa, misurazione automatica del pensiero critico, identificazione tra visite o attivazione di Study 02. Nessuno smoke test, come richiesto; risultati effettivi nel registro del rilascio.

[Technical contract / Contratto](v5/SESSION_JOURNAL.md) · [Play](https://www.no-ai-act.eu/play/?lang=it)
