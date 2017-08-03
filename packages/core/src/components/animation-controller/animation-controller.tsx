import { Component } from '@stencil/core';
import { Animator } from './animator';
import { Ionic } from '../../index';


@Component({
  tag: 'ion-animation-controller'
})
export class AnimationController {

  ionViewWillLoad() {
    Ionic.registerController('animation', Animator);
  }

}
