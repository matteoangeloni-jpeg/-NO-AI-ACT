# NO AI ACT 4.0 — audit dello stato iniziale e piano

Audit eseguito il 13 ottobre 2026 sul codice, non sui documenti: il brief chiede
espressamente di non fidarsi delle descrizioni storiche, ed è stata la scelta
giusta — tre affermazioni del README e della documentazione di rilascio sono
risultate superate, e due obiettivi del programma sono **già parzialmente
costruiti**, cosa che cambia il piano.

Struttura: §1 fatti verificati · §2 rischi · §3 decisioni proposte, con quelle
che spettano al proprietario marcate · §4 piano in interventi verificabili.
Le incongruenze giuridiche sono **segnalate e non corrette**, come richiesto.

---

## 1. Fatti verificati

### 1.1 Stato del repository, e una cosa da sapere subito

| | |
|---|---|
| `main` | `d7cdc9a`, merge della PR #106 |
| versione dichiarata | 3.0.0 |
| **ultimo tag esistente** | **`v2.2.0`** |
| test | 1218 su 72 file, verdi |
| rotte pubbliche | **70** (33 IT + 37 EN) — erano 68, la PR #106 ha aggiunto un profilo autore per lingua |
| deploy | GitHub Pages via `.github/workflows/deploy.yml` |

**La 3.0.0 non è mai stata taggata, e nemmeno la 2.3.0.** Il codice dichiara
3.0.0 da due settimane e l'ultima release pubblicata è la 2.2.0. Non è un
difetto del codice: è una azione del proprietario rimasta in sospeso, e va
decisa prima di aprire un programma 4.0, altrimenti il salto di versione
seppellisce due release non pubblicate.

### 1.2 Architettura i18n del gioco — **già pronta per nuove lingue**

Il fatto più importante dell'audit, e quello che rende l'obiettivo 1 un lavoro
di *traduzione* e non di *refactoring*:

```ts
export type Locale = typeof it;                       // src/game/i18n/index.ts
export const LOCALES: Record<LanguageCode, Locale> = { it, en };
```

Il dizionario italiano **è** il contratto strutturale, e `Record<LanguageCode,
Locale>` impone a ogni nuova lingua la forma completa. Conseguenza concreta:
**un `fr.ts` incompleto non compila.** La parità non è affidata a un controllo
che si può dimenticare di scrivere — è il compilatore. Il docstring del modulo
prevedeva già questa estensione, con le istruzioni esatte.

Accesso tipato (`L().ui.map.header`), nessun lookup per chiave stringa, e la
persistenza della lingua delegata allo `StateManager` così che il modulo resti
testabile in Node.

**Ma ci sono tre punti che la duplicazione la reintroduce**, misurati:

1. `isLanguageCode()` (riga 41) **riscrive a mano** `value === 'it' || value === 'en'`.
   È la stessa conoscenza che `LOCALES` già possiede. Un `?lang=fr` verrebbe
   rifiutato in silenzio, e il giocatore francese arriverebbe in italiano senza
   alcun messaggio di errore;
2. `nextLanguage()` fa ciclare le lingue in sequenza. Con due funziona come
   interruttore; con tre o più diventa «premi fino a indovinare», che è un
   difetto di accessibilità prima che di gusto;
3. `LanguageCode = 'it' | 'en'` in `data/types.ts` è usato anche nello schema
   dei salvataggi (`language: LanguageCode`, riga 279): allargarlo ha effetti
   sulla persistenza, non solo sull'interfaccia.

**E l'elenco di cosa una lingua nuova deve riempire non va indovinato: lo
produce il compilatore.** Dichiarando `'fr'` in `LanguageCode` e lanciando
`typecheck`, gli errori nominano esattamente i tre punti:

