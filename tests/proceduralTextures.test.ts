import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it as test } from 'vitest';
import { PAPER_SPECS } from '../src/game/assets/procedural/createDossierTextures';
import { OUTCOME_COLORS } from '../src/game/assets/procedural/decisionSeal';
import {
  CITE_STAMP_FONT,
  CITE_STAMP_SIZE,
  MONO_ADVANCE,
  OUTCOME_STAMP_FONT,
  OUTCOME_STAMP_SIZE,
  STAMP_PADDING
} from '../src/game/assets/procedural/stamps';
import { en as enDict } from '../src/game/i18n/en';
import { it as itDict } from '../src/game/i18n/it';
import { COLOR_STR } from '../src/game/ui/theme';

/**
 * LE TEXTURE GENERATE — le proprietà che devono restare vere.
 *
 * Due difetti reali stanno dietro a questi controlli, e nessuno dei due si
 * vedeva guardando lo schermo nella propria lingua.
 *
 * 1. PAROLE COTTE NEI PIXEL. La carta del fascicolo aveva stampato dentro
 *    "NON CLASSIFICATO / ISPETTORATO AX", e i timbri d'esito sulla mappa
 *    avevano dentro "CONFORME". Una texture nasce una volta sola al preload
 *    e SOPRAVVIVE al cambio di lingua — che ricarica la schermata, non le
 *    texture — quindi chi passava all'inglese continuava a leggere parole
 *    italiane. Per vederlo bisognava cambiare lingua a partita iniziata:
 *    esattamente il gesto che nessuno fa mentre sviluppa.
 *
 * 2. CARTA STIRATA. Il rapporto mostrava la carta del fascicolo, generata a
 *    900×560, dentro un riquadro da 940×580: ogni riga della texture usciva
 *    allungata del 4%. Su uno sfondo così scuro non si nota, ma è il motivo
 *    per cui la carta sembrava sfocata dove il resto era nitido.
 *
 * Gli elenchi si LEGGONO — i file dal disco, gli esiti da i18n — perché una
 * copia scritta a mano qui dentro avrebbe gli stessi buchi del codice che
 * controlla.
 */

const dir = 'src/game/assets/procedural';
const read = (p: string): string => readFileSync(resolve(__dirname, '..', p), 'utf8');
const generatori = readdirSync(resolve(__dirname, '..', dir)).filter((f) => f.endsWith('.ts'));

