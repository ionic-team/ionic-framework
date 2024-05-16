import type { ComponentInterface } from '@stencil/core';
import { Component, Host, Prop, h } from '@stencil/core';
import { printIonWarning } from '@utils/logging';
import { createColorClasses } from '@utils/theme';

import { getIonTheme } from '../../global/ionic-global';
import type { Color } from '../../interface';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines the platform behaviors of the component.
 * @virtualProp {"ios" | "md" | "ionic"} theme - The theme determines the visual appearance of the component.
 */
@Component({
  tag: 'ion-chip',
  styleUrls: {
    ios: 'chip.ios.scss',
    md: 'chip.md.scss',
    ionic: 'chip.ionic.scss',
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

  /**
   * Define the Chip corner shape, when using the Ionic Theme.
   */
  @Prop() shape?: 'round' | 'rectangular';

  /**
   * Set to `"small"` for a chip with less height and padding.
   *
   * Defaults to `"large"` for the ionic theme, and  undefined for all other themes.
   */
  @Prop() size?: 'small' | 'large';

  private getSize() {
    const theme = getIonTheme(this);
    const { size } = this;
    if (theme !== 'ionic') {
      printIonWarning(`The "${size}" size is not supported in the ${theme} theme.`);
      return undefined;
    }

    // TODO(ROU-10695): remove the size !== undefined when we add support for the `ios` and `md` modes.
    if (size !== undefined) {
      return size;
    }

    // Fallback to the large size, which is the default size for the ionic theme.
    return 'large';
  }

  render() {
    const { shape } = this;
    const theme = getIonTheme(this);
    const size = this.getSize();

    return (
      <Host
        aria-disabled={this.disabled ? 'true' : null}
        class={createColorClasses(this.color, {
          [theme]: true,
          // TODO(FW-6120): remove the theme==='ionic' when we add support for the `ios` and `md` modes.
          [`chip-${shape}`]: theme === 'ionic' && shape !== undefined,
          'chip-outline': this.outline,
          'chip-disabled': this.disabled,
          'ion-activatable': true,
          'ion-focusable': !this.disabled,
          [`chip-${size}`]: true,
        })}
      >
        <slot></slot>
        {theme === 'md' && <ion-ripple-effect></ion-ripple-effect>}
      </Host>
    );
  }
}
