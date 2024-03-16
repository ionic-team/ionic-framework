import type { ComponentInterface } from '@stencil/core';
import { Component, Host, Prop, h } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';

@Component({
  tag: 'ion-grid',
  styleUrl: 'grid.scss',
  shadow: true,
})
export class Grid implements ComponentInterface {
  /**
   * If `true`, the grid will have a fixed width based on the screen size.
   */
  @Prop() fixed = false;

  render() {
    const mode = getIonMode(this);
    return (
      <Host
        class={{
          [mode]: true,
          'grid-fixed': this.fixed,
        }}
      >
        <slot></slot>
      </Host>
    );
  }
}
