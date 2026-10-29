# Registro dei feedback esterni

Fonte unica dei riscontri ricevuti da fuori il progetto. Esiste perché i feedback
arrivano per canali diversi — email, conversazioni, social, conferenze — e senza
un registro si perdono, si ricordano male o si trasformano in requisiti che
nessuno ha mai chiesto.

## Due tipi, e non vanno mescolati

**Feedback sul prodotto** — qualcuno ha usato la cosa e riferisce com'è andata.
Genera lavoro.

**Interesse editoriale, disseminazione, opportunità** — qualcuno trova il
progetto interessante e propone di parlarne, ospitarlo, discuterlo. Genera
relazioni, non backlog.

Confonderli è il modo più rapido per lavorare sulle cose sbagliate: l'entusiasmo
di chi vuole scriverne non dice niente su quanto il prodotto funzioni, e una
recensione attesa non è un requisito.

## Legenda

**Gravità** — `alta`: impedisce o degrada l'uso per una parte del pubblico ·
`media`: attrito reale ma aggirabile · `bassa`: preferenza o rifinitura ·
`n/a`: non è un feedback di prodotto.

**Stato** — `aperto` · `in corso` · `risolto` · `in attesa` (dipende da terzi) ·
`non azionabile` (registrato, nessuna azione dovuta).

---

## Feedback sul prodotto

### MLA-01 · Media & Learning Association — Chloé Pété

| | |
|---|---|
| **Fonte** | Media & Learning Association, Chloé Pété |
| **Data** | settembre 2026 |
| **Tipologia** | UX / carico cognitivo |
| **Area** | interfaccia di gioco, tutte le schermate |
| **Gravità** | **alta** |
| **Stato** | **in corso** — diagnosi fatta, due correzioni fatte, validazione mancante |
| **Versione** | prossima release |

**Sintesi fedele.** Ha provato il gioco. Il contenuto è buono. L'interfaccia può
risultare *crowded*; alcune schermate non sono sempre immediatamente leggibili;
leggibilità e carico cognitivo vanno migliorati.

**Perché pesa più di tutto il resto.** È il **primo e unico feedback di prodotto
da una persona esterna** in tutta la storia del progetto. Fino a qui la qualità
era stata misurata da 1211 test automatici, che verificano che le cose
funzionino, non che si capiscano. Nessun test poteva produrre questa frase.

