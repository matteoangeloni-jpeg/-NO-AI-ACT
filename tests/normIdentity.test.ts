import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  GPAI_ICON_KEY,
  NORM_IDENTITIES,
  normIdentity,
  type NormIdentity
} from '../src/game/assets/procedural/normIdentity';
import { CLASSIFICATION_SEVERITY, MEASURE_SEVERITY, SEVERITY_STEPS } from '../src/game/assets/procedural/severity';
import { NORMS } from '../src/game/data/norms';
import { it as itDict } from '../src/game/i18n/it';
import { en as enDict } from '../src/game/i18n/en';
import { COLOR_STR } from '../src/game/ui/theme';

/**
 * IDENTITÀ NORMATIVA — le proprietà che la tengono onesta.
 *
 * Le cinque identità non coincidono con i quattro livelli dei dati: la
 * quinta (GPAI) si RICAVA dall'icona, perché `restrittivo` tiene insieme
 * biometria e modelli per finalità generali. È una deduzione, e una
 * deduzione ripetuta in cinque scene diverge alla prima modifica — per
 * questo vive in un modulo solo, e per questo un controllo verifica che
 * nessuno la rifaccia altrove.
 */

const root = resolve(__dirname, '..');
const read = (p: string): string => readFileSync(resolve(root, p), 'utf8');

