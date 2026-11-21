# Incremento metodologico V5 — copertura completa

[Italiano](METHODOLOGY_IMPLEMENTATION.md) · [English](en/METHODOLOGY_IMPLEMENTATION.md) · [Français](fr/METHODOLOGY_IMPLEMENTATION.md)

Ramo di lavoro `codex/v5-methodology-guided-path`, base main `527fde5`. Revisione del 21 novembre 2026. Il rapporto documenta il completamento locale precedente al rilascio. La pubblicazione come V5.0.0 è stata poi autorizzata dal proprietario; stato corrente e note sono nella release GitHub e in RELEASE_NOTES_v5.0.0.md.

## Modifiche implementate

| Componente | Comportamento |
|---|---|
| CaseScene e inquiryCases | Tre soste iniziali e cinque mediazioni specifiche per ciascuno dei 14 casi, in IT/EN/FR |
| EvidenceScene e taccuino | Rilettura dei documenti già aperti, valutazione della provenienza, collegamenti liberi fra due fonti con ragione |
| GuidedInquirySession | Prima ipotesi preservata, revisioni registrate esplicitamente con motivo, copia immutabile di argomentazione, fonti e relazioni prima del responso |
| DecisionScene | Richiamo contestuale, aiuto riapribile e nota autonoma con tesi, prove, passaggio logico, alternativa e incertezza prima della firma |
| ReportScene | Scelte e norma del caso, rilettura della nota precedente, riflessione, controllo del feedback e piano di applicazione distinti |
| SessionEndScene | Debrief di tutti i fascicoli guidati completati, sintesi trasversale e strategia per contesti nuovi |
| Dialogo accessibile | HTML semantico, etichette, select e dettagli nativi, Escape, focus confinato e ripristinato, scroll interno; input del puntatore e tastiera isolati dalla scena |
| Study 02 locale | Due forme nuove con quattro fonti originali ciascuna in tre lingue, testo libero bloccato alla consegna, nessuna correzione automatica |
| Osservazione e rubrica | Contesto CEPAJe, sette righe di osservazione, sei dimensioni di codifica umana, correttezza normativa separata |
| Separazione dei dati | Appunti del gioco solo in memoria; laboratorio fuori da dist, server GET/HEAD su loopback, download locale soltanto esplicito |

Il percorso conserva narrativa, 14 casi, motivazioni predisposte, esiti e punteggi originali. Scrivere o proporre un collegamento non assegna punti né produce una valutazione di pensiero critico. Le mediazioni chiedono prove e circostanze senza comunicare una soluzione normativa prima del feedback. La matrice C documenta il raccordo con il consolidato UE del 27 luglio 2026 verificato su EUR-Lex.

## Tracciabilità e materiali

Le matrici A/B, la mappa LM–GM, l'analisi CEPAJe e la bibliografia sono in METHODOLOGY.md; la matrice C è in LEGAL_LEARNING_MATRIX.md. COVERAGE_COMPLETION.md raccorda tutti i comportamenti richiesti ai componenti. ARGUMENTATION_STUDY02.md contiene rubriche, disegno, triangolazione e piano di analisi. Le email originali sono state lette; riferimenti e tracciabilità privata restano nel dossier del proprietario e non nella build pubblica. Nessun feedback viene presentato come endorsement.

## Verifica finale

Implementazione completata prima dell'avvio dei nuovi test, come richiesto. I risultati della precedente versione parziale non certificano questo incremento. La verifica finale e i suoi esiti vengono registrati in TEST_RESULTS.md dopo l'esecuzione. I test automatici usano solo materiali sintetici e fixture esplicite.

Comandi: `npm run typecheck`, `npm test`, `npm run build`, `npm run audit:seo`, `npm run verify:dist`, `npm run smoke:guided-inquiry`, `npm run smoke:study02`, `npm run smoke:release-cases`, `npm run smoke:final-modes`.

## Uso locale

