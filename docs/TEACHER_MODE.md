# MODALITÀ DOCENTE — NO AI ACT

Guida precisa alla modalità docente: cos'è, cosa **non** è, quali dati mostra,
dove restano e come usarla in aula.

## 1. Cos'è la modalità docente

È un **supporto locale per il debrief**. Si attiva dal menu del titolo
(`MODALITÀ DOCENTE: ON`) e abilita, a fine partita, una schermata di **debrief**
con la sintesi delle decisioni di gioco e domande di discussione.

> 🇮🇹 La modalità docente è un supporto locale per il debrief. Non crea classi,
> non registra studenti, non invia risultati a server.
>
> 🇬🇧 Teacher mode is local debrief support. It does not create classes, track
> students, or send results to a server.

## 2. Cosa NON fa

- ❌ **Niente classi**: non esiste alcun concetto di "classe" o gruppo.
- ❌ **Niente account**: non c'è login, registrazione o profilo.
- ❌ **Niente risultati centralizzati**: nessun dato lascia il dispositivo.
- ❌ **Niente tracciamento studenti**: nessun ID studente, nessun registro,
  nessuna dashboard.
- ❌ **Niente backend**: il gioco è statico, non c'è un server che riceve dati.

Il fatto che il gioco sia **pubblico** (chiunque con il link può aprirlo) **non**
significa che qualcuno veda i dati di gioco altrui: ogni partita vive solo nel
browser di chi gioca.

## 3. Debrief locale

A fine partita (o dal rapporto finale) il debrief mostra:

- esito per ciascun caso (conforme / parziale / contestabile / non conforme) e
  rilievo principale;
- **fragilità della decisione** per caso (v0.5): perché un atto è contestabile o
  non regge (soggetto, motivazione, prove, proporzionalità…);
- missione e difficoltà giocate;
- norme acquisite, indicatori finali, tempo di completamento;
- **concetti AI Act emersi** e **fascicolo città** (v0.5): effetti sistemici
  qualitativi (fiducia, diritti, opacità, contenzioso, efficienza) — tendenze,
  non punteggi;
- domande di discussione per la classe;
- un suggerimento di ripasso.

Dall'**Archivio** è inoltre consultabile il **glossario operativo** (v0.5): voci
brevi su divieti, alto rischio, trasparenza, "contestabile", provider/deployer,
controllo umano e altro, con casi collegati.

Tutti i dati mostrati sono **decisioni di gioco**: nessun dato personale.
La schermata lo dichiara esplicitamente.

## 4. Export locale

Dal debrief si possono generare:

- un file **`.txt`** (leggibile, adatto alla stampa);
- un file **`.json`** (strutturato, solo dati di gioco);
- una **stampa** dal browser.

> 🇮🇹 I dati mostrati restano su questo dispositivo. L'eventuale export è locale
> e non contiene nomi, email, classe o scuola.
>
> 🇬🇧 The data shown stays on this device. Any export is local and does not
> include names, emails, class, or school.

L'export `.txt` include una nota privacy e il disclaimer "versione didattica
semplificata". Il `.json` contiene **solo** dati di gioco (esiti, indicatori,
norme, tempo): nessun campo personale.

## 5. Uso in aula

- **Proiettore / LIM**: il docente conduce un caso davanti alla classe e guida la
  discussione. Consigliato `EFFETTO CRT: OFF` per la leggibilità sui proiettori.
- **Laboratorio individuale**: ogni studente gioca un percorso e poi confronta il
  proprio debrief con i compagni.
- **Discussione guidata**: usare le domande di debrief del caso per aprire il
  confronto (vietato vs alto rischio, soggetto responsabile, "contestabile").

Percorso consigliato per la prima volta: difficoltà **Standard**, Laboratorio
breve o Percorso completo. Per il confine credito/welfare, usare il Percorso
avanzato (include "Il credito civico").

## 6. Privacy

- Nessun account, nessun dato personale, nessun backend.
- Salvataggio solo in `localStorage` del dispositivo.
- Export generati e condivisi **manualmente** dall'utente.
- Analytics remoti **off di default**; rispettano Do Not Track.
- Dettagli e nota GDPR: [`ANALYTICS.md`](ANALYTICS.md).

Indicazione operativa per chi conduce: non associare i debrief a nomi di
studenti. Se serve distinguere gli elaborati, usare codici anonimi (T1, T2, …).

## 7. Domande di debrief consigliate

Ogni caso espone tre domande di discussione (visibili nel debrief). Esempi di
domande trasversali da porre alla classe:

1. Qual è la differenza tra un sistema "vietato" e uno "ad alto rischio"?
2. A cosa servono i reperti citati nel rapporto?
3. Perché una decisione giusta può risultare "contestabile"?
4. Nel caso del credito civico: perché scatta il divieto e non un semplice
   credit scoring?
5. Chi ha l'obbligo principale: il fornitore della piattaforma o l'ente che la usa?

---

*Versione didattica semplificata del Regolamento (UE) 2024/1689. Non costituisce
consulenza legale.*
