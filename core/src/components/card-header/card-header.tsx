import { Component, Prop } from '@stencil/core';

import { Color, Mode } from '../../interface';
import { createThemedClasses } from '../../utils/theme';

@Component({
  tag: 'ion-card-header',
  styleUrls: {
    ios: 'card-header.ios.scss',
    md: 'card-header.md.scss'
  }
})
export class CardHeader {
  /**
   * The color to use for the background.
   */
  @Prop() color?: Color;

  /**
   * The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   */
  @Prop() mode!: Mode;

  /**
   * If true, the card header will be translucent. Defaults to `false`.
   */
  @Prop() translucent = false;

  hostData() {
    const themedClasses = this.translucent
      ? createThemedClasses(this.mode, this.color, 'card-header-translucent')
      : {};

    return {
      class: {
        ...themedClasses,
        ...createThemedClasses(this.mode, this.color, 'card-content')
      }
    };
  }
}
