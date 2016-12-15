import { ElementRef } from '@angular/core';
import { PointerEvents, PointerEventsConfig } from './pointer-events';
import { uiListenEvent, uiEventOptions } from '../util/ui-event-listener';


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
    const zone = config.zone || this.zoneWrapped;

    const opts = uiEventOptions(config.capture, config.passive);

    const pointerEvents = new PointerEvents(
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
    let removeFunc = uiListenEvent(element, eventName, this.zoneWrapped, option, callback);
    this.events.push(removeFunc);
    return removeFunc;
  }

  unlistenAll() {
    this.events.forEach(event => {
      event();
    });
    this.events.length = 0;
  }
}
