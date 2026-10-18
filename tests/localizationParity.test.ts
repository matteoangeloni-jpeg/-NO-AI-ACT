import { describe, expect, it as test } from 'vitest';
import { LANGUAGE_CODES, LOCALES } from '../src/game/i18n';
import { CONCEPT_LINKS, FALLBACK_LINKS, SITE_LINKS } from '../src/game/data/concepts';
import { AFFILIATION_LINKS } from '../src/game/data/affiliation';

/**
 * PARITÀ FRA LE LINGUE PUBBLICATE — chiavi mancanti, contenuti misti, rotte.
 *
 * CHE COSA IL COMPILATORE GIÀ GARANTISCE, e che questo file non ripete:
 * `Locale = typeof it` più `Record<LanguageCode, Locale>` fanno sì che un
 * dizionario incompleto NON COMPILI. Nessuna chiave può mancare: è un errore
 * di tipo, non un test.
 *
 * CHE COSA IL COMPILATORE NON PUÒ VEDERE, ed è ciò che sta qui:
 *  1. una chiave presente ma NON TRADOTTA — il valore italiano copiato;
 *  2. un collegamento che porta a una pagina di un'altra lingua, cioè un
 *     francese che rimanda all'inglese senza che nulla lo segnali;
 *  3. una rotta dichiarata dal gioco che sul sito non esiste.
 *
 * Il punto 2 è quello che l'audit del programma 4.0 aveva previsto: il tipo
 * pretende sette URL per lingua, non che siano nella lingua giusta.
 */

type Piatta = Record<string, string>;

function appiattisci(nodo: unknown, percorso = '', out: Piatta = {}): Piatta {
  if (typeof nodo === 'string') {
    out[percorso] = nodo;
    return out;
  }
  if (Array.isArray(nodo)) {
    nodo.forEach((v, i) => appiattisci(v, `${percorso}[${i}]`, out));
    return out;
  }
  if (nodo && typeof nodo === 'object') {
    for (const [k, v] of Object.entries(nodo as Record<string, unknown>)) {
      appiattisci(v, percorso ? `${percorso}.${k}` : k, out);
    }
  }
  return out;
}

/**
 * STRINGHE CHE RESTANO LEGITTIMAMENTE IDENTICHE ALL'ITALIANO, e il perché di
 * ciascuna categoria. La misura è del 13 ottobre 2026 sul francese: 64
 * identiche su 1408, tutte in queste categorie.
 */
const IDENTICHE_AMMESSE: { quando: (percorso: string, valore: string) => boolean; motivo: string }[] = [
  {
    // `clueSources` NON è testo a schermo: sono chiavi che indicizzano
    // `ui.evidence.sources`, che invece è tradotto. Tradurle romperebbe il
    // lookup — è il caso in cui l'identità è obbligatoria, non tollerata.
    quando: (p) => /\.clueSources\[\d+\]$/.test(p),
    motivo: 'chiave interna, non testo a schermo'
  },
  {
    // Un template di formattazione non contiene lingua.
    quando: (_p, v) => /^[\s{}\w·\-–/~.]*$/.test(v) && /\{\w+\}/.test(v),
    motivo: 'template di formattazione'
  },
  {
    quando: (_p, v) => /^(NO AI ACT|Matteo Angeloni|MENU|CONFORME|NON CONFORME|Base|Standard|GPAI|audit|normale)$/.test(v),
    motivo: 'nome proprio o parola identica nelle due lingue'
  },
  {
    // Durate numeriche e etichette di lingua: nessun contenuto linguistico.
    quando: (_p, v) => /^\d+[–-]\d+ min$/.test(v),
    motivo: 'durata numerica'
  },
  {
    // Nomi italiani di istituzioni e programmi: si citano, non si traducono.
    quando: (p) => /creditsScene\.(affiliation|phdProgramme|universityLink)$/.test(p),
    motivo: "denominazione ufficiale dell'ateneo, non traducibile"
  },
  {
    // Le risorse docente sono etichettate per lingua nel loro stesso nome.
    quando: (p) => /teacherGuide\.links\.(activities|lesson)_(it|en)$/.test(p),
    motivo: 'risorsa già etichettata con la propria lingua'
  },
  {
    /**
     * ANGLICISMI CHE IL TESTO ITALIANO USA, e la ragione per cui questa
     * categoria è nata DOPO aver fatto girare il controllo.
     *
     * La prima stesura bocciava l'INGLESE su ventuno stringhe — «deepfake»,
     * «oversight», «deployer», «scoring», «welfare», «procurement»,
     * «governance», «privacy by design», «GDPR», «chatbot». Non sono
     * traduzioni mancate: è l'italiano che prende in prestito l'inglese, e
     * l'inglese non può che restare identico a sé stesso.
     *
     * E dice una cosa a favore del francese: quei termini hanno un
     * equivalente ufficiale nel testo francese del regolamento
     * («hypertrucage», «déployeur», «contrôle humain», «notation sociale»),
     * quindi nella versione francese sono tradotti davvero. Dove l'italiano
     * ha ceduto all'anglicismo, il francese ha una parola propria — e si
     * misura sui lemmi del glossario: sette voci che in inglese restano
     * identiche all'italiano (Deepfake, Deployer, Provider, Lock-in,
     * Procurement AI, Social scoring, Data governance) in francese diventano
     * hypertrucage, déployeur, fournisseur, dépendance au fournisseur,
     * marchés publics d'IA, notation sociale, gouvernance des données.
     */
    quando: (p, v) =>
      /(\.tags\[\d+\]|\.aiActConcepts\[\d+\])$/.test(p) ||
      /^glossary\.entries\.\w+\.term$/.test(p) ||
      /^(AUDIO: (ON|OFF)|CREDITS|Privacy|privacy by design|Privacy by design|social scoring)$/.test(v),
    motivo: "anglicismo usato nel testo italiano, o etichetta breve non traducibile"
  }
];

