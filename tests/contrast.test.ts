import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { COLOR_STR } from '../src/game/ui/theme';
import { AA_LARGE, AA_NORMAL, blend, contrastRatio, luminance, requiredRatio } from '../src/game/ui/contrast';

/**
 * CONTRASTO DEI TESTI SUL CANVAS.
 *
 * In theme.ts c'era una nota scritta a mano — «#e25b5b regge ~5.5:1 su nero
 * carbone» — giusta, ma che nessuno verificava. Una stima che nessuno
 * ricontrolla è la stessa cosa di un conteggio di casi ricopiato: prima o
 * poi smette di essere vera e nessuno se ne accorge.
 *
 * Qui i rapporti si calcolano, e le coppie colore/corpo si LEGGONO dal
 * sorgente invece di essere elencate a mano: aggiungere una scritta nuova
 * con un colore sbagliato fa diventare rosso questo file, senza che nessuno
 * debba ricordarsi di aggiornarlo.
 *
 * Onestà, come nel resto del progetto: misurare il contrasto NON dichiara
 * la conformità WCAG del gioco. È uno dei criteri, e l'unico che un file di
 * colori possa dimostrare da solo.
 */

const root = resolve(__dirname, '..');
/** Fondo delle scene. */
const SCENE_BG = COLOR_STR.carbon;
/** Fondo effettivo di un pannello: night2 al 92% sopra il fondo scena. */
const PANEL_BG = blend(COLOR_STR.night2, COLOR_STR.carbon, 0.92);

const walk = (dir: string): string[] =>
  readdirSync(resolve(root, dir)).flatMap((e) => {
    const rel = join(dir, e);
    return statSync(resolve(root, rel)).isDirectory() ? walk(rel) : rel.endsWith('.ts') ? [rel] : [];
  });

/** Ogni `textStyle(corpo, COLOR_STR.x)` presente nel gioco. */
const usages = (): Array<{ file: string; size: number; color: string; hex: string }> => {
  const out: Array<{ file: string; size: number; color: string; hex: string }> = [];
  for (const f of walk('src/game')) {
    const src = readFileSync(resolve(root, f), 'utf8');
    for (const m of src.matchAll(/textStyle\(\s*([\d.]+)\s*,\s*COLOR_STR\.(\w+)/g)) {
      const hex = (COLOR_STR as Record<string, string>)[m[2]];
      if (hex) out.push({ file: f, size: Number(m[1]), color: m[2], hex });
    }
  }
  return out;
};

describe('la matematica del contrasto è quella di WCAG', () => {
  it('bianco su nero è 21, un colore con se stesso è 1', () => {
    expect(contrastRatio('#ffffff', '#000000')).toBeCloseTo(21, 1);
    expect(contrastRatio('#5d7fb8', '#5d7fb8')).toBeCloseTo(1, 5);
  });

  it('la luminanza cresce dal nero al bianco', () => {
    expect(luminance('#000000')).toBe(0);
    expect(luminance('#ffffff')).toBeCloseTo(1, 5);
  });

  it('il testo grande ha una soglia più bassa, come prevede il criterio', () => {
    expect(requiredRatio(12)).toBe(AA_NORMAL);
    expect(requiredRatio(26)).toBe(AA_LARGE);
    expect(requiredRatio(19, true)).toBe(AA_LARGE);
    expect(requiredRatio(19, false)).toBe(AA_NORMAL);
  });

  it('un pannello semitrasparente non è il colore che dichiara', () => {
    expect(PANEL_BG).not.toBe(COLOR_STR.night2);
    expect(contrastRatio(COLOR_STR.paper, PANEL_BG)).toBeGreaterThan(contrastRatio(COLOR_STR.paper, COLOR_STR.night2));
  });
});

describe('ogni testo del gioco regge la soglia AA, sulla scena e sui pannelli', () => {
  const all = usages();

  it('il sorgente viene letto davvero: le coppie trovate non sono zero', () => {
    expect(all.length, 'nessuna textStyle(corpo, COLOR_STR.x) trovata: la ricerca è rotta').toBeGreaterThan(50);
  });

  for (const [label, bg] of [['fondo scena', SCENE_BG], ['pannello', PANEL_BG]] as const) {
    it(`sul ${label} nessuna scritta scende sotto la soglia`, () => {
      const offenders = all
        .map((u) => ({ ...u, ratio: contrastRatio(u.hex, bg), need: requiredRatio(u.size) }))
        .filter((u) => u.ratio < u.need)
        .map((u) => `${u.file}: ${u.size}px ${u.color} (${u.hex}) → ${u.ratio.toFixed(2)}:1, serve ${u.need}`);
      expect([...new Set(offenders)], offenders.join('\n')).toEqual([]);
    });
  }
});

/**
 * Il colore di un testo non arriva sempre da una textStyle scritta lì: può
 * passare da un campo `color:` di un oggetto, o da un setColor(). La prima
 * versione di questo file guardava solo textStyle, e infatti NON si accorse
 * di una scritta della mappa che tornava alla tinta piena passando per un
 * campo. Stessa trappola, e stessa correzione, degli URL nascosti in una
 * variabile che noExternalForms non vedeva.
 */
const textColorRefs = (): Array<{ file: string; color: string }> => {
  const out: Array<{ file: string; color: string }> = [];
  for (const f of walk('src/game')) {
    const src = readFileSync(resolve(root, f), 'utf8');
    for (const m of src.matchAll(/(?:textStyle\(\s*[\d.]+\s*,\s*|color:\s*|setColor\([^)]*?)COLOR_STR\.(\w+)/g)) {
      out.push({ file: f, color: m[1] });
    }
  }
  return out;
};

describe('le varianti per il testo esistono perché le tinte piene non bastano', () => {
  it('il rosso pieno non regge AA: per questo esiste alertText', () => {
    expect(contrastRatio(COLOR_STR.alert, SCENE_BG)).toBeLessThan(AA_NORMAL);
    expect(contrastRatio(COLOR_STR.alertText, SCENE_BG)).toBeGreaterThanOrEqual(AA_NORMAL);
  });

  it("l'accento pieno non regge AA sui pannelli: per questo esiste accentText", () => {
    expect(contrastRatio(COLOR_STR.accent, PANEL_BG)).toBeLessThan(AA_NORMAL);
    expect(contrastRatio(COLOR_STR.accentText, PANEL_BG)).toBeGreaterThanOrEqual(AA_NORMAL);
  });

  it('le tinte piene non compaiono come colore di testo, comunque ci arrivino', () => {
    const refs = textColorRefs();
    expect(refs.length, 'la ricerca dei colori di testo è rotta').toBeGreaterThan(60);
    for (const tint of ['alert', 'accent', 'iron']) {
      const found = refs.filter((r) => r.color === tint);
      expect(
        found.map((r) => r.file),
        `COLOR_STR.${tint} è usato come colore di testo: serve la variante chiara`
      ).toEqual([]);
    }
  });

  it('iron non reggerebbe nemmeno la soglia del testo grande', () => {
    expect(contrastRatio(COLOR_STR.iron, SCENE_BG)).toBeLessThan(AA_LARGE);
  });
});
