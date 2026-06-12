import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { PreloadScene } from './scenes/PreloadScene';
import { TitleScene } from './scenes/TitleScene';
import { BriefingScene } from './scenes/BriefingScene';
import { CityMapScene } from './scenes/CityMapScene';
import { CaseScene } from './scenes/CaseScene';
import { EvidenceScene } from './scenes/EvidenceScene';
import { DecisionScene } from './scenes/DecisionScene';
import { ConsequenceScene } from './scenes/ConsequenceScene';
import { NormCardScene } from './scenes/NormCardScene';
import { ArchiveScene } from './scenes/ArchiveScene';
import { FinaleScene } from './scenes/FinaleScene';
import { CreditsScene } from './scenes/CreditsScene';
import { GAME_HEIGHT, GAME_WIDTH } from './ui/theme';

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: '#07090f',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
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
    ConsequenceScene,
    NormCardScene,
    ArchiveScene,
    FinaleScene,
    CreditsScene
  ]
};
