import type { ComponentInterface } from '@stencil/core';
import { Component, Host, h } from '@stencil/core';

import { getIonStylesheet } from '../../global/ionic-global';

@Component({
  tag: 'ion-avatar',
  styleUrls: {
    base: 'avatar.scss',
    ios: 'avatar.ios.scss',
    md: 'avatar.md.scss',
  },
  shadow: true,
})
export class Avatar implements ComponentInterface {
  render() {
    return (
      <Host class={getIonStylesheet(this)}>
        <slot></slot>
      </Host>
    );
  }
}
