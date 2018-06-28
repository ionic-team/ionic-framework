import { Component, Prop } from '@stencil/core';
import { Color, Mode } from '../../interface';
import { createThemedClasses } from '../../utils/theme';


@Component({
  tag: 'ion-grid',
  styleUrls: {
    ios: 'grid.ios.scss',
    md: 'grid.md.scss'
  }
})
export class Grid {

  mode!: Mode;
  color?: Color;

  /**
   * If true, the grid will have a fixed width based on the screen size. Defaults to `false`.
   */
  @Prop() fixed?: boolean;

  hostData() {
    return {
      class: {
        ...createThemedClasses(this.mode, this.color, 'grid'),
        'grid-fixed': this.fixed
      }
    };
  }
}
