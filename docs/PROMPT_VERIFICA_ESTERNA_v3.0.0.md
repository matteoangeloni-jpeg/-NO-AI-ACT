# Prompt da dare a ChatGPT — verifica esterna del sito pubblicato

**Che cosa è questo file.** Un prompt pronto da incollare, e prima di esso due
avvertenze su cosa un assistente con accesso al web **può** e **non può** fare
al posto tuo. Saltare le avvertenze porta a credere verificato ciò che non lo è.

---

## Prima: due cose che NON si possono subappaltare

**1. Il tag `v3.0.0`.** Richiede le tue credenziali git. Nessun assistente può
metterlo: da qui un push di tag restituisce 403 (verificato), e ChatGPT non ha
accesso al repository. Sono tre comandi e trenta secondi:

```bash
git checkout main && git pull
git tag -a v3.0.0 -m "NO AI ACT v3.0.0"
git push origin v3.0.0
```

**2. Giocare il gioco.** Il gioco è Phaser dentro un canvas: si comanda con
mouse e tastiera e non lascia testo leggibile nel sorgente della pagina. Un
assistente che legge l'HTML **non può** dirti se la mappa si apre, se un caso si
completa, se la console è pulita. Se ti dice che l'ha fatto, lo sta inventando.
Chiedigli invece esattamente ciò che si vede nel sorgente — è quello che il
prompt qui sotto gli chiede, e non una riga di più.

Quella verifica vale comunque: controlla i testi, i numeri e i metadati che il
sito pubblica, cioè tutto quello che Google indicizza e che un lettore legge
prima di premere «gioca». Il giro di gioco resta da fare a te, dieci minuti, con
la lista in `docs/SMOKE_CHECKLIST.md`.

---

## Il prompt (da qui in giù, copia e incolla)

