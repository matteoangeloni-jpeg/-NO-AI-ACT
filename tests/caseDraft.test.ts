import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  DRAFT_SCHEMA,
  DRAFT_STEPS,
  emptyDraft,
  hasProgress,
  isResumable,
  isWellFormed,
  sanitizeDrafts,
  draftProgress,
  type CaseDraft
} from '../src/game/systems/caseDraft';

/**
 * U01 / U07 — BOZZA DI UN FASCICOLO.
 *
 * Finché un rapporto non è firmato, il lavoro su un fascicolo viveva solo
 * nella memoria della scena: chiudere la scheda o ricaricare lo cancellava
 * senza avvisare. Ora è un dato, e il rischio si sposta: una bozza che
 * sopravvive a ciò che non dovrebbe sopravvivere.
 *
 * Le tre cose che qui non possono succedere: una bozza che riapre un caso
 * già firmato, una bozza di uno schema diverso interpretata a caso, e una
 * bozza rotta che impedisce di aprire il fascicolo.
 */

const draft = (over: Partial<CaseDraft> = {}): CaseDraft => ({ ...emptyDraft('case_scoring', 1000), ...over });

describe('una bozza non tocca mai un rapporto firmato', () => {
  it('un caso già completato non è riprendibile, anche se la bozza è perfetta', () => {
    expect(isResumable(draft(), [])).toBe(true);
    expect(isResumable(draft(), ['case_scoring'])).toBe(false);
  });

  it('fra bozza e rapporto firmato vince il rapporto', () => {
    const raw = { case_scoring: draft({ classification: 'vietata' }) };
    expect(sanitizeDrafts(raw, [])).toHaveProperty('case_scoring');
    expect(sanitizeDrafts(raw, ['case_scoring'])).toEqual({});
  });

  it('le altre bozze sopravvivono alla chiusura di un caso', () => {
    const raw = {
      case_scoring: draft(),
      case_lavoro: draft({ caseId: 'case_lavoro' })
    };
    expect(Object.keys(sanitizeDrafts(raw, ['case_scoring']))).toEqual(['case_lavoro']);
  });
});

describe('uno schema diverso viene scartato, non interpretato', () => {
  it('una bozza di un altro schema non è ben formata', () => {
    expect(isWellFormed(draft())).toBe(true);
    expect(isWellFormed({ ...draft(), schema: DRAFT_SCHEMA + 1 })).toBe(false);
    expect(isWellFormed({ ...draft(), schema: DRAFT_SCHEMA - 1 })).toBe(false);
  });

  it('scartarne una non si porta via le altre', () => {
    const raw = {
      vecchia: { ...draft({ caseId: 'vecchia' }), schema: 99 },
      case_lavoro: draft({ caseId: 'case_lavoro' })
    };
    expect(Object.keys(sanitizeDrafts(raw, []))).toEqual(['case_lavoro']);
  });
});

describe('una bozza rotta vale come assente', () => {
  it('niente di ciò che non è una bozza passa il controllo', () => {
    for (const bad of [null, undefined, 42, 'bozza', [], {}, { schema: DRAFT_SCHEMA }]) {
      expect(isWellFormed(bad), JSON.stringify(bad)).toBe(false);
    }
  });

  it('una fase inventata non viene accettata', () => {
    expect(isWellFormed({ ...draft(), step: 'firma' })).toBe(false);
    for (const step of DRAFT_STEPS) expect(isWellFormed({ ...draft(), step })).toBe(true);
  });

  it('indici di reperti non interi o negativi invalidano la bozza', () => {
    expect(isWellFormed({ ...draft(), citedClues: [0, 1.5] })).toBe(false);
    expect(isWellFormed({ ...draft(), citedClues: [-1] })).toBe(false);
    expect(isWellFormed({ ...draft(), revealedClues: ['1'] })).toBe(false);
    expect(isWellFormed({ ...draft(), revealedClues: [0, 5] })).toBe(true);
  });

  it('una bozza archiviata sotto la chiave di un altro caso viene scartata', () => {
    // aprirebbe il fascicolo sbagliato con le scelte di un altro
    expect(sanitizeDrafts({ case_lavoro: draft({ caseId: 'case_scoring' }) }, [])).toEqual({});
  });

  it('un contenitore non leggibile non fa fallire il caricamento', () => {
    for (const bad of [null, undefined, 'niente', 7]) expect(sanitizeDrafts(bad, [])).toEqual({});
  });
});

