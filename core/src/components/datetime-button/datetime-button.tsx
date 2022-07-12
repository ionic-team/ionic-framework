import type { ComponentInterface } from '@stencil/core';
import { Component, Host, Prop, h } from '@stencil/core';

import type { Color } from '../../interface';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
@Component({
  tag: 'ion-datetime-button',
  styleUrl: 'datetime-button.scss',
  shadow: true,
})
export class DatetimeButton implements ComponentInterface {
  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop({ reflect: true }) color?: Color = 'primary';

  /**
   * If `true`, the user cannot interact with the button.
   */
  @Prop({ reflect: true }) disabled = false;

  /**
   * The ID of the `ion-datetime` instance
   * associated with the datetime button.
   */
  @Prop() datetime?: string;

  render() {
    return (
      <Host></Host>
    );
  }
}
