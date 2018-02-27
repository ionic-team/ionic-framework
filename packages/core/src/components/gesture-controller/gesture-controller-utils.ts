import { GestureController } from './gesture-controller';

export class GestureDelegate {
  private ctrl: GestureController|null;

  constructor(
    ctrl: any,
    private id: number,
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
    this.ctrl = null;
  }
}


export class BlockerDelegate {

  private ctrl: any|null;

  constructor(
    private id: number,
    ctrl: any,
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
    this.ctrl = null;
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

export const BLOCK_ALL: BlockerConfig = {
  disable: ['menu-swipe', 'goback-swipe'],
  disableScroll: true
};
