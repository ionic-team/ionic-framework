import { addEventListener } from './listener';

const MOUSE_WAIT = 2000;

export class PointerEvents {

  private rmTouchStart?: () => void;
  private rmTouchMove?: () => void;
  private rmTouchEnd?: () => void;
  private rmTouchCancel?: () => void;

  private rmMouseStart?: () => void;
  private rmMouseMove?: () => void;
  private rmMouseUp?: () => void;

  private bindTouchEnd: any;
  private bindMouseUp: any;

  private lastTouchEvent = 0;

  constructor(
    private el: Node,
    private pointerDown: any,
    private pointerMove: any,
    private pointerUp: any,
    private options: EventListenerOptions
  ) {
    this.bindTouchEnd = this.handleTouchEnd.bind(this);
    this.bindMouseUp = this.handleMouseUp.bind(this);
  }

  set disabled(disabled: boolean) {
    if (disabled) {
      if (this.rmTouchStart) {
        this.rmTouchStart();
      }
      if (this.rmMouseStart) {
        this.rmMouseStart();
      }
      this.rmTouchStart = this.rmMouseStart = undefined;
      this.stop();

    } else {
      if (!this.rmTouchStart) {
        this.rmTouchStart = addEventListener(this.el, 'touchstart', this.handleTouchStart.bind(this), this.options);
      }
      if (!this.rmMouseStart) {
        this.rmMouseStart = addEventListener(this.el, 'mousedown', this.handleMouseDown.bind(this), this.options);
      }
    }
  }

  stop() {
    this.stopTouch();
    this.stopMouse();
  }

  destroy() {
    this.disabled = true;
    this.pointerUp = this.pointerMove = this.pointerDown = undefined;
  }

  private handleTouchStart(ev: any) {
    this.lastTouchEvent = Date.now() + MOUSE_WAIT;
    if (!this.pointerDown(ev, POINTER_EVENT_TYPE_TOUCH)) {
      return;
    }
    if (!this.rmTouchMove && this.pointerMove) {
      this.rmTouchMove = addEventListener(this.el, 'touchmove', this.pointerMove, this.options);
    }
    if (!this.rmTouchEnd) {
      this.rmTouchEnd = addEventListener(this.el, 'touchend', this.bindTouchEnd, this.options);
    }
    if (!this.rmTouchCancel) {
      this.rmTouchCancel = addEventListener(this.el, 'touchcancel', this.bindTouchEnd, this.options);
    }
  }

  private handleMouseDown(ev: any) {
    if (this.lastTouchEvent > Date.now()) {
      console.debug('mousedown event dropped because of previous touch');
      return;
    }
    if (!this.pointerDown(ev, POINTER_EVENT_TYPE_MOUSE)) {
      return;
    }
    if (!this.rmMouseMove && this.pointerMove) {
      this.rmMouseMove = addEventListener(this.el.ownerDocument, 'mousemove', this.pointerMove, this.options);
    }
    if (!this.rmMouseUp) {
      this.rmMouseUp = addEventListener(this.el.ownerDocument, 'mouseup', this.bindMouseUp, this.options);
    }
  }

  private handleTouchEnd(ev: any) {
    this.stopTouch();
    if (this.pointerUp) {
      this.pointerUp(ev, POINTER_EVENT_TYPE_TOUCH);
    }
  }

  private handleMouseUp(ev: any) {
    this.stopMouse();
    if (this.pointerUp) {
      this.pointerUp(ev, POINTER_EVENT_TYPE_MOUSE);
    }
  }

  private stopTouch() {
    if (this.rmTouchMove) {
      this.rmTouchMove();
    }
    if (this.rmTouchEnd) {
      this.rmTouchEnd();
    }
    if (this.rmTouchCancel) {
      this.rmTouchCancel();
    }
    this.rmTouchMove = this.rmTouchEnd = this.rmTouchCancel = undefined;
  }

  private stopMouse() {
    if (this.rmMouseMove) {
      this.rmMouseMove();
    }
    if (this.rmMouseUp) {
      this.rmMouseUp();
    }
    this.rmMouseMove = this.rmMouseUp = undefined;
  }
}

export const POINTER_EVENT_TYPE_MOUSE = 1;
export const POINTER_EVENT_TYPE_TOUCH = 2;

export interface PointerEventsConfig {
  element?: HTMLElement;
  pointerDown: (ev: any) => boolean;
  pointerMove?: (ev: any) => void;
  pointerUp?: (ev: any) => void;
  zone?: boolean;
  capture?: boolean;
  passive?: boolean;
}
