import { Component, ComponentInterface, Host, Prop, h } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';
import { Color } from '../../interface';
import { createColorClasses } from '../../utils/theme';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
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
  @Prop({ reflect: true }) color?: Color;

  /**
   * If `true`, the card header will be translucent.
   * Only applies when the mode is `"ios"` and the device supports
   * [`backdrop-filter`](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter#Browser_compatibility).
   */
  @Prop() translucent = false;

  render() {
    const mode = getIonMode(this);
    return (
      <Host
        class={createColorClasses(this.color, {
          'card-header-translucent': this.translucent,
          'ion-inherit-color': true,
          [mode]: true
        })}
      >
        <slot></slot>
      </Host>
    );
  }

}
