# Player Insights - pubblicazione autorizzata

Dashboard e backend pubblicati su https://insights.no-ai-act.eu/ il 14 ottobre
2026. Versione Worker: f3f3a3d9-04c1-4f95-b3ff-efa817eba1f7.
Database esistente collegato; quattro migrazioni applicate, nessun seed.
Raccolta false; classificazione observed, non dati sintetici.
Segreti ACCESS_TEAM, ACCESS_AUD e ADMIN_EMAILS presenti nel servizio remoto;
i valori non sono salvati nel repository. Conservati durante il deploy.
workers.dev e preview URL disattivati; observability globale disattivata.

Verifica esterna senza credenziali: /, /api/stats, /api/export.csv e
/dashboard.js restituiscono 302 verso Access. workers.dev restituisce 404.
L'accesso autenticato alla dashboard vera deve ancora essere verificato dal
proprietario: questi controlli non dimostrano correttezza dei valori cifrati.
Beta non ancora pubblicata; sito stabile non modificato.

Configurazione: deploy/cloudflare/insights.jsonc. Il campo jurisdiction non
e supportato da questa versione di Wrangler nella configurazione del binding:
la giurisdizione UE e stata scelta alla creazione del database dal proprietario.
Non ricreare il database per i successivi deploy.
