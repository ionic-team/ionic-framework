import { Component, ComponentInterface, Prop, h } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';
import { Color } from '../../interface';
import { createColorClasses } from '../../utils/theme';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
@Component({
  tag: 'ion-list-header',
  styleUrls: {
    ios: 'list-header.ios.scss',
    md: 'list-header.md.scss'
  },
  shadow: true
})
export class ListHeader implements ComponentInterface {

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
        [mode]: true,
      }
    };
  }

  render() {
    return <slot></slot>;
  }
}
