import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { MAX_RENDER_SCALE, computeRenderScale } from '../src/game/ui/theme';

/**
 * RISOLUZIONE DI RENDERING.
 *
 * Il canvas era sempre 1280×720, a qualunque dimensione di finestra e a
 * qualunque densità di schermo: su un monitor 1080p il gioco era un 720p
 * ingrandito, su un 4K lo era il triplo. Misurato leggendo canvas.width nel
 * browser, non dedotto.
 *
 * La correzione crea il canvas a RENDER_SCALE volte il mondo logico e lascia
 * le coordinate delle scene dove stanno, ingrandendo la camera. Ha tre pezzi
 * che devono restare insieme, ed è per questo che ci sono questi controlli:
 * senza lo zoom della camera si vedrebbe un quarto di schermo, senza
 * `resolution` sul testo si tornerebbe alla sfocatura di prima, e una texture
 * generata al doppio ma disegnata senza dimensione dichiarata comparirebbe
 * grande il doppio.
 *
 * `zoom` nella configurazione dello scale manager NON fa questo: con mode
 * FIT viene ignorato. Provato e scartato.
 */

const read = (p: string): string => readFileSync(resolve(__dirname, '..', p), 'utf8');
const config = read('src/game/GameConfig.ts');
const theme = read('src/game/ui/theme.ts');

describe('il canvas è più grande del mondo logico', () => {
  /** Quanto chiederebbe uno schermo se non ci fosse un tetto. */
  const computeRenderScaleUncapped = (w: number, h: number, dpr: number): number =>
    Math.min(w / 1280, h / 720) * dpr;

  it('il fattore vale quanti pixel reali occuperà un pixel logico', () => {
    // schermo che mostra il gioco a dimensione logica: 1:1, niente da guadagnare
    expect(computeRenderScale(1280, 720, 1)).toBe(1);
    // schermo più grande: si disegna quanto verrà davvero mostrato
    expect(computeRenderScale(1920, 1080, 1)).toBeCloseTo(1.5, 5);
    expect(computeRenderScale(2560, 1440, 1)).toBe(2);
    // densità dello schermo compresa
    expect(computeRenderScale(1280, 720, 2)).toBe(2);
    // il caso che il vecchio tetto 2 tagliava: finestra 1600×900 a densità 2
    expect(computeRenderScale(1600, 900, 2)).toBeCloseTo(2.5, 5);
  });

  it('non scende mai sotto 1: sotto la dimensione logica si perde dettaglio', () => {
    expect(computeRenderScale(640, 360, 1)).toBe(1);
    expect(computeRenderScale(320, 240, 0.5)).toBe(1);
  });

  it('non supera il tetto: oltre non si vede la differenza e si paga sola', () => {
    expect(computeRenderScale(5120, 2880, 2)).toBe(MAX_RENDER_SCALE);
    // Il tetto deve coprire almeno una finestra 1080p su schermo denso: è
    // il caso che lo teneva sotto il necessario quando valeva 2.
    expect(MAX_RENDER_SCALE).toBeGreaterThanOrEqual(computeRenderScaleUncapped(1920, 1080, 2));
  });

  it('un viewport assurdo non produce un canvas assurdo', () => {
    for (const bad of [
      computeRenderScale(0, 0, 1),
      computeRenderScale(Number.NaN, 720, 1),
      computeRenderScale(1280, 720, Number.NaN)
    ]) {
      expect(bad).toBeGreaterThanOrEqual(1);
      expect(bad).toBeLessThanOrEqual(MAX_RENDER_SCALE);
    }
  });

  it('fuori da un browser vale 1, così i test non dipendono da una finestra', () => {
    expect(theme).toContain("typeof window === 'undefined'");
  });

  it('la dimensione del gioco è il mondo moltiplicato per RENDER_SCALE', () => {
    expect(config).toMatch(/width:\s*GAME_WIDTH \* RENDER_SCALE/);
    expect(config).toMatch(/height:\s*GAME_HEIGHT \* RENDER_SCALE/);
  });

  it('la camera di ogni scena è ingrandita e centrata sul mondo', () => {
    expect(config, 'senza questo si vedrebbe un quarto di schermo').toContain('setZoom(RENDER_SCALE)');
    expect(config).toContain('centerOn(GAME_WIDTH / 2, GAME_HEIGHT / 2)');
    expect(config, "l'aggancio deve valere per tutte le scene, non per quelle ricordate a mano").toContain('game.scene.scenes');
  });

  it('lo zoom dello scale manager non viene usato: con FIT è inerte', () => {
    const scaleBlock = config.slice(config.indexOf('scale: {'), config.indexOf('callbacks:'));
    expect(scaleBlock).not.toMatch(/\bzoom\s*:/);
  });
});

