import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { it as itDict } from '../src/game/i18n/it';
import { en } from '../src/game/i18n/en';

/**
 * U03 — RIEPILOGO E FIRMA SEPARATI.
 *
 * Prima scegliere la motivazione FIRMAVA: il quarto bottone chiamava
 * direttamente resolve(), che archivia il rapporto, muove gli indicatori e
 * chiude il caso. Chi cliccava un'opzione per leggerla meglio aveva già
 * consegnato, e l'unico modo di correggersi era rigiocare il fascicolo.
 *
 * La scena è Phaser e non si istanzia sotto vitest: i controlli leggono il
 * sorgente, ma su proprietà che contano — che la motivazione non risolva
 * più, che la firma passi da una verifica di completezza, e che nessuno
 * possa firmare due volte.
 */

const src = readFileSync(resolve(__dirname, '../src/game/scenes/DecisionScene.ts'), 'utf8');

describe('scegliere la motivazione non firma più', () => {
  it('il quarto passo registra e prosegue, invece di risolvere', () => {
    const step4 = src.slice(src.indexOf('private showMotivationStep'), src.indexOf('private showSummaryStep'));
    expect(step4, 'la motivazione non deve più chiamare resolve()').not.toMatch(/this\.resolve\(/);
    expect(step4).toContain('this.motivation = i;');
    expect(step4).toContain('this.showSummaryStep()');
  });

  it('esiste un passo di riepilogo, e mostra tutte le scelte prese', () => {
    const step5 = src.slice(src.indexOf('private showSummaryStep'), src.indexOf('private sign('));
    for (const field of ['classification', 'measure', 'subject', 'clues', 'motivation']) {
      expect(step5, `il riepilogo non mostra ${field}`).toContain(`t.summary.${field}`);
    }
  });
});

describe('la firma è un gesto suo, e verifica la completezza', () => {
  const sign = src.slice(src.indexOf('private sign('), src.indexOf('// ----------------------------------------------------- overlay norme'));

  it('rifiuta un rapporto incompleto, qualunque pezzo manchi', () => {
    for (const field of ['classification', 'measure', 'subject', 'motivation']) {
      expect(sign, `la firma non controlla ${field}`).toContain(`this.${field} === null`);
    }
  });

  it('verifica la completezza, non la correttezza', () => {
    expect(sign, 'la firma non deve sapere quale sia la risposta giusta').not.toMatch(/correct|caseData\./);
  });

  it('non si firma due volte, né col bottone né col tasto', () => {
    expect(sign).toContain('if (this.resolved) return;');
    expect(src, 'la guardia in resolve resta la seconda rete').toContain('if (this.resolved) return; // un solo rapporto per fascicolo');
  });

  it('il tasto INVIO firma solo quando non c\'è un pannello di lettura aperto', () => {
    const step5 = src.slice(src.indexOf('private showSummaryStep'), src.indexOf('private sign('));
    const enter = step5.slice(step5.indexOf("keydown-ENTER"));
    for (const guard of ['this.overlay', 'this.contextOverlay.isOpen', 'this.caseNormOverlay.isOpen']) {
      expect(enter, `manca la guardia ${guard}`).toContain(guard);
    }
  });

  it('dal riepilogo si torna indietro, e il ritorno libera la motivazione', () => {
    const step5 = src.slice(src.indexOf('private showSummaryStep'), src.indexOf('private sign('));
    expect(step5).toContain('this.stepBack(() => { this.motivation = null; }');
    expect(step5).toContain('this.showMotivationStep()');
  });
});

describe('i testi del passo di firma esistono in entrambe le lingue', () => {
  for (const [lang, dict] of [['it', itDict], ['en', en]] as const) {
    it(`${lang}: etichette, avviso e suggerimento da tastiera`, () => {
      const d = dict.ui.decision;
      expect(d.step5, `${lang}: manca step5`).toBeTruthy();
      expect(d.sign).toBeTruthy();
      expect(d.signHint, `${lang}: il suggerimento deve nominare i tasti`).toMatch(/ENTER|INVIO/);
      expect(d.signHint).toContain('BACKSPACE');
      expect(d.signNote, `${lang}: l'avviso deve dire che firmare non è aver risposto bene`).toBeTruthy();
      for (const k of ['classification', 'measure', 'subject', 'motivation', 'clues'] as const) {
        expect(d.summary[k], `${lang}: manca summary.${k}`).toBeTruthy();
      }
    });
  }

  it('i passi si contano fino a cinque, in entrambe le lingue', () => {
    for (const [lang, dict] of [['it', itDict], ['en', en]] as const) {
      const d = dict.ui.decision;
      for (const [i, label] of [d.step1, d.step2, d.step3, d.step4, d.step5].entries()) {
        expect(label, `${lang}: il passo ${i + 1} non dichiara cinque passi`).toMatch(/(DI|OF) 5/);
        expect(label, `${lang}: il passo ${i + 1} si numera male`).toMatch(new RegExp(`(DECISIONE|DECISION) ${i + 1} `));
      }
    }
  });
});
