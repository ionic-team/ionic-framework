import { Component, ComponentInterface, getMode, h } from '@stencil/core';

import { Mode } from '../../interface';

@Component({
  tag: 'ion-thumbnail',
  styleUrl: 'thumbnail.scss',
  shadow: true
})
export class Thumbnail implements ComponentInterface {

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
