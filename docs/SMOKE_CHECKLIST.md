# SMOKE CHECKLIST MANUALE — NO AI ACT v0.4.0

I test automatici (`npm test`) coprono dati e logica; questa checklist copre ciò
che solo un browser può verificare. Tre livelli, da distinguere sempre:

- **A · Smoke locale** — `npm run dev` / `npm run preview` sulla macchina di sviluppo.
- **B · Smoke su artefatto deployato** — la cartella `dist/` costruita dallo
  stesso commit del deploy (verifica dell'artefatto, non del sito live).
- **C · Smoke live dal browser utente** — il sito pubblico su GitHub Pages.

> ⚠️ **Nota ambiente.** L'ambiente di CI/agent **non può aprire `github.io`**
> (network policy: HTTP 403). Il livello **C va eseguito a mano** da un browser
> reale; in CI ci si ferma ai livelli A/B. Dichiarare sempre quale livello è
> stato eseguito.

URL live: <https://matteoangeloni-jpeg.github.io/-NO-AI-ACT/>

## Avvio e console (A/B/C)
- [ ] La pagina carica: boot → preload (barra di generazione asset) → title
- [ ] **Console del browser senza errori** (il notice licenze in `console.info` è atteso)
- [ ] `dist/` contiene `THIRD_PARTY_LICENSES.md`, `LICENSE`, `CREDITS.md` (B)

## Lingua IT/EN (A/B/C)
- [ ] LINGUA cambia IT ↔ EN e aggiorna menu, casi, carte, finali, archivio
- [ ] La lingua persiste dopo refresh

## Difficoltà (A/B/C)
- [ ] Selettore difficoltà: Base / Standard / Esperto, con descrizione
- [ ] In **Base**: dopo un errore compare un suggerimento mirato ("DA RICONSIDERARE")
- [ ] In **Esperto**: feedback più asciutto, severità su soggetto e motivazione
- [ ] La difficoltà scelta persiste

## Missioni / percorsi (A/B/C)
- [ ] Selettore percorso: Demo / Laboratorio breve / Completo / Avanzato, con durata e obiettivo
- [ ] La mappa evidenzia i casi consigliati ("★ CONSIGLIATO") del percorso scelto
- [ ] Nessun caso è bloccato: sono giocabili anche fuori dal percorso

## Mappa e flusso di gioco (A/B/C)
- [ ] La mappa mostra **7 luoghi**
- [ ] Caso: fascicolo → reperti (tutti apribili, con etichetta-fonte) → citare ≥2 reperti → "Procedi"
- [ ] Senza 2 reperti citati il pulsante "Procedi" NON appare
- [ ] Rapporto ispettivo: classificazione → misura → soggetto → motivazione
- [ ] Riga **"Prove decisive"**: i reperti citati reggono / non reggono la classificazione
- [ ] Esito a 4 livelli (CONFORME / PARZIALE / CONTESTABILE / NON CONFORME) con timbro
- [ ] Decisione giusta ma reperti/soggetto/motivazione deboli → **CONTESTABILE**
- [ ] Carta norma: flip + unlock, sezione "Non significa che…", ritorno alla mappa
- [ ] ESC torna indietro da fascicolo / reperti / archivio

## Caso credito civico (caso 7) (A/B/C)
- [ ] Il caso "Il credito civico" (Ufficio Welfare) è apribile e completabile
- [ ] La classificazione corretta è **pratica vietata** (social scoring)
- [ ] La nota investigativa distingue il social scoring vietato dal credit scoring

## Modalità docente (A/B/C)
- [ ] `MODALITÀ DOCENTE: ON` mostra un toast di chiarimento ("Debrief locale: niente classi…")
- [ ] A fine partita il DEBRIEF DOCENTE è accessibile
- [ ] Il debrief dichiara che è un supporto locale e mostra la nota privacy
- [ ] Export `.txt` e `.json` si scaricano; il `.txt` include la nota privacy
- [ ] Stampa apre la finestra di stampa del browser

## Mobile / tablet (C, e A con DevTools responsive)
- [ ] **Smartphone portrait**: la mobile guard è visibile (avviso "ruota il dispositivo")
- [ ] **Smartphone landscape**: l'overlay scompare o il gioco è visibile
- [ ] **Tablet landscape**: il gioco è utilizzabile, nessun contenuto critico tagliato
- [ ] La mobile guard mostra il messaggio nella lingua corretta (IT/EN)
- [ ] Nessun errore di console su mobile

## Stato e salvataggio (A/C)
- [ ] Caso chiuso bene → marker verde; chiuso male → marker giallo "NON CONFORME"
- [ ] Refresh a metà partita → CONTINUA INDAGINE riprende dallo stato salvato
- [ ] RESET SALVATAGGIO azzera tutto (toast visibile prima del refresh)

## Finali (A, richiede più run o editing localStorage)
- [ ] 4 casi corretti → INNOVAZIONE GOVERNATA; 4 sbagliati → CITTÀ OPACA; misti → GOVERNANCE FRAGILE
- [ ] Il messaggio finale sull'AI Act è visibile in ogni finale

## Build (A/B)
- [ ] `npm run build` verde (1 warning chunk Phaser atteso); `npm run preview` gioca correttamente

---

**Esito da dichiarare:** livello eseguito (A / B / C), data, browser/dispositivo,
problemi riscontrati e severità. Per la release pubblica il livello **C** è
obbligatorio e va eseguito da un browser reale.
