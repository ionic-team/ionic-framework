
class GestureController {

  private gestureId = 0;
  private requestedStart = new Map<number, number>();
  private disabledGestures = new Map<string, Set<number>>();
  private disabledScroll = new Set<number>();
  private capturedId?: number;

  /**
   * Creates a gesture delegate based on the GestureConfig passed
   */
  createGesture(config: GestureConfig): GestureDelegate {
    return new GestureDelegate(
      this,
      this.newID(),
      config.name,
      config.priority || 0,
      !!config.disableScroll
    );
  }

  /**
   * Creates a blocker that will block any other gesture events from firing. Set in the ion-gesture component.
   */
  createBlocker(opts: BlockerConfig = {}): BlockerDelegate {
    return new BlockerDelegate(
      this,
      this.newID(),
      opts.disable,
      !!opts.disableScroll
    );
  }

  start(gestureName: string, id: number, priority: number): boolean {
    if (!this.canStart(gestureName)) {
      this.requestedStart.delete(id);
      return false;
    }
    this.requestedStart.set(id, priority);
    return true;
  }

  capture(gestureName: string, id: number, priority: number): boolean {
    if (!this.start(gestureName, id, priority)) {
      return false;
    }
    const requestedStart = this.requestedStart;
    let maxPriority = -10000;

    requestedStart.forEach(value => {
      maxPriority = Math.max(maxPriority, value);
    });

    if (maxPriority === priority) {
      this.capturedId = id;
      requestedStart.clear();

      const event = new CustomEvent('ionGestureCaptured', { detail: { gestureName } });
      document.dispatchEvent(event);
      return true;
    }
    requestedStart.delete(id);

    return false;
  }

  release(id: number) {
    this.requestedStart.delete(id);

    if (this.capturedId === id) {
      this.capturedId = undefined;
    }
  }

  disableGesture(gestureName: string, id: number) {
    let set = this.disabledGestures.get(gestureName);
    if (set === undefined) {
      set = new Set<number>();
      this.disabledGestures.set(gestureName, set);
    }
    set.add(id);
  }

  enableGesture(gestureName: string, id: number) {
    const set = this.disabledGestures.get(gestureName);
    if (set !== undefined) {
      set.delete(id);
    }
  }

  disableScroll(id: number) {
    this.disabledScroll.add(id);
    if (this.disabledScroll.size === 1) {
      document.body.classList.add(BACKDROP_NO_SCROLL);
    }
  }

  enableScroll(id: number) {
    this.disabledScroll.delete(id);
    if (this.disabledScroll.size === 0) {
      document.body.classList.remove(BACKDROP_NO_SCROLL);
    }
  }

  canStart(gestureName: string): boolean {
    if (this.capturedId !== undefined) {
      // a gesture already captured
      return false;
    }

    if (this.isDisabled(gestureName)) {
      return false;
    }

    return true;
  }

  isCaptured(): boolean {
    return this.capturedId !== undefined;
  }

  isScrollDisabled(): boolean {
    return this.disabledScroll.size > 0;
  }

  isDisabled(gestureName: string): boolean {
    const disabled = this.disabledGestures.get(gestureName);
    if (disabled && disabled.size > 0) {
      return true;
    }
    return false;
  }

  private newID(): number {
    this.gestureId++;
    return this.gestureId;
  }
}

class GestureDelegate {
  private ctrl?: GestureController;
  private priority: number;

  constructor(
    ctrl: GestureController,
    private id: number,
    private name: string,
    priority: number,
    private disableScroll: boolean
  ) {
    this.priority = priority * 1000000 + id;
    this.ctrl = ctrl;
  }

  canStart(): boolean {
    if (!this.ctrl) {
      return false;
    }

    return this.ctrl.canStart(this.name);
  }

  start(): boolean {
    if (!this.ctrl) {
      return false;
    }

    return this.ctrl.start(this.name, this.id, this.priority);
  }

  capture(): boolean {
    if (!this.ctrl) {
      return false;
    }

    const captured = this.ctrl.capture(this.name, this.id, this.priority);
    if (captured && this.disableScroll) {
      this.ctrl.disableScroll(this.id);
    }

    return captured;
  }

  release() {
    if (this.ctrl) {
      this.ctrl.release(this.id);

      if (this.disableScroll) {
        this.ctrl.enableScroll(this.id);
      }
    }
  }

  destroy() {
    this.release();
    this.ctrl = undefined;
  }
}

class BlockerDelegate {

  private ctrl?: GestureController;

  constructor(
    ctrl: GestureController,
    private id: number,
    private disable: string[] | undefined,
    private disableScroll: boolean
  ) {
    this.ctrl = ctrl;
  }

  block() {
    if (!this.ctrl) {
      return;
    }
    if (this.disable) {
      for (const gesture of this.disable) {
        this.ctrl.disableGesture(gesture, this.id);
      }
    }

    if (this.disableScroll) {
      this.ctrl.disableScroll(this.id);
    }
  }

  unblock() {
    if (!this.ctrl) {
      return;
    }
    if (this.disable) {
      for (const gesture of this.disable) {
        this.ctrl.enableGesture(gesture, this.id);
      }
    }
    if (this.disableScroll) {
      this.ctrl.enableScroll(this.id);
    }
  }

  destroy() {
    this.unblock();
    this.ctrl = undefined;
  }
}

export interface GestureConfig {
  name: string;
  priority?: number;
  disableScroll?: boolean;
}

export interface BlockerConfig {
  disable?: string[];
  disableScroll?: boolean;
}

const BACKDROP_NO_SCROLL = 'backdrop-no-scroll';
export const GESTURE_CONTROLLER = new GestureController();
