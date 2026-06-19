<div align="center">

![NO AI ACT — Simulatore di una società non regolata](docs/banner.svg)

[![Licenza codice: MIT](https://img.shields.io/badge/codice-MIT-3fa66a)](LICENSE)
[![Contenuti: CC BY 4.0](https://img.shields.io/badge/contenuti-CC%20BY%204.0-5d7fb8)](LICENSE)
[![Stack](https://img.shields.io/badge/stack-TypeScript%20%2B%20Phaser%203%20%2B%20Vite-101a30)](#stack)
[![Test](https://img.shields.io/badge/test-Vitest-d9a521)](tests/)
[![Stato](https://img.shields.io/badge/stato-v0.2-d23b3b)](#roadmap)
[![Lingue](https://img.shields.io/badge/lingue-IT%20%2B%20EN-d8d6cd)](#roadmap)

**Serious game investigativo sull'AI Act europeo · browser, zero asset esterni, salvataggio locale**

[Avvio rapido](#installazione-e-avvio) ·
[Come si gioca](#come-si-gioca) ·
[Casi](#casi-implementati) ·
[Game Design Document](docs/GDD.md) ·
[Checklist smoke](docs/SMOKE_CHECKLIST.md) ·
[Licenze](#licenze)

</div>

---

> Anno 2032. In una città europea alternativa l'AI Act non è mai entrato in vigore.
> La città è efficiente, automatizzata, predittiva. Nessuno riesce più a capire,
> contestare o correggere le decisioni algoritmiche. **Tu sei l'Ispettore.**

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
| 5 | Ospedale Predittivo | Triage invisibile | obblighi alto rischio | ✅ giocabile (v0.2) |
| 6 | Centro di Sorveglianza | Volti nella folla | art. 5 — biometria (finalità di contrasto) | ✅ giocabile (v0.2) |
| 7 | Ufficio Welfare e Servizi | Il credito civico | art. 5 / Allegato III — social scoring vs welfare/credito | ✅ giocabile (v0.4) |

### Novità v0.4
- **Caso-specchio credito/welfare** ("Il credito civico"): insegna a distinguere
  social scoring vietato, welfare predittivo ad alto rischio e valutazione di
  affidabilità economica. Non ogni punteggio è vietato: contano finalità, dati,
  contesto ed effetti sui diritti.
- **Difficoltà** selezionabili: **Base** (istruzioni esplicite, valutazione
  indulgente, suggerimenti dopo un errore), **Standard** (consigliata per la
  demo), **Esperto** (severo su soggetto e motivazione).
- **Missioni/percorsi**: Demo rapida (~10–15′), Laboratorio breve (~25–35′),
  Percorso completo (~45–60′), Percorso avanzato (~60–75′, include il caso 7).
  La mappa evidenzia i casi consigliati; nessun caso è bloccato.
- **Reperti con fonte** ed etichetta di attendibilità + riga "Prove decisive"
  nel rapporto.
- **Ottimizzato per desktop / tablet in orizzontale**: su smartphone in portrait
  un avviso invita a ruotare il dispositivo. Nessun dato personale raccolto.

### Novità v0.2
- **Multilingua IT/EN**: sistema i18n tipato (`src/game/i18n/`), selettore nel
  menu, lingua persistita; predisposto per FR/ES.
- **Musica procedurale per livello**: un tema Web Audio diverso per ogni caso
  (drone burocratico, pulse da screening, glitch radio, ambiente clinico,
  battito da monitor, radar) con crossfade e volume musica regolabile.
- **Citazione dei reperti**: prima di classificare bisogna citare nel rapporto
  almeno 2 reperti; citare i reperti sbagliati degrada l'esito a parziale anche
  con classificazione e misura corrette.

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

- Contrasto AA: il testo rosso usa una variante chiara (#e25b5b, ~5.5:1 su fondo scuro).
- Font monospace ≥ 12px, valori numerici sempre accanto alle barre.
- L'informazione non è mai affidata al solo colore (etichette testuali ovunque).
- Toggle "ANIMAZIONI: RIDOTTE" (persistito): disattiva typewriter, glitch, shake e pulse.
- Toggle "EFFETTO CRT" separato (persistito): rimuove scanline/vignettatura — pensato
  per proiettori e aule.
- Tastiera: tasti 1–5 / 1–7 per le decisioni, ESC per tornare indietro.
- Audio disattivabile e persistito; click per saltare i testi.
- Limite noto: nessun supporto screen reader (rendering canvas).

## Privacy e analytics

Il gioco misura **come viene usato**, mai **chi lo usa**. Telemetria opzionale
privacy-by-design (`AnalyticsSystem`): eventi di gameplay aggregati con
allowlist rigida di proprietà; **niente** nomi, email, IP nel payload, free
text, cookie, fingerprinting, session replay o identificativi persistenti.
Default: spenta in produzione, console in sviluppo; rispetta Do Not Track.
Adapter pronti per Plausible/Umami via variabili `VITE_*` (`.env.example`).
Dettagli, garanzie e nota GDPR: [`docs/ANALYTICS.md`](docs/ANALYTICS.md).

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
- Tastiera: scorciatoie numeriche e ESC; navigazione a frecce/focus completo in roadmap.
- Nessun supporto screen reader (canvas).
- Lingua: solo italiano (EN in roadmap).
- Bundle Phaser ~360 KB gzip: accettabile per un gioco, non ottimizzato per mobile-first.

## Roadmap

- **0.2** ✅ — 6 casi giocabili, multilingua IT/EN, musica procedurale per livello, citazione dei reperti.
- **0.3** — modalità docente, esportazione report finale, domande di debriefing, scheda didattica PDF, FR/ES.
- **0.4** — PWA installabile, build desktop (Tauri), delta indicatori per caso.
- **1.0** — playtest strutturati, revisione giuridica, asset originali, pubblicazione.

---

## English summary

**NO AI ACT — Simulator of an unregulated society** is a browser-based
investigative serious game about the EU AI Act (Regulation (EU) 2024/1689).
It is 2032 in an alternate European city where the AI Act never entered into
force: you are the Inspector for Algorithmic Incidents. Each case is a
plausible algorithmic disaster — social scoring, opaque AI recruiting,
unlabeled synthetic government media, emotion recognition in schools — to
investigate, classify under the AI Act risk pyramid and remedy. Four city
indicators react to every decision and determine one of three endings.

Built with TypeScript, Phaser 3 and Vite; every graphic and sound is generated
procedurally (no external assets, fully traced licensing). Educational
simplification of the AI Act — not legal advice. Code: MIT · narrative and
didactic content: CC BY 4.0.

```bash
npm install && npm run dev
```
