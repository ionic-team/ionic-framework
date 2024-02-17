import type { ComponentInterface } from '@stencil/core';
import { Component, Host, h } from '@stencil/core';

import { getIonTheme } from '../../global/ionic-global';

@Component({
  tag: 'ion-avatar',
  styleUrls: {
    ios: 'avatar.ios.scss',
    md: 'avatar.md.scss',
    ionic: 'avatar.md.scss',
  },
  shadow: true,
})
export class Avatar implements ComponentInterface {
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
