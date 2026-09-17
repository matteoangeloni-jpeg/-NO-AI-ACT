# NO AI ACT v2.3 — protocollo playtest press candidate

Versione del protocollo: 17 settembre 2026. Questo documento sostituisce la
guida v0.3.1 come gate per la candidata stampa.

## Scopo

Verificare che una persona nuova possa completare il ciclo investigativo senza
spiegazioni esterne, comprendere che non sta rispondendo a un quiz e produrre
una decisione motivata usando prove, norme e conseguenze.

La build supera il gate solo dopo due tornate. I test automatici provano che il
software funziona; queste sessioni provano che il gioco comunica.

## Build e preparazione

- Annotare commit, versione, browser, sistema operativo, risoluzione e lingua.
- Usare la stessa build che alimenta il press kit.
- Aprire `/play/?lang=it`, preferibilmente a 1920x1080 e a schermo intero.
- Cuffie consigliate; volume iniziale al 50%.
- Ripristinare il salvataggio tra tester.
- Assegnare un codice anonimo (`A01`, `A02`, `B01`); non registrare nomi nei
  fogli dei risultati.
- Registrare schermo o voce solo con consenso esplicito. In alternativa usare
  note anonime con tempi e citazioni non identificative.

## Regola del facilitatore

Dire soltanto: "Gioca come faresti da solo e pensa ad alta voce quando ti va".
Non spiegare AI Act, Inspector Desk, colori, punteggi o soluzione. Se il tester
resta fermo per 90 secondi, annotare il blocco prima di offrire un aiuto minimo.
Ogni aiuto rende il primo caso "non autonomo".

## Tornata A — usabilita, 5 persone

Campione minimo:

- almeno 2 giocatori abituali;
- almeno 2 persone che non conoscono l'AI Act;
- almeno 1 persona non abituata ai videogiochi su PC;
- nessuna persona che abbia gia visto questa build.

Percorso:

1. Avviare una nuova partita senza tutorial verbale.
2. Completare il primo fascicolo e firmare il rapporto.
3. Proseguire liberamente per 20-30 minuti o almeno tre casi.
4. Non chiedere di usare il confronto reperti durante il primo caso: va
   osservato se viene scoperto spontaneamente.
5. Dopo il primo rapporto, se non è stato usato, chiedere: "C'è qualcosa
   nell'interfaccia che ti aiuterebbe a confrontare le prove?" e annotare se il
   tester trova da solo l'Inspector Desk.

Osservazioni obbligatorie:

- tempo fino alla prima azione significativa;
- tempo di completamento del primo caso;
- numero e tipo di aiuti;
- reperti aperti, citati e confrontati;
- uso di fascicolo, norme e appunti durante la decisione;
- esitazioni su classificazione, misura, soggetto e motivazione;
- comprensione del rapporto e della conseguenza;
- problemi audio, testo tagliato, fullscreen, tastiera o focus.

Domande finali, nello stesso ordine:

1. Che cosa stavi facendo nel gioco, in una frase?
2. Qual è la differenza tra classificazione, misura e motivazione?
3. A che cosa servivano i reperti citati?
4. Racconta una conseguenza concreta prodotta da una tua decisione.
5. Dove avresti cercato una norma o il significato di un termine?
6. Il confronto tra reperti ti ha aiutato a decidere? Perché?
7. In quale momento ti sei sentito bloccato o hai cliccato a tentativi?
8. Lo descriveresti come quiz, indagine, simulazione o altro? Perché?

## Tornata B — credibilita, 4 profili

Coinvolgere una persona per profilo:

- giornalista o autore che segue videogiochi indipendenti;
- game designer esterno;
- docente o formatore;
- persona competente in AI Act o amministrazione pubblica.

Tutti giocano il percorso press di 20-30 minuti. Poi si raccolgono rilievi
specifici:

- **Giornalista:** gancio editoriale, leggibilita degli screenshot, ritmo,
  chiarezza dello stato "press candidate" e materiale mancante.
- **Game designer:** agency, costo delle scelte, leggibilita sistemica,
  feedback, varieta e rischio di percezione da quiz.
- **Docente:** comprensione trasferibile, carico cognitivo, debrief e uso in
  una sessione reale.
- **Esperto AI Act/PA:** errori sostanziali, eccessi di certezza, ruoli
  provider/deployer, alto rischio, trasparenza e FRIA.

Ogni rilievo deve indicare schermata/caso, gravita e proposta. Un disaccordo di
gusto non vale come errore giuridico; una formulazione fuorviante sì.

## Soglie di accettazione

- Zero blocchi, crash o errori console nel percorso consigliato.
- Almeno 4 tester A su 5 completano il primo caso senza aiuto.
- Almeno 4 su 5 distinguono classificazione, misura e motivazione.
- Almeno 3 su 5 ricordano una conseguenza narrativa specifica.
- Durata mediana del percorso press tra 20 e 30 minuti.
- Almeno 3 su 5 trovano l'Inspector Desk senza indicazione diretta; tutti lo
  comprendono dopo la domanda neutra.
- Nessun tester definisce l'esperienza "solo un quiz" senza riconoscere almeno
  una meccanica investigativa.
- Nessun rilievo giuridico sostanziale irrisolto nella tornata B.
- Screenshot, testi e audio della build testata coincidono con il press kit.

## Classificazione dei problemi

- `P0`: crash, salvataggio perso, impossibile proseguire, errore giuridico
  sostanziale. Blocca tag e outreach.
- `P1`: percorso non comprensibile senza aiuto, testo illeggibile, controllo
  essenziale non accessibile, rapporto incoerente. Blocca la candidata.
- `P2`: ritmo, gerarchia, suono o feedback confuso ma aggirabile. Correggere
  prima dell'outreach se ricorre in due sessioni.
- `P3`: preferenza o rifinitura isolata. Inserire nel backlog con evidenza.

## Decisione finale

Compilare `docs/PRESS_PLAYTEST_RESULTS_TEMPLATE.csv`. La candidata può essere
taggata solo se tutte le soglie sono soddisfatte e non restano `P0` o `P1`.
Se una soglia fallisce, correggere, incrementare la build candidate e ripetere
almeno i casi coinvolti con persone che non hanno visto la correzione.
