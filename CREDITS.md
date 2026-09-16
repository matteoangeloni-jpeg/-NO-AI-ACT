# CREDITS — NO AI ACT

## Librerie

| Componente | Autore | Fonte | Licenza | Link | Attribuzione | Modifiche |
|---|---|---|---|---|---|---|
| Phaser 3 | Richard Davey, Phaser Studio Inc. | npm | MIT | https://phaser.io | notice MIT distribuito con la build in `THIRD_PARTY_LICENSES.md` | nessuna |
| Vite | Evan You e contributori | npm | MIT | https://vitejs.dev | non richiesta | nessuna |
| TypeScript | Microsoft | npm | Apache-2.0 | https://www.typescriptlang.org | non richiesta | nessuna |
| Vitest | Vitest team | npm (solo dev) | MIT | https://vitest.dev | non richiesta | nessuna |

## Asset

Tutti gli asset grafici sono **originali e generati proceduralmente**
all'interno di questo repository. L'audio è generato proceduralmente, con
l'eccezione dei campioni registrati descritti sotto.

| Asset | Autore | Fonte | Licenza | Modifiche |
|---|---|---|---|---|
| Mappa civica, icone, texture rumore, carta dossier | progetto NO AI ACT | `src/game/assets/procedural/` | GPL-3.0-or-later (vedi LICENSE, Sez. 1) | n/a |
| Suoni UI, temi musicali e drone ambientale (sintesi) | progetto NO AI ACT | `src/game/systems/AudioSystem.ts`, `musicThemes.ts` | GPL-3.0-or-later (vedi LICENSE, Sez. 1) | n/a |
| Effetti CRT/scanline/glitch | progetto NO AI ACT | `src/styles/global.css` + scene | GPL-3.0-or-later (vedi LICENSE, Sez. 1) | n/a |

### Campioni audio registrati

`src/game/assets/audio/` può contenere sedici campioni (sei musiche in loop
e dieci effetti) elencati in `src/game/systems/audioAssets.ts`. Il gioco
funziona con o senza: quando un campione manca, suona la sua versione
sintetizzata.

I campioni sono stati prodotti dall'autore con **ElevenLabs**, su piano a
pagamento. I termini di ElevenLabs attribuiscono all'abbonato di un piano a
pagamento i diritti d'uso commerciale sull'output generato — a differenza
del piano gratuito, che non li concede — quindi l'autore può licenziarli
come parte del progetto. Non sono materiale di terze parti: sono opera
dell'autore realizzata con uno strumento.

| Asset | Autore | Fonte | Licenza | Modifiche |
|---|---|---|---|---|
| 6 musiche in loop e 10 effetti in `src/game/assets/audio/` | progetto NO AI ACT | generati con ElevenLabs (piano a pagamento) | CC BY-SA 4.0 (vedi LICENSE, Sez. 2) | guadagni di mix applicati a runtime (`SFX_TRIM`, `MUSIC_TRIM`); i file non sono modificati |

### Dichiarazione di sintesi

Parte dell'audio di questo gioco è **generata con un sistema di IA**. Il
progetto lo dichiara apertamente perché insegna proprio gli obblighi di
trasparenza sui contenuti sintetici: sarebbe incoerente ometterlo. La
dichiarazione riguarda la provenienza dell'audio, non i contenuti didattici,
che sono scritti dall'autore.

## Tipografia

Nessun file font è distribuito. Il gioco usa un font stack di sistema:
`IBM Plex Mono` (se installato localmente dall'utente), altrimenti
`Cascadia Code`, `Consolas`, `DejaVu Sans Mono`, `monospace`.

## Contenuti

Testi narrativi e casi investigativi: originali, scritti per questo progetto,
rilasciati con licenza **CC BY-SA 4.0** (vedi LICENSE, Sez. 2 — attribuzione:
"Matteo Angeloni — NO AI ACT").
Contenuti normativi: sintesi divulgative del Regolamento (UE) 2024/1689
(AI Act), marcate in gioco come "versione didattica semplificata".
Nessun marchio, logo reale, volto riconoscibile o materiale di terze parti.

## Distribuzione dei notice

`npm run build` copia `THIRD_PARTY_LICENSES.md`, `LICENSE` e questo file
dentro `dist/`: chi pubblica la build distribuisce automaticamente i notice.
