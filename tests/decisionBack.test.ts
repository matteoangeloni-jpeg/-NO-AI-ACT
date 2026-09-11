import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { it as itDict } from '../src/game/i18n/it';
import { en } from '../src/game/i18n/en';

/**
 * U02 — INDIETRO IN TUTTI I PASSI.
 *
 * Prima il ritorno esisteva solo al primo passo, e portava fuori dalla
 * decisione (ai reperti). Dai passi 2, 3 e 4 non si tornava: una misura
 * scelta per sbaglio si poteva correggere solo firmando un rapporto che il
 * giocatore sapeva già sbagliato, oppure abbandonando il fascicolo.
 *
 * Questa scena è Phaser e non si istanzia sotto vitest, quindi i controlli
 * leggono il sorgente. Sono scritti sulle proprietà che contano — ogni
 * passo ha un ritorno, ogni ritorno azzera SOLO la propria scelta, e il
 * ritorno è raggiungibile da tastiera — non sulla formattazione.
 */

const src = readFileSync(resolve(__dirname, '../src/game/scenes/DecisionScene.ts'), 'utf8');

describe('ogni passo della decisione ha un ritorno', () => {
  it('tutte le associazioni dei tasti dichiarano anche un ritorno', () => {
    const calls = [...src.matchAll(/this\.bindNumberKeys\(([^;]*?)\);/gs)].map((m) => m[1]);
    expect(calls.length, 'i passi della decisione sono quattro').toBe(4);
    for (const [i, args] of calls.entries()) {
      expect(args.split(',').length, `passo ${i + 1}: bindNumberKeys senza terzo argomento`).toBeGreaterThanOrEqual(3);
    }
  });

  it('ogni passo costruisce il proprio bottone di ritorno', () => {
    expect((src.match(/this\.backBtn = this\.addBackButton\(/g) ?? []).length).toBe(4);
    expect(src, 'nessun passo deve più azzerare il bottone di ritorno').not.toContain('this.backBtn = undefined;');
  });

  it('il ritorno azzera una sola scelta per passo, e sono tutte e tre', () => {
    const cleared = [...src.matchAll(/this\.stepBack\(\(\) => \{ this\.(\w+) = null; \}/g)].map((m) => m[1]);
    expect(cleared).toEqual(['classification', 'measure', 'subject']);
  });

  it('il bottone di ritorno resta dentro il canvas', () => {
    // Il Button è centrato: con una larghezza superiore al doppio della x il
    // bordo sinistro esce dallo schermo. È successo davvero allargando
    // l'etichetta da "◂ REPERTI" a "◂ PASSO PRECEDENTE" senza spostare il
    // centro, e a occhio non si nota finché non manca mezzo bottone.
    const x = Number(src.match(/export const BACK_BTN_X = (\d+)/)?.[1]);
    const w = Number(src.match(/export const BACK_BTN_W = (\d+)/)?.[1]);
    expect(Number.isFinite(x) && Number.isFinite(w), 'le due costanti devono restare dichiarate').toBe(true);
    expect(x - w / 2, `bordo sinistro a ${x - w / 2}px`).toBeGreaterThanOrEqual(0);
  });

  it('le etichette di ritorno entrano nella larghezza dichiarata', () => {
    const w = Number(src.match(/export const BACK_BTN_W = (\d+)/)?.[1]);
    // ~7 px per carattere a fontSize 12 nel font condensato della UI, più il
    // padding interno: una stima prudente, serve a intercettare un'etichetta
    // molto più lunga, non a misurare il rendering.
    for (const [lang, dict] of [['it', itDict], ['en', en]] as const) {
      for (const label of [dict.ui.decision.stepBack, dict.ui.evidence.backToEvidence]) {
        expect(label.length * 7 + 24, `${lang}: "${label}" non entra in ${w}px`).toBeLessThanOrEqual(w);
      }
    }
  });

  it('dal primo passo si torna ai reperti, non a un passo che non esiste', () => {
    expect(src).toMatch(/this\.scene\.start\('Evidence', \{ caseId: this\.caseData\.id \}\)/);
  });
});

describe('il ritorno è utilizzabile da tastiera e non scavalca la firma', () => {
  it('BACKSPACE è associato dentro bindNumberKeys, che riazzera i listener a ogni passo', () => {
    const body = src.slice(src.indexOf('private bindNumberKeys'), src.indexOf('private stepBack'));
    expect(body, 'legarlo fuori significherebbe perderlo al passo successivo').toContain("keydown-BACKSPACE");
    expect(body.indexOf('removeAllListeners')).toBeLessThan(body.indexOf('keydown-BACKSPACE'));
  });

  it('il ritorno da tastiera tace mentre un overlay è aperto', () => {
    const handler = src.slice(src.indexOf("keydown-BACKSPACE"), src.indexOf('private stepBack'));
    for (const guard of ['this.overlay', 'this.contextOverlay.isOpen', 'this.caseNormOverlay.isOpen']) {
      expect(handler, `manca la guardia ${guard}`).toContain(guard);
    }
  });

  it('un rapporto già risolto non si può più modificare tornando indietro', () => {
    const stepBack = src.slice(src.indexOf('private stepBack'), src.indexOf('private addBackButton'));
    expect(stepBack).toContain('if (this.resolved) return;');
    const handler = src.slice(src.indexOf("keydown-BACKSPACE"), src.indexOf('private stepBack'));
    expect(handler, 'anche la tastiera deve rispettare la guardia').toContain('!this.resolved');
  });

  it('la guardia contro la doppia risoluzione resta dov era', () => {
    expect(src).toContain('if (this.resolved) return; // un solo rapporto per fascicolo');
  });
});

describe("l'etichetta e l'annuncio del ritorno esistono in entrambe le lingue", () => {
  it('stepBack e stepBackHint sono dichiarati, e il suggerimento nomina il tasto', () => {
    for (const [lang, dict] of [['it', itDict], ['en', en]] as const) {
      expect(dict.ui.decision.stepBack, `${lang}`).toBeTruthy();
      expect(dict.ui.decision.stepBackHint, `${lang}`).toContain('BACKSPACE');
    }
  });

  it('il suggerimento è annunciato dallo strato di lettura in ogni passo', () => {
    const header = src.slice(src.indexOf('private header('), src.indexOf('update()'));
    expect(header).toContain('L().ui.decision.stepBackHint');
  });
});
