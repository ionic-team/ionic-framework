import { Component, ViewChild, NgModule } from '@angular/core';
import { IonicApp, IonicModule, Slides } from '../../../..';


@Component({
  templateUrl: 'main.html'
})
export class MyPage {
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
export class E2EApp {
  root: any = MyPage;
}

@NgModule({
  declarations: [
    E2EApp,
    MyPage
  ],
  imports: [
    IonicModule.forRoot(E2EApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    E2EApp,
    MyPage
  ]
})
export class AppModule {}
