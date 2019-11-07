import { Injectable } from '@angular/core';
import { createGesture, GestureConfig, Gesture } from '@ionic/core';

@Injectable({
  providedIn: 'root',
})
export class GestureController {
  /**
   * Create a new gesture
   */
  create(opts: GestureConfig): Gesture {
    return createGesture(opts);
  }
}
