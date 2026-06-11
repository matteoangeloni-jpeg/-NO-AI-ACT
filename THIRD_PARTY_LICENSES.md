# THIRD PARTY LICENSES — NO AI ACT

Questo file accompagna sia il repository sia la build distribuita (`dist/`),
dove viene copiato automaticamente da `npm run build`
(script `scripts/copy-notices.mjs`).

---

## Software di terze parti DISTRIBUITO nella build

### Phaser 3 (https://phaser.io)

Il bundle JavaScript di produzione include il game engine Phaser.
Licenza riprodotta verbatim da `node_modules/phaser/LICENSE.md`:

```
The MIT License (MIT)

Copyright (c) 2024 Richard Davey, Phaser Studio Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

---

## Strumenti di sviluppo NON distribuiti nella build

I seguenti strumenti sono usati solo in fase di sviluppo/build/test: il loro
codice **non** è incluso nel bundle distribuito. Sono elencati per completezza.

| Strumento | Licenza | Fonte licenza |
|---|---|---|
| Vite | MIT — Copyright (c) 2019-present, VoidZero Inc. and Vite contributors | `node_modules/vite/LICENSE.md` |
| TypeScript | Apache License 2.0 — Microsoft Corporation | `node_modules/typescript/LICENSE.txt` |
| Vitest | MIT — Vitest contributors | `node_modules/vitest/LICENSE.md` |

I testi integrali sono disponibili nei rispettivi pacchetti npm e nei
repository upstream.

---

Nessun altro materiale di terze parti (immagini, audio, font, dati) è
incluso: tutti gli asset di gioco sono generati proceduralmente dal codice
del progetto (vedi ASSET_REGISTER.md).
