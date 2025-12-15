import type { ComponentInterface } from '@stencil/core';
import { Component, Host, Prop, h } from '@stencil/core';
import { createColorClasses } from '@utils/theme';

import { getIonTheme } from '../../global/ionic-global';
import type { Color } from '../../interface';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines the platform behaviors of the component.
 * @virtualProp {"ios" | "md" | "ionic"} theme - The theme determines the visual appearance of the component.
 */
@Component({
  tag: 'ion-chip',
  styleUrl: 'chip.base.scss',
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
   * Set to `"bold"` for a chip with vibrant, bold colors or to `"subtle"` for
   * a chip with muted, subtle colors.
   *
   * Defaults to `"subtle"`.
   */
  @Prop() hue?: 'bold' | 'subtle' = 'subtle';

  /**
   * Set to `"soft"` for a chip with slightly rounded corners, `"round"` for a chip with fully
   * rounded corners, or `"rectangular"` for a chip without rounded corners.
   * Defaults to `"round"` for the `"ionic"` theme and `"soft"` for all other themes.
   */
  @Prop() shape?: 'soft' | 'round' | 'rectangular';

  /**
   * Set the shape based on the theme
   */
  private getShape(): string {
    const theme = getIonTheme(this);
    const { shape } = this;

    if (shape === undefined) {
      return theme === 'ionic' ? 'round' : 'soft';
    }

    return shape;
  }

  /**
   * Set to `"small"` for a chip with less height and padding.
   *
   * Defaults to `"large"` for the ionic theme, and  undefined for all other themes.
   */
  @Prop() size?: 'small' | 'medium' | 'large' = 'medium';

  render() {
    const { hue, size } = this;
    const theme = getIonTheme(this);
    const shape = this.getShape();

    return (
      <Host
        aria-disabled={this.disabled ? 'true' : null}
        class={createColorClasses(this.color, {
          [theme]: true,
          [`chip-${shape}`]: true,
          'chip-outline': this.outline,
          'chip-disabled': this.disabled,
          'ion-activatable': true,
          'ion-focusable': !this.disabled,
          [`chip-${size}`]: size !== undefined,
          [`chip-${hue}`]: hue !== undefined,
        })}
      >
        <slot></slot>
        {theme === 'md' && <ion-ripple-effect></ion-ripple-effect>}
      </Host>
    );
  }
}
