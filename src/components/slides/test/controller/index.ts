import { Component, ViewChild } from '@angular/core';
import { ionicBootstrap, Slides } from '../../../../../src';


@Component({
  templateUrl: 'main.html'
})
class MyPage {
  @ViewChild('mySlider') slider: Slides;
  mySlideOptions = {
    initialSlide: 1,
    loop: false
  };

  onSlideChanged() {
    let previousIndex = this.slider.getPreviousIndex();
    let currentIndex = this.slider.getActiveIndex();
    console.log('Previous index is', previousIndex, 'Current index is', currentIndex);
  }

  onSlideMove(ev: any) {
    console.log('Slide moving', ev);
  }

  goToPrevSlide() {
    this.slider.slidePrev();
  }

  goToNextSlide() {
    this.slider.slideNext();
  }

  goToSlide(index: number) {
    this.slider.slideTo(index);
  }

  getIndex() {
    let index = this.slider.getActiveIndex();
    console.log('Current Index is', index);
  }

  getLength() {
    let length = this.slider.length();
    console.log('Current Length is', length);
  }
}


@Component({
  template: `<ion-nav [root]="root"></ion-nav>`
})
class E2EApp {
  root: any = MyPage;
}

ionicBootstrap(E2EApp);
