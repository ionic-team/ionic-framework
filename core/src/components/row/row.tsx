import type { ComponentInterface } from '@stencil/core';
import { Component, Host, h } from '@stencil/core';

import { getIonTheme } from '../../global/ionic-global';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines the platform behaviors of the component.
 * @virtualProp {"ios" | "md" | "ionic"} theme - The theme determines the visual appearance of the component.
 */
@Component({
  tag: 'ion-row',
  styleUrl: 'row.scss',
  shadow: true,
})
export class Row implements ComponentInterface {
  render() {
    const theme = getIonTheme(this);

    return (
      <Host
        class={{
          [theme]: true,
        }}
      >
        <slot></slot>
      </Host>
    );
  }
}