Gioco: `npm run dev`, aprire `/play/?lang=it`, scegliere un fascicolo e PERCORSO GUIDATO. La mediazione precede i reperti. Le note sono facoltative e si perdono al reload o alla nuova partita; il testo scritto non entra in salvataggi, esportazioni del gioco o telemetria.

Studio: `npm run study02:local`, aprire `http://127.0.0.1:4262/`. PRE/POST usano due schede separate e forme controbilanciate. Il tool non gestisce identità, consenso, randomizzazione, reclutamento o conservazione istituzionale: sono responsabilità del protocollo autorizzato esterno. Prima della consegna il debrief resta disabilitato. Il download esplicito salva testo consegnato e appunti umani sul dispositivo.

Smoke: `CHROMIUM_PATH` può selezionare Chrome installato. `INQUIRY_PORT` seleziona la porta. `INQUIRY_ONLY` limita un profilo per diagnosi; la verifica finale usa tutti i profili. Il percorso guidato copre 14 casi × 3 lingue e altri tre profili di layout, per 45 percorsi. I materiali Study 02 coprono 2 forme × 3 lingue × PRE/POST, per 12 configurazioni.

Su questa macchina Windows, `INQUIRY_4K_GPU=d3d11` richiede Direct3D per il solo profilo 3840×2160; gli altri profili usano il rendering software del test. Il backend effettivo è registrato in ogni risultato. La riproduzione deve dichiarare questa differenza. L'avvio 4K con il solo rendering software ha superato il timeout di 90 secondi nel Preload preesistente; la diagnostica con GPU ha raggiunto Title in circa 5,6 secondi. Non è una stima di prestazioni generalizzabile.

## Limiti aperti

- Copertura dei contenuti e funzioni distinta da validità educativa. Servono pilot con principianti, osservazione, produzioni e prova indipendente; non sono stati eseguiti studi umani.
- Rubrica, equivalenza delle forme e traduzioni sono preliminari: richiedono revisione bilingue, interviste cognitive, ancore e accordo fra valutatori.
- Le mediazioni sono testuali. Densità, ritmo e autonomia vanno verificati nel contesto CEPAJe; la restituzione orale equivalente richiede mediazione autorizzata.
- Lettori di schermo reali, dettatura, tastiera virtuale e dispositivi fisici richiedono prova umana. I controlli automatici non certificano accessibilità universale.
- La nota autonoma segue le alternative del rapporto. Il loro possibile effetto di orientamento è controllato metodologicamente attraverso il task esterno.
- La prima nota è una dichiarazione del giocatore. Chi ha già consultato un fascicolo può esserne influenzato; la baseline di ricerca è il PRE indipendente, somministrato prima del gioco su una sessione nuova.
- Le note del gioco non sono un tracciamento individuale. Un'apertura o una revisione non dimostra comprensione: la triangolazione usa spiegazioni e osservazione umana esterna.
- La correttezza normativa dei nuovi materiali richiede revisione giuridica umana prima della somministrazione. Le risposte dei 14 casi non sono state cambiate.
- La bibliografia è una ricognizione mirata; i limiti di accesso ai testi completi sono dichiarati nelle singole voci.
- Il rapporto tecnico originale precede la pubblicazione; lo stato del rilascio è documentato separatamente nella release V5.0.0.

## Deliverable

| Richiesta | Risultato |
|---|---|
| Metodo e bibliografia europea | METHODOLOGY.md |
| Matrice feedback | Matrice A e COVERAGE_COMPLETION.md; dossier privato separato |
| LM–GM | METHODOLOGY.md |
| CEPAJe | METHODOLOGY.md; contesto nel laboratorio |
| Percorso guidato | inquiryCases, GuidedInquiryDialog e scene del gioco |
| Ciclo e feedback | Revisioni, nota sigillata e riflessione distinta |
| Rubrica | ARGUMENTATION_STUDY02.md e laboratorio manuale |
| Trasferimento Study 02 | Due forme complete in research/study02 |
| Test | METHODOLOGY_TEST_PLAN.md e TEST_RESULTS.md |
| Modifiche e limiti | Questo documento |
