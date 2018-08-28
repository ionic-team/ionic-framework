import { Component, Prop } from '@stencil/core';

import { Mode } from '../../interface';
import { createThemedClasses } from '../../utils/theme';

@Component({
  tag: 'ion-list',
  styleUrls: {
    ios: 'list.ios.scss',
    md: 'list.md.scss'
  }
})
export class List {
  mode!: Mode;

  /**
   * How the bottom border should be displayed on all items.
   * Available options: `"full"`, `"inset"`, `"none"`.
   */
  @Prop() lines?: 'full' | 'inset' | 'none';

  /**
   * If true, the list will have margin around it and rounded corners. Defaults to `false`.
   */
  @Prop() inset = false;

  hostData() {
    return {
      class: {
        ...createThemedClasses(this.mode, 'list'),
        [`list-lines-${this.lines}`]: !!this.lines,
        'list-inset': this.inset,
        [`list-${this.mode}-lines-${this.lines}`]: !!this.lines
      }
    };
  }
}
