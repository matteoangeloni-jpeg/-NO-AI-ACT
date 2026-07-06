import Phaser from 'phaser';
import { gameConfig } from './game/GameConfig';
import { initMobileGuard } from './mobileGuard';
import { languageFromQuery } from './game/i18n';
import { StateManager } from './game/systems/StateManager';

/**
 * Public landing handoff: the IT landing links to /play/?lang=it and the EN
 * landing to /play/?lang=en. Honour only known codes; anything else (or no
 * param) keeps the saved/default language. Reuses the existing i18n +
 * persistence — no parallel language system, no personal data.
 */
const requestedLang = languageFromQuery(window.location.search);
if (requestedLang) StateManager.setLanguage(requestedLang);

const game = new Phaser.Game(gameConfig);
// Debug/test handle only — no data leaves the browser. Used by the opt-in
// layout smoke to read real canvas-object bounds (buttons are drawn on the
// canvas, not the DOM, so bounding-box checks need the live Phaser instance).
(window as unknown as { game?: Phaser.Game }).game = game;
initMobileGuard();
