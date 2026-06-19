import Phaser from 'phaser';
import { gameConfig } from './game/GameConfig';
import { initMobileGuard } from './mobileGuard';

new Phaser.Game(gameConfig);
initMobileGuard();
