/**
 * Temi musicali procedurali per livello — solo Web Audio API, nessun file.
 * Modulo puro (nessuna dipendenza da Phaser o dallo stato di gioco):
 * i builder ricevono il contesto e il nodo di uscita e restituiscono un
 * handle con il gain del tema (per i crossfade) e una dispose() completa.
 *
 * Tavolozza sonora per caso:
 *  - city           → drone urbano di base (mappa civica);
 *  - case_scoring   → drone burocratico freddo, ronzio da ufficio vuoto;
 *  - case_lavoro    → pulse meccanico da screening automatico;
 *  - case_media     → glitch radio, banda che scivola, interferenze;
 *  - case_scuola    → ambiente clinico: sinusoidi pure in battimento;
 *  - case_ospedale  → battito lento (lub-dub) e segnali medicali astratti;
 *  - case_biometria → radar basso, ping in discesa, tensione;
 *  - case_credito   → conteggio: una scaletta che sale e ricade;
 *  - case_chatbot   → musica d'attesa e tick del numero di coda;
 *  - case_procurement → carta e timbri: colpo secco a tempo d'ufficio;
 *  - case_edtech    → arpeggio che si riadatta, con una nota fuori;
 *  - case_gpai      → sei voci scordate che convergono e si riaprono;
 *  - case_predpol   → sirena lontana e tick della griglia;
 *  - case_frodi     → scansione che passa, ripassa e ogni tanto aggancia.
 */

export interface ThemeHandle {
  /** Gain principale del tema: l'AudioSystem lo usa per fade/crossfade. */
  gain: GainNode;
  /** Ferma oscillatori e timer e scollega tutti i nodi. */
  dispose(): void;
}

type ThemeBuilder = (ctx: AudioContext, out: AudioNode) => ThemeHandle;

/** Buffer di rumore bianco riutilizzabile (2 secondi). */
function noiseBuffer(ctx: AudioContext): AudioBuffer {
  const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buffer;
}

interface ThemeParts {
  nodes: AudioNode[];
  oscillators: OscillatorNode[];
  sources: AudioBufferSourceNode[];
  timers: ReturnType<typeof setInterval>[];
}

function makeHandle(ctx: AudioContext, out: AudioNode, build: (gain: GainNode, parts: ThemeParts) => void): ThemeHandle {
  const gain = ctx.createGain();
  gain.gain.value = 0; // l'AudioSystem fa il fade-in
  gain.connect(out);
  const parts: ThemeParts = { nodes: [gain], oscillators: [], sources: [], timers: [] };
  build(gain, parts);
  return {
    gain,
    dispose() {
      parts.timers.forEach((t) => clearInterval(t));
      const stopAt = ctx.currentTime + 0.05;
      [...parts.oscillators, ...parts.sources].forEach((n) => {
        try {
          n.stop(stopAt);
        } catch {
          /* già fermato */
        }
      });
      setTimeout(() => parts.nodes.forEach((n) => n.disconnect()), 200);
    }
  };
}

function osc(ctx: AudioContext, parts: ThemeParts, type: OscillatorType, freq: number): OscillatorNode {
  const o = ctx.createOscillator();
  o.type = type;
  o.frequency.value = freq;
  o.start();
  parts.oscillators.push(o);
  parts.nodes.push(o);
  return o;
}

function gainNode(ctx: AudioContext, parts: ThemeParts, value: number): GainNode {
  const g = ctx.createGain();
  g.gain.value = value;
  parts.nodes.push(g);
  return g;
}

function filter(ctx: AudioContext, parts: ThemeParts, type: BiquadFilterType, freq: number, q = 1): BiquadFilterNode {
  const f = ctx.createBiquadFilter();
  f.type = type;
  f.frequency.value = freq;
  f.Q.value = q;
  parts.nodes.push(f);
  return f;
}

/** Blip una tantum dentro un tema (per ping, tick, segnali). */
function blip(ctx: AudioContext, dest: AudioNode, type: OscillatorType, freq: number, dur: number, vol: number, slideTo?: number): void {
  const t = ctx.currentTime;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g);
  g.connect(dest);
  o.start(t);
  o.stop(t + dur + 0.05);
  setTimeout(() => {
    o.disconnect();
    g.disconnect();
  }, (dur + 0.2) * 1000);
}

