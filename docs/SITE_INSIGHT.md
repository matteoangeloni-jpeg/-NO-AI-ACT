# Capire cosa succede sul sito — senza tracciare nessuno

Questo progetto non installa SDK di analytics di terze parti: le pagine
pubbliche dichiarano che non inviano nulla a fornitori terzi, e i test di
`privacyGuards` fanno fallire la build se compare un host non in allowlist.
Non è una limitazione da aggirare: è il posizionamento del progetto.

La visibilità però non manca. Viene da **tre fonti che si rispondono a
vicenda**, e ognuna sa cose che le altre non sanno.

| Fonte | Che cosa sa | Che cosa NON sa |
|---|---|---|
| `npm run insight` (locale) | Struttura: quali pagine sono sostenute dai link editoriali, quali sono fragili, quali sono sottili, dove finisce il percorso del lettore | Se qualcuno le legge |
| Cloudflare Web Analytics | Visite aggregate, pagine più viste, provenienza, dispositivo — senza cookie né stato lato client | Le query di ricerca, e perché una pagina non riceve traffico |
| Google Search Console | Query, impressioni, clic, CTR e posizione media per pagina; problemi di indicizzazione | Che cosa fa la persona una volta arrivata |

## 1. `npm run insight` — la parte strutturale

```bash
npm run insight          # report leggibile
npm run insight -- --json  # per elaborazioni successive
```

Non aggiunge nulla al sito pubblicato: legge il repository. Serve a
rispondere alle domande che di solito si prova a girare a un SDK di analytics,
ma che in realtà sono domande sulla **struttura**, non sui visitatori.

Le sezioni, e come si leggono:

- **Best supported pages** — le pagine verso cui puntano più link editoriali
  (quelli dentro `<main>`, esclusi menu e footer, che comparirebbero ovunque e
  falserebbero il conteggio). Sono le pagine su cui il sito "scommette".
  Se una pagina strategica non è qui, il problema è di collegamenti interni,
  non di contenuto.
- **Fragile** — pagine raggiungibili dal menu ma con al massimo un link
  editoriale in entrata. Non sono orfane (l'audit fallirebbe), ma dipendono
  quasi solo dalla navigazione: per Google contano poco e per il lettore sono
  vicoli laterali. **È la lista più azionabile del report.**
- **Thinnest content** — sotto le 600 parole. Utile incrociata con Search
  Console: una pagina sottile che riceve *impressioni* ma pochi clic è una
  candidata perfetta all'approfondimento; una pagina sottile senza impressioni
  è probabilmente un problema di posizionamento, non di lunghezza.
- **Dead ends** — pagine senza link editoriali in uscita: il percorso del
  lettore finisce lì. Dovrebbero essere zero.
- **Single-language pages** — pagine senza controparte nell'altra lingua.
  È corretto che dichiarino solo `hreflang` `en` + `x-default`: aggiungere un
  `hreflang="it"` verso una pagina non equivalente sarebbe un errore vero.
  Questa lista serve a decidere se vale la pena *scrivere* la controparte.

## 2. Cloudflare Web Analytics — la parte "quante persone"

Dashboard Cloudflare → Analytics & Logs → Web Analytics, dominio
`no-ai-act.eu`. È cookieless per costruzione: nessun consenso richiesto,
nessun identificatore persistente, e per questo **non** offre funnel, sessioni
individuali o replay. Quello che dà, e che basta per le decisioni editoriali:

- pagine più viste nel periodo;
- referrer (da dove arrivano);
- ripartizione per paese e dispositivo.

Da guardare una volta a settimana, non ogni giorno: i numeri di un sito
educativo si muovono su scala settimanale.

## 3. Google Search Console — la parte "perché"

Proprietà dominio `sc-domain:no-ai-act.eu`. È la fonte che dice **con quali
parole** le persone arrivano, ed è l'unica che permette di distinguere i due
fallimenti che si somigliano:

- **impressioni alte, CTR basso** → il posizionamento c'è, il problema è
  title/description: la pagina non convince nella SERP;
- **impressioni basse** → il problema è a monte (contenuto, collegamenti
  interni, autorevolezza): riscrivere il title non serve a niente.

## Il ciclo settimanale, in pratica

1. Apri Search Console → *Prestazioni* → ultimi 28 giorni, ordina per
   impressioni.
2. Prendi le prime 10 pagine e confrontale con l'output di `npm run insight`:
   - pagina con molte impressioni ma **in "Fragile"** → aggiungi 2-3 link
     editoriali da pagine tematicamente vicine;
   - pagina con molte impressioni ma **in "Thinnest"** → approfondiscila con
     esempi, tabelle, casi (come è stato fatto per le quattro pagine
     normative);
   - pagina con molte impressioni e CTR sotto il 2% → il title e la
     description sono da riscrivere, il contenuto no.
3. Controlla in Cloudflare se le pagine più viste coincidono con quelle più
   cliccate da ricerca: se no, il traffico arriva da altrove (link esterni,
   social) ed è un segnale su dove il progetto sta funzionando.
4. Ogni volta che pubblichi modifiche sostanziali, ristampa i `lastmod`:
   `node scripts/seo/update-sitemap-lastmod.mjs`.

## E se in futuro servisse un SDK di analytics?

Va valutato come una **modifica alla postura pubblica del progetto**, non
come un'aggiunta tecnica, perché tocca tre cose insieme:

1. le frasi pubblicate su `/privacy-by-design/` e `/en/privacy-by-design/`
   («non invia nulla a fornitori terzi», «senza cookie né stato lato client»);
2. `release.config.json` → `runtimeHostAllowlist` e il blocco `privacy`;
3. i test `privacyGuards`, che fanno fallire la build sugli host non previsti.

In più, in UE, uno strumento che scrive identificatori persistenti richiede di
norma un consenso preventivo — il motivo per cui era stato scelto Cloudflare,
che essendo cookieless non lo richiede. Se un giorno si decidesse di
procedere, l'unica configurazione che resta coerente con quanto il sito
promette è: nessun cookie (persistenza in memoria), autocapture disattivato,
session replay disattivato **dal codice**, Do-Not-Track rispettato, solo sulle
pagine pubbliche e mai dentro `/play/` — con le tre cose sopra aggiornate
nella stessa PR.