**Converge con un'osservazione interna.** Togliendo la colonna «stato della
città» (PR #95) e poi il riepilogo laterale (PR #101), il proprietario aveva già
identificato densità e ridondanza sulla schermata della decisione. Due
osservazioni indipendenti sullo stesso difetto.

**Azione svolta.** Diagnosi misurabile prima delle correzioni —
`npm run diag:density`, undici schermate di una partita vera, referto in
[`UI_DENSITY_DIAGNOSIS.md`](UI_DENSITY_DIAGNOSIS.md). **Vincolo del proprietario
rispettato: nessun redesign radicale, l'identità gaming resta.**

Tre delle quattro spiegazioni possibili di «crowded» sono cadute sui numeri, e
questo vale più della quarta: erano tre correzioni facili che avrebbero cambiato
il gioco senza toccare il difetto.

| Ipotesi | Esito |
|---|---|
| sovrapposizioni fra testi | **zero**, su undici schermate |
| corpo troppo piccolo | i testi a 9,5 px sono i **timbri** della scrivania, atmosfera |
| troppe azioni insieme | 17 solo sulla mappa, che ha **un** blocco di prosa |
| **assenza di gerarchia** | ✅ sette blocchi di prosa entro **1,18×** |

Due correzioni, con effetto misurato:

1. **Le istruzioni si ritirano a compito svolto** sulla schermata dei reperti —
   da 7 blocchi a 5, da 1119 a 927 caratteri, nessuna funzione tolta, entrambe
   conservate nello strato di lettura.
2. **`LEZIONE DEL CASO` non è più il blocco più piccolo del rapporto** (era
   12 px contro i 12,5 dei valori e i 13 dell'errore dominante). La frase che il
   giocatore dovrebbe portarsi via era la meno evidente.

**Perché lo stato è «in corso» e non «risolto».** Le misure dicono *dove* si
concentra il carico, non che sia tollerabile. Chiudere questa voce richiede che
qualcuno riprovi il gioco: fino ad allora è una correzione plausibile, non una
verificata. Vedi MLA-02, che è la via per ottenerlo.

**Da non fare.** Tradurre «crowded» in «togliamo funzioni». Il feedback riguarda
la *presentazione*, non la profondità investigativa, che è il valore del gioco.

---

## Opportunità e disseminazione

### MLA-02 · Media & Learning Association — pilot e Teacher Academy

| | |
|---|---|
| **Tipologia** | opportunità / validazione esterna |
| **Gravità** | n/a |
| **Stato** | aperto |

Apertura a: pilot con docenti, teacher educators, Teacher Academy, Special
Interest Group, feedback strutturato.

**Perché conta davvero.** Il piano di prontezza per la stampa prevede due tornate
di playtest esterni — `docs/PRESS_PLAYTEST_PROTOCOL_v2.3.md` — e a oggi
**nessuna delle due è mai stata eseguita**: il file dei risultati contiene solo
le etichette dei profili. Questa apertura è la via più credibile per colmare
proprio quel vuoto, con persone del mestiere invece che conoscenti.

**Azione proposta.** Usare l'occasione per rafforzare il protocollo di playtest
con una verifica esplicita del carico cognitivo, così la tornata misura anche
il difetto di MLA-01.

**Aggiornamento del 29 ottobre 2026 — la parte editoriale si è concretizzata,
quella di validazione no.** È uscito un contributo dell'autore sul sito
dell'associazione: *NO AI ACT: What if learning about AI regulation began with
an investigation?*, [media-and-learning.eu](https://media-and-learning.eu/no-ai-act-what-if-learning-about-ai-regulation-began-with-an-investigation/),
ottobre 2026. Va pubblicato sul sito nel carosello «Parlano di noi» della home,
dove sta già il contributo analogo di Fix Gaming Channel — etichettato lì, con
ragione, «non una recensione indipendente».

**Quello che questo aggiornamento NON è.** Un articolo **firmato dall'autore**
e ospitato da un'associazione è disseminazione: non è un riscontro d'uso, non è
un pilot con docenti e non sposta di una unità il conteggio in fondo a questo
file. La metà di MLA-02 che conta davvero — pilot, Teacher Academy, feedback
strutturato — **resta aperta e non programmata**. Scambiare la visibilità per
validazione è esattamente la confusione che le prime righe di questo registro
esistono per impedire.

### VGI-01 · VideogiochiItaliani — la ratio fra gioco e apprendimento

| | |
|---|---|
| **Fonte** | VideogiochiItaliani |
| **Data** | ottobre 2026 |
| **Tipologia** | game design / leggibilità degli obiettivi |
| **Area** | ciclo di gioco, nel suo insieme |
| **Gravità** | **alta** |
| **Stato** | **aperto** — diagnosi fatta, interventi pianificati (I6, I7) |
| **Versione** | rilevato su 3.0.0 |

**Sintesi fedele.** La *ratio* che collega la dimensione ludica e l'obiettivo
educativo non risulta sufficientemente evidente.

**Perché è la seconda voce che conta davvero.** È il **secondo riscontro d'uso
da una persona esterna** nella storia del progetto, dopo MLA-01. Due persone
fuori dal progetto hanno provato il gioco e hanno segnalato, indipendentemente,
due facce della stessa cosa: la prima che l'interfaccia è densa, la seconda che
il senso di quella densità non si legge.

**La diagnosi NON è «manca la struttura didattica».** L'audit del codice
(`docs/PROGRAMMA_4_0_AUDIT.md` §1.5) ha verificato il contrario: ogni fascicolo
dichiara misure corrette e parziali, posture degli indizi (`decisive` /
`minimizes_risk`), soggetto responsabile, motivazione corretta e debole, errori
dominanti possibili; `learningModel.ts` aggiunge obiettivi per caso e
misconcezioni attese; `MultiAxisFeedback` distingue già tre assi di valutazione.

Il problema è che **niente di tutto questo è visibile al giocatore prima del
debrief**. Gli obiettivi del caso esistono nel modello e li legge soltanto il
rapporto finale: si scopre su cosa si era valutati dopo aver deciso.

**Perché la distinzione cambia l'intervento.** Se la diagnosi fosse «manca
struttura», la risposta sarebbe aggiungere contenuto didattico. Essendo «la
struttura non è leggibile», la risposta è esporre quella che c'è — dichiarare
l'obiettivo all'ingresso del fascicolo e separare i tre assi nell'esito — senza
aggiungere spiegazioni testuali, che è quanto il brief del programma 4.0
esclude espressamente.

**Azione proposta.** Interventi I6 e I7 del piano 4.0. **Nessuno dei due è
stato eseguito**: questa voce resta aperta, e lo resterà finché una persona
esterna non riproverà il gioco — perché è una diagnosi di leggibilità, e la
leggibilità la misurano i lettori.

**L'intervista è pubblica dal 26 ottobre 2026.** *INTERVISTA a Matteo Angeloni:
NO AI ACT*, Videogiochi Italiani, [youtube.com](https://www.youtube.com/watch?v=lzh-1yXEJGY), 34 minuti, in
italiano. Pubblicata sul sito nel carosello «Parlano di noi» della home, dove
già compare la partita commentata della stessa testata del 3 ottobre: sono due
cose diverse e il carosello le distingue.
Il feedback registrato in questa voce era arrivato prima, in forma privata:
ora esiste anche un resoconto pubblico, e tre cose che vi si dicono vanno
tenute qui perché il registro non le conteneva.

**Uno — l'autore conferma la diagnosi, pubblicamente.** Al minuto 33 dice che
deve «migliorare l'apporto ludico» e «semplificare un po' l'interfaccia». È la
stessa cosa che dicono MLA-01 e VGI-01, detta dal responsabile del progetto in
una sede esterna. Non aggiunge una terza osservazione: rende pubblica la presa
d'atto delle prime due.

**Due — MLA-01 è quasi certamente il «dal Belgio» dell'intervista.** «Dal
Belgio alcuni mi avevano scritto che tutto bello, però l'interfaccia a volte è
un pochino pesante.» L'associazione di MLA-01 è belga (MEDEA: Media & Learning
ivzw, sede a Lovanio) e il contenuto coincide con MLA-01: densità
dell'interfaccia. **È un'inferenza, non una conferma dell'autore**, e va
scritta come tale — ma va scritta, perché a un lettore esterno quel passaggio
sembra un *terzo* riscontro. Se è MLA-01, il conteggio in fondo a questo file
resta due; se fosse qualcun altro, sarebbe il proprietario a doverlo dire.

**Tre — ci sono prove d'uso precedenti che questo registro non documenta.**
Nell'intervista l'autore racconta di aver fatto provare il gioco a più persone
di fasce d'età diverse, e di aver osservato che il riscontro migliore veniva da
chi già giocava: «nelle varie prove che io ho fatto il bias maggiore era
proprio la conoscenza del videogioco». Di quelle prove **non esiste traccia**
né qui né in `docs/PRESS_PLAYTEST_RESULTS_TEMPLATE.csv`: nessuna nota, nessun profilo,
nessuna misura. Non sono quindi risultati utilizzabili, e non entrano nel
conteggio; ma il fatto che l'autore le descriva in pubblico mentre la
documentazione del progetto non le menziona è un difetto del registro, non
dell'intervista. **Azione:** se quelle prove vanno contate, vanno prima
ricostruite e scritte qui dal proprietario, che è l'unico che le ricorda.

### FIX-01 · Fix Gaming Channel — posizionamento

| | |
|---|---|
| **Tipologia** | posizionamento e comunicazione |
| **Gravità** | n/a (non è un bug report) |
| **Stato** | aperto |

Trova particolarmente interessanti: la trasformazione della ricerca in
meccaniche, le semplificazioni necessarie, le limitazioni, i problemi inattesi
durante lo sviluppo, la trasparenza sul processo.

**Lettura.** Non chiede di cambiare il prodotto: dice che **la parte più
interessante del progetto è già scritta e non è abbastanza visibile**. Il
repository è pieno di questo materiale — decisioni motivate, misure, errori
riconosciuti — ma il sito ne mostra poco.

**Azione proposta.** Rafforzare research methodology, development story,
limitations e design rationale. Materiale esistente da esporre, non da inventare.

### TIG-01 · theindiegames — concept

| | |
|---|---|
| **Tipologia** | interesse editoriale |
| **Gravità** | n/a |
| **Stato** | in attesa |

Feedback positivo sul concept; recensione futura attesa.

**Da non fare.** Trasformarlo in requisito di prodotto finché non arriva una
recensione vera. Un apprezzamento sul concept non è un riscontro d'uso.

### DIGRA-01 · DiGRA — game studies

| | |
|---|---|
| **Tipologia** | disseminazione accademica |
| **Gravità** | n/a |
| **Stato** | aperto |

Interesse alla disseminazione e al confronto con la comunità dei game studies.
Non è usabilità.

**Nota.** Si allinea con la via accademica già disponibile all'autore
(dottorando): un contributo scritto vale più di una segnalazione.

### AIL-01 · AI LITERATE / Dataninja

| | |
|---|---|
| **Tipologia** | feedback specialistico AI literacy |
| **Gravità** | da determinare |
| **Stato** | **in attesa** |

Il gioco è stato condiviso con il team che lavora su progetti di AI literacy.
Riscontro specialistico non ancora arrivato.

**Da non fare.** Anticiparne il contenuto o dedurne conclusioni.

---

## Indirizzo del proprietario

Non è feedback esterno, ma vincola come si trattano quelli che lo sono.

| | |
|---|---|
| **Stato** | permanente |

- Preservare l'identità **gaming** del progetto: resta prima di tutto
  un'esperienza investigativa giocabile, non un sito didattico con un quiz.
- Non trasformare sito o gioco in un prodotto graficamente estraneo alla
  direzione attuale.
- La componente editoriale del sito funziona e conta per la visibilità organica:
  non va sacrificata.
- Concentrarsi su contenuti, funzionalità, comprensibilità, maneggevolezza e
  profondità di gioco.

---

## Quadro d'insieme

| Codice | Fonte | Tipo | Gravità | Stato |
|---|---|---|---|---|
| MLA-01 | Media & Learning Association | prodotto / UX | **alta** | **in corso** |
| MLA-02 | Media & Learning Association | opportunità | n/a | aperto |
| **VGI-01** | **VideogiochiItaliani** | **game design** | **alta** | **aperto** |
| FIX-01 | Fix Gaming Channel | posizionamento | n/a | aperto |
| TIG-01 | theindiegames | editoriale | n/a | in attesa |
| DIGRA-01 | DiGRA | disseminazione | n/a | aperto |
| AIL-01 | AI LITERATE / Dataninja | prodotto (atteso) | da determinare | in attesa |

**Riscontri d'uso da persone esterne: due** (MLA-01 e VGI-01). Era uno fino a
ottobre 2026, e il numero va tenuto aggiornato qui perché è — per dichiarazione
di questo registro — il dato più importante che contiene.

Le soglie del protocollo di playtest — quattro tester su cinque completano il
primo caso senza aiuto, quattro su cinque distinguono classificazione, misura e
motivazione — restano **non misurate**. Non «mancate»: mai misurate. E dal
29 settembre 2026 le due tornate non sono in programma, per decisione del
proprietario: quindi il progetto resta **didatticamente non validato**, e due
riscontri spontanei non sono un playtest.

**Il fatto che i due riscontri convergano non li moltiplica.** MLA-01 dice che
l'interfaccia è densa, VGI-01 che il senso di quella densità non si legge: sono
due facce dello stesso problema, osservate da due persone. È un segnale più
forte di uno, e resta un campione di due.

**E le pubblicazioni di ottobre 2026 non lo spostano.** Un'intervista e un
articolo sono due uscite, non due riscontri: la prima racconta un feedback già
registrato (VGI-01), il secondo è firmato dall'autore. Il «dal Belgio» citato
nell'intervista è quasi certamente MLA-01, non una terza persona. Il conteggio resta **due** —
e le prove d'uso informali che l'autore descrive nell'intervista non lo
alzano finché non sono documentate (vedi VGI-01, nota tre).

---

## Come si aggiorna

Una voce per feedback, con un codice stabile. Si registra la citazione o una
sintesi fedele, mai una parafrasi che la rende più comoda. Se un feedback non
genera azione, si scrive perché: una voce chiusa senza motivo è indistinguibile
da una dimenticata.
