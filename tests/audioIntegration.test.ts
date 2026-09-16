import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  MUSIC_FILES,
  MUSIC_ROLES,
  MUSIC_TRIM,
  SFX_CUES,
  SFX_FILES,
  SFX_TRIM,
  musicPath,
  sfxPath
} from '../src/game/systems/audioAssets';

/**
 * INTEGRAZIONE AUDIO — le proprietà che devono restare vere.
 *
 * I campioni sono file, quindi possono mancare: il gioco è nato senza e
 * deve continuare a funzionare senza. Questi controlli non verificano che i
 * file ci siano — sarebbe un test che fallisce su un clone pulito — ma che
 * il MODO in cui sono integrati regga in entrambi i casi.
 */

const root = resolve(__dirname, '..');
const read = (p: string) => readFileSync(resolve(root, p), 'utf8');

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const e of readdirSync(resolve(root, dir))) {
    const p = join(dir, e);
    if (statSync(resolve(root, p)).isDirectory()) out.push(...walk(p));
    else if (p.endsWith('.ts')) out.push(p.replace(/\\/g, '/'));
  }
  return out;
}
const GAME_FILES = walk('src/game');

describe('il manifesto copre tutto e non ha doppioni', () => {
  it('ogni ruolo musicale e ogni gesto ha un file dichiarato e un guadagno', () => {
    for (const role of MUSIC_ROLES) {
      expect(MUSIC_FILES[role], `ruolo senza file: ${role}`).toMatch(/\.mp3$/);
      expect(typeof MUSIC_TRIM[role], `ruolo senza guadagno: ${role}`).toBe('number');
    }
    for (const cue of SFX_CUES) {
      expect(SFX_FILES[cue], `gesto senza file: ${cue}`).toMatch(/\.mp3$/);
      expect(typeof SFX_TRIM[cue], `gesto senza guadagno: ${cue}`).toBe('number');
    }
  });

  it('un indirizzo o niente: mai un indirizzo verso un file non consegnato', () => {
    /**
     * È il contratto che tiene pulita la console. `musicPath` e `sfxPath`
     * restituiscono null per ciò che non è stato copiato, così il banco non
     * chiede quel file e il browser non registra nessun errore di rete.
     * Un percorso costruito a mano ("audio/" + nome) sarebbe sempre
     * verosimile e sempre richiesto, anche a vuoto.
     */
    for (const role of MUSIC_ROLES) {
      const url = musicPath(role);
      if (url !== null) expect(url, `indirizzo che non porta al file di ${role}`).toContain(MUSIC_FILES[role].replace('.mp3', ''));
    }
    for (const cue of SFX_CUES) {
      const url = sfxPath(cue);
      if (url !== null) expect(url, `indirizzo che non porta al file di ${cue}`).toContain(SFX_FILES[cue].replace('.mp3', ''));
    }
  });

  it('nessun file è usato per due cose diverse', () => {
    const all = [...Object.values(MUSIC_FILES), ...Object.values(SFX_FILES)];
    expect(new Set(all).size, `file ripetuti: ${all.join(', ')}`).toBe(all.length);
  });

  it('i guadagni restano in un intervallo che non satura', () => {
    // Sopra 1 si alza un campione già masterizzato: si può fare, ma va
    // scelto ascoltando. Sopra 2 non è più una correzione di mix.
    for (const [name, trim] of [...Object.entries(MUSIC_TRIM), ...Object.entries(SFX_TRIM)]) {
      expect(trim, `guadagno fuori scala per ${name}`).toBeGreaterThan(0);
      expect(trim, `guadagno fuori scala per ${name}`).toBeLessThanOrEqual(2);
    }
  });
});

