import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

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
  it('RENDER_SCALE è dichiarato una volta sola e vale almeno 2', () => {
    const m = theme.match(/export const RENDER_SCALE = (\d+)/);
    expect(m, 'RENDER_SCALE deve restare in theme.ts, accanto a GAME_WIDTH').not.toBeNull();
    expect(Number(m?.[1])).toBeGreaterThanOrEqual(2);
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

  it('nessuna scena disegna una texture generata affidandosi alla sua dimensione nativa', () => {
    const scenes = ['CityMapScene', 'FinaleScene', 'CaseScene', 'ReportScene'];
    const offenders: string[] = [];
    for (const name of scenes) {
      const src = read(`src/game/scenes/${name}.ts`);
      for (const line of src.split('\n')) {
        const usesTexture = /add\.image\([^)]*'(citymap|dossier_paper|icon_[a-z]+)'/.test(line);
        if (usesTexture && !line.includes('setDisplaySize')) offenders.push(`${name}: ${line.trim()}`);
      }
    }
    expect(offenders, offenders.join('\n')).toEqual([]);
  });
});