function luminanza(hex: string): number {
  const h = hex.replace('#', '');
  const canale = (i: number): number => {
    const c = parseInt(h.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * canale(0) + 0.7152 * canale(2) + 0.0722 * canale(4);
}
const contrasto = (a: string, b: string): number => {
  const [la, lb] = [luminanza(a), luminanza(b)];
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
};

describe('ogni norma ha un’identità, e ogni identità ha almeno una norma', () => {
  it('le tredici norme reali si mappano tutte', () => {
    // le norme si LEGGONO dai dati: una norma nuova entra qui da sola
    expect(NORMS.length).toBeGreaterThan(10);
    for (const n of NORMS) {
      const id = normIdentity(n);
      expect(NORM_IDENTITIES[id], `la norma "${n.id}" mappa su un'identità inesistente`).toBeDefined();
    }
  });

  it('nessuna identità è codice morto: tutte compaiono nei dati veri', () => {
    const usate = new Set(NORMS.map((n) => normIdentity(n)));
    for (const id of Object.keys(NORM_IDENTITIES) as NormIdentity[]) {
      expect(usate.has(id), `l'identità "${id}" non corrisponde a nessuna norma: o è sbagliata la deduzione, o è decorazione`).toBe(true);
    }
  });

  it('i due regimi che condividono `restrittivo` restano distinti', () => {
    /**
     * È il motivo per cui questo modulo esiste. Nei dati, la biometria a
     * condizioni e i modelli GPAI hanno lo stesso `level`; se la deduzione
     * si rompesse, due regimi molto diversi tornerebbero a essere la stessa
     * cosa a schermo, e nessun test dei colori se ne accorgerebbe.
     */
    const restrittive = NORMS.filter((n) => n.level === 'restrittivo');
    expect(restrittive.length, 'nessuna norma `restrittivo`: il controllo sarebbe inerte').toBeGreaterThan(1);
    const identita = new Set(restrittive.map((n) => normIdentity(n)));
    expect(identita.has('gpai'), 'nessun GPAI riconosciuto fra le norme restrittive').toBe(true);
    expect(identita.has('biometria'), 'nessuna biometria riconosciuta fra le norme restrittive').toBe(true);
  });

  it('il GPAI si riconosce dall’icona, che è il dato che esiste davvero', () => {
    const gpai = NORMS.filter((n) => n.iconKey === GPAI_ICON_KEY);
    expect(gpai.length, `nessuna norma con icona "${GPAI_ICON_KEY}"`).toBeGreaterThan(0);
    for (const n of gpai) expect(normIdentity(n)).toBe('gpai');
  });
});

describe('l’identità non è affidata al solo colore', () => {
  it('ogni identità ha un glifo proprio, e nessuno lo condivide', () => {
    const visti = new Map<string, string>();
    for (const [id, st] of Object.entries(NORM_IDENTITIES)) {
      expect(st.glyph, `"${id}" senza glifo: resterebbe il solo colore`).not.toBe('');
      const cp = st.glyph.codePointAt(0) ?? 0;
      expect(
        cp >= 0x25a0 && cp <= 0x25ff,
        `"${id}" usa U+${cp.toString(16).toUpperCase()}, fuori dal blocco con la prova a schermo`
      ).toBe(true);
      const gemello = visti.get(st.glyph);
      expect(gemello, `"${id}" e "${gemello}" hanno lo stesso glifo`).toBeUndefined();
      visti.set(st.glyph, id);
    }
  });

  it('ogni identità ha un trattamento di fondo proprio', () => {
    const visti = new Map<string, string>();
    for (const [id, st] of Object.entries(NORM_IDENTITIES)) {
      const gemello = visti.get(st.pattern);
      expect(gemello, `"${id}" e "${gemello}" hanno lo stesso trattamento "${st.pattern}"`).toBeUndefined();
      visti.set(st.pattern, id);
    }
  });

  it('il colore di ogni identità si legge sul fondo della carta norma', () => {
    // la carta è night2 al 98% sopra carbon: il fondo vero, non quello nominale
    const fondo = '#0f192e';
    for (const [id, st] of Object.entries(NORM_IDENTITIES)) {
      const r = contrasto(st.color, fondo);
      expect(r, `"${id}" illeggibile sulla carta norma: ${r.toFixed(2)}`).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('le etichette delle identità esistono in entrambe le lingue', () => {
    for (const id of Object.keys(NORM_IDENTITIES) as NormIdentity[]) {
      expect(itDict.ui.normIdentities[id], `manca l'etichetta italiana di "${id}"`).toBeTruthy();
      expect(enDict.ui.normIdentities[id], `manca l'etichetta inglese di "${id}"`).toBeTruthy();
    }
  });
});

describe('la deduzione vive in un posto solo', () => {
  /**
   * Il difetto da cui questo controllo protegge non è un bug: è
   * un'abitudine. La prossima scena che vuole distinguere un GPAI scriverà
   * `iconKey === 'icon_model'` sul posto, perché è una riga; la quinta
   * scena che lo fa avrà una regola leggermente diversa dalle altre quattro,
   * e nessuno saprà quale è quella giusta.
   */
  const sorgenti = (dir: string): string[] => {
    const out: string[] = [];
    for (const e of readdirSync(resolve(root, dir), { withFileTypes: true })) {
      if (e.isDirectory()) out.push(...sorgenti(`${dir}/${e.name}`));
      else if (e.name.endsWith('.ts')) out.push(`${dir}/${e.name}`);
    }
    return out;
  };
  const CASA = 'src/game/assets/procedural/normIdentity.ts';
  const files = sorgenti('src/game').filter((f) => f !== CASA);

  it('nessun altro file riconosce il GPAI per conto proprio', () => {
    /**
     * Si cerca il CONFRONTO, non la stringa. `icon_model` compare anche fra
     * i dati dei luoghi e nel generatore che disegna quell'icona, ed è
     * giusto così: lì è una chiave, non una deduzione. Il difetto è
     * `=== 'icon_model'` scritto in una scena, cioè la regola rifatta a
     * mano — e un primo tentativo che cercava la sola stringa dichiarava
     * colpevoli i dati, che è il modo più rapido per far disattivare un
     * controllo.
     */
    const confronto = new RegExp(`[=!]==\\s*'${GPAI_ICON_KEY}'|'${GPAI_ICON_KEY}'\\s*[=!]==`);
    const colpevoli = files.filter((f) => confronto.test(read(f)));
    expect(colpevoli, `la deduzione è stata ricopiata in: ${colpevoli.join(', ')}`).toEqual([]);
  });

  it('nessun altro file ha una tabella di colori per livello di norma', () => {
    const colpevoli = files.filter((f) => /Record<NormLevel,/.test(read(f)));
    expect(
      colpevoli,
      `tabella per livello fuori dal modulo dell'identità: ${colpevoli.join(', ')}`
    ).toEqual([]);
  });
});

describe('la scala di gravità copre tutto ciò che si può scegliere', () => {
  /**
   * Le opzioni si leggono da i18n, dove il gioco le dichiara: una
   * classificazione o una misura nuova arriva qui senza che nessuno debba
   * ricordarsi di aggiungerla, e senza scala uscirebbe con zero tacche
   * invece che con un errore.
   */
  it('ogni classificazione ha un peso, e sta nella scala', () => {
    const chiavi = Object.keys(itDict.classifications);
    expect(chiavi.length).toBeGreaterThan(3);
    for (const k of chiavi) {
      const v = (CLASSIFICATION_SEVERITY as Record<string, number>)[k];
      expect(v, `la classificazione "${k}" non ha un peso dichiarato`).toBeDefined();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(SEVERITY_STEPS);
    }
  });

  it('ogni misura ha un peso, e sta nella scala', () => {
    const chiavi = Object.keys(itDict.measures);
    expect(chiavi.length).toBeGreaterThan(5);
    for (const k of chiavi) {
      const v = (MEASURE_SEVERITY as Record<string, number>)[k];
      expect(v, `la misura "${k}" non ha un peso dichiarato`).toBeDefined();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(SEVERITY_STEPS);
    }
  });

  it('la scala distingue davvero: non tutte le opzioni pesano uguale', () => {
    const pesi = new Set(Object.values(MEASURE_SEVERITY));
    expect(pesi.size, 'una scala con un valore solo non dice niente').toBeGreaterThan(3);
    expect(Math.max(...Object.values(MEASURE_SEVERITY))).toBe(SEVERITY_STEPS);
  });

  it('le due tinte della scala non sono lo stesso segnale: pieno contro vuoto', () => {
    // la tacca piena è riempita, la vuota è solo contornata: si contano
    // anche in bianco e nero, che è il punto
    const src = read('src/game/assets/procedural/severity.ts');
    expect(src).toContain('fillRect');
    expect(src).toContain('strokeRect');
  });
});

describe('il viola dei GPAI resta leggibile ovunque lo si usi', () => {
  it('supera la soglia AA sui fondi del gioco', () => {
    for (const [nome, fondo] of [['scena', COLOR_STR.carbon], ['pannello', COLOR_STR.night2], ['rapporto', '#0f1a2e']]) {
      const r = contrasto(COLOR_STR.gpai, fondo);
      expect(r, `viola GPAI illeggibile su "${nome}": ${r.toFixed(2)}`).toBeGreaterThanOrEqual(4.5);
    }
  });
});
