import { Component, ComponentInterface, Host, Prop, getMode, h } from '@stencil/core';

import { Color, Mode } from '../../interface';
import { createColorClasses } from '../../utils/theme';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
@Component({
  tag: 'ion-chip',
  styleUrls: {
    ios: 'chip.ios.scss',
    md: 'chip.md.scss'
  },
  shadow: true
})
export class Chip implements ComponentInterface {

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop() color?: Color;

  /**
   * Display an outline style button.
   */
  @Prop() outline = false;

  render() {
    return (
      <Host
        class={{
          ...createColorClasses(this.color),
          'chip-outline': this.outline,
          'ion-activatable': true,
        }}
      >
        <slot></slot>
        {getMode<Mode>(this) === 'md' && <ion-ripple-effect></ion-ripple-effect>}
      </Host>
    );
  }
}
