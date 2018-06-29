import { Component, Prop } from '@stencil/core';
import { Color, Mode } from '../../interface';


@Component({
  tag: 'ion-grid',
  styleUrl: 'grid.scss',
  shadow: true
})
export class Grid {

  mode!: Mode;
  color?: Color;

  /**
   * If true, the grid will have a fixed width based on the screen size. Defaults to `false`.
   */
  @Prop() fixed = false;

  hostData() {
    return {
      class: {
        'grid-fixed': this.fixed
      }
    };
  }

  render() {
    return <slot></slot>;
  }
}
