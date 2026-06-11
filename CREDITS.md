# CREDITS — NO AI ACT

## Librerie

| Componente | Autore | Fonte | Licenza | Link | Attribuzione | Modifiche |
|---|---|---|---|---|---|---|
| Phaser 3 | Richard Davey, Phaser Studio Inc. | npm | MIT | https://phaser.io | notice MIT distribuito con la build in `THIRD_PARTY_LICENSES.md` | nessuna |
| Vite | Evan You e contributori | npm | MIT | https://vitejs.dev | non richiesta | nessuna |
| TypeScript | Microsoft | npm | Apache-2.0 | https://www.typescriptlang.org | non richiesta | nessuna |
| Vitest | Vitest team | npm (solo dev) | MIT | https://vitest.dev | non richiesta | nessuna |

## Asset

Tutti gli asset grafici e audio sono **originali e generati proceduralmente**
all'interno di questo repository:

| Asset | Autore | Fonte | Licenza | Modifiche |
|---|---|---|---|---|
| Mappa civica, icone, texture rumore, carta dossier | progetto NO AI ACT | `src/game/assets/procedural/` | MIT (vedi LICENSE, Sez. 1) | n/a |
| Suoni UI e drone ambientale | progetto NO AI ACT | `src/game/systems/AudioSystem.ts` | MIT (vedi LICENSE, Sez. 1) | n/a |
| Effetti CRT/scanline/glitch | progetto NO AI ACT | `src/styles/global.css` + scene | MIT (vedi LICENSE, Sez. 1) | n/a |

## Tipografia

Nessun file font è distribuito. Il gioco usa un font stack di sistema:
`IBM Plex Mono` (se installato localmente dall'utente), altrimenti
`Cascadia Code`, `Consolas`, `DejaVu Sans Mono`, `monospace`.

## Contenuti

Testi narrativi e casi investigativi: originali, scritti per questo progetto,
rilasciati con licenza **CC BY 4.0** (vedi LICENSE, Sez. 2 — attribuzione:
"NO AI ACT project contributors").
Contenuti normativi: sintesi divulgative del Regolamento (UE) 2024/1689
(AI Act), marcate in gioco come "versione didattica semplificata".
Nessun marchio, logo reale, volto riconoscibile o materiale di terze parti.

## Distribuzione dei notice

`npm run build` copia `THIRD_PARTY_LICENSES.md`, `LICENSE` e questo file
dentro `dist/`: chi pubblica la build distribuisce automaticamente i notice.
