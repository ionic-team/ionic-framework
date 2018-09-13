import { Component, Event } from '@stencil/core';
import { EventEmitter } from 'ionicons/dist/types/stencil.core';

@Component({
  tag: 'ion-slide',
  styleUrl: 'slide.scss'
})
export class Slide {

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
        'swiper-slide': true
      }
    };
  }
}
