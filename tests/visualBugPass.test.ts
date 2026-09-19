import { describe, expect, it as test } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { NORMS } from '../src/game/data/norms';
import { it as itLocale } from '../src/game/i18n/it';
import { en as enLocale } from '../src/game/i18n/en';

const root = resolve(__dirname, '..');
const read = (p: string) => readFileSync(resolve(root, p), 'utf8');

function stripComments(src: string): string {
  return src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
}

describe('visual bug pass — ArchiveScene grid overflow (BLOCKER fix)', () => {
  const src = read('src/game/scenes/ArchiveScene.ts');

  test('all norms are placed inside a scrollable/masked container, not directly on the scene', () => {
    expect(src).toContain('gridContainer');
    expect(src).toContain('setMask');
    expect(src).toContain('createGeometryMask');
  });

  test('scroll is clamped between 0 and the actual overflow amount', () => {
    expect(src).toContain('maxScroll');
    expect(src).toMatch(/Phaser\.Math\.Clamp\(.*0.*maxScroll\)/);
  });

  test('NORMS has more entries than fit in two rows of 3, which is exactly why this bug existed', () => {
    // guards against silently "fixing" this by trimming NORMS instead of the layout
    expect(NORMS.length).toBeGreaterThan(6);
  });

  test('scroll controls only appear when content actually overflows', () => {
    expect(src).toContain('if (this.maxScroll > 0)');
  });
});

