import type { ComponentInterface } from '@stencil/core';
import { Component, Host, h } from '@stencil/core';

import { getIonStylesheet } from '../../global/ionic-global';

@Component({
  tag: 'ion-thumbnail',
  styleUrl: 'thumbnail.scss',
  shadow: true,
})
export class Thumbnail implements ComponentInterface {
  render() {
    return (
      <Host class={getIonStylesheet(this)}>
        <slot></slot>
      </Host>
    );
  }
}
