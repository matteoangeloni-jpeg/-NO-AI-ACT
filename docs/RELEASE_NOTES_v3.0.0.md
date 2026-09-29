# NO AI ACT — v3.0.0

Data della candidata: 29 settembre 2026. Il tag `v3.0.0` **non è ancora
pubblicato**: lo mette il proprietario. Le credenziali delle sessioni di
sviluppo sono limitate al branch e un push di tag restituisce 403 — verificato,
non supposto.

## Perché una major, e non una 2.4

La proposta iniziale era 2.4.0, tarata sul semver da libreria: nessuna rottura,
nessuna migrazione dei salvataggi, inventario delle rotte invariato. Era il
criterio sbagliato. Qui non c'è un'API con consumatori: c'è un prodotto che
insegna una norma, e **quella norma è cambiata**.

Il Regolamento (UE) 2026/1744 — il Digital Omnibus sull'IA, in vigore dal
27 luglio 2026 — ha modificato l'AI Act. La 3.0 è la prima versione che insegna
il regolamento **come modificato**, invece di quello del 2024.

**Ma i salvataggi restano compatibili.** Nessuna struttura dati cambia, nessuna
chiave viene rinominata, nessuna migrazione è necessaria: chi ha una partita in
corso la riapre. Una major qui segna un cambio di *edizione*, non di formato, e
va detto perché «3.0» normalmente fa temere il contrario.

---

## Il calendario che il sito insegnava era superato

Il difetto più grave della release, e nessuno dei 1211 test poteva vederlo: i
test verificano che il codice faccia quello che dice, non che quello che dice
sia vero.

| | il sito diceva | la norma dice |
|---|---|---|
| Alto rischio Allegato III | dal 2 ago 2026 | **2 dicembre 2027** |
| Alto rischio Allegato I | 2 ago 2027 | **2 agosto 2028** |
| Nuovi divieti art. 5(1)(ba),(bb) | non esistevano | **2 dicembre 2026** |
| Alto rischio della PA | assente | **2 agosto 2030** |
| Tappe rimaste | una | **almeno quattro** |

**Una trappola, documentata perché non ci ricada il prossimo.** Cercando le date
nel regolamento si incontra un «2 agosto 2027» che sembra la data dell'alto
rischio: è il termine per le **sandbox normative** (art. 57). Considerando 40 e
articolo 113 concordano su **2 dicembre 2027**. Chi corregge con una ricerca
testuale sostituisce una data sbagliata con un'altra data sbagliata.

### Le altre correzioni normative

- **Due pratiche vietate in più.** L'articolo 5 ne ha sei, non quattro. Aggiunte
  IT ed EN **con i limiti dei paragrafi 1a e 1b**: senza, il divieto sembra
  colpire qualunque sistema generativo. Un divieto insegnato più largo del vero
  è sbagliato quanto uno insegnato più stretto.
- **L'articolo 4 non chiede più di «garantire».** Chiede misure che *sostengano
  lo sviluppo* dell'alfabetizzazione, e dice espressamente che l'obbligo non
  impone di garantire un livello di alcun individuo. È un limite alla pretesa,
  non uno sconto sull'obbligo.
- **L'enforcement è a due corsie.** L'AI Office diventa *esclusivamente*
  competente sui sistemi costruiti su un modello GPAI dello stesso fornitore e
  su quelli integrati in VLOP/VLOSE, con ispezioni in loco, sigilli, penalità di
  mora e pubblicazione delle decisioni. Un'impresa che costruisce
  un'applicazione sul proprio modello non ha come interlocutore l'autorità del
  suo Paese: ha la Commissione.
- **Articolo 4a, articolo 25(2), articolo 27(4)** integrati nelle pagine GDPR,
  provider/deployer e FRIA.

Mappatura completa delle 43 voci di modifica in
[`DIGITAL_OMNIBUS_IMPACT_REVIEW.md`](DIGITAL_OMNIBUS_IMPACT_REVIEW.md), con un
elenco esplicito di **azioni NON necessarie**: non farle è una decisione.

---

## Il quattordicesimo caso

**«Il pregiudizio corretto»** — articolo 4a, il dilemma più giocabile
dell'intero Omnibus: per accorgersi che un sistema discrimina per origine etnica
o salute bisogna trattare proprio quei dati, che il GDPR protegge.

Il fornitore apre **cinque lucchetti su sei**. Il bias c'era, l'ha trovato,
l'ha corretto: il divario nei tassi di scarto è passato da quattordici punti a
due, e regge a un ricalcolo indipendente. Ma il campione con origine etnica e
dati sanitari è andato a un consulente esterno, e il registro non dice perché
quei dati fossero strettamente necessari.

**La trappola è il terzo reperto**: la relazione sulla correzione è *vera*.
Citarla al posto di un reperto rilevante degrada l'esito, perché un buon
risultato non sana una base giuridica che manca.

Classificazione **alto rischio, non vietata**: l'articolo 4a quel trattamento lo
consente, e il suo secondo paragrafo dice che nessuno è obbligato a cercare i
bias. Rispondere «vietata» punisce chi ha cercato.

