import Phaser from 'phaser';
import { applyOutcome, clampIndicator } from '../data/indicators';
import type { CaseReport, DifficultyMode, IndicatorState, LanguageCode, MissionId, OutcomeQuality, SaveData } from '../data/types';
import { setLanguage } from '../i18n';
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

  get crtOverlay(): boolean {
    return this.data.crtOverlay;
  }

  get language(): LanguageCode {
    return this.data.language;
  }

  get musicVolume(): number {
    return this.data.musicVolume;
  }

  get teacherMode(): boolean {
    return this.data.teacherMode;
  }

  get startedAt(): number | null {
    return this.data.startedAt;
  }

  get caseReports(): Record<string, CaseReport> {
    return { ...this.data.caseReports };
  }

  get difficulty(): DifficultyMode {
    return this.data.difficulty;
  }

  get mission(): MissionId {
    return this.data.mission;
  }

  setDifficulty(value: DifficultyMode): void {
    this.data.difficulty = value;
    this.persist();
  }

  setMission(value: MissionId): void {
    this.data.mission = value;
    this.persist();
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
    this.data.indicators = applyOutcome(this.data.indicators, quality);
    this.data.completedCases[caseId] = quality;
    if (!this.data.unlockedNorms.includes(normId)) {
      this.data.unlockedNorms.push(normId);
    }
    this.persist();
    return this.indicators;
  }

  caseQuality(caseId: string): OutcomeQuality | undefined {
    return this.data.completedCases[caseId];
  }

  /** Archivia il rapporto ispettivo di un caso (per il debrief docente). */
  saveCaseReport(caseId: string, report: CaseReport): void {
    this.data.caseReports[caseId] = report;
    this.persist();
  }

  /** Applica un delta parziale agli indicatori (eventi imprevisti). */
  applyIndicatorDelta(delta: Partial<IndicatorState>): IndicatorState {
    const ind = this.data.indicators;
    this.data.indicators = {
      efficienza: clampIndicator(ind.efficienza + (delta.efficienza ?? 0)),
      controllo: clampIndicator(ind.controllo + (delta.controllo ?? 0)),
      diritti: clampIndicator(ind.diritti + (delta.diritti ?? 0)),
      fiducia: clampIndicator(ind.fiducia + (delta.fiducia ?? 0))
    };
    this.persist();
    return this.indicators;
  }

  setTeacherMode(enabled: boolean): void {
    this.data.teacherMode = enabled;
    this.persist();
  }

  /** Marca l'avvio partita (per il tempo di completamento nel debrief). */
  markStarted(): void {
    if (this.data.startedAt === null) {
      this.data.startedAt = Date.now();
      this.persist();
    }
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
  }

  setCrtOverlay(enabled: boolean): void {
    this.data.crtOverlay = enabled;
    this.persist();
    document.body.classList.toggle('no-crt', !enabled);
  }

  setLanguage(lang: LanguageCode): void {
    this.data.language = lang;
    this.persist();
    setLanguage(lang);
  }

  setMusicVolume(volume: number): void {
    this.data.musicVolume = volume;
    this.persist();
  }

  newGame(): void {
    const prefs = {
      audioMuted: this.data.audioMuted,
      musicVolume: this.data.musicVolume,
      reducedMotion: this.data.reducedMotion,
      crtOverlay: this.data.crtOverlay,
      language: this.data.language,
      teacherMode: this.data.teacherMode,
      difficulty: this.data.difficulty,
      mission: this.data.mission
    };
    this.data = { ...SaveSystem.reset(), ...prefs };
    this.persist();
  }

  applyDomPreferences(): void {
    document.body.classList.toggle('reduced-motion', this.data.reducedMotion);
    document.body.classList.toggle('no-crt', !this.data.crtOverlay);
    setLanguage(this.data.language);
  }

  private persist(): void {
    SaveSystem.save(this.data);
  }
}

export const StateManager = new StateManagerImpl();
