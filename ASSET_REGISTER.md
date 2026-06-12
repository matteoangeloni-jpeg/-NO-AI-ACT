# ASSET REGISTER — NO AI ACT

Registro completo di asset e librerie. Stati possibili: `approved`,
`rejected`, `needs verification`, `procedural fallback`, `replaced`.

## Contesto della ricognizione

La ricognizione delle fonti esterne (Kenney.nl, OpenGameArt, Freesound, itch.io,
Game-icons.net, Google Fonts, ecc.) **non è stata completata con verifica diretta
delle pagine di licenza**: questo progetto è stato generato in un ambiente senza
possibilità di verificare asset per asset autore, pagina e termini. Regola del
progetto: *nessuna licenza inventata, nessun asset non verificato*. Di
conseguenza tutti gli asset grafici, audio e tipografici sono stati **generati
proceduralmente** (stato `procedural fallback`). Le librerie npm sono invece
verificabili dal campo `license` dei rispettivi pacchetti installati.

## Registro

| Asset/Libreria | Tipo | Fonte | Link | Licenza | Uso previsto | Attribuzione richiesta | Stato |
|---|---|---|---|---|---|---|---|
| Phaser 3 (^3.87) | libreria game engine | npm | https://phaser.io | MIT | engine di gioco (incluso nel bundle) | sì: notice MIT distribuito via `THIRD_PARTY_LICENSES.md` copiato in `dist/` dallo script di build | approved |
| Vite 5 | build tool | npm | https://vitejs.dev | MIT | dev server + build | no | approved |
| TypeScript 5 | compilatore | npm | https://www.typescriptlang.org | Apache-2.0 | linguaggio | no | approved |
| Vitest 2 | test runner (solo dev) | npm | https://vitest.dev | MIT | smoke test | no | approved |
| Mappa civica | texture canvas | generata: `createCityMap.ts` | repo | MIT (codice generatore) | sfondo mappa | n/a | procedural fallback |
| Icone luoghi/UI (9) | texture canvas | generate: `createIcons.ts` | repo | MIT (codice generatore) | marker e carte | n/a | procedural fallback |
| Texture rumore + particelle | texture canvas | generate: `createParticles.ts` | repo | MIT (codice generatore) | overlay e fx | n/a | procedural fallback |
| Carta dossier | texture canvas | generata: `createDossierTextures.ts` | repo | MIT (codice generatore) | sfondo fascicoli | n/a | procedural fallback |
| Suoni UI (click, alert, errore, conferma, unlock, terminale) | sintesi Web Audio | generati: `AudioSystem.ts` | repo | MIT (codice generatore) | feedback UI | n/a | procedural fallback |
| Drone ambientale | sintesi Web Audio | generato: `AudioSystem.ts` | repo | MIT (codice generatore) | atmosfera | n/a | procedural fallback |
| Scanline/CRT/glitch | CSS + tween Phaser | `global.css`, scene | repo | MIT (codice) | effetti visivi | n/a | procedural fallback |
| Testi narrativi, casi, carte norma | contenuto editoriale | `src/game/data/` | repo | CC BY 4.0 | gameplay e didattica | sì, per chi li riusa (vedi LICENSE Sez. 2) | approved |
| Font | font stack di sistema (IBM Plex Mono *se presente localmente*, altrimenti Consolas/DejaVu/monospace) | sistema operativo utente | n/a | nessun file font distribuito | tipografia | no | approved |
| Banner repository | SVG disegnato a mano | `docs/banner.svg` | repo | MIT (vedi LICENSE Sez. 1) | testata README/GitHub | n/a | approved |
| Badge README | immagini generate da shields.io al momento della visualizzazione | https://shields.io | README.md | servizio esterno (CC0 per i badge generati); nessun file distribuito nel repo o nella build | decorazione documentazione | no | approved |

## Asset valutati e scartati (per questa versione)

| Fonte | Motivo |
|---|---|
| Kenney.nl (grafica/audio, CC0) | fonte notoriamente CC0 e di alta qualità, ma non verificabile asset-per-asset in questo ambiente → sostituita da fallback procedurale; **candidata prioritaria per v0.2** |
| OpenGameArt.org | licenze miste per singolo asset (CC0/CC-BY/CC-BY-SA/GPL), richiede verifica puntuale di autore e pagina | 
| Freesound.org | molti file CC-BY-NC (NonCommercial → rifiutato da policy); richiede filtro e verifica per file |
| Game-icons.net | CC BY 3.0: accettabile solo con attribuzione completa per icona; rinviata a quando l'attribuzione potrà essere compilata con autore verificato |
| Google Fonts / Fontsource | OFL/Apache: compatibili, ma si è preferito evitare di ridistribuire file font senza poter allegare il testo di licenza verificato; il CSS usa i font solo se già installati nel sistema dell'utente |
| Font Awesome Free | mix di licenze (icone CC BY 4.0, font OFL, codice MIT): complessità di attribuzione non giustificata rispetto a 9 icone disegnabili a mano |
| Asset "free" generici da itch.io | termini spesso ambigui o personalizzati → rifiutati per policy |

## Rischi di licenza residui

- **Nessun rischio su asset multimediali**: non esistono file esterni nel repo.
- Librerie npm: licenze permissive (MIT/Apache-2.0). Attenzione: Vite/Rollup
  **non** includono automaticamente i testi di licenza nella build e la
  minificazione può rimuovere i banner. Il notice di Phaser (unica dipendenza
  distribuita nel bundle) viene quindi garantito copiando
  `THIRD_PARTY_LICENSES.md` in `dist/` ad ogni `npm run build`
  (`scripts/copy-notices.mjs`).
- Nomi e contenuti narrativi: completamente originali; nessun marchio, logo
  reale o volto riconoscibile.

## Strategia di fallback procedurale (attiva)

1. Grafica: Canvas 2D a runtime (mappa con PRNG deterministico, icone a tratti
   geometrici, texture di rumore).
2. Audio: oscillatori e inviluppi Web Audio (nessun campione).
3. Tipografia: font stack di sistema, zero file distribuiti.
4. Quando un asset esterno verrà adottato (v0.2+), andrà aggiunto a questo
   registro **prima** del commit, con link alla pagina di licenza e stato
   `approved` o `needs verification`.
