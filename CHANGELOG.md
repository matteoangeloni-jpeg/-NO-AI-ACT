# CHANGELOG — NO AI ACT

## [Unreleased]

_Nessuna modifica in corso._

## [0.5.0] - 2026-06-20

Investigation & Learning Layer. Nessun nuovo caso, nessun cambiamento di
gameplay o di logica di valutazione. Compatibile con i salvataggi v0.4.

### Added
- Investigation & Learning Layer.
- Tassonomia tipizzata delle fragilità decisionali (`DecisionIssueType`),
  derivata dalla logica di valutazione esistente.
- Analisi della decisione nel rapporto ispettivo (perché regge / è contestabile
  / parziale / non conforme, con il punto debole specifico).
- Schede didattiche per tutti i 7 casi (cosa insegna, errore tipico, domanda di
  discussione, concetti AI Act, segnale di comprensione, uso in aula), IT/EN.
- Reperti più investigativi: micro-tag di funzione (minimizza, prova decisiva,
  effetto concreto, contesto) per i casi lavoro, ospedale e credito.
- Fascicolo città: effetti sistemici qualitativi (fiducia pubblica, diritti
  fondamentali, opacità amministrativa, rischio contenzioso, efficienza dei
  servizi), derivati dagli esiti — tendenze, non punteggi.
- Glossario operativo: 13 voci consultabili dall'archivio, IT/EN, con casi
  collegati e cautele "non significa che…".
- Export docente migliorato (locale): fragilità tipizzate, concetti AI Act
  emersi e fascicolo città nel `.txt`.

### Improved
- Utilità del debrief docente (locale, anonimo).
- Leggibilità dei reperti e interpretazione di fonti e contraddizioni.
- Contenuto dell'export sicuro per la privacy (il `.json` resta privo di dati
  personali).
- Documentazione per l'uso in aula e per i playtest.

### Fixed
- Rimosso il 404 benigno su `/favicon.ico` con un favicon SVG bundlato
  (`<link rel="icon">` nello shell HTML).

### Privacy
- Nessun backend.
- Nessun account.
- Nessuna dashboard classe.
- Nessuna raccolta di dati personali.
- L'export docente resta locale e anonimo.

### Notes
- La v0.5.0 resta una simulazione didattica, non una consulenza legale.
- Review giuridica terza raccomandata prima di un uso istituzionale/pubblico
  formale.

### Tests
- 108 → 138 test (tassonomia, fascicolo città, schede, glossario, export).

## v0.4.0 — Progressione, difficoltà e caso credito/welfare

- **Caso 7 — Il credito civico / Civic Credit**: caso-specchio sul confine tra
  social scoring vietato (art. 5), welfare predittivo ad alto rischio
  (Allegato III) e valutazione di affidabilità economica. 6 reperti con
  etichette-fonte, classificazione corretta "pratica vietata" motivata
  sull'aggregazione di comportamenti sociali e l'accesso a servizi essenziali.
- **Difficoltà selezionabili** (base / standard / expert): la modalità *base* è
  più indulgente (perdona i vizi lievi di fondamento, mostra un suggerimento
  mirato dopo un errore); *standard* (default) ed *expert* mantengono la
  severità storica. Salvata localmente.
- **Missioni/percorsi** (demo / laboratorio / completo / avanzato): durate e
  obiettivi consigliati, casi evidenziati sulla mappa con "★ CONSIGLIATO".
  Nessun blocco artificiale dei casi; default sicuro = percorso completo.
- **Meccanica investigativa**: etichette-fonte sui reperti (amministrativa,
  tecnica, vendor, reclamo, pubblica, log, interna) + riga "Prove decisive"
  nel rapporto.
- **Modalità docente**: il debrief locale ora riporta missione, difficoltà e
  una nota privacy esplicita. Export .txt/.json invariato — nessun dato personale.
- **Mobile guard**: overlay DOM per smartphone in portrait (IT/EN), nasce e
  scompare con l'orientamento; non tocca il canvas né il desktop.
- Test: 88 → 108 (difficoltà, missioni, caso 7, mobile guard, parità i18n).

## v0.3.0 — Rapporto ispettivo e modalità docente

- **Rapporto ispettivo**: la decisione diventa un atto motivato in 4 passi
  (classificazione → misura → soggetto responsabile → motivazione predefinita)
  fondato sui reperti citati; esito a 4 livelli: CONFORME / PARZIALMENTE
  CONFORME / CONTESTABILE / NON CONFORME, con documento timbrato.
- **Regola didattica**: una decisione corretta ma motivata male (prove non
  pertinenti, soggetto errato, motivazione debole) è CONTESTABILE, mai
  conforme; l'eccesso di cautela non è mai NON CONFORME.
- **Soggetto responsabile**: provider / deployer / autorità pubblica /
  responsabile umano designato / fornitore esterno, con soggetto pieno e
  parziale per caso.
- **Feedback tipizzato**: 7 tipi di errore, un rilievo dominante e max 2
  rilievi secondari nel rapporto.
- **Modalità docente**: debrief locale a fine partita (esiti, rilievi, norme,
  indicatori, tempo, 3 domande di discussione) con export .txt/.json e stampa;
  nessun dato personale, nessuna rete.
- **Eventi imprevisti** (3): telex urgenti su Lavoro, Ospedale e Media Center
  con tre risposte e piccoli effetti sugli indicatori, protocollati nel rapporto.
- **Norme consultabili** durante la decisione (overlay in sola lettura).
- **Accessibilità**: scala colore invertita per "Controllo sociale" (alto =
  allarme); scorciatoie 1–3/1–5/1–7 estese ai nuovi passi.
- Test: 67 → 85+ (matrice esiti rapporto, debrief senza dati personali,
  parità i18n sui nuovi testi, delta eventi).

## v0.2.0 — Multilingua, musica, casi completi

- Localizzazione IT/EN completa (sistema i18n tipato), selettore in menu.
- Musica procedurale Web Audio per livello con crossfade e volume dedicato.
- Casi 5 (Ospedale Predittivo) e 6 (Sorveglianza Urbana) giocabili — 6/6.
- Meccanica di citazione dei reperti (≥2) con effetto sull'esito.
- Analytics privacy-by-design opzionale (off in produzione di default).
- Credits in-game essenziali; doppia licenza MIT + CC BY 4.0 con notice
  distribuiti nella build.

## v0.1.0 — Vertical slice

- 4 casi giocabili, carte norma, indicatori, 3 finali, salvataggio locale,
  asset 100% procedurali, accessibilità di base, licenze tracciate.
