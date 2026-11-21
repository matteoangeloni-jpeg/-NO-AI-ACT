# NO AI ACT v5.0.0 — Indagare, argomentare, rielaborare

21 novembre 2026. Release del percorso ludopedagogico guidato, con i 14 casi esistenti e le tre lingue del gioco: italiano, inglese e francese. Il sito mantiene 155 rotte e sei lingue editoriali. Lo stato effettivo di tag e pubblicazione è riportato nel README e nel registro di rilascio.

## Novità nel gioco

- Mediazioni specifiche per ogni fascicolo: tre brevi soste iniziali, richiamo contestuale prima della decisione e aiuto riapribile.
- Taccuino con rilettura dei documenti aperti, valutazione della provenienza, collegamenti spiegati tra fonti e revisioni motivate dell'ipotesi. Le relazioni sono proposte del giocatore, senza correzione automatica.
- Argomentazione autonoma prima della firma: tesi, prove, nesso logico verso misura e responsabilità, alternativa e incertezza. La nota viene fissata prima del feedback.
- Rilettura del ragionamento dopo il report, uso esplicito del feedback, piano per un caso diverso e debrief trasversale a fine sessione.
- Dialogo semantico con focus, Escape e scorrimento. Mouse, touch e tastiera sono isolati dalla scena sottostante mentre il dialogo è aperto.
- Numero della versione derivato da package.json, visibile anche nella schermata iniziale e nel suo strato di lettura accessibile.
- Anche i contatori aggregati derivano la versione da package.json. Il servizio mantiene la compatibilità con i client 4.0 precedenti; risposte e note guidate restano escluse.

Le annotazioni sono facoltative e temporanee nella scheda. Reload e nuova partita le cancellano. Non entrano nei salvataggi, nei rapporti esportati del gioco o nella telemetria. La valutazione dei 14 casi e lo schema dei salvataggi v2, con migrazione v1, restano compatibili.

## Metodo e strumenti di ricerca

Il dossier `docs/v5/` contiene le matrici A/B/C, la mappa LM–GM, l'analisi CEPAJe, i riferimenti DigComp 3.0, la bibliografia europea verificata, la rubrica preliminare e il protocollo Study 02. Le osservazioni ricevute non costituiscono endorsement o validazione scientifica.

Il laboratorio Study 02 è disponibile nel repository tramite `npm run study02:local`: due forme indipendenti, quattro fonti nuove per forma, risposta libera bloccata alla consegna, osservazione strutturata e codifica solo umana. È separato dalla build pubblica e non autorizza una raccolta con partecipanti. Il debrief del gioco non viene confuso con la prova indipendente di trasferimento.

## Verifiche e limiti

Il ciclo metodologico è stato verificato su tutti i 14 casi nelle tre lingue e su altri tre profili di schermo: 45 percorsi guidati. Sono passati anche 42 percorsi standard con ripristino dei rapporti, 12 combinazioni modalità/lingua e 12 configurazioni Study 02. I dettagli delle prove sul prototipo sono in `docs/v5/TEST_RESULTS.md`; la release è sottoposta anche ai controlli di build, metadati e browser della pipeline.

La prestazione nel gioco non dimostra pensiero critico. Efficacia educativa, equivalenza delle forme, rubrica, traduzioni e accessibilità con tecnologie assistive reali richiedono ancora verifica umana. Nessun punteggio automatico di pensiero critico è introdotto. Non si rilasciano certificazioni o attestazioni di competenza.

Il profilo 4K è passato con GPU Direct3D11. L'avvio diretto a 4K con rendering esclusivamente software ha superato i 90 secondi nel Preload preesistente: questo limite resta documentato. Il gioco semplifica il diritto per finalità educative e non sostituisce il testo vigente o un parere professionale.

## Aggiornamento

Aprire il sito o ricaricare la pagina dopo il deploy. I salvataggi esistenti vengono mantenuti. Per la riproduzione della ricerca, indicare la versione esatta e conservare il tag usato; la V5.0 non equivale a una validazione empirica.
