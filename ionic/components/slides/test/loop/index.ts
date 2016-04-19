import {ViewChild} from 'angular2/core';
import {App, Slides} from 'ionic-angular';

@App({
  templateUrl: 'main.html'
})
class MyApp {
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
