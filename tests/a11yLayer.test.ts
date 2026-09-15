import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { shouldShowMobileGuard, savedLanguage } from '../src/mobileGuard';
import { it as itLocale } from '../src/game/i18n/it';
import { en as enLocale } from '../src/game/i18n/en';

/**
 * ACCESSIBILITY LAYER GUARD (2.0 — mission §11).
 *
 * Pins: the semantic reading layer in the play shell (sr-only + aria-live +
 * user-selectable visible mode), its privacy (no network, no state writes),
 * keyboard coverage of the core flow, the dismissable mobile-guard fallback,
 * and honesty (no WCAG-conformance claim anywhere).
 */

const root = resolve(__dirname, '..');
const read = (p: string) => readFileSync(resolve(root, p), 'utf8');

describe('play shell — semantic layer markup', () => {
  const shell = read('play/index.html');

  it('ships the reading layer, the aria-live announcer and the toggle', () => {
    expect(shell).toContain('id="reading-layer"');
    expect(shell).toMatch(/<section id="reading-layer" class="sr-only"[^>]*aria-label=/);
    expect(shell).toMatch(/<div id="sr-announcer" class="sr-only" role="status" aria-live="polite">/);
    expect(shell).toMatch(/<button id="reading-toggle"[^>]*aria-pressed="false"[^>]*aria-controls="reading-layer">/);
  });

  it('the mobile guard has the continue-anyway fallback button', () => {
    expect(shell).toContain('class="mg-continue"');
  });

  it('adds no scripts beyond main.ts and the pre-existing beacon', () => {
    const srcs = [...shell.matchAll(/<script[^>]*src=['"]([^'"]+)['"]/g)].map(([, s]) => s);
    expect(srcs.sort()).toEqual(['/src/main.ts', 'https://static.cloudflareinsights.com/beacon.min.js']);
  });
});

describe('global.css — sr-only, visible reading mode, guard fallback', () => {
  const css = read('src/styles/global.css');
  it('defines .sr-only and the visible reading panel', () => {
    expect(css).toContain('.sr-only');
    expect(css).toContain('body.reading-visible #reading-layer');
    expect(css).toContain('#reading-toggle');
    expect(css).toContain('.mg-continue');
    expect(css).toContain(':focus-visible');
  });
});

describe('ReadingLayer — read-only, local, no duplicated interaction', () => {
  const src = read('src/game/systems/ReadingLayer.ts');

  it('makes no network calls and never writes game state', () => {
    for (const bad of ['fetch(', 'XMLHttpRequest', 'sendBeacon', 'WebSocket', 'localStorage.setItem', 'SaveSystem', 'saveCaseMeta', 'AnalyticsSystem']) {
      expect(src, bad).not.toContain(bad);
    }
  });

  it('builds DOM via textContent — no innerHTML, no listeners, no links', () => {
    expect(src).toContain('e.textContent = text');
    expect(src).not.toContain('innerHTML');
    expect(src).not.toMatch(/layer\.addEventListener|<a |<button/);
  });

  it('synchronises the lang attribute with the game language', () => {
    expect(src).toContain("layer.setAttribute('lang', StateManager.language)");
  });
});

