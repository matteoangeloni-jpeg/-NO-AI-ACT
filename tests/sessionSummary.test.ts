import { describe, expect, it } from 'vitest';
import { RECURRENCE_THRESHOLD, buildSessionSummary, sessionIsOver } from '../src/game/systems/SessionSummary';
import { planGame } from '../src/game/data/gameModes';
import { PLAYABLE_CASES, getCase } from '../src/game/data/cases';
import type { CaseReport, OutcomeQuality } from '../src/game/data/types';
import { it as itDict } from '../src/game/i18n/it';
import { en } from '../src/game/i18n/en';

const plan = (mode: 'turno' | 'libera' = 'turno', minutes: 15 | 30 | 60 | 90 = 60) =>
  planGame({ mode, audience: 'casual', minutes, completed: {}, seed: 5 });

const report = (dominantError: CaseReport['dominantError']): CaseReport => ({
  outcome: 'parziale',
  dominantError,
  classification: 'alto_rischio',
  measure: 'audit',
  subject: 'deployer',
  motivationIndex: 0,
  citedClues: []
});

describe('il cruscotto conta quello che il gioco ha già deciso', () => {
  it('ogni fascicolo del piano compare, anche quello rimasto aperto', () => {
    const p = plan();
    const completed: Record<string, OutcomeQuality> = { [p.caseIds[0]]: 'correct' };
    const s = buildSessionSummary(p, completed, {});
    expect(s.lines.map((l) => l.caseId)).toEqual(p.caseIds);
    expect(s.closed).toBe(1);
    expect(s.lines[1].quality, 'un fascicolo non chiuso non ha esito').toBeNull();
  });

  it('i conteggi sommano esattamente i fascicoli chiusi', () => {
    const p = plan();
    const completed: Record<string, OutcomeQuality> = {
      [p.caseIds[0]]: 'correct',
      [p.caseIds[1]]: 'wrong',
      [p.caseIds[2]]: 'partial'
    };
    const s = buildSessionSummary(p, completed, {});
    expect(s.counts).toEqual({ correct: 1, partial: 1, wrong: 1 });
    expect(s.counts.correct + s.counts.partial + s.counts.wrong).toBe(s.closed);
  });

  it("gli articoli elencati sono quelli dei fascicoli chiusi, senza doppioni", () => {
    const p = plan();
    const completed: Record<string, OutcomeQuality> = { [p.caseIds[0]]: 'correct', [p.caseIds[1]]: 'wrong' };
    const s = buildSessionSummary(p, completed, {});
    expect(s.normIds).toEqual([...new Set([getCase(p.caseIds[0]).normId, getCase(p.caseIds[1]).normId])]);
    expect(s.normIds, 'un fascicolo aperto non ha ancora insegnato il suo articolo')
      .not.toContain(getCase(p.caseIds[2]).normId);
  });
});

describe('una tendenza si dichiara solo quando è una tendenza', () => {
  it('un errore capitato una volta sola non diventa un giudizio', () => {
    const p = plan();
    const s = buildSessionSummary(p, { [p.caseIds[0]]: 'wrong' }, { [p.caseIds[0]]: report('classificazione') });
    expect(RECURRENCE_THRESHOLD).toBeGreaterThan(1);
    expect(s.recurringError, 'da un caso solo non si ricava una tendenza').toBeNull();
  });

  it('lo stesso errore due volte sì, e dice quante', () => {
    const p = plan();
    const completed: Record<string, OutcomeQuality> = { [p.caseIds[0]]: 'wrong', [p.caseIds[1]]: 'partial' };
    const reports = { [p.caseIds[0]]: report('prove'), [p.caseIds[1]]: report('prove') };
    const s = buildSessionSummary(p, completed, reports);
    expect(s.recurringError).toEqual({ type: 'prove', times: 2 });
  });

  it('a parità di frequenza non ne inventa una sola: vince chi si ripete di più', () => {
    const p = plan('turno', 90);
    const completed: Record<string, OutcomeQuality> = {};
    const reports: Record<string, CaseReport> = {};
    // due volte 'prove', tre volte 'soggetto'
    const kinds = ['prove', 'prove', 'soggetto', 'soggetto', 'soggetto'] as const;
    p.caseIds.slice(0, kinds.length).forEach((id, i) => {
      completed[id] = 'wrong';
      reports[id] = report(kinds[i]);
    });
    const s = buildSessionSummary(p, completed, reports);
    expect(s.recurringError).toEqual({ type: 'soggetto', times: 3 });
  });

  it("un fascicolo aperto non porta con sé l'errore di una partita precedente", () => {
    const p = plan();
    // rapporto presente ma caso non chiuso: non deve contare
    const s = buildSessionSummary(p, {}, { [p.caseIds[0]]: report('prove'), [p.caseIds[1]]: report('prove') });
    expect(s.recurringError).toBeNull();
    expect(s.closed).toBe(0);
  });
});

