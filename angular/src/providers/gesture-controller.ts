import { Injectable } from '@angular/core';
import { Gesture, GestureConfig, PressRecognizerOptions, createGesture, createPressRecognizer } from '@ionic/core';

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

  /**
   * Create a new Press recognizer gesture
   */
  pressRecognizer(opts: PressRecognizerOptions): Gesture {
    return createPressRecognizer(opts);
  }
}
