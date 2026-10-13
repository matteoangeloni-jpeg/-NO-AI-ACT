# Sprint Mobile UX 4.0

Base verificata: `6dc882d`, ramo `codex/gameplay-ux-v4`.
Ramo di lavoro: `codex/mobile-ux-v4`. Solo locale, nessun push/merge/deploy.

## Diagnosi

- Il canvas ad alta risoluzione non risolve la leggibilita: il mondo logico
  resta 1280x720 e Scale.FIT scala anche i caratteri. A 390px un carattere
  logico di 14px diventa circa 4.3px CSS. Sono dimensioni, non pixel mancanti.
- Portrait: enormi bande vuote, documento piccolo e target ridotti. Landscape:
  piu spazio orizzontale ma poca altezza, quindi anche qui la scala penalizza.
- Il reading layer precedente era un pannello laterale al 42vw e 13px,
  non una presentazione primaria per uno smartphone.
- Le schede e i punti della mappa non avevano comandi HTML equivalenti;
  motivazioni e autocontrollo avevano pulsanti senza nome accessibile.
- ActionLayer considerava modale anche la barra della scrivania a depth 20,
  nascondendo gli altri comandi. I veri pannelli iniziano a depth 80.
- Alcuni aiuti si chiudevano solo con Escape o clic sullo sfondo; dettagli
  dell'archivio e testi dei rapporti erano incompleti nella vista semantica.

## Implementazione

- Vista compatta automatica per viewport <=1024px, oppure altezza <=520px con
  larghezza <=1200px. Non dipende dallo user agent e funziona anche col reflow
  prodotto dallo zoom del browser. Desktop invariato sopra queste soglie.
- HTML/CSS a colonna unica, scorrimento verticale, safe-area, testo base 1rem
  (16px standard), titoli contenuti, testo a capo, target >=48px. Nessuna
  riduzione del corpo per far entrare traduzioni lunghe.
- Gli stessi elementi ActionLayer chiamano gli stessi callback Phaser.
  Nessuna copia del motore di decisione, nessun secondo stato di partita.
- Documenti con apertura/citazione/rimozione accanto al testo e aria-pressed.
  Mappa disponibile come elenco di fascicoli con stato e azione esistenti,
  inclusi i quattro valori degli indicatori della citta.
  L'elenco testuale duplicato e i suggerimenti per tastiera restano sul
  desktop; sul telefono i pulsanti dei fascicoli riportano gia nome e stato.
- Motivazioni e autocontrollo hanno nomi accessibili completi. La fiducia
  facoltativa espone lo stato selezionato e annuncia il cambiamento.
- Guida, confronto, rapporti, debrief, ripasso, norme e archivio usano contenuti
  semantici completi. Fonte e funzione delle prove restano nel confronto.
- Chiusura esplicita negli aiuti terminologici/normativi e nei dettagli norme.
  Ricerca archivio con input nativo che richiama la ricerca preesistente.
- Focus spostato al contenuto nelle transizioni e restituito al comando dopo
  i pannelli; Tab circolare nei pannelli mobili; ripristino dei testi per
  pannelli annidati. Gli avvisi vengono anche annunciati e mostrati in HTML.
- Il canvas e nascosto e le camere non renderizzano nella vista compatta;
  scene, audio, callback e stato continuano a funzionare. La scrittura animata
  non ritarda i comandi quando il testo HTML e gia interamente disponibile.
- IT/EN/FR per le nuove etichette. Nessuna preferenza aggiunta allo storage.

## Invarianti

Confronto Git con `6dc882d` senza differenze per `cases.ts`, `norms.ts`,
`indicators.ts`, `gameModes.ts`, `types.ts`, `ReportSystem.ts`, `StateManager.ts`,
`SaveSystem.ts` e `AnalyticsSystem.ts`. Tutorial e ripasso dello Sprint Gameplay
restano presenti. Non vengono inviati nuovi eventi o dati.

## Verifiche

