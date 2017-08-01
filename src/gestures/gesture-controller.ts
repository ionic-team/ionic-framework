import { Inject, Injectable, forwardRef } from '@angular/core';
import { App } from '../components/app/app';
import { assert } from '../util/util';

/** @hidden */
export const GESTURE_GO_BACK_SWIPE = 'goback-swipe';

/** @hidden */
export const GESTURE_MENU_SWIPE = 'menu-swipe';

/** @hidden */
export const GESTURE_ITEM_SWIPE = 'item-swipe';

/** @hidden */
export const GESTURE_REFRESHER = 'refresher';

/** @hidden */
export const GESTURE_TOGGLE = 'toggle';


/** @hidden */
export const GESTURE_PRIORITY_SLIDING_ITEM = -10;

/** @hidden */
export const GESTURE_PRIORITY_REFRESHER = 0;

/** @hidden */
export const GESTURE_PRIORITY_MENU_SWIPE = 10;

/** @hidden */
export const GESTURE_PRIORITY_GO_BACK_SWIPE = 20;

/** @hidden */
export const GESTURE_PRIORITY_TOGGLE = 30;


/**
* @hidden
*/
export interface GestureOptions {
  name: string;
  disableScroll?: boolean;
  priority?: number;
}

/**
* @hidden
*/
export interface BlockerOptions {
  disableScroll?: boolean;
  disable?: string[];
}

/**
* @hidden
*/
export const BLOCK_ALL: BlockerOptions = {
  disable: [GESTURE_MENU_SWIPE, GESTURE_GO_BACK_SWIPE],
  disableScroll: true
};

/**
* @hidden
*/
@Injectable()
export class GestureController {

  private id: number = 1;
  private requestedStart: { [eventId: number]: number } = {};
  private disabledGestures: { [eventName: string]: Set<number> } = {};
  private disabledScroll: Set<number> = new Set<number>();
  private capturedID: number = null;

  constructor(@Inject(forwardRef(() => App)) private _app: App) { }

  createGesture(opts: GestureOptions): GestureDelegate {
    if (!opts.name) {
      throw new Error('name is undefined');
    }
    return new GestureDelegate(opts.name, this.newID(), this,
      opts.priority || 0,
      !!opts.disableScroll
    );
  }

  createBlocker(opts: BlockerOptions = {}): BlockerDelegate {
    return new BlockerDelegate(this.newID(), this,
      opts.disable,
      !!opts.disableScroll
    );
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
    let maxPriority = -10000;
    for (let gestureID in requestedStart) {
      maxPriority = Math.max(maxPriority, requestedStart[gestureID]);
    }

    if (maxPriority === priority) {
      this.capturedID = id;
      this.requestedStart = {};
      console.debug(`${gestureName} captured!`);
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
      this._app._setDisableScroll(true);
    }
  }

  enableScroll(id: number) {
    let isDisabled = this.isScrollDisabled();
    this.disabledScroll.delete(id);
    if (this._app && isDisabled && !this.isScrollDisabled()) {
      console.debug('GestureController: Enabling scrolling');
      this._app._setDisableScroll(false);
    }
  }

  canStart(gestureName: string): boolean {
    if (this.capturedID) {
      console.debug(`${gestureName} can not start becuse gesture was already captured`);
      // a gesture already captured
      return false;
    }

    if (this.isDisabled(gestureName)) {
      console.debug(`${gestureName} is disabled`);
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
    return !!(disabled && disabled.size > 0);
  }

}

/**
* @hidden
*/
export class GestureDelegate {

  constructor(
    private name: string,
    private id: number,
    private controller: GestureController,
    private priority: number,
    private disableScroll: boolean
  ) { }

  canStart(): boolean {
    if (!this.controller) {
      assert(false, 'delegate was destroyed');
      return false;
    }
    return this.controller.canStart(this.name);
  }

  start(): boolean {
    if (!this.controller) {
      assert(false, 'delegate was destroyed');
      return false;
    }
    return this.controller.start(this.name, this.id, this.priority);
  }

  capture(): boolean {
    if (!this.controller) {
      assert(false, 'delegate was destroyed');
      return false;
    }
    let captured = this.controller.capture(this.name, this.id, this.priority);
    if (captured && this.disableScroll) {
      this.controller.disableScroll(this.id);
    }
    return captured;
  }

  release() {
    if (!this.controller) {
      assert(false, 'delegate was destroyed');
      return;
    }
    this.controller.release(this.id);
    if (this.disableScroll) {
      this.controller.enableScroll(this.id);
    }
  }

  destroy() {
    this.release();
    this.controller = null;
  }
}

/**
* @hidden
*/
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
      assert(false, 'delegate was destroyed');
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
      assert(false, 'delegate was destroyed');
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
