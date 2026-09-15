import Phaser from 'phaser';
import { applyOutcome, clampIndicator } from '../data/indicators';
import type { AudienceId, CaseMeta, CaseReport, DifficultyMode, GameModeId, IndicatorState, LanguageCode, MissionId, OutcomeQuality, SaveData, SelfCheckPhase, SelfCheckResult, SessionMinutes } from '../data/types';
import { planSession, type SessionPlan } from '../data/audiences';
import { planGame, type GamePlan } from '../data/gameModes';
import { DRAFT_SCHEMA, emptyDraft, hasProgress, isResumable, type CaseDraft } from './caseDraft';
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

  get audience(): AudienceId {
    return this.data.audience;
  }

  get sessionMinutes(): SessionMinutes {
    return this.data.sessionMinutes;
  }

  /** Piano corrente: casi proposti e difficoltà, derivati da pubblico e durata. */
  get sessionPlan(): SessionPlan {
    return planSession(this.data.audience, this.data.sessionMinutes);
  }

  get gameMode(): GameModeId {
    return this.data.gameMode;
  }

  /**
   * Seme dell'ispezione a sorpresa. Vive in memoria e non nel salvataggio:
   * una sorpresa che sopravvive alla chiusura del browser non è una
   * sorpresa. Si rinnova a ogni NUOVA PARTITA.
   */
  private surpriseSeed = (Date.now() & 0x7fffffff) || 1;

  rerollSurprise(): void {
    this.surpriseSeed = (this.surpriseSeed * 48271) % 0x7fffffff || 1;
  }

  /**
   * Piano della modalità corrente: è questo — non più il solo pubblico — a
   * dire quali fascicoli arrivano, in che ordine e con che difficoltà.
   */
  get gamePlan(): GamePlan {
    return planGame({
      mode: this.data.gameMode,
      audience: this.data.audience,
      minutes: this.data.sessionMinutes,
      completed: this.data.completedCases,
      seed: this.surpriseSeed
    });
  }

  /**
   * Prossimo fascicolo del piano non ancora chiuso, o null.
   *
   * È ciò che rende una modalità in sequenza diversa dalla mappa aperta:
   * senza, dopo ogni caso si tornava comunque in città e "turno di
   * servizio" sarebbe stata una parola sulla scatola.
   */
  nextInPlan(): string | null {
    const plan = this.gamePlan;
    if (plan.freeMap) return null;
    return plan.caseIds.find((id) => !(id in this.data.completedCases)) ?? null;
  }

  setGameMode(value: GameModeId): void {
    this.data.gameMode = value;
    this.data.difficulty = this.gamePlan.difficulty;
    this.persist();
  }

  /**
   * Cambiare pubblico o durata allinea anche la difficoltà proposta. Non
   * tocca i casi già completati né i rapporti archiviati: il percorso dice
   * che cosa viene consigliato d'ora in poi, non riscrive ciò che è stato
   * giocato.
   */
  setAudience(value: AudienceId): void {
    this.data.audience = value;
    this.data.difficulty = this.gamePlan.difficulty;
    this.persist();
  }

  setSessionMinutes(value: SessionMinutes): void {
    this.data.sessionMinutes = value;
    this.data.difficulty = this.gamePlan.difficulty;
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
    // Firmare chiude il fascicolo: la bozza sparisce qui e non nella scena,
    // così non esiste un percorso che archivia un rapporto lasciandosi
    // dietro una bozza dello stesso caso.
    delete this.data.caseDrafts[caseId];
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

  get caseMeta(): Record<string, CaseMeta> {
    return { ...this.data.caseMeta };
  }

  caseMetaFor(caseId: string): CaseMeta {
    return { ...(this.data.caseMeta[caseId] ?? {}) };
  }

  /**
   * Annotazioni metacognitive locali (2.0): fiducia dichiarata e riflessione.
   * Facoltative, solo localStorage, MAI usate nel calcolo del punteggio.
   */
  /** Bozza riprendibile di un fascicolo, o null se non ce n'è una utile. */
  draftFor(caseId: string): CaseDraft | null {
    const d = this.data.caseDrafts[caseId];
    if (!d || !isResumable(d, Object.keys(this.data.completedCases))) return null;
    return hasProgress(d) ? d : null;
  }

  /** Tutte le bozze riprendibili, dalla più recente. */
  resumableDrafts(): CaseDraft[] {
    return Object.values(this.data.caseDrafts)
      .filter((d) => isResumable(d, Object.keys(this.data.completedCases)) && hasProgress(d))
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }

  /**
   * Aggiorna la bozza di un fascicolo. Non scrive nulla se il caso è già
   * chiuso: un rapporto firmato non torna indietro a essere una bozza.
   */
  saveDraft(caseId: string, patch: Partial<Omit<CaseDraft, 'schema' | 'caseId'>>): void {
    if (caseId in this.data.completedCases) return;
    const base = this.data.caseDrafts[caseId] ?? emptyDraft(caseId, Date.now());
    this.data.caseDrafts[caseId] = { ...base, ...patch, schema: DRAFT_SCHEMA, caseId, updatedAt: Date.now() };
    this.persist();
  }

  /** Abbandona la bozza di un fascicolo, senza toccare i casi già chiusi. */
  clearDraft(caseId: string): void {
    if (!(caseId in this.data.caseDrafts)) return;
    delete this.data.caseDrafts[caseId];
    this.persist();
  }

  saveCaseMeta(caseId: string, meta: Partial<CaseMeta>): void {
    this.data.caseMeta[caseId] = { ...this.data.caseMeta[caseId], ...meta };
    this.persist();
  }

  get selfCheck(): { pre: SelfCheckResult | null; post: SelfCheckResult | null } {
    return { pre: this.data.selfCheck.pre, post: this.data.selfCheck.post };
  }

  /** Registra un autocontrollo locale facoltativo (formativo, cancellabile col reset). */
  recordSelfCheck(phase: SelfCheckPhase, result: SelfCheckResult): void {
    this.data.selfCheck = { ...this.data.selfCheck, [phase]: result };
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
      mission: this.data.mission,
      // pubblico e durata sono preferenze come le altre: una partita nuova
      // non deve dimenticare per chi stai giocando e quanto tempo hai
      audience: this.data.audience,
      sessionMinutes: this.data.sessionMinutes
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