describe('il testo viene rasterizzato alla risoluzione del canvas', () => {
  it('textStyle dichiara resolution, o ogni scritta torna sfocata', () => {
    const fn = theme.slice(theme.indexOf('export function textStyle'));
    expect(fn).toContain('resolution: RENDER_SCALE');
  });

  it('resolution sta prima dello spread, così una scena può ancora sovrascriverlo', () => {
    const fn = theme.slice(theme.indexOf('export function textStyle'));
    expect(fn.indexOf('resolution: RENDER_SCALE')).toBeLessThan(fn.indexOf('...extra'));
  });
});

describe('le texture generate al doppio dichiarano la dimensione con cui si mostrano', () => {
  const generators = [
    'src/game/assets/procedural/createCityMap.ts',
    'src/game/assets/procedural/createIcons.ts',
    'src/game/assets/procedural/createDossierTextures.ts'
  ];

  for (const g of generators) {
    it(`${g.split('/').pop()} scala il contesto insieme al canvas`, () => {
      const src = read(g);
      expect(src, 'canvas ingrandito senza ctx.scale = disegno minuscolo in un angolo').toContain(
        'ctx.scale(RENDER_SCALE, RENDER_SCALE)'
      );
      expect(src).toContain('* RENDER_SCALE');
    });
  }

  /**
   * getImageData e putImageData NON vedono ctx.scale: contano pixel del
   * canvas. Su una texture generata al doppio, chiederli in unità logiche
   * legge un quarto dell'immagine e riscrive lì — la mappa civica usciva con
   * un quadrante granuloso e tre lisci. La regola vale per ogni generatore
   * che scala il contesto, e quali siano si legge dal disco.
   */
  it('chi scala il contesto legge i pixel dal canvas, non dalle unità logiche', () => {
    const dir = 'src/game/assets/procedural';
    const files = readdirSync(resolve(__dirname, '..', dir)).filter((f) => f.endsWith('.ts'));
    expect(files.length).toBeGreaterThan(0);

    const scaled = files.filter((f) => read(`${dir}/${f}`).includes('ctx.scale(RENDER_SCALE'));
    expect(scaled.length, 'nessun generatore scalato = controllo inerte').toBeGreaterThan(0);

    const offenders: string[] = [];
    for (const f of scaled) {
      for (const line of read(`${dir}/${f}`).split('\n')) {
        const m = /\.(get|put)ImageData\(([^)]*)\)/.exec(line);
        if (!m) continue;
        const args = m[2];
        const readsPixels = m[1] === 'put' || /canvas\.(width|height)/.test(args);
        if (!readsPixels) offenders.push(`${f}: ${line.trim()}`);
      }
    }
    expect(offenders, offenders.join('\n')).toEqual([]);
  });

  /**
   * L'elenco dei file NON è scritto qui. La versione precedente di questo
   * controllo nominava quattro scene a mano, e TitleScene — che disegnava
   * davvero la mappa grande il doppio — non era fra quelle: la guardia
   * passava verde sopra il difetto che esisteva per trovare. Ora i file si
   * leggono dal disco, così una scena nuova è coperta il giorno che nasce.
   */
  it('nessuna scena disegna una texture generata affidandosi alla sua dimensione nativa', () => {
    const dirs = ['src/game/scenes', 'src/game/ui'];
    const files: string[] = [];
    for (const dir of dirs) {
      for (const f of readdirSync(resolve(__dirname, '..', dir))) {
        if (f.endsWith('.ts')) files.push(`${dir}/${f}`);
      }
    }
    expect(files.length, 'se la lettura del disco fallisse, il controllo sarebbe vuoto').toBeGreaterThan(20);

    const offenders: string[] = [];
    for (const path of files) {
      for (const line of read(path).split('\n')) {
        const usesTexture = /add\.image\([^)]*'(citymap|dossier_paper|icon_[a-z_]+)'/.test(line);
        if (usesTexture && !line.includes('setDisplaySize')) offenders.push(`${path}: ${line.trim()}`);
      }
    }
    expect(offenders, offenders.join('\n')).toEqual([]);
  });
});
