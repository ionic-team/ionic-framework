import { Component, ComponentInterface, h } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';

@Component({
  tag: 'ion-avatar',
  styleUrls: {
    ios: 'avatar.ios.scss',
    md: 'avatar.md.scss'
  },
  shadow: true
})
export class Avatar implements ComponentInterface {

  hostData() {
    const mode = getIonMode(this);

    return {
      class: {
        [mode]: true,
      }
    };
  }

  render() {
    return <slot></slot>;
  }

}
