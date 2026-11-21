# NO AI ACT V5.1 — sei lingue giocabili

Gioco e sito condividono italiano, inglese, francese, tedesco, spagnolo e portoghese europeo. Il codice lingua del gioco è `pt`, il documento accessibile usa `pt-PT`; entrambi i parametri `?lang=pt` e `?lang=pt-PT` aprono il portoghese europeo.

Le tre nuove versioni contengono ciascuna 1.581 stringhe. Sono tradotti tutti i 14 casi, inclusi prove, motivazioni, incidenti, esiti, conseguenze e domande; inoltre norme, glossario, aiuti, autoverifica formativa, report, annotazioni guidate e cinque mediazioni per caso. I 42 valori invarianti per lingua sono il nome del progetto, quello dell'autore e chiavi interne delle fonti. Queste chiavi indicizzano etichette tradotte e non sono testo mostrato al giocatore.

I testi definitivi sono stati redatti e rivisti nella sessione. Le bozze del motore locale di traduzione non sono usate come fallback né incluse nella distribuzione. Le denominazioni ufficiali dell'ateneo e del dottorato sono mantenute; il collegamento istituzionale disponibile in inglese è contrassegnato `(EN)`.

## Comportamento

- Selettore con sei pulsanti diretti su due righe. Nessun ciclo obbligato e nessun nome di lingua compresso in una singola riga da sei elementi.
- Sei coppie di risorse docente, con etichette nella lingua corrente. DE/ES/PT collegano il laboratorio e l'introduzione per docenti realmente disponibili sul sito; non si inventano pagine o piani di lezione.
- Report locali e strato di lettura accessibile tradotti. Titolo del documento e lingua assistiva seguono la selezione.
- Avvisi di uso aggregato, disattivazione, informativa e involucro beta disponibili nelle sei lingue.
- Salvataggi v2 e migrazione v1 preservati: casi, prove, motivazioni e opzioni mantengono identificativi e ordine. Cambiare lingua non riscrive risultati o bozze.
- Whitelist del collector estesa alle sei lingue e alla release corrente, conservando i client precedenti. Nessun nuovo campo, schema D1 o dato individuale.

## Normativa e terminologia

Il lessico è confrontato con le versioni ufficiali [tedesca](https://eur-lex.europa.eu/eli/reg/2024/1689/oj/deu), [spagnola consolidata](https://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX:02024R1689-20260727) e [portoghese](https://eur-lex.europa.eu/legal-content/pt/TXT/?uri=CELEX%3A32024R1689), e con il [record consolidato vigente al 27 luglio 2026](https://eur-lex.europa.eu/eli/reg/2024/1689). Alcune aperture dirette DE/PT della consolidata hanno incontrato il controllo anti-bot; per il lessico sono stati consultati anche testo originario e indicizzazione ufficiale. Non vengono introdotte nuove soluzioni giuridiche o mutate le classificazioni dei casi.

Terminologia principale: Anbieter/Betreiber, proveedor/responsable del despliegue, prestador/responsável pela implantação; KI-Kompetenz, alfabetización en materia de IA, literacia em IA. Le eccezioni ai divieti, i requisiti cumulativi dell'articolo 4a e la differenza fra modello e impiego concreto restano espliciti. Si conserva la natura didattica semplificata del gioco.

## Verifiche e limiti

Le verifiche della release comprendono struttura completa dei dizionari, segnaposto, assenza di ripiego su altre lingue, indici delle prove e delle motivazioni nei 14 casi, query e persistenza di tutte le lingue, report e link, accessibilità semantica, parser dei contatori, typecheck, test unitari, build e integrità del dist. Non sono eseguiti smoke test, come richiesto dal proprietario. Gli esiti effettivi sono riportati nella release.

Il dossier metodologico storico e il laboratorio indipendente Study 02 conservano le proprie versioni IT/EN/FR, dichiarate in `languages.json`. Sono risorse di ricerca separate dalla build pubblica, non interfacce mancanti del gioco. Questa traduzione non amplia automaticamente il protocollo sperimentale a nuove lingue o partecipanti.

Copertura tecnica e revisione dei testi non equivalgono a validazione linguistica umana o equivalenza delle forme. Restano da svolgere revisione bilingue specialistica, prove con tecnologie assistive reali e validazione educativa. Nessuno scoring automatico del pensiero critico, certificazione di competenza o raccolta individuale viene aggiunto.
