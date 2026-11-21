# Piano di verifica del percorso guidato

Prima della modifica. Le tre matrici A, B e C sono state scritte nei documenti METHODOLOGY.md e LEGAL_LEARNING_MATRIX.md. Il codice di partenza offre guida contestuale, confronto, rapporto con motivazioni predisposte, debrief e ripasso. Mancano produzione autonoma e confronto esplicito fra idea iniziale e feedback.

## Criteri tecnici

| ID | Scenario | Criterio osservabile |
|---|---|---|
| T1 | Apertura normale da CaseScene | Percorso guidato accessibile come azione facoltativa in IT/EN/FR |
| T2 | Comprensione e ipotesi | Legge lo scopo, scrive l'ipotesi prima dei reperti, entra in Evidence |
| T3 | Revisione durante l'indagine | L'ipotesi iniziale resta leggibile, quella attuale è modificabile |
| T4 | Firma | La nota autonoma compare prima del feedback nel percorso scelto, il salto resta possibile |
| T5 | Dopo il feedback | La nota firmata è rileggibile e non viene sovrascritta dalla riflessione successiva |
| T6 | Nuova sessione e reload | Le annotazioni temporanee non entrano nel salvataggio, esportazioni o telemetria |
| T7 | Escape e modale | Chiude il dialogo, restituisce focus e controlli alla scena, nessun tasto firma sotto il dialogo |
| T8 | Touch e tastiera | Tutte le azioni raggiungibili, campo di testo con etichetta, focus confinato nel dialogo |
| T9 | Layout | 320/390 px, desktop, zoom simulato al 200%, altezza piccola e 4K con scroll interno |
| T10 | Catalogo | I 14 casi e le lingue restano nel catalogo, valutazione e migrazione V1/V2 superano le fixture esistenti |
| T11 | Recovery | Chiudere il dialogo o cambiare scena non lascia overlay, listener o focus bloccati |
| T12 | Rete | Nessun testo scritto nei payload di raccolta, nessun nuovo endpoint |

Comandi previsti. npm run typecheck, npm test, npm run build, npm run audit:seo, npm run verify:dist, npm run smoke:guided-inquiry, npm run smoke:release-cases e npm run smoke:final-modes. L'insieme dei test tecnici non costituisce una validazione educativa o una certificazione di accessibilità.

Le metriche preesistenti del file telemetryMetrics.ts includono un indicatore denominato contradictoryEvidenceRecognized, derivato dall'apertura di certe categorie di reperti. Il nome può suggerire più di quanto il comportamento dimostri. Durante Study 02 trattarlo come proxy tecnico di esposizione, evitando di inferire riconoscimento di contraddizioni senza spiegazione del partecipante. Questo incremento non cambia lo schema della telemetria.

## Protocollo umano da svolgere

Reclutare principianti e persone con esperienza, con consenso per osservazione e annotazioni. Una prima iterazione di 5–8 partecipanti per profilo può individuare ostacoli, senza stimare efficacia. Annotare contesto CEPAJe, lingua, dispositivo, livello di aiuto, interruzioni e difficoltà di lettura.

Compiti. Spiegare lo scopo della classificazione, formulare un'ipotesi, trovare due fonti e collegarle, indicare un'alternativa, scrivere prima della firma, rileggere dopo il feedback e motivare una revisione o una conferma. Il facilitatore registra successo autonomo, successo con aiuto, mancato completamento, errore grave e ragione dichiarata. Non classificare il numero di clic come pensiero critico.

Criteri di revisione progettuale. Un blocco nell'uscita dal dialogo, una firma involontaria, perdita di testo durante la stessa sessione o un suggerimento che anticipa la soluzione richiedono correzione prima di ampliare il prototipo. Per la comprensione, fissare nel pilot una soglia operativa, ad esempio almeno 4 principianti su 5 che sappiano spiegare il compito con parole proprie. Riportare anche i casi discordanti. La soglia è una decisione di prodotto, non un test di efficacia.

Verificare lettori di schermo reali, dettatura o trascrizione mediata, navigazione da tastiera e touch con tastiera virtuale. Prevedere restituzione orale equivalente per chi incontra barriere di scrittura. Le tre lingue richiedono revisione umana prima di reclutare per Study 02.
