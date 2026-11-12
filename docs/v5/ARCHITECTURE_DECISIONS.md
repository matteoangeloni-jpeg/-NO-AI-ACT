# Decisioni architetturali V5

1. Riusare EvidenceCompareOverlay e ReadingLayer; mostrare lo stesso orientamento nel canvas e nel testo accessibile. Il confronto resta un'azione di lettura.
2. Descrivere il controllo C come verifica dei reperti citati. Il risultato riguarda la coppia modellata, non risolve il caso. Conservare schema, valutazione, riferimenti legali e telemetria.
3. Prima di introdurre un modello persistente, provare in una sessione locale una tesi con prova favorevole, prova contraria, incertezza e conclusione. Solo dopo valutare una versione del draft e fixture di compatibilità.
4. Studio separato e disattivato: nessun codice partecipante nei salvataggi o nei contatori pubblici. Valutazione, export, accesso e conservazione richiedono protocollo approvato.
5. Nessuna distribuzione da questo ramo. Per ritiro del prototipo, rimuovere il commit della slice; non ci sono migrazioni dati.

Strumenti usati: Graphify (C:/Users/Matteo Angeloni/.codex/skills/graphify/SKILL.md) per orientamento; Git, rg, TypeScript/Vitest e gli script npm del progetto per verifica. Il grafo locale riporta d6784358, precedente al main: i riscontri correnti sono verificati nei sorgenti. Non sono state installate nuove skill.
