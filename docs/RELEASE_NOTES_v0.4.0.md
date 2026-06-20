# NO AI ACT v0.4.0 — Progressione, difficoltà e caso credito/welfare

*Bozza delle release notes. Da pubblicare come release GitHub solo dopo la
verifica live manuale e l'autorizzazione esplicita del proprietario.*

NO AI ACT è un serious game investigativo sull'AI Act europeo, giocabile in
browser. Sei un ispettore per gli incidenti algoritmici in una città dove l'AI
Act non è mai entrato in vigore: raccogli i reperti, classifica i sistemi e firma
un rapporto motivato.

▶ Gioca: <https://matteoangeloni-jpeg.github.io/-NO-AI-ACT/>

## Cosa cambia in questa versione

- **Nuovo caso — "Il credito civico" (caso 7).** Un caso-specchio sul confine tra
  social scoring **vietato** (art. 5), welfare predittivo **ad alto rischio**
  (Allegato III) e valutazione di affidabilità economica. Insegna che **non ogni
  punteggio è vietato**: contano finalità, dati usati, contesto ed effetti sui
  diritti.
- **Tre difficoltà selezionabili.**
  - *Base*: istruzioni esplicite, un suggerimento mirato dopo un errore,
    valutazione più indulgente sui vizi lievi.
  - *Standard*: feedback equilibrato, consigliata per la demo.
  - *Esperto*: pochi suggerimenti, severità su soggetto responsabile e motivazione.
- **Quattro percorsi / missioni.** Demo rapida (~10–15′), Laboratorio breve
  (~25–35′), Percorso completo (~45–60′), Percorso avanzato (~60–75′, include il
  credito civico). La mappa evidenzia i casi consigliati; nessun caso è bloccato.
- **Reperti con fonte.** Ogni reperto ha un'etichetta di provenienza
  (amministrativa, tecnica, vendor, reclamo, pubblica, log, interna) e il
  rapporto ispettivo mostra la riga **"Prove decisive"**: i reperti citati
  reggono — o no — la classificazione.
- **Modalità docente più chiara.** Il debrief locale riporta missione, difficoltà
  e una nota privacy esplicita. È un **supporto locale**: non crea classi, non
  registra studenti, non invia nulla a un server. Export `.txt`/`.json` generati
  sul dispositivo.
- **Mobile guard.** Su smartphone in portrait un avviso invita a ruotare il
  dispositivo (IT/EN). Non tocca il desktop né raccoglie dati.

## Privacy

- Nessun account, nessun backend, nessun dato personale.
- Nessun nome, email, scuola o classe; nessun identificativo persistente.
- Salvataggio solo in locale (localStorage).
- Analytics remoti **disattivati di default**; rispettano Do Not Track.
- La modalità docente produce solo un debrief locale; eventuali export sono
  generati sul dispositivo e condivisi manualmente.

## Limiti noti

- Ottimizzato per **desktop e tablet in orizzontale**; su smartphone in portrait
  compare un avviso (non è un'esperienza mobile-first).
- **Versione didattica semplificata** del Regolamento (UE) 2024/1689: **non
  sostituisce una consulenza legale**.
- Rendering su canvas Phaser: non pienamente compatibile con screen reader.
- Nessun dato personale raccolto.
- **Playtest reale in corso / da avviare** prima della presentazione pubblica.

## Prossimi passi

- v0.4.1: bugfix, microcopy e UX dai playtest; eventuale aggiornamento dipendenze.
- v0.5: modalità docente più ricca, materiali didattici, missioni guidate.
- v1.0: revisione giuridica formale, asset finali, pacchetto stabile.

## Note tecniche

- Stack: TypeScript (strict) + Phaser 3 + Vite; asset 100% procedurali.
- Suite automatizzata (oltre 100 test) e build verdi.
- Codice: MIT · contenuti narrativi e didattici: CC BY 4.0.
