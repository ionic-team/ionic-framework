import type { ComponentInterface } from '@stencil/core';
import { Component, Host, Prop, h } from '@stencil/core';
import { createColorClasses } from '@utils/theme';

import { config } from '../../global/config';
import type { Color } from '../../interface';

import type { IonTextHue } from './text.interfaces';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines the platform behaviors of the component.
 */
@Component({
  tag: 'ion-text',
  styleUrl: 'text.scss',
  shadow: true,
})
export class Text implements ComponentInterface {
  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop({ reflect: true }) color?: Color;

  /**
   * Set to `"bold"` for a text with vibrant, bold colors or to `"subtle"` for
   * a text with muted, subtle colors.
   *
   * Defaults to `"bold"` if both the hue property and theme config are unset.
   */
  @Prop() hue?: IonTextHue;

  /**
   * Gets the text hue. Uses the `hue` property if set, otherwise
   * checks the theme config and falls back to 'bold' if neither is provided.
   */
  get hueValue(): IonTextHue {
    const hueConfig = config.getObjectValue('IonText.hue', 'bold') as IonTextHue;

    return this.hue || hueConfig;
  }

  render() {
    const { hueValue } = this;
    return (
      <Host
        class={createColorClasses(this.color, {
          [`text-hue-${hueValue}`]: true,
        })}
      >
        <slot></slot>
      </Host>
    );
  }
}
