import { Component, ComponentInterface, h } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';

@Component({
  tag: 'ion-thumbnail',
  styleUrl: 'thumbnail.scss',
  shadow: true
})
export class Thumbnail implements ComponentInterface {

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
