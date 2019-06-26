import { Component, ComponentInterface, Event } from '@stencil/core';
import { EventEmitter } from 'ionicons/dist/types/stencil.core';

import { getIonMode } from '../../global/ionic-global';

@Component({
  tag: 'ion-slide',
  styleUrl: 'slide.scss'
})
export class Slide implements ComponentInterface {

  /** @internal */
  @Event() ionSlideChanged!: EventEmitter<void>;

  componentDidLoad() {
    this.ionSlideChanged.emit();
  }

  componentDidUnload() {
    this.ionSlideChanged.emit();
  }

  hostData() {
    const mode = getIonMode(this);

    return {
      class: {
        [mode]: true,
        'swiper-slide': true,
        'swiper-zoom-container': true
      }
    };
  }
}