- Typecheck e build: PASS con Node 24.19.0.
- Test unitari: 1279 PASS in 78 file, inclusi soglie responsive e contrasti.
- Regressioni browser: gameplay, tastiera, bozze, privacy, audio, ActionLayer,
  scrivania investigativa, linguaggio visivo e pagine stampa PASS.
  Layout PASS alla riesecuzione: il primo `smoke:all` era fallito perche il
  relativo helper attendeva il campo privato `lastStep`, rimosso correggendo
  il ripristino dei pannelli. Ora attende il titolo del passo effettivo e
  la scelta nello stato; gli altri controlli di layout restano presenti.
  Una ripetizione della matrice si e fermata all'avvio EN 4K entro il limite
  di 15 secondi. Il boot procedurale su WebGL software ha ora un limite di
  60 secondi nel test; le transizioni di gameplay restano a 15 secondi.
  Il timeout e poi ricomparso su FR 1024x768 dopo numerosi contesti nello
  stesso browser; quel profilo completo passa isolatamente. Per limitare
  possibili accumuli di risorse del browser di prova, il runner ora avvia un browser
  indipendente per profilo e attende un secondo dopo la chiusura. Non
  riavvia mai il browser durante un percorso investigativo.
  Questi limiti non costituiscono un benchmark su dispositivi fisici.
- Matrice conclusiva sulla build finale, con browser isolati: 36 profili
  PASS (27 percorsi touch e nove controlli desktop), zero eccezioni JavaScript.
  Risultati in `scripts/smoke/out/mobile-ux/results.json`.
- Giro aggiuntivo IT 390x844, emulazione mobile Chromium, DPR 3 e movimento
  normale: PASS, compresi rotazione, caratteri al 200%, focus dei pannelli,
  archivio e conservazione del salvataggio. Risultato separato in
  `scripts/smoke/out/mobile-ux/results-quick-full.json`.
- Regressione Sprint Gameplay: 14/14 casi completati con esito corretto,
  tramite tastiera a 1280x720, conseguenze prima/dopo e arrivo alla carta normativa. Tutorial, riepilogo,
  debrief e ripasso PASS su IT/EN 1920x1080, FR 390x844 e FR 3840x2160;
  il ripasso preserva i rapporti originali. Zero eccezioni JavaScript.
- Audit SEO: 107 rotte PASS, zero avvisi. Verifica dist: 107/107 pagine,
  108/108 HTML senza mojibake, nessuna nuova raccolta dati o form esterno.
- Nuovo smoke mobile incluso nel gate `smoke:all`. Il vecchio percorso touch
  che cercava coordinate sul canvas e sostituito dal percorso HTML reale.
- Matrice: 320x800 aggiuntivo, 360x800, 390x844, 412x915, 768x1024,
  800x360, 844x390, 915x412, 1024x768, 1280x720, 1920x1080, 3840x2160.
  Ogni formato nelle tre lingue; sui formati compatti si esegue il percorso
  a tocco sul fascicolo `case_scoring` (27 percorsi touch). Desktop: nove
  screenshot di menu e regressioni canvas separate, non 14 casi per viewport.
- Nel flusso mobile: selezione delle quattro modalita, ripasso vuoto, guida, prove, citazione,
  confronto, quattro scelte, firma, debrief, ripasso e ritorno, conseguenze.
  Il ritorno dal ripasso deve lasciare lo storage identico all'originale.
  Solo per controllare le conseguenze dopo il ripasso il test ripristina
  direttamente la scena del rapporto gia firmato, senza riscrivere lo stato.
- 390px: rotazione nella stessa sessione, testo al 200%, snapshot semantico,
  aiuti con ripristino del testo e archivio/dettaglio norma. Target >=44px
  verificati nel DOM; CSS li imposta ad almeno 48px.
  La ricerca conserva il valore quando si chiude il dettaglio della norma.

