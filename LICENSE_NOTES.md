# LICENSE NOTES — NO AI ACT

Chiarimenti sulla natura e sul regime dei materiali del repository.

## 1. Che cosa è codice

Tutto il contenuto di `src/`, `tests/`, i file di configurazione
(`package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`) e gli
script. Comprende anche i **generatori procedurali** in
`src/game/assets/procedural/` e la sintesi audio in `AudioSystem.ts`:
sono codice, e gli output che producono a runtime sono opere del progetto.

Il proprietario del repository non ha ancora dichiarato una licenza per il
progetto (non esiste un file `LICENSE`). Fino ad allora il codice è "all
rights reserved" per default. Suggerimento: MIT per il codice.

## 2. Che cosa sono asset

In questo progetto **non esistono asset binari esterni** (immagini, audio,
font). Tutta la grafica e tutto l'audio sono generati a runtime dal codice
(punto 1). Se in futuro verranno aggiunti asset esterni, dovranno:
1. essere registrati in `ASSET_REGISTER.md` prima del commit;
2. avere autore, link e pagina di licenza verificati;
3. rispettare la policy: preferenza CC0/MIT/ISC/Apache-2.0; CC BY solo con
   attribuzione completa; CC BY-SA solo con motivazione; NonCommercial e
   licenze ambigue rifiutate.

## 3. Che cosa è contenuto narrativo

I testi dei casi, gli indizi, le note investigative, i finali e i testi delle
carte norma (`src/game/data/`) sono opere narrative/didattiche originali del
progetto. Le **carte norma** contengono sintesi divulgative del Regolamento
(UE) 2024/1689: i testi normativi ufficiali dell'Unione europea sono
riutilizzabili (decisione 2011/833/UE), ma le sintesi qui presenti sono
riformulazioni didattiche, non il testo ufficiale, e sono marcate
"versione didattica semplificata".

## 4. Che cosa richiede attribuzione

- **Oggi**: nulla a livello di asset. Le librerie MIT/Apache richiedono solo
  la conservazione dei notice di licenza nei pacchetti (già inclusi in
  `node_modules` e nei metadati di build).
- **In futuro**: qualsiasi asset CC BY dovrà comparire in `CREDITS.md` con
  titolo, autore, fonte, link alla licenza e indicazione delle modifiche.

## 5. Disclaimer

Il gioco è materiale didattico. Non costituisce consulenza legale e non
sostituisce il testo del Regolamento (UE) 2024/1689.
