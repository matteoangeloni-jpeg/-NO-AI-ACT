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
| FIX-01 | Fix Gaming Channel | posizionamento | n/a | aperto |
| TIG-01 | theindiegames | editoriale | n/a | in attesa |
| DIGRA-01 | DiGRA | disseminazione | n/a | aperto |
| AIL-01 | AI LITERATE / Dataninja | prodotto (atteso) | da determinare | in attesa |

**Riscontri d'uso da persone esterne: uno.** Le soglie del protocollo di
playtest — quattro tester su cinque completano il primo caso senza aiuto, quattro
su cinque distinguono classificazione, misura e motivazione — restano **non
misurate**. Non «mancate»: mai misurate. È il dato più importante di questo
registro.

---

## Come si aggiorna

Una voce per feedback, con un codice stabile. Si registra la citazione o una
sintesi fedele, mai una parafrasi che la rende più comoda. Se un feedback non
genera azione, si scrive perché: una voce chiusa senza motivo è indistinguibile
da una dimenticata.
