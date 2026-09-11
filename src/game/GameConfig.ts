import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { PreloadScene } from './scenes/PreloadScene';
import { TitleScene } from './scenes/TitleScene';
import { BriefingScene } from './scenes/BriefingScene';
import { CityMapScene } from './scenes/CityMapScene';
import { CaseScene } from './scenes/CaseScene';
import { EvidenceScene } from './scenes/EvidenceScene';
import { DecisionScene } from './scenes/DecisionScene';
import { IncidentScene } from './scenes/IncidentScene';
import { ReportScene } from './scenes/ReportScene';
import { ConsequenceScene } from './scenes/ConsequenceScene';
import { DebriefScene } from './scenes/DebriefScene';
import { NormCardScene } from './scenes/NormCardScene';
import { ArchiveScene } from './scenes/ArchiveScene';
import { GlossaryScene } from './scenes/GlossaryScene';
import { FinaleScene } from './scenes/FinaleScene';
import { LearningReportScene } from './scenes/LearningReportScene';
import { CreditsScene } from './scenes/CreditsScene';
import { GAME_HEIGHT, GAME_WIDTH, RENDER_SCALE } from './ui/theme';

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game-container',
  // Il canvas è RENDER_SCALE volte il mondo logico: è l'unico modo per non
  // disegnare un 720p e poi stirarlo. Le coordinate delle scene restano in
  // unità 1280×720 — ci pensa lo zoom della camera, applicato in postBoot.
  width: GAME_WIDTH * RENDER_SCALE,
  height: GAME_HEIGHT * RENDER_SCALE,
  backgroundColor: '#07090f',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  /**
   * Ogni scena vede un mondo 1280×720 dentro un canvas 2560×1440: la camera
   * lo ingrandisce e lo centra, così nessuna coordinata delle scene cambia.
   * Va fatto qui e non nelle diciotto scene, perché una dimenticata
   * mostrerebbe un quarto di schermo invece di sgranare soltanto.
   *
   * `zoom` nella configurazione dello scale manager NON serve a questo: con
   * mode FIT viene ignorato, e il canvas resta della dimensione logica.
   * Misurato, non dedotto.
   */
  callbacks: {
    postBoot: (game): void => {
      for (const scene of game.scene.scenes) {
        scene.sys.events.on(Phaser.Scenes.Events.CREATE, () => {
          scene.cameras.main.setZoom(RENDER_SCALE);
          scene.cameras.main.centerOn(GAME_WIDTH / 2, GAME_HEIGHT / 2);
        });
      }
    }
  },
  render: {
    antialias: true,
    pixelArt: false
  },
  scene: [
    BootScene,
    PreloadScene,
    TitleScene,
    BriefingScene,
    CityMapScene,
    CaseScene,
    EvidenceScene,
    DecisionScene,
    IncidentScene,
    ReportScene,
    ConsequenceScene,
    DebriefScene,
    NormCardScene,
    ArchiveScene,
    GlossaryScene,
    FinaleScene,
    LearningReportScene,
    CreditsScene
  ]
};
