import type { ComponentInterface } from '@stencil/core';
import { Component, Host, h } from '@stencil/core';

import { getIonTheme } from '../../global/ionic-global';

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
