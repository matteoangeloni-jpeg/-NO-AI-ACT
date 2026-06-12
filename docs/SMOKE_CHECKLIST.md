# SMOKE CHECKLIST MANUALE — NO AI ACT

Da eseguire in browser (`npm run dev`) prima di ogni demo o release.
I test automatici (`npm test`) coprono dati e logica; questa checklist copre
ciò che solo un browser può verificare.

## Avvio
- [ ] `npm install && npm run dev` parte senza errori
- [ ] La pagina carica: boot → preload (barra di generazione asset) → title
- [ ] Console del browser senza errori (il notice licenze in `console.info` è atteso)
- [ ] Glitch del titolo attivo (se animazioni piene)

## Preferenze
- [ ] AUDIO ON/OFF funziona e persiste dopo refresh
- [ ] MUSICA cicla 100% → 50% → 0% e persiste
- [ ] ANIMAZIONI PIENE/RIDOTTE funziona e persiste (typewriter istantaneo, niente glitch/pulse/shake)
- [ ] EFFETTO CRT ON/OFF rimuove l'overlay scanline e persiste (uso con proiettore)
- [ ] LINGUA cambia IT ↔ EN, aggiorna menu/casi/carte/finali/archivio e persiste dopo refresh

## Flusso di gioco
- [ ] NUOVA PARTITA → briefing (typewriter, click per saltare) → mappa
- [ ] La mappa mostra 6 luoghi, tutti con [ INCIDENTE APERTO ]
- [ ] Ogni caso: fascicolo → 3 reperti (tutti apribili) → citare ≥2 reperti → "Procedi"
- [ ] Senza 2 reperti citati il pulsante "Procedi" NON appare
- [ ] Citare i reperti sbagliati con decisioni giuste → esito PARZIALE con nota sui reperti
- [ ] Decisione 1: 5 opzioni, selezionabili anche con tasti 1–5
- [ ] Decisione 2: 7 opzioni, selezionabili anche con tasti 1–7
- [ ] Conseguenza: barre animate con delta, micro-commento, nota investigativa
- [ ] Carta norma: flip + suono unlock, ritorno alla mappa
- [ ] ESC torna alla mappa da fascicolo/reperti/archivio

## Stato e salvataggio
- [ ] Caso completato bene → marker verde [ CASO CHIUSO ]
- [ ] Caso completato male → marker giallo [ CHIUSO — NON CONFORME ]
- [ ] Refresh a metà partita → CONTINUA INDAGINE riprende dallo stato salvato
- [ ] RESET SALVATAGGIO azzera tutto (toast visibile prima del refresh della scena)
- [ ] Archivio norme: carte sbloccate consultabili, slot bloccati con lucchetto
- [ ] Dettaglio carta in archivio: il click SULLA carta non la chiude; fuori sì; ESC sì

## Finali (richiede 3 run o editing del localStorage)
- [ ] 4 casi tutti corretti → FINALE 3 — INNOVAZIONE GOVERNATA
- [ ] 4 casi tutti sbagliati → FINALE 1 — CITTÀ OPACA
- [ ] Esiti misti (2 corretti / 2 sbagliati) → FINALE 2 — GOVERNANCE FRAGILE
- [ ] Il messaggio finale sull'AI Act è visibile in ogni finale
- [ ] NUOVA PARTITA dal finale → briefing con stato azzerato

## Audio e musica
- [ ] Tema "city" parte sulla mappa, NON suona nel menu titolo
- [ ] Ogni caso ha un tema diverso (drone freddo, pulse, glitch radio, clinico, battito, radar)
- [ ] Crossfade morbido mappa ↔ caso, nessun click/pop
- [ ] Click, conferma, errore, alert e unlock distinguibili
- [ ] Mute immediato e persistente; volume musica indipendente dagli effetti

## Build
- [ ] `npm run build` verde; `npm run preview` gioca correttamente
- [ ] `dist/` contiene THIRD_PARTY_LICENSES.md, LICENSE, CREDITS.md
