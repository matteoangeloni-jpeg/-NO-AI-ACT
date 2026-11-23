# Audit linguistico V5 — 23 novembre 2026

Audit locale sul ramo `codex/v5-localization-audit`, basato sulla produzione
stabile V5.2.2 (`911d9465bef34cc3d92aa476386204c50168e22a`). Le correzioni sono
implementate e verificate, **non pubblicate in produzione**. Non viene creata
una beta. Le evidenze grezze sono nel dossier locale
`outputs/V5_localization_audit_2026-11-23` del workspace.

## Disponibilità effettivamente verificata

| Lingua | Portale | Gioco | 14 casi | Onboarding | Debrief e rapporto | Risorse | SEO | Stato verificato |
|---|---|---|---|---|---|---|---|---|
| Italiano | 33 URL | Completo | 14/14 | Primo avvio, 5 passi e percorso V5 | Tutti i casi | Attività e introduzione | Verificato | 14 cicli + 14 percorsi guidati |
| English | 37 URL | Completo | 14/14 | Primo avvio, 5 passi e percorso V5 | Tutti i casi | Attività e introduzione | Verificato | 14 cicli + 14 percorsi guidati |
| Français | 37 URL | Completo | 14/14 | Primo avvio, 5 passi e percorso V5 | Tutti i casi | Attività e introduzione | Verificato | 14 cicli + 14 percorsi guidati |
| Deutsch | 16 URL | Completo | 14/14 | Primo avvio, 5 passi e percorso V5 | Tutti i casi | Attività e introduzione | Verificato | 14 cicli + 14 percorsi guidati |
| Español | 16 URL | Completo | 14/14 | Primo avvio, 5 passi e percorso V5 | Tutti i casi | Attività e introduzione | Verificato | 14 cicli + 14 percorsi guidati |
| Português europeu | 16 URL | Completo | 14/14 | Primo avvio, 5 passi e percorso V5 | Tutti i casi | Attività e introduzione | Verificato | 14 cicli + 14 percorsi guidati |

Per ciascuna lingua sono presenti 1.609 stringhe nei dizionari di interfaccia,
casi, norme, mediazioni, percorso guidato e informativa del registro:
14 fascicoli, 14 schede normative, 62 voci del percorso V5 e 14 gruppi di
supporti. Il numero di stringhe prova la presenza; i cicli browser verificano
separatamente l'esecuzione. Non è un indice della qualità linguistica.

Il portoghese usa `pt` nei salvataggi e come parametro canonico; `pt-PT` nei
documenti HTML, nei dialoghi e nei metadati. È verificato anche l'alias
`?lang=pt-PT`. Il gioco ha sei lingue complete: DE/ES/PT non sono lingue solo
editoriali. La profondità del portale rimane diversa, esplicitamente dichiarata.

| Ambito documentale | IT | EN | FR | DE | ES | PT |
|---|---|---|---|---|---|---|
| Dossier metodologico storico: sette documenti | Sì | Sì | Sì | No | No | No |
| Laboratorio indipendente Study 02 | Sì | Sì | Sì | No | No | No |
| Pagina pubblica ricerca/metodologia e profilo autore | Sì | Sì | Sì | Collegamento EN | Collegamento EN | Collegamento EN |
| Risorse introduttive, attività e press kit | Sì | Sì | Sì | Sì | Sì | Sì |

Restano **21 gruppi editoriali inglesi senza equivalente DE/ES/PT**, per
ciascuna lingua: tra questi dossier di ricerca, FAQ, citazioni, profilo autore,
approfondimenti su GDPR, FRIA, sanzioni e piani di lezione specialistici.
Il laboratorio e l'introduzione disponibili in DE/ES/PT non equivalgono alla
traduzione di ogni attività o lezione del catalogo inglese. I collegamenti
inglesi esistenti restano riconoscibili; il selettore offre soltanto pagine
equivalenti realmente presenti. La lista analitica è in `editorial-gaps.json`
nel dossier locale. Nessuna traduzione del gioco risulta mancante nei flussi
essenziali controllati.

## Incongruenze rilevate e correzioni implementate