const city: ThemeBuilder = (ctx, out) =>
  makeHandle(ctx, out, (gain, parts) => {
    const lp = filter(ctx, parts, 'lowpass', 240);
    lp.connect(gain);
    osc(ctx, parts, 'sawtooth', 55).connect(lp);
    osc(ctx, parts, 'sawtooth', 55.7).connect(lp);
    const lfo = osc(ctx, parts, 'sine', 0.07);
    const lfoGain = gainNode(ctx, parts, 60);
    lfo.connect(lfoGain);
    lfoGain.connect(lp.frequency);
  });

const scoring: ThemeBuilder = (ctx, out) =>
  makeHandle(ctx, out, (gain, parts) => {
    // ufficio vuoto: drone basso freddo + ronzio "neon" intermittente
    const lp = filter(ctx, parts, 'lowpass', 180);
    lp.connect(gain);
    osc(ctx, parts, 'sawtooth', 49).connect(lp);
    osc(ctx, parts, 'sawtooth', 49.4).connect(lp);
    const hum = gainNode(ctx, parts, 0.05);
    hum.connect(gain);
    osc(ctx, parts, 'sine', 100).connect(hum);
    parts.timers.push(setInterval(() => blip(ctx, gain, 'sine', 1567, 0.25, 0.05), 4200));
  });

const lavoro: ThemeBuilder = (ctx, out) =>
  makeHandle(ctx, out, (gain, parts) => {
    // nastro di screening: pulse quadro a 2 Hz su portante 110 Hz + sub
    const pulse = gainNode(ctx, parts, 0);
    pulse.connect(gain);
    const carrier = filter(ctx, parts, 'lowpass', 600);
    carrier.connect(pulse);
    osc(ctx, parts, 'square', 110).connect(carrier);
    const lfo = osc(ctx, parts, 'square', 2);
    const lfoDepth = gainNode(ctx, parts, 0.06);
    lfo.connect(lfoDepth);
    lfoDepth.connect(pulse.gain);
    const sub = gainNode(ctx, parts, 0.1);
    sub.connect(gain);
    osc(ctx, parts, 'sine', 55).connect(sub);
    // "timbro respinto" ogni 6 secondi
    parts.timers.push(setInterval(() => blip(ctx, gain, 'square', 220, 0.12, 0.06, 180), 6000));
  });

const media: ThemeBuilder = (ctx, out) =>
  makeHandle(ctx, out, (gain, parts) => {
    // interferenza radio: rumore in banda passante che scivola
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(ctx);
    src.loop = true;
    src.start();
    parts.sources.push(src);
    parts.nodes.push(src);
    const bp = filter(ctx, parts, 'bandpass', 800, 8);
    const noiseGain = gainNode(ctx, parts, 0.18);
    src.connect(bp);
    bp.connect(noiseGain);
    noiseGain.connect(gain);
    const sweep = osc(ctx, parts, 'sine', 0.13);
    const sweepDepth = gainNode(ctx, parts, 550);
    sweep.connect(sweepDepth);
    sweepDepth.connect(bp.frequency);
    // portante fantasma in battimento
    const carrier = gainNode(ctx, parts, 0.03);
    carrier.connect(gain);
    osc(ctx, parts, 'sine', 220).connect(carrier);
    osc(ctx, parts, 'sine', 221.5).connect(carrier);
    // glitch saltuario
    parts.timers.push(setInterval(() => blip(ctx, gain, 'sawtooth', 2200, 0.06, 0.05, 600), 3500));
  });

const scuola: ThemeBuilder = (ctx, out) =>
  makeHandle(ctx, out, (gain, parts) => {
    // ambiente clinico: due sinusoidi pure in battimento lento + pedale basso
    const high = gainNode(ctx, parts, 0.04);
    high.connect(gain);
    osc(ctx, parts, 'sine', 880).connect(high);
    osc(ctx, parts, 'sine', 881.2).connect(high);
    const pedal = gainNode(ctx, parts, 0.08);
    pedal.connect(gain);
    osc(ctx, parts, 'sine', 110).connect(pedal);
    // "campanella di sistema" rara, fredda
    parts.timers.push(setInterval(() => blip(ctx, gain, 'triangle', 1318, 0.4, 0.04), 9000));
  });

