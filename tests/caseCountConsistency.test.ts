import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { CASES } from '../src/game/data/cases';

/**
 * QUANTI CASI IL SITO DICE DI AVERE, SU OGNI PAGINA PUBBLICATA.
 *
 * IL DIFETTO CHE QUESTA GUARDIA NASCE PER CHIUDERE. Con l'arrivo del
 * quattordicesimo caso il conteggio è stato aggiornato dove i test lo
 * fissavano: le due home che ENUMERANO le schede, i conteggi i18n del gioco,
 * llms.txt, release.config.json, il README, il factsheet del press kit. Quel
 * lavoro è stato dichiarato completo. Non lo era: DICIASSETTE pagine pubbliche
 * hanno continuato a dire «13 casi» per un intero rilascio — fra cui due
 * intestazioni `<h2>`, il blocco di citazione che un giornalista incolla, la
 * pagina di metodologia che un ricercatore cita, e QUATTRO risposte dentro il
 * JSON-LD delle FAQ, cioè machine-readable e riproducibili in SERP. Nel
 * frattempo le meta description delle stesse pagine dicevano 14: il sito si
 * contraddiceva da solo.
 *
 * PERCHÉ NESSUN TEST LO VEDEVA, E PERCHÉ QUESTO È SCRITTO DIVERSAMENTE.
 * I controlli SEO esistenti girano su un ELENCO DI PAGINE SCRITTO A MANO — in
 * `seoPages.test.ts` sono otto — e le altre sessanta non erano guardate da
 * nessuno. Un elenco a mano è il difetto, non la soluzione: invecchia al primo
 * URL nuovo e dà l'impressione di copertura. Quindi qui le pagine si
 * DERIVANO dai due sitemap, che sono la fonte di verità delle 68 rotte
 * pubblicate: una pagina nuova entra in questo controllo il giorno che entra
 * nel sitemap, senza che nessuno se ne ricordi.
 *
 * LA FINESTRA 10–20 È MISURATA, NON SCELTA A OCCHIO. Le pagine parlano
 * legittimamente di sottoinsiemi — «un caso», «due casi», «1–2 cases», «six
 * case files» in un percorso — e pretendere che OGNI numero davanti a «casi»
 * sia il totale produrrebbe falsi positivi sul linguaggio didattico. Misurato
 * il corpus: i conteggi di sottoinsieme osservati arrivano a sei, i totali
 * stanno a quattordici. La finestra 10–20 separa le due famiglie e copre la
 * deriva realistica (12, 13, 15, 16) senza toccare la prosa delle lezioni.
 * Se un giorno una pagina avrà bisogno di dire «dodici casi su quattordici»,
 * questo controllo la fermerà: allora si scriverà «dodici dei quattordici»,
 * che è anche più chiaro, oppure si allargherà la finestra CON il motivo.
 */

const root = resolve(__dirname, '..');
const read = (p: string) => readFileSync(resolve(root, p), 'utf8');
const SITE = 'https://www.no-ai-act.eu/';

/** Le pagine pubblicate, derivate dai sitemap: mai un elenco scritto a mano. */
function paginePubblicate(): string[] {
  const out: string[] = [];
  for (const sitemap of ['public/sitemap-it.xml', 'public/sitemap-en.xml']) {
    for (const m of read(sitemap).matchAll(/<loc>([^<]+)<\/loc>/g)) {
      out.push(`${m[1].slice(SITE.length)}index.html`);
    }
  }
  return out;
}

/** Numeri scritti a parola che cadono nella finestra sorvegliata. */
const PAROLE: Record<string, number> = {
  dieci: 10, undici: 11, dodici: 12, tredici: 13, quattordici: 14, quindici: 15,
  sedici: 16, diciassette: 17, diciotto: 18, diciannove: 19, venti: 20,
  ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15,
  sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20
};

const NOMI = 'casi|caso|fascicoli|fascicolo|cases|case files|case';
const CONTEGGIO = new RegExp(
  `(${Object.keys(PAROLE).join('|')}|\\d{1,3})\\s+(${NOMI})\\b`,
  'gi'
);

type Dichiarazione = { dove: string; frase: string; numero: number };

/** Ogni affermazione «N casi» con N nella finestra 10–20, in un testo. */
function dichiarazioni(dove: string, testo: string): Dichiarazione[] {
  const out: Dichiarazione[] = [];
  for (const m of testo.matchAll(CONTEGGIO)) {
    const grezzo = m[1].toLowerCase();
    const numero = PAROLE[grezzo] ?? Number(grezzo);
    if (!Number.isFinite(numero) || numero < 10 || numero > 20) continue;
    out.push({ dove, frase: m[0].replace(/\s+/g, ' '), numero });
  }
  return out;
}

describe('il conteggio dei casi che il sito pubblica', () => {
  const atteso = CASES.length;

  it('nessuna pagina pubblicata dichiara un numero di casi diverso da quello reale', () => {
    const sbagliate: string[] = [];
    for (const pagina of paginePubblicate()) {
      for (const d of dichiarazioni(pagina, read(pagina))) {
        if (d.numero !== atteso) sbagliate.push(`${d.dove}: «${d.frase}» (i casi sono ${atteso})`);
      }
    }
    expect(
      sbagliate,
      'pagine che dichiarano un conteggio di casi superato — il visitatore legge un numero, la meta description un altro:\n  ' +
        sbagliate.join('\n  ')
    ).toEqual([]);
  });

  it('anche i file pubblicati che non sono pagine dichiarano il numero giusto', () => {
    // llms.txt è servito ai crawler di modelli linguistici e contiene la
    // descrizione del progetto: se resta indietro, un modello impara il numero
    // sbagliato e lo ripete altrove, dove nessuna nostra guardia arriva.
    const sbagliate = dichiarazioni('public/llms.txt', read('public/llms.txt'))
      .filter((d) => d.numero !== atteso)
      .map((d) => `public/llms.txt: «${d.frase}»`);
    expect(sbagliate, sbagliate.join('\n')).toEqual([]);
  });

  it('il controllo non è inerte: i conteggi esistono, e in entrambe le lingue', () => {
    // Senza questa asserzione il controllo sopra sarebbe verde anche se il sito
    // smettesse di dire quanti casi ha — cioè proprio quando il numero andrebbe
    // verificato. È la lezione delle guardie che non potevano fallire, e questa
    // volta arriva dopo averne vista una restare verde per un intero rilascio.
    const tutte = paginePubblicate().flatMap((p) => dichiarazioni(p, read(p)));
    expect(tutte.length, 'nessun conteggio trovato: la guardia non misura niente').toBeGreaterThanOrEqual(20);
    expect(tutte.some((d) => !d.dove.startsWith('en/')), 'nessun conteggio in italiano').toBe(true);
    expect(tutte.some((d) => d.dove.startsWith('en/')), 'nessun conteggio in inglese').toBe(true);
  });

  it('copre tutte le rotte pubblicate, non un elenco scritto a mano', () => {
    // La proprietà che rende questa guardia diversa da quelle che hanno mancato
    // il difetto. Se un giorno il sitemap e le pagine divergono, è questo che
    // lo dice.
    const pagine = paginePubblicate();
    expect(pagine.length).toBe(68);
    expect(new Set(pagine).size, 'rotte duplicate fra i due sitemap').toBe(pagine.length);
  });
});
