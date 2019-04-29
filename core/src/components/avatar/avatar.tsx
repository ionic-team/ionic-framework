import { Component, ComponentInterface, getMode, h } from '@stencil/core';

import { Mode } from '../../interface';

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
    const mode = getMode<Mode>(this);

    return {
      class: {
        [`${mode}`]: true,
      }
    };
  }

  render() {
    return <slot></slot>;
  }

}
