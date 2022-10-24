import type { ComponentInterface } from '@stencil/core';
import { Component, Host, h } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';

@Component({
  tag: 'ion-slide',
  styleUrl: 'slide.scss',
})
export class Slide implements ComponentInterface {
  render() {
    const mode = getIonMode(this);
    return (
      <Host
        class={{
          [mode]: true,
          'swiper-slide': true,
          'swiper-zoom-container': true,
        }}
      ></Host>
    );
  }
}
