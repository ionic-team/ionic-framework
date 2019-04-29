import { Component, ComponentInterface, getMode, h } from '@stencil/core';

import { Mode } from '../../interface';

@Component({
  tag: 'ion-row',
  styleUrl: 'row.scss',
  shadow: true
})
export class Row implements ComponentInterface {

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
