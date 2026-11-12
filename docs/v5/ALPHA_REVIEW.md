# V5 Alpha — prima modifica al confronto dei reperti

Il giocatore può distinguere il confronto, che affianca due reperti citati senza registrare nulla, dalla verifica, che cerca un contrasto fra i reperti citati. Le istruzioni sono disponibili in italiano, inglese e francese; anche la vista di lettura riceve il suggerimento mostrato nel canvas. L'esito negativo invita a rileggere le fonti senza indicare quali prove citare.

- Prima: il confronto chiedeva genericamente di osservare due documenti e il pulsante «Segna contraddizione» suggeriva una registrazione nel rapporto.
- Dopo: il pannello spiega che il confronto non registra segnalazioni; il pulsante si chiama «Verifica contrasto». Il risultato continua a evidenziare le schede nella scena.
- Salvataggi, punteggi, norme, tracciamento e asset sono invariati. Nessun cambiamento di versione, licenza, raccolta dati o distribuzione.

Verifiche locali: `npm ci`; `npm test` (1.499 test, 93 file); `npm run build` (include TypeScript); `npm run audit:seo` (155 rotte, 0 avvisi); `npm run verify:dist`; `npm run smoke:inspector-desk` (confronto in esame e decisione, focus modale, nessun errore console); `graphify update .` (3.660 nodi, sola estrazione del codice). L'installazione segnala sei vulnerabilità nelle dipendenze esistenti; la build segnala la dimensione del bundle. Nessuna dipendenza è stata modificata.

Prima di passare alla Beta: verificare con principianti la distinzione fra i due strumenti e lo scopo della classificazione; provare guida contestuale, riduzione della densità e feedback senza anticipare le soluzioni; poi valutare il prototipo di mappa argomentativa. Restano da svolgere playtest umani, lettori di schermo e dispositivi reali, zoom e matrice completa delle modalità. Le verifiche automatiche non dimostrano un miglioramento dell'apprendimento.

Smoke di catalogo: npm run smoke:release-cases ha completato 42 percorsi (14 casi in tre lingue, modalita Libera), verificando firma, debrief, conseguenze e ripristino dei rapporti. Confronto V4/V5: schermate acquisite nello stesso caso e con lo stesso smoke desktop, sostituendo in V4 i quattro file con quelli del commit base.
