import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { charsShownAt } from '../src/game/ui/typewriterTiming';
import { it as itDict } from '../src/game/i18n/it';
import { en } from '../src/game/i18n/en';

const root = resolve(__dirname, '..');
const read = (p: string): string => readFileSync(resolve(root, p), 'utf8');
const src = read('src/game/ui/TypewriterText.ts');

/**
 * IL TESTO A MACCHINA SI POTEVA GIÀ SALTARE. NON LO SAPEVA NESSUNO.
 *
 * Un clic completava la scrittura, ma niente lo diceva — e la scrittura è
 * la prima cosa che il gioco fa. Chi arriva pensa che i primi minuti siano
 * un'introduzione da subire, e qualcuno se ne va prima di toccare un
 * fascicolo. Chi ha giocato lo ha indicato come la cosa più importante da
 * sistemare.
 *
 * Il suggerimento e i tasti stanno nella classe e non nelle scene: erano
 * quattro scene a registrare il clic ciascuna per conto suo, e la tastiera
 * non la registrava nessuna.
 */
describe('la scrittura a macchina dichiara che si può saltare', () => {
  it('mostra un suggerimento mentre scrive', () => {
    expect(src).toContain('ui.typewriterHint');
    const write = src.slice(src.indexOf('write(text: string'), src.indexOf('skip(): void'));
    expect(write, 'il suggerimento deve nascere insieme alla scrittura').toContain('this.hint = this.scene.add');
  });

  it('e lo toglie appena il testo è completo', () => {
    const teardown = src.slice(src.indexOf('private teardown()'), src.indexOf('private finish()'));
    expect(teardown, 'lo smontaggio deve distruggere il suggerimento').toContain('this.hint?.destroy()');
    const finish = src.slice(src.indexOf('private finish()'));
    expect(finish, 'e la fine della scrittura deve passare di lì').toContain('this.teardown()');
  });

  it("con \"riduci animazioni\" non compare: non c'è niente da saltare", () => {
    const write = src.slice(src.indexOf('write(text: string'), src.indexOf('skip(): void'));
    const reduced = write.slice(write.indexOf('reducedMotion'));
    const early = reduced.slice(0, reduced.indexOf('}'));
    expect(early, 'il ramo "riduci animazioni" esce prima di creare il suggerimento').toContain('return;');
    expect(early).not.toContain('this.hint =');
  });

  it('la tastiera salta quanto il puntatore, e la promessa nomina entrambi', () => {
    expect(src).toContain("'keydown-SPACE'");
    expect(src).toContain("'keydown-ENTER'");
    expect(src, 'i gestori vanno tolti a fine scrittura, o restano appesi alla scena').toContain('this.scene.input.off(');
    for (const [lang, dict] of [['it', itDict], ['en', en]] as const) {
      const hint = dict.ui.typewriterHint;
      expect(hint.length, `${lang}`).toBeGreaterThan(20);
      expect(hint.toUpperCase(), `${lang}: il suggerimento deve nominare il tasto`).toMatch(/SPAZIO|SPACE/);
    }
  });

  /**
   * Le scene continuano a registrare il proprio clic — è innocuo, skip() è
   * idempotente — ma nessuna deve reinventare la tastiera per conto suo:
   * è così che si finisce con una scena che salta e tre che no.
   */
  it('nessuna scena si registra i tasti di salto per conto proprio', () => {
    const scenes = readdirSync(resolve(root, 'src/game/scenes')).filter((f) => f.endsWith('.ts'));
    expect(scenes.length).toBeGreaterThan(10);
    const offenders: string[] = [];
    for (const f of scenes) {
      const s = read(`src/game/scenes/${f}`);
      if (!s.includes('TypewriterText')) continue;
      for (const line of s.split('\n')) {
        if (/keydown-(SPACE|ENTER)[^)]*\)\s*=>\s*\w+\.skip\(\)/.test(line)) offenders.push(`${f}: ${line.trim()}`);
      }
    }
    expect(offenders, offenders.join('\n')).toEqual([]);
  });
});

/**
 * TRE VELOCITÀ, NON DUE STATI.
 *
 * "Riduci animazioni" spegneva la scrittura insieme a tutto il resto: chi
 * voleva solo leggere subito doveva rinunciare anche a dissolvenze e
 * parallasse. La velocità del testo è ora una preferenza a sé.
 */
describe('la velocità del testo è una scelta, separata da "riduci animazioni"', () => {
  it('le tre velocità esistono e solo una è istantanea', () => {
    const m = /export const CHAR_DELAY_MS: Record<TextSpeed, number> = \{([^}]*)\}/.exec(src);
    expect(m, 'i ritardi devono restare una tabella dichiarata').not.toBeNull();
    const delays = Object.fromEntries(
      [...m![1].matchAll(/(\w+):\s*(\d+)/g)].map((x) => [x[1], Number(x[2])])
    );
    expect(Object.keys(delays).sort()).toEqual(['instant', 'normal', 'slow']);
    expect(delays.instant, 'istantanea significa nessuna attesa').toBe(0);
    expect(delays.slow, 'lenta deve essere più lenta di normale').toBeGreaterThan(delays.normal);
    expect(delays.normal).toBeGreaterThan(0);
  });

  it('la scrittura legge la preferenza invece di un numero fisso', () => {
    const write = src.slice(src.indexOf('write(text: string'), src.indexOf('skip(): void'));
    expect(write).toContain('CHAR_DELAY_MS[StateManager.textSpeed]');
    expect(write, 'il ritardo non deve più essere scritto nel timer').not.toMatch(/delay:\s*\d+/);
  });

  it('le due impostazioni restano distinte: una non implica l\'altra', () => {
    const write = src.slice(src.indexOf('write(text: string'), src.indexOf('skip(): void'));
    expect(write).toContain('StateManager.reducedMotion || delay === 0');
  });

  it('il selettore esiste nelle impostazioni, con la sua etichetta', () => {
    const title = read('src/game/scenes/TitleScene.ts');
    const settings = title.slice(title.indexOf('private openSettings'), title.indexOf('private openTeachers'));
    expect(settings).toContain('setTextSpeed');
    for (const [lang, dict] of [['it', itDict], ['en', en]] as const) {
      expect(dict.ui.textSpeed.label, `${lang}`).toContain('{value}');
      for (const k of ['slow', 'normal', 'instant'] as const) {
        expect(String(dict.ui.textSpeed.modes[k]).length, `${lang}/${k}`).toBeGreaterThan(2);
      }
    }
  });
});