describe('vale la pena riprendere solo ciò che contiene qualcosa', () => {
  it('un fascicolo appena aperto non è una bozza da proporre', () => {
    expect(hasProgress(emptyDraft('case_scoring', 1))).toBe(false);
  });

  it('basta un reperto aperto, o una scelta presa', () => {
    expect(hasProgress(draft({ revealedClues: [0] }))).toBe(true);
    expect(hasProgress(draft({ citedClues: [1] }))).toBe(true);
    expect(hasProgress(draft({ classification: 'alto_rischio' }))).toBe(true);
    expect(hasProgress(draft({ motivation: 0 }))).toBe(true);
  });

  it('il progresso conta le quattro decisioni, non i reperti', () => {
    expect(draftProgress(emptyDraft('x', 1))).toEqual({ taken: 0, total: 4 });
    expect(draftProgress(draft({ classification: 'vietata', measure: 'blocco' }))).toEqual({ taken: 2, total: 4 });
    expect(draftProgress(draft({ revealedClues: [0, 1, 2] })).taken).toBe(0);
  });
});

/**
 * Il collegamento fra il modello e il gioco. Le scene e StateManager
 * importano Phaser e non si istanziano sotto vitest, quindi qui si legge il
 * sorgente — ma solo sui punti in cui l'invariante può rompersi davvero.
 */
describe('il gioco scrive e cancella la bozza nei punti giusti', () => {
  const read = (p: string): string =>
    readFileSync(resolve(__dirname, '..', p), 'utf8');

  it('firmare cancella la bozza, e lo fa StateManager non la scena', () => {
    const sm = read('src/game/systems/StateManager.ts');
    const resolveCase = sm.slice(sm.indexOf('resolveCase('), sm.indexOf('caseQuality('));
    expect(resolveCase, 'la cancellazione deve stare nel punto unico che chiude un caso').toContain(
      'delete this.data.caseDrafts[caseId]'
    );
  });

  it('non si scrive una bozza per un caso già chiuso', () => {
    const sm = read('src/game/systems/StateManager.ts');
    const saveDraft = sm.slice(sm.indexOf('saveDraft('), sm.indexOf('clearDraft('));
    expect(saveDraft).toContain('if (caseId in this.data.completedCases) return;');
  });

  it('i reperti aperti e citati si salvano dal punto unico che li cambia', () => {
    const ev = read('src/game/scenes/EvidenceScene.ts');
    const refresh = ev.slice(ev.indexOf('private refreshState()'));
    expect(refresh).toContain('StateManager.saveDraft(');
    expect(refresh).toContain('revealedClues');
    expect(refresh).toContain('citedClues');
  });

  it('ogni scelta della decisione e il ritorno indietro aggiornano la bozza', () => {
    const ds = read('src/game/scenes/DecisionScene.ts');
    // quattro scelte + la fiducia + il ritorno indietro
    expect((ds.match(/this\.persistDraft\(/g) ?? []).length).toBeGreaterThanOrEqual(6);
    const stepBack = ds.slice(ds.indexOf('private stepBack('), ds.indexOf('private addBackButton('));
    expect(stepBack, 'chi corregge e chiude deve ritrovare la correzione').toContain('this.persistDraft(');
  });

  it('la decisione riparte dal primo passo senza risposta, non sempre dal primo', () => {
    const ds = read('src/game/scenes/DecisionScene.ts');
    const resume = ds.slice(ds.indexOf('private resumeStep()'), ds.indexOf('create(): void'));
    for (const f of ['classification', 'measure', 'subject', 'motivation']) {
      expect(resume, `resumeStep non guarda ${f}`).toContain(`this.${f} === null`);
    }
    expect(ds).toContain('builders[this.resumeStep()]()');
  });

  it('ripristinare una carta non suona e non annuncia un cambiamento', () => {
    const card = read('src/game/ui/DossierCard.ts');
    const restore = card.slice(card.indexOf('restore(revealed'), card.indexOf('private refreshBorder()'));
    expect(restore, 'sei conferme in fila all’apertura suonerebbero come un allarme').not.toContain('AudioSystem');
    expect(restore, 'la scena richiama refreshState() una volta sola').not.toContain('this.onChange()');
  });
});
