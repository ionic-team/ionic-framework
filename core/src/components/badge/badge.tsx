import { Component, Prop } from '@stencil/core';
import { Color, Mode } from '../../interface';

@Component({
  tag: 'ion-badge',
  styleUrls: {
    ios: 'badge.ios.scss',
    md: 'badge.md.scss'
  },
  host: {
    theme: 'badge'
  }
})
export class Badge {
  /**
   * The color the badge should be
   */
  @Prop() color?: Color;

  /**
   * The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   */
  @Prop() mode!: Mode;
}
