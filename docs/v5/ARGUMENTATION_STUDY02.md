# Rubrica preliminare e prova di trasferimento Study 02

Versione di lavoro del 21 novembre 2026. Disegno proposto, nessuno studio eseguito. Rubrica da validare con valutatori umani e partecipanti del pubblico previsto.

## Rubrica analitica preliminare

Ogni dimensione usa tre descrittori ordinali. Il codice 0 significa assenza di evidenza nel compito, 1 evidenza parziale e 2 evidenza articolata. Non sommare automaticamente le dimensioni in un punteggio di pensiero critico. Distinguere risposta assente, compito saltato e materiale illeggibile.

| Dimensione | 0 | 1 | 2 |
|---|---|---|---|
| Tesi circostanziata | Nessun giudizio identificabile | Giudizio con contesto incompleto | Giudizio riferito a finalità, uso e persone coinvolte |
| Provenienza e pertinenza | Fonte assente o irrilevante | Fonte nominata con contenuto pertinente | Contenuto e provenienza confrontati con limiti di attendibilità |
| Nesso fra prova e conclusione | Giudizio senza ragione | Una prova accostata alla tesi | Passaggio logico esplicito fra evidenza, norma e misura |
| Interpretazione alternativa | Nessuna alternativa considerata | Alternativa nominata | Alternativa plausibile confrontata con una prova discriminante |
| Incertezza e diritti | Certezza immotivata o dubbio generico | Una informazione mancante pertinente | Limite del giudizio, informazione richiesta e conseguenza per le persone |
| Revisione dopo il feedback | Ripete l'esito | Descrive un cambiamento o conferma | Motiva revisione o mantenimento con una prova e un criterio |

Una conclusione giuridicamente errata può contenere un ragionamento documentato. Codificare separatamente la correttezza normativa, con una chiave giuridica revisionata. Una conclusione corretta con una giustificazione debole mantiene la sua distinzione. Il comportamento osservato e il testo vanno letti insieme, includendo spiegazioni alternative come difficoltà linguistiche, lettura, memoria, esperienza videoludica e familiarità con il tema.

## Esempi per formare i valutatori

- Evidenza parziale del nesso logico nel compito dimostrativo «La scheda dice che il controllo è umano, quindi mi fiderei». Nominare la fonte non prova di avere controllato come viene usata.
- Evidenza articolata «La scheda dichiara il riesame, ma il registro mostra decisioni confermate senza accesso ai dati. Prima di accettare la misura chiederei come il revisore può modificarla». La descrizione lega affermazione, riscontro, richiesta e limite.
- Il campo vuoto resta mancante. Un campo lungo o linguisticamente ricco non riceve automaticamente una valutazione superiore.

Gli esempi sono scritti per il progetto e vanno sostituiti da ancore ricavate da un pilot con consenso.

## Specifica della prova indipendente

Domanda primaria. Il percorso guidato aiuta a costruire argomentazioni documentate in uno scenario nuovo, a parità di contenuti e tempo disponibile?

Disegno raccomandato. Confronto con versione standard a contenuti equivalenti, assegnazione casuale individuale quando compatibile con il contesto. Se si assegna per classe, considerare dipendenza intra-classe e numerosità effettiva. Registrare familiarità normativa e competenze di lettura iniziali. Prespecificare outcome, confronto e analisi prima della raccolta. La numerosità richiede una giustificazione di potenza e un effetto minimo rilevante deciso dal gruppo di ricerca.

| Momento | Procedura | Evidenza | Salvaguardia |
|---|---|---|---|
| PRE | Task parallelo A o B, 10–15 minuti, prima del gioco | Argomentazione e conoscenza iniziale | Controbilanciare le forme |
| Gioco | Sessione individuale equivalente nei due gruppi, osservazione strutturata | Consultazione, ritorni, correlazioni spiegate, aiuto richiesto | Trattare scaffolding e feedback come parte dell'intervento |
| Restituzione individuale | Nota nel gioco prima del feedback, breve colloquio dopo | Ragioni e limiti dichiarati | Consenso e modalità equivalente per entrambe le condizioni |
| POST | Nuova forma indipendente, senza menu di risposte o correzione automatica | Outcome primario di trasferimento vicino | Somministrare prima del debrief collettivo per limitarne la contaminazione |
| Debrief | Ricostruzione, confronto, generalizzazione | Rielaborazione formativa | Se il debrief è parte dell'intervento studiato, spostare il POST dopo e dichiarare il diverso estimando |
| Follow-up | Terzo scenario dopo 2–4 settimane se fattibile | Mantenimento e trasferimento ulteriore | Registrare esposizioni intermedie e attrition |

## Materiali di trasferimento riservati al facilitatore

Forma A scritta integralmente in `research/study02/materials.mjs`, fuori dai 14 casi. Un archivio civico suggerisce laboratori ai visitatori. Quattro fonti fittizie originali: scheda del fornitore, procedura della direzione, registro operativo e segnalazione di un visitatore. La promessa di orientamento non coincide con l'attivazione documentata degli inviti; il registro limitato non dimostra la causa di ogni mancata ammissione. Mancano avviso, natura educativa effettiva ed esiti dei riesami. Sono ammesse conclusioni condizionate e alternative motivate.

