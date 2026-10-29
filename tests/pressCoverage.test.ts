import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
// @ts-expect-error -- modulo JS senza tipi, come gli altri sorgenti del sito
import { PRESS_ITEMS, PRESS_WORDS } from '../src/site/press-coverage.mjs';

/**
 * LA RASSEGNA DICE LE STESSE COSE IN TUTTE LE LINGUE.
 *
 * IL DIFETTO CHE QUESTA GUARDIA NASCE PER CHIUDERE. Le tre uscite nel carosello
 * «parlano di noi» erano scritte a mano in QUATTRO posti: `index.html`,
 * `en/index.html`, il generatore delle lingue europee e — in una forma diversa,
 * un elenco invece di un carosello — il contenuto francese. Quattro copie degli
 * stessi tre indirizzi e delle stesse tre date, e nessun meccanismo che
 * pretendesse che fossero d'accordo. È la forma esatta che su questo repository
 * ha già prodotto «13 casi» su ventuno pagine per un rilascio intero, e «in
 * italiano e inglese» su dodici file sedici giorni dopo l'uscita del francese.
 *
 * Ora i fatti stanno in `src/site/press-coverage.mjs` e le quattro lingue
 * generate li prendono da lì. Le due home scritte a mano non sono generate, e
 * questa guardia è ciò che impedisce loro di derivare: la prosa resta loro, i
 * fatti devono essere quelli del modulo.
 *
 * E CONTROLLA ANCHE LA PARTE CHE NON SI TRADUCE. Il carosello va tradotto —
 * occhiello, descrizione, testo alternativo — ma l'indirizzo porta sempre
 * all'originale e il titolo dell'opera altrui si cita com'è. Una traduzione che
 * si mangiasse un link, o che riscrivesse il titolo di un articolo di qualcun
 * altro, passerebbe inosservata senza questo file.
 */

const root = resolve(__dirname, '..');
const read = (p: string) => readFileSync(resolve(root, p), 'utf8');

type Item = {
  id: string; image: string; outlet: string; url: string; title: string; date: string;
  quote?: { lang: string; text: string };
};
const items: Item[] = PRESS_ITEMS;

/** Le home che portano il carosello, e come si chiama la lingua di ognuna. */
const HOME: Array<[string, string]> = [
  ['it', 'index.html'],
  ['en', 'en/index.html'],
  ['fr', 'fr/index.html'],
  ['de', 'de/index.html'],
  ['es', 'es/index.html'],
  ['pt', 'pt/index.html']
];

const sezione = (html: string): string => {
  const m = html.match(/<section aria-labelledby="press-title">[\s\S]*?<\/section>/);
  if (!m) throw new Error('nessuna sezione «parlano di noi»');
  return m[0];
};

