import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { it as itTexts } from '../src/game/i18n/it';
import { en as enTexts } from '../src/game/i18n/en';

/**
 * LA DICHIARAZIONE VOLONTARIA SULL'USO DELL'IA, SU OGNI ROTTA PUBBLICATA.
 *
 * PERCHÉ UNA GUARDIA. Il motto vive nel piè di pagina di **settanta** pagine
 * scritte a mano, ed è esattamente la forma che su questo repository è già
 * derivata: lo stesso testo ripetuto in molti file, con nessun meccanismo che
 * ne pretenda la presenza. È così che «13 casi» è sopravvissuto su 21 pagine
 * per un intero rilascio mentre le meta description dicevano 14. Una pagina
 * nuova, aggiunta copiando una vicina, nasce senza dichiarazione e nessuno lo
 * nota — perché una dichiarazione mancante non rompe niente.
 *
 * Le pagine si DERIVANO dai sitemap, non da un elenco scritto qui.
 *
 * CHE COSA QUESTA GUARDIA NON PRETENDE. Non pretende che la dichiarazione sia
 * vera: è un'affermazione sul processo, e il suo contenuto è responsabilità di
 * chi firma il progetto. Pretende che sia **presente, identica e bilingue** —
 * e che non si trasformi in un'affermazione di conformità, che è l'unico modo
 * in cui questo testo potrebbe diventare un problema invece di una virtù.
 */

const root = resolve(__dirname, '..');
const read = (p: string) => readFileSync(resolve(root, p), 'utf8');
const SITE = 'https://www.no-ai-act.eu/';

/** Il motto, nella sola forma ammessa. Qualunque variante è una deriva. */
const MOTTO_IT = "Fatto con l'IA, non dall'IA";
const MOTTO_EN = 'Made with AI, not by AI';
const MOTTO_FR = "Fait avec l'IA, non par l'IA";

function paginePubblicate(): string[] {
  const out: string[] = [];
  for (const sitemap of ['public/sitemap-it.xml', 'public/sitemap-en.xml', 'public/sitemap-fr.xml']) {
    for (const m of read(sitemap).matchAll(/<loc>([^<]+)<\/loc>/g)) {
      out.push(`${m[1].slice(SITE.length)}index.html`);
    }
  }
  return out;
}