| file | che cosa vincola |
|---|---|
| `src/game/i18n/index.ts` | il dizionario completo (`Record<LanguageCode, Locale>`) |
| `src/game/data/concepts.ts` | tre mappe: nomi dei concetti, elenchi, e `SiteLinkSet` — **i collegamenti dal gioco alle pagine del sito**, che per il francese non esistono ancora |
| `src/game/scenes/CreditsScene.ts` | i testi dei crediti |

Il terzo punto di `concepts.ts` lega i due obiettivi, e va descritto con
precisione per non prometterne più del vero. `SITE_LINKS` pretende **sette URL
per lingua** (gioco, hub didattico, docenti, guida, glossario, privacy, home).
Il tipo pretende che esistano, **non** che siano francesi: un `fr` che riusa gli
URL inglesi compila benissimo. Il che è il caso peggiore, non il migliore —
sarebbe un francese che rimanda a pagine inglesi senza che nulla lo segnali.

Quindi l'ordine I4 → I5 **non** è imposto dal compilatore: è una scelta, e il
rischio da coprire è l'opposto di quello che un vincolo di tipo coprirebbe. Va
aggiunta una guardia che pretenda, per ogni lingua pubblicata, che i sette URL
puntino al suo prefisso — altrimenti il difetto non si manifesta come errore ma
come esperienza mescolata. **Non implementata in questo giro**: appartiene a I5,
dove quelle pagine nasceranno.

### 1.3 Volume reale della traduzione

Misurato, non stimato:

| | |
|---|---|
| dizionario del gioco | 830 stringhe lunghe, **~9.700 parole** (`it.ts`, 1.951 righe) |
| pagine del sito (`<main>`) | 37 pagine EN, **~28.000 parole** |
| **totale per lingua** | **~37.700 parole** di prosa giuridico-didattica |

### 1.4 Architettura del sito — **qui la duplicazione è reale**

Le 69 pagine sono **HTML scritto a mano**, una per lingua: non esiste alcun
generatore di pagine in `scripts/`. Il francese significherebbe ~37 file HTML
nuovi scritti a mano, con metadati, hreflang, JSON-LD e collegamenti interni
replicati a mano in ciascuno.

È esattamente la «duplicazione strutturale» che il brief vieta, ed è il punto
in cui il programma 4.0 incontra una decisione di architettura vera (§3.1).

### 1.5 Game loop e valutazione — più ricchi di quanto il brief supponga

19 scene Phaser. Il ciclo `Incident → Case → Evidence → Decision → Report →
Consequence → NormCard → Debrief/LearningReport` è implementato per intero, con
sistemi dedicati: `MultiAxisFeedback`, `DecisionIssues`, `LearningReportSystem`,
`InvestigationNotebook`, `CityDossier`, `IndicatorSystem`, `SearchIndex`.

La valutazione di ogni caso **non** è un confronto con una risposta: ogni
fascicolo dichiara classificazione corretta, misure corrette e parziali, indizi
rilevanti con la loro *postura* (`decisive` / `minimizes_risk`), soggetto
responsabile corretto e parziale, motivazione corretta e debole, e l'elenco
degli errori dominanti possibili. `learningModel.ts` aggiunge matrice legale,
obiettivi per caso e **misconcezioni** attese.

Quattro modalità esistono già: `'turno' | 'libera' | 'sorpresa' | 'ripasso'`.

**Quindi il problema segnalato da VideogiochiItaliani non è assenza di struttura
didattica: è che la struttura non è leggibile dal giocatore.** È una diagnosi
diversa, e porta a interventi diversi — §3.2.

### 1.6 Analytics — **già costruito, e già passato da una revisione privacy**

`src/game/systems/AnalyticsSystem.ts`, 237 righe, documentato in
`docs/ANALYTICS.md`:

- **allowlist di 16 eventi** (`game_opened`, `case_started`, `evidence_opened`,
  `clues_selected`, `classification_selected`, `case_completed`, `case_result`,
  `norm_unlocked`, `ending_reached`, …) e **allowlist di 13 proprietà**: oggetti
  e array mai ammessi, nessun testo libero;
