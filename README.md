<div align="center">

![NO AI ACT — Simulatore di una società non regolata](docs/banner.svg)

[![Licenza codice: MIT](https://img.shields.io/badge/codice-MIT-3fa66a)](LICENSE)
[![Contenuti: CC BY 4.0](https://img.shields.io/badge/contenuti-CC%20BY%204.0-5d7fb8)](LICENSE)
[![Stack](https://img.shields.io/badge/stack-TypeScript%20%2B%20Phaser%203%20%2B%20Vite-101a30)](#stack)
[![Test](https://img.shields.io/badge/test-Vitest-d9a521)](tests/)
[![Stato](https://img.shields.io/badge/stato-v0.6.0-3fa66a)](#stato-release)
[![Lingue](https://img.shields.io/badge/lingue-IT%20%2B%20EN-d8d6cd)](#lingue)

**Serious game investigativo sull'AI Act europeo · browser, zero asset esterni, salvataggio locale**

### ▶ [GIOCA ORA / PLAY NOW](https://matteoangeloni-jpeg.github.io/-NO-AI-ACT/play/)

Landing pubblica (IT/EN): `https://matteoangeloni-jpeg.github.io/-NO-AI-ACT/`
· Gioco: `https://matteoangeloni-jpeg.github.io/-NO-AI-ACT/play/`

[Come si gioca](#come-si-gioca) ·
[Uso didattico](#uso-didattico) ·
[Modalità docente](#modalità-docente) ·
[Dati e privacy](#dati-e-privacy) ·
[Game Design Document](docs/GDD.md) ·
[Licenze](#licenze)

</div>

---

> Anno 2032. In una città europea alternativa l'AI Act non è mai entrato in vigore.
> La città è efficiente, automatizzata, predittiva. Nessuno riesce più a capire,
> contestare o correggere le decisioni algoritmiche. **Tu sei l'Ispettore.**

**NO AI ACT** è un serious game investigativo per browser. Ogni caso è una
catastrofe algoritmica plausibile; risolverlo significa raccogliere i reperti,
classificare il sistema secondo la piramide del rischio dell'AI Act, imporre la
misura corretta e firmare un **rapporto ispettivo** motivato. Ogni fascicolo
chiuso sblocca la **carta norma** che — in un'altra Europa — avrebbe prevenuto
il danno.

**⚖️ Versione didattica semplificata** del Regolamento (UE) 2024/1689 (AI Act).
Questo gioco **non costituisce consulenza legale**.

| | |
|---|---|
| **Cos'è** | Serious game investigativo sull'AI Act, giocabile in browser |
| **Dove si gioca** | Landing IT/EN: <https://matteoangeloni-jpeg.github.io/-NO-AI-ACT/> · Gioco: <https://matteoangeloni-jpeg.github.io/-NO-AI-ACT/play/> (GitHub Pages) |
| **Cosa insegna** | La logica *risk-based* dell'AI Act: pratiche vietate, alto rischio, trasparenza, basso rischio — e perché la regola non "blocca" ma rende governabile |
| **A chi serve** | Studenti (14+), docenti, formazione professionale, PA, cittadinanza digitale |
| **Durata** | Da ~10–15 min (demo) a ~60–75 min (percorso avanzato) |
| **Lingue** | Italiano / English |
| **Account / dati** | Nessun account, nessun dato personale, nessun backend |

## Novità in v0.6.0 — Advanced Case Pack

La v0.6.0 estende l'Investigation & Learning Layer della v0.5 con **4 casi
avanzati** (da 7 a **11 casi**). Nessun nuovo backend/account/dashboard;
salvataggi v0.5 compatibili.

- **4 nuovi casi**: chatbot pubblico ("Lo sportello che risponde sempre"),
  procurement AI ("La gara opaca"), piattaforma educativa adattiva ("La classe
  profilata"), GPAI / modello generativo ("Il modello tuttofare").
- **Percorso "Casi avanzati"** (~75–90 min) e **glossario** ampliato.
- **Learning card** per i nuovi casi e **fascicolo città** esteso.
- Sistemi non necessariamente vietati, ma **da governare per contesto d'uso**:
  contano effetto sui diritti, supervisione effettiva, documentazione,
  responsabilità del deployer e contestabilità.

Dettagli: [`docs/RELEASE_NOTES_v0.6.0.md`](docs/RELEASE_NOTES_v0.6.0.md).

> **No backend · No accounts · No classroom dashboard · No personal data
> collection.** Teacher mode is local debrief support. Educational simulation,
> not legal advice.

## Obiettivo didattico

- Comprendere la logica *risk-based* dell'AI Act: pratiche vietate, alto rischio,
  obblighi di trasparenza, basso rischio.
- Collegare casi concreti (scoring sociale, recruiting opaco, deepfake
  istituzionali, emotion recognition a scuola, triage predittivo, biometria
  negli spazi pubblici, credito/welfare) alle disposizioni che li governano.
- Mostrare che la regolazione non "blocca l'innovazione": la rende visibile,
  documentabile, contestabile e governabile.

**Messaggio guida:** *l'AI Act non elimina il rischio, ma lo rende visibile,
documentabile, contestabile e governabile.*

## Come si gioca

Catastrofe → fascicolo → reperti (con etichetta-fonte) → citazione di almeno 2
reperti → classificazione → misura correttiva → soggetto responsabile →
motivazione → **rapporto ispettivo** con esito → carta AI Act → conseguenza →
aggiornamento città → finale.

Il rapporto ispettivo ha quattro esiti: **CONFORME / PARZIALMENTE CONFORME /
CONTESTABILE / NON CONFORME**. Una decisione giusta ma mal motivata (reperti non
pertinenti, soggetto errato, motivazione debole) è **contestabile**, mai
conforme: non basta indovinare, bisogna *documentare*.

Quattro indicatori (0–100) reagiscono a ogni decisione: **Efficienza**,
**Controllo sociale**, **Diritti fondamentali**, **Fiducia pubblica**. Dopo 4
casi chiusi si genera il rapporto finale: *Città opaca*, *Governance fragile* o
*Innovazione governata*.

## Casi implementati

| # | Luogo | Caso | Tema AI Act | Stato |
|---|---|---|---|---|
| 1 | Municipio Centrale | La città dei punteggi | art. 5 — social scoring | ✅ giocabile |
| 2 | Agenzia del Lavoro | Il colloquio che non esiste | Allegato III — lavoro | ✅ giocabile |
| 3 | Media Center Civico | La città sintetica | art. 50 — trasparenza | ✅ giocabile |
| 4 | Scuola delle Emozioni | La classe osservata | art. 5 — emotion recognition | ✅ giocabile |
| 5 | Ospedale Predittivo | Triage invisibile | obblighi alto rischio | ✅ giocabile |
| 6 | Centro di Sorveglianza | Volti nella folla | art. 5 — biometria (finalità di contrasto) | ✅ giocabile |
| 7 | Ufficio Welfare e Servizi | Il credito civico | art. 5 / Allegato III — social scoring vs welfare/credito | ✅ giocabile |
| 8 | Sportello Civico | Lo sportello che risponde sempre | art. 50 — trasparenza, chatbot pubblico | ✅ giocabile (v0.6) |
| 9 | Ufficio Appalti | La gara opaca | alto rischio — procurement AI, governance | ✅ giocabile (v0.6) |
| 10 | Campus Adattivo | La classe profilata | Allegato III — EdTech adattiva | ✅ giocabile (v0.6) |
| 11 | Centro Modelli | Il modello tuttofare | GPAI / uso a valle del modello generale | ✅ giocabile (v0.6) |

**11 casi giocabili** (7 base + 4 avanzati della v0.6). Il caso 7 ("Il credito
civico") è un *caso-specchio* sul confine social scoring vietato / alto rischio;
i casi 8–11 (chatbot pubblico, procurement, EdTech, GPAI) sono **casi avanzati**:
non necessariamente vietati, ma da governare in base al contesto d'uso e
all'effetto sui diritti.

## Difficoltà e percorsi

**Difficoltà selezionabili:**

- **Base** — istruzioni esplicite, suggerimento mirato dopo un errore,
  valutazione più indulgente sui vizi lievi di fondamento.
- **Standard** — rapporto completo, feedback equilibrato (consigliata per la demo).
- **Esperto** — pochi suggerimenti, feedback asciutto, severità su soggetto
  responsabile e motivazione.

**Percorsi / missioni** (nessun caso è bloccato; la mappa evidenzia i consigliati):

| Percorso | Durata | Obiettivo |
|---|---|---|
| Demo rapida | ~10–15 min | Capire la logica del rapporto ispettivo |
| Laboratorio breve | ~25–35 min | Distinguere pratica vietata, alto rischio e trasparenza |
| Percorso completo | ~45–60 min | Audit, responsabilità, misure e motivazione |
| Percorso avanzato | ~60–75 min | Casi ambigui e confini normativi (include il credito civico) |

## Uso didattico

NO AI ACT è pensato per essere usato **in autonomia** o **in aula**:

- **Pubblico**: studenti di scuola superiore e università, formazione
  professionale, funzionari PA, introduzione divulgativa all'AI Act.
- **Proiettato in classe**: il docente conduce un caso alla LIM/proiettore e
  guida la discussione (consigliato l'**EFFETTO CRT: OFF** per i proiettori).
- **Laboratorio individuale**: ogni studente gioca un percorso e poi si confronta.
- **Percorso consigliato per la prima volta**: difficoltà *Standard*,
  Laboratorio breve o Percorso completo.

La **modalità docente** aggiunge un debrief locale a fine partita con domande di
discussione (vedi sotto e [`docs/TEACHER_MODE.md`](docs/TEACHER_MODE.md)).
Guida ai playtest: [`docs/PLAYTEST_QUICK_START.md`](docs/PLAYTEST_QUICK_START.md).

## Modalità docente

La modalità docente è un **supporto locale per il debrief**. Non crea classi,
non registra studenti, non invia risultati a server.

> 🇮🇹 La modalità docente è un supporto locale per il debrief. Non crea classi,
> non registra studenti, non invia risultati a server.
>
> 🇬🇧 Teacher mode is local debrief support. It does not create classes, track
> students, or send results to a server.

A fine partita genera un debrief (esiti per caso, rilievi, norme acquisite,
indicatori, tempo, domande di discussione) consultabile a schermo, con export
`.txt`/`.json` e stampa **generati sul dispositivo**. Dettagli:
[`docs/TEACHER_MODE.md`](docs/TEACHER_MODE.md).

## Dati e privacy

> 🇮🇹 NO AI ACT è una demo pubblica accessibile tramite GitHub Pages. Il gioco
> non richiede account, non chiede nome, email, scuola o classe, e non salva
> risultati su server. La modalità docente produce solo un debrief locale.
> Eventuali export sono generati sul dispositivo dell'utente e possono essere
> condivisi manualmente. Gli analytics remoti sono disattivati di default.
>
> 🇬🇧 NO AI ACT is a public demo available through GitHub Pages. The game does
> not require an account, does not ask for names, emails, school, or class, and
> does not store results on a server. Teacher mode only produces a local
> debrief. Any exports are generated on the user's device and can be shared
> manually. Remote analytics are off by default.

Telemetria opzionale privacy-by-design (`AnalyticsSystem`): eventi di gameplay
aggregati con allowlist rigida; **niente** nomi, email, IP nel payload, free
text, cookie, fingerprinting, session replay o identificativi persistenti.
Default in produzione: **spenta**; rispetta Do Not Track. Adapter opzionali per
Plausible/Umami via variabili `VITE_*`. Dettagli e nota GDPR:
[`docs/ANALYTICS.md`](docs/ANALYTICS.md).

## Stack

| Componente | Scelta | Perché |
|---|---|---|
| Build | Vite 5 | dev server istantaneo, build statica |
| Linguaggio | TypeScript (strict) | dati di gioco tipati, refactoring sicuro |
| Engine | Phaser 3 | scene manager, tween, input e particles integrati |
| Audio | Web Audio API | sintesi procedurale, zero file e zero licenze |
| Grafica | Canvas/SVG procedurale | tutti gli asset generati a runtime |
| Persistenza | localStorage | salvataggio automatico, solo sul dispositivo |
| Test | Vitest | suite automatizzata su dati, logica, i18n, report, analytics |

Niente backend, niente account, niente asset esterni: tutto è generato
proceduralmente (vedi `ASSET_REGISTER.md`).

## Landing pubblica (SEO/GEO)

Sopra al gioco c'è un livello pubblico di presentazione, costruito come pagine
statiche dallo stesso build Vite multipagina:

- `/` — landing italiana (default), `/en/` — landing inglese, con SEO
  (canonical, hreflang it/en/x-default) e dati strutturati schema.org
  (`WebSite`, `SoftwareApplication`, `LearningResource`, `FAQPage`).
- `/play/` — il gioco Phaser (comportamento invariato). Le CTA delle landing
  passano la lingua: `/play/?lang=it` apre in italiano, `/play/?lang=en` in
  inglese; `/play/` senza query mantiene la lingua salvata.
- `/robots.txt`, `/sitemap.xml`, `/llms.txt` serviti dalla root (da `public/`),
  più i documenti AI-readable in `docs/` (`NO_AI_ACT_PROJECT_BRIEF.md`,
  `TEACHER_QUICK_START.md`, `LEGAL_DISCLAIMER.md`).
- Un popup **Tally** (form esterno, modale) raccoglie i riscontri di playtest
  senza backend e senza dati personali obbligatori.

## Installazione e avvio

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # build di produzione in dist/
npm run preview    # serve la build
npm test           # suite automatizzata (Vitest)
npm run typecheck  # controllo dei tipi
```

## <a name="lingue"></a>Lingue

Localizzazione **IT/EN** completa: sistema i18n tipato (`src/game/i18n/`),
selettore nel menu, lingua persistita. Una suite di test garantisce la parità di
struttura fra i dizionari (predisposto per FR/ES).

## Accessibilità

- Contrasto AA: il testo rosso usa una variante chiara (~5.5:1 su fondo scuro).
- Font monospace ≥ 12px, valori numerici sempre accanto alle barre.
- L'informazione non è mai affidata al solo colore (etichette testuali ovunque).
- Toggle "ANIMAZIONI: RIDOTTE" (persistito): disattiva typewriter, glitch, shake e pulse.
- Toggle "EFFETTO CRT" separato (persistito): rimuove scanline/vignettatura — pensato
  per proiettori e aule.
- Tastiera: tasti numerici per le decisioni, ESC per tornare indietro.
- Audio disattivabile e persistito; click per saltare i testi.
- Limite noto: nessun supporto screen reader (rendering canvas).

## Limiti noti

- **Ottimizzato per desktop e tablet in orizzontale.** Su smartphone in portrait
  un avviso ("mobile guard") invita a ruotare il dispositivo: non è
  un'esperienza mobile-first.
- Il rendering è su **canvas Phaser**: non pienamente compatibile con screen reader.
- Contenuto giuridico in **versione didattica semplificata**: non sostituisce il
  testo del regolamento né una consulenza legale.
- **Analytics remoti disattivati di default**; nessun account, nessuna dashboard
  classe, nessun registro studenti.
- Bundle Phaser ~388 KB gzip: accettabile per un gioco, non ottimizzato mobile-first.
- **Playtest reale ancora da completare** prima della presentazione pubblica.

## Roadmap

**✅ v0.6.0 — Advanced Case Pack (corrente)**
- 4 casi avanzati (7 → 11): chatbot pubblico, procurement AI, piattaforma
  educativa adattiva, GPAI — casi più ambigui da governare per contesto d'uso.
- Nuovo percorso "Casi avanzati", glossario ampliato, learning card aggiornate,
  fascicolo città esteso. Nessun nuovo backend/account; salvataggi v0.5 compatibili.
  Dettagli: [`docs/RELEASE_NOTES_v0.6.0.md`](docs/RELEASE_NOTES_v0.6.0.md) ·
  [`docs/V0.6_DESIGN_NOTES.md`](docs/V0.6_DESIGN_NOTES.md).

**✅ v0.5.0 — Investigation & Learning Layer**
- Tassonomia delle fragilità decisionali, analisi della decisione nel rapporto,
  schede didattiche, reperti investigativi, fascicolo città, glossario operativo,
  export docente arricchito (locale). [`docs/RELEASE_NOTES_v0.5.0.md`](docs/RELEASE_NOTES_v0.5.0.md).

**✅ Base (v0.4.0)**
- 7 casi base, difficoltà Base/Standard/Esperto, percorsi/missioni, modalità
  docente locale, mobile guard, IT/EN, analytics privacy-by-design (off).

**🧭 Futuro possibile (v0.7+)**
- Organizzazione mappa per zone/capitoli; revisione giuridica terza; pacchetto
  pubblico/accademico; rifinitura da playtest.

## <a name="stato-release"></a>Stato release

- **Versione**: v0.6.0
- **Branch stabile**: `main` (GitHub Pages deploy attivo)
- **Distribuzione**: <https://matteoangeloni-jpeg.github.io/-NO-AI-ACT/>
- **Casi**: 11 giocabili (7 base + 4 avanzati).
- **Test / build**: verdi in locale e in CI (148 test automatici).
- **Playtest reale**: da completare prima della presentazione pubblica.

Release notes: [`docs/RELEASE_NOTES_v0.6.0.md`](docs/RELEASE_NOTES_v0.6.0.md) ·
checklist di rilascio: [`docs/RELEASE_CHECKLIST.md`](docs/RELEASE_CHECKLIST.md).

## Contribuire / testare

- Esegui `npm install && npm run dev`, gioca un percorso e segui la
  [smoke checklist](docs/SMOKE_CHECKLIST.md).
- Per organizzare un playtest con 4–5 persone:
  [`docs/PLAYTEST_QUICK_START.md`](docs/PLAYTEST_QUICK_START.md).
- Non raccogliere dati personali dei tester: usa codici anonimi (T1, T2, …).

## Licenze

- **Codice** (sistemi, generatori procedurali, UI, configurazione): **MIT** — `LICENSE`, Sezione 1.
- **Contenuti narrativi e didattici** (casi, carte norma, documentazione): **CC BY 4.0** — `LICENSE`, Sezione 2.
- **Terze parti**: il bundle distribuito include Phaser (MIT); il notice viaggia
  con la build perché `npm run build` copia `THIRD_PARTY_LICENSES.md`, `LICENSE`
  e `CREDITS.md` in `dist/` (`scripts/copy-notices.mjs`).
- Registro asset completo: `ASSET_REGISTER.md`; dettagli: `LICENSE_NOTES.md`.

## Fonti normative

- Regolamento (UE) 2024/1689 — AI Act
- art. 5 (pratiche vietate), art. 50 (trasparenza), Allegato III (alto rischio)
- Obblighi per sistemi ad alto rischio: gestione del rischio, qualità dei dati,
  documentazione tecnica, logging, trasparenza, supervisione umana, accuratezza,
  robustezza, cybersicurezza.

I testi in gioco sono sintesi divulgative marcate "versione didattica
semplificata". La rilevanza del rischio dipende sempre dal contesto d'uso.

---

## English summary

**NO AI ACT — Simulator of an unregulated society** is a browser-based
investigative serious game about the EU AI Act (Regulation (EU) 2024/1689).
It is 2032 in an alternate European city where the AI Act never entered into
force: you are the Inspector for Algorithmic Incidents. Each of the **seven
playable cases** is a plausible algorithmic disaster — social scoring, opaque AI
recruiting, unlabeled synthetic government media, emotion recognition in schools,
predictive triage, public biometrics, civic credit/welfare scoring — to
investigate, classify under the AI Act risk pyramid and remedy with a reasoned
**inspection report**. Three difficulty modes, four mission paths, IT/EN.

No account, no backend, no personal data: every graphic and sound is generated
procedurally. Teacher mode is local debrief support only. Educational
simplification of the AI Act — not legal advice. Code: MIT · narrative and
didactic content: CC BY 4.0.

**Play now:** <https://matteoangeloni-jpeg.github.io/-NO-AI-ACT/>

```bash
npm install && npm run dev
```