describe('la rassegna, nelle sei lingue', () => {
  it('ogni home pubblicata porta il carosello, francese compreso', () => {
    // Il francese ne era privo fino al 29 ottobre 2026: le altre cinque lingue
    // mostravano chi aveva parlato del progetto, la sesta no.
    const senza = HOME.filter(([, file]) => !read(file).includes('aria-labelledby="press-title"'));
    expect(senza.map(([lang]) => lang), 'home senza rassegna').toEqual([]);
  });

  it('ogni home elenca esattamente le uscite del modulo, con gli stessi indirizzi', () => {
    const colpe: string[] = [];
    for (const [lang, file] of HOME) {
      const sec = sezione(read(file));
      const schede = (sec.match(/class="press-item"/g) ?? []).length;
      if (schede !== items.length) colpe.push(`${lang}: ${schede} schede invece di ${items.length}`);
      for (const item of items) {
        if (!sec.includes(`href="${item.url}"`)) colpe.push(`${lang}: manca il link di ${item.id}`);
        if (!sec.includes(`/assets/press/${item.image}`)) colpe.push(`${lang}: manca l'immagine di ${item.id}`);
        if (!sec.includes(`datetime="${item.date}"`)) colpe.push(`${lang}: manca la data di ${item.id}`);
        if (!sec.includes(item.outlet)) colpe.push(`${lang}: manca la testata di ${item.id}`);
      }
    }
    expect(colpe, colpe.join('\n')).toEqual([]);
  });

  it('i titoli delle opere altrui non vengono tradotti dalle lingue generate', () => {
    // Le due home scritte a mano glossano il titolo di Absolute Gamer, scelta
    // editoriale loro e dichiarata. Le quattro generate citano l'originale:
    // se un giorno il generatore cominciasse a tradurre i titoli, questo
    // diventerebbe rosso invece di cambiare in silenzio cosa il sito attribuisce
    // a una testata.
    const colpe: string[] = [];
    for (const [lang, file] of HOME.filter(([l]) => l in PRESS_WORDS)) {
      const sec = sezione(read(file));
      for (const item of items) {
        if (!sec.includes(item.title.replace(/&/g, '&amp;'))) {
          colpe.push(`${lang}: il titolo di ${item.id} non è quello originale`);
        }
      }
    }
    expect(colpe, colpe.join('\n')).toEqual([]);
  });

  it('la citazione resta nella lingua in cui è stata detta, e marcata dove serve', () => {
    // Tradurre una citazione è riscriverla, quindi il virgolettato di Absolute
    // Gamer resta in italiano ovunque. Su una pagina che NON è in italiano va
    // però marcato `lang="it"`, altrimenti uno screen reader inglese o tedesco
    // lo legge con la pronuncia sbagliata. Sulla pagina italiana la marcatura
    // sarebbe ridondante e non si pretende: la prima stesura la pretendeva, e
    // ha segnalato come difetto l'unica pagina che non poteva averlo.
    const citate = items.filter((i) => i.quote);
    expect(citate.length, 'nessuna citazione: il controllo non misura niente').toBeGreaterThan(0);
    const colpe: string[] = [];
    let marcature = 0;
    for (const [lang, file] of HOME) {
      const sec = sezione(read(file));
      for (const item of citate) {
        const testo = item.quote!.text.slice(1, 30);
        if (!sec.includes(testo)) colpe.push(`${lang}: la citazione di ${item.id} non è l'originale`);
        if (lang === item.quote!.lang) continue;
        if (new RegExp(`<blockquote lang="${item.quote!.lang}"`).test(sec)) marcature++;
        else colpe.push(`${lang}: la citazione di ${item.id} non è marcata lang="${item.quote!.lang}"`);
      }
    }
    expect(colpe, colpe.join('\n')).toEqual([]);
    expect(marcature, 'nessuna marcatura trovata: il controllo è inerte').toBeGreaterThan(0);
  });

  it('ogni lingua generata traduce occhiello, testo alternativo e descrizione', () => {
    const colpe: string[] = [];
    for (const [lang, parole] of Object.entries(PRESS_WORDS as Record<string, {
      heading: string; prev: string; next: string;
      items: Record<string, { kicker: string; alt: string; text?: string }>;
    }>)) {
      for (const chiave of ['heading', 'prev', 'next'] as const) {
        if (!parole[chiave]?.trim()) colpe.push(`${lang}: manca ${chiave}`);
      }
      for (const item of items) {
        const w = parole.items[item.id];
        if (!w) { colpe.push(`${lang}: non traduce ${item.id}`); continue; }
        if (!w.kicker?.trim()) colpe.push(`${lang}: occhiello vuoto per ${item.id}`);
        if (!w.alt?.trim()) colpe.push(`${lang}: testo alternativo vuoto per ${item.id}`);
        // Una scheda senza citazione deve avere una descrizione: altrimenti
        // resta un titolo nudo, che è quanto mostravano tedesco, spagnolo e
        // portoghese prima del 29 ottobre 2026.
        if (!item.quote && !w.text?.trim()) colpe.push(`${lang}: descrizione mancante per ${item.id}`);
      }
    }
    expect(colpe, colpe.join('\n')).toEqual([]);
  });

  it("l'avvertenza sul contributo dell'autore non si perde in nessuna lingua", () => {
    // È la riga che distingue un racconto firmato dall'autore da una recensione
    // indipendente. In tedesco, spagnolo e portoghese non c'era: le schede
    // generate non avevano affatto una descrizione.
    const sorgente = items.find((i) => i.id === 'fix-gaming-channel');
    expect(sorgente, 'la scheda di riferimento non esiste più: aggiornare questo controllo').toBeTruthy();
    const nega = /non una recensione indipendente|not an independent review|pas une critique indépendante|keine unabhängige Rezension|no una reseña independiente|não uma análise independente/;
    const senza = HOME.filter(([, file]) => !nega.test(sezione(read(file))));
    expect(senza.map(([lang]) => lang), "lingue in cui la scheda non dice che non è una recensione indipendente").toEqual([]);
  });
});