- nessun identificativo del giocatore, nessun cookie, nessun fingerprinting,
  nessun session replay;
- **Do Not Track rispettato in modo incondizionato** (`if (config.doNotTrack)
  return 'off'`);
- **spento in produzione per default**, e un provider remoto senza
  configurazione completa resta `off` — «mai inviare per sbaglio»;
- trasporto iniettabile, quindi testabile in Node senza rete.

Gli eventi coprono già: sessioni iniziate, lingua, fascicoli aperti e
completati, esiti, norme sbloccate. **Mancano** rispetto alla lista del brief:
tempo per fase, punto di abbandono, uso dei suggerimenti e del tutorial,
modalità preferita.

I provider previsti sono `off | console | plausible | umami`. **I due remoti
sono fornitori terzi**, e questo è il vincolo decisivo: il sito dichiara
pubblicamente di non inviare nulla a terzi, `release.config.json` fissa
`runtimeHostAllowlist: ["static.cloudflareinsights.com"]`, e i test
`privacyGuards` fanno fallire la build su qualunque host nuovo. Accendere
Plausible o Umami romperebbe insieme tre guardie e quattro affermazioni
pubbliche.

### 1.7 Salvataggi

`SaveSystem.ts` ha già `CURRENT_SAVE_VERSION` e una politica di versione
esplicita: un salvataggio di versione futura produce un warning e **non viene
sovrascritto**. Esiste una migrazione testata v1 → v2. La promessa di
preservare la progressione (Fase 2) poggia quindi su un meccanismo che c'è.

### 1.8 Il feedback di riferimento della Fase 2 **non è nel registro**

`docs/EXTERNAL_FEEDBACK_LEDGER.md` non contiene alcuna voce
VideogiochiItaliani. Il registro dichiara ancora «**riscontri d'uso da persone
esterne: uno**», e con questo sono **due**. Quel numero è, per dichiarazione del
registro stesso, «il dato più importante» che contiene.

> **Chiuso il 29 ottobre 2026.** La voce VGI-01 esiste nel registro e il
> conteggio dice due. Questo paragrafo resta come era scritto perché l'audit è
> un'istantanea del 13 ottobre: riscriverlo al presente cancellerebbe il fatto
> che per sedici giorni il registro è stato indietro rispetto alla realtà.

---

## 2. Rischi

| # | Rischio | Perché | Gravità |
|---|---|---|---|
| R1 | **Traduzione automatica mascherata da localizzazione.** 37.700 parole di prosa giuridica in cui una parola sbagliata cambia il contenuto normativo insegnato | il valore del progetto è l'accuratezza sulla norma, non la copertura linguistica | **alta** |
| R2 | **Trentasette pagine HTML nuove a mano.** Ogni pagina porta canonical, hreflang, JSON-LD, collegamenti interni e piè di pagina versionato | è la stessa classe di difetto che ha prodotto 31 conteggi divergenti su 21 pagine: informazione ripetuta a mano in molti posti | **alta** |
| R3 | **Il terzo hreflang rompe la reciprocità a due.** Oggi 70 pagine si puntano a coppie; con FR le pagine senza controparte francese devono dichiarare solo le lingue che esistono | `audit:seo` fallisce su hreflang incoerente, ed è giusto che lo faccia | media |
| R4 | **Gli analytics attraversano un confine giuridico, non tecnico.** Anche senza identificatori, l'invio di eventi da un browser europeo verso un endpoint va valutato | il brief stesso avverte di non considerare anonimo un dato solo perché pseudonimizzato | **alta** |
| R5 | **La dashboard amministrativa è un bersaglio.** Un endpoint di scrittura pubblico è un bersaglio di avvelenamento dei dati: senza limite di frequenza e validazione, le aggregazioni diventano inattendibili | un dato falso è peggio di nessun dato, perché orienta decisioni | media |
| R6 | **La modalità Formazione può diventare un quiz.** È l'esito che il brief vieta e la deriva naturale di ogni «spiegare meglio» | il valore è la profondità investigativa | media |
| R7 | **Due release non taggate.** Un 4.0 sopra una 3.0.0 mai pubblicata rende la storia delle versioni illeggibile | §1.1 | media |

