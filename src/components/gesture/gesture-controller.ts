

export class GestureController {
  private id: number = 0;
  private requestedStart: { [eventId: number]: number } = {};
  private disabledGestures: { [eventName: string]: Set<number> } = {};
  private disabledScroll: Set<number> = new Set<number>();
  private capturedID: number = null;


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
    return this.id++;
  }

  start(gestureName: string, id: number, priority: number): boolean {
    if (!this.canStart(gestureName)) {
      delete this.requestedStart[id];
      return false;
    }

    this.requestedStart[id] = priority;
    return true;
  }

  capture(gestureName: string, id: number, priority: number): boolean {
    if (!this.start(gestureName, id, priority)) {
      return false;
    }
    let requestedStart = this.requestedStart;
    let maxPriority = -10000;
    for (let gestureID in requestedStart) {
      maxPriority = Math.max(maxPriority, requestedStart[gestureID]);
    }

    if (maxPriority === priority) {
      this.capturedID = id;
      this.requestedStart = {};
      return true;
    }
    delete requestedStart[id];

    return false;
  }

  release(id: number) {
    delete this.requestedStart[id];

    if (this.capturedID && id === this.capturedID) {
      this.capturedID = null;
    }
  }

  disableGesture(gestureName: string, id: number) {
    let set = this.disabledGestures[gestureName];
    if (!set) {
      set = new Set<number>();
      this.disabledGestures[gestureName] = set;
    }
    set.add(id);
  }

  enableGesture(gestureName: string, id: number) {
    let set = this.disabledGestures[gestureName];
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
    if (this.capturedID) {
      // a gesture already captured
      return false;
    }

    if (this.isDisabled(gestureName)) {
      return false;
    }

    return true;
  }

  isCaptured(): boolean {
    return !!this.capturedID;
  }

  isScrollDisabled(): boolean {
    return this.disabledScroll.size > 0;
  }

  isDisabled(gestureName: string): boolean {
    let disabled = this.disabledGestures[gestureName];
    if (disabled && disabled.size > 0) {
      return true;
    }
    return false;
  }

}


export class GestureDelegate {

  constructor(
    private ctrl: GestureController,
    private id: number,
    private name: string,
    private priority: number,
    private disableScroll: boolean
  ) { }

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

    let captured = this.ctrl.capture(this.name, this.id, this.priority);
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
    this.ctrl = null;
  }

}


export class BlockerDelegate {

  blocked: boolean = false;

  constructor(
    private id: number,
    private controller: GestureController,
    private disable: string[],
    private disableScroll: boolean
  ) { }

  block() {
    if (!this.controller) {
      return;
    }
    if (this.disable) {
      this.disable.forEach(gesture => {
        this.controller.disableGesture(gesture, this.id);
      });
    }

    if (this.disableScroll) {
      this.controller.disableScroll(this.id);
    }
    this.blocked = true;
  }

  unblock() {
    if (!this.controller) {
      return;
    }
    if (this.disable) {
      this.disable.forEach(gesture => {
        this.controller.enableGesture(gesture, this.id);
      });
    }
    if (this.disableScroll) {
      this.controller.enableScroll(this.id);
    }
    this.blocked = false;
  }

  destroy() {
    this.unblock();
    this.controller = null;
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
