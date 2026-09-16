# Campioni audio

Qui vanno i 16 file audio del gioco.

Questa cartella NON è `public/`, ed è una scelta. Vite guarda dentro qui in
fase di build e sa esattamente quali file esistono: manda in `dist/` solo
quelli e dice al gioco i loro indirizzi. Da `public/` non potrebbe saperlo,
e il gioco dovrebbe chiedere tutti e sedici i file a scatola chiusa —
riempiendo la console di errori di rete per ogni campione non ancora
copiato. Così invece un file che manca semplicemente non esiste: nessuna
richiesta, nessun errore, e il suono sintetizzato al suo posto.

I nomi non sono liberi. Sono quelli, e sono scritti una volta sola in
`src/game/systems/audioAssets.ts`. Nessun altro file del progetto nomina
un campione: le scene chiedono un ruolo musicale o un gesto, mai un file.

## Musiche (in loop)

| file | quando suona |
|---|---|
| `music_menu_directive.mp3` | titolo, preload, menu |
| `music_archive_loop.mp3` | mappa civica, fascicolo, reperti |
| `music_decision_audit.mp3` | classificazione, misura, soggetto, motivazione |
| `music_debrief_report.mp3` | rapporto, conseguenza, fine turno |
| `music_high_tension_incident.mp3` | casi gravi, sistema opaco, incidenti critici |
| `music_classroom_discussion.mp3` | modalità docente, pause di discussione |

## Effetti

| file | gesto |
|---|---|
| `sfx_open_case.mp3` | apertura fascicolo |
| `sfx_open_legal_archive.mp3` | apertura norma, archivio legale |
| `sfx_cite_evidence.mp3` | citazione di un reperto |
| `sfx_register_decision.mp3` | decisione registrata, deposito rapporto |
| `sfx_can_proceed.mp3` | requisiti minimi completati |
| `sfx_stamp_conforme.mp3` | esito conforme |
| `sfx_error_contestable.mp3` | esito contestabile, scelta errata |
| `sfx_glitch_opacity.mp3` | sistema opaco, contraddizione, anomalia |
| `sfx_ui_hover.mp3` | hover e fuoco sui pulsanti |
| `sfx_ui_click.mp3` | click e conferma generica |

## Se un file manca

Non succede niente di rotto. Il gioco prova a caricarlo, non lo trova, e
usa il suono procedurale che il progetto ha sempre avuto. Nessun errore in
console, nessun silenzio: solo la versione sintetizzata di quel segnale.
Questo vale anche in produzione, quindi un file caricato male degrada
invece di far tacere il gioco.

## Provenienza

Il progetto è tutto materiale originale dell'autore, con l'unica eccezione
del motore Phaser (MIT), dichiarata in `THIRD_PARTY_LICENSES.md`. Se questi
campioni non fossero interamente tuoi, vanno dichiarati in `CREDITS.md` con
la loro licenza prima di pubblicarli, perché il sito è distribuito sotto
GPL-3.0-or-later e CC BY-SA 4.0.