Screenshot locali ignorati da Git: `scripts/smoke/out/mobile-ux/`.
`before-390-case.png`, `before-844-case.png`, `before-768-case.png` sono stati
catturati sulla build base prima delle modifiche. Non rigenerarli sulla nuova
build: lo script `mobile-before.mjs` serve esclusivamente contro la base.
Confronti: `after-it-390-case.png`, `after-it-844-case.png`,
`after-it-768-case.png`. Altri esempi: `after-it-390-summary.png`,
`after-it-390-evidence.png`, `after-fr-390-debrief.png`,
`after-fr-390-text-200.png`. Screenshot viewport: la parte sotto la piega
si raggiunge con normale scorrimento verticale, non e contenuto tagliato.

## Accessibilita e limiti

Riferimenti di verifica: WCAG 2.2 AA, in particolare
[reflow 1.4.10](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html),
[target 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html),
ridimensionamento testo, orientamento, contrasto, tastiera e focus.
I test della palette verificano le coppie effettivamente dichiarate nel CSS
per testo primario, titoli, sottotitoli, pulsanti e collegamento al sito.

Non e una dichiarazione di conformita WCAG completa. Le prove sono Chromium
con viewport/touch emulati e snapshot semantici, non sessioni con persone che
usano NVDA, VoiceOver o TalkBack. Restano da provare Safari iOS, Chrome Android
su dispositivi fisici, tastiera virtuale e preferenze di carattere del sistema.
La grafica mobile privilegia documenti e comandi leggibili: non riproduce la
mappa animata e tutti gli effetti decorativi del desktop. L'audio resta quello
del gioco. Il bundle Phaser conserva l'avviso dimensionale gia presente.

Prima dell'invio ai giornalisti: playtest su almeno un telefono Android e un
iPhone reali, compreso ripasso, rotazione e lettore di schermo. Il protocollo
con sei partecipanti resta in `GAMEPLAY_4_0_REVIEW.md`; registrare separatamente
comprensione, leggibilita, errori di tocco e richieste di aiuto.

## File

- `src/game/ui/mobilePresentation.ts`, `src/main.ts`, `src/mobileGuard.ts`,
  `src/game/GameConfig.ts`, `src/styles/global.css`: adattamento e rendering.
- `src/game/systems/ReadingLayer.ts`, `src/game/ui/ActionLayer.ts`,
  `Button.ts`, `DossierCard.ts`, `AlertToast.ts`, `TypewriterText.ts`:
  contenuti, input, focus e presentazione.
- `src/game/scenes/CaseScene.ts`, `CityMapScene.ts`, `EvidenceScene.ts`,
  `DecisionScene.ts`, `ReportScene.ts`, `ArchiveScene.ts`:
  esposizione delle azioni e dei contenuti gia esistenti.
- `src/game/ui/EvidenceCompareOverlay.ts`, `SelfCheckOverlay.ts`: metadati
  probatori e nomi accessibili.
- `src/game/i18n/it.ts`, `en.ts`, `fr.ts`: etichette localizzate.
- `tests/mobilePresentation.test.ts`, `a11yLayer.test.ts`, `termHints.test.ts`;
  `scripts/smoke/mobile-ux-smoke.mjs`, `mobile-before.mjs`, `gameplay-smoke.mjs`,
  `gameplay-ux-smoke.mjs`, `layout-smoke.mjs`, `lib-decision.mjs`,
  `run-all.mjs`, `package.json`.
- `CHANGELOG.md`, `docs/GUARDRAILS.md`, questo documento.

## Riproduzione

Node 24, dipendenze e Chromium Playwright installati:

```text
npm run typecheck
npm test
npm run build
npm run smoke:all
```

Il runner gestisce la porta 4200 e la chiude alla fine. Per il solo mobile,
avviare un preview sulla 4212 e poi `npm run smoke:mobile-ux`.
Con `QUICK=1 MOTION=full` si esegue il profilo IT 390x844 a DPR 3 e movimento
normale; con `ONLY=fr-1024` si seleziona un singolo profilo della matrice.
Su PowerShell impostare queste variabili tramite `$env:` prima del comando.
