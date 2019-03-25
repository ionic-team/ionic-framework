import { Component, ComponentInterface } from '@stencil/core';

import { Mode } from '../../interface';

@Component({
  tag: 'ion-thumbnail',
  styleUrl: 'thumbnail.scss',
  shadow: true
})
export class Thumbnail implements ComponentInterface {
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