describe('quando un turno è finito', () => {
  it('quando ogni fascicolo del piano è chiuso', () => {
    const p = plan();
    const completed = Object.fromEntries(p.caseIds.map((id) => [id, 'correct' as OutcomeQuality]));
    expect(sessionIsOver(p, completed)).toBe(true);
    expect(buildSessionSummary(p, completed, {}).complete).toBe(true);
  });

  it("mai durante l'indagine libera: la città non finisce", () => {
    const p = plan('libera');
    const completed = Object.fromEntries(PLAYABLE_CASES.map((c) => [c.id, 'correct' as OutcomeQuality]));
    expect(p.freeMap).toBe(true);
    expect(sessionIsOver(p, completed), 'un cruscotto a sorpresa direbbe che hai finito ciò che non avevi cominciato').toBe(false);
  });

  it('non con un fascicolo ancora aperto', () => {
    const p = plan();
    const completed = Object.fromEntries(p.caseIds.slice(1).map((id) => [id, 'correct' as OutcomeQuality]));
    expect(sessionIsOver(p, completed)).toBe(false);
  });
});

describe('il cruscotto ha i suoi testi in entrambe le lingue', () => {
  for (const [lang, dict] of [['it', itDict], ['en', en]] as const) {
    it(`${lang}: titolo, righe di esito, tendenza e forme singolari`, () => {
      const s = dict.ui.sessionEnd;
      expect(s, `${lang}: manca ui.sessionEnd`).toBeTruthy();
      for (const k of [
        'title', 'subtitle', 'subtitleOne', 'recurring', 'noRecurring', 'normsTouched',
        'incomplete', 'incompleteOne', 'open', 'toMap', 'learningReport', 'debrief', 'note'
      ] as const) {
        expect(String(s[k] ?? '').length, `${lang}: ${k} vuoto`).toBeGreaterThan(2);
      }
      // ripiego per i salvataggi chiusi prima che i rapporti venissero archiviati
      for (const q of ['correct', 'partial', 'wrong'] as const) {
        expect(String(s.quality[q] ?? '').length, `${lang}: quality.${q} vuoto`).toBeGreaterThan(2);
      }
      expect(s.recurring, `${lang}: la frase deve dire quante volte`).toContain('{times}');
      expect(s.recurring, `${lang}: e quale errore`).toContain('{error}');
    });

    /**
     * "1 chiusi bene" è lo stesso difetto di "1 fascicoli", in tre punti
     * invece che in uno: ogni conteggio del cruscotto ha una voce singolare
     * e una plurale, e la singolare non interpola un numero.
     */
    it(`${lang}: ogni conteggio ha la sua forma singolare, senza numero dentro`, () => {
      const s = dict.ui.sessionEnd;
      for (const [oneKey, manyKey] of [
        ['countCorrectOne', 'countCorrect'],
        ['countPartialOne', 'countPartial'],
        ['countWrongOne', 'countWrong']
      ] as const) {
        expect(String(s[oneKey] ?? '').length, `${lang}: manca ${oneKey}`).toBeGreaterThan(2);
        expect(s[oneKey], `${lang}: ${oneKey} non deve interpolare un conteggio`).not.toContain('{n}');
        expect(s[manyKey], `${lang}: ${manyKey} perde il conteggio`).toContain('{n}');
      }
      expect(s.subtitleOne, `${lang}: anche il sottotitolo ha il suo singolare`).not.toContain('{count}');
      expect(s.subtitle).toContain('{count}');
      expect(s.incompleteOne).not.toContain('{count}');
      expect(s.incomplete).toContain('{count}');
    });

    /**
     * Le frasi di ui.errors sono periodi compiuti e finiscono già col punto:
     * la riga della tendenza non deve aggiungerne un secondo. Sullo schermo
     * si leggeva "l'atto è impugnabile..".
     */
    it(`${lang}: la riga della tendenza non raddoppia il punto finale`, () => {
      const s = dict.ui.sessionEnd;
      const errors = Object.values(dict.ui.errors as Record<string, string>);
      expect(errors.length).toBeGreaterThan(3);
      for (const e of errors) expect(e.trimEnd(), `${lang}: "${e}" dovrebbe chiudere con un punto`).toMatch(/[.!?]$/);
      expect(s.recurring.trimEnd(), `${lang}: il segnaposto dell'errore porta già la sua chiusura`).toMatch(/\{error\}$/);
    });
  }
});
