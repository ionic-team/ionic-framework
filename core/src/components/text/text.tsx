import type { ComponentInterface } from '@stencil/core';
import { Component, Host, Prop, h } from '@stencil/core';

import { getIonStylesheet } from '../../global/ionic-global';
import type { Color } from '../../interface';
import { createColorClasses } from '../../utils/theme';

/**
 * @virtualProp {true | false} useBase - useBase determines if base components is enabled.
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
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

  render() {
    const mode = getIonStylesheet(this);
    return (
      <Host
        class={createColorClasses(this.color, {
          [mode]: true,
        })}
      >
        <slot></slot>
      </Host>
    );
  }
}
