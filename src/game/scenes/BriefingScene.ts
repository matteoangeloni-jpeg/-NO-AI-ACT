import Phaser from 'phaser';
import { StateManager } from '../systems/StateManager';
import { Button } from '../ui/Button';
import { Panel } from '../ui/Panel';
import { TypewriterText } from '../ui/TypewriterText';
import { COLOR_STR, GAME_HEIGHT, GAME_WIDTH, textStyle } from '../ui/theme';

const BRIEFING =
  'Anno 2032. In questa città l\'AI Act non è mai entrato in vigore.\n\n' +
  'La città funziona. Le code non esistono, i moduli si compilano da soli, ' +
  'le decisioni arrivano prima ancora delle domande.\n\n' +
  'Nessuno sa più chi decide. Nessuno sa più come contestare. ' +
  'Gli incidenti algoritmici si accumulano negli archivi come pratiche inevase.\n\n' +
  'Lei è l\'Ispettore. Il suo mandato: indagare gli incidenti, classificare i ' +
  'sistemi, imporre le misure. Per ogni caso chiuso, l\'archivio le restituirà ' +
  'la norma che — altrove, in un\'altra Europa — avrebbe impedito tutto questo.\n\n' +
  'La città la sta aspettando. Cerchi di non abituarsi alla sua efficienza.';

export class BriefingScene extends Phaser.Scene {
  constructor() {
    super('Briefing');
  }

  create(): void {
    const cx = GAME_WIDTH / 2;
    this.cameras.main.setBackgroundColor(COLOR_STR.carbon);
    this.cameras.main.fadeIn(300, 0, 0, 0);
    this.add.tileSprite(cx, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 'noise').setAlpha(0.4);

    new Panel(this, cx, GAME_HEIGHT / 2, 860, 560);
    this.add.text(cx - 400, 90, 'ISPETTORATO PER GLI INCIDENTI ALGORITMICI', textStyle(13, COLOR_STR.alert));
    this.add.text(cx - 400, 112, 'BRIEFING RISERVATO — PRATICA AX/2032', textStyle(11, COLOR_STR.paperDim));

    const body = new TypewriterText(this, cx - 400, 150, 15, COLOR_STR.paper, 800);
    const btn = new Button(this, cx, GAME_HEIGHT - 90, 'ACCEDI ALLA MAPPA CIVICA', () => {
      StateManager.setBriefingSeen();
      this.cameras.main.fadeOut(300, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('CityMap'));
    });
    btn.setVisible(false);

    body.write(BRIEFING, () => btn.setVisible(true));
    this.input.on('pointerdown', () => body.skip());
  }
}
