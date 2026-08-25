import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { firstCaseId } from '../src/game/data/missions';
import { getCase } from '../src/game/data/cases';
import { LOCALES } from '../src/game/i18n';

/**
 * IL PRIMO MINUTO GIOCATO.
 *
 * Prima di questo sprint il briefing portava sempre alla mappa civica: il
 * giocatore leggeva una schermata di testo e si trovava davanti a 13 casi
 * cliccabili senza aver mai esaminato un reperto. Imparava leggendo invece
 * che facendo — il contrario di quello che un serious game investigativo
 * dovrebbe chiedere nei primi secondi.
 *
 * Questi test bloccano le tre regressioni che riporterebbero indietro:
 * un caso guida non giocabile, una CTA mancante in una delle due lingue,
 * e il briefing che torna a spedire tutti sulla mappa.
 */
const brief = readFileSync(resolve(__dirname, '../src/game/scenes/BriefingScene.ts'), 'utf8');

describe('il briefing apre un fascicolo, non un menu', () => {
  it('il caso guida esiste ed è giocabile', () => {
    const c = getCase(firstCaseId());
    expect(c).toBeTruthy();
    expect(c.relevantClues.length).toBeGreaterThan(0);
  });

  it('il caso guida è derivato dalla missione demo, non scritto a mano nella scena', () => {
    expect(brief).toContain('firstCaseId()');
    expect(brief, 'un id di caso hardcoded nella scena si disallinea dalla demo')
      .not.toMatch(/caseId: ['"]case_/);
  });

  it("l'ingresso primario porta a un caso e la mappa resta come seconda opzione", () => {
    expect(brief).toMatch(/scene\.start\('Case'/);
    expect(brief).toMatch(/scene\.start\('CityMap'\)/);
    expect(brief).toContain('ctaFirstCase');
  });

  it('INVIO segue la CTA primaria, non la mappa', () => {
    const enter = brief.slice(brief.indexOf("keydown-ENTER"));
    expect(enter).toMatch(/scene\.start\('Case'/);
    expect(enter).not.toMatch(/scene\.start\('CityMap'\)/);
  });

  for (const [code, locale] of Object.entries(LOCALES)) {
    it(`${code}: entrambe le CTA del briefing sono tradotte e distinte`, () => {
      const { ctaFirstCase, cta } = locale.briefing;
      expect(ctaFirstCase.trim().length).toBeGreaterThan(0);
      expect(cta.trim().length).toBeGreaterThan(0);
      expect(ctaFirstCase).not.toBe(cta);
    });
  }
});
