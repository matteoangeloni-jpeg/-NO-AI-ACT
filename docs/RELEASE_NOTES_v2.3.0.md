# NO AI ACT — v2.3.0 press candidate

Data della candidata: 17 settembre 2026. Il tag `v2.3.0` non è ancora
pubblicato; l'ultima release GitHub verificata resta `v2.2.0`.

## In breve

La 2.3 rende l'indagine più continua e meno simile a una sequenza di schermate.
Fascicolo, confronto delle prove, norma, archivio e taccuino vivono ora in una
postazione ispettiva condivisa fra l'esame dei reperti e la redazione dell'atto.
Il sito aggiunge sei guide IT/EN ad alta intenzione e il press kit riceve una
galleria di screenshot reali in Full HD.

## Inspector Desk

- Barra persistente con fascicolo, stato dei reperti e strumenti disponibili.
- Confronto read-only di tutte le coppie di prove citate, accessibile sia
  durante l'esame sia durante la decisione.
- Provenienza, funzione, titolo e contenuto dei due documenti sono visibili
  nello stesso pannello.
- Taccuino consultabile senza abbandonare il caso.
- Scorciatoie `X` per il confronto e `N` per il taccuino.
- Focus tastiera isolato nel pannello aperto e contenuto sincronizzato con lo
  strato di lettura semantico.
- Nessuna modifica a salvataggi, scoring, casi o matrice legale.

## SEO e guide operative

Nuove coppie di pagine:

- `/provider-deployer-ai-act/` e `/en/provider-deployer-ai-act/`;
- `/ai-act-pubblica-amministrazione/` e
  `/en/ai-act-public-administration/`;
- `/fria-ai-act-valutazione-diritti-fondamentali/` e
  `/en/fria-ai-act-fundamental-rights-impact-assessment/`.

Le pagine distinguono ruoli e perimetri senza presentarsi come consulenza.
Rimandano al testo ufficiale su EUR-Lex, alle risorse della Commissione e,
per il procurement pubblico italiano, ai documenti istituzionali AgID con il
loro stato esplicitato. Gli URL pubblici passano da 56 a 62: 29 IT e 33 EN.

## Pacchetto stampa

- Galleria di dieci screenshot 1920x1080 ricavati dalla build candidata.
- Due immagini mostrano il nuovo confronto fra reperti.
- Archivio ZIP pronto per le redazioni, con licenza stampa CC BY 4.0 e credito
  “NO AI ACT — Matteo Angeloni”.
- Descrizioni e factsheet aggiornati alla 2.3 candidata.

## Verifiche automatiche

- TypeScript strict.
- Suite Vitest completa.
- Build multipagina e verifica dell'artefatto distribuito.
- Audit SEO su tutti i 62 URL.
- Smoke completo di gameplay, tastiera, privacy, layout, audio, action layer,
  Inspector Desk e linguaggio visivo.
- Screenshot Full HD e controllo della risoluzione interna del canvas.

## Cosa resta prima del tag

- Tornata A con cinque nuovi giocatori, senza aiuto esterno.
- Correzione degli attriti osservati.
- Tornata B con un autore videoludico, un game designer, un formatore e una
  persona competente in AI Act o amministrazione pubblica.
- Verifica live dopo il deploy e controllo che press kit e build coincidano.
- Esecuzione delle due tornate descritte in
  `docs/PRESS_PLAYTEST_PROTOCOL_v2.3.md` e registrazione anonima dei risultati.

Finché questi passaggi non sono documentati, la 2.3 resta una candidata e non
viene descritta come versione press-ready definitiva.
