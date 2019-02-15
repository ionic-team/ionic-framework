import { Component, ComponentInterface, Prop, h } from '@stencil/core';

import { Color } from '../../interface';
import { createColorClasses } from '../../utils/theme';

/**
 * @virtualProp {'md' | 'ios'} mode - The mode determines which platform styles to use.
 */
@Component({
  tag: 'ion-card-header',
  styleUrls: {
    ios: 'card-header.ios.scss',
    md: 'card-header.md.scss'
  },
  shadow: true
})
export class CardHeader implements ComponentInterface {
  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop() color?: Color;

  /**
   * If `true`, the card header will be translucent.
   */
  @Prop() translucent = false;

  hostData() {
    return {
      class: {
        ...createColorClasses(this.color),
        'card-header-translucent': this.translucent,
      }
    };
  }

  render() {
    return <slot></slot>;
  }
}
