import { NgZone, Injectable } from '@angular/core';
import { Gesture, GestureConfig, createGesture } from '@ionic/core';

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
