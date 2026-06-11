# NO AI ACT
### Simulatore di una società non regolata

> Anno 2032. In una città europea alternativa l'AI Act non è mai entrato in vigore.
> La città è efficiente, automatizzata, predittiva. Nessuno riesce più a capire,
> contestare o correggere le decisioni algoritmiche. Tu sei l'Ispettore.

Serious game investigativo per browser. Ogni caso è una catastrofe algoritmica
plausibile; risolverlo significa classificare il sistema secondo la piramide del
rischio dell'AI Act e imporre la misura corretta. Ogni fascicolo chiuso sblocca
la **carta norma** che — in un'altra Europa — avrebbe prevenuto il danno.

**⚖️ Versione didattica semplificata** del Regolamento (UE) 2024/1689 (AI Act).
Questo gioco **non costituisce consulenza legale**.

---

## Obiettivo didattico

- Comprendere la logica *risk-based* dell'AI Act: pratiche vietate, alto rischio,
  obblighi di trasparenza, basso rischio.
- Collegare casi concreti (scoring sociale, recruiting opaco, deepfake
  istituzionali, emotion recognition a scuola, triage predittivo, biometria
  negli spazi pubblici) alle disposizioni che li governano.
- Mostrare che la regolazione non "blocca l'innovazione": la rende visibile,
  documentabile, contestabile e governabile.

**Target**: studenti di scuola superiore e università, formazione professionale,
cittadinanza digitale. Età consigliata 14+.

## Stack

| Componente | Scelta | Perché |
|---|---|---|
| Build | Vite 5 | dev server istantaneo, build statica |
| Linguaggio | TypeScript (strict) | dati di gioco tipati, refactoring sicuro |
| Engine | Phaser 3 | scene manager, tween, input e particles integrati |
| Audio | Web Audio API | sintesi procedurale, zero file e zero licenze |
| Grafica | Canvas/SVG procedurale | tutti gli asset generati a runtime |
| Persistenza | localStorage | salvataggio automatico |
| Test | Vitest | smoke test su dati e logica |

PixiJS è stato valutato e scartato: è solo un renderer, avremmo dovuto
reimplementare scene, tween e input. Niente React: la UI di gioco vive nel
canvas, il DOM serve solo per shell e overlay CRT.

## Installazione e avvio

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # build di produzione in dist/
npm run preview  # serve la build
npm test         # smoke test (Vitest)
```

## Come si gioca

Catastrofe → fascicolo → reperti → classificazione → misura correttiva →
conseguenza → carta AI Act → aggiornamento città → finale.

Quattro indicatori (0–100) reagiscono a ogni decisione: **Efficienza**,
**Controllo sociale**, **Diritti fondamentali**, **Fiducia pubblica**.
Dopo 4 casi chiusi si genera il rapporto finale: *Città opaca*,
*Governance fragile* o *Innovazione governata*.

## Casi implementati

| # | Luogo | Caso | Tema AI Act | Stato |
|---|---|---|---|---|
| 1 | Municipio Centrale | La città dei punteggi | art. 5 — social scoring | ✅ giocabile |
| 2 | Agenzia del Lavoro | Il colloquio che non esiste | Allegato III — lavoro | ✅ giocabile |
| 3 | Media Center Civico | La città sintetica | art. 50 — trasparenza | ✅ giocabile |
| 4 | Scuola delle Emozioni | La classe osservata | art. 5 — emotion recognition | ✅ giocabile |
| 5 | Ospedale Predittivo | Triage invisibile | obblighi alto rischio | 🔜 v0.2 (dati pronti) |
| 6 | Centro di Sorveglianza | Volti nella folla | art. 5 — biometria | 🔜 v0.2 (dati pronti) |

I casi 5–6 sono già completi a livello di dati (`src/game/data/cases.ts`):
per attivarli basta `playable: true`.

## Struttura del progetto

```
src/
  main.ts                  bootstrap Phaser
  styles/global.css        design token CSS + overlay CRT/scanline
  game/
    GameConfig.ts          configurazione e registro scene
    scenes/                Boot, Preload, Title, Briefing, CityMap, Case,
                           Evidence, Decision, Consequence, NormCard,
                           Archive, Finale, Credits
    systems/               StateManager, CaseSystem, IndicatorSystem,
                           NormSystem, AudioSystem, SaveSystem,
                           LicenseNoticeSystem
    ui/                    Button, Panel, IndicatorBar, DossierCard,
                           NormCard, AlertToast, TypewriterText, theme
    data/                  cases, norms, endings, indicators, types
    assets/procedural/     generatori canvas: mappa, icone, particelle, dossier
tests/smoke.test.ts        16 test su dati, valutazione, indicatori, finali
docs/GDD.md                Game Design Document
```

Nota: la cartella `public/assets/` prevista dal layout standard non esiste
perché **non ci sono asset esterni**: tutto è generato proceduralmente
(vedi `ASSET_REGISTER.md`).

## Accessibilità

- Contrasto elevato, font monospace ≥ 11px, valori numerici sempre accanto alle barre.
- L'informazione non è mai affidata al solo colore (etichette testuali ovunque).
- Toggle "ANIMAZIONI: RIDOTTE" (persistito): disattiva typewriter, glitch, scanline e pulse.
- Audio disattivabile e persistito; ESC torna alla mappa; click per saltare i testi.

## Fonti normative

- Regolamento (UE) 2024/1689 — AI Act
- art. 5 (pratiche vietate), art. 50 (trasparenza), Allegato III (alto rischio)
- Obblighi per sistemi ad alto rischio: gestione del rischio, qualità dei dati,
  documentazione tecnica, logging, trasparenza, supervisione umana, accuratezza,
  robustezza, cybersicurezza.

I testi in gioco sono sintesi divulgative marcate "versione didattica
semplificata". La rilevanza del rischio dipende sempre dal contesto d'uso.

## Licenze

- **Codice** (sistemi, generatori procedurali, UI, configurazione): **MIT** — `LICENSE`, Sezione 1.
- **Contenuti narrativi e didattici** (casi, carte norma, documentazione): **CC BY 4.0** — `LICENSE`, Sezione 2.
- **Terze parti**: il bundle distribuito include Phaser (MIT); il notice viaggia
  con la build perché `npm run build` copia `THIRD_PARTY_LICENSES.md`, `LICENSE`
  e `CREDITS.md` in `dist/` (`scripts/copy-notices.mjs`). Vite/Rollup da soli
  non includono i testi di licenza nella build.
- Registro asset completo: `ASSET_REGISTER.md`; dettagli: `LICENSE_NOTES.md`.

## Limiti noti

- Vertical slice: 4 casi giocabili su 6.
- Il contenuto giuridico è semplificato e non sostituisce il testo del regolamento.
- Navigazione da tastiera basilare (ESC/click); navigazione completa a frecce in roadmap.
- Lingua: solo italiano (EN in roadmap).
- Bundle Phaser ~360 KB gzip: accettabile per un gioco, non ottimizzato per mobile-first.

## Roadmap

- **0.2** — tutti e 6 i casi giocabili, archivio completo, più audio, bilanciamento indicatori.
- **0.3** — modalità docente, esportazione report finale, domande di debriefing, scheda didattica PDF.
- **0.4** — localizzazione IT/EN, PWA installabile, build desktop (Tauri).
- **1.0** — playtest strutturati, revisione giuridica, asset originali, pubblicazione.
