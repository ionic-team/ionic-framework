import { Component, Method } from '@stencil/core';
import { Animation, AnimationBuilder, AnimationController } from './animation-interface';
import { Animator } from './animator';


@Component({
  tag: 'ion-animation-controller'
})
export class AnimationControllerImpl implements AnimationController {

  @Method()
  create(animationBuilder?: AnimationBuilder, baseElm?: any, opts?: any): Promise<Animation> {
    return new Promise(resolve => {
      if (animationBuilder) {
        resolve(animationBuilder(Animator as any, baseElm, opts));
      } else {
        resolve(new Animator() as any);
      }
    });
  }

}
