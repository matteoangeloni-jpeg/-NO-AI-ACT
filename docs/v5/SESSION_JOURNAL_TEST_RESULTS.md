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

## Correzione V5.2.1

La verifica online ha individuato un BOM serializzato nel corpo del documento di gioco, che rimuoveva il doctype e spostava i metadati fuori dalla testa. Il difetto è corretto. Aggiunti due test DOM sull’intero inventario e un controllo nel gate del dist: 157/157 documenti compilati sono ora in modalità standard con i metadati nella testa.

La produzione del progetto beta usa il ramo beta; main crea una preview. Il comando beta:publish controlla versione, commit e stato dell’artefatto e imposta il ramo corretto. Tre test verificano questo percorso.

Suite completa: **1.630 test superati, 102 file**. Build, typecheck e verifica dist superati. I client V5.2.0 rimangono accettati, i salvataggi non cambiano e non viene ruotata la chiave di cifratura. Nessun test browser.

## Canale unico V5.2.2

Suite locale: **1.635 test superati, 103 file**. Cinque nuove verifiche coprono il redirect del canale ritirato, il blocco preventivo della pubblicazione beta, l’endpoint neutro, la separazione dalle API amministrative e l’importazione delle ricevute precedenti senza riprendere la registrazione. Typecheck del gioco e del Worker superati; audit SEO di 155 URL senza avvisi. Il primo tentativo della suite ha incontrato un percorso temporaneo incompatibile nel sandbox Windows; l’esecuzione completa è riuscita usando una directory temporanea del progetto. Nessun test smoke o browser.
