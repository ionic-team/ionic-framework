import { Component } from '@stencil/core';
import { Animation } from './animation-interface';
import { Animator } from './animator';
import { Ionic, IonicControllerApi } from '../../index';


@Component({
  tag: 'ion-animation-controller'
})
export class AnimationController implements IonicControllerApi {

  ionViewWillLoad() {
    debugger;;;
    Ionic.registerController('animation', this);
  }

  load(): Promise<Animation> {
    return new Promise(resolve => {
      debugger;
      resolve((Animator as any));
    });
  }

}
