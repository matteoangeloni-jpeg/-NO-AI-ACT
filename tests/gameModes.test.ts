import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  DEFAULT_GAME_MODE,
  GAME_MODES,
  GAME_MODE_IDS,
  getGameMode,
  planGame
} from '../src/game/data/gameModes';
import { SESSION_DURATIONS, estimateMinutes } from '../src/game/data/audiences';
import { AUDIENCE_IDS } from '../src/game/data/audiences';
import { PLAYABLE_CASES } from '../src/game/data/cases';
import type { OutcomeQuality, SessionMinutes } from '../src/game/data/types';
import { it as itDict } from '../src/game/i18n/it';
import { en } from '../src/game/i18n/en';

/**
 * MODALITÀ DI GIOCO.
 *
 * Una modalità che non cambia niente è una voce di menu, non una modalità:
 * questi test verificano che ognuna componga davvero una sessione diversa,
 * che la durata scelta si veda nel numero di fascicoli, e che il "ripasso"
 * dica di non avere niente da ripassare invece di aprire una sessione vuota.
 */

const NONE: Record<string, OutcomeQuality> = {};
const plan = (mode: (typeof GAME_MODE_IDS)[number], minutes: SessionMinutes, completed = NONE, seed = 7) =>
  planGame({ mode, audience: 'casual', minutes, completed, seed });

const playableIds = PLAYABLE_CASES.map((c) => c.id);

describe('ogni modalità compone una sessione giocabile', () => {
  for (const id of GAME_MODE_IDS) {
    it(`"${id}" propone solo fascicoli esistenti, senza ripetizioni`, () => {
      // il ripasso ha bisogno di qualcosa da ripassare per dire qualcosa
      const completed = id === 'ripasso' ? { [playableIds[0]]: 'wrong' as const, [playableIds[1]]: 'partial' as const } : NONE;
      const p = planGame({ mode: id, audience: 'casual', minutes: 60, completed, seed: 7 });
      expect(p.unavailable).toBeNull();
      expect(p.caseIds.length).toBeGreaterThan(0);
      expect(new Set(p.caseIds).size, 'un fascicolo proposto due volte nella stessa sessione').toBe(p.caseIds.length);
      for (const c of p.caseIds) expect(playableIds, `${c} non è un caso giocabile`).toContain(c);
    });
  }

  it('la stima dichiarata è quella dei casi proposti, non un numero a parte', () => {
    for (const id of GAME_MODE_IDS) {
      const completed = id === 'ripasso' ? { [playableIds[0]]: 'wrong' as const } : NONE;
      const p = planGame({ mode: id, audience: 'pa', minutes: 90, completed, seed: 3 });
      expect(p.estimatedMinutes).toBe(estimateMinutes(p.caseIds));
    }
  });

  it('il default è una modalità che esiste', () => {
    expect(GAME_MODE_IDS).toContain(DEFAULT_GAME_MODE);
    expect(GAME_MODES.length).toBeGreaterThan(1);
  });
});

describe('più tempo, più fascicoli — in ogni modalità', () => {
  for (const id of GAME_MODE_IDS) {
    if (id === 'ripasso') continue; // il ripasso è limitato dagli errori, non dal tempo
    it(`"${id}": ogni scatto di durata aggiunge almeno un fascicolo`, () => {
      const counts = SESSION_DURATIONS.map((m) => plan(id, m).caseIds.length);
      for (let i = 1; i < counts.length; i++) {
        if (counts[i - 1] >= playableIds.length) continue; // esaurita la città
        expect(counts[i], `${counts.join(', ')}`).toBeGreaterThan(counts[i - 1]);
      }
    });
  }
});

describe("l'ispezione a sorpresa estrae, e l'estrazione è ripetibile", () => {
  it('lo stesso seme dà la stessa ispezione: il riepilogo non può mentire', () => {
    expect(plan('sorpresa', 60, NONE, 12345).caseIds).toEqual(plan('sorpresa', 60, NONE, 12345).caseIds);
  });

  it('semi diversi danno ispezioni diverse, altrimenti non è un sorteggio', () => {
    const orders = new Set([11, 22, 33, 44, 55].map((s) => plan('sorpresa', 90, NONE, s).caseIds.join(',')));
    expect(orders.size, 'cinque semi, un solo esito: il mescolamento non mescola').toBeGreaterThan(1);
  });

  it('non guarda il profilo: è a sorpresa per tutti allo stesso modo', () => {
    const byAudience = AUDIENCE_IDS.map((a) => planGame({ mode: 'sorpresa', audience: a, minutes: 60, completed: NONE, seed: 9 }).caseIds.join(','));
    expect(new Set(byAudience).size).toBe(1);
  });

  it('non fa sconti sulla difficoltà, qualunque durata si scelga', () => {
    expect(getGameMode('sorpresa').forcedDifficulty).toBe('expert');
    for (const m of SESSION_DURATIONS) expect(plan('sorpresa', m).difficulty).toBe('expert');
  });
});

