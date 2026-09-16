import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it as test } from 'vitest';
import { PAPER_SPECS } from '../src/game/assets/procedural/createDossierTextures';
import { OUTCOME_COLORS } from '../src/game/assets/procedural/decisionSeal';
import {
  STATE_MARKS,
  stateFrameKey,
  stateText,
  stateTextWidth,
  type VisualState
} from '../src/game/assets/procedural/visualStates';
import { it as itDict } from '../src/game/i18n/it';
import { setLanguage } from '../src/game/i18n';
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

  test('una texture il cui contenuto dipende dalla lingua ha la lingua nella chiave', () => {
    /**
     * La regola precedente era «nessun generatore importa i18n», e ha
     * segnalato i due moduli del linguaggio degli stati — che i18n lo usano
     * eccome, ma per i TESTI DI PHASER accanto alla cornice, non per i
     * pixel. Era un proxy sbagliato: da quando `fillText` è vietato del
     * tutto, cuocere una parola in una texture non è più possibile.
     *
     * Quello che resta da garantire è più sottile. Il distintivo ricava la
     * propria LARGHEZZA dalla parola, quindi la texture della cornice
     * dipende dalla lingua anche senza contenere parole: se la chiave non
     * seguisse quella misura, passando all'inglese si riuserebbe la cornice
     * italiana, larga per una parola che non c'è più.
     *
     * Qui si verifica la proprietà vera, sulle due lingue vere.
     */
    const stati = Object.keys(STATE_MARKS) as VisualState[];
    const chiavi = (lingua: 'it' | 'en'): Map<VisualState, number> => {
      setLanguage(lingua);
      const m = new Map<VisualState, number>();
      for (const stato of stati) {
        m.set(stato, Math.ceil(stateTextWidth(stato, 11.5)));
      }
      return m;
    };
    const itW = chiavi('it');
    const enW = chiavi('en');
    setLanguage('it');

    let almenoUnaDiversa = false;
    for (const [stato, w] of itW) {
      const we = enW.get(stato) ?? 0;
      if (w !== we) almenoUnaDiversa = true;
      // la chiave della cornice contiene la larghezza: misure diverse,
      // texture diverse
      expect(stateFrameKey(stato, w, 26)).toContain(String(w));
      expect(stateFrameKey(stato, we, 26)).toContain(String(we));
    }
    expect(
      almenoUnaDiversa,
      'se nessuna etichetta cambiasse lunghezza fra le due lingue, questo controllo sarebbe inerte'
    ).toBe(true);
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

describe('il linguaggio degli stati è leggibile senza colore', () => {
  /**
   * IL DIFETTO CHE QUESTA REGOLA CHIUDE.
   *
   * La cornice d'esito aveva una larghezza scritta a mano, e «PARZIALMENTE
   * CONFORME» ne usciva da tutte e due le parti. Non si vedeva provando il
   * gioco: l'esito parziale è il meno frequente e l'inglese è più corto.
   *
   * Ora la larghezza del distintivo si RICAVA dalla parola, quindi il
   * difetto non può più nascere; quello che resta da verificare è che il
   * linguaggio regga le sue promesse — che ogni stato porti un segnale che
   * non sia il colore, e che nessuno di questi segnali si ripeta.
   */
  test('ogni stato ha un glifo, e nessuno lo condivide con un altro', () => {
    const glifi = Object.entries(STATE_MARKS).map(([s, m]) => [s, m.glyph] as const);
    expect(glifi.length).toBeGreaterThan(8);
    const visti = new Map<string, string>();
    for (const [stato, glifo] of glifi) {
      expect(glifo, `lo stato "${stato}" non ha glifo: resterebbe il solo colore`).not.toBe('');
      const gemello = visti.get(glifo);
      expect(gemello, `"${stato}" e "${gemello}" usano lo stesso glifo "${glifo}"`).toBeUndefined();
      visti.set(glifo, stato);
    }
  });

  test('i glifi vengono tutti dal blocco con la prova a schermo', () => {
    /**
     * Geometric Shapes (U+25A0–U+25FF) è l'unico blocco di cui il gioco ha
     * già la prova: ▢ ▣ ▸ ◂ ▲ ▼ erano in uso da prima di questo linguaggio.
     * Un glifo preso da un blocco non verificato esce come rettangolo vuoto
     * dove manca il font — cioè un segnale in meno proprio dove servono.
     */
    for (const [stato, m] of Object.entries(STATE_MARKS)) {
      const cp = m.glyph.codePointAt(0) ?? 0;
      expect(
        cp >= 0x25a0 && cp <= 0x25ff,
        `"${stato}" usa U+${cp.toString(16).toUpperCase()}, fuori da Geometric Shapes`
      ).toBe(true);
    }
  });

  test('due stati non condividono lo stesso trattamento CON lo stesso colore', () => {
    // Trattamento uguale e colore uguale = due stati indistinguibili.
    // Trattamento uguale e colore diverso va bene: il glifo li separa.
    const visti = new Map<string, string>();
    for (const [stato, m] of Object.entries(STATE_MARKS)) {
      const impronta = `${m.treatment}|${m.color}`;
      const gemello = visti.get(impronta);
      expect(gemello, `"${stato}" è indistinguibile da "${gemello}" senza leggere la parola`).toBeUndefined();
      visti.set(impronta, stato);
    }
  });

  test('il testo di uno stato porta sempre il glifo davanti alla parola', () => {
    setLanguage('it');
    for (const stato of Object.keys(STATE_MARKS) as VisualState[]) {
      expect(stateText(stato).startsWith(STATE_MARKS[stato].glyph)).toBe(true);
      expect(stateText(stato).length, `"${stato}" non ha parola dopo il glifo`).toBeGreaterThan(3);
    }
    setLanguage('en');
    for (const stato of Object.keys(STATE_MARKS) as VisualState[]) {
      expect(stateText(stato).startsWith(STATE_MARKS[stato].glyph)).toBe(true);
      expect(stateText(stato).length, `[en] "${stato}" non ha parola dopo il glifo`).toBeGreaterThan(3);
    }
    setLanguage('it');
  });
});
