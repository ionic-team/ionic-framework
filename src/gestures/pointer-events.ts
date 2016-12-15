import { assert } from '../util/util';
import { ElementRef } from '@angular/core';
import { uiListenEvent } from '../util/ui-event-listener';

/**
 * @private
 */
export class PointerEvents {
  private rmTouchStart: Function = null;
  private rmTouchMove: Function = null;
  private rmTouchEnd: Function = null;
  private rmTouchCancel: Function = null;

  private rmMouseStart: Function = null;
  private rmMouseMove: Function = null;
  private rmMouseUp: Function = null;

  private bindTouchEnd: Function;
  private bindMouseUp: Function;

  private lastTouchEvent: number = 0;

  mouseWait: number = 2 * 1000;
  lastEventType: PointerEventType = PointerEventType.UNDEFINED;

  constructor(private ele: any,
    private pointerDown: any,
    private pointerMove: any,
    private pointerUp: any,
    private zone: boolean,
    private option: any
  ) {
    assert(ele, 'element can not be null');
    assert(pointerDown, 'pointerDown can not be null');

    this.bindTouchEnd = this.handleTouchEnd.bind(this);
    this.bindMouseUp = this.handleMouseUp.bind(this);

    this.rmTouchStart = uiListenEvent(ele, 'touchstart', zone, option, this.handleTouchStart.bind(this));
    this.rmMouseStart = uiListenEvent(ele, 'mousedown', zone, option, this.handleMouseDown.bind(this));
  }

  private handleTouchStart(ev: any) {
    assert(this.ele, 'element can not be null');
    assert(this.pointerDown, 'pointerDown can not be null');

    this.lastTouchEvent = Date.now() + this.mouseWait;
    this.lastEventType = PointerEventType.TOUCH;
    if (!this.pointerDown(ev, PointerEventType.TOUCH)) {
      return;
    }
    if (!this.rmTouchMove && this.pointerMove) {
      this.rmTouchMove = uiListenEvent(this.ele, 'touchmove', this.zone, this.option, this.pointerMove);
    }
    if (!this.rmTouchEnd) {
      this.rmTouchEnd = uiListenEvent(this.ele, 'touchend', this.zone, this.option, this.bindTouchEnd);
    }
    if (!this.rmTouchCancel) {
      this.rmTouchCancel = uiListenEvent(this.ele, 'touchcancel', this.zone, this.option, this.bindTouchEnd);
    }
  }

  private handleMouseDown(ev: any) {
    assert(this.ele, 'element can not be null');
    assert(this.pointerDown, 'pointerDown can not be null');

    if (this.lastTouchEvent > Date.now()) {
      console.debug('mousedown event dropped because of previous touch');
      return;
    }
    this.lastEventType = PointerEventType.MOUSE;
    if (!this.pointerDown(ev, PointerEventType.MOUSE)) {
      return;
    }
    if (!this.rmMouseMove && this.pointerMove) {
      this.rmMouseMove = uiListenEvent(this.ele.documentElement.parentNode, 'mousemove', this.zone, this.option, this.pointerMove);
    }
    if (!this.rmMouseUp) {
      this.rmMouseUp = uiListenEvent(this.ele.documentElement.parentNode, 'mouseup', this.zone, this.option, this.bindMouseUp);
    }
  }

  private handleTouchEnd(ev: any) {
    this.stopTouch();
    this.pointerUp && this.pointerUp(ev, PointerEventType.TOUCH);
  }

  private handleMouseUp(ev: any) {
    this.stopMouse();
    this.pointerUp && this.pointerUp(ev, PointerEventType.MOUSE);
  }

  private stopTouch() {
    this.rmTouchMove && this.rmTouchMove();
    this.rmTouchEnd && this.rmTouchEnd();
    this.rmTouchCancel && this.rmTouchCancel();

    this.rmTouchMove = null;
    this.rmTouchEnd = null;
    this.rmTouchCancel = null;
  }

  private stopMouse() {
    this.rmMouseMove && this.rmMouseMove();
    this.rmMouseUp && this.rmMouseUp();

    this.rmMouseMove = null;
    this.rmMouseUp = null;
  }

  stop() {
    this.stopTouch();
    this.stopMouse();
  }

  destroy() {
    this.rmTouchStart && this.rmTouchStart();
    this.rmTouchStart = null;

    this.rmMouseStart && this.rmMouseStart();
    this.rmMouseStart = null;

    this.stop();

    this.pointerDown = null;
    this.pointerMove = null;
    this.pointerUp = null;

    this.ele = null;
  }

}


export const enum PointerEventType {
  UNDEFINED,
  MOUSE,
  TOUCH
}

export interface PointerEventsConfig {
  element?: HTMLElement;
  elementRef?: ElementRef;
  pointerDown: (ev: any) => boolean;
  pointerMove?: (ev: any) => void;
  pointerUp?: (ev: any) => void;
  zone?: boolean;

  capture?: boolean;
  passive?: boolean;
}
