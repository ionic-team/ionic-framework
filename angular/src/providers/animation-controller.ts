import { Injectable } from '@angular/core';
import { Animation, createAnimation } from '@ionic/core';

@Injectable({
  providedIn: 'root',
})
export class AnimationController {
  /**
   * Create a new animation
   */
  create(animationId?: string): Animation {
    return createAnimation(animationId);
  }
}
