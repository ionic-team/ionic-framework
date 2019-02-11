import { Component, ComponentInterface, Event, Prop } from '@stencil/core';
import { EventEmitter } from 'ionicons/dist/types/stencil.core';

@Component({
  tag: 'ion-slide',
  styleUrl: 'slide.scss'
})
export class Slide implements ComponentInterface {

  /** @internal */
  @Event() ionSlideChanged!: EventEmitter<void>;

  /**
   * Indicates the direction of the component.
   * Defaults to the value of the `dir` attribute on the html element.
   */
  @Prop({ reflectToAttr: true }) dir: string = document.dir;

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
