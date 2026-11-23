# NO AI ACT · v5.4.0

[Italiano](README.md) · [English](README.en.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Español](README.es.md) · [Português](README.pt.md) · [Nederlands](README.nl.md)

**Serious game investigativo sull’AI Act europeo**

[▶ Gioca](https://www.no-ai-act.eu/play/?lang=it) · [Sito e risorse](https://www.no-ai-act.eu/) · [Versione stabile](https://github.com/matteoangeloni-jpeg/-NO-AI-ACT/releases/tag/v5.4.0)

Anno 2032, in una città europea immaginaria in cui l’AI Act non è mai entrato in vigore. Nel ruolo di ispettore, ricostruisci l’impiego di sistemi di IA attraverso documenti, testimonianze e registri. Il gioco è gratuito, open source e utilizzabile nel browser senza account.

## Copertura

Le stesse lingue coprono gioco, sito, risorse educative, press kit, README e dossier metodologico: italiano, inglese, francese, tedesco, spagnolo, portoghese europeo (pt-PT) e olandese. Ogni lingua comprende tutti i 14 casi e le stesse 37 sezioni del portale. Le URL esistenti sono conservate.

## Il percorso di gioco

- Indaga: apri i reperti, valuta la provenienza, cita le prove e confronta le fonti. Decidi classificazione, misura, responsabilità e motivazione; firma il rapporto e discuti conseguenze e limiti.
- Il percorso guidato integra comprensione, ipotesi, investigazione, argomentazione autonoma prima del feedback, debriefing e riflessione su un nuovo caso. Puoi tornare alle prove e motivare revisioni; la scrittura resta facoltativa.
- Quattro modalità sugli stessi casi: Turno di servizio, Indagine libera, Ispezione a sorpresa e Ripasso dei casi chiusi con errori. La durata scelta è un budget indicativo.
- La modalità docente offre guida e materiali per il debriefing locale. Attività, tre piani di lezione, glossario e approfondimenti sostengono la preparazione e la discussione.
- Comandi da tastiera, livello di lettura accessibile, regolazione di audio, testo e movimento. I salvataggi v2 e la migrazione da v1 conservano la compatibilità.

## Metodo e limiti

CEPAJe e LM–GM collegano contesto, mediazione, azioni ed evidenze osservabili. Il dossier contiene matrici, rubrica preliminare e specifica di trasferimento. I feedback di Julian Alvarez e Federica Pelizzari sono fonti di riprogettazione, senza attribuire endorsement o validazione. Punteggio e successo nel gioco non dimostrano apprendimento o pensiero critico; nessuno scoring automatico del pensiero critico. La simulazione semplifica il diritto, non offre consulenza legale o certificazioni.

[Metodo e limiti](docs/v5/README.md) · [Metodologia, feedback, CEPAJe e LM–GM](docs/v5/METHODOLOGY.md) · [Matrice giuridica dei 14 casi](docs/v5/LEGAL_LEARNING_MATRIX.md)

## Dati e privacy

I progressi restano nel browser. I contatori aggregati sono disattivabili. Solo i maggiorenni possono acconsentire a un registro pseudonimo della sessione per 90 giorni; l’invio dei testi del percorso guidato richiede un ulteriore consenso, inizialmente non selezionato. Revoca, cancellazione ed export sono disponibili nella barra del gioco. DNT/GPC sono rispettati. Nessun account, profilo pubblicitario o collegamento tra visite. Il collector di produzione è telemetry.no-ai-act.eu; le precedenti API restano compatibili con ricevute ed esportazioni esistenti.

[Dati e privacy](https://www.no-ai-act.eu/game-statistics.html#it) · [Contratto attuale del registro di sessione](docs/v5/SESSION_JOURNAL.md)

## Materiali di ricerca

Study 02 è un laboratorio locale separato dalla build pubblica, con due forme e rubrica umana nelle sette lingue. Non attiva una ricerca con partecipanti. Equivalenza linguistica, validità della rubrica ed efficacia educativa richiedono ancora valutazione con persone. I risultati di verifica nel dossier sono registrazioni storiche.

[Rubrica e prova di trasferimento Study 02](docs/v5/ARGUMENTATION_STUDY02.md) · [Study 02](research/study02/)

## Sviluppo locale

Node.js 22+ · TypeScript · Phaser 3 · Vite.

```sh
npm ci
npm run dev
# http://localhost:5173/play/?lang=it
npm run site:generate
npm run build
npm run study02:local
# http://127.0.0.1:4262/
```

## Autore

Matteo Angeloni: ideazione, game design, sviluppo e contenuti educativi. Dottorando presso l’Università della Tuscia; progetto indipendente, senza approvazione istituzionale implicita. Realizzato con l’aiuto dell’IA, sotto responsabilità editoriale umana.

[Matteo Angeloni](https://www.no-ai-act.eu/matteo-angeloni/)

## Licenze

Codice GPL-3.0-or-later; contenuti CC BY-SA 4.0. Consultare LICENSE, CREDITS e THIRD_PARTY_LICENSES per attribuzioni e componenti. I titoli delle fonti e degli articoli stampa restano nella lingua originale.

[LICENSE](LICENSE) · [CREDITS](CREDITS.md) · [THIRD_PARTY_LICENSES](THIRD_PARTY_LICENSES.md)

## Documentazione tecnica e storico

[Versione stabile](docs/RELEASE_NOTES_v5.4.0.md) · [Metodo e limiti](docs/v5/README.md) · [Press kit](https://www.no-ai-act.eu/press-kit/) · [GDD](docs/GDD.md) · [README < v5.3.0](docs/archive/README_pre_v5.3.0.it.md)
