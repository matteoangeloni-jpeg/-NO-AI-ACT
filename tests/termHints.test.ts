import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { CLASSIFICATION_TERMS, SUBJECT_TERMS, referencedGlossaryIds } from '../src/game/data/termHints';
import { GLOSSARY } from '../src/game/data/glossary';
import { it as itDict } from '../src/game/i18n/it';
import { en } from '../src/game/i18n/en';

/**
 * U05 — AIUTO CONTESTUALE SUI TERMINI.
 *
 * Al momento di scegliere il giocatore vede solo etichette: "Pratica
 * vietata", "Deployer". Le definizioni esistevano già nel glossario, ma in
 * una schermata a parte raggiungibile solo dalla mappa: per leggerle
 * bisognava lasciare il fascicolo.
 *
 * Il rischio di un aiuto del genere non è che manchi: è che diventi un
 * suggerimento della risposta, o che inventi definizioni per categorie che
 * non esistono nel regolamento. Questi controlli difendono quel confine.
 */

const glossaryIds = new Set(GLOSSARY.map((g) => g.id));

describe('ogni termine collegato esiste davvero, in entrambe le lingue', () => {
  it('gli id riferiti sono voci del glossario', () => {
    for (const id of referencedGlossaryIds()) {
      expect(glossaryIds.has(id), `"${id}" non è una voce del glossario`).toBe(true);
    }
  });

  it('ogni voce riferita ha termine e definizione in IT e in EN', () => {
    for (const [lang, dict] of [['it', itDict], ['en', en]] as const) {
      const entries = dict.glossary.entries as Record<string, { term: string; definition: string }>;
      for (const id of referencedGlossaryIds()) {
        expect(entries[id], `${lang}: manca la voce ${id}`).toBeTruthy();
        expect(entries[id].definition.trim().length, `${lang}/${id}: definizione vuota`).toBeGreaterThan(20);
      }
    }
  });

  it('ogni opzione di classificazione e di soggetto è mappata, anche a null', () => {
    for (const k of ['vietata', 'alto_rischio', 'trasparenza', 'basso_rischio', 'non_rilevante'] as const) {
      expect(k in CLASSIFICATION_TERMS, `classificazione ${k} non mappata`).toBe(true);
    }
    for (const k of ['provider', 'deployer', 'autorita', 'responsabile_umano', 'fornitore_esterno'] as const) {
      expect(k in SUBJECT_TERMS, `soggetto ${k} non mappato`).toBe(true);
    }
  });
});

describe("l'aiuto non suggerisce la risposta e non inventa categorie", () => {
  it('"autorità" non viene presentata come sinonimo di "deployer"', () => {
    // il gioco chiede proprio di distinguerli: equipararli qui sarebbe
    // suggerire la risposta invece di spiegare il termine
    expect(SUBJECT_TERMS.autorita).toBeNull();
  });

  it('"basso rischio" e "non rilevante" non hanno una definizione inventata', () => {
    // non sono istituti del regolamento, ma il residuo delle altre categorie
    expect(CLASSIFICATION_TERMS.basso_rischio).toBeNull();
    expect(CLASSIFICATION_TERMS.non_rilevante).toBeNull();
  });

  it('esiste un testo per le opzioni senza voce, in entrambe le lingue', () => {
    for (const [lang, dict] of [['it', itDict], ['en', en]] as const) {
      expect(dict.ui.decision.termsNoEntry, `${lang}: manca termsNoEntry`).toBeTruthy();
    }
  });

  it("l'avviso dichiara che è sola consultazione, in entrambe le lingue", () => {
    for (const [lang, dict] of [['it', itDict], ['en', en]] as const) {
      expect(dict.ui.decision.termsHint, `${lang}`).toBeTruthy();
      expect(dict.ui.decision.termsButton, `${lang}`).toBeTruthy();
      expect(dict.ui.decision.termsTitle, `${lang}`).toBeTruthy();
    }
  });
});

describe("consultare i termini non costa il filo del ragionamento", () => {
  const src = readFileSync(resolve(__dirname, '../src/game/scenes/DecisionScene.ts'), 'utf8');

  it("è un overlay dentro la scena, non un'altra schermata", () => {
    const fn = src.slice(src.indexOf('private toggleTermsOverlay'), src.indexOf('private addTermsButton'));
    expect(fn, 'una scene.start perderebbe il passo in corso').not.toContain('this.scene.start');
    expect(fn).toContain('this.overlay = container;');
  });

  it('usa lo stesso slot degli altri overlay, così ne resta aperto uno solo', () => {
    const fn = src.slice(src.indexOf('private toggleTermsOverlay'), src.indexOf('private addTermsButton'));
    expect(fn).toContain('if (this.overlay)');
    expect(fn).toContain('this.closeNormsOverlay()');
  });

  it('chiudere un overlay riporta lo strato di lettura al passo corrente', () => {
    const close = src.slice(src.indexOf('private closeNormsOverlay'), src.indexOf('// ------------------------------------------------------------ esito'));
    expect(close, 'senza, chi legge resterebbe sui termini mentre a schermo è tornata la domanda').toContain(
      'this.syncStepReading()'
    );
  });

  it('il bottone sparisce quando un overlay è aperto, come gli altri', () => {
    const update = src.slice(src.indexOf('update(): void'), src.indexOf('bindNumberKeys'));
    expect(update).toContain('this.termsBtn?.setVisible(!hideNav)');
  });

  it("l'aiuto è offerto dove si sceglie un termine, non dove si sceglie un'azione", () => {
    const step1 = src.slice(src.indexOf('private showClassificationStep'), src.indexOf('private showMeasureStep'));
    const step2 = src.slice(src.indexOf('private showMeasureStep'), src.indexOf('private showSubjectStep'));
    const step3 = src.slice(src.indexOf('private showSubjectStep'), src.indexOf('private showMotivationStep'));
    expect(step1, 'le classificazioni sono termini del regolamento').toContain('addTermsButton(');
    expect(step3, 'i soggetti responsabili sono termini del regolamento').toContain('addTermsButton(');
    expect(step2, 'le misure sono azioni dell’ispettorato, non definizioni').not.toContain('addTermsButton(');
  });
});
