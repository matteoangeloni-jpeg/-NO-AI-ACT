/**
 * MANIFESTO AUDIO — l'unico posto dove è scritto un nome di file.
 *
 * Il gioco è nato senza un solo file di asset: musica ed effetti erano
 * generati dalla Web Audio API a ogni avvio. Questo manifesto aggiunge la
 * possibilità di suonare campioni registrati, SENZA togliere la generazione
 * procedurale: i due mondi convivono e il secondo resta la rete di sicurezza
 * del primo.
 *
 * Due regole che questo file esiste per far rispettare.
 *
 * 1. NESSUN NOME DI FILE ALTROVE. Le scene chiedono un RUOLO ("sono la
 *    schermata della decisione") o un GESTO ("il giocatore ha citato un
 *    reperto"). Non sanno che esistano dei file, non li nominano e non
 *    cambiano se un file viene rinominato o sostituito. Un test impedisce
 *    che un `.mp3` ricompaia altrove nel sorgente.
 *
 * 2. SOLO LOCALE. I percorsi sono relativi alla radice pubblicata: niente
 *    host, niente schema, niente CDN. Il sito dichiara di non far uscire
 *    nulla dal dispositivo e questo vale anche per l'audio. Un test
 *    impedisce che qui compaia un indirizzo remoto.
 *
 * DOVE METTERE I FILE: `src/game/assets/audio/`. Non `public/`, e la
 * differenza conta: Vite guarda dentro quella cartella in fase di build,
 * manda in `dist/` solo i file che ci sono davvero e ne consegna qui gli
 * indirizzi. Da `public/` non potrebbe saperlo, e il gioco dovrebbe
 * chiedere tutti e sedici i file alla cieca — riempiendo la console di
 * errori di rete per ogni campione non ancora copiato.
 *
 * Così invece un file assente non è un errore né una richiesta: è una voce
 * che non compare, e il gioco suona la sua versione sintetizzata.
 */

/**
 * Indirizzi dei campioni presenti al momento della build, per nome di file.
 * `import.meta.glob` è risolto da Vite staticamente: questa mappa contiene
 * SOLO i file che esistono davvero sul disco quando si compila.
 */
const DISCOVERED = import.meta.glob('../assets/audio/*.mp3', {
  eager: true,
  query: '?url',
  import: 'default'
}) as Record<string, string>;

/** Dal nome di file al suo indirizzo pubblico, o null se non è stato consegnato. */
function discover(fileName: string): string | null {
  for (const [path, url] of Object.entries(DISCOVERED)) {
    if (path.endsWith(`/${fileName}`)) return url;
  }
  return null;
}

/**
 * RUOLI MUSICALI. Non uno per scena e non uno per caso: uno per *momento
 * del procedimento*. È la distinzione che il giocatore sente — leggere,
 * decidere, essere giudicato — e regge anche se domani le scene cambiano
 * nome o si aggiunge un caso.
 */
export type MusicRole =
  | 'menu'       // titolo, preload, menu
  | 'archive'    // mappa civica, fascicolo, reperti
  | 'decision'   // classificazione, misura, soggetto, motivazione
  | 'debrief'    // rapporto, conseguenza, fine turno
  | 'tension'    // casi gravi, sistema opaco, incidenti critici
  | 'classroom'; // modalità docente, pause di discussione

/**
 * GESTI SONORI. Nomi di ciò che il giocatore FA, non di come suona: il
 * giorno che il timbro diventa un altro campione, qui non cambia nulla.
 */
export type SfxCue =
  | 'openCase'
  | 'openLegalArchive'
  | 'citeEvidence'
  | 'registerDecision'
  | 'canProceed'
  | 'stampConforme'
  | 'errorContestable'
  | 'glitchOpacity'
  | 'uiHover'
  | 'uiClick';

export const MUSIC_FILES: Record<MusicRole, string> = {
  menu: 'music_menu_directive.mp3',
  archive: 'music_archive_loop.mp3',
  decision: 'music_decision_audit.mp3',
  debrief: 'music_debrief_report.mp3',
  tension: 'music_high_tension_incident.mp3',
  classroom: 'music_classroom_discussion.mp3'
};

export const SFX_FILES: Record<SfxCue, string> = {
  openCase: 'sfx_open_case.mp3',
  openLegalArchive: 'sfx_open_legal_archive.mp3',
  citeEvidence: 'sfx_cite_evidence.mp3',
  registerDecision: 'sfx_register_decision.mp3',
  canProceed: 'sfx_can_proceed.mp3',
  stampConforme: 'sfx_stamp_conforme.mp3',
  errorContestable: 'sfx_error_contestable.mp3',
  glitchOpacity: 'sfx_glitch_opacity.mp3',
  uiHover: 'sfx_ui_hover.mp3',
  uiClick: 'sfx_ui_click.mp3'
};

/**
 * GUADAGNO PER CAMPIONE.
 *
 * Un effetto di mezzo secondo suona più piano di un tappeto musicale anche
 * a pari volume di picco: l'orecchio media sulla durata. Correggerlo qui e
 * non nei file è una scelta deliberata — i file originali restano quelli
 * consegnati, e una correzione sbagliata si annulla cambiando un numero
 * invece di rigenerare un campione.
 *
 * 1 significa "come consegnato". Da alzare solo dopo aver ascoltato il mix.
 */
export const SFX_TRIM: Record<SfxCue, number> = {
  openCase: 1,
  openLegalArchive: 1,
  citeEvidence: 1,
  registerDecision: 1,
  canProceed: 1,
  stampConforme: 1,
  errorContestable: 1,
  glitchOpacity: 1,
  // "molto basso e discreto": l'hover non deve farsi notare
  uiHover: 0.45,
  uiClick: 0.8
};

export const MUSIC_TRIM: Record<MusicRole, number> = {
  menu: 1,
  archive: 0.85,
  decision: 1,
  debrief: 0.85,
  tension: 1,
  classroom: 0.7
};

/** Indirizzo del campione musicale, o null se quel file non è stato consegnato. */
export const musicPath = (role: MusicRole): string | null => discover(MUSIC_FILES[role]);

/** Indirizzo dell'effetto, o null se quel file non è stato consegnato. */
export const sfxPath = (cue: SfxCue): string | null => discover(SFX_FILES[cue]);

/** Quanti dei campioni dichiarati sono presenti. Serve ai controlli. */
export const deliveredCount = (): number =>
  [...MUSIC_ROLES.map(musicPath), ...SFX_CUES.map(sfxPath)].filter(Boolean).length;

/** Tutti i ruoli e tutti i gesti, per chi deve ciclarli (caricatore, test). */
export const MUSIC_ROLES = Object.keys(MUSIC_FILES) as MusicRole[];
export const SFX_CUES = Object.keys(SFX_FILES) as SfxCue[];
