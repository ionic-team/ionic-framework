import {Component, ViewChild} from '@angular/core';
import {ionicBootstrap, Slides} from '../../../../../src';


@Component({
  templateUrl: 'main.html'
})
class E2EApp {
  slides: any[];
  @ViewChild('loopSlider') loopSlider: Slides;
  startingIndex: number;
  myTopSlideOptions: any;

  constructor() {
    this.slides = [
      {
        name: "Slide 1",
        class: "yellow"
      },
      {
        name: "Slide 2",
        class: "red"
      },
      {
        name: "Slide 3",
        class: "blue"
      }
    ];

    this.myTopSlideOptions = {
      initialSlide: 2,
      loop: true
    };

  }

  onSlideChanged(slider: Slides) {
    console.log('Slide changed', slider);
  }

  ngAfterViewInit() {
    console.log(this.loopSlider);
  }

}

ionicBootstrap(E2EApp);
