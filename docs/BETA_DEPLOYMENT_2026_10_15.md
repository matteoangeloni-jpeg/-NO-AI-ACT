# Beta 4.0 - pubblicazione del 15 ottobre 2026

Progetto Pages separato: no-ai-act-beta, branch di pubblicazione beta.
URL: https://beta.no-ai-act.eu/play/?lang=it (anche en e fr).
Deployment: 58ea55a8.no-ai-act-beta.pages.dev.
Artefatto: dist-beta, commit applicativo 5e7205d, build pulita.

Build/typecheck e smoke beta passati: 108 route noindex con header Pages,
firme IT/EN/FR, isolamento salvataggi e feedback locale. 181 file caricati.
Nessun collegamento Git per pubblicazioni automatiche; raccolta OFF.

Access: anteprime ristrette tramite integrazione Pages; applicazione separata
NO AI ACT - Beta tester per no-ai-act-beta.pages.dev e beta.no-ai-act.eu,
sessione un'ora, policy esistente limitata alle due email amministratore.
Nessun nuovo tester aggiunto: occorre una policy dedicata prima degli inviti,
senza ampliare la policy condivisa della dashboard Insights.
La policy preview generata da Pages ammette i membri dell'account Cloudflare;
non usare il link di deployment per invitare tester esterni.

Verifica anonima esterna: tutti e tre gli hostname restituiscono 302 al login
Access. Dominio beta associato con CNAME beta -> no-ai-act-beta.pages.dev.
Sito stabile, nameserver e record www non modificati.

Rollback: ripubblicare un artefatto beta precedente sul medesimo progetto;
non resettare salvataggi e non modificare il deployment GitHub Pages stabile.
Questo e il primo deployment del progetto, quindi non esiste ancora una
versione beta precedente da selezionare nel pannello.
