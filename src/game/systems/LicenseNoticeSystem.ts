import { L } from '../i18n';

/**
 * Registro licenze esposto a runtime (schermata Credits) e in console.
 * Le voci visibili all'utente sono localizzate (i18n: credits.entries);
 * la fonte autorevole resta ASSET_REGISTER.md nel repository.
 */
export interface LicenseEntry {
  name: string;
  type: string;
  license: string;
  source: string;
}

export const LicenseNoticeSystem = {
  entries(): LicenseEntry[] {
    return L().credits.entries;
  },

  logToConsole(): void {
    // log tecnico per sviluppatori: non localizzato di proposito
    console.info(
      '%cNO AI ACT — asset e licenze',
      'color:#5d7fb8;font-weight:bold',
      '\nTutti gli asset grafici e audio sono generati proceduralmente.' +
        '\nDettagli completi: ASSET_REGISTER.md, CREDITS.md, LICENSE_NOTES.md.'
    );
  }
};
