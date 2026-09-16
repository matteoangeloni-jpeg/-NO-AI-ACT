# Sistema visivo procedurale

Tutta la grafica di NO AI ACT è generata a runtime da codice: non c'è un solo
file d'immagine nel gioco. Questo documento dice **dove sta cosa**, **quali
regole valgono** e **cosa le tiene in piedi**, perché un sistema procedurale
senza regole scritte diventa in fretta quattro generatori che si copiano a
vicenda.

## Dove sta cosa

| file | genera |
|---|---|
| `src/game/assets/procedural/kit.ts` | le primitive: carta, grana, cornici di timbro, omissis, reticoli, disturbo, fori da faldone, crocini, strisce di protocollo |
| `createCityMap.ts` | lo sfondo della mappa |
| `createIcons.ts` | le icone dei settori |
| `createParticles.ts` | le particelle |
| `createDossierTextures.ts` | le due carte: fascicolo e rapporto |
| `documentStyles.ts` | i sette fogli dei reperti, uno per tipo di fonte |
| `civicNetwork.ts` | la rete di collegamenti fra i sistemi della città |
| `stamps.ts` | le cornici dei timbri: esito sulla mappa, «citato» sui reperti |
| `decisionSeal.ts` | il sigillo del rapporto, diverso per ogni caso ed esito |

## Le cinque regole

**1. Niente `Math.random()`.** Ogni generatore semina il proprio numero
pseudo-casuale con `seeded(chiave)`. Un fascicolo riaperto deve avere la
faccia di prima: se cambia, il giocatore non riconosce il documento che stava
leggendo.

**2. Unità logiche, non pixel.** Chi crea la texture applica `ctx.scale` una
volta; le primitive disegnano sempre in unità logiche. L'unica eccezione è la
grana, che si misura in pixel veri del canvas — `getImageData` non vede
`ctx.scale`, e chiederla in unità logiche legge un quarto dell'immagine.

**3. Nessuna parola dentro una texture.** Le texture nascono una volta sola al
preload e **sopravvivono al cambio di lingua**, che ricarica la schermata ma
non le texture. Qualunque parola cotta nei pixel resta nella lingua di chi
l'ha scritta: è successo davvero, con `ISPETTORATO AX` stampato nella carta e
`CONFORME` nei timbri della mappa, entrambi mostrati in italiano anche a chi
giocava in inglese. Le cornici sono mute; la parola la mette un testo di
Phaser, che segue la lingua, si ingrandisce con il resto e arriva allo strato
di lettura.

**4. La misura generata è la misura mostrata.** Una texture generata a 900×560
e mostrata in un riquadro da 940×580 esce stirata del 4%: succedeva al
rapporto, ed era il motivo per cui la sua carta sembrava sfocata dove il resto
era nitido. Ogni carta si genera alla misura con cui la scena la disegna.

**5. Le misure si prendono dalle parole.** La cornice d'esito era 132px con
l'etichetta a 11px: «PARZIALMENTE CONFORME» ne occupa 139 e usciva da tutte e
due le parti. Non si vedeva provando il gioco — l'esito parziale è il meno
frequente e l'inglese è più corto — quindi la larghezza si calcola
dall'etichetta più lunga di **tutte** le lingue.

## Cosa lo tiene in piedi

`tests/proceduralTextures.test.ts` — dieci controlli, tutti su elenchi **letti**
e mai ricopiati: i generatori dal disco, gli esiti e le etichette da i18n, le
misure richieste dalle scene.

- nessun generatore chiama `fillText`/`strokeText` (regola 3)
- nessun generatore importa i18n (la stessa regola, aggirata dall'altro lato)
- ogni carta generata è usata da qualcuno, alla misura giusta (regola 4)
- sei inchiostri × due carte superano la soglia AA di contrasto
- ogni esito che i18n dichiara ha un sigillo, e il suo colore si legge
- le etichette stanno dentro le cornici, in italiano e in inglese (regola 5)

`tests/documentStyles.test.ts` — leggibilità e distinzione dei sette fogli.
`tests/civicNetwork.test.ts` — la topologia della rete: nessun nodo isolato,
nessun doppione, i collegamenti vanno ai vicini veri.
`tests/renderScale.test.ts` — ogni `add.image` dichiara la misura con cui si
mostra. La regola non ha un elenco di chiavi: in questo gioco nessuna texture
arriva da un file, e il controllo verifica anche quella premessa.

## Accessibilità

Nessun trattamento procedurale può essere l'unico portatore di
un'informazione. Lo stato di un caso si legge dal timbro **e** dalla parola;
un collegamento interrotto sulla mappa è interrotto davvero, con un vuoto in
mezzo, non solo rosso. Le animazioni passano tutte da
`StateManager.reducedMotion`. Il testo resta testo di Phaser, quindi segue lo
strato di lettura e l'ingrandimento.
