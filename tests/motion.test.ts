import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * "RIDUCI MOVIMENTO" VALE ANCHE PER LE DISSOLVENZE.
 *
 * Il gioco rispettava l'impostazione in nove punti — toast, macchina da
 * scrivere, timbro del rapporto, scossone dopo un esito sbagliato — ma non
 * nelle transizioni fra scene: quattordici scene su quindici chiamavano
 * cameras.main.fadeIn() senza guardarla, e una sola la controllava. Chi
 * chiede meno movimento ne riceveva comunque uno a ogni schermata.
 *
 * Il difetto era invisibile proprio perché sparso: nessuna singola scena
 * sembrava sbagliata. Per questo il controllo è sull'insieme — nessuna
 * scena può chiamare la camera direttamente — invece che su una lista di
 * scene da tenere aggiornata a mano.
 */

const root = resolve(__dirname, '..');
const scenes = readdirSync(resolve(root, 'src/game/scenes')).filter((f) => f.endsWith('.ts'));
const read = (p: string): string => readFileSync(resolve(root, p), 'utf8');

describe('nessuna scena sfuma per conto proprio', () => {
  it('le dissolvenze passano tutte dal modulo che conosce l\'impostazione', () => {
    const offenders: string[] = [];
    for (const f of scenes) {
      const src = read(`src/game/scenes/${f}`);
      for (const line of src.split('\n')) {
        if (/cameras\.main\.fade(In|Out)\(/.test(line)) offenders.push(`${f}: ${line.trim()}`);
      }
    }
    expect(offenders, offenders.join('\n')).toEqual([]);
  });

  it('almeno le scene giocate davvero usano il modulo', () => {
    for (const f of ['CityMapScene.ts', 'CaseScene.ts', 'EvidenceScene.ts', 'DecisionScene.ts', 'ReportScene.ts']) {
      expect(read(`src/game/scenes/${f}`), `${f} non sfuma affatto?`).toContain('fadeInScene(');
    }
  });
});

describe('il modulo tratta entrata e uscita in modo diverso, di proposito', () => {
  const motion = read('src/game/ui/motion.ts');

  it("l'entrata si annulla del tutto: appare e basta", () => {
    expect(motion).toMatch(/fadeIn\(StateManager\.reducedMotion \? 0 : duration/);
  });

  /**
   * La regola è che l'uscita non duri zero, non che sia scritta in un modo
   * preciso: questo controllo cercava l'espressione parola per parola e si è
   * rotto appena la durata è finita in una variabile, pur restando 1.
   */
  it("l'uscita non usa durata zero: da lì dipende la navigazione", () => {
    const fn = motion.slice(motion.indexOf('export function fadeOutScene'));
    const m = /reducedMotion \? (\d+) : duration/.exec(fn);
    expect(m, "l'uscita deve continuare a distinguere il caso \"riduci movimento\"").not.toBeNull();
    expect(
      Number(m![1]),
      "con 0 l'evento di completamento è ciò che si rischia di perdere"
    ).toBeGreaterThan(0);
    expect(fn).toContain("once('camerafadeoutcomplete'");
  });

  it('ogni uscita porta con sé che cosa fare dopo, invece di legarlo a parte', () => {
    for (const f of scenes) {
      const src = read(`src/game/scenes/${f}`);
      for (const line of src.split('\n')) {
        if (line.includes('fadeOutScene(')) {
          expect(line, `${f}: uscita senza seguito → schermo nero`).toMatch(/fadeOutScene\(this, \d+, /);
        }
      }
    }
  });
});

describe('la parallasse della mappa è decorazione, e si spegne se richiesto', () => {
  const map = read('src/game/scenes/CityMapScene.ts');

  it('i due strati derivano in verso opposto, altrimenti non è parallasse', () => {
    expect(map).toMatch(/GAME_WIDTH \/ 2 - this\.drift\.x \* PARALLAX_MAP/);
    expect(map).toMatch(/GAME_WIDTH \/ 2 \+ this\.drift\.x \* PARALLAX_GRAIN/);
  });

  it('gli strati sono più larghi del riquadro, o muovendoli si vedrebbe il bordo', () => {
    expect(map).toContain('GAME_WIDTH + PARALLAX_MAP * 2');
    expect(map).toContain('GAME_WIDTH + PARALLAX_GRAIN * 2');
  });

  it('con "riduci movimento" la deriva punta al centro e resta lì', () => {
    expect(map).toMatch(/StateManager\.reducedMotion[\s\S]{0,40}\{ x: 0, y: 0 \}/);
  });

  it('la deriva è limitata: un puntatore fuori dal canvas non sposta la mappa a caso', () => {
    expect(map).toContain('Phaser.Math.Clamp(target.x, -1, 1)');
    expect(map).toContain('Phaser.Math.Clamp(target.y, -1, 1)');
  });
});

/**
 * LA DISSOLVENZA NON PUÒ BLOCCARE LA NAVIGAZIONE.
 *
 * La dissolvenza di Phaser avanza per fotogrammi, non a orologio: sono
 * diciotto passi da 16,67 ms nominali, e su una macchina che ne disegna tre
 * al secondo quei 300 ms diventano sei secondi reali. Fino ad allora la
 * schermata resta ferma e il pulsante appena premuto sembra non aver fatto
 * niente — misurato in un browser senza accelerazione hardware: 1,7 s su un
 * canvas 1280×720, oltre 7 s su uno 2880×1620.
 *
 * Il ripiego deve essere a orologio VERO. `scene.time.delayedCall` sarebbe
 * inutile: è a sua volta legato ai fotogrammi, cioè alla stessa cosa che si
 * sta cercando di aggirare.
 */
describe('la transizione fra scene ha una rete di sicurezza a orologio', () => {
  const src = read('src/game/ui/motion.ts');

  it('esiste un timer di scadenza, e non è quello della scena', () => {
    expect(src, 'serve un orologio vero').toContain('window.setTimeout');
    const fn = src.slice(src.indexOf('export function fadeOutScene'));
    expect(fn, 'delayedCall dipende dai fotogrammi, cioè dal problema').not.toContain('delayedCall');
  });

  it('la chiamata parte una volta sola, che vinca la dissolvenza o il timer', () => {
    const fn = src.slice(src.indexOf('export function fadeOutScene'));
    expect(fn).toContain('if (done) return;');
    expect(fn, 'chi arriva primo deve spegnere l\'altro').toContain('clearTimeout');
    expect(fn).toContain("once('camerafadeoutcomplete', go)");
  });

  it('la pazienza è più lunga della dissolvenza, così su una macchina normale non scatta mai', () => {
    // letta dal sorgente e non importata: motion.ts tira dentro lo
    // StateManager, che all'import cerca localStorage e qui non c'è
    const m = /export const FADE_PATIENCE = (\d+(?:\.\d+)?);/.exec(src);
    expect(m, 'FADE_PATIENCE deve restare una costante dichiarata, non un numero sparso').not.toBeNull();
    const patience = Number(m![1]);
    expect(patience).toBeGreaterThan(1);
    // e non così lunga da rendere inutile la rete
    expect(patience).toBeLessThanOrEqual(5);
  });

  it('vale per ogni scena: nessuna chiama fadeOut della camera per conto suo', () => {
    const scenes = readdirSync(resolve(root, 'src/game/scenes')).filter((f) => f.endsWith('.ts'));
    const offenders = scenes.filter((f) => /cameras\.main\.fadeOut\(/.test(read(`src/game/scenes/${f}`)));
    expect(offenders, offenders.join(', ')).toEqual([]);
  });
});

/**
 * OGNI ANIMAZIONE, NON SOLO QUELLE CHE NON FINISCONO MAI.
 *
 * La prima versione di questo controllo guardava i tween con `repeat: -1`,
 * e per quelli andava bene. Ma «riduci movimento» non è una richiesta di
 * evitare le animazioni *lunghe*: è una richiesta di non vederne. Le
 * animazioni una tantum erano quattro, ognuna innocua da sola — le schede
 * reperto che entravano una dopo l'altra, il fascicolo che saliva dal
 * basso, la nota della conseguenza che sfumava, la barra dell'indicatore
 * che si riempiva — e tutte insieme l'esatto contrario di quello che
 * l'impostazione promette. Nessuna aveva `repeat: -1`, quindi nessuna era
 * coperta.
 *
 * La regola ora è completa: NESSUN tween, di nessuna durata, senza che
 * l'impostazione sia stata consultata. Ci si arriva in tre modi — un `if`
 * accanto alla chiamata, l'aiutante `reveal` di motion.ts, o un
 * interruttore che il chiamante deriva dall'impostazione — e il controllo
 * li accetta tutti e tre, purché uno ci sia.
 *
 * L'elenco dei file si legge dal disco, ricorsivamente: un'animazione nuova
 * finisce sotto questo controllo il giorno che nasce.
 */
describe('nessuna animazione ignora "riduci movimento"', () => {
  const tutti = (dir: string): string[] => {
    const out: string[] = [];
    for (const e of readdirSync(resolve(root, dir), { withFileTypes: true })) {
      if (e.isDirectory()) out.push(...tutti(`${dir}/${e.name}`));
      else if (e.name.endsWith('.ts')) out.push(`${dir}/${e.name}`);
    }
    return out;
  };
  const files = tutti('src/game');

  /** motion.ts È la decisione: chiedere a sé stessa non avrebbe senso. */
  const CASA = 'src/game/ui/motion.ts';

  it('la lettura del disco trova davvero i sorgenti del gioco', () => {
    expect(files.length, 'se la ricorsione fallisse, il controllo sarebbe vuoto').toBeGreaterThan(30);
  });

  it('ogni tween ha l\'impostazione a portata di sguardo', () => {
    const colpevoli: string[] = [];
    let esaminati = 0;
    for (const f of files) {
      if (f === CASA) continue;
      const src = read(f);
      const re = /tweens\s*\.\s*(add|addCounter)\s*\(/g;
      let m: RegExpExecArray | null;
      while ((m = re.exec(src)) !== null) {
        esaminati += 1;
        /**
         * La finestra è quella che un lettore abbraccia con lo sguardo:
         * 400 caratteri prima della chiamata, più la chiamata intera. Il
         * «dopo» conta quanto il «prima», perché il modo più diretto di
         * rispettare l'impostazione è dentro la configurazione stessa —
         * `duration: reducedMotion ? 0 : 400` — e una finestra solo
         * all'indietro lo dichiarava colpevole.
         */
        const fine = src.indexOf(';', m.index);
        const prima = src.slice(Math.max(0, m.index - 400), m.index);
        const chiamata = src.slice(m.index, fine === -1 ? m.index : fine);
        const guardia = /if\s*\([^)]*StateManager\.reducedMotion[^)]*\)/.test(prima);
        const durataAdattiva = /duration\s*:\s*StateManager\.reducedMotion\s*\?/.test(chiamata);
        const interruttore = /\banimate\b/.test(prima + chiamata);
        if (!guardia && !durataAdattiva && !interruttore) {
          const riga = src.slice(0, m.index).split('\n').length;
          colpevoli.push(`${f}:${riga}`);
        }
      }
    }
    expect(esaminati, 'nessun tween trovato = controllo inerte').toBeGreaterThan(3);
    expect(
      colpevoli,
      `tween senza freno (usa reveal() di motion.ts, o un if sull'impostazione):\n${colpevoli.join('\n')}`
    ).toEqual([]);
  });

  it("l'aiutante esiste, ed è lui a saltare l'animazione invece di saltarne il risultato", () => {
    const src = read(CASA);
    const fn = src.slice(src.indexOf('export function reveal'));
    expect(fn, "con l'impostazione attiva si deve arrivare allo stato finale").toContain('finale');
    expect(fn, 'il seguito va eseguito lo stesso, o la scena resta senza pulsante').toContain('onComplete');
  });

  it("l'interruttore, dove c'è, è davvero l'impostazione e non un `true` scritto a mano", () => {
    // I generatori che espongono `animate` si trovano dal disco, e così i
    // loro chiamanti: passare `true` renderebbe il parametro un ornamento.
    const generatori: string[] = [];
    for (const f of files) {
      const m = /export function (\w+)\([\s\S]{0,400}?animate\s*=\s*false/.exec(read(f));
      if (m) generatori.push(m[1]);
    }
    expect(generatori.length, 'nessun generatore con interruttore = controllo inerte').toBeGreaterThan(0);

    const colpevoli: string[] = [];
    for (const f of files) {
      const src = read(f);
      for (const nome of generatori) {
        const re = new RegExp(`\\b${nome}\\s*\\(([^;]*?)\\)\\s*;`, 'g');
        let m: RegExpExecArray | null;
        while ((m = re.exec(src)) !== null) {
          const args = m[1];
          if (src.slice(Math.max(0, m.index - 20), m.index).includes('function')) continue;
          if (args.split(',').length < 3) continue; // chiamata senza interruttore: resta ferma
          if (!/reducedMotion/.test(args)) colpevoli.push(`${f}: ${nome}(${args.trim()})`);
        }
      }
    }
    expect(colpevoli, `interruttore acceso senza chiedere all'impostazione:\n${colpevoli.join('\n')}`).toEqual([]);
  });
});
