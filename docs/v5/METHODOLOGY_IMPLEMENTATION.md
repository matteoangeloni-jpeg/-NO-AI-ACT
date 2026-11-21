# Incremento metodologico V5

Ramo locale codex/v5-methodology-guided-path. Base main 527fde5, verificata il 21 novembre 2026. Il precedente deploy della PR 128 risulta riuscito. L'incremento corrente prepara un prototipo da revisionare localmente.

Strumenti effettivamente usati. Lettura delle email originali tramite Gmail autorizzato, consultazione web di fonti ufficiali e repository accademici, Git, rg, Graphify per orientamento, TypeScript, Vitest, Vite e Playwright. Il grafo iniziale era precedente al main, quindi ogni punto modificato è stato verificato nei sorgenti. Il successivo aggiornamento AST ha prodotto 3.723 nodi con avvisi su file privi di simboli. Il grafo resta locale.

## Modifiche implementate

| Componente | Comportamento effettivo |
|---|---|
| CaseScene | Apre il percorso guidato con una breve mediazione del collega, scopo della classificazione, esempio sulle fonti e prima ipotesi |
| GuidedInquirySession | Mantiene in memoria temporanea ipotesi iniziale, lettura attuale, relazione fra fonti, alternativa, lacuna e riflessione |
| EvidenceScene | Espone le note di indagine nel percorso scelto, conservando la prima ipotesi durante le revisioni |
| DecisionScene | Prima della firma offre la nota autonoma e ne fissa una copia prima del responso. I campi possono essere lasciati vuoti |
| ReportScene | Permette di rileggere l'argomentazione precedente e scrivere una riflessione distinta dopo il feedback |
| SessionEndScene | Riunisce note e riflessioni dei fascicoli guidati nel debrief finale |
| Dialogo HTML e CSS | Etichette dei campi, contenuti resi come testo, Escape, ritorno del focus, ciclo di Tab e pannello scorrevole |
| Localizzazione | Un contratto di etichette e consegne per IT/EN/FR |

Il percorso usa gli stessi 14 casi, le loro fonti e le decisioni esistenti. La nota non modifica i risultati del rapporto. La scelta delle soste, del collega ispettore e dei quattro campi è una decisione progettuale di questo incremento, da discutere con principianti e facilitatori.

## Confine dei dati e compatibilità

Il nuovo stato resta nella memoria JavaScript della scheda. Reload e nuova sessione lo azzerano. Le annotazioni non entrano nei salvataggi V1/V2, nei contatori aggregati, nei report esportati o negli endpoint. I dialoghi avvisano della durata temporanea degli appunti. Non scrivere dati reali identificativi nei campi. I test usano esclusivamente testo sintetico.

La versione pubblica resta separata dal protocollo di ricerca. Osservazioni individuali, raccolta di elaborati e codici di Study 02 richiedono un sistema esterno e la governance descritta in ARGUMENTATION_STUDY02.md.

## Risultati verificati

- TypeScript, build, verifica dist e audit SEO superati. Audit su 155 rotte.
- 1.503 test superati in 94 file, compresi quattro nuovi test sulla separazione dei testi e il reset di sessione.
- 42 percorsi del catalogo superati, 14 casi in IT/EN/FR con ripristino dei rapporti.
- 12 combinazioni modalità/lingua superate, Turno, Libera, Sorpresa e Ripasso in IT/EN/FR.
- Percorso guidato verificato sul caso_scoring attraverso ingresso, ipotesi, reperti, revisione, nota prima della firma, feedback, riflessione e debrief finale.
- Profili verificati nei test del prototipo: IT 1920×1080 e 320×800, EN 390×844 e 640×360, FR 390×844 e 3840×2160. Controllati Escape, focus, Tab, input multilinea senza firma involontaria, reset al reload e assenza del testo in localStorage e telemetria.

Il test 4K iniziale si è fermato nel Preload preesistente con rendering software. La verifica del prototipo è passata usando un browser isolato per profilo e un limite di attesa di 90 secondi per le scene. Questo esito dimostra il percorso nella configurazione testata. Le prestazioni di avvio su hardware reale richiedono profilazione separata.

Un test esistente della firma vietava qualunque accesso a caseData, anche al solo ID necessario per scegliere il taccuino. Il controllo è stato aggiornato per consentire esclusivamente caseData.id e continuare a vietare lettura delle soluzioni nella firma. Il test di catalogo conferma gli esiti normativi precedenti.

## Limiti aperti e prossima iterazione

1. La rubrica è preliminare. Nessuna valutazione automatica del pensiero critico è stata introdotta.
2. Le prove tecniche non verificano comprensione o trasferimento. Servono le sessioni umane e il protocollo indipendente descritti nel dossier.
3. Il dialogo è una mediazione testuale. Durata, densità e capacità di sostenere il principiante richiedono think-aloud e possibile riduzione dei prompt.
4. Le traduzioni del prototipo richiedono revisione bilingue. Equivalenza dei compiti di ricerca e difficoltà linguistiche vanno verificate prima dello studio.
5. Lettori di schermo reali, dettatura, tastiera virtuale e dispositivi fisici restano da provare. I controlli automatici coprono semantica e navigazione nella configurazione testata.
6. Le forme A/B di trasferimento sono una specifica. Prima dello studio servono fonti complete, chiave giuridica, pilot di equivalenza, ancore e accordo fra valutatori.
7. La matrice giuridica documenta riferimenti e condizioni. Un revisore umano deve valutare ogni futura modifica dei casi.
8. La nota prima del feedback segue le alternative già presenti nel rapporto. Questo supporto può orientare il ragionamento e va considerato nell'interpretazione degli elaborati.
9. Il taccuino completo è stato percorso su un caso rappresentativo. Gli altri 13 hanno il componente disponibile e la regressione del catalogo superata, ma richiedono ancora playtest metodologico specifico.
10. La ricognizione bibliografica è mirata. Alcuni testi completi erano bloccati, come precisato nella bibliografia.

## Riesecuzione locale

Nel clone work/no-ai-act, eseguire npm run dev e aprire /play/?lang=it. Aprire un fascicolo e scegliere PERCORSO GUIDATO. Le note restano facoltative e la firma si conferma esplicitamente nel dialogo.

Per le prove automatiche eseguire npm run smoke:guided-inquiry. Su Windows è possibile impostare CHROMIUM_PATH al browser installato, come fanno i test locali. INQUIRY_ONLY seleziona un profilo per diagnosi, per esempio fr-3840. INQUIRY_PORT seleziona una porta locale libera. Lo script apre un nuovo browser per ogni profilo e chiude l'anteprima al termine.

## Mappa dei deliverable

| Richiesta | Documento o componente |
|---|---|
| Documento metodologico e bibliografia | METHODOLOGY.md |
| Matrice dei feedback | Matrice A in METHODOLOGY.md e dossier privato V5_FEEDBACK_PRIVATO.md |
| Mappa LM–GM | METHODOLOGY.md |
| Analisi CEPAJe | METHODOLOGY.md |
| Prototipo funzionante | GuidedInquiry.ts, GuidedInquiryDialog.ts e cinque scene |
| Revisione del ciclo e del feedback | Tabelle delle fasi, nota pre-feedback e riflessione post-feedback |
| Rubrica | ARGUMENTATION_STUDY02.md |
| Prova di trasferimento | ARGUMENTATION_STUDY02.md |
| Piano di test | METHODOLOGY_TEST_PLAN.md |
| Implementato e limiti | Questo rapporto |
