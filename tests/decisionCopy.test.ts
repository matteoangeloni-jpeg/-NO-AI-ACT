import { describe, expect, it as test } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { it } from '../src/game/i18n/it';
import { en } from '../src/game/i18n/en';

const root = resolve(__dirname, '..');
const read = (p: string) => readFileSync(resolve(root, p), 'utf8');
const itHtml = read('index.html');
const enHtml = read('en/index.html');

describe('PR 1C — decision-step microcopy (IT/EN)', () => {
  test('cite-note clarifies that citing is not the final classification', () => {
    expect(it.ui.evidence.citeNote).toBe(
      'Citare un reperto lo aggiunge al rapporto, ma non determina ancora la classificazione finale del rischio.'
    );
    expect(en.ui.evidence.citeNote).toBe(
      'Citing an item adds it to the report, but it does not yet determine the final risk classification.'
    );
  });

  test('decision process-note frames the decision as distinct from the report', () => {
    expect(it.ui.decision.processNote).toBe(
      'Decisione finale: classifica il rischio, poi scegli misura, soggetto responsabile e motivazione.'
    );
    expect(en.ui.decision.processNote).toBe(
      'Final decision: classify the risk, then choose measure, responsible subject and rationale.'
    );
  });

  test('the microcopy is wired into the scenes', () => {
    expect(read('src/game/scenes/EvidenceScene.ts')).toContain('ui.evidence.citeNote');
    expect(read('src/game/scenes/DecisionScene.ts')).toContain('ui.decision.processNote');
  });

  test('the new strings carry no external URLs', () => {
    for (const s of [it.ui.evidence.citeNote, en.ui.evidence.citeNote, it.ui.decision.processNote, en.ui.decision.processNote]) {
      expect(s).not.toMatch(/https?:\/\//);
    }
  });
});

describe('PR 1C — NO AI ACT name clarification on the landings', () => {
  test('IT landing disambiguates the name in the hero', () => {
    expect(itHtml).toContain('NO AI ACT non è una campagna contro l\'AI Act');
    expect(itHtml).toContain('simulazione didattica di una società non regolata');
  });

  test('EN landing disambiguates the name in the hero', () => {
    expect(enHtml).toContain('NO AI ACT is not a campaign against the AI Act');
    expect(enHtml).toContain('educational simulation of an unregulated society');
  });

  test('the clarification reuses the existing .callout style (no new CSS class)', () => {
    expect(itHtml).toContain('<p class="callout">NO AI ACT non è una campagna');
    expect(enHtml).toContain('<p class="callout">NO AI ACT is not a campaign');
  });
});

describe('PR 1C — no external forms on the landings (Tally removed)', () => {
  test('landings ship no Tally embed or link', () => {
    for (const html of [itHtml, enHtml]) {
      expect(html).not.toContain('tally.so');
      expect(html).not.toMatch(/data-tally/i);
    }
  });
});

describe('PR 1C — no new tracking / analytics on the landings', () => {
  for (const [name, html] of [['IT', itHtml], ['EN', enHtml]] as const) {
    test(`${name} landing has no advertising / GA / Meta trackers`, () => {
      expect(html).not.toMatch(/googletagmanager|google-analytics|gtag\(|connect\.facebook|fbevents|doubleclick/i);
    });
  }
});
