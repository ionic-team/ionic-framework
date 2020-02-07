import { Component, ComponentInterface, Host, h } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';

@Component({
  tag: 'ion-row',
  styleUrl: 'row.scss',
  shadow: true
})
export class Row implements ComponentInterface {

  render() {
    return (
      <Host class={getIonMode(this)}>
        <slot></slot>
      </Host>
    );
  }
}