---

## 3. Decisioni progettuali proposte

### 3.1 Il sito: generare le pagine, o tradurle a mano? — **decisione del proprietario**

Tre strade, col loro costo reale:

| | costo | rischio SEO |
|---|---|---|
| **A. 37 pagine FR a mano** | ~28.000 parole + 37 file da mantenere a ogni modifica futura | nessuno a breve; alto a lungo, perché ogni modifica va replicata tre volte |
| **B. Generatore di pagine**: contenuti in dati strutturati + un template per tipo di pagina | riscrittura di 69 pagine esistenti | **alto nel breve**: le 70 rotte sono fissate in `release.config.json`, nei due sitemap e in più file di test, e l'inventario è un bene SEO acquisito |
| **C. Ibrido**: generatore per le pagine FR nuove, pagine esistenti intatte | basso | medio: due architetture convivono, e la seconda può derivare dalla prima |

**Raccomandazione: C, con A come ripiego.** La B è l'architettura giusta e la
risposta sbagliata *ora*: toccare 69 pagine indicizzate per introdurre una
lingua mette a rischio il bene che il brief chiede espressamente di preservare.
La C introduce il generatore dove non c'è niente da perdere — le pagine francesi
non esistono ancora — e lascia la migrazione delle pagine esistenti come
intervento successivo, misurabile e reversibile.

**Serve la tua decisione** perché cambia l'architettura del sito e il brief
chiede di preservarne l'architettura SEO salvo miglioramenti motivati.

### 3.2 Gameplay: rendere leggibile la struttura che c'è

Il feedback dice che la *ratio* fra gioco e obiettivo educativo non è evidente.
L'audit (§1.5) mostra che la ratio **esiste nel codice** — misure corrette e
parziali, posture degli indizi, errori dominanti, misconcezioni — e non è
esposta al giocatore in alcun momento prima del debrief.

Quattro interventi, in ordine di rapporto fra valore e rischio:

1. **Dichiarare l'obiettivo all'ingresso di ogni fascicolo.** Il modello di
   apprendimento ha già `CASE_OBJECTIVES`: oggi li legge solo il rapporto
   finale. Mostrarli all'apertura costa una riga di interfaccia e cambia il
   contratto col giocatore — sa su cosa sarà valutato prima di decidere, non
   dopo;
2. **Separare i tre assi dell'esito.** `MultiAxisFeedback` già distingue
   correttezza normativa, qualità probatoria e motivazione; il rapporto le
   fonde in un giudizio. Tre esiti distinti insegnano che si può avere ragione
   per il motivo sbagliato — che è la lezione centrale del gioco;
3. **Tutorial narrativo dentro il primo caso**, non prima: una scena di
   istruzioni separata è la soluzione che il brief scoraggia. Il primo
   fascicolo è già il più netto, quindi è il posto dove un suggerimento
   contestuale non abbassa la difficoltà del resto;
4. **Modalità Indagine / Formazione sullo stesso sistema**: non due giochi, ma
   due livelli di esplicitazione — Formazione mostra obiettivi, assi e
   misconcezioni attese; Indagine li tiene alla fine. Nessuna meccanica
   rimossa, che è il vincolo.

### 3.3 Analytics: un provider primo, sul dominio del proprietario

Date le promesse pubbliche e le tre guardie (§1.6), **Plausible e Umami sono
esclusi**: sono fornitori terzi. La strada coerente è un quinto provider —
chiamiamolo `first-party` — che invia a un endpoint sul dominio del progetto,
servito da un Cloudflare Worker, con aggregazione lato server e nessuna
ritenzione di evento singolo.