const ospedale: ThemeBuilder = (ctx, out) =>
  makeHandle(ctx, out, (gain, parts) => {
    // battito lento: doppio impulso (lub-dub) ogni 1.7 s + monitor astratto
    const heartOut = gainNode(ctx, parts, 1);
    heartOut.connect(gain);
    parts.timers.push(
      setInterval(() => {
        blip(ctx, heartOut, 'sine', 55, 0.18, 0.22);
        setTimeout(() => blip(ctx, heartOut, 'sine', 48, 0.16, 0.16), 220);
      }, 1700)
    );
    const air = filter(ctx, parts, 'lowpass', 300);
    const airGain = gainNode(ctx, parts, 0.05);
    air.connect(airGain);
    airGain.connect(gain);
    osc(ctx, parts, 'triangle', 65).connect(air);
    // segnale del monitor, distante
    parts.timers.push(setInterval(() => blip(ctx, gain, 'sine', 988, 0.09, 0.035), 5100));
  });

const biometria: ThemeBuilder = (ctx, out) =>
  makeHandle(ctx, out, (gain, parts) => {
    // radar: drone teso + ping in discesa ogni 2.6 s
    const lp = filter(ctx, parts, 'lowpass', 200);
    lp.connect(gain);
    osc(ctx, parts, 'triangle', 65).connect(lp);
    osc(ctx, parts, 'sawtooth', 65.8).connect(lp);
    const tension = gainNode(ctx, parts, 0.025);
    tension.connect(gain);
    osc(ctx, parts, 'sine', 523).connect(tension);
    osc(ctx, parts, 'sine', 524.7).connect(tension);
    parts.timers.push(setInterval(() => blip(ctx, gain, 'sine', 1400, 0.5, 0.06, 700), 2600));
  });


const credito: ThemeBuilder = (ctx, out) =>
  makeHandle(ctx, out, (gain, parts) => {
    // Credito civico: il suono di un conteggio. Un pedale basso e una coppia
    // di tick che salgono e ricadono, come una cifra che viene ricalcolata e
    // non torna mai al punto di partenza.
    const lp = filter(ctx, parts, 'lowpass', 160);
    lp.connect(gain);
    osc(ctx, parts, 'sawtooth', 43.7).connect(lp);
    const pedal = gainNode(ctx, parts, 0.06);
    pedal.connect(gain);
    osc(ctx, parts, 'sine', 87.3).connect(pedal);

    // scaletta di quattro gradini: sale tre volte, scende di più
    const steps = [392, 440, 494, 330];
    let i = 0;
    parts.timers.push(
      setInterval(() => {
        blip(ctx, gain, 'triangle', steps[i % steps.length], 0.16, 0.045);
        i += 1;
      }, 1150)
    );
  });

const chatbot: ThemeBuilder = (ctx, out) =>
  makeHandle(ctx, out, (gain, parts) => {
    // Sportello automatico: musica d'attesa che non arriva mai da nessuna
    // parte. Due note educate in loop, e il tick del numero di coda.
    const bed = filter(ctx, parts, 'lowpass', 500);
    bed.connect(gain);
    const bedGain = gainNode(ctx, parts, 0.05);
    bed.connect(bedGain);
    bedGain.connect(gain);
    osc(ctx, parts, 'triangle', 131).connect(bed);

    const phrase = [523, 392];
    let i = 0;
    parts.timers.push(
      setInterval(() => {
        blip(ctx, gain, 'sine', phrase[i % phrase.length], 0.45, 0.05);
        i += 1;
      }, 1800)
    );
    // cambio del numero servito: due colpi asciutti, sempre uguali
    parts.timers.push(
      setInterval(() => {
        blip(ctx, gain, 'square', 880, 0.05, 0.04);
        setTimeout(() => blip(ctx, gain, 'square', 660, 0.05, 0.04), 140);
      }, 7300)
    );
  });

const procurement: ThemeBuilder = (ctx, out) =>
  makeHandle(ctx, out, (gain, parts) => {
    // Ufficio appalti: carta e timbri. Un colpo secco a tempo d'ufficio,
    // fatto di rumore filtrato, su un drone che non si muove mai.
    const lp = filter(ctx, parts, 'lowpass', 140);
    lp.connect(gain);
    osc(ctx, parts, 'sawtooth', 58).connect(lp);
    osc(ctx, parts, 'sawtooth', 58.3).connect(lp);

    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(ctx);
    src.loop = true;
    src.start();
    parts.sources.push(src);
    parts.nodes.push(src);
    const stampBand = filter(ctx, parts, 'bandpass', 1200, 2);
    const stampGate = gainNode(ctx, parts, 0);
    src.connect(stampBand);
    stampBand.connect(stampGate);
    stampGate.connect(gain);

    // il timbro: apre e chiude il gate in 60 ms
    parts.timers.push(
      setInterval(() => {
        const t = ctx.currentTime;
        stampGate.gain.cancelScheduledValues(t);
        stampGate.gain.setValueAtTime(0.16, t);
        stampGate.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
      }, 2400)
    );
  });

