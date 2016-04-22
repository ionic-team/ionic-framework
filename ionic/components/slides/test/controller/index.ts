import {ViewChild} from 'angular2/core';
import {App, Page, Slides} from 'ionic-angular';


@App({
  templateUrl: 'main.html'
})
class MyPage {
  @ViewChild('mySlider') slider: Slides;
  mySlideOptions = {
    initialSlide: 1,
    loop: false
  };

  ngAfterViewInit() {

  }

  onSlideChanged() {
    let previousIndex = this.slider.getPreviousIndex();
    let currentIndex = this.slider.getActiveIndex();
    console.log("Previous index is", previousIndex, "Current index is", currentIndex);
  }

  goToPrevSlide() {
    this.slider.slidePrev();
  }

  goToNextSlide() {
    this.slider.slideNext();
  }

  goToSlide(index) {
    this.slider.slideTo(index);
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

@App({
  template: `<ion-nav [root]="root"></ion-nav>`
})
class E2EApp {
  root: Page = MyPage;
}
