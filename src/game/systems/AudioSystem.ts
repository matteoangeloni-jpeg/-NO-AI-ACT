import { StateManager } from './StateManager';

/**
 * Audio interamente procedurale via Web Audio API.
 * Nessun file esterno: tutti i suoni sono sintetizzati (vedi ASSET_REGISTER.md).
 */
class AudioSystemImpl {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private droneNodes: AudioNode[] = [];

  /** Da chiamare dopo il primo gesto utente (policy autoplay dei browser). */
  init(): void {
    if (this.ctx) return;
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    this.ctx = new Ctx();
    this.master = this.ctx.createGain();
    this.master.gain.value = StateManager.audioMuted ? 0 : 0.5;
    this.master.connect(this.ctx.destination);
    StateManager.on('audio-muted-changed', (muted: boolean) => {
      if (this.master && this.ctx) {
        this.master.gain.linearRampToValueAtTime(muted ? 0 : 0.5, this.ctx.currentTime + 0.1);
      }
    });
  }

  toggleMute(): boolean {
    const next = !StateManager.audioMuted;
    StateManager.setAudioMuted(next);
    return next;
  }

  /** Click UI: impulso breve e secco. */
  click(): void {
    this.blip(880, 0.04, 'square', 0.12);
  }

  /** Conferma: due note ascendenti. */
  confirm(): void {
    this.blip(523, 0.07, 'triangle', 0.2);
    this.blipAt(784, 0.09, 'triangle', 0.2, 0.08);
  }

  /** Errore: bicordo dissonante discendente. */
  error(): void {
    this.blip(220, 0.18, 'sawtooth', 0.18);
    this.blipAt(208, 0.22, 'sawtooth', 0.14, 0.02);
  }

  /** Alert istituzionale: tono ribattuto. */
  alert(): void {
    this.blip(660, 0.1, 'square', 0.15);
    this.blipAt(660, 0.1, 'square', 0.15, 0.16);
  }

  /** Sblocco carta norma: arpeggio. */
  unlock(): void {
    [523, 659, 784, 1047].forEach((f, i) => this.blipAt(f, 0.12, 'triangle', 0.18, i * 0.09));
  }

  /** Ticchettio da terminale per il typewriter. */
  terminal(): void {
    this.blip(1200 + Math.random() * 600, 0.012, 'square', 0.03);
  }

  /** Drone ambientale: due oscillatori detunati + LFO, in loop. */
  startDrone(): void {
    if (!this.ctx || !this.master || this.droneNodes.length > 0) return;
    const gain = this.ctx.createGain();
    gain.gain.value = 0.0;
    gain.gain.linearRampToValueAtTime(0.05, this.ctx.currentTime + 3);
    gain.connect(this.master);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 240;
    filter.connect(gain);

    const osc1 = this.ctx.createOscillator();
    osc1.type = 'sawtooth';
    osc1.frequency.value = 55;
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'sawtooth';
    osc2.frequency.value = 55.7;

    const lfo = this.ctx.createOscillator();
    lfo.frequency.value = 0.07;
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 60;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    osc1.connect(filter);
    osc2.connect(filter);
    osc1.start();
    osc2.start();
    lfo.start();
    this.droneNodes = [osc1, osc2, lfo, gain, filter];
  }

  stopDrone(): void {
    if (!this.ctx) return;
    for (const node of this.droneNodes) {
      if (node instanceof OscillatorNode) {
        try {
          node.stop(this.ctx.currentTime + 0.5);
        } catch {
          /* già fermato */
        }
      }
      setTimeout(() => node.disconnect(), 700);
    }
    this.droneNodes = [];
  }

  private blip(freq: number, dur: number, type: OscillatorType, vol: number): void {
    this.blipAt(freq, dur, type, vol, 0);
  }

  private blipAt(freq: number, dur: number, type: OscillatorType, vol: number, delay: number): void {
    if (!this.ctx || !this.master) return;
    const t = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(gain);
    gain.connect(this.master);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }
}

export const AudioSystem = new AudioSystemImpl();
