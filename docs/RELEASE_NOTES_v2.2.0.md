# NO AI ACT — v2.2.0

**Audio, tastiera, risoluzione.**

Tre cose che il gioco prometteva e non manteneva: si sentiva sempre uguale,
non si poteva usare senza mouse, e su uno schermo grande era un 720p
ingrandito. La 2.2 chiude tutte e tre.

Lo schema di salvataggio resta **v2**: chi ha una partita in corso la
ritrova intatta, e i campi nuovi (`sfxVolume`, `musicEnabled`, `sfxEnabled`)
arrivano dai default senza migrazione. I casi restano 13, gli URL pubblici
56, le licenze quelle di prima.

---

## Audio registrato

Diciassette campioni: **sette musiche in loop**, una per momento del
procedimento — menu, città, archivio, decisione, rapporto, tensione, aula —
e **dieci effetti** legati ai gesti: aprire un fascicolo, consultare l'archivio delle norme,
citare un reperto, registrare una decisione, poter procedere, il timbro di
conformità, l'esito contestabile, il glitch sul sistema opaco, l'hover e il
click.

Città e archivio sono due ruoli distinti, non uno: scegliere quale
fascicolo aprire e spulciare i reperti di quello aperto sono momenti
diversi. Il primo è navigazione — si guarda la città, si valuta, non si è
ancora dentro niente; il secondo è l'indagine. La stessa musica su entrambi
appiattiva il passaggio che il gioco vuole far sentire.

La sintesi Web Audio che il gioco aveva prima **non è stata tolta**: è
diventata il ripiego. Chi scrive una scena non sa quale dei due sta
suonando — dichiara un ruolo o un gesto, e il sistema usa il campione se
c'è e la sintesi se non c'è. Un file mancante o illeggibile degrada il
suono, non lo spegne, anche in produzione.

**Controlli separati** in IMPOSTAZIONI: musica on/off, effetti on/off e i
due volumi (0,30 e 0,70 di partenza). Acceso/spento non è volume zero: a
zero la traccia girerebbe muta, spenta non parte. È la combinazione che
serve in aula — musica via, effetti sì.

**Peso.** Gli effetti si scaricano al primo gesto (~270 KB, servono entro
il primo secondo); ogni musica arriva quando la sua fase comincia. Misurato:
1,7 MB al primo clic invece di 8,7, con il tema sintetizzato a coprire
l'attesa.

**Mix.** Verificato lungo la catena reale, non a orecchio: musica a
0,0162–0,0183 di RMS, effetti a 0,0156–0,0259. Gli effetti stanno pari o
sopra la musica, che è dove devono stare per tagliare.

## Ogni pulsante disegnato è un pulsante vero

Il gioco disegna i comandi sul canvas: il TAB non incontrava nulla, non
c'era un anello di fuoco da seguire e uno screen reader non trovava niente
da premere. Lo strato di lettura raccontava la schermata ma era di sola
lettura — il gioco si poteva **leggere** senza poterlo **usare**.

Ora ogni pulsante registra un `<button>` trasparente sovrapposto al proprio
riquadro: stessa azione, non una seconda implementazione. Il puntatore
continua a parlare col canvas, quindi nessun clic viene gestito due volte.
I pulsanti coperti da un pannello diventano inerti, così il fuoco non esce
dal pannello aperto.

## Risoluzione

Il canvas era 1280×720 fissi e poi stirato dal browser: 1,5× su Full HD, 3×
su 4K. Ora segue lo schermo, con una scala adattiva che disegna i pixel che
il monitor mostra davvero. Misurato su sei configurazioni: **1:1 su Full HD,
2K e 4K**.

## Ritmo e chiarezza

- Velocità del testo selezionabile (lenta, normale, istantanea) con il
  suggerimento a schermo: la macchina da scrivere non si subisce più.
- Riepilogo laterale durante la decisione: i reperti citati e le scelte già
  prese restano sotto gli occhi.
- Stato della città visibile mentre si decide.
- Cruscotto di fine turno, con gli errori ricorrenti.
- Modalità di gioco dentro NUOVA PARTITA, con il piano scritto prima di
  premere INIZIA: cambiare la durata cambia davvero il numero di fascicoli.

---

## Difetti corretti

Trovati misurando, non guardando.

- **INVIO scattava due volte, e non la stessa azione.** Sulla carta norma
  partivano `CityMap` dal pulsante e `Case` dal gestore globale di Phaser:
  due scene vive insieme.
- **Il TAB usciva da un pannello aperto** su voci coperte da un modale.
- **Spegnere un pulsante lasciava un fantasma nel documento**:
  `removeAllListeners` portava via anche l'ascoltatore di `DESTROY`. Tre
  aperture del pannello, tre fantasmi.
- **Un mp3 illeggibile congelava la pagina.** Il caricamento a fasi
  rientrava in sé stesso su una promessa già risolta: un microtask dopo
  l'altro, all'infinito. Non un suono mancante — il gioco che smette di
  disegnare. Misurato: con la ricorsione la scheda non rispondeva più dopo
  90 secondi.
- **La mappa civica era disegnata al doppio** sulla schermata del titolo, e
  un `getImageData` che ignorava `ctx.scale` ne leggeva un quarto.
- **Il bordo dei pulsanti** stava a 2,2 di contrasto contro la soglia 3,0
  per gli elementi di interfaccia.

## Licenze

I campioni audio sono generati dall'autore con **ElevenLabs su piano a
pagamento**, che attribuisce all'abbonato i diritti d'uso commerciale
sull'output. Non sono materiale di terze parti: sono opera dell'autore
realizzata con uno strumento.

`LICENSE` li colloca nella **Sezione 2 (CC BY-SA 4.0)**, con gli altri
contenuti: un file audio non ha un "codice sorgente" nel senso della GPL, e
applicargliela creerebbe un obbligo privo di oggetto. La Sezione 1 continua
a coprire la *sintesi* audio, che è codice.

`CREDITS.md` porta una **dichiarazione di sintesi** esplicita: parte
dell'audio è generata da un sistema di IA. Un gioco che insegna gli
obblighi di trasparenza sui contenuti sintetici non può tacere i propri.

`ASSET_REGISTER.md` e `THIRD_PARTY_LICENSES.md` dichiaravano entrambi che
«tutti gli asset audio sono generati proceduralmente»: non era più vero e
sono stati allineati.

## Verifiche

Suite: **1126 test** su 65 file. Sette smoke del browser, due nuovi:
`audio` (rende i temi in un OfflineAudioContext e misura saturazione e
dispersione) e `action-layer` (ogni pulsante disegnato è esposto e
allineato, il TAB non esce da un pannello, un INVIO compie una sola
azione, nessun pulsante fantasma).

Ogni guardia nuova è stata provata contro un difetto vero iniettato **che
compila** — una build fallita lascia `dist` vecchio e tutto ciò che viene
dopo misura il codice di prima riportando PASS.

## Tag

`v2.2.0`, pubblicato il 16 settembre 2026 su `main`.
