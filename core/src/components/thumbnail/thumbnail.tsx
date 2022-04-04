import type { ComponentInterface } from '@stencil/core';
import { Component, Host, h } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';

@Component({
  tag: 'ion-thumbnail',
  styleUrl: 'thumbnail.scss',
  shadow: true,
})
export class Thumbnail implements ComponentInterface {
  render() {
    return (
      <Host class={getIonMode(this)}>
        <slot></slot>
      </Host>
    );
  }
}
