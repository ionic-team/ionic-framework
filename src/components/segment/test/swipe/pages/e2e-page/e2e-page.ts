import { Component } from '@angular/core';
import { SegmentButton } from '../../../../../..';


@Component({
  templateUrl: 'main.html',
})
export class E2EPage {

  selectedSegment = 'first';
  slides = [
    {
      id: 'first',
      title: 'First Slide'
    },
    {
      id: 'second',
      title: 'Second Slide'
    },
    {
      id: 'third',
      title: 'Third Slide'
    }
  ];

  constructor() {}

  onSegmentChanged(segmentButton: SegmentButton) {
    console.log('Segment changed to', segmentButton.value);

    // const selectedIndex = this.slides.findIndex((slide) => {
    //   return slide.id === segmentButton.value;
    // });
    // this.sliderComponent.slideTo(selectedIndex);
  }

  onSlideChanged() {
    // const currentSlide = this.slides[s.getActiveIndex()];
    // this.selectedSegment = currentSlide.id;
  }
}
