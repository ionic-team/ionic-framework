import type { ComponentInterface } from '@stencil/core';
import { Component, Element, Host, Prop, h } from '@stencil/core';
import { printIonWarning } from '@utils/logging';
import { createColorClasses } from '@utils/theme';

import { config } from '../../global/config';
import type { Color } from '../../interface';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines the platform behaviors of the component.
 */
@Component({
  tag: 'ion-chip',
  styleUrl: 'chip.scss',
  shadow: true,
})
export class Chip implements ComponentInterface {
  @Element() el!: HTMLElement;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop({ reflect: true }) color?: Color;

  /**
   * @deprecated - Use fill="outline" instead
   *
   * Display an outline style button.
   */
  @Prop() outline = false;

  /**
   * The fill for the chip.
   *
   * Set to `"outline"` for a chip with a border and background.
   * Set to `"solid"` for a chip with a background.
   *
   * Defaults to `"solid"` if no fill is set in the custom theme config.
   */
  @Prop() fill?: 'outline' | 'solid';

  /**
   * If `true`, the user cannot interact with the chip.
   */
  @Prop() disabled = false;

  /**
   * Set to `"bold"` for a chip with vibrant, bold colors or to `"subtle"` for
   * a chip with muted, subtle colors.
   *
   * Defaults to `"subtle"` if no hue is set in the custom theme config.
   */
  @Prop() hue?: 'bold' | 'subtle';

  /**
   * Set to `"soft"` for a chip with slightly rounded corners,
   * `"round"` for a chip with fully rounded corners,
   * or `"rectangular"` for a chip without rounded corners.
   *
   * Defaults to `"round"` if no shape is set in the custom
   * theme config.
   */
  @Prop() shape?: 'soft' | 'round' | 'rectangular';

  /**
   * Set to `"small"` for a chip with less height and padding.
   *
   * Defaults to `"large"` if no size is set in the custom
   * theme config.
   */
  @Prop() size?: 'small' | 'large';

  /**
   * Set the fill based on the custom theme config
   */
  get fillValue(): string {
    // Check if the deprecated outline prop is used
    if (this.outline) {
      printIonWarning(`[ion-chip] - The "outline" prop is deprecated. Use fill="outline" instead.`, this.el);

      return 'outline';
    }

    const fillConfig = config.getObjectValue('IonChip.fill');
    const fill = this.fill || fillConfig || 'solid';

    return fill;
  }

  /**
   * Set the hue based on the custom theme config
   */
  get hueValue(): string {
    const hueConfig = config.getObjectValue('IonChip.hue');
    const hue = this.hue || hueConfig || 'subtle';

    return hue;
  }

  /**
   * Set the shape based on the custom theme config
   */
  get shapeValue(): string {
    const shapeConfig = config.getObjectValue('IonChip.shape');
    const shape = this.shape || shapeConfig || 'round';

    return shape;
  }

  /**
   * Set the size based on the custom theme config
   */
  get sizeValue(): string {
    const sizeConfig = config.getObjectValue('IonChip.size');
    const size = this.size || sizeConfig || 'large';

    return size;
  }

  render() {
    const { hueValue, shapeValue, sizeValue, fillValue } = this;
    const useRippleEffect = config.getBoolean('rippleEffect', false);

    return (
      <Host
        aria-disabled={this.disabled ? 'true' : null}
        class={createColorClasses(this.color, {
          [`chip-fill-${fillValue}`]: true,
          [`chip-hue-${hueValue}`]: true,
          [`chip-shape-${shapeValue}`]: true,
          [`chip-size-${sizeValue}`]: true,
          'chip-disabled': this.disabled,
          'ion-activatable': true,
          'ion-focusable': !this.disabled,
        })}
      >
        <slot></slot>
        {useRippleEffect && <ion-ripple-effect></ion-ripple-effect>}
      </Host>
    );
  }
}
