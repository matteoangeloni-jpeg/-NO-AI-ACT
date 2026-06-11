# GAME DESIGN DOCUMENT — NO AI ACT
*Simulatore di una società non regolata · v0.1 (vertical slice)*

## 1. Pitch
2032: in una città europea alternativa l'AI Act non è mai entrato in vigore.
Il giocatore è un Ispettore per gli Incidenti Algoritmici: indaga catastrofi
plausibili causate da IA non regolata, classifica i sistemi secondo la
piramide del rischio e impone misure. Ogni caso chiuso sblocca la norma che
avrebbe prevenuto il danno. Non è un quiz: è un'indagine con conseguenze.

## 2. Target
14+, scuole superiori, università, formazione professionale, cittadinanza
digitale. Sessione completa: 20–30 minuti. Browser desktop (mobile in roadmap).

## 3. Core loop
catastrofe → fascicolo → indizi (reperti) → classificazione del rischio →
misura correttiva → conseguenza narrativa → carta AI Act → aggiornamento
indicatori della città → (dopo 4 casi) finale.

## 4. Meccaniche
- **Esame reperti**: tre indizi sigillati per caso, da aprire tutti prima di decidere.
- **Decisione in due passi**: classificazione (5 opzioni) poi misura (7 opzioni).
- **Valutazione a tre livelli**: corretta / parziale / non conforme
  (vedi `CaseSystem.evaluateDecision`: classificazioni "adiacenti" con misura
  giusta valgono parziale; bloccare un sistema correttamente classificato come
  alto rischio è eccesso di cautela → parziale; negare il problema è sempre
  errore).
- **Collezione**: 6 carte norma consultabili nell'Archivio.

## 5. Indicatori
Efficienza 70 · Controllo sociale 40 · Diritti fondamentali 70 · Fiducia
pubblica 65 (range 0–100, sempre visibili, animati, con micro-commento).
Corretta: diritti +10, fiducia +8, controllo −6, efficienza −3.
Parziale: diritti +4, fiducia +2, controllo −2.
Sbagliata: efficienza +6, controllo +10, diritti −10, fiducia −8.

## 6. Progressione
4 casi giocabili (6 luoghi sulla mappa; 2 bloccati "v0.2"). Stato persistito
in localStorage. Dopo 4 fascicoli chiusi si sblocca il Rapporto Finale.

## 7. Sistema di scelta e punteggio
Nessun punteggio numerico esplicito oltre agli indicatori: il "punteggio" è lo
stato della città. La qualità delle decisioni determina il finale.

## 8. Casi
1. Municipio — *La città dei punteggi* (social scoring, art. 5) — vietata/blocco
2. Agenzia del Lavoro — *Il colloquio che non esiste* (Allegato III) — alto rischio/audit+oversight+dati
3. Media Center — *La città sintetica* (art. 50) — trasparenza/etichettare+informare
4. Scuola — *La classe osservata* (emotion recognition, art. 5) — vietata/blocco
5. Ospedale — *Triage invisibile* (obblighi alto rischio) — v0.2
6. Sorveglianza — *Volti nella folla* (biometria, art. 5) — v0.2

## 9. Finali
- **Città opaca**: diritti < 40 o fiducia < 40.
- **Innovazione governata**: diritti ≥ 60 e fiducia ≥ 60.
- **Governance fragile**: altrimenti.
Messaggio obbligatorio: "L'AI Act non elimina il rischio. Rende il rischio
visibile, documentabile, contestabile e governabile."

## 10. UI flow
Boot → Preload → Title → Briefing → CityMap ⇄ (Case → Evidence → Decision →
Consequence → NormCard) → Finale. Da Title/CityMap/Finale: Archive, Credits.
ESC torna sempre indietro; click salta i typewriter.

## 11. Art direction
Distopia amministrativa: Kafka + centro di controllo + brutalismo digitale.
Palette: blu notte #0a1020, grigio ferro #4a5260, nero carbone #07090f, bianco
sporco #d8d6cd, rosso alert #d23b3b, giallo warning #d9a521, verde #3fa66a
riservato alle decisioni corrette, blu #5d7fb8 per focus/hover.
Tipografia monospace istituzionale. Angoli quasi vivi (radius 2px), pannelli
con tacche da fascicolo, scanline CRT disattivabile. Niente cyberpunk
estetizzante, niente cartoon.

## 12. Asset
100% procedurali (vedi ASSET_REGISTER.md): mappa canvas con PRNG
deterministico, 9 icone a tratti, texture rumore, carta dossier, audio
sintetizzato (click/alert/errore/conferma/unlock/terminale/drone).

## 13. Architettura tecnica
Vite + TS strict + Phaser 3. Dati di gioco tipati e separati dalla logica
(`data/`), logica pura testabile senza Phaser (`CaseSystem`, `indicators`,
`endings`), stato centralizzato (`StateManager` + `SaveSystem`), UI a
componenti (`ui/`), scene sottili.

## 14. Rischi
- Sovraesposizione testuale → mitigata con typewriter saltabile e testi brevi.
- Percezione "quiz" → mitigata con reperti, conseguenze narrative e indicatori.
- Accuratezza giuridica → testi marcati "versione didattica semplificata",
  revisione legale prevista in 1.0.
- Bilanciamento: con 4 casi tutti corretti si arriva a diritti 100/fiducia 97;
  tutti sbagliati: diritti 30/fiducia 33 → Città opaca. Tarato perché 2 errori
  su 4 producano "Governance fragile".

## 15. Roadmap
0.2 sei casi + bilanciamento · 0.3 modalità docente + debriefing + PDF ·
0.4 IT/EN + PWA + desktop (Tauri) · 1.0 playtest + revisione giuridica +
asset originali + pubblicazione.
