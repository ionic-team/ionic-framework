import { Component, ComponentInterface, Prop, h } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';
import { Color } from '../../interface';
import { createColorClasses } from '../../utils/theme';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
@Component({
  tag: 'ion-card-subtitle',
  styleUrls: {
    ios: 'card-subtitle.ios.scss',
    md: 'card-subtitle.md.scss'
  },
  shadow: true
})
export class CardSubtitle implements ComponentInterface {
  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop() color?: Color;

  hostData() {
    const mode = getIonMode(this);
    return {
      class: {
        ...createColorClasses(this.color),
        [mode]: true
      },
      'role': 'heading',
      'aria-level': '3'
    };
  }

  render() {
    return <slot></slot>;
  }
}
