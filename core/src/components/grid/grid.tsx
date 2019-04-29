import { Component, ComponentInterface, Prop, getMode, h } from '@stencil/core';

import { Mode } from '../../interface';

@Component({
  tag: 'ion-grid',
  styleUrl: 'grid.scss',
  shadow: true
})
export class Grid implements ComponentInterface {

  /**
   * If `true`, the grid will have a fixed width based on the screen size.
   */
  @Prop() fixed = false;

  hostData() {
    const mode = getMode<Mode>(this);
    return {
      class: {
        [`${mode}`]: true,
        'grid-fixed': this.fixed
      }
    };
  }

  render() {
    return <slot></slot>;
  }
}
