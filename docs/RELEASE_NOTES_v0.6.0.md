# NO AI ACT v0.6.0 — Advanced Case Pack

Play now: <https://matteoangeloni-jpeg.github.io/-NO-AI-ACT/>

## 1. Overview

La v0.6.0 amplia NO AI ACT con **4 nuovi casi avanzati**: il gioco passa da **7 a
11 casi**. La release **non introduce backend, account o dashboard** e **estende
il layer v0.5** (Investigation & Learning Layer) senza cambiare il modello
privacy-by-design. Nessuna modifica di gameplay o di logica di valutazione.

## 2. New cases

- **Chatbot pubblico — "Lo sportello che risponde sempre"**: un assistente
  automatico comunale informa i cittadini. Nodo: trasparenza, affidamento, canale
  umano, responsabilità del deployer (art. 50).
- **Procurement AI — "La gara opaca"**: acquisto pubblico di un sistema senza
  documentazione né governance. Nodo: documentazione, accountability, lock-in.
- **Piattaforma educativa adattiva — "La classe profilata"**: profila gli
  studenti e orienta decisioni didattiche. Nodo: alto rischio (Allegato III),
  controllo umano effettivo, minimizzazione, spiegabilità.
- **GPAI / modello generativo — "Il modello tuttofare"**: un modello generale
  entra in processi decisionali interni. Nodo: uso a valle, verifica output,
  governance, responsabilità del deployer.

## 3. Gameplay impact

- Più scenari **ambigui e contestuali**.
- Maggiore attenzione a **contesto d'uso, responsabilità del deployer,
  supervisione umana effettiva, documentazione e contestabilità**.
- Il giocatore affronta sistemi **non necessariamente vietati, ma da governare**.

## 4. Teaching / debrief impact

- Nuove **learning card** per i 4 casi.
- Nuove **domande di discussione**.
- Nuove **voci di glossario**.
- Nuovo **percorso "Casi avanzati"**.
- **Export docente** locale aggiornato ai nuovi casi.

## 5. Legal / didactic framing

- Non ogni **chatbot pubblico** è vietato.
- Non ogni **GPAI** è automaticamente alto rischio o vietato.
- Non ogni **piattaforma educativa** è vietata.
- Non ogni **acquisto AI** è illegittimo.
- Il criterio centrale è il **contesto d'uso** e l'**effetto concreto sui diritti**.
- **Disclaimer** e **controllo umano formale** non bastano.
- Il **vendor** non assorbe automaticamente tutta la responsabilità.

## 6. Privacy and data

- Nessun backend.
- Nessun account.
- Nessuna dashboard classe.
- Nessuna raccolta remota di dati.
- Modalità docente locale.
- Export locale e anonimo.
- Analytics remoti off di default.

## 7. Technical validation

- package version `0.6.0`.
- `npm run typecheck`: verde.
- `npm test`: **148 test**.
- `npm run build`: verde.
- Smoke headless (Chromium reale) eseguita sulla PR #10 e verificata visivamente.
- Deploy GitHub Pages: verde.

## 8. Known limitations

- Ottimizzato per desktop / tablet in orizzontale.
- Su smartphone in portrait compare la mobile guard.
- Rendering su canvas: non pienamente compatibile con screen reader.
- Mappa con 11 marker più densa; evoluzione futura possibile con zone/capitoli.
- Contenuto didattico semplificato.
- **Non è consulenza legale.**
- Review giuridica terza raccomandata per un uso pubblico/istituzionale formale.

## 9. Upgrade notes

- Nessuna migrazione manuale richiesta.
- I salvataggi locali v0.5 restano compatibili.
- Nessun nuovo dato personale.
- I nuovi casi sono accessibili come contenuti aggiuntivi (nessun caso bloccato).

## 10. Credits / license

Vedi [`CREDITS.md`](../CREDITS.md), [`LICENSE`](../LICENSE),
[`THIRD_PARTY_LICENSES.md`](../THIRD_PARTY_LICENSES.md) e
[`ASSET_REGISTER.md`](../ASSET_REGISTER.md). Codice: MIT · contenuti narrativi e
didattici: CC BY 4.0.
