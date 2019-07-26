import { Component, ComponentInterface, Host, h } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';

@Component({
  tag: 'ion-buttons',
  styleUrls: {
    ios: 'buttons.ios.scss',
    md: 'buttons.md.scss'
  },
  scoped: true,
})
export class Buttons implements ComponentInterface {

  render() {
    return (
      <Host class={getIonMode(this)}>
      </Host>
    );
  }
}