| Problema | Correzione | Verifica |
|---|---|---|
| La rigenerazione FR sovrascriveva le lingue del gioco con IT/EN/FR | Rimossa la sovrascrittura; i generatori verificano il registro | Due rigenerazioni complete, registri preservati e 158 HTML identici |
| Elenchi runtime, portale e validatore mantenuti separatamente | Esteso il registro esistente e usato dalle parti dipendenti | Uguaglianza delle lingue e dei contenuti verificata automaticamente |
| Test principali limitati a tre lingue e regex dei pulsanti IT/EN/FR | Catalogo centrale ed etichette lette dai dizionari | 84 cicli investigativi e 88 percorsi guidati |
| Etichetta inglese «PhD Student» nei crediti francesi | «Doctorant», conservando il nome ufficiale dell'ateneo | Controllo delle frasi copiate e del dizionario FR |
| Dialogo guidato portoghese marcato `pt`, a differenza del documento | Tag `pt-PT` condiviso | Test unitario e dialoghi browser |
| 36 pagine senza lingua nel JSON-LD | Aggiunti metadati WebPage o localizzata la proprietà del tipo esistente | Audit di tutti i 155 documenti e verifica del dist |
| Descrizioni Organization in inglese nelle pagine di altre lingue | Descrizioni localizzate dal sincronizzatore dei metadati | Sincronizzazione riproducibile e controlli SEO |
| Descrizioni stampa che parlavano di una «nuova beta» | Riferimento alla data del filmato e alle versioni 4 e 5 | Sei uscite, titoli e lingue originali preservati in sei versioni |
| Menu francesi oltre il bordo destro su desktop | Testi a capo, larghezza limitata e posizionamento nel viewport | Tutti i menu del portale alle tre dimensioni controllate |
| Link fisso gioco → portale sempre italiano; etichette assistive IT/EN | Riutilizzati `SITE_LINKS` e testi locali, sincronizzati anche all'avvio | Percorso completo andata/ritorno e nomi accessibili in sei lingue |
| Watcher Windows sui file temporanei bloccati di Chrome | Esclusa `.infrastructure` dal watcher | Test browser riproducibili nella copia isolata |

`release.config.json` distingue `siteLanguages`, `playableLanguages`,
`caseLocalizationStatus`, `learningResourcesLanguages`. Il vecchio campo
ambiguo `languages` è rimosso. La registrazione tipata dei dizionari rimane
obbligatoria e viene confrontata con il registro: cambiare un elenco non
rende automaticamente giocabile una traduzione incompleta. Le lingue del
dossier scientifico mantengono il proprio registro `docs/v5/languages.json`.
I testi statici e i metadati sono controllati rispetto alla disponibilità
reale. Un nuovo audit è inserito nella CI; non è stata avviata una CI remota.

## Verifiche eseguite ed esiti

| Controllo | Esito finale |
|---|---|
| Suite Vitest | 1.646 test, 104 file, superati |
| Tipi gioco e Worker/Insights | Superati |
| Build di produzione locale | Superata; avviso sulla dimensione del bundle, senza errore |
| Integrità del dist | 155 pagine inventariate; 157 HTML in modalità standard, senza mojibake e con metadati nella testa |
| Audit linguistico | 155 pagine, 563 collegamenti al gioco; zero errori |
| Audit SEO | 155 URL; zero difetti critici e zero avvisi |
| Rigenerazione sito | Due cicli completi preservano i quattro registri e 158 file HTML byte per byte |
| Casi investigativi | 84 cicli completi: prove, scelta, firma, rapporto, debrief, conseguenza, norma e ripristino dei 14 rapporti |
| Percorso V5 | 84 cicli guidati + 4 profili aggiuntivi; argomentazione prima del feedback, revisioni, riflessione e assenza dei testi di prova nel salvataggio del gioco |
| Navigazione linguistica | Sei lingue: portale → gioco, selettore da tastiera, persistenza senza query, migrazione v1 e ritorno al portale nella lingua scelta |
| Primo avvio | Sei contesti nuovi: briefing, ingresso nel primo fascicolo e tutti i cinque passi della guida procedurale |
| Accessibilità mirata | Sei lingue: ricerca leggibile al focus, ripristino del modale ai cambi di dimensione, focus confinato e sfondo inerte |
| Portale su browser | 465 verifiche: tutte le 155 pagine a 1440, 390 e 320 px, menu, immagini, titoli, skip link e navigazione da tastiera |
| Sezione stampa | Sei lingue × quattro dimensioni, limiti del carosello, navigazione rapida con animazioni e fallback senza JavaScript |