const edtech: ThemeBuilder = (ctx, out) =>
  makeHandle(ctx, out, (gain, parts) => {
    // Campus adattivo: un arpeggio che si riadatta di continuo, gentile e un
    // grado troppo allegro, con una nota che ogni tanto cade fuori — la
    // piattaforma che corregge il percorso di qualcuno.
    const pad = gainNode(ctx, parts, 0.045);
    pad.connect(gain);
    osc(ctx, parts, 'sine', 196).connect(pad);
    osc(ctx, parts, 'sine', 293.7).connect(pad);

    const scale = [523, 587, 659, 784, 880];
    let i = 0;
    parts.timers.push(
      setInterval(() => {
        // una volta su cinque la piattaforma "riadatta": semitono sotto
        const wrong = i % 5 === 4;
        const f = scale[i % scale.length] * (wrong ? 0.944 : 1);
        blip(ctx, gain, 'triangle', f, 0.22, wrong ? 0.05 : 0.035);
        i += 1;
      }, 620)
    );
  });

const gpai: ThemeBuilder = (ctx, out) =>
  makeHandle(ctx, out, (gain, parts) => {
    // Modello generale: il suono di una media. Sei voci scordate che
    // convergono lentamente verso la stessa nota e poi si riaprono, senza
    // che nessuna sia quella giusta.
    const bus = filter(ctx, parts, 'lowpass', 1400);
    const busGain = gainNode(ctx, parts, 0.04);
    bus.connect(busGain);
    busGain.connect(gain);

    const base = 174.6;
    const spread = [-7.5, -4.1, -1.3, 1.9, 4.6, 8.2];
    for (const cents of spread) {
      const voice = osc(ctx, parts, 'sawtooth', base * Math.pow(2, cents / 1200));
      voice.connect(bus);
      // ogni voce respira a velocità diversa: la convergenza non è mai netta
      const drift = osc(ctx, parts, 'sine', 0.02 + Math.abs(cents) / 900);
      const driftDepth = gainNode(ctx, parts, Math.abs(cents) / 12);
      drift.connect(driftDepth);
      driftDepth.connect(voice.frequency);
    }

    // il campionamento: un fruscio corto, irregolare
    parts.timers.push(setInterval(() => blip(ctx, gain, 'sawtooth', 3100, 0.04, 0.03, 1200), 4700));
  });

const predpol: ThemeBuilder = (ctx, out) =>
  makeHandle(ctx, out, (gain, parts) => {
    // Quartiere sorvegliato: una sirena lontanissima, filtrata quasi via, e
    // il tick della griglia che ricalcola dove mandare la pattuglia.
    const lp = filter(ctx, parts, 'lowpass', 190);
    lp.connect(gain);
    osc(ctx, parts, 'triangle', 61.7).connect(lp);

    // due toni che si alternano piano: la sirena a distanza di isolati
    const sirenBand = filter(ctx, parts, 'lowpass', 420, 4);
    const sirenGain = gainNode(ctx, parts, 0.03);
    sirenBand.connect(sirenGain);
    sirenGain.connect(gain);
    const siren = osc(ctx, parts, 'sine', 370);
    siren.connect(sirenBand);
    const sweep = osc(ctx, parts, 'square', 0.22);
    const sweepDepth = gainNode(ctx, parts, 55);
    sweep.connect(sweepDepth);
    sweepDepth.connect(siren.frequency);

    // ricalcolo della griglia: tre tick ravvicinati, poi silenzio
    parts.timers.push(
      setInterval(() => {
        for (let k = 0; k < 3; k++) {
          setTimeout(() => blip(ctx, gain, 'square', 1046, 0.035, 0.03), k * 130);
        }
      }, 5600)
    );
  });


