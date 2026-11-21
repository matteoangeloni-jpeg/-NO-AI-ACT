# Copertura operativa dei feedback

Incremento richiesto dal proprietario il 21 novembre 2026. Questa lista definisce il lavoro da implementare prima di avviare la nuova verifica finale.

| Requisito | Implementazione | Componente verificabile |
|---|---|---|
| A1 — comprensione dei neofiti | Mediazione specifica per ognuno dei 14 casi, nelle tre lingue | inquiryCases.ts; dialogo, 42 schede |
| A2 — scene nella sequenza | Introduzione progressiva, aiuto contestuale fra reperti e classificazione, guida riapribile | CaseScene, tre soste; DecisionScene, method |
| A3 — debrief finale | Ricostruzione delle ragioni, confronto con norme e feedback del caso, sintesi a fine sessione | ReportScene; SessionEndScene; feedback e session |
| P1 — esplorazione delle fonti | Rilettura dei reperti già aperti, valutazione della provenienza e attendibilità motivata | sources e writeSource; osservazione umana separata |
| P2 — correlazione | Coppie di fonti collegate dal giocatore con relazione e spiegazione | relate, relazione supports/challenges/uncertain, nessuna correzione |
| P3 — ipotesi e revisione | Prima ipotesi preservata, revisioni esplicite accompagnate da ragioni | finishIntroduction; recordRevision; snapshot |
| P4 — argomentazione autonoma | Tesi, prove, alternativa, passaggio logico verso misura e responsabilità prima del responso | argument, reasoning; submit prima di resolve |
| P5 — incertezza | Informazioni mancanti e conseguenze per persone e diritti | uncertainty; mediazione diversa per caso |
| P6 — uso del feedback | Confronto con il proprio testo precedente, criterio mantenuto o rivisto e piano per il caso successivo | reflection, feedbackUse, transferPlan; sintesi di sessione |
| P7 — osservazione e triangolazione | Strumento locale separato per osservazione strutturata e codifica umana con rubrica | Study 02: sette righe, sei dimensioni, contesto CEPAJe |
| P8 — trasferimento indipendente | Due forme complete in IT/EN/FR, documenti originali, risposta libera sigillata prima del debrief, strumento locale funzionante | research/study02; server locale GET/HEAD; 12 configurazioni |
| Confini | 14 casi originali, migrazioni e punteggi esistenti, appunti temporanei nel gioco, materiali di ricerca esclusi dalla build pubblica | Test di catalogo, save, privacy, rete e dist |

La copertura operativa riguarda contenuti e funzioni. L'efficacia e la validità delle inferenze richiedono partecipanti, revisori e analisi del protocollo Study 02. Il rapporto finale distinguerà implementazione, verifica tecnica e verifica umana.

I test sono stati avviati dopo l'implementazione di tutte le righe. Le correzioni emerse nella verifica finale sono state seguite da nuove esecuzioni. TEST_RESULTS.md registra 1.509 test unitari, 45 percorsi guidati, 42 percorsi standard, 12 configurazioni modalità/lingua e 12 configurazioni Study 02 superati, con i limiti effettivi della verifica.

Questi ID operativi dettagliano i feedback P1–P5 della matrice A metodologica: P1–P5 operativi esplicitano soprattutto la sua riga P2; P6 esplicita P4; P7/P8 realizzano P3/P5. Non attribuiscono nuove osservazioni alle persone consultate. Criteri didattici e limiti interpretativi rimangono quelli delle matrici A/B.