describe('il ripasso guarda soltanto i fascicoli chiusi male', () => {
  it('senza errori lo dichiara, invece di aprire una sessione vuota', () => {
    const p = plan('ripasso', 60, { [playableIds[0]]: 'correct' });
    expect(p.unavailable).toBe('nothingToReview');
    expect(p.caseIds).toEqual([]);
  });

  it('prende gli sbagliati e i parziali, e lascia fuori i corretti e gli intoccati', () => {
    const completed: Record<string, OutcomeQuality> = {
      [playableIds[0]]: 'wrong',
      [playableIds[1]]: 'correct',
      [playableIds[2]]: 'partial'
    };
    const p = plan('ripasso', 90, completed);
    expect(p.caseIds).toContain(playableIds[0]);
    expect(p.caseIds).toContain(playableIds[2]);
    expect(p.caseIds).not.toContain(playableIds[1]);
    expect(p.caseIds).not.toContain(playableIds[3]);
  });
});

describe("l'indagine libera apre la mappa e non nasconde nessun caso", () => {
  it('è l\'unica modalità che parte dalla mappa', () => {
    expect(plan('libera', 30).freeMap).toBe(true);
    for (const id of GAME_MODE_IDS.filter((x) => x !== 'libera')) {
      expect(plan(id, 30, { [playableIds[0]]: 'wrong' }).freeMap).toBe(false);
    }
  });

  it('con tutto il tempo disponibile raggiunge ogni caso giocabile', () => {
    // budget volutamente più grande di qualunque durata offerta: serve a
    // provare che l'ordinamento copre la città, non che 90 minuti bastino
    const p = planGame({ mode: 'libera', audience: 'hr', minutes: 100000 as SessionMinutes, completed: NONE, seed: 1 });
    expect(p.caseIds.slice().sort()).toEqual(playableIds.slice().sort());
  });
});

describe('ogni modalità ha un nome e una spiegazione, in entrambe le lingue', () => {
  for (const [lang, dict] of [['it', itDict], ['en', en]] as const) {
    it(`${lang}: nessuna modalità resta senza testo`, () => {
      for (const id of GAME_MODE_IDS) {
        const m = dict.ui.newGamePanel.modes[id];
        expect(m, `${lang}: manca la modalità ${id}`).toBeTruthy();
        expect(m.name.length, `${lang}/${id}: nome vuoto`).toBeGreaterThan(2);
        expect(m.desc.length, `${lang}/${id}: descrizione troppo corta per spiegare qualcosa`).toBeGreaterThan(30);
      }
    });
  }
});

/**
 * NESSUN VICOLO CIECO IN NUOVA PARTITA.
 *
 * Sfogliando le modalità per leggerle ci si fermava sull'ultima — il ripasso
 * degli errori — che a inizio partita non ha niente da proporre. La scelta
 * veniva salvata, e riaprendo il pannello si trovava un INIZIA spento: su
 * fondo scuro, un pulsante che non fa niente. Segnalato da chi giocava con
 * una parola sola, "bug", ed era esattamente questo.
 */
describe('il pannello non si apre mai su una modalità che non si può giocare', () => {
  const title = readFileSync(resolve(__dirname, '../src/game/scenes/TitleScene.ts'), 'utf8');

  it("all'apertura, una modalità senza niente da proporre lascia il posto a quella predefinita", () => {
    const open = title.slice(title.indexOf('private openNewGame'), title.indexOf('private startPlanned'));
    expect(open).toContain('StateManager.gamePlan.unavailable');
    expect(open).toContain('setGameMode(DEFAULT_GAME_MODE)');
  });

  it('e la modalità predefinita è sempre giocabile a partita nuova', () => {
    const fresh = planGame({ mode: DEFAULT_GAME_MODE, audience: 'casual', minutes: 30, completed: {}, seed: 1 });
    expect(fresh.unavailable, 'il ripiego deve essere un posto da cui si può partire').toBeNull();
    expect(fresh.caseIds.length).toBeGreaterThan(0);
  });

  it('il ripiego vale per ogni profilo e ogni durata, non solo per il caso comodo', () => {
    for (const audience of AUDIENCE_IDS) {
      for (const minutes of SESSION_DURATIONS) {
        const p = planGame({ mode: DEFAULT_GAME_MODE, audience, minutes, completed: {}, seed: 1 });
        expect(p.unavailable, `${audience}/${minutes}`).toBeNull();
      }
    }
  });

  /**
   * Restare sul ripasso girando la manopola resta possibile: lì la scelta è
   * deliberata. L'avviso però deve dire anche che cosa fare, non solo che
   * non si può partire.
   */
  it("l'avviso indica la via d'uscita, in entrambe le lingue", () => {
    for (const [lang, dict] of [['it', itDict], ['en', en]] as const) {
      const msg = dict.ui.newGamePanel.nothingToReview;
      expect(msg.length, `${lang}`).toBeGreaterThan(40);
      expect(msg.toLowerCase(), `${lang}: l'avviso non dice come uscirne`).toMatch(/modalità|mode/);
    }
  });
});

describe('una nuova partita conserva il percorso appena scelto', () => {
  const stateManager = readFileSync(resolve(__dirname, '../src/game/systems/StateManager.ts'), 'utf8');
  const newGame = stateManager.slice(stateManager.indexOf('newGame(): void'), stateManager.indexOf('applyDomPreferences'));

  it('non riporta la modalità al default durante il reset della partita precedente', () => {
    expect(newGame).toContain('gameMode: this.data.gameMode');
  });

  it('conserva anche la velocità di lettura, che è una preferenza di accessibilità', () => {
    expect(newGame).toContain('textSpeed: this.data.textSpeed');
  });
});
