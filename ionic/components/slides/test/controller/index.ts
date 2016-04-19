import {ViewChild} from 'angular2/core';
import {App, Slides} from 'ionic-angular';


@App({
  templateUrl: 'main.html'
})
class MyApp {
  mySlideOptions: any;
  @ViewChild(Slides) slider: Slides;

  constructor() {
    console.log("here");
    this.mySlideOptions = {
      initialSlide: 1,
      autoplay: 1000
    };
  }

  ngAfterViewInit() {

  }

  onSlideChanged() {
    console.log("Slide Changed");
    let isEnd = this.slider.isEnd();
    console.log("This is the last slide?", isEnd);
  }

  goToPrevSlide() {
    this.slider.slidePrev(5000, false);
  }

  goToNextSlide() {
    this.slider.slideNext();
  }

  goToSlide(index) {
    console.log(index);
    this.slider.slideTo(index, 500, false);
  }

  getIndex() {
    let index = this.slider.getActiveIndex();
    console.log("Current Index is", index);
  }

  getLength() {
    let length = this.slider.length();
    console.log("Current Length is", length);
  }
}
