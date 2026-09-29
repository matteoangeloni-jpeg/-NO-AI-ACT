# Newsletter: valutazione tecnica prima della decisione

> ## DECISO IL 29 SETTEMBRE 2026: NESSUNA NEWSLETTER, PER ORA
>
> Il proprietario ha messo da parte la questione. **Non si fa né Tally né il
> feed Atom raccomandato qui sotto**, e non c'è niente da implementare: il sito
> resta com'è, con le quattro promesse pubbliche intatte e le tre guardie che le
> difendono al loro posto.
>
> La valutazione resta perché la decisione è *sospesa, non chiusa*, e il giorno
> in cui si riapre le misure non vanno rifatte. Due cose da ricordare allora:
> il costo di Tally è quello dei §4 e §6, non un `<script>`; e il feed Atom
> costa zero della postura privacy ma **non dà una lista da possedere**, quindi
> non permette di contattare nessuno di propria iniziativa (§5).
>
> Fino a quel giorno l'unico canale in ingresso resta quello che il sito già
> pubblica. Nessun file va toccato per attuare questa decisione, ed è il motivo
> per cui attuarla non ha richiesto un commit di codice.

Lo sprint chiede di valutare una newsletter con Tally. Questo documento non la
implementa e non la esclude: misura che cosa costerebbe, perché il costo non è
un modulo da incorporare — è una promessa pubblica da riscrivere e tre guardie
da indebolire, e nessuna delle tre è stata scritta per caso.

**Nessun file è stato toccato.** La decisione era del proprietario, e ora c'è.

## 1. Che cosa il sito promette oggi, alla lettera

Quattro promesse distinte, in quattro posti diversi, verificate nel sorgente.

| Dove | Che cosa dice |
|---|---|
| `privacy-by-design/index.html:84` | «questa versione non incorpora moduli esterni: non c'è nessun modulo da compilare e il gioco **non invia nulla a fornitori terzi**» |
| `privacy-by-design/index.html:206` | «nessuno script di terze parti per moduli viene caricato e **nessun dato viene trasmesso a fornitori di moduli**» |
| `apprendimento-privacy-consapevole/index.html:170` | «questa versione non include moduli di feedback di terze parti» |
| `index.html:150` | la stessa affermazione **dentro il JSON-LD della FAQ** |

L'ultima riga è la più vincolante e la si nota per ultima. Quella frase non è
solo scritta per un lettore: è **dati strutturati**, cioè un'affermazione
leggibile dalla macchina che i motori di ricerca possono riprodurre nei
risultati. Incorporare un modulo di terze parti senza riscriverla significa
pubblicare un'affermazione falsa in formato machine-readable, su un sito che
insegna la trasparenza dei sistemi automatici. L'ironia non sarebbe un dettaglio
di comunicazione: sarebbe il difetto.

E le versioni inglesi delle stesse pagine dicono le stesse cose, quindi il conto
va raddoppiato.

## 2. Che cosa è imposto dai test, non dalla buona volontà

Tre guardie indipendenti, tutte introdotte **quando Tally è stato rimosso**.

| Guardia | Che cosa fa |
|---|---|
| `tests/privacyGuards.test.ts` → `no external forms — Tally fully removed` | fallisce se un file del gioco nomina Tally o un host di moduli |
| `scripts/ci/verify-dist.mjs` → `external-form-free files` | scandisce **82 file** del dist contro `tally.so`, `data-tally`, i quattro ID dei moduli storici, `typeform`, `jotform`, `forms.gle` |
| `release.config.json` → `runtimeHostAllowlist` | contiene **un solo host**: `static.cloudflareinsights.com` |

Una quarta guardia collaterale conta: `privacyGuards` vieta `fetch`, `XHR`,
`sendBeacon`, `WebSocket` e `EventSource` in `src/game` fuori dall'unica
astrazione consentita, e quella è disattivata per default in produzione.

**La conseguenza va detta chiaramente.** Reinserire Tally non è aggiungere un
`<script>`: è modificare tre guardie che esistono *per impedire esattamente
quella modifica*. Una guardia che si allenta quando dà fastidio non è una
guardia; è un commento. Se la decisione è sì, quelle guardie vanno **riscritte
per consentire un host nominato e continuare a vietare tutti gli altri**, non
cancellate.

## 3. Il problema giuridico, che è il vero ostacolo

Non è una formalità, ed è ironicamente la materia che il sito insegna.

**Un modulo di terze parti incorporato tratta dati personali prima di qualunque
interazione.** L'iframe o lo script di Tally si carica quando la pagina si
carica: a quel punto l'indirizzo IP del visitatore è già arrivato a un terzo, e
molto probabilmente è già stato scritto qualcosa nella memoria del browser. Non
serve che nessuno compili niente. Il trattamento è già avvenuto.

Da cui tre conseguenze concrete:

