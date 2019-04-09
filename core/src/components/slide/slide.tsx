import { Component, ComponentInterface, Event } from '@stencil/core';
import { EventEmitter } from 'ionicons/dist/types/stencil.core';

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

  render() {
    return (
      <div class="swiper-zoom-container">
        <slot></slot>
      </div>
    );
  }

  hostData() {
    return {
      class: {
        'swiper-slide': true
      }
    };
  }
}
