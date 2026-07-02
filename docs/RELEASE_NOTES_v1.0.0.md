# NO AI ACT v1.0.0 — Prima release pubblica stabile

Play now: <https://www.no-ai-act.eu/play/>
Landing IT: <https://www.no-ai-act.eu/> · Landing EN: <https://www.no-ai-act.eu/en/>

Data di rilascio: 1 luglio 2026.

## 1. Overview

La v1.0.0 è la **prima release pubblica stabile** di NO AI ACT: un serious game
investigativo, gratuito e open source, sull'AI Act europeo (Reg. UE 2024/1689).
Il giocatore veste i panni di un ispettore: apre il fascicolo di un sistema di
intelligenza artificiale, esamina i reperti, cita le prove e redige un rapporto
ispettivo che ne classifica il rischio.

La 1.0 **non introduce nuovi contenuti di gioco**: consolida gli 11 casi della
v0.6 in una versione stabilizzata, documentata e pubblicata per l'uso didattico.
È una release di **stabilizzazione e pubblicazione**, non una validazione
empirica dell'efficacia didattica.

## 2. Cosa contiene la 1.0

- **11 casi giocabili** (7 base + 4 avanzati), dai più netti ai volutamente
  ambigui: social scoring, selezione del personale, contenuti sintetici,
  scuola, sanità, biometria, welfare, chatbot pubblico, procurement,
  EdTech adattiva, GPAI.
- **Italiano e inglese** completi (interfaccia, casi, norme, glossario,
  learning card, landing).
- **Percorsi/missioni** di durata variabile (~10–15 min demo, ~60–90 min
  percorsi completi), 3 livelli di difficoltà.
- **Modalità docente locale** con debrief ed export anonimo (`.txt`/`.json`).
- **Archivio norme** (11 disposizioni in versione didattica semplificata),
  glossario operativo, debrief della decisione post-rapporto.

## 3. Novità rispetto alla v0.6.0

- **Landing pubblica IT/EN rinnovata** (SEO/content pack): nuove sezioni
  "Perché esiste NO AI ACT", "Un serious game, non un quiz", "Prime reazioni"
  (in forma aggregata, senza testimonial nominativi), FAQ ampliate a 12
  domande, screenshot reale della mappa di gioco, micro-animazioni sobrie che
  rispettano `prefers-reduced-motion`.
- **Visual bug pass pre-release** su segnalazione da playthrough manuale:
  - archivio norme **scrollabile**: tutte le 11 norme sono raggiungibili
    (prima le ultime 5 finivano fuori schermo — blocker risolto);
  - bottoni di navigazione nascosti correttamente mentre un overlay di
    consultazione è aperto (Evidence/Decision);
  - il toast "reperti esaminati" non copre più l'intestazione del fascicolo;
  - il pannello dell'evento imprevisto contiene tutte e 3 le opzioni.
- **274 test automatici** (da 148 della v0.6), inclusi test strutturali che
  vincolano gli overlay a restare read-only e i fix visivi a non toccare
  scoring, casi, norme, salvataggi e form Tally.
- **Versioning e documentazione di release** (queste note, README, llms.txt).

## 4. Cosa NON è cambiato

- **Gameplay, scoring, casi, norme, salvataggi**: invariati rispetto alla
  v0.6 (i salvataggi esistenti restano compatibili).
- **Privacy-by-design**: nessun backend, nessun account, nessuna raccolta di
  dati personali nel gioco; progressi solo in `localStorage`; analytics di
  gioco **off** di default; le pagine pubbliche usano Cloudflare Web Analytics
  aggregato e privacy-friendly.
- **Form Tally** (feedback volontario, esterni e separati dal gameplay):
  ID invariati — IT pre-game `44ENVA`, EN pre-game `5BryXb`,
  IT post-game `dWgB5y`, EN post-game `ZjWp9A`.

## 5. Inquadramento legale e didattico

- NO AI ACT è una **simulazione didattica semplificata**: non è consulenza
  legale, non è una fonte ufficiale, non è uno strumento di compliance né di
  certificazione.
- Il criterio centrale insegnato è il **contesto d'uso** e l'**effetto
  concreto sui diritti**, non il divieto generalizzato: non ogni chatbot,
  GPAI, piattaforma educativa o acquisto di AI è vietato.
- Per un uso istituzionale formale è raccomandata una **revisione giuridica
  terza**.
- Il titolo "NO AI ACT" indica la **premessa narrativa** (una società senza
  regole sull'IA), non una posizione contro il regolamento.

## 6. Limiti noti

- **Playtest esterno strutturato ancora da completare**: la 1.0 è una release
  pubblica stabile, non un prodotto validato empiricamente. Nessuna
  affermazione di efficacia didattica misurata.
- Ottimizzato per **desktop/tablet landscape**; smartphone in portrait mostra
  una guardia "ruota il dispositivo".
- Bundle Phaser ~411 KB gzip: accettabile per un gioco, non mobile-first.
- La spaziatura interna della scheda "Rivedi contesto" usa un offset fisso
  (difetto estetico minore, annotato per il post-1.0).
- FinaleScene raggiungibile dopo 4 casi completati; testata in QA con dati di
  prova, non in un playthrough umano completo di tutti gli 11 casi.

## 7. Backlog post-1.0 (non bloccante)

- Playtest esterno con 5–8 persone (protocollo già pronto in
  `docs/PLAYTEST_GUIDE.md`) e rifinitura conseguente.
- Revisione giuridica terza dei contenuti normativi.
- Organizzazione della mappa per zone/capitoli.
- Ottimizzazione bundle (code-splitting Phaser).
- Micro-polish spaziature overlay.

## 8. Ringraziamenti

Grazie alle persone che hanno provato le versioni pre-1.0 e segnalato problemi
e impressioni informali: il feedback aggregato ha orientato la landing e il
visual bug pass di questa release.
