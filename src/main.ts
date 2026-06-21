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

new Phaser.Game(gameConfig);
initMobileGuard();
