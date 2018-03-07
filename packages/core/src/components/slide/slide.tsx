import { Component } from '@stencil/core';


@Component({
  tag: 'ion-slide',
  styleUrl: 'slide.scss'
})
export class Slide {

  hostData() {
    return {
      class: {
        'slide-zoom': true,
        'swiper-slide': true
      }
    };
  }

}
