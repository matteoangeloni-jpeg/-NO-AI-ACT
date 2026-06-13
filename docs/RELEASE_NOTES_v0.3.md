# NO AI ACT v0.3 — Rapporto ispettivo e modalità docente

> La v0.2 insegnava a rispondere. La v0.3 insegna a **firmare**.

## Novità principali
- **Rapporto ispettivo motivato**: ogni caso si chiude componendo un atto in
  4 passi — classificazione, misura, **soggetto responsabile** e **motivazione**
  — fondato sui reperti citati. Il documento viene timbrato con uno di quattro
  esiti: *conforme*, *parzialmente conforme*, *contestabile*, *non conforme*.
- **La lezione del "contestabile"**: una decisione giusta ma fondata male
  (prove sbagliate, soggetto errato, motivazione debole) produce un atto
  impugnabile. Nel diritto, come nel gioco, la motivazione vale quanto la
  decisione.
- **Feedback tipizzato**: il rapporto indica il rilievo principale tra 7 tipi
  di errore (dalla classificazione errata all'eccesso di cautela) e al massimo
  due rilievi secondari.
- **Modalità docente**: debrief locale con esiti per caso, rilievi, norme
  sbloccate, indicatori, tempo di completamento e domande di discussione;
  esportabile in .txt/.json o stampabile. Tutto resta sul dispositivo.
- **Eventi imprevisti**: tre telex urgenti (il fornitore che si sfila, il
  primario che protesta, la stampa che chiede gli atti) con risposte rapide
  che pesano sugli indicatori.
- **Norme consultabili** durante la decisione: l'archivio diventa uno
  strumento d'indagine, non un trofeo.

## Didattica
Tutti i contenuti restano marcati "versione didattica semplificata" del
Regolamento (UE) 2024/1689. La distinzione provider/deployer, il perimetro
del divieto biometrico (finalità di contrasto) e il cumulo degli obblighi di
trasparenza sono resi giocabili, non solo enunciati.

## Privacy e accessibilità
Analytics opzionale e spenta di default in produzione; il debrief docente non
raccoglie alcun dato personale. Tastiera 1–7 su tutte le decisioni, contrasto
AA, scala colori corretta per il Controllo sociale (alto = allarme), toggle
CRT per proiettori, animazioni riducibili, IT/EN.

## Limiti noti
- Le motivazioni sono predefinite (3 per caso): niente testo libero, by design.
- Un solo soggetto "pieno" per caso; responsabilità distribuite in arrivo (v0.4, caso GPAI).
- Modalità Esperto, timer opzionale e nuovi casi rinviati alla v0.4.

## Come provarlo
```bash
npm install && npm run dev
```
oppure la versione online (GitHub Pages) quando pubblicata da `main`.
