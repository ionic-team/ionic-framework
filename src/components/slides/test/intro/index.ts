import {Component} from '@angular/core';
import {ionicBootstrap, NavController} from '../../../../../src';


@Component({
  templateUrl: 'main.html'
})
class IntroPage {
  continueText: string = "Skip";
  startingIndex: number = 1;
  mySlideOptions;

  constructor(private nav: NavController) {
    this.mySlideOptions = {
      paginationClickable: true,
      lazyLoading: true,
      preloadImages: false,
      initialSlide: this.startingIndex
    };
  }

  onSlideChanged(slider) {
    console.log("Slide changed", slider);
  }

  onSlideChangeStart(slider) {
    console.log("Slide change start", slider);
    slider.isEnd ? this.continueText = "Continue" : this.continueText = "Skip";
  }

  onSlideMove(slider) {
    console.log("Slide move", slider);
  }

  skip() {
    this.nav.push(MainPage);
  }
}

@Component({
  template: `
  <ion-navbar *navbar>
    <ion-title>Slides</ion-title>
  </ion-navbar>

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
