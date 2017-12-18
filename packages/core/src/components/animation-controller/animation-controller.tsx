import { Component, Method } from '@stencil/core';
import { Animation, AnimationBuilder, AnimationController } from './animation-interface';
import { Animator } from './animator';


@Component({
  tag: 'ion-animation-controller'
})
export class AnimationControllerImpl implements AnimationController {

  @Method()
  create(animationBuilder?: AnimationBuilder, baseElm?: any, opts?: any): Promise<Animation> {
    if (animationBuilder) {
      return animationBuilder(Animator as any, baseElm, opts);
    }
    return Promise.resolve(new Animator() as any);
  }
}
