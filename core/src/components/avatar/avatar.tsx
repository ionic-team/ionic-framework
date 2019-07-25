import { Component, ComponentInterface, Host, h } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';

@Component({
  tag: 'ion-avatar',
  styleUrls: {
    ios: 'avatar.ios.scss',
    md: 'avatar.md.scss'
  },
  shadow: true
})
export class Avatar implements ComponentInterface {

  render() {
    return (
      <Host class={getIonMode(this)}>
        <slot></slot>
      </Host>
    );
  }

}