describe('visual bug pass — background buttons hidden while a read-only overlay is open', () => {
  for (const [scene, path] of [
    ['EvidenceScene', 'src/game/scenes/EvidenceScene.ts'],
    ['DecisionScene', 'src/game/scenes/DecisionScene.ts']
  ] as const) {
    const src = read(path);

    test(`${scene} defines an update() loop that syncs nav button visibility to overlay state`, () => {
      expect(src).toMatch(/update\(\)\s*:\s*void\s*\{/);
      expect(src).toContain('.isOpen');
      expect(src).toMatch(/setVisible\(!hideNav\)/);
    });
  }

  test('DecisionScene hides all three overlay-adjacent buttons plus the step-1 back button', () => {
    const src = read('src/game/scenes/DecisionScene.ts');
    expect(src).toContain('this.contextOverlay.isOpen || this.caseNormOverlay.isOpen || !!this.overlay');
    for (const btn of ['contextBtn', 'normsBtn', 'caseNormBtn', 'backBtn']) {
      expect(src, `must sync ${btn} visibility`).toMatch(new RegExp(`${btn}\\?\\.setVisible`));
    }
  });
});

/**
 * LA BARRA DELLA PRATICA E LA SCENA NON DICONO LA STESSA COSA.
 *
 * La postazione è arrivata dopo le scene e dichiara il fascicolo in alto a
 * sinistra. Le scene, però, continuavano a scriverlo anche per conto
 * proprio venti pixel più sotto: «FASCICOLO AX-102/2032» due volte, una
 * sull'altra, sui reperti e sulla decisione. Nessuno l'ha tolto perché
 * ognuna delle due righe, presa da sola, è giusta.
 *
 * Il codice del fascicolo resta nello strato di lettura come titolo della
 * scena: lì non occupa spazio e serve a chi non vede la barra.
 */
describe('il codice del fascicolo si scrive una volta sola', () => {
  const scene = (f: string): string => stripComments(read(`src/game/scenes/${f}`));
  const conPostazione = readdirSync(resolve(root, 'src/game/scenes'))
    .filter((f) => f.endsWith('.ts'))
    .filter((f) => /new InspectorDesk\(/.test(read(`src/game/scenes/${f}`)));

  test('le scene con la postazione si leggono dal disco', () => {
    expect(conPostazione.length, 'nessuna scena con postazione: il controllo sarebbe inerte').toBeGreaterThan(1);
  });

  /**
   * LA REGOLA È SULLA FASCIA, NON SULLA STRINGA.
   *
   * Il primo tentativo vietava il codice del fascicolo in QUALUNQUE testo
   * della scena, e ha dichiarato colpevole l'intestazione dell'atto in
   * bozza nel riepilogo — «CODICE PRATICA: AX-102/2032», che è un metadato
   * dell'atto, sta a destra, e ci deve stare.
   *
   * Il difetto vero è un altro: ripetere quello che la barra dice, subito
   * SOTTO la barra. La postazione finisce a y=51; la fascia da difendere
   * arriva a 160, dove cominciano i contenuti veri della scena.
   */
  const FASCIA_INTESTAZIONE = 160;

  test('nessuna scena ripete il codice nella fascia subito sotto la barra', () => {
    const colpevoli: string[] = [];
    for (const f of conPostazione) {
      const src = scene(f);
      // la barra lo riceve come opzione, e lo strato di lettura come titolo:
      // quelli sono i due posti legittimi. Qui si cercano i DISEGNI.
      for (const [, args] of src.matchAll(/\.add\s*\n?\s*\.text\(([\s\S]*?)\);/g)) {
        if (!/fileCode/.test(args)) continue;
        const y = /^\s*[\w.]+\s*,\s*(\d+(?:\.\d+)?)\s*,/.exec(args);
        if (!y) continue; // posizione calcolata: non è un'intestazione fissa
        if (Number(y[1]) < FASCIA_INTESTAZIONE) {
          colpevoli.push(`${f}: y=${y[1]} — ${args.replace(/\s+/g, ' ').slice(0, 70)}`);
        }
      }
    }
    expect(
      colpevoli,
      `il fascicolo è scritto due volte, una sotto l'altra:\n${colpevoli.join('\n')}`
    ).toEqual([]);
  });

  test('ma la barra lo dice davvero, e lo strato di lettura anche', () => {
    for (const f of conPostazione) {
      const src = scene(f);
      expect(src, `${f}: la postazione non dichiara il fascicolo`).toMatch(/caseLabel:[\s\S]{0,80}fileCode/);
    }
  });
});

describe('visual bug pass — EvidenceScene toast no longer covers the header', () => {
  const toast = read('src/game/ui/AlertToast.ts');

  test('showToast accepts an optional topOffset, defaulting to the original position (36)', () => {
    expect(toast).toMatch(/topOffset\s*=\s*36/);
    expect(toast).toContain('const targetY = topOffset;');
  });

  /**
   * QUESTA REGOLA ERA UNA TRASCRIZIONE, ED È INVECCHIATA IN SILENZIO.
   *
   * Cercava la riga esatta `showToast(..., 'info', 20)`. Il 20 liberava
   * l'intestazione della scena quando è stato scritto; poi è arrivata la
   * barra della pratica, che occupa da y=9 a y=51, e quel 20 è diventato
   * il centro della barra — il toast atterrava sui pulsanti della
   * postazione e ne copriva due. Il controllo restava verde, perché la
   * riga era ancora quella scritta.
   *
   * Ora la regola è la proprietà: in una scena che monta la postazione,
   * ogni avviso riposa SOTTO la barra. Le misure si leggono dalla barra e
   * dall'avviso, non si ripetono qui.
   *
   * SI CONFRONTA IL BORDO, NON IL CENTRO. La prima versione di questa
   * regola guardava solo dove cade la coordinata di riposo, e ha accettato
   * un avviso che sbordava di otto pixel sulla barra: il container è
   * CENTRATO su quella coordinata, quindi metà dell'avviso sta più in alto.
   * Una guardia che misura il punto sbagliato è verde sul difetto.
   */
  test('in una scena con la postazione, i toast riposano sotto la barra', () => {
    const desk = read('src/game/ui/InspectorDesk.ts');
    const my = /export const DESK_Y = (\d+);/.exec(desk);
    const mh = /export const DESK_HEIGHT = (\d+);/.exec(desk);
    expect(my, 'DESK_Y deve restare una costante dichiarata').not.toBeNull();
    expect(mh, 'DESK_HEIGHT deve restare una costante dichiarata').not.toBeNull();
    const fondoBarra = Number(my![1]) + Number(mh![1]) / 2;

    const toast = read('src/game/ui/AlertToast.ts');
    const mt = /export const TOAST_HEIGHT = (\d+);/.exec(toast);
    expect(mt, 'TOAST_HEIGHT deve restare una costante dichiarata').not.toBeNull();
    const mezzoAvviso = Number(mt![1]) / 2;
    // il container è centrato sulla coordinata di riposo: lo dimostra il
    // rettangolo di fondo, disegnato a y=0 dentro il container
    expect(toast, "l'avviso non è più centrato: la regola qui sotto va rifatta").toMatch(
      /rectangle\(0, 0, width, TOAST_HEIGHT/
    );

    // le scene con la postazione si leggono dal disco
    const conPostazione = readdirSync(resolve(root, 'src/game/scenes'))
      .filter((f) => f.endsWith('.ts'))
      .filter((f) => /new InspectorDesk\(/.test(read(`src/game/scenes/${f}`)));
    expect(conPostazione.length, 'nessuna scena con postazione: il controllo sarebbe inerte').toBeGreaterThan(0);

    const colpevoli: string[] = [];
    for (const f of conPostazione) {
      const src = stripComments(read(`src/game/scenes/${f}`));
      // la costante che la scena usa come altezza di riposo
      const costante = /const (\w+) = DESK_BOTTOM \+ (?:TOAST_HEIGHT \/ 2|(\d+));/.exec(src);
      // fino al `);` dell'istruzione: `[^)]*` si fermava dentro `L()`, e
      // ogni chiamata risultava senza altezza dichiarata
      for (const [, args] of src.matchAll(/showToast\(([\s\S]*?)\);/g)) {
        const parti = args.split(',').map((x) => x.trim());
        if (parti.length < 4) { colpevoli.push(`${f}: avviso senza altezza dichiarata (${args.trim()})`); continue; }
        const quarto = parti[3];
        const valore = /^\d+$/.test(quarto)
          ? Number(quarto)
          : costante && quarto === costante[1]
            ? fondoBarra + (costante[2] === undefined ? mezzoAvviso : Number(costante[2]))
            : NaN;
        if (Number.isNaN(valore)) { colpevoli.push(`${f}: altezza dell'avviso illeggibile (${quarto})`); continue; }
        const bordoAlto = valore - mezzoAvviso;
        if (bordoAlto < fondoBarra) {
          colpevoli.push(
            `${f}: avviso centrato a y=${valore}, bordo alto a ${bordoAlto}, dentro la barra che finisce a ${fondoBarra}`
          );
        }
      }
    }
    expect(colpevoli, colpevoli.join('\n')).toEqual([]);
  });

  test('other showToast call sites are unchanged (no new positional argument)', () => {
    for (const path of ['src/game/scenes/CityMapScene.ts', 'src/game/scenes/TitleScene.ts']) {
      const src = read(path);
      const calls = [...src.matchAll(/showToast\(([^)]*)\)/g)];
      for (const [, args] of calls) {
        expect(args.split(',').length, `${path}: ${args}`).toBeLessThanOrEqual(3);
      }
    }
  });
});

describe('visual bug pass — IncidentScene panel contains all response options', () => {
  const src = read('src/game/scenes/IncidentScene.ts');

  test('the panel is tall enough for the 3rd option button (y=536, height 48 -> bottom edge 560)', () => {
    const m = src.match(/new Panel\(this, cx, (\d+), 860, (\d+)\)/);
    expect(m, 'Panel call not found with expected signature').not.toBeNull();
    const [, centerYStr, heightStr] = m!;
    const centerY = Number(centerYStr);
    const height = Number(heightStr);
    const panelBottom = centerY + height / 2;
    const lastButtonBottom = 536 + 48 / 2; // y=420+2*58, default Button height 48
    expect(panelBottom).toBeGreaterThanOrEqual(lastButtonBottom + 10);
  });
});

describe('visual bug pass — no gameplay, scoring, save or content changes', () => {
  // DecisionScene legitimately owns scoring (evaluateReport/StateManager.resolveCase in
  // its pre-existing resolve()) — that's not part of this bugfix pass, so it's excluded
  // from the blanket check below and covered separately.
  const files = [
    'src/game/scenes/ArchiveScene.ts',
    'src/game/scenes/EvidenceScene.ts',
    'src/game/scenes/IncidentScene.ts',
    'src/game/ui/AlertToast.ts'
  ];

  for (const path of files) {
    test(`${path} does not touch scoring, save/export or analytics config`, () => {
      const src = stripComments(read(path));
      for (const forbidden of ['evaluateReport', 'SaveSystem', 'ReportSystem', 'AnalyticsSystem.track(\'reset', 'TALLY_']) {
        expect(src, `${path} must not reference ${forbidden}`).not.toContain(forbidden);
      }
    });
  }

  test('DecisionScene: the new update() nav-visibility loop touches nothing but Button visibility', () => {
    const src = stripComments(read('src/game/scenes/DecisionScene.ts'));
    const m = src.match(/update\(\)\s*:\s*void\s*\{([\s\S]*?)\n  \}/);
    expect(m, 'update() method not found').not.toBeNull();
    const body = m![1];
    for (const forbidden of ['evaluateReport', 'SaveSystem', 'StateManager', 'AnalyticsSystem']) {
      expect(body, `update() must not reference ${forbidden}`).not.toContain(forbidden);
    }
  });

  test('ArchiveScene still shows every unlocked/locked norm (no norm removed to dodge the overflow)', () => {
    const src = read('src/game/scenes/ArchiveScene.ts');
    expect(src).toContain('NORMS.forEach((norm, i) =>');
    expect(src).not.toContain('.slice(');
  });
});

describe('visual bug pass — no external forms on the landings (Tally removed)', () => {
  test('landings ship no Tally embed, popup or link', () => {
    for (const p of ['index.html', 'en/index.html']) {
      const html = read(p);
      expect(html).not.toContain('tally.so');
      expect(html).not.toMatch(/data-tally/i);
    }
  });
});

/**
 * LA CITTÀ NON SI VEDE PIÙ MENTRE SI DECIDE.
 *
 * C'era una colonna con i quattro indicatori a destra, chiesta dal
 * proprietario («voglio sentire che le mie scelte cambiano la città») e
 * poi fatta togliere da lui, dopo averci rigiocato: su 1280 di larghezza
 * non ci stava insieme al riepilogo di sinistra e ai pulsanti, e al passo
 * della misura le barre finivano tagliate a metà sotto le opzioni.
 *
 * Gli indicatori restano sulla mappa e nella conseguenza. Questo controllo
 * ora difende il verso opposto, e una cosa che non è mai cambiata:
 * nessuna ANTEPRIMA di quello che farebbe ciascuna opzione, perché
 * trasformerebbe la decisione in un gioco di cursori da massimizzare
 * mentre il rapporto si valuta su quanto regge giuridicamente.
 */
describe('la decisione non mostra la città, e non ne prevede il futuro', () => {
  const src = read('src/game/scenes/DecisionScene.ts');

  test('nessuna colonna di indicatori durante i passi di scelta', () => {
    const pulito = stripComments(src);
    expect(pulito, 'la colonna degli indicatori è tornata nella decisione').not.toContain('new IndicatorHud(this');
    expect(pulito).not.toContain('ui.decision.cityState');
  });

  test('nessuna anteprima di quello che farebbe ciascuna opzione', () => {
    for (const forbidden of ['previewDelta', 'simulate', 'applyIndicatorDelta', 'INCIDENT_DELTAS']) {
      expect(src, `${forbidden} in DecisionScene trasformerebbe la scelta in un cursore`).not.toContain(forbidden);
    }
  });

  test('e la nota lo dice, in entrambe le lingue', () => {
    for (const [lang, dict] of [['it', itLocale], ['en', enLocale]] as const) {
      const note = dict.ui.decision.cityStateNote;
      expect(note.length, `${lang}`).toBeGreaterThan(30);
      expect(note.toLowerCase(), `${lang}`).toMatch(/anticipa|preview/);
    }
  });
});
