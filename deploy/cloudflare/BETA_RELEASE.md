# Canale pubblico ritirato

Dal rilascio stabile **v5.2.2** si pubblica soltanto su [www.no-ai-act.eu](https://www.no-ai-act.eu/play/). La vecchia copia beta e la preview corrente servono un redirect alla produzione, conservando percorso e lingua. Il comando `npm run beta:publish` si interrompe prima di qualsiasi upload. Le utility di build restano disponibili per consultare lo storico locale.

## Compatibilità dei dati

Il collector della produzione usa `https://telemetry.no-ai-act.eu/collect` e `/collect/v3`. Il percorso tecnico precedente `https://beta.no-ai-act.eu/collect*` resta sul medesimo Worker, database e chiave: client già aperti, code e ricevute private conservano export e cancellazione. Non ospita un gioco beta. Il nome storico della risorsa Worker `no-ai-act-beta-usage` non indica un ambiente di prova.

Non eliminare il database, ruotare la chiave o cancellare deploy/tag storici per rimuovere il vecchio canale.

## Artefatto di ritiro

`deploy/cloudflare/retired-channel` contiene soltanto il redirect Pages. Sul progetto storico `no-ai-act-beta`, il ramo `beta` controlla il dominio pubblico; il ramo `main` controlla la precedente preview. Entrambi ricevono esclusivamente questo artefatto, mai `dist-beta`. Le URL immutabili delle distribuzioni precedenti restano nello storico tecnico.
