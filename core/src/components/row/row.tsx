import { Component, ComponentInterface } from '@stencil/core';

import { Mode } from '../../interface';

@Component({
  tag: 'ion-row',
  styleUrl: 'row.scss',
  shadow: true
})
export class Row implements ComponentInterface {
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
