# Sprint Gameplay: rendere leggibile la logica del gioco

Stato: proposta operativa, 13 ottobre 2026. Nessuna nuova modalita implementata.
Punto di partenza: feedback di VideogiochiItaliani riportato dal responsabile del
progetto; non disponiamo qui del testo integrale dell'intervista o di un playtest.

## Le quattro modalita esistenti

Fonte: `src/game/data/gameModes.ts`, `TitleScene`, `CityMapScene`, `SessionEndScene`.

| Modalita | Funzione attuale | Verifica prima di cambiare |
| --- | --- | --- |
| Turno | Sequenza composta per pubblico e durata stimata | Il giocatore comprende chi sceglie i casi e quando termina il turno? |
| Libera | Mappa aperta, casi consigliati per profilo | Il consiglio sembra un vincolo? Sono chiari obiettivo e uscita? |
| Sorpresa | Ordine mescolato, difficolta iniziale expert, senza profilo | Il giocatore sa che rinuncia agli aiuti e puo comunque cambiare difficolta? |
| Ripasso | Solo casi con esito wrong/partial, altrimenti indisponibile | Il giocatore capisce perche un caso ricompare e quale errore rivedere? |

La durata e un budget dichiarato, non un cronometro. Conservare questa proprieta,
i 14 casi, il salvataggio v2 e la separazione fra correttezza e motivazione.

## Interventi ordinati

1. **Baseline osservata, 1 giorno.** Sei partecipanti, inclusi lettori senza
   conoscenze normative e giocatori abituali: primo caso senza istruzioni esterne.
   Osservare scelta modalita, citazione, firma e comprensione dell'esito. Annotare
   ostacoli senza registrare dati personali nel gioco. Non chiamarlo studio di
   efficacia didattica; un campione esplorativo non lo dimostra.
2. **Tutorial situato, 1-2 giorni.** Nel primo fascicolo del Turno introdurre un
   solo gesto alla volta: aprire una prova, citarla, confrontarla con una seconda,
   formulare una decisione. Riutilizzare indicatori e reading layer esistenti.
   Evitare una nuova schermata teorica; aiuto ignorabile e richiamabile. Nessun
   suggerimento che riveli la soluzione nei livelli senza aiuti.
3. **Decisione comprensibile, 1 giorno.** Rendere esplicito nel riepilogo cosa
   viene giudicato: classificazione, misura, responsabile, motivazione e prove.
   Evidenziare la relazione fra una prova citata e la motivazione selezionata,
   senza inventare punteggi o cambiare la matrice legale.
4. **Conseguenze leggibili, 1 giorno.** Dopo la firma mostrare i valori prima/dopo
   degli indicatori gia calcolati e una causa narrativa tratta dal caso. Non
   anticipare gli effetti prima della scelta. Testare annunci accessibili,
   riduzione movimento e leggibilita francese su schermo piccolo.
5. **Debrief utile, 1 giorno.** Portare in primo piano il rilievo principale e la
   prova decisiva. Un'azione di ripasso torna al punto concettuale dell'errore,
   preservando il rapporto originale; niente nuova modalita o voto scolastico.

## Criteri di uscita

- Almeno 5 dei 6 partecipanti completano citazione e firma senza interventi del
  facilitatore e spiegano perche due risposte identiche possono avere motivazioni
  di qualita diversa. Obiettivo di usabilita, non risultato gia acquisito.
- Nessun blocco nei quattro percorsi; ripasso vuoto correttamente disabilitato.
- Stessi esiti della matrice e migrazioni dei salvataggi; smoke tastiera/tocco,
  IT/EN/FR, 390px, Full HD e 4K senza testo tagliato nei passaggi modificati.
- Secondo giro osservato con gli stessi compiti; registrare anche gli insuccessi.
- Solo dopo questo confronto decidere se servono altre meccaniche.
