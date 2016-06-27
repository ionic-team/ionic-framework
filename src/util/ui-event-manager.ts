import {ElementRef} from '@angular/core';


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

  private lastTouchEvent: number = 0;

  mouseWait: number = 2 * 1000;

  constructor(private ele: any,
    private pointerDown: any,
    private pointerMove: any,
    private pointerUp: any,
    private zone: boolean,
    private option: any) {

    this.rmTouchStart = listenEvent(ele, 'touchstart', zone, option, this.handleTouchStart.bind(this));
    this.rmMouseStart = listenEvent(ele, 'mousedown', zone, option, this.handleMouseDown.bind(this));
  }

  private handleTouchStart(ev: any) {
    this.lastTouchEvent = Date.now() + this.mouseWait;
    if (!this.pointerDown(ev)) {
      return;
    }
    if (!this.rmTouchMove) {
      this.rmTouchMove = listenEvent(this.ele, 'touchmove', this.zone, this.option, this.pointerMove);
    }
    let handleTouchEnd = (ev: any) => this.handleTouchEnd(ev);
    if (!this.rmTouchEnd) {
      this.rmTouchEnd = listenEvent(this.ele, 'touchend', this.zone, this.option, handleTouchEnd);
    }
    if (!this.rmTouchCancel) {
      this.rmTouchCancel = listenEvent(this.ele, 'touchcancel', this.zone, this.option, handleTouchEnd);
    }
  }

  private handleMouseDown(ev: any) {
    if (this.lastTouchEvent > Date.now()) {
      console.debug('mousedown event dropped because of previous touch');
      return;
    }
    if (!this.pointerDown(ev)) {
      return;
    }
    if (!this.rmMouseMove) {
      this.rmMouseMove = listenEvent(window, 'mousemove', this.zone, this.option, this.pointerMove);
    }
    if (!this.rmMouseUp) {
      this.rmMouseUp = listenEvent(window, 'mouseup', this.zone, this.option, (ev: any) => this.handleMouseUp(ev));
    }
  }

  private handleTouchEnd(ev: any) {
    this.stopTouch();
    this.pointerUp(ev);
  }

  private handleMouseUp(ev: any) {
    this.stopMouse();
    this.pointerUp(ev);
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

  listenRef(ref: ElementRef, eventName: string, callback: any, option?: any): Function {
    return this.listen(ref.nativeElement, eventName, callback, option);
  }

  pointerEventsRef(ref: ElementRef, pointerStart: any, pointerMove: any, pointerEnd: any, option?: any): PointerEvents {
    return this.pointerEvents(ref.nativeElement, pointerStart, pointerMove, pointerEnd, option);
  }

  pointerEvents(element: any, pointerDown: any, pointerMove: any, pointerUp: any, option: any = false): PointerEvents {
    if (!element) {
      return;
    }
    let submanager = new PointerEvents(
      element,
      pointerDown,
      pointerMove,
      pointerUp,
      this.zoneWrapped,
      option);

    let removeFunc = () => submanager.destroy();
    this.events.push(removeFunc);
    return submanager;
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
  let rawEvent = ('__zone_symbol__addEventListener' in ele && !zoneWrapped);
  if (rawEvent) {
    ele.__zone_symbol__addEventListener(eventName, callback, option);
    return () => ele.__zone_symbol__removeEventListener(eventName, callback);
  } else {
    ele.addEventListener(eventName, callback, option);
    return () => ele.removeEventListener(eventName, callback);
  }
}
