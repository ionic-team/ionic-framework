import { Component, ComponentInterface, h } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';

@Component({
  tag: 'ion-row',
  styleUrl: 'row.scss',
  shadow: true
})
export class Row implements ComponentInterface {

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
