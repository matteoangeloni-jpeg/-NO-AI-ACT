# V5.2 — Verifiche effettivamente eseguite

22 novembre 2026, prima del tag e della pubblicazione del client.

| Controllo | Esito |
|---|---|
| Suite Vitest finale | 1.625 test superati, 100 file |
| Nuovi test del registro e riconciliazione dello storico | 30 test; inclusi tutti i 14 ID caso nelle sei lingue attraverso client e SQLite reale |
| Typecheck del gioco | Superato nella build di produzione e beta |
| Typecheck Insights/Worker | Superato |
| Build produzione | Superata |
| Build beta con raccolta configurata | Superata, 159 documenti HTML noindex; nessun upload implicito |
| Audit SEO | 155 URL, zero difetti critici e zero avvisi |
| Verifica dist | Superata; 155/155 pagine dell’inventario, assenza di mojibake e moduli esterni |
| Bundle Worker in dry-run | Superati, collector e Insights |
| Migrazione remota 0007 | Applicata, quattro tabelle nuove; contatori precedenti preservati |
| Collector pubblicato | Entrambe le origini autorizzate restituiscono CORS 204; assenza di consenso restituisce 400 |
| Eventi sintetici in produzione | Nessuna sessione o evento di gioco di prova creato |
| Smoke test e browser | Non eseguiti, su richiesta del proprietario |

Coperti consenso separato ai testi, revoca durante un’attivazione in corso,
retry con gli stessi ID, conferme parziali, conflitti di sequenza, reload,
stimatore di attività, scadenza client/server, export e ricevuta privata,
cifratura e accessi negati, cancellazione offline e competizione tra ingestione
e revoca, quote, pulizia e fallimento asincrono del database senza perdita di
riservatezza degli errori.

L’audit editoriale ha preservato le spiegazioni giuridiche, i testi descrittivi
stampa e i collegamenti alle risorse, qualificando le precedenti promesse sui soli
aggregati. Gli screenshot restano l’archivio V5.0.0 in italiano, non nuove catture.

La CI del client e la verifica finale dei deploy sono registrate nel rilascio
GitHub e nel dossier locale della pubblicazione. I controlli tecnici non
dimostrano efficacia educativa, validità della rubrica, equivalenza linguistica
specialistica o consegna completa di tutti gli eventi. Il dialogo non è stato
collaudato con browser e tecnologie assistive reali in questa release.
