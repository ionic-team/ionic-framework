import { Component, ComponentInterface, Method, Prop } from '@stencil/core';

import { Animation, AnimationBuilder, AnimationController, Config } from '../../interface';

import { Animator } from './animator';

/** @internal */
@Component({
  tag: 'ion-animation-controller'
})
export class AnimationControllerImpl implements ComponentInterface, AnimationController {

  @Prop({ context: 'config' }) config!: Config;

  /**
   * Creates an animation instance
   */
  @Method()
  create(animationBuilder?: AnimationBuilder, baseEl?: any, opts?: any): Promise<Animation> {
    Animator.animated = this.config.getBoolean('animated', true);
    if (animationBuilder) {
      return animationBuilder(Animator as any, baseEl, opts);
    }
    return Promise.resolve(new Animator() as any);
  }
}
