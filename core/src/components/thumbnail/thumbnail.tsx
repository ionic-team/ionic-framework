import type { ComponentInterface } from '@stencil/core';
import { Component, Host, h } from '@stencil/core';

import { getIonTheme } from '../../global/ionic-global';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines the platform behaviors of components.
 * @virtualProp {"ios" | "md" | "ionic"} theme - The theme determines the visual appearance of the component.
 */
@Component({
  tag: 'ion-thumbnail',
  styleUrl: 'thumbnail.scss',
  shadow: true,
})
export class Thumbnail implements ComponentInterface {
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
