# Audio

Il gioco suona in due modi e non te ne accorgi: **campioni registrati** se i
file ci sono, **sintesi Web Audio** se non ci sono. Chi scrive una scena non
sa quale dei due sta uscendo dalle casse, e non deve saperlo.

## Dove stanno i file

`src/game/assets/audio/`. Sedici file `.mp3`, con i nomi dichiarati in
`src/game/systems/audioAssets.ts`. Sono generati dall'autore con ElevenLabs
su piano a pagamento; provenienza e licenza stanno in `CREDITS.md`.

Non è `public/`, ed è una scelta. Vite guarda dentro quella cartella quando
compila: manda in `dist/` solo i file che ci sono davvero e ne consegna al
gioco gli indirizzi. Da `public/` non potrebbe saperlo, e il gioco dovrebbe
chiedere tutti e sedici i file alla cieca, riempiendo la console di errori
di rete per ogni campione non ancora copiato.

Un file assente quindi non è un errore e non è nemmeno una richiesta: è una
voce che non esiste, e al suo posto suona la versione sintetizzata.

## Come è fatta la catena

```
effetti (campione o sintesi) → sfxGain   ┐
musica  (campione o sintesi) → musicGain ┴→ master → destination
```

- `master` è il muto globale: taglia tutto.
- `musicGain` e `sfxGain` hanno volume e interruttore propri.
- Anche la sintesi passa dal bus degli effetti, altrimenti il cursore
  "volume effetti" governerebbe solo metà dei suoni — e quale metà
  dipenderebbe da quali file sono stati copiati.

## Che cosa chiama una scena

Due sole cose, mai un file.

**Un ruolo musicale**, cioè il momento del procedimento:

```ts
AudioSystem.setMusicRole('decision', this.caseData.id);
```

Il secondo argomento è il tema *sintetizzato* di ripiego. Senza campione il
gioco si comporta come si è sempre comportato; con il campione parte quello,
in loop, incrociandosi sulla traccia precedente in 1,6 secondi.

I ruoli sono `menu`, `city`, `archive`, `decision`, `debrief`, `tension`,
`classroom`. `city` e `archive` sono separati di proposito: la mappa, la
scelta del fascicolo e la consultazione dell'archivio sono navigazione — si
valuta, non si è ancora dentro niente — mentre `archive` copre il fascicolo
aperto e i suoi reperti, cioè l'indagine vera. Un ruolo senza tema di ripiego (il menu) resta muto quando il
campione manca, e zittisce comunque ciò che suonava prima: lasciar correre
la musica della schermata precedente sarebbe peggio del silenzio.

**Un gesto**, cioè quello che il giocatore ha fatto:

```ts
AudioSystem.citeEvidence();
```

`openCase`, `openLegalArchive`, `citeEvidence`, `registerDecision`,
`canProceed`, `stampConforme`, `errorContestable`, `glitchOpacity`,
`hover`, `click`. Ognuno ha il suo campione e il suo ripiego sintetizzato;
gli effetti si sovrappongono fra loro e alla musica.

C'è anche `AudioSystem.silence()`, per il vuoto deliberato dopo una
decisione grave: la musica riparte quando la scena successiva dichiara il
proprio ruolo.

## Volumi e muto

Quattro controlli in IMPOSTAZIONI, più il muto globale:

| controllo | campo salvato | predefinito |
|---|---|---|
| AUDIO: ON/OFF | `audioMuted` | acceso |
| MUSICA: ON/OFF | `musicEnabled` | acceso |
| MUSICA: % | `musicVolume` | 0,30 |
| EFFETTI: ON/OFF | `sfxEnabled` | acceso |
| EFFETTI: % | `sfxVolume` | 0,70 |

I volumi scattano di un quarto alla volta e ripartono da 25% dopo il 100%.
Acceso/spento **non** è volume zero: a zero la traccia girerebbe muta,
spenta non parte proprio. È la combinazione che serve in aula — musica via,
effetti sì.

