import type { ComponentInterface } from '@stencil/core';
import { Component, Element, Host, Prop, h } from '@stencil/core';
import { printIonWarning } from '@utils/logging';
import { createColorClasses } from '@utils/theme';

import { config } from '../../global/config';
import type { Color } from '../../interface';

import type { IonChipFill, IonChipHue, IonChipSize, IonChipShape } from './chip.interfaces';

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
   * Display an outline style button.
   *
   * @deprecated - Use fill="outline" instead
   */
  @Prop() outline = false;

  /**
   * The fill for the chip.
   *
   * Set to `"outline"` for a chip with a border and background.
   * Set to `"solid"` for a chip with a background.
   *
   * Defaults to `"solid"` if both the fill property and theme config are unset.
   */
  @Prop() fill?: IonChipFill;

  /**
   * If `true`, the user cannot interact with the chip.
   */
  @Prop() disabled = false;

  /**
   * Set to `"bold"` for a chip with vibrant, bold colors or to `"subtle"` for
   * a chip with muted, subtle colors.
   *
   * Defaults to `"subtle"` if both the hue property and theme config are unset.
   */
  @Prop() hue?: IonChipHue;

  /**
   * Set to `"soft"` for a chip with slightly rounded corners,
   * `"round"` for a chip with fully rounded corners,
   * or `"rectangular"` for a chip without rounded corners.
   *
   * Defaults to `"round"` if both the shape property and theme config are unset.
   */
  @Prop() shape?: IonChipShape;

  // TODO(FW-6266): Determine if `medium` size is needed.
  /**
   * Set to `"small"` for a chip with less height and padding.
   *
   * Defaults to `"large"` if both the size property and theme config are unset.
   */
  @Prop() size?: IonChipSize;

  componentDidLoad() {
    if (this.outline) {
      printIonWarning(
        `[ion-chip] - The "outline" attribute has been deprecated in favor of the "fill" attribute. Please use the "fill" attribute with the value "outline" instead.`,
        this.el
      );
    }
  }

  /**
   * Gets the chip fill. Uses the `fill` property if set, otherwise
   * checks the theme config. Defaults to `solid` if neither is set.
   */
  get fillValue(): IonChipFill {
    const fillConfig = config.getObjectValue('IonChip.fill', 'solid') as IonChipFill;
    const fill = this.fill || (this.outline ? 'outline' : undefined) || fillConfig;

    return fill;
  }

  /**
   * Gets the chip hue. Uses the `hue` property if set, otherwise
   * checks the theme config. Defaults to `subtle` if neither is set.
   */
  get hueValue(): IonChipHue {
    const hueConfig = config.getObjectValue('IonChip.hue', 'subtle') as IonChipHue;
    const hue = this.hue || hueConfig;

    return hue;
  }

  /**
   * Gets the chip shape. Uses the `shape` property if set, otherwise
   * checks the theme config. Defaults to `round` if neither is set.
   */
  get shapeValue(): IonChipShape {
    const shapeConfig = config.getObjectValue('IonChip.shape', 'round') as IonChipShape;
    const shape = this.shape || shapeConfig;

    return shape;
  }

  /**
   * Gets the chip size. Uses the `size` property if set, otherwise
   * checks the theme config. Defaults to `large` if neither is set.
   */
  get sizeValue(): IonChipSize {
    const sizeConfig = config.getObjectValue('IonChip.size', 'large') as IonChipSize;
    const size = this.size || sizeConfig;

    return size;
  }

  render() {
    const { fillValue, hueValue, shapeValue, sizeValue } = this;
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
