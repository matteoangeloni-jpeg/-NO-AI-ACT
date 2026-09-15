import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { it as itLocale } from '../src/game/i18n/it';
import { en } from '../src/game/i18n/en';
import { getGameMode } from '../src/game/data/gameModes';

/**
 * TITLE-SCREEN UX GUARD (post-Tally simplification).
 *
 * The first screen must feel like a game entry point, not an admin dashboard:
 *  - primary actions: CONTINUA INDAGINE (only with progress) + NUOVA PARTITA;
 *  - secondary groups: DOCENTI E CLASSE / RISORSE / IMPOSTAZIONI;
 *  - RESET is NOT a top-level action — it lives in Settings behind an explicit
 *    confirmation;
 *  - teacher guide and site resources stay reachable (through the groups);
 *  - a short micro-framing tagline explains role/effect/goal in <10 seconds.
 */

const root = resolve(__dirname, '..');
const title = readFileSync(resolve(root, 'src/game/scenes/TitleScene.ts'), 'utf8');

/** The create() body — the top-level menu — as its own slice. */
const createBody = title.slice(title.indexOf('create(): void'), title.indexOf('private closeGroup'));

describe('title screen — simplified player-first hierarchy', () => {
  it('top-level menu has exactly the 2 primary actions + 3 group buttons', () => {
    // primary
    expect(createBody).toContain('m.continue');
    expect(createBody).toContain('m.newGame');
    // secondary groups
    expect(createBody).toContain('m.teachers');
    expect(createBody).toContain('m.resources');
    expect(createBody).toContain('m.settings');
    // no other former top-level entries remain in create()
    for (const gone of ['m.archive', 'm.credits', 'm.reset', 'ui.siteLinks.button', 'teacherGuide.button']) {
      expect(createBody, `create() must not place ${gone} at top level`).not.toContain(gone);
    }
  });

  it('RESET is not top-level: it lives in Settings and requires confirmation', () => {
    expect(createBody).not.toContain('m.reset');
    const settings = title.slice(title.indexOf('private openSettings'), title.indexOf('private openTeachers'));
    expect(settings).toContain('m.reset');
    expect(settings).toContain('m.resetConfirm'); // two-step confirm before wiping
    expect(settings).toContain("variant: 'danger'");
    expect(settings).toContain('StateManager.newGame()');
  });

  it('the three groups keep everything reachable (guide, site links, archive, glossary, credits)', () => {
    const teachers = title.slice(title.indexOf('private openTeachers'), title.indexOf('private openResources'));
    expect(teachers).toContain('teacherGuide.button');
    expect(teachers).toContain('setTeacherMode');
    const resources = title.slice(title.indexOf('private openResources'), title.indexOf('private startGame'));
    expect(resources).toContain('m.archive');
    expect(resources).toContain('glossary.title');
    expect(resources).toContain('ui.siteLinks.button');
    // I crediti stanno in Impostazioni: riguardano chi firma il progetto, non
    // il materiale didattico a cui il giocatore attinge dalle Risorse.
    expect(resources, 'i crediti non stanno piu\' fra le risorse').not.toContain('m.credits');
    const settings = title.slice(title.indexOf('private openSettings'), title.indexOf('private openTeachers'));
    expect(settings, 'i crediti devono essere raggiungibili da Impostazioni').toContain('m.credits');
    for (const k of ['m.language', 'setDifficulty', 'settingsPrivacy']) {
      expect(settings, `settings must contain ${k}`).toContain(k);
    }
    // Il percorso NON si sceglie più qui: due manopole per la stessa cosa
    // erano il motivo per cui girare la durata non cambiava la partita.
    expect(settings, 'la composizione della sessione vive in NUOVA PARTITA').not.toContain('setMission');
  });

  it('save-present and save-absent states differ only by the CONTINUA row', () => {
    expect(createBody).toContain('const showContinue = hasSave && StateManager.completedCount() > 0');
    expect(createBody).toMatch(/if \(showContinue\) \{\s*\n\s*specs\.push/);
  });
});

describe('title screen — i18n labels and micro-framing', () => {
  for (const [name, l] of [['IT', itLocale], ['EN', en]] as const) {
    it(`${name} has all group labels and the reset confirmation`, () => {
      for (const k of ['teachers', 'resources', 'settings', 'resetConfirm'] as const) {
        expect(l.ui.menu[k].trim().length, `${name}.menu.${k}`).toBeGreaterThan(0);
      }
      for (const k of ['settingsTitle', 'settingsPrivacy', 'teachersTitle', 'teachersNote', 'resourcesTitle', 'resourcesNote', 'close'] as const) {
        expect(l.ui.titleGroups[k].trim().length, `${name}.titleGroups.${k}`).toBeGreaterThan(0);
      }
    });

    it(`${name} tagline frames role/effect/goal and reads in under 10 seconds`, () => {
      const tag = l.ui.titleTagline;
      expect(tag.length).toBeGreaterThan(40);
      expect(tag.length).toBeLessThan(200); // short: readable in <10s
      expect(tag).not.toMatch(/tally/i);
    });
  }

  it('recommended labels are used verbatim', () => {
    expect(itLocale.ui.menu.teachers).toBe('DOCENTI E CLASSE');
    expect(itLocale.ui.menu.resources).toBe('RISORSE');
    expect(itLocale.ui.menu.settings).toBe('IMPOSTAZIONI');
    expect(en.ui.menu.teachers).toBe('TEACHERS & CLASSROOM');
    expect(en.ui.menu.resources).toBe('RESOURCES');
    expect(en.ui.menu.settings).toBe('SETTINGS');
    expect(itLocale.ui.menu.continue).toBe('CONTINUA INDAGINE');
    expect(en.ui.menu.continue).toBe('CONTINUE INVESTIGATION');
  });
});


/**
 * NUOVA PARTITA compone la sessione.
 *
 * Prima il bottone partiva e basta: modalità, pubblico e durata stavano in
 * due posti diversi (una voce di menu e le impostazioni) e nessuno dei due
 * veniva letto al momento di cominciare. Chi metteva 90 minuti riceveva la
 * stessa partita di chi ne metteva 15.
 */
describe('NUOVA PARTITA apre la composizione della sessione', () => {
  const panel = title.slice(title.indexOf('private openNewGame'), title.indexOf('private startPlanned'));

  it('il bottone apre il pannello invece di avviare al primo clic', () => {
    expect(createBody).toContain('m.newGame');
    expect(createBody).toContain('this.openNewGame(hasSave)');
  });

  it('la voce di menu separata "per chi giochi" non esiste più', () => {
    for (const dict of [itLocale, en]) {
      expect(Object.keys(dict.ui.menu)).not.toContain('audienceMenu');
    }
    expect(title).not.toContain('openAudience');
  });

  it('tutte e tre le manopole stanno nel pannello, a un clic da NUOVA PARTITA', () => {
    for (const k of ['setGameMode', 'setAudience', 'setSessionMinutes']) {
      expect(panel, `il pannello deve poter cambiare ${k}`).toContain(k);
    }
  });

  it('ogni manopola ricalcola il riepilogo: è la promessa fatta a chi la gira', () => {
    // tre pulsanti che cambiano la sessione, tre chiamate a refresh()
    const refreshes = panel.match(/\brefresh\(\);/g) ?? [];
    expect(refreshes.length, 'un selettore che non ricalcola mente sul piano').toBeGreaterThanOrEqual(4);
    expect(panel).toContain('StateManager.gamePlan');
  });

  it('una modalità senza niente da proporre non si può avviare', () => {
    expect(panel).toContain("plan.unavailable === 'nothingToReview'");
    expect(panel).toContain('startBtn.setEnabled(false)');
    const start = title.slice(title.indexOf('private startPlanned'));
    expect(start, 'e non parte nemmeno se qualcuno ci arriva lo stesso').toContain('if (plan.unavailable) return;');
  });
});

/**
 * Il pannello NUOVA PARTITA dichiara una difficoltà nella riga di riepilogo.
 * Se poi la partita ne usasse un'altra — quella lasciata nelle impostazioni —
 * il pannello mentirebbe, e proprio sull'ispezione a sorpresa, che annuncia
 * l'esperto per definizione.
 */
describe('la difficoltà annunciata è quella che si gioca', () => {
  const start = title.slice(title.indexOf('private startPlanned'));

  it("l'avvio applica la difficoltà del piano", () => {
    expect(start).toContain('StateManager.setDifficulty(plan.difficulty)');
  });

  it("e la applica prima di far partire la scena, non dopo", () => {
    expect(start.indexOf('setDifficulty')).toBeLessThan(start.indexOf('fadeOutScene'));
  });

  it("l'ispezione a sorpresa dichiara davvero l'esperto", () => {
    expect(getGameMode('sorpresa').forcedDifficulty).toBe('expert');
  });
});