/** Luminanza relativa secondo WCAG 2.1. */
function luminanza(hex: string): number {
  const h = hex.replace('#', '');
  const canale = (i: number): number => {
    const c = parseInt(h.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * canale(0) + 0.7152 * canale(2) + 0.0722 * canale(4);
}

function contrasto(a: string, b: string): number {
  const [la, lb] = [luminanza(a), luminanza(b)];
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

describe('nessuna parola finisce cotta dentro una texture', () => {
  test('la lettura del disco trova davvero i generatori', () => {
    expect(generatori.length, 'se la cartella non si leggesse, il controllo sarebbe vuoto').toBeGreaterThan(3);
  });

  test('nessun generatore scrive testo sul canvas', () => {
    const colpevoli: string[] = [];
    for (const f of generatori) {
      // i commenti spiegano proprio questa regola: cercarli sarebbe cercare sé stessi
      const src = read(`${dir}/${f}`).replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
      for (const line of src.split('\n')) {
        if (/\.(fill|stroke)Text\s*\(/.test(line)) colpevoli.push(`${f}: ${line.trim()}`);
      }
    }
    expect(
      colpevoli,
      `una texture sopravvive al cambio di lingua: la parola va messa con un testo di Phaser.\n${colpevoli.join('\n')}`
    ).toEqual([]);
  });

  test('nessun generatore riceve testo da i18n', () => {
    // Il modo in cui la regola veniva aggirata: passare le etichette al
    // generatore invece di scriverle dentro. Il risultato è lo stesso.
    const colpevoli = generatori.filter((f) => /from '\.\.\/\.\.\/i18n'/.test(read(`${dir}/${f}`)));
    expect(colpevoli, `generatori che importano i18n: ${colpevoli.join(', ')}`).toEqual([]);
  });
});

describe('le carte si mostrano alla misura in cui sono state generate', () => {
  /**
   * La misura richiesta si LEGGE dalle scene: se domani qualcuno allarga il
   * rapporto a 980 senza rigenerare la carta, questo controllo lo vede.
   */
  const usi = new Map<string, [number, number]>();
  for (const d of ['src/game/scenes', 'src/game/ui']) {
    for (const f of readdirSync(resolve(__dirname, '..', d)).filter((x) => x.endsWith('.ts'))) {
      const src = read(`${d}/${f}`);
      const re = /add\s*\.image\([^)]*'([a-z_]+_paper)'\)\s*\.setDisplaySize\((\d+),\s*(\d+)\)/g;
      let m: RegExpExecArray | null;
      while ((m = re.exec(src)) !== null) usi.set(m[1], [Number(m[2]), Number(m[3])]);
    }
  }

  test('ogni carta generata è mostrata da qualche scena', () => {
    for (const spec of PAPER_SPECS) {
      expect(usi.has(spec.key), `la carta "${spec.key}" non la usa nessuno: è peso morto`).toBe(true);
    }
  });

  test('la misura generata coincide con quella mostrata', () => {
    for (const spec of PAPER_SPECS) {
      const uso = usi.get(spec.key);
      if (!uso) continue;
      expect(uso, `"${spec.key}" generata ${spec.width}×${spec.height} e mostrata ${uso[0]}×${uso[1]}`).toEqual([
        spec.width,
        spec.height
      ]);
    }
  });
});

describe('il testo resta leggibile sulle carte', () => {
  const inchiostri: [string, string][] = [
    ['corpo', COLOR_STR.paper],
    ['etichette', COLOR_STR.paperDim],
    ['titoli', COLOR_STR.warning],
    ['accento', COLOR_STR.accentText],
    ['allarme', COLOR_STR.alertText],
    ['conforme', COLOR_STR.ok]
  ];

  test('ogni inchiostro supera la soglia AA su ogni carta', () => {
    for (const spec of PAPER_SPECS) {
      for (const [nome, colore] of inchiostri) {
        const r = contrasto(colore, spec.fill);
        expect(r, `"${nome}" illeggibile su "${spec.key}": ${r.toFixed(2)}`).toBeGreaterThanOrEqual(4.5);
      }
    }
  });
});

describe('il sigillo copre tutti gli esiti', () => {
  test("ogni esito che il rapporto sa dire ha un colore di sigillo", () => {
    // Gli esiti si leggono da i18n, dove il gioco li dichiara davvero.
    const esiti = Object.keys(itDict.ui.outcomes);
    expect(esiti.length).toBeGreaterThan(2);
    for (const e of esiti) {
      expect(
        Object.prototype.hasOwnProperty.call(OUTCOME_COLORS, e),
        `l'esito "${e}" esiste in i18n ma non ha un sigillo`
      ).toBe(true);
    }
  });

  test('il colore del sigillo si legge sulla carta del rapporto', () => {
    const carta = PAPER_SPECS.find((s) => s.key === 'report_paper');
    expect(carta, 'la carta del rapporto è sparita').toBeDefined();
    for (const [esito, c] of Object.entries(OUTCOME_COLORS)) {
      const r = contrasto(c.text, carta!.fill);
      expect(r, `esito "${esito}" illeggibile sul rapporto: ${r.toFixed(2)}`).toBeGreaterThanOrEqual(4.5);
    }
  });
});

describe('le parole stanno dentro i timbri', () => {
  /**
   * IL DIFETTO CHE QUESTO CONTROLLO HA TROVATO DAVVERO.
   *
   * La cornice d'esito era 148px meno di così, e "PARZIALMENTE CONFORME"
   * usciva da tutte e due le parti. Non si vedeva provando il gioco, per due
   * motivi messi insieme: l'esito parziale è il meno frequente, e chi prova
   * il gioco lo prova nella propria lingua — l'inglese, più corto, non
   * sbordava. È il genere di difetto che una guardia trova e una prova a
   * schermo no.
   *
   * Le etichette si LEGGONO da tutte e due i dizionari. Una lingua nuova, o
   * una traduzione più lunga, passa di qui il giorno che viene scritta.
   */
  const larghezza = (testo: string, corpo: number): number => testo.length * corpo * MONO_ADVANCE;

  test("l'etichetta d'esito sta nella cornice del timbro, in tutte e due le lingue", () => {
    const luce = OUTCOME_STAMP_SIZE.width - STAMP_PADDING * 2;
    for (const [lingua, dict] of [['it', itDict], ['en', enDict]] as const) {
      for (const [chiave, testo] of Object.entries(dict.ui.outcomes)) {
        const w = larghezza(testo, OUTCOME_STAMP_FONT);
        expect(
          w,
          `[${lingua}] "${testo}" (${chiave}) occupa ${w.toFixed(0)}px in una luce di ${luce}px`
        ).toBeLessThanOrEqual(luce);
      }
    }
  });

  test('"citato nel rapporto" sta nella sua cornice, in tutte e due le lingue', () => {
    const luce = CITE_STAMP_SIZE.width - STAMP_PADDING * 2;
    for (const [lingua, dict] of [['it', itDict], ['en', enDict]] as const) {
      const testo = dict.ui.evidence.cited;
      const w = larghezza(testo, CITE_STAMP_FONT);
      expect(w, `[${lingua}] "${testo}" occupa ${w.toFixed(0)}px in una luce di ${luce}px`).toBeLessThanOrEqual(luce);
    }
  });
});
