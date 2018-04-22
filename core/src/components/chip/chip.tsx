import { Component, Prop } from '@stencil/core';
import { Mode } from '../..';


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
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   */
  @Prop() color!: string;

  /**
   * The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   */
  @Prop() mode!: Mode;

}
