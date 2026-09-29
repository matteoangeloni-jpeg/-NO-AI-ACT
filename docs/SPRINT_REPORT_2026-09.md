# Report dello sprint — settembre 2026

Il brief chiedeva un report finale strutturato. **Una nota di metodo prima di
tutto**: il brief elencava quattordici sezioni precise, e non ho più quell'elenco
sotto gli occhi. Ho organizzato il report per le **nove fasi** del brief, che
ricordo con certezza, invece di inventare quattordici intestazioni e farle
passare per le sue. Se serve esattamente quella forma, basta ripassarmi l'elenco.

---

## Fase 1 — Audit completo

Fatto, ed è servito a rovesciare una convinzione: il sito insegnava un calendario
dell'AI Act **superato dal 27 luglio 2026** e non lo sapeva nessuno. Il difetto
non era un bug, era una data — la categoria di errore che nessuno dei 1211 test
poteva vedere, perché i test verificano che il codice faccia quello che dice, non
che quello che dice sia vero.

## Fase 2 — Registro dei feedback esterni

[`EXTERNAL_FEEDBACK_LEDGER.md`](EXTERNAL_FEEDBACK_LEDGER.md). Sei voci, separate
in due tipi che non vanno mescolati: feedback di prodotto (genera lavoro) e
interesse editoriale (genera relazioni, non backlog).

**Il dato più importante del registro è un numero: uno.** I riscontri d'uso da
persone esterne al progetto, in tutta la sua storia, sono uno. Le soglie del
protocollo di playtest non sono *mancate*: non sono **mai state misurate**.

## Fase 3 — Sprint UX/UI dal feedback di Chloé Pété

[`UI_DENSITY_DIAGNOSIS.md`](UI_DENSITY_DIAGNOSIS.md) e lo strumento
`npm run diag:density`.

Il risultato che conta non sono le due correzioni: sono le **tre ipotesi cadute**.
Sovrapposizioni fra testi: zero su undici schermate. Corpo troppo piccolo: i
testi a 9,5 px sono i timbri della scrivania, atmosfera e non informazione.
Troppe azioni: diciassette solo sulla mappa, che ha un unico blocco di prosa ed è
densa di *scelte*, non di lettura. Tre correzioni facili che avrebbero cambiato il
gioco **senza toccare il difetto**.

Il difetto vero era l'assenza di gerarchia: sette blocchi di prosa entro un
rapporto di 1,18×, cioè nessuno visivamente primo. Due correzioni:

| | effetto misurato |
|---|---|
| istruzioni che si ritirano a compito svolto | 7 → **5** blocchi, 1119 → **927** caratteri |
| `LEZIONE DEL CASO` da 12 a 14 px | non è più il blocco più piccolo del rapporto |

Entrambe con una guardia provata **rossa** contro il difetto. Nessuna funzione
rimossa: il feedback riguardava la presentazione, e la profondità investigativa è
il valore del gioco.

## Fase 4 — AI intelligence ticker

**Rinviato, su decisione del proprietario.** Gli ho presentato il bivio prima di
scrivere codice, perché un ticker che pesca da fonti esterne pubblicherebbe sotto
il nome del sito affermazioni sulla norma che nessuno ha verificato — e
l'accuratezza sulla norma è il valore del sito. Aggiungeva anche una dipendenza da
feed di terzi su un progetto la cui regola è «deve essere tutto mio», e il
rischio della deriva verso il blog generico sull'IA, che il brief vieta.

L'alternativa proposta e non scelta era un **changelog normativo**: cosa è
cambiato nella norma, quando l'abbiamo recepito, con il link alla fonte primaria
e le pagine aggiornate. Resta nel backlog con queste ragioni.

## Fase 5 — Newsletter e valutazione privacy

[`NEWSLETTER_PRIVACY_ASSESSMENT.md`](NEWSLETTER_PRIVACY_ASSESSMENT.md). **Nessun
file toccato**: la decisione è del proprietario, e la valutazione esiste perché
la prenda informato.

Il costo reale di reinserire Tally non è un `<script>`: sono **quattro affermazioni
pubbliche** da riscrivere IT ed EN — una delle quali vive **dentro il JSON-LD
della FAQ**, cioè è machine-readable e i motori possono riprodurla — più **tre
guardie** da riscrivere, che esistono precisamente per impedire quella modifica,
più un meccanismo di consenso che il progetto ha evitato per scelta, perché un
iframe di terzi tratta l'IP del visitatore **prima** di qualunque interazione.

Raccomandato al suo posto: un **feed Atom** — che il sito non ha, e che costa
**zero** della postura privacy — più un `mailto:`. Detto anche cosa non dà: nessuna
lista da possedere, quindi nessun modo di contattare di propria iniziativa.

## Fase 6 — Motore di contenuti SEO

