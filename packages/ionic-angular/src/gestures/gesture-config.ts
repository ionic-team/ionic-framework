import { Injectable } from '@angular/core';
import { HammerGestureConfig } from '@angular/platform-browser';


/**
 * @hidden
 * This class overrides the default Angular gesture config.
 */
@Injectable()
export class IonicGestureConfig extends HammerGestureConfig {

  buildHammer(element: HTMLElement) {
    const mc = new (<any> window).Hammer(element);

    for (let eventName in this.overrides) {
      mc.get(eventName).set(this.overrides[eventName]);
    }

    return mc;
  }

}