> Sei un verificatore indipendente. Devi controllare un sito pubblicato e
> riferire **solo ciò che hai davvero visto nelle pagine**, con la frase esatta
> come prova. Non sai giocare un gioco in canvas e non devi provare a farlo: se
> una voce non è verificabile leggendo la pagina, scrivi «non verificabile da
> qui» e passa avanti. **Non correggere niente, non proporre modifiche: riferisci.**
>
> Il sito è `https://www.no-ai-act.eu/` (italiano) e `https://www.no-ai-act.eu/en/`
> (inglese). È un gioco investigativo didattico sull'AI Act europeo, con pagine
> editoriali attorno. Ha appena avuto un rilascio: versione **3.0.0**, e il gioco
> contiene **14 casi** (prima erano 13).
>
> Controlla, una voce per riga, con esito ✅ / ❌ / «non verificabile»:
>
> **A. Numeri che devono essere coerenti**
> 1. Nel piè di pagina di `/` e di `/en/` compare **v3.0.0**? Riporta la stringa.
> 2. In `/`, `/en/`, `/come-funziona/`, `/en/how-it-works/`, `/per-docenti/`,
>    `/en/for-educators/`, `/ricerca-e-metodologia/`,
>    `/en/research-and-methodology/`, `/press-kit/`, `/en/press-kit/`,
>    `/ai-act-serious-game/`, `/en/ai-act-serious-game/`,
>    `/categorie-rischio-ai-act/`, `/en/ai-act-risk-categories/`,
>    `/laboratorio-ai-act-in-classe/`, `/en/ai-act-classroom-lab/`,
>    `/en/faq/`, `/en/ai-act-for-teachers/`, `/ai-act-per-docenti/`,
>    `/serious-game-regolazione-ai/`, `/en/serious-games-for-ai-regulation/`:
>    **trovi ancora un «13 casi» / «13 cases» / «Tredici» / «Thirteen»?**
>    Deve essere **14 / Quattordici / Fourteen** in ogni punto, comprese le
>    risposte dentro i blocchi `<script type="application/ld+json">`. Elenca ogni
>    residuo con l'URL e la frase.
> 3. `/` e `/en/` elencano **14 schede di caso**? Contale.
> 4. In `/press-kit/` e `/en/press-kit/`, il blocco di testo da citare dice
>    **14 fascicoli / 14 case files**?
>
> **B. Le date della norma, che sono il valore del sito**
> Il sito insegna il calendario dell'AI Act **come modificato** dal Regolamento
> (UE) 2026/1744 («Digital Omnibus»). Su `/tempi-applicazione-ai-act/` e
> `/en/ai-act-application-timeline/` verifica che si legga:
> 5. alto rischio Allegato III → **2 dicembre 2027** (e **non** 2 agosto 2026);
> 6. alto rischio Allegato I → **2 agosto 2028**;
> 7. nuovi divieti dell'articolo 5 → **2 dicembre 2026**;
> 8. sistemi ad alto rischio della pubblica amministrazione → **2 agosto 2030**;
> 9. **non** compare la frase «resta davanti una tappa sola» o equivalenti: le
>    tappe rimaste sono almeno quattro.
> 10. Attenzione a una trappola: un «2 agosto 2026» **è corretto** dove parla di
>     applicazione generale, trasparenza, GPAI o alfabetizzazione. È sbagliato
>     **solo** se attribuito ai sistemi ad alto rischio. Segnala solo il secondo
>     caso, e cita la frase intera così posso giudicare.
> 11. Un «2 agosto 2027» riferito all'alto rischio è sbagliato: quella è la
>     scadenza delle *sandbox* normative (art. 57). Segnalalo se lo trovi.
>
> **C. Indicizzabilità**
> 12. `https://www.no-ai-act.eu/robots.txt` — cosa contiene? Blocca qualcosa?
> 13. `https://www.no-ai-act.eu/sitemap-it.xml` e `sitemap-en.xml`: quanti `<loc>`
>     ciascuno? Attesi **32** e **36**, totale 68.
> 14. Su `/` e `/en/`: `<title>`, `<meta name="description">` e `<link rel="canonical">`
>     — riportali **alla lettera** e dimmi quanti caratteri ha ciascun titolo e
>     ciascuna description.
> 15. `/` e `/en/` si puntano a vicenda con `hreflang`? Riporta i tag.
> 16. Nei blocchi `application/ld+json` di `/` e `/en/`: il JSON è ben formato?
>     Le risposte delle FAQ dicono lo stesso numero di casi del testo visibile
>     nella stessa pagina? Una divergenza fra i due è la cosa più importante che
>     puoi trovare.
>
> **D. Promesse sulla privacy, che devono restare vere**
> 17. Nelle pagine trovi moduli, iframe o script di terze parti — per esempio un
>     form di iscrizione, Tally, Google Analytics, Meta, un pixel? Il sito
>     dichiara di non inviare nulla a fornitori terzi tranne l'analytics
>     cookieless di Cloudflare. Segnala **qualunque** host di terze parti che
>     vedi caricato, con il nome del dominio.
>
> **Come riferire.** Una tabella: voce, esito, prova (la frase o il valore
> esatto, con l'URL). Poi, separatamente, l'elenco delle voci «non verificabili
> da qui» e perché. Non aggiungere raccomandazioni SEO generiche, non riscrivere
> testi, non congetturare posizioni su Google: quello che serve è solo se ciò che
> il sito dice è coerente e aggiornato.

---

## I valori attesi, misurati qui il 29 settembre 2026

Servono a **confrontare** la sua risposta, non a crederle. Misurati sul `dist`
costruito dal commit di release, non ricordati:

| | italiano | inglese |
|---|---|---|
| `<title>` | **58** caratteri | **61** caratteri |
| `<meta description>` | 148 caratteri | 147 caratteri |
| casi dichiarati | 14 | 14 |
| schede di caso enumerate | 14 | 14 |
| `<loc>` nel sitemap | 32 | 36 |
| `hreflang` | `it`, `en`, `x-default` (reciproci) | idem |
| blocchi JSON-LD | 5, tutti ben formati | 5, tutti ben formati |

Se i suoi numeri differiscono da questi, le spiegazioni sono **tre**, e la
prima stesura di questo documento ne elencava due, omettendo la più probabile:

1. **la correzione non è ancora su `main`.** È il caso normale, non un guasto: le
   sessioni di sviluppo lavorano su un branch, e finché quel branch non è
   mergiato il sito pubblicato resta indietro. Va controllato **prima** di
   sospettare qualunque altra cosa, con `git log --oneline origin/main -1`;
2. il deploy non ha pubblicato ciò che è stato costruito — questo sarebbe un
   guasto vero;
3. il verificatore ha letto male: si riconosce chiedendogli la frase esatta, che
   il prompt gli impone di riportare.

**Questa omissione è già costata un giro.** Il 29 settembre il verificatore ha
riferito residui di «13» sul sito live; la risposta immediata è stata che il
deploy non aveva pubblicato il `dist` costruito. Falso: la correzione era su un
branch non mergiato, e il sito live era perfettamente coerente con il commit che
serviva. La spiegazione più semplice non era nell'elenco.

### Un errore di misura da non ripetere: caratteri, non byte

I valori di questa tabella sono stati corretti dopo la prima verifica esterna.
Dicevano 60 e 63 caratteri, e il verificatore riferì 58 e 61: **aveva ragione
lui**. I 60 e 63 venivano da `${#stringa}` di bash, che conta i **byte**, e il
titolo contiene una lineetta lunga (`—`) che in UTF-8 pesa 3 byte: due in più
per titolo. Il cancello `audit:seo` usa `title.length` di JavaScript, cioè i
caratteri — quindi **58 e 61 sono i numeri che contano**, e i miei gonfiavano il
margine rispetto al limite di 65. Per misurare un titolo qui si usa
`[...stringa].length` in node, non bash.

**Una trappola nota dei lettori automatici, perché non ti faccia perdere tempo.**
Se riferisce meta description lunghe pochissimi caratteri sulle pagine italiane,
non credergli: le nostre contengono apostrofi (`l'AI Act`, `dell'IA`), e ogni
strumento che estrae `content="…"` trattando anche `'` come delimitatore le
tronca al primo apostrofo. È già successo con un altro strumento su questo
stesso sito, che le riportò di 1–32 caratteri quando erano 148–158.

## Cosa farne quando risponde

Le voci **A** e **C** sono già verificate nel sorgente e nel `dist` costruito
dallo stesso commit: la sua risposta serve a confermare che **ciò che è
pubblicato** coincide con ciò che è stato costruito — l'unico controllo che da
una sessione di sviluppo agentico non si può fare, perché l'egress proxy nega il
sito pubblico.

Se segnala un residuo di «13», la prima cosa da guardare è se la correzione è su
`main` (vedi il punto 1 qui sopra), non il deploy. Se segnala una data, verifica
con il punto 10 prima di crederci — quella distinzione ha già prodotto un falso
allarme in passato, e la regola vale anche per un assistente diverso.

## Esito della prima verifica esterna — 29 settembre 2026

Utile tenerlo, perché dice che cosa questo prompt riesce e non riesce a fare.

**Ha funzionato.** Ha confermato `v3.0.0` in entrambi i footer, le quattro date
della timeline una per una, robots.txt aperto, 32 + 36 `<loc>`, hreflang
reciproci, 5 blocchi JSON-LD ben formati per lingua, 14 schede di caso enumerate
su entrambe le home, e **un solo host di terze parti**:
`static.cloudflareinsights.com`, che è quello dichiarato. Nessun form, iframe,
Analytics, pixel o Tally.

**Non è caduto nella trappola delle date**, che era il rischio principale: ha
riconosciuto che il «2 agosto 2026» presente sulle pagine riguarda applicazione
generale, trasparenza e GPAI, e non l'alto rischio. Chiedere la frase intera al
punto 10 ha fatto il suo lavoro.

**Ha corretto una mia misura**, come sopra: 58 e 61 caratteri contro i 60 e 63
che questo documento dichiarava.

**Ha trovato i residui di «13» sul sito live** — veri, ma perché la correzione
era su un branch non mergiato, non per un difetto del deploy.

**Quello che non ha potuto fare, e lo ha detto:** giocare il canvas. Ha scritto
che ha verificato sorgente, metadati, sitemap e contenuto pubblicato, «non una
partita reale». È esattamente il confine che il prompt gli chiede di rispettare,
e il fatto che lo abbia dichiarato invece di inventare è ciò che rende il resto
del referto credibile.
