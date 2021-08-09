import { Component, ComponentInterface, Host, Prop, h } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';
import { Color, Neutral } from '../../interface';
import { createColorClasses } from '../../utils/theme';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
@Component({
  tag: 'ion-chip',
  styleUrls: {
    ios: 'chip.md.scss',
    md: 'chip.md.scss'
  },
  shadow: true
})
export class Chip implements ComponentInterface {
  /**
   * Define a cor neutra do componente.
   */
   @Prop() neutral?: Neutral;

   /**
    * Define a variação do componente.
    */
   @Prop() dsName?: 'secondary';

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

  /**
   * If `true`, the user cannot interact with the chip.
   */
  @Prop() disabled = false;

  render() {
    const { color, neutral, dsName } = this;
    const mode = getIonMode(this);

    return (
      <Host
        aria-disabled={this.disabled ? 'true' : null}
        class={createColorClasses(color, {
          [mode]: true,
          'chip-outline': this.outline,
          'chip-disabled': this.disabled,
          'ion-activatable': false,
          'med-chip': true,
          [`med-chip--${dsName}`]: dsName !== undefined,
        }, neutral)}
      >
        <slot></slot>
        {/* {mode === 'md' && <ion-ripple-effect></ion-ripple-effect>} */}
      </Host>
    );
  }
}
