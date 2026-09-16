import Phaser from 'phaser';
import { AudioSystem } from '../systems/AudioSystem';
import { COLORS, COLOR_STR, textStyle } from './theme';
import { ActionLayer, type ActionOwner, type ActionSource } from './ActionLayer';

export interface ButtonOptions {
  width?: number;
  height?: number;
  variant?: 'default' | 'danger' | 'ok' | 'ghost';
  fontSize?: number;
  disabled?: boolean;
}

/**
 * Bottone accessibile: area generosa, stati hover/focus visibili,
 * feedback sonoro, etichetta sempre testuale (mai solo colore).
 */
export class Button extends Phaser.GameObjects.Container implements ActionOwner {
  private bg: Phaser.GameObjects.Rectangle;
  private border: Phaser.GameObjects.Rectangle;
  private label: Phaser.GameObjects.Text;
  private opts: Required<ButtonOptions>;
  private enabled: boolean;
  private readonly onClick: () => void;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    text: string,
    onClick: () => void,
    options: ButtonOptions = {}
  ) {
    super(scene, x, y);
    this.opts = {
      width: options.width ?? 280,
      height: options.height ?? 48,
      variant: options.variant ?? 'default',
      fontSize: options.fontSize ?? 16,
      disabled: options.disabled ?? false
    };
    this.enabled = !this.opts.disabled;
    this.onClick = onClick;

    const { width, height } = this.opts;
    this.bg = scene.add.rectangle(0, 0, width, height, this.fillColor(), 1);
    this.border = scene.add.rectangle(0, 0, width, height).setStrokeStyle(1, this.strokeColor());
    this.label = scene.add
      .text(0, 0, text, textStyle(this.opts.fontSize, this.textColor()))
      .setOrigin(0.5);

    this.add([this.bg, this.border, this.label]);
    this.setSize(width, height);
    scene.add.existing(this);

    this.applyEnabled();

    /**
     * Ogni pulsante disegnato espone anche un pulsante vero del documento:
     * stessa azione, raggiungibile col TAB e annunciata da uno screen
     * reader. Si registra qui e si cancella da solo alla distruzione, così
     * nessuna scena deve ricordarsene.
     */
    ActionLayer.register(this.action, this);
    this.once(Phaser.GameObjects.Events.DESTROY, () => ActionLayer.unregister(this.action));

    /**
     * Contrassegno sul lato DISEGNATO. Serve al controllo automatico: se
     * chiedesse allo strato delle azioni quali pulsanti esistono, un
     * pulsante che non si registra sparirebbe da entrambi i lati e il
     * controllo resterebbe verde. Enumerando i contenitori contrassegnati
     * nella scena, invece, la mancata registrazione si vede.
     */
    this.setData('uiButton', true);
  }

  /**
   * Faccia del pulsante verso lo strato delle azioni: sola lettura dello
   * stato, più l'azione. Lo strato non conosce Phaser e non tocca la scena.
   */
  private readonly action: ActionSource = {
    scene: this.scene,
    worldBounds: () => (this.active && this.scene ? this.getBounds() : null),
    activate: () => {
      AudioSystem.init();
      AudioSystem.click();
      this.onClick();
    },
    label: '',
    isVisible: false,
    isEnabled: false,
    depth: 0
  };

  /**
   * Aggiorna la faccia esposta allo strato delle azioni. Chiamato dallo
   * strato stesso prima di leggerla: tenerla sincronizzata a ogni cambio di
   * stato vorrebbe dire ricordarsene in cinque punti diversi, ed è
   * esattamente il genere di cosa che si dimentica.
   */
  refreshAction(): void {
    this.action.label = this.label.text;
    this.action.isVisible = this.active && this.visibleInTree();
    this.action.isEnabled = this.enabled;
    this.action.depth = this.effectiveDepth();
  }

  /**
   * Visibile DAVVERO: un pulsante dentro un contenitore nascosto non si vede,
   * per quanto il pulsante si dichiari visibile. Senza questo controllo il
   * TAB raggiungerebbe voci che nessuno ha davanti.
   */
  private visibleInTree(): boolean {
    if (!this.visible) return false;
    let node: Phaser.GameObjects.Container | null = this.parentContainer;
    while (node) {
      if (!node.visible) return false;
      node = node.parentContainer;
    }
    return true;
  }

  /**
   * Profondità efficace: la massima fra il pulsante e i contenitori che lo
   * contengono. È così che lo strato riconosce che cosa sta sopra un pannello
   * modale senza che nessuno glielo dichiari.
   */
  private effectiveDepth(): number {
    let best = this.depth;
    let node: Phaser.GameObjects.Container | null = this.parentContainer;
    while (node) {
      if (node.depth > best) best = node.depth;
      node = node.parentContainer;
    }
    return best;
  }

  /**
   * Accende o spegne il bottone dopo la costruzione. Serve dove la
   * disponibilità di un'azione dipende da una scelta fatta nella stessa
   * schermata — il ripasso quando non c'è niente da ripassare, per esempio.
   * Un bottone spento non è solo più pallido: smette di reagire al
   * puntatore, altrimenti sembrerebbe rotto invece che non disponibile.
   */
  setEnabled(value: boolean): void {
    if (this.enabled === value) return;
    this.enabled = value;
    this.applyEnabled();
  }

  private applyEnabled(): void {
    if (this.enabled) {
      this.setAlpha(1);
      this.setInteractive({ useHandCursor: true })
        .on('pointerover', () => {
          this.setHover(true);
          // Nessun AudioSystem.init() qui: passare il mouse sopra un
          // pulsante NON è il gesto che sblocca l'audio secondo i browser,
          // e provarci lascerebbe un contesto sospeso invece di suonare.
          // Finché non c'è stato un clic o un tasto, l'hover è muto.
          AudioSystem.hover();
        })
        .on('pointerout', () => this.setHover(false))
        .on('pointerdown', () => {
          AudioSystem.init();
          AudioSystem.click();
          this.onClick();
        });
    } else {
      // Solo gli ascoltatori del puntatore, uno per uno. `removeAllListeners`
      // toglieva anche quello di DESTROY, che è ciò che cancella il pulsante
      // dal documento: spegnere un pulsante e poi chiudere il pannello ne
      // lasciava uno fantasma nello strato delle azioni per sempre.
      this.off('pointerover');
      this.off('pointerout');
      this.off('pointerdown');
      this.disableInteractive();
      this.setHoverVisual(false);
      this.setAlpha(0.45);
    }
  }

  /**
   * Cambia la larghezza a bottone già costruito, sfondo, bordo e area
   * sensibile insieme. Scalare il contenitore invece deformerebbe anche
   * l'etichetta.
   */
  setButtonWidth(width: number): void {
    this.opts.width = width;
    this.bg.setSize(width, this.opts.height);
    this.border.setSize(width, this.opts.height);
    this.setSize(width, this.opts.height);
    if (this.enabled) this.setInteractive({ useHandCursor: true });
  }

  /** Etichetta corrente, per chi deve annunciarla o verificarla. */
  get labelText(): string {
    return this.label.text;
  }

  setHover(hover: boolean): void {
    if (!this.enabled) return;
    this.setHoverVisual(hover);
  }

  private setHoverVisual(hover: boolean): void {
    this.bg.setFillStyle(hover ? this.hoverColor() : this.fillColor());
    this.border.setStrokeStyle(hover ? 2 : 1, hover ? COLORS.accent : this.strokeColor());
    this.label.setColor(hover ? COLOR_STR.paper : this.textColor());
  }

  setLabel(text: string): void {
    this.label.setText(text);
  }

  private fillColor(): number {
    switch (this.opts.variant) {
      case 'danger': return 0x2a1014;
      case 'ok': return 0x0f2418;
      case 'ghost': return COLORS.carbon;
      default: return COLORS.night2;
    }
  }

  private hoverColor(): number {
    switch (this.opts.variant) {
      case 'danger': return 0x3d181e;
      case 'ok': return 0x163524;
      case 'ghost': return COLORS.night2;
      default: return 0x1a2a4a;
    }
  }

  private strokeColor(): number {
    switch (this.opts.variant) {
      case 'danger': return COLORS.alert;
      case 'ok': return COLORS.ok;
      default: return COLORS.iron;
    }
  }

  private textColor(): string {
    switch (this.opts.variant) {
      case 'danger': return COLOR_STR.alertText;
      case 'ok': return COLOR_STR.ok;
      case 'ghost': return COLOR_STR.paperDim;
      default: return COLOR_STR.paper;
    }
  }
}
