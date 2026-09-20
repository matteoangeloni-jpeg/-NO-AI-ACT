import Phaser from 'phaser';
import { gameConfig } from './game/GameConfig';
import { initMobileGuard } from './mobileGuard';
import { initReadingLayer } from './game/systems/ReadingLayer';
import { languageFromQuery } from './game/i18n';
import { StateManager } from './game/systems/StateManager';
import { THEME_IDS, buildTheme } from './game/systems/musicThemes';
import { MASTER_VOLUME, THEME_VOLUME } from './game/systems/AudioSystem';
import { installKeyEventDedupe } from './game/ui/keyInput';

/**
 * Public landing handoff: the IT landing links to /play/?lang=it and the EN
 * landing to /play/?lang=en. Honour only known codes; anything else (or no
 * param) keeps the saved/default language. Reuses the existing i18n +
 * persistence — no parallel language system, no personal data.
 */
const requestedLang = languageFromQuery(window.location.search);
if (requestedLang) StateManager.setLanguage(requestedLang);

/**
 * Prima di creare il gioco: una pressione di tasto deve valere un'azione
 * anche quando i fotogrammi crollano. Il perché è in keyInput.ts, con le
 * misure. Va installata qui perché vale per ogni scena, comprese quelle
 * che non esistono ancora.
 */
installKeyEventDedupe();

const game = new Phaser.Game(gameConfig);
// Debug/test handle only — no data leaves the browser. Used by the opt-in
// layout smoke to read real canvas-object bounds (buttons are drawn on the
// canvas, not the DOM, so bounding-box checks need the live Phaser instance).
(window as unknown as { game?: Phaser.Game }).game = game;

/**
 * Stessa ragione, per la musica: i temi sono codice che genera suono, e
 * l'unico modo di verificare che un tema non sia muto — o identico a un
 * altro — è renderizzarlo con un AudioContext vero. Lo smoke audio li rende
 * offline da qui. È la funzione già inclusa nel bundle, non un dato in più:
 * niente lascia il browser.
 */
(window as unknown as {
  audioProbe?: { buildTheme: typeof buildTheme; themeIds: string[]; masterVolume: number; themeVolume: number };
}).audioProbe = {
  buildTheme,
  themeIds: THEME_IDS,
  // i guadagni veri della catena, così lo smoke non li ricopia
  masterVolume: MASTER_VOLUME,
  themeVolume: THEME_VOLUME
};
initMobileGuard();
initReadingLayer();