Forma B scritta integralmente nello stesso modulo. Una cooperativa artigiana suggerisce incontri di apprendimento pratico ai soci. Quattro fonti con gli stessi ruoli documentali e le stesse lacune, ma una superficie narrativa diversa. Entrambe le forme e le consegne esistono in IT/EN/FR. La corrispondenza di struttura e lunghezza è una scelta progettuale, non equivalenza psicometrica dimostrata. Un giurista deve revisionare destinazione d'uso e condizioni dell'allegato III prima della somministrazione.

Consegna comune. Spiega cosa occorre decidere, quali due fonti hanno più peso e perché, una lettura alternativa, una informazione ancora necessaria e una misura proporzionata alle circostanze. Distribuire a entrambi i gruppi gli stessi estratti normativi essenziali. Non riutilizzare titoli, frasi o coppie decisive dei casi del gioco. Nessun suggerimento automatico prima della consegna.

## Laboratorio locale e griglia di osservazione

Avvio `npm run study02:local`, indirizzo `http://127.0.0.1:4262/`. Non ha un collegamento dal gioco pubblico e non entra in `dist`. Il server accetta solo GET/HEAD su indirizzo di loopback e non riceve testi. L'interfaccia conserva il lavoro in memoria; nessuna telemetria, cookie o salvataggio automatico. Una copia JSON locale si scarica soltanto con un comando esplicito e contiene l'argomentazione solo dopo la consegna. Non vengono generati identificativi. Il laboratorio è attualmente uno strumento di prova con materiali fittizi; non autorizza il reclutamento o la raccolta su partecipanti reali.

La pagina della prova mostra scenario, quattro fonti, quadro normativo comune e un solo campo libero. La consegna blocca il testo e la configurazione. Il debrief del facilitatore è disponibile soltanto dopo la consegna e un'azione esplicita: non corregge né classifica l'argomentazione. PRE e POST si eseguono su schede separate; il facilitatore assegna A→B o B→A secondo il controbilanciamento prespecificato. I materiali comuni si possono stampare per una somministrazione uniforme. L'eventuale consultazione esterna delle norme va tenuta equivalente fra condizioni e documentata.

La scheda di osservazione ha sette righe: esplorazione/ritorni/aiuto; provenienza e limiti; correlazioni spiegate; mantenimento o revisione dell'ipotesi; argomentazione pre-feedback; incertezza/diritti; uso del feedback/nuova strategia. Per ogni riga il ricercatore separa azione o frase e ordine degli episodi dall'interpretazione e dalla spiegazione alternativa. Il contesto CEPAJe raccoglie condizioni di mediazione, apprendente, obiettivo, gioco e dispositivo senza nomi. Il ricercatore distingue osservato, richiesto dal prompt e inferito.

La rubrica si compila manualmente con codice non osservato/non applicabile, 0, 1 o 2 e una ragione testuale. Non viene sommata. La dimensione di revisione dopo il feedback riguarda il debrief del gioco e resta non applicabile nelle prove PRE/POST indipendenti. La correttezza normativa ha uno spazio separato. Per una restituzione orale equivalente utilizzare trascrizione mediata dentro il protocollo autorizzato; il tool non attiva microfoni o riconoscimento vocale.

Controllo della contaminazione. Nessuna forma Study 02 va mostrata nel gioco o nel materiale formativo pubblico. La domanda di generalizzazione nel debrief del gioco è una riflessione formativa, distinta dall'outcome di trasferimento. Chi conosce già una forma non deve riceverla come prova nuova. Il facilitatore documenta esposizioni e adattamenti senza cambiare retroattivamente l'outcome.

## Validazione e analisi

Prima del trial, fare revisione di contenuto da parte di giurista, docente e metodologo. Eseguire cognitive interviews sui task e sulle consegne nelle tre lingue. Traduzione con revisione bilingue e controllo delle differenze di difficoltà. Formare due valutatori con ancore comuni, assegnare testi senza indicazione della condizione e doppia codifica almeno di un sottoinsieme prespecificato. Calcolare accordo per dimensione, intervalli di confidenza e kappa pesata quando appropriata, prima di risolvere i disaccordi. Esaminare effetti pavimento/soffitto e disaccordi sistematici.

Analisi primaria con aggiustamento per PRE, dipendenze del campione e intervalli di confidenza. Separare correttezza normativa e dimensioni argomentative. Trattare tempi, clic, revisioni ed esiti del gioco come variabili descrittive. Dichiarare dati mancanti e analisi di sensibilità. Per una raccolta qualitativa modesta privilegiare la triangolazione e descrivere i casi discordanti. Nessuna inferenza causale da soli eventi aggregati.

## Confine dei dati

La versione pubblica non raccoglie testi, ipotesi, risposte individuali, codici partecipante o cronologie del prototipo. Il taccuino di gioco è memoria temporanea della scheda e viene azzerato al cambio sessione o al reload. Il ricercatore può osservare una sessione solo dentro un protocollo autorizzato esterno. Conservazione, accesso, cancellazione, informativa, minori e base giuridica devono essere decisi dal titolare prima di reclutare. Gli identificativi dello studio restano nel sistema di ricerca, separati dai contatori operativi.