Con il suo **tema musicale**: due sinusoidi a 330 e 331,2 Hz che battono 1,2
volte al secondo — il divario che si sente — e un oscillatore a 0,012 Hz che
stringe la distanza senza mai arrivare all'unisono, perché il divario è sceso a
due punti, non a zero. Sotto, una quinta vuota che non si risolve: la base
giuridica che manca.

---

## Interfaccia: «crowded» misurato

Chloé Pété (Media & Learning Association) ha riferito che l'interfaccia può
risultare *crowded*. È il **primo e unico riscontro d'uso da una persona
esterna** nella storia del progetto.

`npm run diag:density` gioca una partita vera e misura undici schermate. **Tre
ipotesi su quattro sono cadute**, e vale più della quarta:

| Ipotesi | Esito |
|---|---|
| sovrapposizioni fra testi | **zero**, su undici schermate |
| corpo troppo piccolo | i testi a 9,5 px sono i **timbri**, atmosfera |
| troppe azioni insieme | 17 solo sulla mappa, che ha **un** blocco di prosa |
| **assenza di gerarchia** | ✅ sette blocchi entro **1,18×** |

Due correzioni con effetto misurato:

- **Le istruzioni si ritirano a compito svolto** sulla schermata dei reperti:
  7 → 5 blocchi, 1119 → 927 caratteri, copertura 53,1% → 50,9%. Nessuna funzione
  tolta; entrambe restano nello strato di lettura.
- **`LEZIONE DEL CASO` non è più il blocco più piccolo del rapporto** (era 12 px
  contro i 12,5 dei valori e i 13 dell'errore dominante). La frase che il
  giocatore dovrebbe portarsi via era la meno evidente.

E **sei carte su ventisei non hanno più il testo addossato**: un difetto che
c'era da prima e che nessun controllo vedeva, perché i rettangoli si toccavano
senza intersecarsi.

---

## Modifiche visibili da conoscere

- **`CONSENTITA A CONDIZIONI` / `ALLOWED ON CONDITIONS`** sostituisce
  `BIOMETRIA A CONDIZIONI` sul distintivo delle carte. La quinta identità
  significa «consentita a condizioni» ed era chiamata col nome del suo unico
  membro; con l'articolo 4a ha un secondo membro che con la biometria non
  c'entra. Glifo, colore e trattamento del fondo invariati, chiave nei
  salvataggi invariata.
- **I titoli delle due pagine calendario** nominano ora il Digital Omnibus. URL
  invariati, nessun redirect, inventario sempre 68 rotte.

## Strumenti nuovi

| | |
|---|---|
| `npm run diag:density` | densità e gerarchia dell'interfaccia, undici schermate |
| `npm run diag:case` | gioca **un caso preciso** dall'inizio alla carta norma |
| `node scripts/release/bump-version.mjs` | porta la versione ovunque, evitando il lockfile e i documenti storici |

Nessuno dei tre è un cancello: sono referti, e girano a richiesta.

## Guardie nuove

Tutte provate **rosse** contro il difetto vero, non contro uno inventato:

- citazioni del gioco che nominano l'AI Act modificato (attraversa i dizionari);
- affermazioni normative superate nel dist (sette frasi, 0 falsi positivi);
- luogo della mappa senza nome, in una qualsiasi delle due lingue;
- istruzioni dei reperti presenti all'ingresso e assenti a compito svolto;
- gerarchia della lezione nel rapporto, sul **rapporto** fra i corpi e non su un
  numero fisso;
- etichetta di un'identità condivisa che non nomina una sola norma.

## Verifiche

- `typecheck` pulito
- **1218 test su 72 file** (erano 1211 su 71)
- `build` + `verify:dist` PASS · `audit:seo` PASS (68 rotte)
- `smoke:all` **10/10** · smoke audio **15/15 temi**, scarto 3,4× su limite 4×
- `diag:case` su `case_bias`, IT ed EN

---

## Quello che questa release NON dimostra

- **Che il gioco sia leggibile.** Le misure dicono *dove* si concentra il
  carico, non che sia tollerabile. `MLA-01` resta **«in corso»**.
- **Che il sito sia normativamente completo.** Nove articoli dell'Omnibus
  restano letti in sintesi, e la lezione di questo ciclo è che una lettura
  sintetica non autorizza una classificazione.
- **Che le correzioni SEO funzionino.** Non osservabile senza Search Console.
- **Che il progetto sia validato didatticamente.** Non lo è: le due tornate di
  playtest non sono mai state eseguite, e i riscontri d'uso esterni restano
  **uno**.

## Azioni del proprietario

1. Verificare il deploy su `main` (già pubblicato).
2. Tagliare **`v3.0.0`** e scrivere la release, seguendo
   [`RELEASE_CHECKLIST.md`](RELEASE_CHECKLIST.md).
3. Decidere sulla newsletter — raccomandato un feed Atom, motivazione in
   [`NEWSLETTER_PRIVACY_ASSESSMENT.md`](NEWSLETTER_PRIVACY_ASSESSMENT.md).
4. Confermare o annullare l'etichetta `CONSENTITA A CONDIZIONI`, che si cambia
   in due stringhe.
