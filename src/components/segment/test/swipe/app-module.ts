import { Component, ViewChild, NgModule } from '@angular/core';
import { IonicApp, IonicModule, Slides, SegmentButton } from '../../../..';


@Component({
  templateUrl: 'main.html',
})
export class SegmentPage {
  @ViewChild('loopSlider') sliderComponent: Slides;

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

  constructor() {

  }

  onSegmentChanged(segmentButton: SegmentButton) {
    console.log('Segment changed to', segmentButton.value);

    const selectedIndex = this.slides.findIndex((slide) => {
      return slide.id === segmentButton.value;
    });
    this.sliderComponent.slideTo(selectedIndex);
  }

  onSlideChanged(slider: any) {
    console.log('Slide changed', slider);

    const currentSlide = this.slides[slider.activeIndex];
    this.selectedSegment = currentSlide.id;
  }
}


@Component({
  template: `<ion-nav [root]="root"></ion-nav>`
})
export class E2EApp {
  root = SegmentPage;
}

@NgModule({
  declarations: [
    E2EApp,
    SegmentPage
  ],
  imports: [
    IonicModule.forRoot(E2EApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    E2EApp,
    SegmentPage
  ]
})
export class AppModule {}
