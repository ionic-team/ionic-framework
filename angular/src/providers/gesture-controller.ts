import { Injectable } from '@angular/core';
import { Gesture, GestureConfig, createGesture } from '@ionic/core';

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
