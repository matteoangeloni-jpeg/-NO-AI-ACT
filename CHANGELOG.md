# CHANGELOG — NO AI ACT

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
