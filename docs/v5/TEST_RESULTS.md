# Verifica finale della copertura metodologica V5


> Edizione linguistica V5.3.0 · 23 novembre 2026. Il dossier e i materiali locali di Study 02 sono ora disponibili in sei lingue. Date, conteggi e risultati del prototipo descrivono le esecuzioni storiche. Il contratto attuale del registro facoltativo per maggiorenni è in SESSION_JOURNAL.md e supera il precedente vincolo dei soli aggregati. Le traduzioni non dimostrano equivalenza degli strumenti, efficacia educativa o validità della rubrica. Non sono stati eseguiti nuovi test per questo aggiornamento dei contenuti.



21 novembre 2026. Rapporto del prototipo precedente al rilascio V5.0.0. Test avviati dopo l'implementazione dell'intera lista operativa in COVERAGE_COMPLETION.md. Le correzioni emerse nella verifica sono state seguite da nuove esecuzioni. I risultati qui descritti riguardano il clone locale; i controlli della pubblicazione sono documentati separatamente nella release.

| Controllo | Esito osservato |
|---|---|
| TypeScript | PASS, compresa la build dopo la correzione del dialogo |
| Suite Vitest | 1.509 test in 95 file, tutti superati |
| Build Vite | PASS; avviso sulla dimensione del bundle del gioco, circa 1,83 MB minificato |
| Audit SEO | 155 rotte, nessun difetto critico e nessun avviso |
| Verifica dist | 155/155 rotte, HTML senza mojibake, nessun modulo esterno di raccolta |
| Percorso guidato | 45 percorsi superati: tutti i 14 casi × IT/EN/FR più tre profili di layout |
| Regressione catalogo | 42 percorsi standard superati, esiti corretti e rapporti ripristinati al reload |
| Modalità | Turno, Libera, Sorpresa, Ripasso × tre lingue: 12 configurazioni superate |
| Study 02 | Due forme × tre lingue × PRE/POST: 12 configurazioni superate |
| Dati del gioco | I marcatori sintetici scritti in ipotesi, fonti, relazioni e riflessioni non compaiono in localStorage o telemetria; reload cancella le note |
| Dati Study 02 | Nessun cookie o storage del browser; copia locale soltanto esplicita; POST respinto con 405; materiali esclusi dalla build pubblica |

## Cosa copre il percorso guidato

Ogni percorso entra dal fascicolo, attraversa le tre soste iniziali, conserva la prima ipotesi, apre i documenti con i tasti reali del gioco e cita le prove. Nel taccuino rilegge una fonte, ne annota provenienza e limiti, registra due revisioni motivate e un collegamento spiegato. I clic e i tasti dentro il dialogo devono lasciare invariata la selezione dei reperti sottostanti.

Il test prosegue attraverso il richiamo metodologico, le quattro decisioni e la firma. Scrivere un invio nella nota non deve firmare. La conferma fissa il testo prima del report; tentativi di modifica successiva non lo cambiano. Il debrief distingue nota precedente, norma, riflessione, uso del feedback e piano per un caso nuovo. A fine sessione la sintesi comprende tutti i casi guidati completati. Il reload cancella il nuovo stato temporaneo. Nessuna richiesta esterna o POST viene consentita durante lo smoke.

Profili: IT 1920×1080 e 320×800; EN 390×844 e 640×360; FR 390×844 e 3840×2160. Focus, Tab, Escape, input multilinea e assenza di overflow del dialogo sono controllati. Il 4K finale usa Direct3D11 con GPU Intel Iris Xe, backend rilevato e registrato nel JSON. Gli altri cinque profili usano SwiftShader. La verifica non equivale a una prova con dispositivi fisici, tastiera virtuale o lettori di schermo reali.

I 14 casi sono selezionati con una fixture, mentre reperti, decisioni e firma passano dall'interfaccia reale. Il test conferma gli esiti del motore esistente; non dimostra comprensione del partecipante o accuratezza giuridica indipendente della chiave.

## Correzioni emerse e limiti tecnici

1. Il watcher di Vite poteva tentare di osservare un download di prova ancora bloccato da Windows, producendo EBUSY. Le cartelle degli artefatti e del grafo locale sono ora escluse. Il catalogo e il percorso guidato completi hanno superato la nuova esecuzione.
2. Phaser ascolta anche eventi del mouse sulla finestra: un clic nel dialogo nativo poteva cambiare una citazione. Il dialogo disabilita temporaneamente l'input della scena e interrompe la propagazione di eventi di puntatore, mouse e touch. Il test riproduce il caso credito e controlla l'invarianza dei reperti in tutti i 45 percorsi finali.
3. Il controllo sui moduli esterni scandiva anche la crescente cartella degli artefatti sintetici e ha raggiunto il timeout. Ora esclude esattamente scripts/smoke/out, che non è sorgente distribuito. Le verifiche sui sorgenti pubblici e sul dist rimangono attive; la suite finale supera 1.509 test.
4. L'avvio nativo a 4K con rendering esclusivamente software ha superato i 90 secondi nel Preload preesistente. La diagnostica con Direct3D11 ha raggiunto Title in circa 5,6 secondi e l'intero percorso 4K finale, compreso il reload, è passato. Il timeout software resta un limite di quella configurazione; non viene dichiarato risolto. Nessuna modifica al motore di rendering è stata introdotta.

## Study 02

Le dodici configurazioni verificano quattro fonti per forma, assenza di scelte di risposta nel task, argomentazione libera, blocco alla consegna, debrief indisponibile prima della consegna, sette righe di osservazione e sei dimensioni di codifica umana. Il codice non osservato resta distinto da 0. Non esistono totale o correzione automatica. La copia JSON contiene il testo consegnato e gli appunti espliciti, senza identificativi del partecipante. I test usano solo testo sintetico.

## Riproduzione

Nel clone locale eseguire i comandi elencati in METHODOLOGY_IMPLEMENTATION.md. Per replicare il profilo 4K su questa macchina Windows, impostare CHROMIUM_PATH al Chrome installato e INQUIRY_4K_GPU=d3d11. INQUIRY_ONLY e INQUIRY_CASE sono filtri diagnostici; la verifica finale non li usa. I JSON registrano viewport, lingua, caso e renderer effettivo.

## Validazione umana ancora necessaria

La copertura funzionale dei feedback è implementata e verificata nelle configurazioni dichiarate. Efficacia educativa, qualità dell'argomentazione, equivalenza delle forme, traduzioni, accuratezza giuridica per la somministrazione e accessibilità con tecnologie assistive richiedono le verifiche umane del protocollo. Nessuno studio con partecipanti è stato svolto. Nessun risultato del gioco viene trasformato in un punteggio automatico di pensiero critico. Nessuna pubblicazione in produzione di questo incremento.
