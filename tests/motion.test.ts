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

  it("l'uscita non usa durata zero: da lì dipende la navigazione", () => {
    expect(motion, 'con 0 l\'evento di completamento è ciò che si rischia di perdere').toMatch(
      /fadeOut\(StateManager\.reducedMotion \? 1 : duration/
    );
    expect(motion).toContain("once('camerafadeoutcomplete'");
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
