import { Component, NgModule } from '@angular/core';
import { IonicApp, IonicModule, NavController } from '../../../..';


@Component({
  templateUrl: 'main.html'
})
export class IntroPage {
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
export class MainPage {}


@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
export class E2EApp {
  root = IntroPage;
}

@NgModule({
  declarations: [
    E2EApp,
    IntroPage,
    MainPage
  ],
  imports: [
    IonicModule.forRoot(E2EApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    E2EApp,
    IntroPage,
    MainPage
  ]
})
export class AppModule {}