const frodi: ThemeBuilder = (ctx, out) =>
  makeHandle(ctx, out, (gain, parts) => {
    // Ufficio antifrode: qualcosa che cerca. Una scansione che passa e
    // ripassa sulla stessa banda, e ogni tanto si ferma su un punto — il
    // falso positivo che costa una settimana a qualcuno.
    const lp = filter(ctx, parts, 'lowpass', 150);
    lp.connect(gain);
    osc(ctx, parts, 'sawtooth', 51.9).connect(lp);

    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(ctx);
    src.loop = true;
    src.start();
    parts.sources.push(src);
    parts.nodes.push(src);
    const scan = filter(ctx, parts, 'bandpass', 900, 14);
    const scanGain = gainNode(ctx, parts, 0.1);
    src.connect(scan);
    scan.connect(scanGain);
    scanGain.connect(gain);
    // la scansione va avanti e indietro, lenta e regolare
    const sweep = osc(ctx, parts, 'triangle', 0.09);
    const sweepDepth = gainNode(ctx, parts, 700);
    sweep.connect(sweepDepth);
    sweepDepth.connect(scan.frequency);

    // l'aggancio: un tono che resta un istante di troppo
    parts.timers.push(setInterval(() => blip(ctx, gain, 'sine', 740, 0.55, 0.05), 8100));
  });

/**
 * Un timbro per fascicolo. Sei casi ne prendevano in prestito uno di un
 * altro — l'ufficio appalti suonava identico al punteggio sui sussidi, la
 * polizia predittiva identica alla biometria — e chi giocava due casi di
 * fila sentiva la stessa stanza. Ora ciascuno ha il suo, e un test impedisce
 * che un caso nuovo nasca in prestito.
 */
export const THEME_BUILDERS: Record<string, ThemeBuilder> = {
  city,
  case_scoring: scoring,
  case_lavoro: lavoro,
  case_media: media,
  case_scuola: scuola,
  case_ospedale: ospedale,
  case_biometria: biometria,
  case_credito: credito,
  case_chatbot: chatbot,
  case_procurement: procurement,
  case_edtech: edtech,
  case_gpai: gpai,
  case_predpol: predpol,
  case_frodi: frodi
};

export const THEME_IDS = Object.keys(THEME_BUILDERS);

/**
 * LIVELLAMENTO.
 *
 * Ogni tema è nato per conto suo, con i guadagni scelti a orecchio mentre lo
 * si scriveva, e i livelli erano finiti a trenta volte di distanza: il letto
 * sonoro dell'ospedale stava a 0,013 di RMS e quello della biometria a 0,359.
 * Passare da un fascicolo all'altro voleva dire una botta di volume, e la
 * mappa civica arrivava a 0,967 di picco — il tre per cento dal distorcere,
 * con la musica al massimo.
 *
 * Questi fattori NON sono stimati: vengono dalle misure dello smoke audio,
 * che rende ogni tema con la catena di guadagni vera del gioco. Servono a
 * portare tutti i letti dentro la stessa fascia senza toccare l'equilibrio
 * interno di nessun tema — un tema resta com'era, solo più vicino agli altri.
 *
 * Gli eventi a tempo (tick, ping, timbri) usano setInterval e quindi NON
 * compaiono in un rendering offline: il fattore vale sul letto continuo, che
 * è ciò che si sente per la maggior parte del tempo.
 */
const THEME_TRIM: Record<string, number> = {
  city: 0.55,
  case_scoring: 0.55,
  case_lavoro: 1.5,
  case_media: 3.5,
  case_scuola: 1.8,
  case_ospedale: 4,
  case_biometria: 0.5,
  case_credito: 0.75,
  case_chatbot: 0.6,
  case_procurement: 0.55,
  case_edtech: 2.7,
  case_gpai: 3,
  case_predpol: 0.6,
  case_frodi: 0.75
};

export function buildTheme(ctx: AudioContext, out: AudioNode, themeId: string): ThemeHandle {
  const builder = THEME_BUILDERS[themeId] ?? THEME_BUILDERS.city;
  // Il trim sta FRA il tema e l'uscita: l'AudioSystem continua a fare i
  // suoi fade su handle.gain senza sapere che esiste.
  const trim = ctx.createGain();
  trim.gain.value = THEME_TRIM[themeId] ?? 1;
  trim.connect(out);
  const handle = builder(ctx, trim);
  return {
    gain: handle.gain,
    dispose() {
      handle.dispose();
      setTimeout(() => trim.disconnect(), 250);
    }
  };
}
