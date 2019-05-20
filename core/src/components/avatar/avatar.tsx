import { Component, ComponentInterface } from '@stencil/core';

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
  mode!: Mode;

  hostData() {
    return {
      class: {
        [`${this.mode}`]: true,
      }
    };
  }

  render() {
    return <slot></slot>;
  }

}
