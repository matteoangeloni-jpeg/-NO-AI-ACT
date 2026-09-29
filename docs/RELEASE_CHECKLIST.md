# RELEASE CHECKLIST — NO AI ACT

**Come leggere questo documento.** La prima parte è una **procedura**: vale per
qualunque release e non nomina un numero di versione. La seconda è lo **stato
della release corrente**, che invecchia a ogni rilascio e per questo porta il
numero in testa: se quel numero non è quello che stai rilasciando, la tabella è
storia, non istruzioni.

> **Perché la distinzione è scritta qui in cima.** Fino al 29 settembre 2026
> questo file era l'istantanea dell'hardening della v0.4.0, e tre documenti ci
> rimandavano il proprietario per tagliare la v3.0.0. Alla voce 14 diceva «tag
> da NON creare ora» e i comandi in fondo dicevano `git tag -a v0.4.0`:
> seguendolo alla lettera si taggava la versione sbagliata, o non si taggava
> affatto. Anche la sezione `npm audit` era falsa — cinque vulnerabilità e una
> decisione di rinviare Vite 8, quando Vite 8 è installato e le vulnerabilità
> sono zero. Nessun test poteva vederlo: è prosa su una procedura, e le
> procedure che nessuno riverifica invecchiano peggio del codice.

---

## Parte 1 — La procedura (vale per ogni release)

### Cancelli automatici (🔴 bloccanti)

Si eseguono nell'ordine, e l'ordine conta:

```bash
npm run typecheck        # tsc --noEmit: vitest NON tipizza
npm test                 # suite completa
npm run build            # se questo fallisce, i due sotto non valgono niente
npm run verify:dist      # completezza del dist + affermazioni normative superate
npm run audit:seo        # indicizzabilità: canonical, hreflang, titoli, sitemap
npm run smoke:all        # partite vere sul dist appena costruito
```

Tre trappole misurate su questo repository, non ipotesi:

- **`vitest` non tipizza.** Una suite verde non prova che il build sia verde: i
  literal di tipo sbagliati in un test nuovo escono solo nella passata `tsc`.
- **`verify:dist` e `smoke:all` su un dist vecchio passano e non significano
  nulla.** Se `build` fallisce, si corregge il build e si rilanciano; e non si
  ricostruisce il dist **mentre** la suite smoke ci sta girando sopra.
- **`smoke:all` nei container di sviluppo agentico va lanciato con
  `CHROMIUM_PATH=/opt/pw-browsers/chromium`.** Playwright cerca la build 1228,
  il container ne ha una diversa, e l'errore che stampa consiglia
  `npx playwright install` — che in un ambiente con egress limitato e disco a
  quota non è la cosa da fare. Il browser c'è già: basta indicarglielo.

### Verifica live a mano (🔴 bloccante, richiede una persona)

**L'ambiente di sviluppo agentico non raggiunge il sito pubblico**: l'egress
proxy nega la connessione a `www.no-ai-act.eu` e a `github.io`. Da lì il deploy
si può attestare solo in due modi indiretti — il workflow `deploy.yml` verde sul
commit di release, e il `dist/` costruito localmente dallo stesso commit. Sono
prove del fatto che il deploy **è girato**, non del fatto che la pagina servita
sia quella giusta. Quel controllo è di chi ha un browser:

1. aprire il sito pubblico e confermare che la versione dichiarata sia quella
   che si sta rilasciando;
2. title screen → boot → mappa, **senza errori in console** (il notice sulle
   licenze in `console.info` è atteso);
3. cambiare lingua IT ↔ EN, cambiare difficoltà, scegliere un percorso;
4. giocare almeno due casi fino al rapporto ispettivo, **uno dei quali nuovo in
   questa release** se ce n'è uno;
5. attivare la modalità docente e aprire il debrief a fine partita;
6. su smartphone in portrait: verificare la comparsa della mobile guard.

Il dettaglio sta in [`SMOKE_CHECKLIST.md`](SMOKE_CHECKLIST.md).

### Prima del tag, in quest'ordine

| # | Voce | Bloccante? |
|---|---|---|
| 1 | `main` contiene il commit di release | 🔴 |
| 2 | `package.json` e `package-lock.json` alla versione nuova — via `node scripts/release/bump-version.mjs <versione>` | 🔴 |
| 3 | I sei cancelli automatici verdi **sullo stesso commit** | 🔴 |
| 4 | Workflow `deploy.yml` success su quel commit | 🔴 |
| 5 | Verifica live a mano | 🔴 |
| 6 | `docs/RELEASE_NOTES_v<versione>.md` scritte | 🟡 |
| 7 | README allineato: stato attuale, conteggi, roadmap | 🟡 |
| 8 | `npm audit --audit-level=moderate` **eseguito ora**, non citato | 🟡 |
| 9 | Smoke mobile (portrait / landscape / tablet) | 🟡 |

