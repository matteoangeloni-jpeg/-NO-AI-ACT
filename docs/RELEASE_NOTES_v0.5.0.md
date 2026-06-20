# NO AI ACT v0.5.0 — Investigation & Learning Layer

Play now: <https://matteoangeloni-jpeg.github.io/-NO-AI-ACT/>

## 1. Overview

La v0.5.0 rafforza NO AI ACT come **serious game investigativo** e **strumento
didattico**. Non aggiunge nuovi casi: aggiunge un layer di **interpretazione,
debrief e conseguenze sistemiche** sopra i 7 casi esistenti. Nessun cambiamento
di gameplay o di logica di valutazione; compatibile con i salvataggi v0.4.

## 2. Main additions

- **Tassonomia tipizzata delle fragilità decisionali** (`DecisionIssueType`),
  derivata dalla logica di valutazione esistente.
- **Analisi della decisione** nel rapporto ispettivo.
- **Reperti più investigativi**: micro-tag di funzione (minimizza, prova
  decisiva, effetto concreto, contesto).
- **Fascicolo città**: effetti sistemici qualitativi.
- **Glossario operativo** consultabile dall'archivio.
- **Schede didattiche per caso** (tutti i 7 casi).
- **Export docente migliorato** (locale).
- **Fix favicon**: pagina di produzione più pulita (rimosso il 404 benigno).

## 3. Gameplay impact

- Il giocatore non riceve solo un esito, ma una **spiegazione** della fragilità o
  della solidità della decisione (soggetto, motivazione, prove, proporzionalità…).
- I reperti sono più leggibili come **prove, fonti e contraddizioni**.
- Il **fascicolo città** mostra effetti sistemici (fiducia, diritti, opacità,
  contenzioso, efficienza) come **tendenze**, non come punteggio arcade.

## 4. Teaching / debrief impact

- Docenti e formatori possono usare **schede didattiche**, **glossario**, **domande
  di discussione** ed **export locale**.
- La **modalità docente resta locale**: nessun account, nessuna classe, nessun
  server. Solo un debrief sul dispositivo.

## 5. Privacy and data

- Nessun backend.
- Nessun account.
- Nessun tracciamento remoto attivo di default.
- Nessun dato personale richiesto.
- Export locale e anonimo.

## 6. Technical validation

- `npm run typecheck`: verde.
- `npm test`: **138 test**.
- `npm run build`: verde.
- Smoke headless (Chromium reale) eseguita sulla PR #7 e verificata visivamente.
- Deploy GitHub Pages: verde.
- Favicon 404 risolto con la PR #8.

## 7. Known limitations

- Ottimizzato per desktop / tablet in orizzontale.
- Su smartphone in portrait compare la mobile guard.
- Rendering su canvas: non pienamente compatibile con screen reader.
- Contenuto didattico semplificato.
- **Non è consulenza legale.**
- Review giuridica terza raccomandata per un uso pubblico/istituzionale formale.

## 8. Upgrade notes

- Nessuna migrazione manuale richiesta.
- I salvataggi locali v0.4 restano compatibili.
- Il fascicolo città è **derivato** dai report: nessun nuovo dato personale,
  nessun nuovo campo persistito.

## 9. Credits / license

Vedi [`CREDITS.md`](../CREDITS.md), [`LICENSE`](../LICENSE),
[`THIRD_PARTY_LICENSES.md`](../THIRD_PARTY_LICENSES.md) e
[`ASSET_REGISTER.md`](../ASSET_REGISTER.md). Codice: MIT · contenuti narrativi e
didattici: CC BY 4.0.
