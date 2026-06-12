/**
 * Avviso licenze a runtime (console sviluppatori).
 * La fonte autorevole per crediti e licenze è nei file del repository:
 * CREDITS.md, ASSET_REGISTER.md, LICENSE_NOTES.md, THIRD_PARTY_LICENSES.md.
 */
export const LicenseNoticeSystem = {
  logToConsole(): void {
    // log tecnico per sviluppatori: non localizzato di proposito
    console.info(
      '%cNO AI ACT — asset e licenze',
      'color:#5d7fb8;font-weight:bold',
      '\nTutti gli asset grafici e audio sono generati proceduralmente.' +
        '\nDettagli completi: ASSET_REGISTER.md, CREDITS.md, LICENSE_NOTES.md, THIRD_PARTY_LICENSES.md.'
    );
  }
};
