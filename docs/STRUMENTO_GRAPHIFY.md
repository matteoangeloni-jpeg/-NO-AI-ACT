# graphify — grafo di conoscenza del repository

Installato il 20 ottobre 2026, su richiesta del proprietario.
Fonte: <https://github.com/Graphify-Labs/graphify> · pacchetto PyPI `graphifyy`
· licenza **Apache-2.0** (con parti storiche MIT, vedi il suo `NOTICE`).

---

## 1. Che cos'è, e la distinzione che conta per questo progetto

Una CLI Python che analizza il repository con **tree-sitter** e ne costruisce un
grafo di nodi (simboli, file, concetti) e archi (chiamate, import, riferimenti),
interrogabile invece di cercare a tentoni fra i file.

**È uno strumento di sviluppo, non codice del prodotto.** La distinzione non è
formale: questo progetto ha la regola «deve essere tutto mio» e un
`runtimeHostAllowlist` imposto dai test, e quelle regole riguardano **ciò che il
sito pubblica**. graphify sta accanto al codice, come `vitest` o `playwright`,
e nulla di esso entra nel bundle. La regola non è stata piegata: non la tocca.

## 2. Comandi

```bash
npm run graph:install   # uv tool install graphifyy && graphify install
npm run graph:update    # ricostruisce il grafo (tree-sitter, nessun modello)
npm run graph:ask "..." # interroga il grafo
```

E direttamente, i comandi che servono più spesso:

```bash
graphify god-nodes              # i nodi più connessi: gli snodi dell'architettura
graphify affected "L()"         # che cosa si rompe se cambio questo
graphify explain "NormCard"     # un nodo e i suoi vicini, in parole
graphify path "TitleScene" "SaveSystem"   # il percorso più corto fra due cose
```

**Prima misura su questo repository**, 20 ottobre 2026: 296 file, **2655 nodi,
5995 archi, 166 comunità**. Il nodo più connesso è `L()`, l'accessore dei
dizionari, con **125 archi** — più di `Button` (89) e di `phaser` (55). È un
dato utile e non ovvio: dice che il sistema delle lingue è lo snodo
architetturale del progetto, e spiega perché aggiungere il francese ha toccato
nove test che nessuno avrebbe collegato all'i18n.

## 3. Che cosa esce dalla macchina, e quando

La domanda giusta per un progetto la cui postura pubblica è «nulla lascia il
dispositivo».

| percorso | che cosa fa | esce qualcosa? |
|---|---|---|
| `graphify update` — **quello che usiamo** | estrazione AST con tree-sitter, clustering locale | **no** |
| nomi delle comunità | chiede a un modello di etichettare i gruppi | **sì**, se configuri una chiave; senza chiave resta `Community N` |
| passata semantica su documenti, PDF, immagini | usa il modello dell'assistente o una chiave API | **sì** |
| Graphify Cloud | servizio a pagamento, grafo sempre attivo | **sì**, per definizione |

**Nessuna chiave API è configurata in questo ambiente**, e il comando negli
script npm è quello che non ne usa. Gli host che il pacchetto può contattare
(`api.openai.com`, `generativelanguage.googleapis.com`, `api.deepseek.com`,
`api.moonshot.ai`, `app.graphify.com`) sono raggiunti **solo** dai percorsi che
una chiave abilita.

**Una decisione che resta al proprietario:** se un giorno vuoi la passata
semantica sui documenti, quel repository contiene ~28.000 parole di prosa
editoriale e la valutazione d'impatto privacy del progetto. Mandarla a un
modello di terze parti è una scelta, non un dettaglio tecnico, e va presa
sapendolo.

## 4. Il difetto che l'installazione ha quasi introdotto

Fra i tre output c'è `graphify-out/graph.html`, che carica **vis-network da
`unpkg.com`**. Nel repository non fa alcun danno. **Nel `dist` sarebbe la
rottura di una promessa pubblica**: il sito dichiara di non inviare nulla a
fornitori terzi oltre all'analytics cookieless di Cloudflare.

Due barriere, non una:

1. `graphify-out/` è in `.gitignore`, col motivo scritto accanto;
2. `tests/toolArtifacts.test.ts` **pretende** la proprietà: l'artefatto escluso
   dal repository, assente dal `dist`, e nessun host nuovo nella allowlist di
   runtime. Provata rossa su tre difetti distinti — il grafo nel `dist`,
   `unpkg.com` aggiunto alla allowlist «per far funzionare la visualizzazione»,
   e la riga di `.gitignore` cancellata.

Una riga di `.gitignore` è un'intenzione: si cancella per sbaglio, si aggira con
`git add -f`, e non dice niente a chi copia una cartella a mano.

### E un controllo esistente è diventato rosso un minuto dopo il primo grafo

`releaseIntegrity` cerca affermazioni normative superate enumerando «gli HTML
del repository». Con `graphify-out/graph.html` nel repository ha trovato i nomi
dei simboli del codice e ha segnalato un difetto inesistente. L'arrivo di uno
strumento ha cambiato il significato di quell'enumerazione.

Escluso l'artefatto — e **verificato che la guardia prenda ancora il difetto
vero**, iniettando «11 casi» in `index.html`: rossa. Escludere un artefatto e
zittire un controllo si somigliano troppo per non distinguerli con una prova.

## 5. Come fa a esserci in ogni sessione

**Il container è effimero**: `uv tool install` scrive in `/root/.local` e
`graphify install` in `/root/.claude/skills/`, e spariscono quando la sessione
viene riciclata.

La soluzione **sta nel repository**, non in un'impostazione da cercare:
`.claude/hooks/session-start.sh`, registrato in `.claude/settings.json`, gira
all'avvio di ogni sessione web e fa tre cose:

| | |
|---|---|
| `npm install` | senza, niente test e niente build |
| `CHROMIUM_PATH=/opt/pw-browsers/chromium` | senza, `smoke:all` muore con un errore che consiglia `npx playwright install` — la cosa da non fare con egress limitato e disco a quota. È costato un'ora di diagnosi il 29 settembre 2026 |
| `uv tool install --force graphifyy && graphify install` | graphify pronto |

**È sincrono di proposito.** La sessione parte un po' più tardi, ma non parte
mai con metà degli strumenti pronti: un hook asincrono introduce una corsa fra
chi installa e chi lancia i test.

**Non è bloccante per graphify.** Se l'installazione fallisce la sessione parte
comunque e lo dice, col motivo a schermo: un grafo mancante non impedisce di
lavorare, e far fallire l'avvio per uno strumento accessorio sarebbe
sproporzionato. Si rimedia con `npm run graph:install`.

**Gira solo sul remoto.** Su una macchina locale esce subito senza fare niente:
l'ambiente è di chi la usa, e un hook che installa strumenti a sua insaputa è
un'invadenza.

### Due cose trovate provando l'hook, non leggendolo

1. **`uv tool install` senza `--force` non ricompone uno stato a metà.** Con il
   pacchetto registrato e il binario assente risponde «già installato» e NON
   ricrea l'eseguibile: il passo dopo fallisce e la sessione resta senza
   strumento. Scoperto nascondendo il binario e rilanciando l'hook.
2. **La prima stesura nascondeva l'errore.** Mandava tutto in `/dev/null` e
   stampava «non installato» senza dire perché. Ora l'uscita dell'errore arriva
   a schermo: un guasto diagnosticabile non va ridotto a una riga muta.

**Serve una cosa da te, una volta:** l'hook entra in funzione quando è sul ramo
principale. Finché resta sul branch, le sessioni nuove non lo vedono.
