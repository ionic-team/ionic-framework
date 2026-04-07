import type { ComponentInterface } from '@stencil/core';
import { Component, Element, Host, Prop, h } from '@stencil/core';
import { createColorClasses } from '@utils/theme';

import { config } from '../../global/config';
import type { Color } from '../../interface';

import type { IonBadgeHue, IonBadgeShape, IonBadgeSize, IonBadgeVerticalPosition } from './badge.interfaces';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines the platform behaviors of the component.
 * @virtualProp {"ios" | "md" | "ionic"} theme - The theme determines the visual appearance of the component.
 */
@Component({
  tag: 'ion-badge',
  styleUrl: 'badge.scss',
  shadow: true,
})
export class Badge implements ComponentInterface {
  @Element() el!: HTMLElement;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop({ reflect: true }) color?: Color;

  /**
   * Set to `"bold"` for a badge with vibrant, bold colors or to `"subtle"` for
   * a badge with muted, subtle colors.
   *
   * Defaults to `"bold"` if both the hue property and theme config are unset.
   */
  @Prop() hue?: IonBadgeHue;

  /**
   * Set to `"crisp"` for a badge with even slightly rounded corners,
   * `"soft"` for a badge with slightly rounded corners,
   * `"round"` for a badge with fully rounded corners,
   * or `"rectangular"` for a badge without rounded corners.
   *
   * Defaults to `"soft"` if both the shape property and theme config are unset.
   */
  @Prop() shape?: IonBadgeShape;

  /**
   * Set to `"small"` for a smaller size.
   * Set to `"medium"` for a medium size.
   * Set to `"large"` for a larger size.
   *
   * Defaults to `"small"` if both the size property and theme config are unset.
   */
  @Prop() size?: IonBadgeSize;

  /**
   * Set to `"top"` to position the badge on top right absolute position of the parent element.
   * Set to `"bottom"` to position the badge on bottom right absolute position of the parent element.
   */
  @Prop() vertical?: IonBadgeVerticalPosition;

  /**
   * Gets the badge shape. Uses the `shape` property if set, otherwise
   * checks the theme config and falls back to 'soft' if neither is provided.
   */
  get shapeValue(): IonBadgeShape {
    const shapeConfig = config.getObjectValue('IonBadge.shape', 'soft') as IonBadgeShape;
    const shape = this.shape || shapeConfig;

    return shape;
  }

  /**
   * Gets the badge size. Uses the `size` property if set, otherwise
   * checks the theme config and falls back to 'small' if neither is provided.
   */
  get sizeValue(): IonBadgeSize {
    const sizeConfig = config.getObjectValue('IonBadge.size', 'small') as IonBadgeSize;
    const size = this.size || sizeConfig;

    return size;
  }

  /**
   * Gets the badge hue. Uses the `hue` property if set, otherwise
   * checks the theme config and falls back to 'bold' if neither is provided.
   */
  get hueValue(): IonBadgeHue {
    const hueConfig = config.getObjectValue('IonBadge.hue', 'bold') as IonBadgeHue;
    const hue = this.hue || hueConfig;

    return hue;
  }

  render() {
    const { hueValue, shapeValue, sizeValue, color } = this;

    return (
      <Host
        class={createColorClasses(color, {
          [`badge-hue-${hueValue}`]: true,
          [`badge-shape-${shapeValue}`]: true,
          [`badge-size-${sizeValue}`]: true,
        })}
      >
        <slot></slot>
      </Host>
    );
  }
}
