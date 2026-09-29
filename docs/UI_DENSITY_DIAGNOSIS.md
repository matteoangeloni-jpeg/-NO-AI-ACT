# Densità dell'interfaccia: la diagnosi misurata

Chloé Pété (Media & Learning Association) ha provato il gioco e ha riferito che
il contenuto è buono, che l'interfaccia può risultare **crowded** e che alcune
schermate **non sono sempre immediatamente leggibili**. È la voce MLA-01 del
[registro dei feedback esterni](EXTERNAL_FEEDBACK_LEDGER.md), e a oggi il primo e
unico riscontro d'uso da una persona esterna in tutta la storia del progetto.

Questo documento non contiene correzioni. Contiene le misure, perché «crowded»
non dice quali schermate né quanto, e senza numeri una correzione sostituisce un
gusto personale con un altro. Il rischio concreto è tradurre «crowded» in
«togliamo funzioni»: la profondità investigativa è il valore del gioco, e il
feedback riguarda la **presentazione**.

Le misure vengono da `npm run diag:density`, che gioca una partita vera —
titolo, mappa, fascicolo, reperti, confronto, decisione, riepilogo, rapporto — e
misura undici stati nell'ordine in cui li incontra chi gioca. Nessuna schermata è
ricostruita con dati finti.

## Che cosa si è misurato, e perché proprio questo

| Metrica | Perché |
|---|---|
| **blocchi di prosa** | testi da 40+ caratteri visibili insieme. Le etichette non affaticano; i paragrafi che competono sì. È la metrica più vicina a «crowded». |
| **caratteri a video** | quanto c'è da leggere prima di poter decidere. |
| **azioni disponibili** | contenitori premibili visibili. L'obiettivo dichiarato è una decisione primaria per volta. |
| **copertura** | percentuale della superficie logica occupata da contenuto, su griglia 128×72. |
| **testi sovrapposti** | coppie di testi della stessa scena che si intersecano. È il difetto che ha morso davvero. |
| **corpo minimo e gerarchia** | quante dimensioni distinte di testo convivono, e quanto stanno lontane fra loro. |

## Le misure, tutte

Mondo logico 1280×720, italiano, undici stati di gioco.

| Schermata | Prosa | Caratteri | Azioni | Copertura | Sovrapposti | Corpo min |
|---|---|---|---|---|---|---|
| Title | 3 | 376 | 4 | 18,5% | **0** | 12 px |
| Briefing | 3 | 194 | 0 | 3,8% | **0** | 11,5 px |
| CityMap | 1 | 726 | **17** | 31,4% | **0** | 11 px |
| Case (fascicolo) | 1 | 476 | 2 | 14,9% | **0** | 12 px |
| Evidence (carte chiuse) | 3 | 516 | 6 | 48,7% | **0** | 9,5 px |
| **Evidence (aperte, citate)** | **7** | **1119** | 8 | **53,1%** | **0** | 9,5 px |
| Evidence + confronto | 5 | 750 | 4 | 49,7% | **0** | 10,5 px |
| Decision (primo passo) | 3 | 594 | 12 | 27,2% | **0** | 9,5 px |
| Decision + confronto | 4 | 700 | 6 | 31,9% | **0** | 10,5 px |
| Decision (riepilogo) | 5 | 944 | 10 | 24,5% | **0** | 9,5 px |
| **Report** | **9** | 971 | 2 | 21,9% | **0** | 10 px |

## Quattro ipotesi, e come sono andate

Sono partito da quattro spiegazioni possibili di «crowded». Tre sono cadute sui
numeri, e questo vale più della quarta: sono tre correzioni che sarebbe stato
facile fare e che avrebbero cambiato il gioco senza migliorare il difetto.

### ❌ Non è sovrapposizione: zero, su undici schermate

