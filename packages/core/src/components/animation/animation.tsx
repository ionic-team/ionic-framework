import { Component, Method } from '@stencil/core';
import { Animation, AnimationBuilder } from './animation-interface';
import { Animator } from './animator';


@Component({
  tag: 'ion-animation'
})
export class AnimationController {

  @Method()
  create(animationBuilder?: AnimationBuilder, baseElm?: any): Promise<Animation> {
    return new Promise(resolve => {
      if (animationBuilder) {
        resolve(animationBuilder(Animator as any, baseElm));
      } else {
        resolve(new Animator() as any);
      }
    });
  }

}
