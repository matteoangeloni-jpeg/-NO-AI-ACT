# Francese: consegna per revisione, non pubblicazione

Data: 13 ottobre 2026. Base verificata: `9ad8b31`, preceduta da `3c7e344`.
Ramo: `codex/complete-french-v4`. Cartella separata: `../no-ai-act-fr`.
La modifica preesistente allo smoke visivo nella copia `../no-ai-act` non e stata
toccata. Nessun merge, tag, push o deploy eseguito in questo lavoro.

## Risultato editoriale

- Inventario reale: 33 IT, 37 EN, 13 FR alla partenza. Non esistevano soltanto
  20 pagine mancanti: oltre alle 20 coppie IT/EN, quattro pagine EN non avevano
  equivalente italiano. Sono state aggiunte tutte e 24, per **37 FR e 107 URL**.
- Le 24 pagine nuove traducono tutti i blocchi del contenuto principale inglese,
  conservando sezioni, liste, tabelle, immagini e collegamenti bibliografici.
  Controlli su hash della fonte, numero dei blocchi e testo scoperto impediscono
  rigenerazioni silenziose quando cambia la fonte.
- Le 13 pagine francesi precedenti restano le versioni sintetiche create da
  Claude, non traduzioni integrali dell'inglese. Sono state aggiornate navigazione,
  autore nel footer e favicon; corretto il refuso `devinei`. La copertura delle
  rotte e completa, la parita editoriale delle prime 13 non viene dichiarata.
- I contenuti principali delle 70 pagine IT/EN risultano identici alla base
  `9ad8b31`, confrontati attraverso il parser HTML. Aggiunti soltanto gli
  alternate francesi dove mancavano; sitemap e inventari aggiornati.
- Screenshot, ZIP e copertine del press kit restano gli asset esistenti:
  le immagini non sono nuove catture dell'interfaccia francese. La pagina lo
  chiarisce; i file scaricabili conservano la loro lingua originale.

## Modifiche funzionali

- `src/site/fr/*.json`: 24 traduzioni complete dei blocchi principali.
- `scripts/site/translation-blocks.mjs`, `fr-translations.mjs`: parsing HTML,
  controllo copertura e aggiornamento dei collegamenti mantenendo query e anchor.
- `scripts/site/sync-fr-inventory.mjs`, `build-fr-pages.mjs`: generazione pagine,
  navigazione, SEO e collegamenti reciproci. Le quattro coppie EN/FR usano EN
  come x-default, senza inventare un equivalente italiano.
- Inventario consumato da Vite, verify-dist, audit SEO, site-insight e test.
  Corretto anche il conteggio dei collegamenti con percorsi assoluti `/fr/.../`.
- `ReadingLayer.ts`: aggiornamento del pulsante lettura e del lang del documento
  alla pubblicazione dei contenuti di scena, anche dopo caricamento lingua salvata.
- `mobileGuard.ts`: accetta tutte le lingue del registro, incluso FR, senza una
  lista parallela IT/EN. Nessun cambiamento a punteggi, casi o schema salvataggi.
- Nuovo smoke FR su pagine e persistenza; due percorsi FR aggiunti allo smoke
  del linguaggio visivo. Screenshot facoltativi nella diagnosi di un caso.
- Galleria stampa: `height: auto` elimina l'altezza HTML fissa di 1080px nelle
  miniature responsive. Correzione di stile condivisa IT/EN/FR, senza modifica
  editoriale. Lo smoke FR controlla ora anche le proporzioni delle immagini.

L'elenco preciso dei percorsi e in `FR_CHANGED_FILES.txt`; le rotte con metadati
sono in `SEO_ROUTE_INVENTORY.csv` e `scripts/seo/routes.config.json`.

## Verifiche

| Controllo | Esito osservato |
| --- | --- |
| Typecheck | PASS |
| Unitari | 1.251 PASS su 76 file, inclusi 6 nuovi test |
| Dizionario | 1.408 stringhe FR, chiavi e segnaposto corrispondenti a IT; 14 casi e 14 norme |
| Audit SEO | 107 rotte, zero difetti critici e zero avvisi |
| Build | PASS, con avviso preesistente sulla dimensione del bundle di gioco |
| Verify dist | 107/107 pagine pubbliche presenti; 108 HTML includendo il gioco |
| Prova negativa dist | Rimozione temporanea di `fr/faq/index.html`: rifiuto con exit 1, file ripristinato |
| Regressione IT/EN | Contenuti principali invariati su 70 pagine |
| Galleria stampa finale | 10 immagini in IT/EN/FR a 390 e 1440px: 60 proporzioni corrette; smoke stampa IT/EN PASS dopo la correzione CSS |
| Prima suite browser | 10/10 PASS, prima delle due correzioni a11y rilevate nel controllo visivo |
| Ripetizione browser | 9/10 PASS nel lancio completo; il solo smoke visivo non riconosceva il pulsante FR. Corretto il selettore, ripetuto separatamente: 8/8 scenari IT/EN/FR PASS |
| Smoke dedicato FR | 74 verifiche pagina (37 desktop e 37 mobile), menu a 390/1920/3840px, persistenza FR, reading layer e avviso mobile: PASS |
| Partite mirate FR | `case_bias` e `case_media`: percorsi fino alla norma, incluso incidente per `case_media`, zero errori console |
| Audit metadata GitHub | Non eseguito: script saltato per assenza di GITHUB_TOKEN |