describe('parità di localizzazione fra le lingue pubblicate', () => {
  const base = appiattisci(LOCALES.it);
  const altre = LANGUAGE_CODES.filter((l) => l !== 'it');

  test('ci sono almeno due lingue pubblicate, e il controllo non è inerte', () => {
    expect(LANGUAGE_CODES.length).toBeGreaterThanOrEqual(2);
    expect(Object.keys(base).length, 'dizionario italiano vuoto?').toBeGreaterThan(1000);
    expect(altre.length).toBeGreaterThanOrEqual(1);
  });

  for (const lang of altre) {
    test(`${lang}: nessuna chiave è rimasta col testo italiano`, () => {
      const tradotto = appiattisci(LOCALES[lang]);
      const sospette: string[] = [];
      for (const [percorso, valore] of Object.entries(base)) {
        if (tradotto[percorso] !== valore) continue;
        const ammessa = IDENTICHE_AMMESSE.some((r) => r.quando(percorso, valore));
        if (!ammessa) sospette.push(`${percorso} = ${JSON.stringify(valore).slice(0, 70)}`);
      }
      expect(
        sospette,
        `stringhe identiche all'italiano e non giustificate — probabile traduzione mancata:\n  ${sospette.join('\n  ')}`
      ).toEqual([]);
    });

    test(`${lang}: le stringhe tradotte non sono vuote`, () => {
      const tradotto = appiattisci(LOCALES[lang]);
      const vuote = Object.entries(tradotto)
        .filter(([, v]) => v.trim() === '')
        .map(([k]) => k);
      expect(vuote, `valori vuoti: ${vuote.join(', ')}`).toEqual([]);
    });
  }

  test('ogni lingua ha i propri collegamenti al sito, non quelli di un\'altra', () => {
    // IL DIFETTO CHE QUESTO CONTROLLO ESISTE PER PRENDERE.
    // `Record<LanguageCode, SiteLinkSet>` pretende sette URL per lingua, NON
    // che appartengano a quella lingua: un `fr` che riusa gli URL inglesi
    // compila benissimo, e produce un francese che rimanda a pagine inglesi
    // senza che nulla lo segnali. È il caso peggiore, non il migliore, perché
    // non si manifesta come errore ma come esperienza mescolata.
    const prefisso: Record<string, RegExp> = {
      it: /^\.\.\/(?!en\/|fr\/)/,
      en: /^\.\.\/en\//,
      fr: /^\.\.\/fr\//
    };
    const fuoriposto: string[] = [];
    for (const lang of LANGUAGE_CODES) {
      const atteso = prefisso[lang];
      expect(atteso, `nessuna regola di prefisso per ${lang}: aggiungerla`).toBeTruthy();
      for (const [chiave, url] of Object.entries(SITE_LINKS[lang])) {
        if (!atteso.test(url)) fuoriposto.push(`SITE_LINKS.${lang}.${chiave} = ${url}`);
      }
    }
    expect(
      fuoriposto,
      `collegamenti che portano fuori dalla propria lingua:\n  ${fuoriposto.join('\n  ')}`
    ).toEqual([]);
  });

  test('i collegamenti ai concetti e quelli di ripiego restano nella lingua', () => {
    const prefisso: Record<string, RegExp> = { it: /^\/(?!en\/|fr\/)/, en: /^\/en\//, fr: /^\/fr\// };
    const fuoriposto: string[] = [];
    for (const [concetto, perLingua] of Object.entries(CONCEPT_LINKS)) {
      for (const lang of LANGUAGE_CODES) {
        const url = (perLingua as Record<string, string>)[lang];
        if (!prefisso[lang].test(url)) fuoriposto.push(`CONCEPT_LINKS.${concetto}.${lang} = ${url}`);
      }
    }
    for (const lang of LANGUAGE_CODES) {
      for (const url of FALLBACK_LINKS[lang]) {
        if (!prefisso[lang].test(url)) fuoriposto.push(`FALLBACK_LINKS.${lang} = ${url}`);
      }
    }
    expect(fuoriposto, `fuori lingua:\n  ${fuoriposto.join('\n  ')}`).toEqual([]);
  });

  test("il rimando esterno fuori lingua è dichiarato, non silenzioso", () => {
    // UNICA ECCEZIONE AMMESSA, e va letta come tale.
    // L'ateneo pubblica la scheda del dottorato in italiano e in inglese, non
    // in francese: il francese rimanda alla pagina inglese. Non è una lacuna
    // di traduzione nostra ed è l'unico caso in cui un collegamento esce dalla
    // propria lingua — quindi il motivo deve stare scritto nel codice, non
    // nella memoria di chi l'ha fatto.
    const sorgente = readFileSyncSafe('src/game/data/affiliation.ts');
    expect(AFFILIATION_LINKS.phd.fr).toBe(AFFILIATION_LINKS.phd.en);
    expect(
      /non è una lacuna di|l'ateneo pubblica/i.test(sorgente),
      "il rimando del francese alla pagina inglese dell'ateneo non è motivato nel codice"
    ).toBe(true);
  });
});

function readFileSyncSafe(p: string): string {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { readFileSync } = require('node:fs') as typeof import('node:fs');
  const { resolve } = require('node:path') as typeof import('node:path');
  return readFileSync(resolve(__dirname, '..', p), 'utf8');
}
