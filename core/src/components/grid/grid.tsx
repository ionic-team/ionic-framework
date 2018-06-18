import { Component, Prop } from '@stencil/core';


@Component({
  tag: 'ion-grid',
  styleUrls: {
    ios: 'grid.ios.scss',
    md: 'grid.md.scss'
  },
  host: {
    theme: 'grid'
  }
})
export class Grid {
  /**
   * If true, the grid will have a fixed width based on the screen size. Defaults to `false`.
   */
  @Prop() fixed?: boolean;

  hostData() {
    return {
      class: {
        'grid-fixed': this.fixed
      }
    };
  }
}