1. **Consenso ePrivacy.** L'accesso alla memoria del terminale richiede consenso
   preventivo, salvo lo strettamente necessario — e una newsletter non è
   strettamente necessaria. Servirebbe un meccanismo di consenso. Il sito **non
   ne ha uno, per scelta**: usa statistiche aggregate senza cookie proprio per
   non doverne avere uno. Introdurre un modulo significa introdurre il banner
   che il progetto ha evitato.
2. **Base giuridica e responsabile del trattamento.** Tally diventerebbe un
   responsabile: servono un accordo ex art. 28 GDPR, l'informativa aggiornata e,
   se i dati escono dallo SEE, una valutazione sui trasferimenti.
3. **Coerenza con quello che il sito insegna.** Le pagine spiegano l'articolo 50
   e la trasparenza verso le persone. Un sito che raccoglie email attraverso un
   terzo senza dirlo bene perde il diritto di spiegarlo agli altri.

**Una precisazione di onestà**: quanto sopra è la lettura operativa con cui
decidere su questo sito, non un parere legale, e l'inquadramento definitivo
di una raccolta di email in Italia richiede un professionista — esattamente la
riserva che il sito stesso appone a ogni pagina.

## 4. Quattro strade, col loro costo reale

| Strada | Terze parti | Consenso necessario | Guardie da toccare | Pagine da riscrivere | Che cosa ottieni |
|---|---|---|---|---|---|
| **Tally incorporato** | sì | **sì** | 3 | 6+ (IT/EN), JSON-LD compreso | una lista che possiedi, e un banner |
| **Feed RSS/Atom** | **no** | **no** | **0** | 0 | chi vuole seguire, segue — senza dirti chi è |
| **`mailto:` semplice** | no | no | 0 | 0 | email vere, gestite a mano |
| **Modulo proprio** | no | sì (dati sul server) | 1 (rete) | alcune | controllo pieno, e un backend che il progetto non ha |

Sul modulo proprio va detto che è escluso da un vincolo esistente, non da una
preferenza: il progetto dichiara «nessun backend», e ce l'ha davvero — il gioco
gira interamente nel browser. Aggiungere un endpoint che riceve email
significa aggiungere un server da custodire, una violazione da notificare se
succede, e una cancellazione da garantire su richiesta.

## 5. Raccomandazione

**Un feed Atom, più un `mailto:`. Non Tally.**

Il feed è la primitiva di iscrizione che non chiede niente a nessuno: un file
statico nel dist, il lettore si iscrive col suo programma, e il sito **non
apprende né la sua identità né la sua email**. Zero terze parti, zero consenso,
zero guardie toccate, zero righe di privacy da riscrivere — e il sito oggi
**non ce l'ha**: in `public/` ci sono tre sitemap e nessun feed. È l'unica voce
di questo elenco che aggiunge una capacità senza spendere nulla della postura.

Il `mailto:` copre chi vuole davvero scrivere, e la sua email arriva dal suo
programma di posta: nessun modulo, nessun intermediario, nessun dato a riposo
sul sito.

**Quello che questa strada NON dà, e va detto:** non c'è una lista che possiedi,
quindi non puoi raggiungere nessuno di tua iniziativa — né annunciare una
release, né invitare a un playtest. Se l'obiettivo è **contattare** le persone e
non farsi seguire, il feed non lo risolve e la scelta torna fra Tally col suo
costo pieno e un servizio di newsletter con sede nello SEE, che riduce il punto
3 ma non lo elimina.

Vale la pena legare questa decisione a un dato del
[registro dei feedback](EXTERNAL_FEEDBACK_LEDGER.md): le due tornate di playtest
esterno non sono mai state eseguite, e la via aperta da Media & Learning
Association è più promettente di una lista da costruire da zero. Una newsletter
serve quando c'è un pubblico da riconvocare; qui il pubblico va ancora trovato,
e lo si trova per relazioni, non per iscrizioni.

## 6. Se la decisione è Tally, questo è il lavoro minimo

Elencato perché una decisione informata deve vedere il conto, e perché farlo a
metà è peggio che non farlo.

1. Riscrivere le quattro affermazioni del §1, **JSON-LD della FAQ compreso**, in
   italiano e in inglese.
2. Aggiungere l'host a `runtimeHostAllowlist` e **riscrivere** le due guardie
   perché consentano quel solo host e continuino a vietare gli altri.
3. Introdurre un meccanismo di consenso preventivo, con il modulo che **non si
   carica** finché il consenso non c'è.
4. Accordo ex art. 28, informativa, valutazione sui trasferimenti se fuori SEE.
5. Aggiornare `README.md`, che oggi dichiara «la versione pubblica non include
   form di feedback di terze parti e non raccoglie dati (i moduli Tally del
   periodo di playtest sono stati rimossi)», e `release.config.json`.
6. Un test che provi che senza consenso **nessuna richiesta** raggiunge quel
   host — cioè una guardia nuova, non una rimossa.

Tutto nella stessa PR. Un sito che dice di non inviare nulla a terzi mentre lo
fa, anche solo per il tempo di una release, è il difetto peggiore di tutti
quelli elencati qui.
