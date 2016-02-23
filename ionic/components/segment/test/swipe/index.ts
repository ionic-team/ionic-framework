import {Validators, Control, ControlGroup} from 'angular2/common';
import {Http} from 'angular2/http';
import {App, Page, IonicApp, NavController} from 'ionic-angular';


@Page({
  templateUrl: 'main.html',
})
class SegmentPage {
  constructor(app: IonicApp) {
    this.app = app;

    this.selectedSegment = "first";
    this.slides = [
      {
        id: "first",
        title: "First Slide"
      },
      {
        id: "second",
        title: "Second Slide"
      },
      {
        id: "third",
        title: "Third Slide"
      }
    ];
  }

  onSegmentChanged(segmentButton) {
    console.log("Segment changed to", segmentButton.value);

    this.sliderComponent = this.app.getComponent('loopSlider');
    const selectedIndex = this.slides.findIndex((slide) => {
      return slide.id === segmentButton.value;
    });
    this.sliderComponent.slider.slideTo(selectedIndex);
  }

  onSlideChanged(slider) {
    console.log('Slide changed', slider);

    const currentSlide = this.slides[slider.activeIndex];
    this.selectedSegment = currentSlide.id;
  }
}


@App({
  pages: [SegmentPage],
  template: `<ion-nav [root]="root"></ion-nav>`
})
class MyApp {
  constructor() {
    this.root = SegmentPage;
  }
}
