import { Component } from '@angular/core';
import { ionicBootstrap, NavController } from '../../../../../src';


@Component({
  templateUrl: 'main.html'
})
class IntroPage {
  continueText: string = 'Skip';
  startingIndex: number = 1;
  mySlideOptions: any;
  showSlide: boolean = true;

  constructor(public navCtrl: NavController) {
    this.mySlideOptions = {
      paginationClickable: true,
      lazyLoading: true,
      preloadImages: false,
      initialSlide: this.startingIndex
    };
  }

  onSlideChanged(slider: any) {
    console.log('Slide changed', slider);
  }

  onSlideChangeStart(slider: any) {
    console.log('Slide change start', slider);
    slider.isEnd ? this.continueText = 'Continue' : this.continueText = 'Skip';
  }

  onSlideMove(slider: any) {
    console.log('Slide move', slider);
  }

  toggleLastSlide() {
    this.showSlide = !this.showSlide;
  }

  skip() {
    this.navCtrl.push(MainPage);
  }
}

@Component({
  template: `
  <ion-header>
    <ion-navbar>
      <ion-title>Slides</ion-title>
    </ion-navbar>
  </ion-header>

  <ion-content padding>
    <h1>Another Page</h1>
  </ion-content>
  `
})
class MainPage {}


@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
class E2EApp {
  root = IntroPage;
}

ionicBootstrap(E2EApp);