describe("dichiarazione sull'uso dell'IA", () => {
  it('è nel piè di pagina di ogni rotta pubblicata, nella lingua della pagina', () => {
    const senza: string[] = [];
    for (const pagina of paginePubblicate()) {
      const html = read(pagina);
      const atteso = pagina.startsWith('en/') ? MOTTO_EN : pagina.startsWith('fr/') ? MOTTO_FR : MOTTO_IT;
      if (!html.includes(atteso)) senza.push(`${pagina}: manca «${atteso}»`);
    }
    expect(
      senza,
      'rotte pubblicate senza la dichiarazione — una pagina nata copiando una vicina:\n  ' +
        senza.join('\n  ')
    ).toEqual([]);
  });

  it('non esistono varianti del motto: una sola forma per lingua', () => {
    // Un motto riscritto «quasi uguale» su qualche pagina è peggio di uno
    // assente: suggerisce che il testo sia approssimativo, e su una pagina che
    // parla di trasparenza l'approssimazione è il difetto.
    const varianti: string[] = [];
    const quasi = /(Fatto|Realizzato|Creato) con (l'|l’)?(IA|AI)[^<]{0,40}|(Fait|Réalisé|Créé) avec (l'|l’)?(IA|AI)[^<]{0,40}|(Made|Built|Created) with AI[^<]{0,40}/g;
    for (const pagina of paginePubblicate()) {
      for (const m of read(pagina).matchAll(quasi)) {
        const trovato = m[0].trim();
        if (trovato !== MOTTO_IT && trovato !== MOTTO_EN && trovato !== MOTTO_FR) varianti.push(`${pagina}: «${trovato}»`);
      }
    }
    expect(varianti, `varianti del motto:\n  ${varianti.join('\n  ')}`).toEqual([]);
  });

  it('non si presenta mai come conformità all\'AI Act', () => {
    // IL DIFETTO PIÙ GRAVE CHE QUESTO TESTO POTREBBE INTRODURRE.
    // La dichiarazione è volontaria. L'articolo 50 impone la marcatura ai
    // fornitori di sistemi generativi (§2) e la dichiarazione a chi pubblica
    // testi generati per informare il pubblico (§4), con eccezione per il
    // contenuto sottoposto a revisione umana sotto responsabilità editoriale.
    // Questo progetto sta nell'eccezione: presentare il motto come adempimento
    // sarebbe un'affermazione di conformità su un sito che insegna la norma —
    // la classe di errore più dannosa per la sua credibilità, e vietata dalle
    // regole che il progetto si è dato.
    // LE REGOLE SONO LEGATE AL SOGGETTO, E NON PER PRUDENZA.
    // La prima stesura vietava `compliant with the AI Act` in qualunque forma e
    // ha bocciato en/ai-act-and-gdpr, dove la frase è «Being compliant with the
    // AI Act does not make you compliant with the GDPR»: un'affermazione
    // DIDATTICA sui sistemi del lettore, e una delle più utili del sito.
    // Vietare la locuzione significava vietare l'insegnamento. Ciò che va
    // vietato è il soggetto: questo sito, questo progetto, questo gioco.
    const sogg = "(quest[oa] (sito|progetto|gioco)|NO AI ACT|this (site|project|game|website))";
    const vietate = [
      new RegExp(`${sogg}[^<.]{0,60}(è|e') conforme`, 'i'),
      new RegExp(`${sogg}[^<.]{0,60}(is|are) (fully |now )?compliant`, 'i'),
      new RegExp(`(conformità|compliance) (di|of) ${sogg}`, 'i'),
      /(ai sensi|a norma)\s+dell'articolo 50[^<.]{0,60}(quest[oa] (sito|progetto)|dichiariamo)/i,
      /(obbligo|obblighi) di dichiarazione[^<.]{0,40}assolt/i,
      /disclosure (obligation|requirement)[^<.]{0,40}(met|satisfied|discharged)/i
    ];
    const colpevoli: string[] = [];
    for (const pagina of paginePubblicate()) {
      const html = read(pagina);
      for (const re of vietate) {
        const m = html.match(re);
        if (m) colpevoli.push(`${pagina}: «${m[0].slice(0, 90)}»`);
      }
    }
    expect(colpevoli, `affermazioni di conformità:\n  ${colpevoli.join('\n  ')}`).toEqual([]);
  });

  it('i crediti del gioco portano il motto, in entrambe le lingue', () => {
    expect(itTexts.ui.creditsScene.note).toContain("FATTO CON L'IA, NON DALL'IA");
    expect(enTexts.ui.creditsScene.note).toContain('MADE WITH AI, NOT BY AI');
    // E la dicono volontaria, che è il punto.
    expect(itTexts.ui.creditsScene.note.toLowerCase()).toContain('volontaria');
    expect(enTexts.ui.creditsScene.note.toLowerCase()).toContain('voluntary');
  });

  it('la motivazione completa esiste sulle pagine di metodologia, bilingue', () => {
    // Il piè di pagina porta cinque parole; il ragionamento deve stare da
    // qualche parte, altrimenti il motto è uno slogan.
    const itPage = read('ricerca-e-metodologia/index.html');
    const enPage = read('en/research-and-methodology/index.html');
    expect(itPage).toContain('id="dichiarazione-ia"');
    expect(enPage).toContain('id="ai-disclosure"');
    for (const [nome, html] of [['IT', itPage], ['EN', enPage]] as const) {
      expect(html, `${nome}: la dichiarazione non cita l'articolo 50`).toMatch(/articolo 50|Article 50/);
      expect(html, `${nome}: non dice di essere volontaria`).toMatch(/volontaria|voluntary/i);
      expect(html, `${nome}: non nomina la responsabilità editoriale`)
        .toMatch(/responsabilità editoriale|editorial.{0,20}responsibility/i);
    }
  });
});
