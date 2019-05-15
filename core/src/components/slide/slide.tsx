import { Component, ComponentInterface, Event } from '@stencil/core';
import { EventEmitter } from 'ionicons/dist/types/stencil.core';

import { Mode } from '../../interface';

@Component({
  tag: 'ion-slide',
  styleUrl: 'slide.scss'
})
export class Slide implements ComponentInterface {
  mode!: Mode;

  /** @internal */
  @Event() ionSlideChanged!: EventEmitter<void>;

  componentDidLoad() {
    this.ionSlideChanged.emit();
  }

  componentDidUnload() {
    this.ionSlideChanged.emit();
  }

  hostData() {
    return {
      class: {
        [`${this.mode}`]: true,
        'swiper-slide': true,
        'swiper-zoom-container': true
      }
    };
  }
}