describe('le scene non sanno che esistano dei file', () => {
  const SCENES = GAME_FILES.filter((f) => f.startsWith('src/game/scenes/'));

  it('nessuna scena nomina un ruolo che il manifesto non conosce', () => {
    const declared = new Set<string>(MUSIC_ROLES);
    for (const f of SCENES) {
      for (const m of read(f).matchAll(/setMusicRole\(\s*'([a-z]+)'/g)) {
        expect(declared.has(m[1]), `${f} chiede il ruolo inesistente "${m[1]}"`).toBe(true);
      }
    }
  });

  it('nessuna scena chiama il percorso di ripiego direttamente', () => {
    /**
     * `crossfadeToTheme` è il mondo procedurale: è ciò che `setMusicRole`
     * usa quando il campione non c'è. Una scena che lo chiama da sé non
     * suonerà MAI un campione, qualunque file venga consegnato — e la cosa
     * non si vede, perché la musica c'è comunque.
     *
     * Questo controllo è nato da un difetto vero: un `git checkout` durante
     * una prova ha riportato indietro una scena, che è tornata a chiamare
     * `crossfadeToTheme` senza che nulla diventasse rosso.
     */
    const offenders = SCENES.filter((f) => /AudioSystem\.(crossfadeToTheme|playLevelTheme|startDrone)\(/.test(read(f)));
    expect(offenders, `scene che scavalcano i ruoli musicali: ${offenders.join(', ')}`).toEqual([]);
  });

  it('nessuna scena costruisce da sé una sorgente audio', () => {
    // Suonare è compito dell'AudioSystem. Una scena che si crea un
    // BufferSource o un Audio() suo sfugge ai cursori del volume, al muto
    // e all'interruttore degli effetti, e nessuno se ne accorge finché
    // qualcuno non alza il volume in aula.
    const offenders = [...SCENES, ...GAME_FILES.filter((f) => f.startsWith('src/game/ui/'))]
      .filter((f) => /new Audio\(|createBufferSource|createOscillator|new AudioContext/.test(read(f)));
    expect(offenders, `sorgenti audio fuori dall'AudioSystem: ${offenders.join(', ')}`).toEqual([]);
  });
});

describe('ogni gesto sonoro sa cosa fare senza il suo campione', () => {
  const src = read('src/game/systems/AudioSystem.ts');

  it('nessuna voce suona il campione e poi tace se non c\'è', () => {
    /**
     * La forma corretta è `if (this.sample('x')) return;` seguita dalla
     * versione sintetizzata. La forma sbagliata — chiamare `sample` e
     * basta — compila, passa la revisione a occhio e produce un gioco muto
     * su una macchina dove i file non sono arrivati. Qui si verifica che
     * ogni uso di `sample` sia seguito da qualcosa che suona comunque.
     */
    // La `\n` NON va consumata dal letterale: la prima stesura pretendeva
    // una riga fra il `return;` e la chiusura del metodo, quindi su un
    // metodo SVUOTATO — esattamente il difetto cercato — la ricerca non
    // trovava nulla e il controllo restava verde saltando quel caso.
    const uses = [...src.matchAll(/if \(this\.sample\('(\w+)'\)\) return;([\s\S]*?)\n  \}/g)];
    expect(uses.length, 'nessun uso di sample(): la ricerca non sta più trovando niente').toBeGreaterThan(5);
    for (const [, cue, after] of uses) {
      expect(
        /this\.(blip|blipAt|confirm|error|alert)\(/.test(after),
        `il gesto "${cue}" non ha un ripiego sintetizzato: senza il file resta muto`
      ).toBe(true);
    }
  });

  it('il banco non tratta un file mancante come un errore', () => {
    const bank = read('src/game/systems/audioBank.ts');
    // Un 404 previsto scritto in console nasconde i 404 veri.
    expect(bank).not.toMatch(/console\.(error|warn)/);
    expect(bank).toContain('missing.add');
  });
});

describe('autoplay: niente suono prima del primo gesto', () => {
  const src = read('src/game/systems/AudioSystem.ts');

  it('il contesto audio nasce solo dentro init()', () => {
    // `new Ctx()` deve comparire una volta sola, e dentro init: un contesto
    // creato al caricamento del modulo parte sospeso e il browser lo
    // registra come tentativo di autoplay.
    expect([...src.matchAll(/new Ctx\(\)/g)].length).toBe(1);
    const initStart = src.indexOf('init(): void {');
    const initEnd = src.indexOf('\n  }', initStart);
    expect(src.indexOf('new Ctx()')).toBeGreaterThan(initStart);
    expect(src.indexOf('new Ctx()')).toBeLessThan(initEnd);
  });

  it('i campioni si scaricano dentro init(), non al caricamento del modulo', () => {
    const initStart = src.indexOf('init(): void {');
    expect(src.indexOf('AudioBank.load(')).toBeGreaterThan(initStart);
  });

  it('ogni metodo che suona esce se il contesto non c\'è', () => {
    // Senza init() `this.ctx` è null: ogni percorso che suona deve
    // uscire, non sollevare.
    for (const guard of ['if (!this.ctx || !this.sfxGain) return false;', 'if (!this.ctx || !this.master) return;']) {
      expect(src, `manca la guardia: ${guard}`).toContain(guard);
    }
  });

  it('l\'hover non prova a sbloccare l\'audio', () => {
    // Il passaggio del mouse non è un gesto che i browser accettano come
    // sblocco: chiamare init() lì lascia un contesto sospeso e il primo
    // clic vero suonerebbe in ritardo.
    const button = read('src/game/ui/Button.ts');
    const hoverBlock = button.slice(button.indexOf("'pointerover'"), button.indexOf("'pointerout'"));
    // I commenti vanno tolti PRIMA di cercare: la prima stesura di questo
    // controllo diventava rossa per il commento che spiega perché init()
    // non va chiamato lì — cioè puniva la documentazione del difetto
    // invece del difetto.
    const code = hoverBlock.replace(/\/\/[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '');
    expect(code).toContain('AudioSystem.hover()');
    expect(code, "l'hover non deve chiamare AudioSystem.init()").not.toContain('AudioSystem.init()');
  });
});