Sulla voce 2 c'è un limite scritto dentro lo script e va ripetuto qui, perché è
il punto in cui questa procedura è già stata sbagliata tre volte: uno script non
distingue *la versione che un file dichiara* da *la versione di cui un file
parla*. L'elenco che `--prova` stampa **va letto**, non scorso, e ogni `.md`
dentro è un candidato a contenere prosa sul passato che il bump rende falsa.

Sulla voce 8: eseguirlo, non fidarsi di quanto c'è scritto in questo file. E se
dice «0 vulnerabilità», controllare che abbia davvero guardato — `npm audit
--json` riporta quante dipendenze ha analizzato, e uno zero con zero dipendenze
analizzate è un registry non raggiunto, non un progetto sano.

### Il tag

**Il tag lo mette il proprietario.** Non è una cortesia: le credenziali delle
sessioni di sviluppo agentico sono limitate al branch, e un push di tag
restituisce 403 — verificato, non supposto. Nessuna release è mai stata
pubblicata a suo nome e non deve esserlo.

Solo dopo che tutti i 🔴 sono verdi:

```bash
git checkout main && git pull
git tag -a v<versione> -m "NO AI ACT v<versione>"
git push origin v<versione>
```

Poi creare la release GitHub usando `docs/RELEASE_NOTES_v<versione>.md`.

---

## Parte 2 — Stato della release corrente: **v3.0.0**

Il contenuto della 3.0.0 è entrato in `main` con `7061213` (PR #105). Se stai
leggendo questa tabella per una versione diversa dalla 3.0.0, è storia.

**Su quale commit va il tag.** Su `main`, non su `7061213`. I commit arrivati
dopo sono documentazione — questa checklist compresa — e non cambiano né il
codice né i contenuti pubblicati: verificato che né il README né `docs/` entrino
nel `dist`, e che nessuna stringa di quelle modifiche vi compaia. `7061213`
serve a sapere *da dove* arriva la 3.0.0, non a essere il bersaglio del tag. I
cancelli della riga 3 sono stati eseguiti prima su `7061213` e poi di nuovo dopo
le correzioni ai documenti, con gli stessi esiti.

| # | Voce | Stato | Come lo so |
|---|---|---|---|
| 1 | `main` contiene il commit di release | ✅ | `7061213`, squash di PR #105 |
| 2 | versione portata a 3.0.0 | ✅ | `package.json`, `CITATION.cff`, 70 file nel dist; nessun residuo `2.3.0` fuori dai documenti storici |
| 3 | i sei cancelli automatici | ✅ | eseguiti su `7061213`: typecheck 0 errori · **1218 test su 72 file** · build · verify:dist PASS · audit:seo PASS (68 rotte) · **smoke:all 10/10** |
| 4 | deploy su `main` | ✅ | workflow `deploy.yml` run #217, conclusion `success` |
| 5 | **verifica live a mano** | ✋ | **non eseguibile da qui**: egress negato verso il sito pubblico |
| 6 | note di rilascio | ✅ | [`RELEASE_NOTES_v3.0.0.md`](RELEASE_NOTES_v3.0.0.md) |
| 7 | README allineato | ✅ | stato attuale, 14 casi, roadmap, e i conteggi di URL riportati a 68 |
| 8 | `npm audit --audit-level=moderate` | ✅ | **0 vulnerabilità su 70 dipendenze analizzate**, misurato il 29 set 2026 |
| 9 | smoke mobile | ✋ | richiede un dispositivo reale |
| 10 | **tag `v3.0.0`** | ⛔ | spetta al proprietario, dopo la voce 5 |

### Sulla voce 8, perché il cambiamento è grosso

Le cinque vulnerabilità che questo documento elencava (3 moderate, 1 high,
1 critical) stavano tutte nella catena `esbuild → vite → vitest`, e la decisione
scritta era di **non** applicare il fix perché portava a Vite 8, un major
potenzialmente rompente. Vite 8 è poi stato adottato: oggi `package.json` chiede
`^8.2.2`, `esbuild` non risulta più fra le dipendenze risolte, e l'audit trova
zero avvisi. La decisione di allora è stata superata dai fatti, e il documento
non se n'era accorto.
