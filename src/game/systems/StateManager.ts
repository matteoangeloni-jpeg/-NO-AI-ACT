import Phaser from 'phaser';
import { applyOutcome } from '../data/indicators';
import type { IndicatorState, OutcomeQuality, SaveData } from '../data/types';
import { SaveSystem } from './SaveSystem';

/**
 * Stato globale di gioco (singleton). Ogni mutazione salva su localStorage
 * ed emette eventi sull'EventEmitter interno.
 */
class StateManagerImpl extends Phaser.Events.EventEmitter {
  private data: SaveData = SaveSystem.load();

  get indicators(): IndicatorState {
    return { ...this.data.indicators };
  }

  get completedCases(): Record<string, OutcomeQuality> {
    return { ...this.data.completedCases };
  }

  get unlockedNorms(): string[] {
    return [...this.data.unlockedNorms];
  }

  get audioMuted(): boolean {
    return this.data.audioMuted;
  }

  get reducedMotion(): boolean {
    return this.data.reducedMotion;
  }

  get endingId(): string | null {
    return this.data.endingId;
  }

  get briefingSeen(): boolean {
    return this.data.briefingSeen;
  }

  completedCount(): number {
    return Object.keys(this.data.completedCases).length;
  }

  isCaseCompleted(caseId: string): boolean {
    return caseId in this.data.completedCases;
  }

  isNormUnlocked(normId: string): boolean {
    return this.data.unlockedNorms.includes(normId);
  }

  /** Registra l'esito di un caso, aggiorna indicatori e sblocca la norma. */
  resolveCase(caseId: string, normId: string, quality: OutcomeQuality): IndicatorState {
    const before = { ...this.data.indicators };
    this.data.indicators = applyOutcome(this.data.indicators, quality);
    this.data.completedCases[caseId] = quality;
    if (!this.data.unlockedNorms.includes(normId)) {
      this.data.unlockedNorms.push(normId);
    }
    this.persist();
    this.emit('indicators-changed', before, this.indicators, quality);
    return this.indicators;
  }

  setEnding(endingId: string): void {
    this.data.endingId = endingId;
    this.persist();
  }

  setBriefingSeen(): void {
    this.data.briefingSeen = true;
    this.persist();
  }

  setAudioMuted(muted: boolean): void {
    this.data.audioMuted = muted;
    this.persist();
    this.emit('audio-muted-changed', muted);
  }

  setReducedMotion(reduced: boolean): void {
    this.data.reducedMotion = reduced;
    this.persist();
    document.body.classList.toggle('reduced-motion', reduced);
    this.emit('reduced-motion-changed', reduced);
  }

  newGame(): void {
    const prefs = { audioMuted: this.data.audioMuted, reducedMotion: this.data.reducedMotion };
    this.data = { ...SaveSystem.reset(), ...prefs };
    this.persist();
    this.emit('game-reset');
  }

  applyDomPreferences(): void {
    document.body.classList.toggle('reduced-motion', this.data.reducedMotion);
  }

  private persist(): void {
    SaveSystem.save(this.data);
  }
}

export const StateManager = new StateManagerImpl();
