import type { ComponentInterface } from '@stencil/core';
import { Component, Host, Prop, h } from '@stencil/core';
import { createColorClasses } from '@utils/theme';

import { getIonMode } from '../../global/ionic-global';
import type { Color } from '../../interface';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
@Component({
  tag: 'ion-chip',
  styleUrls: {
    ios: 'chip.ios.scss',
    md: 'chip.md.scss',
  },
  shadow: true,
})
export class Chip implements ComponentInterface {
  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop({ reflect: true }) color?: Color;

  /**
   * Display an outline style button.
   */
  @Prop() outline = false;

  /**
   * If `true`, the user cannot interact with the chip.
   */
  @Prop() disabled = false;

  render() {
    const mode = getIonMode(this);

    return (
      <Host
        aria-disabled={this.disabled ? 'true' : null}
        class={createColorClasses(this.color, {
          [mode]: true,
          'chip-outline': this.outline,
          'chip-disabled': this.disabled,
          'ion-activatable': true,
        })}
      >
        <slot></slot>
        {mode === 'md' && <ion-ripple-effect></ion-ripple-effect>}
      </Host>
    );
  }
}
