# LICENSE NOTES — NO AI ACT

Chiarimenti sulla natura e sul regime dei materiali del repository.

## 1. Che cosa è codice

Tutto il contenuto di `src/`, `tests/`, i file di configurazione
(`package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`) e gli
script. Comprende anche i **generatori procedurali** in
`src/game/assets/procedural/` e la sintesi audio in `AudioSystem.ts`:
sono codice, e gli output che producono a runtime sono opere del progetto.

**Licenza adottata: MIT** (vedi `LICENSE`, Sezione 1). Vale per codice,
sistemi, generatori procedurali, componenti UI, configurazione tecnica,
script e test.

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
progetto, rilasciate con **licenza CC BY 4.0** (vedi `LICENSE`, Sezione 2),
così come la documentazione didattica. Le **carte norma** contengono sintesi divulgative del Regolamento
(UE) 2024/1689: i testi normativi ufficiali dell'Unione europea sono
riutilizzabili (decisione 2011/833/UE), ma le sintesi qui presenti sono
riformulazioni didattiche, non il testo ufficiale, e sono marcate
"versione didattica semplificata".

## 4. Che cosa richiede attribuzione

- **Chi riusa i contenuti narrativi/didattici** (CC BY 4.0) deve attribuire
  "NO AI ACT project contributors", linkare la licenza e indicare le modifiche.
- **Chi distribuisce la build** deve includere i notice di terze parti: il
  bundle contiene Phaser (MIT), il cui testo di licenza deve accompagnare le
  copie distribuite. Vite/Rollup **non** generano automaticamente un file di
  notice e la minificazione può rimuovere i banner: per questo `npm run build`
  copia `THIRD_PARTY_LICENSES.md`, `LICENSE` e `CREDITS.md` dentro `dist/`
  (script `scripts/copy-notices.mjs`).
- **In futuro**: qualsiasi asset CC BY dovrà comparire in `CREDITS.md` con
  titolo, autore, fonte, link alla licenza e indicazione delle modifiche.

## 5. Disclaimer

Il gioco è materiale didattico. Non costituisce consulenza legale e non
sostituisce il testo del Regolamento (UE) 2024/1689.