Resta **spento per default**, come oggi, e si accende solo dopo §3.4.

**Serve la tua decisione** su due punti: se hai un account Cloudflare con
Workers abilitati sul dominio, e se accetti che l'accensione richieda di
riscrivere le informative e la allowlist **nella stessa PR** delle guardie.

### 3.4 Il regime giuridico va valutato prima, non dopo — **da rivedere con uno specialista**

Segnalato e non deciso, come il brief impone per i contenuti che richiedono
revisione specialistica. L'invio di eventi di utilizzo da un browser verso un
endpoint non è automaticamente esente da consenso per il solo fatto di non
contenere identificatori: la valutazione riguarda l'accesso al terminale
dell'utente e la qualificazione del dato, e va fatta **prima** di accendere
qualunque trasporto. Il progetto ha già evitato questa zona per scelta, e la
scelta è stata documentata.

Distinzione che il brief chiede e che va mantenuta anche nei documenti:
**analytics di prodotto** (aggregato, senza consenso individuale se e solo se il
regime lo consente) e **raccolta facoltativa per la ricerca educativa** (che è
un'altra cosa, con base giuridica propria e consenso informato esplicito).

---

## 4. Piano in interventi verificabili

Ogni intervento ha un criterio di verifica che può fallire. L'ordine non è
negoziabile dove una dipendenza è reale.

| # | Intervento | Verifica | Dipende da |
|---|---|---|---|
| **I1** | **Fondazione i18n per N lingue**: separare le lingue *conosciute* da quelle *pubblicate*, eliminare la duplicazione di `isLanguageCode`, sostituire il ciclo delle lingue con una selezione, test di parità che vale per N lingue | il build rifiuta una lingua pubblicata incompleta; `?lang=fr` non è più ignorato in silenzio; test provati rossi | — |
| **I2** | **Registrare VGI-01** nel registro dei feedback e portare a due il numero dei riscontri esterni | il registro non dichiara più «uno» | — |
| I3 | **Glossario terminologico FR** dalle versioni ufficiali francesi del Reg. 2024/1689 e del Reg. 2026/1744 | ogni termine ha la fonte ufficiale citata | — |
| I4 | **`fr.ts`: dizionario del gioco** (~9.700 parole) | compila (parità strutturale garantita dal tipo); `diag:case` gioca un caso in FR | I1, I3 |
| I5 | **Generatore di pagine + pagine FR** (secondo §3.1) | `audit:seo` PASS con 3 lingue; hreflang coerente anche dove manca la controparte | I3, §3.1 |
| I6 | **Obiettivi dichiarati all'ingresso del caso** e **tre assi separati nell'esito** | guardia provata rossa: l'obiettivo è assente all'ingresso, o il rapporto fonde gli assi | — |
| I7 | **Tutorial narrativo nel primo caso** + modalità Indagine/Formazione | smoke di entrambe le modalità; nessuna meccanica rimossa | I6 |
| I8 | **Eventi mancanti** (tempo per fase, abbandono, tutorial, modalità) nelle due allowlist | i nuovi eventi passano il filtro; nessuna proprietà fuori allowlist | — |
| I9 | **Provider `first-party` + Worker + aggregazione + dashboard** | nessuna chiamata di rete con provider `off`; `privacyGuards` e `runtimeHostAllowlist` aggiornati nella stessa PR delle informative | I8, §3.3, §3.4 |
| I10 | **Verifica e rilascio 4.0** | tutti i cancelli, più parità delle traduzioni e migrazione dei salvataggi | tutti |

---

## 5. Dichiarazione volontaria sull'uso dell'IA — fuori dal programma, su richiesta

Chiesta durante il giro: un motto tipo «made with AI, not by AI», **per
compliance legale dell'AI Act**. La seconda metà della richiesta va corretta,
perché riguarda proprio la materia che il sito insegna.

**Non è una misura di conformità, ed è meglio non presentarla così.**
L'articolo 50 vive in due paragrafi distinti:

| | a chi si applica | NO AI ACT |
|---|---|---|
| **art. 50(2)** | **fornitori** di sistemi di IA generativa: marcatura dei contenuti sintetici in formato leggibile dalla macchina | non si applica: il progetto non fornisce un sistema generativo |
| **art. 50(4)** | **deployer** che pubblicano testi generati o manipolati per informare il pubblico su temi di interesse pubblico | **è il paragrafo vicino** — il sito informa il pubblico sull'AI Act, che è interesse pubblico |

Il §4 porta però un'eccezione espressa: non si applica quando il contenuto è
stato sottoposto a **revisione umana o controllo editoriale** e una persona
fisica o giuridica ne detiene la **responsabilità editoriale**. Questo progetto
si trova in quell'eccezione.

Quindi la dichiarazione è **volontaria**, e lì sta la sua forza: un sito che
insegna la trasparenza e non la pratica sarebbe la contraddizione peggiore, e
chi cita il lavoro in sede accademica ha diritto di sapere come è stato
prodotto. Dichiarare *conformità*, invece, violerebbe una delle regole che il
progetto si è dato — e un'affermazione di conformità su un sito che insegna la
norma è la classe di errore più dannosa per la sua credibilità.

**Tre posti, tre registri:**

| dove | che cosa |
|---|---|
| piè di pagina, **70 rotte** | il motto: «Fatto con l'IA, non dall'IA» / «Made with AI, not by AI» |
| crediti del gioco, IT ed EN | il motto più una riga: dichiarazione volontaria, responsabilità editoriale di una persona. Sostituisce il generico «vertical slice sviluppata con supporto AI», che c'era già |
| §06 di `ricerca-e-metodologia` e `en/research-and-methodology` | la motivazione completa: estensione dell'uso, verifica sulle fonti primarie, i due paragrafi dell'articolo 50 e l'eccezione in cui il progetto si trova |

La sezione 06 è «che cosa è dimostrato e che cosa no»: è il posto dove una
dichiarazione sul *come è stato fatto* appartiene, e inserirla là non ha
richiesto di rinumerare le sezioni successive né di toccare i collegamenti.

**Una guardia**, `tests/aiDisclosure.test.ts`, con le pagine derivate dai
sitemap: pretende presenza su ogni rotta nella lingua giusta, una sola forma del
motto, la motivazione bilingue, e **vieta che si trasformi in un'affermazione di
conformità**. Provata rossa in quattro forme.

> **Una cosa che devi confermare tu.** Il testo dichiara un «uso estensivo di
> assistenti IA: codice, test, documentazione e parte dei testi editoriali», con
> responsabilità editoriale e scientifica di una persona. È scritto per essere
> vero, non generoso — una dichiarazione di trasparenza falsa è peggio di
> nessuna dichiarazione. Se la proporzione non corrisponde a come hai lavorato,
> va corretta: sta in due paragrafi su due pagine.

### Che cosa è stato fatto in questo giro, e che cosa no

Scritto qui perché il brief vieta di dichiarare completate attività non
verificate, e perché un piano senza questa riga è una promessa.

- **Fatto**: questo audit; **I1**; **I2**; la dichiarazione volontaria sull'uso
  dell'IA del §5, che non era nel programma ed è arrivata in corsa.
- **Non fatto**: I3–I10. In particolare le ~37.700 parole di francese non sono
  state scritte, e non lo saranno in un giro: il rischio R1 è il primo del
  programma, e produrre quel volume in una sessione sarebbe precisamente il modo
  di realizzarlo.
- **In attesa di te**: §3.1 (architettura del sito), §3.3 (Cloudflare),
  §3.4 (regime giuridico, da rivedere con uno specialista), e il tag delle due
  release non pubblicate (§1.1).