Da codice:

```ts
AudioSystem.setMusicVolume(0.3);   // 0..1, persistito
AudioSystem.setSfxVolume(0.7);
AudioSystem.setMusicEnabled(false); // ferma la traccia, non la ammutolisce
AudioSystem.setSfxEnabled(true);
AudioSystem.toggleMute();           // muto globale
```

Le preferenze sopravvivono a una partita nuova e a un salvataggio vecchio:
`hydrateV2` riempie i campi mancanti con i default, quindi chi ha già
giocato eredita 0,30 e 0,70 senza migrazioni.

## Un file illeggibile non deve congelare il gioco

`AudioBank.ensureMusic` ricorda la propria promessa. Per un campione
assente o che non si decodifica quella promessa è **già risolta**, quindi
un `then` che rientrasse in `applyRole` si richiamerebbe subito, un
microtask dopo l'altro, all'infinito: la pagina smette di rispondere e il
gioco smette di disegnare.

È stato misurato: togliendo un mp3 dal pacchetto pubblicato, con la
ricorsione la scheda non rispondeva più dopo 90 secondi; senza, il gioco
continua a girare a pieni fotogrammi e suona il tema sintetizzato.

La ricorsione è stata tolta alla radice — chi ottiene il campione chiama
`startTrack` e basta — e un controllo impedisce che torni.

## Se un effetto suona basso

Non toccare il file. `SFX_TRIM` e `MUSIC_TRIM` in `audioAssets.ts` sono i
guadagni per campione: `1` significa "come consegnato". Un effetto di mezzo
secondo suona più piano di un tappeto musicale anche a pari volume di
picco, perché l'orecchio media sulla durata — è normale doverlo alzare.
Correggerlo lì invece che nei file lascia intatti gli originali e permette
di annullare una correzione sbagliata cambiando un numero.

## Autoplay e peso

Niente suona prima del primo gesto dell'utente, e niente si **scarica**
prima: il contesto audio nasce dentro `AudioSystem.init()`, e il banco dei
campioni parte da lì. Chi apre la pagina per leggere e se ne va non paga il
download.

E non si scarica tutto insieme. Gli **effetti** sì, subito: dieci file per
circa 270 KB, servono entro il primo secondo di gioco. Le **musiche** no:
sono sei loop da un minuto, 1,4 MB l'uno, e una sessione ne attraversa due
o tre. Ognuna arriva quando la sua fase comincia, e intanto suona il tema
sintetizzato — l'attesa non è mai silenzio.

Misurato in locale: **1,7 MB al primo clic** invece di 8,7, e 3,1 MB dopo
essere entrati nella mappa. Su una linea scolastica da 4 Mbps la differenza
fra i due è di circa quattordici secondi.

L'hover sui pulsanti è l'unica eccezione apparente: suona, ma non chiama
`init()`. Il passaggio del mouse non è un gesto che i browser accettano
come sblocco, e provarci lascerebbe un contesto sospeso invece di suonare.
Finché non c'è stato un clic o un tasto, l'hover è muto.

## Che cosa è sotto controllo automatico

`tests/audioIntegration.test.ts` e `tests/privacyGuards.test.ts`:

- ogni ruolo e ogni gesto ha file, guadagno e indirizzo;
- nessun nome di file audio esiste fuori dal manifesto;
- nessuna scena si costruisce una sorgente audio per conto suo (sfuggirebbe
  ai cursori e al muto);
- ogni gesto ha un ripiego sintetizzato — un gesto che suona solo col
  campione compila benissimo e produce un gioco muto dove i file non sono
  arrivati;
- il banco scarica solo dalla nostra origine, e un file mancante non
  finisce in console;
- il contesto audio nasce solo dentro `init()`.

Tutti e quattro i difetti corrispondenti sono stati iniettati e visti
rossi.
