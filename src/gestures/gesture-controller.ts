import { forwardRef, Inject, Injectable } from '@angular/core';
import { App } from '../components/app/app';

export const enum GesturePriority {
  Minimun = -10000,
  VeryLow = -20,
  Low = -10,
  Normal = 0,
  High = 10,
  VeryHigh = 20,

  SlidingItem = Low,
  MenuSwipe = High,
  GoBackSwipe = VeryHigh,
  Refresher = Normal,
}

export const enum DisableScroll {
  Never,
  DuringCapture,
  Always,
}

export interface GestureOptions {
  disable?: string[];
  disableScroll?: DisableScroll;
  priority?: number;
}

/**
* @private
*/
@Injectable()
export class GestureController {
  private id: number = 1;
  private requestedStart: { [eventId: number]: number } = {};
  private disabledGestures: { [eventName: string]: Set<number> } = {};
  private disabledScroll: Set<number> = new Set<number>();
  private capturedID: number = null;

  constructor(@Inject(forwardRef(() => App)) private _app: App) { }

  create(name: string, opts: GestureOptions = {}): GestureDelegate {
    return new GestureDelegate(name, this.newID(), this, opts);
  }

  newID(): number {
    let id = this.id; this.id++;
    return id;
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
    let maxPriority = GesturePriority.Minimun;
    for (let gestureID in requestedStart) {
      maxPriority = Math.max(maxPriority, requestedStart[gestureID]);
    }

    if (maxPriority === priority) {
      this.capturedID = id;
      this.requestedStart = {};
      return true;
    }
    delete requestedStart[id];
    console.debug(`${gestureName} can not start because it is has lower priority`);
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
    let isEnabled = !this.isScrollDisabled();
    this.disabledScroll.add(id);
    if (this._app && isEnabled && this.isScrollDisabled()) {
      console.debug('GestureController: Disabling scrolling');
      this._app.setScrollDisabled(true);
    }
  }

  enableScroll(id: number) {
    let isDisabled = this.isScrollDisabled();
    this.disabledScroll.delete(id);
    if (this._app && isDisabled && !this.isScrollDisabled()) {
      console.debug('GestureController: Enabling scrolling');
      this._app.setScrollDisabled(false);
    }
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

/**
* @private
*/
export class GestureDelegate {
  private disable: string[];
  private disableScroll: DisableScroll;
  public priority: number = 0;

  constructor(
    private name: string,
    private id: number,
    private controller: GestureController,
    opts: GestureOptions
  ) {
    this.disable = opts.disable || [];
    this.disableScroll = opts.disableScroll || DisableScroll.Never;
    this.priority = opts.priority || 0;

    // Disable gestures
    for (let gestureName of this.disable) {
      controller.disableGesture(gestureName, id);
    }

    // Disable scrolling (always)
    if (this.disableScroll === DisableScroll.Always) {
      controller.disableScroll(id);
    }
  }

  canStart(): boolean {
    if (!this.controller) {
      return false;
    }
    return this.controller.canStart(this.name);
  }

  start(): boolean {
    if (!this.controller) {
      return false;
    }
    return this.controller.start(this.name, this.id, this.priority);
  }

  capture(): boolean {
    if (!this.controller) {
      return false;
    }
    let captured = this.controller.capture(this.name, this.id, this.priority);
    if (captured && this.disableScroll === DisableScroll.DuringCapture) {
      this.controller.disableScroll(this.id);
    }
    return captured;
  }

  release() {
    if (!this.controller) {
      return;
    }
    this.controller.release(this.id);
    if (this.disableScroll === DisableScroll.DuringCapture) {
      this.controller.enableScroll(this.id);
    }
  }

  destroy() {
    if (!this.controller) {
      return;
    }
    this.release();

    for (let disabled of this.disable) {
      this.controller.enableGesture(disabled, this.id);
    }
    if (this.disableScroll === DisableScroll.Always) {
      this.controller.enableScroll(this.id);
    }
    this.controller = null;
  }
}
