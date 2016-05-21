import {Validators, Control, ControlGroup} from '@angular/common';
import {Http} from '@angular/http';
import {ViewChild} from '@angular/core';
import {App, Page, NavController, Slides} from '../../../../../src';


@Page({
  templateUrl: 'main.html',
})
class SegmentPage {
  @ViewChild('loopSlider') sliderComponent: Slides;

  selectedSegment = "first";
  slides = [
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

  constructor() {

  }

  onSegmentChanged(segmentButton) {
    console.log("Segment changed to", segmentButton.value);

    const selectedIndex = this.slides.findIndex((slide) => {
      return slide.id === segmentButton.value;
    });
    this.sliderComponent.slideTo(selectedIndex);
  }

  onSlideChanged(slider) {
    console.log('Slide changed', slider);

    const currentSlide = this.slides[slider.activeIndex];
    this.selectedSegment = currentSlide.id;
  }
}


@App({
  template: `<ion-nav [root]="root"></ion-nav>`
})
class MyApp {
  root = SegmentPage;

  constructor() {

  }
}
