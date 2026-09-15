import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { it as itDict } from '../src/game/i18n/it';
import { en } from '../src/game/i18n/en';

const root = resolve(__dirname, '..');
const read = (p: string): string => readFileSync(resolve(root, p), 'utf8');
const src = read('src/game/ui/TypewriterText.ts');

/**
 * IL TESTO A MACCHINA SI POTEVA GIÀ SALTARE. NON LO SAPEVA NESSUNO.
 *
 * Un clic completava la scrittura, ma niente lo diceva — e la scrittura è
 * la prima cosa che il gioco fa. Chi arriva pensa che i primi minuti siano
 * un'introduzione da subire, e qualcuno se ne va prima di toccare un
 * fascicolo. Chi ha giocato lo ha indicato come la cosa più importante da
 * sistemare.
 *
 * Il suggerimento e i tasti stanno nella classe e non nelle scene: erano
 * quattro scene a registrare il clic ciascuna per conto suo, e la tastiera
 * non la registrava nessuna.
 */
describe('la scrittura a macchina dichiara che si può saltare', () => {
  it('mostra un suggerimento mentre scrive', () => {
    expect(src).toContain('ui.typewriterHint');
    const write = src.slice(src.indexOf('write(text: string'), src.indexOf('skip(): void'));
    expect(write, 'il suggerimento deve nascere insieme alla scrittura').toContain('this.hint = this.scene.add');
  });

  it('e lo toglie appena il testo è completo', () => {
    const finish = src.slice(src.indexOf('private finish()'));
    expect(finish).toContain('this.hint?.destroy()');
  });

  it("con \"riduci animazioni\" non compare: non c'è niente da saltare", () => {
    const write = src.slice(src.indexOf('write(text: string'), src.indexOf('skip(): void'));
    const reduced = write.slice(write.indexOf('reducedMotion'));
    const early = reduced.slice(0, reduced.indexOf('}'));
    expect(early, 'il ramo "riduci animazioni" esce prima di creare il suggerimento').toContain('return;');
    expect(early).not.toContain('this.hint =');
  });

  it('la tastiera salta quanto il puntatore, e la promessa nomina entrambi', () => {
    expect(src).toContain("'keydown-SPACE'");
    expect(src).toContain("'keydown-ENTER'");
    expect(src, 'i gestori vanno tolti a fine scrittura, o restano appesi alla scena').toContain('this.scene.input.off(');
    for (const [lang, dict] of [['it', itDict], ['en', en]] as const) {
      const hint = dict.ui.typewriterHint;
      expect(hint.length, `${lang}`).toBeGreaterThan(20);
      expect(hint.toUpperCase(), `${lang}: il suggerimento deve nominare il tasto`).toMatch(/SPAZIO|SPACE/);
    }
  });

  /**
   * Le scene continuano a registrare il proprio clic — è innocuo, skip() è
   * idempotente — ma nessuna deve reinventare la tastiera per conto suo:
   * è così che si finisce con una scena che salta e tre che no.
   */
  it('nessuna scena si registra i tasti di salto per conto proprio', () => {
    const scenes = readdirSync(resolve(root, 'src/game/scenes')).filter((f) => f.endsWith('.ts'));
    expect(scenes.length).toBeGreaterThan(10);
    const offenders: string[] = [];
    for (const f of scenes) {
      const s = read(`src/game/scenes/${f}`);
      if (!s.includes('TypewriterText')) continue;
      for (const line of s.split('\n')) {
        if (/keydown-(SPACE|ENTER)[^)]*\)\s*=>\s*\w+\.skip\(\)/.test(line)) offenders.push(`${f}: ${line.trim()}`);
      }
    }
    expect(offenders, offenders.join('\n')).toEqual([]);
  });
});
