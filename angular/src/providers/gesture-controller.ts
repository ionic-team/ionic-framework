import { Injectable, NgZone } from '@angular/core';
import { Gesture, GestureConfig, createGesture } from '@ionic/core/components';

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
      Object.getOwnPropertyNames(opts).forEach(key => {
        if (typeof (opts as any)[key] === 'function') {
          const fn = (opts as any)[key];
          (opts as any)[key] = (...props: any) => this.zone.run(() => fn(...props));
        }
      });
    }

    return createGesture(opts);
  }
}
