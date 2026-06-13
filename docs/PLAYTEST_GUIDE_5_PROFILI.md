# PLAYTEST GUIDE — 5 PROFILI — NO AI ACT v0.3.1

Guida operativa per playtest guidati con cinque profili di tester.
**Obiettivo:** capire se il gioco è comprensibile, se il rapporto ispettivo
funziona, se la differenza tra **conforme / parzialmente conforme /
contestabile / non conforme** è chiara e se le carte norma (con la riga
"Non significa che…") aiutano davvero.

## Setup comune
- Browser aggiornato; `npm run preview` o versione online; audio attivabile.
- Un facilitatore osserva e **non aiuta** salvo blocco totale.
- Tester identificato con un codice (S1, D1, DS1, PA1, A1…): **nessun dato
  personale** nei materiali.
- Annotare ora di inizio/fine caso per la durata reale.
- A fine sessione: 8–10 minuti di domande post-test.
- Durata sessione consigliata: 45–60 min (partita 25–35 + intervista).

---

## Profilo 1 — Studente 16 anni
**Task:** nuova partita in IT; completare 3 casi a scelta; consultare almeno una
carta dall'archivio; arrivare al rapporto finale se il tempo lo consente.

**Domande post-test**
1. Con parole tue, che differenza c'è tra un sistema "vietato" e uno "ad alto rischio"?
2. A cosa servivano i reperti che hai citato nel rapporto?
3. Perché una decisione giusta può risultare "contestabile"?
4. La riga "Non significa che…" ti ha cambiato un'idea che avevi?

**Segnali di confusione:** clic ripetuti su "Procedi" disabilitato; scelta della
motivazione più lunga o della prima; soggetto responsabile scelto a caso;
rilettura del rapporto senza capire l'esito.

**Successo se:** risponde a 1 e 3 senza aiuto; chiude un caso in ≤8 min; non
confonde "misura" e "motivazione".

## Profilo 2 — Docente
**Task:** attivare MODALITÀ DOCENTE dal menu; giocare 4 casi; aprire il debrief;
scaricare il report .txt; valutare le 3 domande di discussione.

**Domande post-test**
1. Useresti il report .txt così com'è in classe? Cosa manca?
2. Le domande di debrief sono al livello dei tuoi studenti?
3. La dicitura "versione didattica semplificata" è abbastanza visibile?
4. Le carte norma sono usabili come materiale a sé?

**Segnali di confusione:** non trova il toggle docente; cerca le "soluzioni" dei
casi; dubita dell'accuratezza e chiede fonti.

**Successo se:** attiva la modalità docente in <1 min; giudica il debrief
usabile senza rielaborazione; nessun rilievo di accuratezza bloccante.

## Profilo 3 — Dirigente scolastico
**Task:** partita breve (2 casi) + lettura del debrief, con la domanda guida
"lo adotteresti d'istituto?".

**Domande post-test**
1. In quali attività curricolari lo collocheresti (educazione civica, digitale, PCTO)?
2. Quanto tempo d'aula richiede l'attività completa? È sostenibile?
3. Cosa diresti a un genitore che chiede "che dati raccoglie"?
4. Serve formazione del docente prima dell'uso?

**Segnali di confusione:** preoccupazione privacy non risolta dalla schermata;
percezione di "troppo tecnico/legale"; incertezza sull'inquadramento didattico.

**Successo se:** sa rispondere alla domanda privacy citando "tutto locale,
nessun dato personale"; colloca il gioco in almeno un'attività; stima 30–45 min
realistici.

## Profilo 4 — Funzionario PA
**Task:** partita completa in IT; attenzione esplicita ai casi Municipio (social
scoring) e Sorveglianza (biometria); valutare la fase "soggetto responsabile".

**Domande post-test**
1. La distinzione provider/deployer è rappresentata correttamente?
2. Il perimetro del divieto biometrico (tempo reale, spazio pubblico, finalità
   di contrasto) è reso bene?
3. Qualche formulazione ti è sembrata fuorviante o troppo netta?
4. Le carte "Non significa che…" prevengono i fraintendimenti che vedi sul campo?

**Segnali di confusione:** disaccordo su chi sia il soggetto responsabile;
percezione che il gioco "demonizzi" l'IA invece di governarla.

**Successo se:** conferma l'accuratezza sostanziale dei due casi sensibili;
nessuna formulazione segnalata come errata (semplificazioni accettabili
ammesse); riconosce la logica risk-based.

## Profilo 5 — Adulto non esperto di AI Act
**Task:** partita completa senza alcuna introduzione, IT o EN.

**Domande post-test**
1. Che cosa fa l'AI Act, in una frase?
2. È vero che "blocca l'intelligenza artificiale"? Perché no?
3. Nel caso dell'ospedale, perché spegnere tutto non era la risposta migliore?
4. Le carte norma le hai lette o saltate?
5. Durata percepita: troppo lunga, giusta, troppo corta?

**Segnali di confusione:** rallenta su "soggetto" e "motivazione"; salta le
carte; non collega l'esito alle proprie scelte.

**Successo se:** risponde a 2 e 3 in modo coerente col gioco; finisce in
25–35 min; difficoltà percepita "impegnativa ma non frustrante".

---

## Metriche qualitative (trasversali)
- **Esiti CONFORME alla prima partita:** atteso 1–3 su 6 (6/6 = troppo facile;
  0 = troppo ostico).
- **Riletture del rapporto:** >1 per caso ⇒ feedback poco chiaro.
- **Uso spontaneo di "CONSULTA NORME"** durante la decisione ⇒ loop didattico vivo.
- **Comprensione del "contestabile":** spiegato correttamente da ≥2 tester su 3
  nei profili adulti.
- **Transfer:** frasi spontanee che citano contesto d'uso / oversight /
  etichettatura / provider-deployer.
- **Durata reale** media per caso e per partita.

## Criteri per "pronto per demo pubblica"
1. Nessun tester descrive il gioco come "un quiz".
2. Tutti distinguono **prova / classificazione / misura / soggetto / motivazione**.
3. L'esito "contestabile" è spiegato correttamente da almeno metà dei tester.
4. Il docente userebbe il debrief senza rielaborarlo; il dirigente sa rispondere
   alla domanda privacy.
5. Il funzionario PA non segnala formulazioni normative **errate**
   (semplificazioni accettabili ammesse).
6. Durata media nel range **25–35 min**; nessun blocco di navigazione; 0 errori console.