Decisione presa con la skill e con le prove, non per riflesso: **nessun URL
nuovo**. La SERP italiana e quella inglese sono occupate da studi legali e
fornitori di compliance il cui intento dominante — «cosa è slittato, cosa resta»
— è già quello delle due pagine calendario, che sono indicizzate. Una pagina
nuova le avrebbe cannibalizzate partendo da zero di autorità.

Al suo posto i titoli, che sono il segnale più forte e su cui una pagina
indicizzata risponde quasi subito. URL invariati, inventario sempre 68 rotte.

**Quello che non affermo:** che i titoli facciano salire le pagine. La ricerca
disponibile in questo ambiente è geolocalizzata negli Stati Uniti e senza Search
Console un effetto sul ranking è una congettura. Quello che si osserva è il
disallineamento fra il titolo e il modo in cui la domanda viene posta.

## Fase 7 — Revisione d'impatto del Digital Omnibus

[`DIGITAL_OMNIBUS_IMPACT_REVIEW.md`](DIGITAL_OMNIBUS_IMPACT_REVIEW.md). 43 voci
di modifica mappate, con la timeline come **fonte unica** perché le pagine non
divergessero fra loro, e un elenco esplicito di **azioni NON necessarie** — non
farle è una decisione e va motivata.

Due trappole documentate perché il prossimo che tocca queste pagine non ci cada:

- il «2 agosto 2027» che si incontra cercando le date è il termine per le
  **sandbox** (art. 57), non per l'alto rischio. Chi corregge con una ricerca
  testuale sostituisce una data sbagliata con un'altra data sbagliata;
- gli articoli letti **in sintesi** erano classificati male. Rileggendo per esteso
  gli articoli 75, 75a-75d e 77 è venuto fuori che l'enforcement non è «impatto
  indiretto»: l'AI Office diventa **esclusivamente competente** su una fascia di
  sistemi, e le pagine sanzioni non lo dicevano. Da cui la regola scritta nel
  documento: *una voce letta in sintesi non è una voce classificata*.

## Fase 8 — Documentazione

Aggiornati `README.md` (lo strumento nuovo, e un limite noto in più), il registro
dei feedback, la revisione d'impatto. Tre documenti nuovi: la diagnosi di densità,
la valutazione sulla newsletter, questo report.

Il limite nuovo del README merita di essere citato, perché è il contrario di
quello che uno strumento di misura nuovo invoglia a scrivere: **«il carico
cognitivo dell'interfaccia è misurato, non validato»**.

## Fase 9 — Disciplina di rilascio

Vedi sotto.

---

## Proposta di versione: 2.4.0

Versione corrente **2.3.0**. Proposta **2.4.0** — minore, non patch e non major.

| Criterio | Esito |
|---|---|
| rotture di compatibilità | nessuna |
| migrazione dei salvataggi | **non necessaria**, nessuna struttura dati cambia |
| comportamento del gioco cambiato | sì: due istruzioni si ritirano, un corpo di testo cresce |
| contenuto normativo corretto | sì, su dodici pagine IT+EN |
| strumenti nuovi | `npm run diag:density` |
| inventario delle rotte | **68, invariato** |

Non è una patch perché il comportamento a schermo cambia e perché le correzioni
normative modificano ciò che il sito **insegna**, non solo come lo mostra. Non è
una major perché nessuno deve rifare niente: chi ha una partita salvata la
riapre, chi ha un collegamento lo segue.

## Il tag lo mette il proprietario, non io

Non è una cortesia, è un fatto tecnico verificato: le credenziali di questa
sessione sono **limitate al branch**, e un push di tag restituisce 403. Non ho
mai pubblicato una release a suo nome e non devo.

Cosa resta a lui, in ordine:

1. verificare il deploy su `main` (le due PR di questo sprint sono già pubblicate
   o in corso di pubblicazione);
2. decidere sulla newsletter, leggendo il §5 della valutazione;
3. decidere se il ticker torna in gioco, e in quale forma;
4. tagliare `v2.4.0` e scrivere la release, seguendo
   [`RELEASE_CHECKLIST.md`](RELEASE_CHECKLIST.md).

## Quello che questo sprint NON ha dimostrato

La sezione più importante del report, e quella che sarebbe più comodo omettere.

- **Che il gioco sia leggibile.** Le misure dicono *dove* si concentra il carico,
  non che sia tollerabile. `MLA-01` è **«in corso»**, non «risolto»: chiuderla
  richiede che qualcuno riprovi il gioco.
- **Che il sito sia normativamente completo.** Nove articoli restano letti in
  sintesi, e la lezione di questo sprint è appunto che una lettura sintetica non
  autorizza una classificazione.
- **Che le correzioni SEO funzionino.** Senza Search Console non è osservabile da
  qui.
- **Che il progetto sia validato didatticamente.** Non lo è. Le soglie del
  protocollo di playtest restano non misurate, e i riscontri esterni restano uno.

Quattro cose che si possono sapere solo da fuori. È il vero collo di bottiglia
del progetto, e non è un problema di codice.
