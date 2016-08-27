import { Injectable } from '@angular/core';
import { HammerGestureConfig } from '@angular/platform-browser';

/* this class override the default angular gesture config.
 * The motivation for this is enabling pinch, rotate or
 * any other multi-touch gestures block scrolling.
 */

/**
 * @private
 */
@Injectable()
export class IonicGestureConfig extends HammerGestureConfig {
  
  buildHammer(element: HTMLElement) {
    var mc = new (<any> window).Hammer(element);

    for (let eventName in this.overrides) {
      mc.get(eventName).set(this.overrides[eventName]);
    }

    return mc;
  }

}