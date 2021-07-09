import { Component, ComponentInterface, Host, Prop, h } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';
import { Color } from '../../interface';
import { createColorClasses } from '../../utils/theme';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
@Component({
  tag: 'ion-badge',
  styleUrls: {
    ios: 'badge.md.scss',
    md: 'badge.md.scss'
  },
  shadow: true
})
export class Badge implements ComponentInterface {
  // custom
  @Prop() dsSize?: 'sm' | 'md' | 'lg';
  @Prop() fill?: 'outline';
  @Prop({ reflect: true }) invert = false;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop() color?: Color;

  render() {
    const mode = getIonMode(this);
    return (
      <Host
        class={createColorClasses(this.color, {
          [mode]: true,
          'invert': this.invert,
        })}
      >
        <slot></slot>
      </Host>
    );
  }
}
