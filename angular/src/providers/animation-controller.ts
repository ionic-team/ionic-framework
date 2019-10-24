import { Injectable } from '@angular/core';
import { Animation, createAnimation } from '@ionic/core';

@Injectable({
  providedIn: 'root',
})
export class AnimationController {
  constructor() {}

  /**
   * Create a new animation
   */
  create(): Animation {
    return createAnimation();
  }
}
