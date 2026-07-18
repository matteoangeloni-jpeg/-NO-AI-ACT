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
 *  - case_biometria → radar basso, ping in discesa, tensione.
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

export const THEME_BUILDERS: Record<string, ThemeBuilder> = {
  city,
  case_scoring: scoring,
  case_lavoro: lavoro,
  case_media: media,
  case_scuola: scuola,
  case_ospedale: ospedale,
  case_biometria: biometria,
  // credito civico: stesso drone burocratico freddo del social scoring (ufficio welfare)
  case_credito: scoring,
  // Advanced Case Pack (v0.6): riuso dei timbri esistenti, nessun file nuovo
  case_chatbot: media, // sportello automatico: comunicazione/interferenza
  case_procurement: scoring, // ufficio appalti: drone burocratico
  case_edtech: scuola, // campus adattivo: ambiente educativo
  case_gpai: media, // modello generativo: sintetico/glitch
  // 2.0 case pack: riuso dei timbri esistenti, nessun asset nuovo
  case_predpol: biometria, // sorveglianza di quartiere: stesso registro teso
  case_frodi: scoring // ufficio sussidi: drone burocratico freddo
};

export const THEME_IDS = Object.keys(THEME_BUILDERS);

export function buildTheme(ctx: AudioContext, out: AudioNode, themeId: string): ThemeHandle {
  const builder = THEME_BUILDERS[themeId] ?? THEME_BUILDERS.city;
  return builder(ctx, out);
}
