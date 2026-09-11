import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { evidenceReadingLine } from '../src/game/systems/evidenceReading';
import { it as itDict } from '../src/game/i18n/it';
import { en } from '../src/game/i18n/en';

/**
 * U06 — LETTURA ACCESSIBILE COMPLETA.
 *
 * Il difetto: nello strato di lettura, citare un reperto ne sostituiva il
 * testo con la parola "CITATO". Chi gioca con uno screen reader perdeva il
 * documento nell'istante in cui decideva di usarlo, cioè quando gli serve
 * per motivare il rapporto — mentre chi vede la scena può sempre riaprire
 * la carta. Non era una comodità mancante: era una disparità informativa
 * introdotta proprio da un'azione corretta del giocatore.
 */

const clue = { title: 'Verbale interno', text: 'Non disponiamo della documentazione tecnica.' };
const labels = { sealed: '[ SIGILLATO ]', cited: 'citato nel rapporto' };

describe('lo strato di lettura non perde il testo di un reperto citato', () => {
  it('un reperto aperto e citato conserva il proprio testo', () => {
    const line = evidenceReadingLine(clue, { revealed: true, cited: true }, labels);
    expect(line, 'citare non deve nascondere il contenuto').toContain(clue.text);
  });

  it('la citazione compare come stato aggiuntivo, non sostitutivo', () => {
    const line = evidenceReadingLine(clue, { revealed: true, cited: true }, labels);
    expect(line).toContain(labels.cited);
    expect(line.indexOf(clue.text)).toBeLessThan(line.indexOf(labels.cited));
  });

  it('un reperto aperto e non citato legge titolo e testo, senza qualificatori', () => {
    const line = evidenceReadingLine(clue, { revealed: true, cited: false }, labels);
    expect(line).toBe(`${clue.title} — ${clue.text}`);
  });

  it('un reperto non ancora aperto resta sigillato, e il testo non trapela', () => {
    for (const state of [undefined, { revealed: false, cited: false }]) {
      const line = evidenceReadingLine(clue, state, labels);
      expect(line).toBe(`${clue.title} — ${labels.sealed}`);
      expect(line, 'un reperto sigillato non deve anticipare il proprio contenuto').not.toContain(clue.text);
    }
  });

  it('il titolo del reperto è sempre annunciato, in ogni stato', () => {
    const states = [undefined, { revealed: false, cited: false }, { revealed: true, cited: false }, { revealed: true, cited: true }];
    for (const s of states) expect(evidenceReadingLine(clue, s, labels)).toContain(clue.title);
  });
});

describe("l'etichetta di citazione per la lettura esiste in entrambe le lingue", () => {
  it('a11y.evidenceCited è dichiarata e non è il glifo della carta', () => {
    for (const [lang, dict] of [['it', itDict], ['en', en]] as const) {
      const label = dict.a11y.evidenceCited;
      expect(label, `${lang}: manca a11y.evidenceCited`).toBeTruthy();
      expect(label, `${lang}: un glifo decorativo non si annuncia`).not.toMatch(/[▣▢■□]/);
    }
  });

  it('EvidenceScene delega alla funzione pura invece di ricostruire la riga', () => {
    const scene = readFileSync(resolve(__dirname, '../src/game/scenes/EvidenceScene.ts'), 'utf8');
    expect(scene).toContain('evidenceReadingLine');
    expect(scene, 'il vecchio ternario sostituiva il testo con lo stato').not.toMatch(
      /isCited \?\s*L\(\)\.ui\.evidence\.cited/
    );
  });
});