La suite completa non e stata rilanciata una terza volta: sono stati ripetuti
il controllo visivo corretto, lo smoke stampa dopo il CSS e quello dedicato FR.
Un tentativo FR con catture browser simultanee e terminato per timeout screenshot
4K, non considerato PASS; ripetuto da solo sulla build finale: PASS. Il bundle del gioco e rimasto
`play-DjIISt-3.js` dopo la correzione del solo CSS della galleria.
Non e stato svolto un nuovo playthrough umano di tutti e 14 i casi,
ne una certificazione WCAG o una prova con uno screen reader assistivo reale.

## Revisione normativa e limiti

I quattro punti FR-01..FR-04 sono ricontrollati e documentati in
`GLOSSAIRE_FR.md`, con le fonti EUR-Lex. Sono confermati titoli delle annexes,
numerazione b bis/b ter, formula dell'analisi dei diritti e terminologia dei
plafondi. I risultati indicizzati sono consultabili; l'apertura diretta dei PDF
ha incontrato la verifica JavaScript, quindi non si dichiara lettura integrale
del consolidato o approvazione giuridica indipendente.

Correzioni/precisazioni circoscritte nelle nuove traduzioni:
1. Articolo 75: il punto 2 dell'annexe III riguarda infrastrutture critiche,
   non biometria. Correzione documentata, non modifica del numero del rinvio.
2. Avvertimenti e misure non monetarie non sono presentati come inventati nel
   2026: erano gia possibili nel testo 2024. Segnalare le fonti IT/EN per revisione.
3. Modello FRIA non pubblicato: affermazione della fonte settembre 2026, da
   ricontrollare al momento dell'uso, non fatto certificato a ottobre.
4. Articolo 50(4): la posizione metodologica del progetto non equivale a una
   certificazione dell'esenzione. Dati biometrici RGPD: specificata la finalita
   di identificazione univoca. Le date di revisione della fonte sono conservate.

Resta una revisione giuridica/editoriale umana prima della pubblicazione. Rimane
anche un advisory npm high preesistente, `source-map-js <1.2.2`
(`GHSA-68fv-2mgg-jv7q`), nella catena di sviluppo: non aggiornato incidentalmente
nel lavoro di traduzione. Nessun nuovo provider o flusso di telemetria attivato.

## Come riprodurre

Usare Node 24 LTS; il Node 23 presente nel sistema non rientra nel requisito
dichiarato da Vitest 5. Dalla cartella del ramo:

```powershell
npm ci
npm run site:fr
node scripts/seo/update-sitemap-lastmod.mjs
npm run typecheck
npm test
npm run audit:seo
npm run build
npm run verify:dist
npm run smoke:all
npm run smoke:fr
npm run preview -- --port 4212 --strictPort
```

Aprire `http://localhost:4212/fr/` e `http://localhost:4212/play/?lang=fr`.
Gli smoke gestiscono autonomamente i server 4200 e 4211: le porte devono essere
libere. Le immagini FR stanno in `artifacts/french-localization/`, i rilievi
di gioco in `scripts/smoke/out/visual/`. Questi artefatti locali sono ignorati
da Git e rigenerabili. Il report della suite finale e `.diag/final-smoke.log`.

## Prossimi sprint

- `SPRINT_GAMEPLAY_4_0.md`: osservazione delle quattro modalita esistenti,
  tutorial situato, chiarezza delle decisioni, conseguenze e debrief; nessuna
  nuova modalita prima di aver verificato il problema con giocatori reali.
- `SPRINT_ANALYTICS_4_0.md`: mappa delle emissioni esistenti, enum e filtri piu
  rigorosi, eventi mancanti, aggregati e dashboard su fixture. Attivazione
  remota esclusa fino a revisione privacy, infrastruttura e approvazione.
