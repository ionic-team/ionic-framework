import { Component, Prop } from '@stencil/core';
import { Color, Mode } from '../../interface';


@Component({
  tag: 'ion-chip',
  styleUrls: {
    ios: 'chip.ios.scss',
    md: 'chip.md.scss'
  },
  host: {
    theme: 'chip'
  }
})
export class Chip {
  /**
   * The color to use.
   */
  @Prop() color?: Color;

  /**
   * The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   */
  @Prop() mode!: Mode;

}
