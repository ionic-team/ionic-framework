import { Component, Method } from '@stencil/core';
import { Animation, AnimationBuilder, AnimationController } from '../../interface';
import { Animator } from './animator';


@Component({
  tag: 'ion-animation-controller'
})
export class AnimationControllerImpl implements AnimationController {

  /**
   * Creates an animation instance
   */
  @Method()
  create(animationBuilder?: AnimationBuilder, baseEl?: any, opts?: any): Promise<Animation> {
    if (animationBuilder) {
      return animationBuilder(Animator as any, baseEl, opts);
    }
    return Promise.resolve(new Animator() as any);
  }
}
