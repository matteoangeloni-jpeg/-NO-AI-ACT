# Verifica assistiva NO AI ACT 4.0

Stato: NON ESEGUITA con screen reader reale. I test DOM, focus e tastiera non
dimostrano la correttezza della lettura vocale o la conformita WCAG completa.
Compilare questa checklist con chi utilizza abitualmente il lettore.

## Preparazione

- Profilo browser separato, candidata locale, SHA, lingua e versioni annotati.
- Analytics remoto OFF; non usare salvataggi del giocatore o dati personali.
- IT/EN/FR; smartphone verticale/orizzontale e desktop con zoom 200%.
- Annotare atteso, osservato, esito PASS/FAIL/NON ESEGUITO e gravita.
- Non registrare audio/video per default; non caricare risultati nel backend.

## NVDA / Windows

Avviare NVDA e aprire il gioco in un browser supportato. Annotare versione di
NVDA e browser. Il modificatore NVDA dipende dalla configurazione (Insert o
Caps Lock). NVDA+Space alterna modalita navigazione e focus; NVDA+n apre il
menu. Il visualizzatore voce nel menu Strumenti e un ausilio diagnostico,
non un sostituto dell'ascolto. Usare Tab/Shift+Tab e attivare i pulsanti con
Enter/Space. Verificare separatamente i tasti di gioco in modalita focus:
le scorciatoie del lettore non devono essere confuse con input mancanti.

Fonte: [guida ufficiale NVDA](https://download.nvaccess.org/releases/stable/documentation/en/userGuide.html).

## VoiceOver / macOS

Attivare VoiceOver con Command+F5 (Fn se richiesto dalla tastiera) oppure dalle
Impostazioni di Sistema, Accessibilita. Annotare browser/macOS e impostazioni.
Navigare i controlli con il modificatore VoiceOver configurato, frecce e rotor;
verificare che il focus vocale e quello dei comandi HTML restino coerenti.

Fonte: [comandi ufficiali Apple](https://support.apple.com/guide/voiceover/general-commands-cpvokys01/10/mac/27).

## VoiceOver / iOS

Attivare da Impostazioni > Accessibilita > VoiceOver. La tripla pressione del
tasto laterale/Home vale solo dopo aver configurato l'abbreviazione pertinente.
Usare scorrimenti destra/sinistra per esplorare, doppio tocco per attivare e
rotor per intestazioni/controlli; verificare anche scorrimento dei testi lunghi.

Fonti: [avvio e pratica](https://support.apple.com/en-au/guide/iphone/iph3e2e415f/ios),
[abbreviazioni](https://support.apple.com/en-au/111771),
[rotor](https://support.apple.com/en-ie/guide/iphone/iph3e2e3a6d/ios).

## Percorso uniforme

| Controllo | Atteso | Osservato / esito |
| --- | --- | --- |
| Titolo e lingua | Nome pagina e lingua corretti; pulsanti nominati | NON ESEGUITO |
| Nuova partita/modalita | Modalita e disponibilita comprensibili | NON ESEGUITO |
| Tutorial facoltativo | Dialogo nominato, focus interno; uscita/richiamo funzionanti | NON ESEGUITO |
| Fascicolo/reading layer | Titolo, contesto e testo completo leggibili in ordine | NON ESEGUITO |
| Reperti e confronto | Documento corrente e citazioni distinguibili, nessun gesto obbligato | NON ESEGUITO |
| Decisione e riepilogo | Scelte/stato leggibili; una attivazione produce una azione | NON ESEGUITO |
| Firma e risultato | Firma raggiungibile; esito annunciato una volta utilmente | NON ESEGUITO |
| Cinque criteri | Tutti consultabili senza dipendere da colore/canvas | NON ESEGUITO |
| Conseguenze | Prima/dopo e variazioni associati all'indicatore corretto | NON ESEGUITO |
| Debrief | Focus entra nel dialogo e torna al comando alla chiusura | NON ESEGUITO |
| Ricerca archivio | Campo riconoscibile, input visibile, risultati consultabili | NON ESEGUITO |
| Ripresa/ripasso | Progressione e originali conservati | NON ESEGUITO |
| Resize/orientamento | Nessun focus perso o elemento dietro un dialogo raggiungibile | NON ESEGUITO |

Separare un errore riproducibile dell'applicazione da configurazione del lettore,
ma non archiviare un blocco come problema del lettore senza riproduzione.