describe('reading layer — scenes publish on every transition', () => {
  const SCENES = ['BriefingScene', 'CityMapScene', 'CaseScene', 'EvidenceScene', 'DecisionScene', 'ReportScene', 'FinaleScene'];
  for (const scene of SCENES) {
    it(`${scene} publishes to the reading layer`, () => {
      const src = read(`src/game/scenes/${scene}.ts`);
      expect(src).toMatch(/ReadingLayer\.setScene\(/);
    });
  }
  it('the report outcome is announced via aria-live', () => {
    expect(read('src/game/scenes/ReportScene.ts')).toContain('ReadingLayer.announce(');
  });
});

describe('keyboard coverage (§11.2) — core flow without a pointer', () => {
  it('CityMap: arrows cycle open cases and ENTER opens the selection', () => {
    const src = read('src/game/scenes/CityMapScene.ts');
    expect(src).toContain("['RIGHT', 'DOWN']");
    expect(src).toContain("['LEFT', 'UP']");
    expect(src).toContain('keydown-ENTER');
    expect(src).toContain('setupKeyboardSelection');
  });

  it('Case and Briefing: ENTER proceeds once the CTA is visible', () => {
    expect(read('src/game/scenes/CaseScene.ts')).toContain("keydown-ENTER");
    expect(read('src/game/scenes/BriefingScene.ts')).toContain("keydown-ENTER");
  });

  it('Evidence: number keys drive the same activate() path as the pointer', () => {
    const scene = read('src/game/scenes/EvidenceScene.ts');
    expect(scene).toContain('.activate()');
    expect(scene).toContain('keydown-ENTER');
    const card = read('src/game/ui/DossierCard.ts');
    expect(card).toContain("on('pointerdown', () => this.activate())");
  });

  it('a committed keyboard smoke drives a full case end-to-end', () => {
    const smoke = read('scripts/smoke/keyboard-smoke.mjs');
    for (const marker of ['ArrowRight', "press('Enter'", 'reading-layer', 'sr-announcer', 'caseMeta']) {
      expect(smoke, marker).toContain(marker);
    }
  });
});

describe('mobile guard — v2-aware language and declared fallback (§11.4)', () => {
  it('shouldShowMobileGuard keeps the same thresholds', () => {
    expect(shouldShowMobileGuard(390, 844)).toBe(true);   // portrait phone
    expect(shouldShowMobileGuard(360, 800)).toBe(true);
    expect(shouldShowMobileGuard(800, 390)).toBe(false);  // landscape phone-ish
    expect(shouldShowMobileGuard(1280, 720)).toBe(false); // desktop
  });

  it('savedLanguage reads the v2 key first, then the v1 snapshot', () => {
    const original = (globalThis as Record<string, unknown>).localStorage;
    const store = new Map<string, string>();
    try {
      (globalThis as Record<string, unknown>).localStorage = {
        getItem: (k: string) => store.get(k) ?? null,
        setItem: (k: string, v: string) => store.set(k, v),
        removeItem: (k: string) => store.delete(k)
      };
      store.set('no-ai-act-save-v1', JSON.stringify({ language: 'it' }));
      store.set('no-ai-act-save-v2', JSON.stringify({ language: 'en' }));
      expect(savedLanguage()).toBe('en');
      store.delete('no-ai-act-save-v2');
      expect(savedLanguage()).toBe('it');
    } finally {
      (globalThis as Record<string, unknown>).localStorage = original;
    }
  });

  it('the guard is dismissable (continue-anyway), never a hard block', () => {
    const src = read('src/mobileGuard.ts');
    expect(src).toContain('mg-continue');
    expect(src).toContain('dismissed = true');
  });

  it('the layout smoke tests the fallback at 360×800 and 390×844', () => {
    const smoke = read('scripts/smoke/layout-smoke.mjs');
    expect(smoke).toContain('{ w: 390, h: 844 }');
    expect(smoke).toContain('{ w: 360, h: 800 }');
    expect(smoke).toContain('continue-anyway');
    expect(smoke).toContain('{ w: 1920, h: 1080 }');
  });
});

describe('honesty — no WCAG conformance claim', () => {
  it('neither the reading layer nor the i18n claims WCAG conformance', () => {
    for (const p of ['src/game/systems/ReadingLayer.ts', 'src/game/i18n/it.ts', 'src/game/i18n/en.ts', 'play/index.html']) {
      expect(read(p).toLowerCase()).not.toMatch(/wcag[ -]?2[^\n]{0,20}(conform|complian)/);
    }
  });

  it('both locales carry the full a11y block', () => {
    for (const locale of [itLocale, enLocale]) {
      const a = (locale as typeof itLocale).a11y;
      for (const k of ['readingShow', 'readingHide', 'readingNote', 'mobileContinue', 'mapHint', 'evidenceHint', 'outcomeAnnounced'] as const) {
        expect(a[k], k).toBeTruthy();
      }
    }
  });
});

/**
 * PANNELLI MODALI E STRATO DI LETTURA.
 *
 * Un overlay copre lo schermo. Lo strato di lettura, però, continuava a
 * descrivere la scena sotto: aprendo la guida docente, l'autocontrollo o il
 * contesto del caso, chi legge con uno screen reader si ritrovava davanti il
 * testo di un'altra schermata. Otto pannelli su nove non pubblicavano nulla,
 * e nessun controllo poteva accorgersene perché l'elenco dei pannelli non
 * esisteva da nessuna parte.
 *
 * L'elenco si legge dal disco: un pannello nuovo è coperto il giorno che
 * nasce.
 */
describe('ogni pannello modale pubblica il proprio testo, e lo restituisce', () => {
  const overlays = readdirSync(resolve(root, 'src/game/ui'))
    .filter((f) => f.endsWith('Overlay.ts'))
    .map((f) => `src/game/ui/${f}`);

  it('i pannelli si trovano davvero (altrimenti il controllo è inerte)', () => {
    expect(overlays.length).toBeGreaterThan(5);
  });

  for (const path of overlays) {
    const name = path.split('/').pop();
    it(`${name} pubblica all'apertura`, () => {
      expect(read(path), `${name}: apre un pannello senza dire cosa contiene`).toContain(
        'ReadingLayer.openOverlay('
      );
    });

    it(`${name} rimette la scena alla chiusura`, () => {
      expect(read(path), `${name}: chiudendosi lascia lo strato sul pannello sparito`).toContain(
        'ReadingLayer.closeOverlay()'
      );
    });
  }
});

/**
 * L'elenco delle scene che pubblicano NON è scritto a mano: una versione
 * precedente di questo file ne nominava sette, e una scena nuova sarebbe
 * nata scoperta.
 */
describe('nessuna scena pubblica pagina senza testo', () => {
  const scenes = readdirSync(resolve(root, 'src/game/scenes'))
    .filter((f) => f.endsWith('Scene.ts'))
    .map((f) => `src/game/scenes/${f}`);

  /**
   * Le scene di servizio non hanno contenuto proprio da leggere: Boot e
   * Preload durano un istante e non mostrano testo di gioco. Sono nominate
   * qui, e solo qui, perché l'esenzione sia visibile.
   */
  const SERVICE_SCENES = ['BootScene.ts', 'PreloadScene.ts'];

  it('le scene si trovano davvero', () => {
    expect(scenes.length).toBeGreaterThan(10);
  });

  it('ogni scena di contenuto pubblica sullo strato di lettura', () => {
    const silent = scenes
      .filter((p) => !SERVICE_SCENES.includes(p.split('/').pop()!))
      .filter((p) => !/ReadingLayer\.setScene\(/.test(read(p)));
    expect(silent, silent.join('\n')).toEqual([]);
  });
});

/**
 * I PANNELLI COSTRUITI DALLE SCENE.
 *
 * Quattro pannelli modali del titolo — nuova partita, docenti, risorse,
 * impostazioni — non sono classi in `ui/` ma container costruiti dentro la
 * scena, e per questo erano sfuggiti a ogni controllo: si apriva NUOVA
 * PARTITA e lo strato di lettura continuava a descrivere il titolo.
 *
 * Passano tutti da `openPanel` e `closeGroup`, quindi basta chiedere che
 * quei due facciano il loro mestiere — e che ciascun costruttore descriva
 * il proprio contenuto invece di lasciare il pannello col solo titolo.
 */
describe('i pannelli modali costruiti dal titolo pubblicano anche loro', () => {
  const title = read('src/game/scenes/TitleScene.ts');

  it('aprire un pannello lo pubblica, chiuderlo rimette il titolo', () => {
    const open = title.slice(title.indexOf('private openPanel'), title.indexOf('private openNewGame'));
    expect(open).toContain('ReadingLayer.openOverlay(');
    const close = title.slice(title.indexOf('private closeGroup'), title.indexOf('private readonly escHandler'));
    expect(close).toContain('ReadingLayer.closeOverlay()');
  });

  it('ogni pannello descrive il proprio contenuto, non solo il titolo', () => {
    const builders = ['openNewGame', 'openTeachers', 'openResources', 'openSettings'];
    const missing = builders.filter((b) => {
      const start = title.indexOf(`private ${b}`);
      const rest = title.slice(start);
      const end = rest.indexOf('\n  private ', 1);
      return !(end === -1 ? rest : rest.slice(0, end)).includes('this.describePanel(');
    });
    expect(missing, missing.join(', ')).toEqual([]);
  });
});

/**
 * UN AVVISO ALLA VOLTA.
 *
 * Ogni chiamata a showToast creava il proprio riquadro senza sapere di
 * quelli già in volo, e due eventi ravvicinati — aprire l'ultimo reperto e
 * citarne uno — producevano due avvisi sovrapposti nello stesso punto:
 * "[AVVI[AVVISO] Citato…", illeggibili tutti e due.
 */
describe('gli avvisi non si accavallano', () => {
  const src = read('src/game/ui/AlertToast.ts');

  it("l'avviso in corso viene tolto prima di mostrarne uno nuovo", () => {
    expect(src).toContain('previous.destroy()');
    expect(src, 'va fermata anche la sua animazione, o continua a muovere un oggetto distrutto').toContain(
      'killTweensOf(previous)'
    );
  });

  it('il riferimento è per scena, e non trattiene la scena in memoria', () => {
    expect(src).toContain('WeakMap<Phaser.Scene');
  });

  it("l'avviso nuovo prende il posto del vecchio nel registro", () => {
    expect(src).toContain('current.set(scene, container)');
  });
});
