import { Injectable, NgZone } from '@angular/core';
import type { Gesture, GestureConfig } from '@ionic/core/components';
import { createGesture } from '@ionic/core/components';

@Injectable({
  providedIn: 'root',
})
export class GestureController {
  constructor(private zone: NgZone) {}
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

    return createGesture(opts);
  }
}
