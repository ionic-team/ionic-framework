import { NgZone } from '@angular/core';
import type { Gesture, GestureConfig, createGesture as _createGesture } from '@ionic/core/components';

export class GestureController {
  constructor(private zone: NgZone, private createGesture: typeof _createGesture) {}
  /**
   * Create a new gesture
   */
  create(opts: GestureConfig, runInsideAngularZone = false): Gesture {
    if (runInsideAngularZone) {
      Object.getOwnPropertyNames(opts).forEach((key) => {
        if (typeof opts[key] === 'function') {
          const fn = opts[key];
          opts[key] = (...props: any[]) => this.zone.run(() => fn(...props));
        }
      });
    }

    return this.createGesture(opts);
  }
}
