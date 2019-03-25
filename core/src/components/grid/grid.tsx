import { Component, ComponentInterface, Prop } from '@stencil/core';

import { Mode } from '../../interface';

@Component({
  tag: 'ion-grid',
  styleUrl: 'grid.scss',
  shadow: true
})
export class Grid implements ComponentInterface {
  mode!: Mode;

  /**
   * If `true`, the grid will have a fixed width based on the screen size.
   */
  @Prop() fixed = false;

  hostData() {
    return {
      class: {
        [`${this.mode}`]: true,
        'grid-fixed': this.fixed
      }
    };
  }

  render() {
    return <slot></slot>;
  }
}
