import { Component } from '@stencil/core';
import { Mode } from '../../interface';
import { createThemedClasses } from '../../utils/theme';


@Component({
  tag: 'ion-row',
  styleUrl: 'row.scss',
  shadow: true
})
export class Row {
  mode!: Mode;

  hostData() {
    return {
      class: {
        ...createThemedClasses(this.mode, undefined, 'row')
      }
    };
  }

  render() {
    return <slot></slot>;
  }
}
