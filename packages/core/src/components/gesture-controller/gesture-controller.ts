export class GestureController {

  private gestureId = 0;
  private requestedStart = new Map<number, number>();
  private disabledGestures = new Map<string, Set<number>>();
  private disabledScroll = new Set<number>();
  private capturedId: number|null = null;

  createGesture(gestureName: string, gesturePriority: number, disableScroll: boolean): GestureDelegate {
    return new GestureDelegate(this, this.newID(), gestureName, gesturePriority, disableScroll);
  }

  createBlocker(opts: BlockerOptions = {}): BlockerDelegate {
    return new BlockerDelegate(this.newID(), this,
      opts.disable,
      !!opts.disableScroll
    );
  }

  newID(): number {
    return this.gestureId++;
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
    for (const value of requestedStart.values()) {
      maxPriority = Math.max(maxPriority, value);
    }

    if (maxPriority === priority) {
      this.capturedId = id;
      this.requestedStart.clear();
      return true;
    }
    requestedStart.delete(id);

    return false;
  }

  release(id: number) {
    this.requestedStart.delete(id);

    if (this.capturedId && id === this.capturedId) {
      this.capturedId = null;
    }
  }

  disableGesture(gestureName: string, id: number) {
    let set = this.disabledGestures.get(gestureName);
    if (!set) {
      set = new Set<number>();
      this.disabledGestures.set(gestureName, set);
    }
    set.add(id);
  }

  enableGesture(gestureName: string, id: number) {
    const set = this.disabledGestures.get(gestureName);
    if (set) {
      set.delete(id);
    }
  }

  disableScroll(id: number) {
    // let isEnabled = !this.isScrollDisabled();
    this.disabledScroll.add(id);
    // if (this._app && isEnabled && this.isScrollDisabled()) {
    //   console.debug('GestureController: Disabling scrolling');
    //   this._app._setDisableScroll(true);
    // }
  }

  enableScroll(id: number) {
    // let isDisabled = this.isScrollDisabled();
    this.disabledScroll.delete(id);
    // if (this._app && isDisabled && !this.isScrollDisabled()) {
    //   console.debug('GestureController: Enabling scrolling');
    //   this._app._setDisableScroll(false);
    // }
  }

  canStart(gestureName: string): boolean {
    if (this.capturedId) {
      // a gesture already captured
      return false;
    }

    if (this.isDisabled(gestureName)) {
      return false;
    }

    return true;
  }

  isCaptured(): boolean {
    return !!this.capturedId;
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

}


export class GestureDelegate {
  private ctrl: GestureController|null;

  constructor(
    ctrl: GestureController,
    private gestureDelegateId: number,
    private name: string,
    private priority: number,
    private disableScroll: boolean
  ) {
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

    return this.ctrl.start(this.name, this.gestureDelegateId, this.priority);
  }

  capture(): boolean {
    if (!this.ctrl) {
      return false;
    }

    const captured = this.ctrl.capture(this.name, this.gestureDelegateId, this.priority);
    if (captured && this.disableScroll) {
      this.ctrl.disableScroll(this.gestureDelegateId);
    }

    return captured;
  }

  release() {
    if (this.ctrl) {
      this.ctrl.release(this.gestureDelegateId);

      if (this.disableScroll) {
        this.ctrl.enableScroll(this.gestureDelegateId);
      }
    }
  }

  destroy() {
    this.release();
    this.ctrl = null;
  }

}


export class BlockerDelegate {

  blocked = false;

  private ctrl: GestureController|null;

  constructor(
    private blockerDelegateId: number,
    ctrl: GestureController,
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
        this.ctrl.disableGesture(gesture, this.blockerDelegateId);
      }
    }

    if (this.disableScroll) {
      this.ctrl.disableScroll(this.blockerDelegateId);
    }
    this.blocked = true;
  }

  unblock() {
    if (!this.ctrl) {
      return;
    }
    if (this.disable) {
      for (const gesture of this.disable) {
        this.ctrl.enableGesture(gesture, this.blockerDelegateId);
      }
    }
    if (this.disableScroll) {
      this.ctrl.enableScroll(this.blockerDelegateId);
    }
    this.blocked = false;
  }

  destroy() {
    this.unblock();
    this.ctrl = null;
  }
}


export interface BlockerOptions {
  disableScroll?: boolean;
  disable?: string[];
}


export const BLOCK_ALL: BlockerOptions = {
  disable: ['menu-swipe', 'goback-swipe'],
  disableScroll: true
};