Era l'ipotesi più forte, perché quel difetto c'era davvero: il riepilogo
laterale della decisione finiva **sotto** la scheda della motivazione, cinquanta
pixel dentro, e si è visto solo da uno screenshot del proprietario. Spegnendo
quella colonna (PR #101) è scomparso. Oggi nessuna coppia di testi si interseca
in nessuna delle undici schermate.

Una nota sul metodo, perché la prima misura diceva il contrario. Contando anche
le coppie fra scene diverse, «Evidence + confronto» risultava con **dodici**
sovrapposizioni. Sono il modale sopra la scena che oscura, cioè il comportamento
voluto: il modale del confronto è disegnato *dentro* la scena dei reperti, sopra
un velo semiopaco. Riconoscendo il velo dall'ordine di disegno, quelle dodici
diventano 18 testi velati per 902 caratteri — che non sono a video e non vanno
contati né fra i caratteri né fra i difetti.

### ❌ Non è il corpo troppo piccolo: i testi minuscoli sono decorazioni

Il corpo minimo è 9,5 px logici, che su un portatile 1366×768 diventano 10,1 px
fisici. Sembrava il colpevole. Guardando **quali** testi sono:

| Corpo | Testo |
|---|---|
| 9,5 px | `POSTAZIONE ISPETTIVA · ESAME REPERTI` |
| 9,5 px | `POSTAZIONE ISPETTIVA · REDAZIONE ATTO` |
| 10 px | `CLASSIFICA: BOZZA · NON PROTOCOLLATA` |
| 10 px | `CLASSIFICA: ATTO CONCLUSIVO · NON CLASSIFICATO` |

Sono i timbri della scrivania: atmosfera, non informazione che il giocatore deve
leggere. Ingrandirli non rende leggibile niente e rompe il linguaggio visivo —
un timbro si legge come timbro *perché* è piccolo. Fra i 44 blocchi di prosa, il
più piccolo è a **10 px** e sono anch'essi timbri; la prosa vera sta fra 11 e
13,5 px.

**La densità non cambia con la risoluzione, e va detto.** Il mondo logico è fisso
e la camera lo porta ai pixel veri: le misure qui sopra sono identiche a
1920×1080 e in 4K. Cambia quanto è grande la stessa schermata, non quanto è
piena. Quello che cambia con la risoluzione è la leggibilità fisica:

| Schermo | Scala | Corpo minimo a video |
|---|---|---|
| 1366×768 | 1,07× | 10,1 px |
| Full HD | 1,50× | 14,3 px |
| 2560×1440 | 2,00× | 19,0 px |
| 4K | 3,00× | 28,5 px |
| MacBook 1440×900 @2x | 1,13× | 10,7 px CSS (21,4 fisici) |

### ❌ Non è il numero di azioni, tranne sulla mappa

Il massimo è **17 azioni** sulla mappa civica, ma la mappa ha **un solo** blocco
di prosa: è densa di *scelte*, non di lettura, e le scelte sono il suo unico
scopo. Le altre dieci schermate stanno fra 0 e 12, e sulla decisione le dodici
sono le risposte fra cui scegliere — cioè la decisione primaria, non una
distrazione da essa.

### ✅ È l'assenza di gerarchia sotto prosa simultanea

Questo è il difetto, ed è misurabile.

| Schermata | Blocchi di prosa | Corpi distinti | Intervallo | Rapporto max/min |
|---|---|---|---|---|
| **Evidence (aperte, citate)** | **7** | 4 | 11–13 px | **1,18×** |
| **Report** | **9** | 5 | 10–13 px | **1,30×** |
| Decision (riepilogo) | 5 | 4 | 10,5–13,5 px | 1,29× |
| Evidence + confronto | 5 | 4 | 11–13 px | 1,18× |
| Decision + confronto | 4 | 3 | 11–12,5 px | 1,14× |
| Briefing | 3 | 3 | 11,5–15 px | 1,30× |
| Decision (primo passo) | 3 | 2 | 12–19 px | **1,58×** |

Sette paragrafi che competono entro un rapporto di **1,18×** significa che
nessuno di loro è visivamente primo. Un lettore non sa da dove cominciare, non
perché ci sia troppo, ma perché **niente dichiara di essere il punto d'ingresso**.
È esattamente la frase di Chloé Pété: non «illeggibili», ma «non sempre
immediatamente leggibili» — manca l'immediatezza, non la leggibilità.

Il confronto interno lo conferma: la schermata con il rapporto più ampio,
`Decision (primo passo)` a 1,58×, è anche quella che nessuno ha mai segnalato,
e ha la domanda in evidenza sopra tre righe di contesto. Il progetto sa già
farlo; non lo fa dove serve di più. Nel giro, 44 blocchi di prosa si distribuiscono
su **dieci** corpi distinti a passi di mezzo pixel fra 10 e 19 px: una scala che
con dieci livelli in nove pixel non produce gerarchia, produce rumore.

### E un secondo difetto, trovato guardando l'inventario

Sulla schermata più carica, due dei sette blocchi sono **istruzioni che hanno già
esaurito il loro scopo**:

| Caratteri | Testo |
|---|---|
| 87 | «Esaminare tutti i reperti, poi citare quelli che fondano…» |
| 105 | «Citare un reperto lo aggiunge al rapporto, ma non determina…» |

Sono misurati nello stato **dopo** che il giocatore ha esaminato tutto e citato:
spiegano come fare una cosa già fatta, e competono con i reperti che il giocatore
sta leggendo. Togliendole a istruzione compiuta la schermata passa da 7 a 5
blocchi e da 1119 a 927 caratteri, **senza rimuovere una sola funzione**. È
progressive disclosure nel senso proprio: l'informazione non spare, smette di
insistere.

## Il confronto fra le due lingue smentisce un'attesa

Si dà per scontato che l'italiano sia più lungo dell'inglese. Sulle schermate di
questo gioco è vero, e conta:

| Schermata | IT | EN | Δ |
|---|---|---|---|
| CityMap | 726 | 658 | −68 |
| Evidence (aperte, citate) | 1119 | 1055 | −64 |
| Decision + confronto | 700 | 651 | −49 |
| Title | 376 | 335 | −41 |
| Report | 971 | 942 | −29 |

L'inglese è **più corto su tutte e undici**. Ne segue una conseguenza pratica:
l'italiano è il caso peggiore, e una correzione tarata sull'italiano copre anche
l'inglese. Il contrario non sarebbe vero.

Un'eccezione da tenere presente: in inglese il rapporto ha **10** blocchi di
prosa invece di 9, pur avendo meno caratteri. Il conteggio dei blocchi e quello
dei caratteri non si muovono insieme, e il primo è quello che pesa.

## Che cosa segue, e che cosa non segue

**Fatto** — due interventi, entrambi dentro il vincolo del proprietario
(«nessun redesign radicale, l'identità gaming resta»):

### 1. Le istruzioni si ritirano a compito svolto

Sulla schermata dei reperti, quando tutti sono aperti e ne sono citati almeno
due. Misurato prima e dopo, sulla stessa partita:

| | prima | dopo |
|---|---|---|
| blocchi di prosa | 7 | **5** |
| caratteri a video | 1119 | **927** |
| copertura | 53,1% | **50,9%** |

Nessuna funzione rimossa, e nulla perso per chi legge con uno strumento
assistivo: entrambe le righe restano nello strato di lettura — la nota sulla
citazione prima non c'era nemmeno, ed è stata aggiunta proprio adesso.

Il ritiro è in dissolvenza e passa per `reveal()`, che con «riduci movimento»
attivo applica subito lo stato finale invece di animare. Non l'avevo fatto: il
test `tests/motion.test.ts` mi ha fermato, e ha fatto bene. La guardia sta in
`inspector-desk-smoke.mjs` e pretende **entrambe** le facce — le righe presenti
all'ingresso, assenti a compito svolto — perché pretendere solo l'assenza
sarebbe verde anche se quelle righe non fossero mai esistite. Provata rossa
spegnendo la costante `RITIRA_ISTRUZIONI_A_COMPITO_SVOLTO`, e nomina entrambe.

### 2. Il blocco primario del rapporto era il più piccolo

Questa la misura l'ha trovata, non l'avevo prevista. Nell'inventario del
rapporto:

| Corpo | Blocco |
|---|---|
| 13 px | errore dominante |
| 12,5 px | valori dei campi (cinque blocchi) |
| **12 px** | **`LEZIONE DEL CASO`** |

La frase che il giocatore dovrebbe portarsi via — il perché educativo, l'unica
ragione per cui il gioco esiste — era il testo **più piccolo** della schermata a
parte i timbri. Non è una questione di gusto: è una gerarchia rovesciata, e si
vede solo mettendo in colonna i corpi di tutti i blocchi.

### E una correzione a questo stesso documento

La prima stesura prometteva anche «gerarchia su `Evidence`», con il rapporto
1,58× di `Decision (primo passo)` come bersaglio. Rimisurando dopo
l'intervento 1, entrambe le metà si sono rivelate sbagliate.

Su `Evidence` i cinque blocchi rimasti sono tre testi di reperto a 12,5 px — che
sono **pari fra loro**, e devono esserlo, perché sono tre prove da pesare — più
due righe di stato a 13 px. La gerarchia c'era già: erano le due istruzioni a
coprirla. Togliere era la correzione, non aggiungere un gradino.

E il bersaglio 1,58× non si trasferisce: su `Decision (primo passo)` quel
rapporto è fra una **domanda** a 19 px e il suo contesto, non fra due paragrafi.
Portare un paragrafo di 97 caratteri a 19 px non è gerarchia, è un titolo per
sbaglio. Il bersaglio giusto, per un blocco di prosa, è **essere distinguibile
dai suoi pari**, non stare a un rapporto fisso da loro.

**Non segue**, e va scritto perché non farlo è una decisione:

- **Non** togliere funzioni, reperti o passi di decisione. Il feedback riguarda
  la presentazione; la profondità è il valore.
- **Non** ingrandire i timbri: sono piccoli di proposito e non contengono
  informazione necessaria.
- **Non** rifare la scala tipografica del gioco. Dieci corpi in nove pixel sono
  troppi, ma normalizzarli tutti tocca undici schermate per curarne due.
- **Non** intervenire sulla mappa civica: 17 azioni sono il suo scopo, e un solo
  blocco di prosa dice che il carico lì non è di lettura.
- **Non** dedurre dalle misure che il gioco sia leggibile. Le misure dicono
  *dove* si concentra il carico, non che il carico sia tollerabile: quello lo
  dicono le persone. Le soglie del [protocollo di
  playtest](PRESS_PLAYTEST_PROTOCOL_v2.3.md) restano **non misurate** — non
  mancate, mai misurate.

## Come si ripete la misura

```bash
npm run build
npm run diag:density              # italiano
LANG_CODE=en npm run diag:density # inglese
```

Le misure complete finiscono in `.diag/ui-density-<lingua>.json`, con
l'inventario di ogni blocco di prosa — corpo, caratteri, prime parole — perché
«troppo denso» non si corregge e «questi sette blocchi competono» sì. La cartella
non è versionata: le misure si rifanno, non si archiviano.

Da rilanciare **dopo ogni correzione all'interfaccia**: è l'unico modo per dire
se una modifica ha ridotto il carico o l'ha spostato.
