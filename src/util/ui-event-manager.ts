import { ElementRef } from '@angular/core';
import { assert } from './util';

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

export const enum PointerEventType {
  UNDEFINED,
  MOUSE,
  TOUCH
}

// Test via a getter in the options object to see if the passive property is accessed
var supportsPassive = false;
try {
  var opts = Object.defineProperty({}, 'passive', {
    get: function() {
      supportsPassive = true;
    }
  });
  window.addEventListener('test', null, opts);
} catch (e) { }

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

    this.rmTouchStart = listenEvent(ele, 'touchstart', zone, option, this.handleTouchStart.bind(this));
    this.rmMouseStart = listenEvent(ele, 'mousedown', zone, option, this.handleMouseDown.bind(this));
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
      this.rmTouchMove = listenEvent(this.ele, 'touchmove', this.zone, this.option, this.pointerMove);
    }
    if (!this.rmTouchEnd) {
      this.rmTouchEnd = listenEvent(this.ele, 'touchend', this.zone, this.option, this.bindTouchEnd);
    }
    if (!this.rmTouchCancel) {
      this.rmTouchCancel = listenEvent(this.ele, 'touchcancel', this.zone, this.option, this.bindTouchEnd);
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
      this.rmMouseMove = listenEvent(document, 'mousemove', this.zone, this.option, this.pointerMove);
    }
    if (!this.rmMouseUp) {
      this.rmMouseUp = listenEvent(document, 'mouseup', this.zone, this.option, this.bindMouseUp);
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


/**
 * @private
 */
export class UIEventManager {
  private events: Function[] = [];

  constructor(public zoneWrapped: boolean = true) {}

  pointerEvents(config: PointerEventsConfig): PointerEvents {
    let element = config.element;
    if (!element) {
      element = config.elementRef.nativeElement;
    }

    if (!element || !config.pointerDown) {
      console.error('PointerEvents config is invalid');
      return;
    }
    let zone = config.zone || this.zoneWrapped;
    let opts;
    if (supportsPassive) {
      opts = {};
      if (config.passive === true) {
        opts['passive'] = true;
      }
      if (config.capture === true) {
        opts['capture'] = true;
      }
    } else {
      if (config.passive === true) {
        console.debug('passive event listeners are not supported by this browser');
      }
      if (config.capture === true) {
        opts = true;
      }
    }

    let pointerEvents = new PointerEvents(
      element,
      config.pointerDown,
      config.pointerMove,
      config.pointerUp,
      zone,
      opts);

    let removeFunc = () => pointerEvents.destroy();
    this.events.push(removeFunc);
    return pointerEvents;
  }

  listenRef(ref: ElementRef, eventName: string, callback: any, option?: any): Function {
    return this.listen(ref.nativeElement, eventName, callback, option);
  }

  listen(element: any, eventName: string, callback: any, option: any = false): Function {
    if (!element) {
      return;
    }
    let removeFunc = listenEvent(element, eventName, this.zoneWrapped, option, callback);
    this.events.push(removeFunc);
    return removeFunc;
  }

  unlistenAll() {
    for (let event of this.events) {
      event();
    }
    this.events.length = 0;
  }
}

function listenEvent(ele: any, eventName: string, zoneWrapped: boolean, option: any, callback: any): Function {
  let rawEvent = (!zoneWrapped && '__zone_symbol__addEventListener' in ele);
  if (rawEvent) {
    ele.__zone_symbol__addEventListener(eventName, callback, option);
    assert('__zone_symbol__removeEventListener' in ele, 'native removeEventListener does not exist');
    return () => ele.__zone_symbol__removeEventListener(eventName, callback, option);
  } else {
    ele.addEventListener(eventName, callback, option);
    return () => ele.removeEventListener(eventName, callback, option);
  }
}