/**
 * LA SCRITTURA VA A TEMPO, NON A FOTOGRAMMI.
 *
 * Il timer teneva un contatore e faceva `i += 1` a ogni scatto. Un
 * TimerEvent di Phaser scatta al più una volta per fotogramma: la velocità
 * del testo non era quindi 14 ms per carattere, era UN CARATTERE PER
 * FOTOGRAMMA. Lo stesso testo di 421 caratteri, misurato a schermo in
 * questo contenitore, impiegava 17,5 s a 1280×720 (10 fps), 40,6 s a
 * 1920×1080 (5 fps) e non finiva affatto entro due minuti a densità doppia
 * (2 fps), contro i 5,9 s che 14 ms per carattere promettono.
 *
 * Non era solo un fastidio: la verifica visiva in CI aspetta trenta secondi
 * che il caso mostri l'invito ai reperti, e quei trenta secondi cadevano
 * proprio nel mezzo fra il giro a 720 e quelli a 1080.
 *
 * Questi controlli girano sulla funzione che decide il ritmo, simulando un
 * ciclo di fotogrammi lento: è l'unico modo di vedere il difetto senza un
 * browser, perché a fotogrammi veloci le due versioni si somigliano.
 */
describe('la macchina da scrivere dipende dal tempo, non dal numero di fotogrammi', () => {
  const DELAY = 14;
  const TOTALE = 421;
  /** Il tempo che 14 ms per carattere promettono: poco meno di sei secondi. */
  const IDEALE = TOTALE * DELAY;

  /**
   * Simula un ciclo di gioco a `fps` fotogrammi al secondo e restituisce
   * l'istante in cui il testo risulta completo. Si ferma a cinque minuti:
   * oltre, il difetto è già dimostrato.
   */
  const finisceA = (fps: number): number => {
    const passo = 1000 / fps;
    for (let t = passo; t <= 300_000; t += passo) {
      if (charsShownAt(t, DELAY, TOTALE) >= TOTALE) return t;
    }
    return Infinity;
  };

  /**
   * IL CONTROLLO CHE CONTA. A qualunque frequenza, il testo deve finire
   * entro un fotogramma dal tempo promesso.
   *
   * Con il contatore per scatto, a 2 fotogrammi al secondo lo stesso testo
   * impiegava 421 × 500 ms = tre minuti e mezzo. Qui il limite più largo
   * (2 fps) è 6,4 secondi.
   */
  it('finisce entro un fotogramma dal tempo promesso, a qualunque frequenza', () => {
    for (const fps of [2, 5, 10, 24, 30, 60, 144]) {
      const passo = 1000 / fps;
      expect(finisceA(fps), `${fps} fps`).toBeLessThanOrEqual(IDEALE + passo);
    }
  });

  it('e non finisce PRIMA: la scrittura non si accorcia su macchine veloci', () => {
    for (const fps of [30, 60, 144]) {
      expect(finisceA(fps), `${fps} fps`).toBeGreaterThanOrEqual(IDEALE);
    }
  });

  it('a un dato istante il conto è lo stesso, comunque ci si sia arrivati', () => {
    for (const t of [0, 100, 1000, 3000, 5894, 9000]) {
      const atteso = charsShownAt(t, DELAY, TOTALE);
      for (const fps of [2, 5, 10, 30, 60, 144]) {
        // l'ultimo fotogramma non oltre t: il ritardo vale al più un fotogramma
        const passo = 1000 / fps;
        const ultimo = Math.floor(t / passo) * passo;
        const mostrati = charsShownAt(ultimo, DELAY, TOTALE);
        expect(atteso - mostrati, `${fps} fps a ${t} ms`).toBeLessThanOrEqual(Math.ceil(passo / DELAY) + 1);
      }
    }
  });

  it('non supera mai il testo, e non va sotto zero', () => {
    expect(charsShownAt(10_000_000, DELAY, TOTALE)).toBe(TOTALE);
    expect(charsShownAt(-5, DELAY, TOTALE)).toBe(0);
    expect(charsShownAt(0, DELAY, TOTALE)).toBe(0);
  });

  it('velocità istantanea significa tutto subito, senza divisioni per zero', () => {
    expect(charsShownAt(0, 0, TOTALE)).toBe(TOTALE);
  });

  it('il timer ricava i caratteri dall\'orologio, non da un contatore che cresce', () => {
    const write = src.slice(src.indexOf('write(text: string'), src.indexOf('/** Completa subito'));
    expect(write, 'il conto va ricavato dal tempo trascorso').toContain('charsShownAt(this.scene.time.now');
    expect(write, 'un incremento per scatto rimette la scrittura in mano ai fotogrammi').not.toMatch(/\bi \+= 1\b/);
  });
});