Ambiente: Windows, Node 24.20.0, Playwright, Chrome installato con renderer
ANGLE/Direct3D11 Intel Iris Xe. I profili aggiuntivi del percorso V5 comprendono
desktop 1920×1080, telefono 320×800, 4K 3840×2160 e landscape 640×360.
Le visite del gioco sono locali; richieste esterne e POST sono impediti dai
test. Nessuna partita sintetica viene inviata al collector pubblico.

I cataloghi sono selezionati tramite fixture per isolare ciascun caso, poi
prove e decisioni usano l'interfaccia reale. Non sono 84 percorsi umani
indipendenti sulla mappa. I controlli non provano apprendimento o pensiero
critico e non validano automaticamente l'equivalenza delle traduzioni.

Durante lo sviluppo alcuni tentativi sono stati interrotti dal watcher o da
ricaricamenti dei sorgenti. Sono stati ripetuti su un checkout isolato; i
risultati finali sostituiscono i tentativi parziali. Due vecchie assunzioni dei
test sono state corrette: un solo sottomenu per pagina e la stringa «4.0»
obbligatoria nella descrizione del filmato storico. Il nuovo controllo visita
tutti i menu e verifica il riferimento alle versioni 4 e 5.

## Riproduzione

Da un checkout del ramo, con dipendenze installate e Chromium/Chrome disponibile:

```powershell
New-Item -ItemType Directory -Force .infrastructure/test-tmp | Out-Null
$env:TEMP=(Resolve-Path .infrastructure/test-tmp).Path
$env:TMP=$env:TEMP
$env:CHROMIUM_PATH='C:\Program Files\Google\Chrome\Application\chrome.exe'
$env:SMOKE_GPU='d3d11'
npm run site:fr
npm run audit:localization
npm run typecheck
npm run insights:typecheck
npm test -- --maxWorkers=4
npm run build
npm run verify:dist
npm run audit:seo
npm run smoke:localization
node scripts/smoke/first-run-languages-smoke.mjs
npm run smoke:release-cases
npm run smoke:guided-inquiry
npm run smoke:release-a11y
npm run smoke:site-languages
npm run smoke:press-coverage
```

Rigenerare i sorgenti prima dei test browser; non modificarli mentre un test
sta usando il server di sviluppo. `SMOKE_GPU` è l'opzione Windows; negli
altri ambienti il driver del repository può usare il renderer software.
L'eventuale percorso `CHROMIUM_PATH` va adattato all'installazione locale.

## File, screenshot e limiti aperti

[Elenco completo dei file modificati](LOCALIZATION_AUDIT_FILES.md).
I principali interventi interessano registro della release, inventario delle
rotte, dizionari/strato di lettura, generatori, metadati pubblici, navigazione,
documentazione e test. Nel dossier locale sono raccolti i JSON dei risultati,
la matrice, i log e `SCREENSHOTS.md`, con acquisizioni originali di titolo,
portale, briefing, tutorial, percorso guidato, riflessione e rapporto nelle
sei lingue. Gli screenshot del press kit V5.0.0 restano invariati: queste
acquisizioni QA non sono presentate come nuove immagini già pubblicate.

I 14 casi, classificazioni, ordine delle prove, scoring, schema e migrazioni
dei salvataggi non sono modificati. Non vengono introdotti account, nuovi
servizi o nuove raccolte individuali; il registro già esistente non è ampliato.

Il confronto terminologico usa le versioni ufficiali EUR-Lex, in particolare
[DE](https://eur-lex.europa.eu/eli/reg/2024/1689/oj/deu),
[ES consolidata](https://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX:02024R1689-20260727)
e [PT](https://eur-lex.europa.eu/legal-content/pt/TXT/?uri=CELEX:32024R1689):
Anbieter/Betreiber, proveedor/responsable del despliegue,
prestador/responsável pela implantação. Alcune aperture dirette della
consolidata richiedevano il controllo anti-bot: sono stati utilizzati anche
testi originari e indicizzazione ufficiale. Non sono introdotte nuove
traduzioni delle disposizioni né nuove soluzioni giuridiche dei casi.

Restano aperte revisione bilingue indipendente con madrelingua, prove con
screen reader e dispositivi mobili fisici, ulteriori browser e validazione
pedagogica. Non è un audit giuridico integrale né una certificazione WCAG.
Non sono eseguite tutte le combinazioni di modalità, profilo e difficoltà.
La completezza del gioco nelle sei lingue è distinta dalla traduzione completa
del portale e del dossier scientifico. Nessuna pubblicazione in produzione
è autorizzata da questo audit.
