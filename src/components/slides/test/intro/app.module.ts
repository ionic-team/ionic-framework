import { Component, NgModule, ViewChild } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, NavController, Slides } from '../../../..';


@Component({
  templateUrl: 'main.html'
})
export class IntroPage {
  @ViewChild(Slides) slider: Slides;

  continueText: string = 'Skip';
  mySlideOptions: any;
  showSlide: boolean = true;

  constructor(public navCtrl: NavController) {}

  ngOnInit() {
    this.slider.initialSlide = 1;
    this.slider.paginationClickable = true;
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
export class AppComponent {
  root = IntroPage;
}

@NgModule({
  declarations: [
    AppComponent,
    IntroPage,
    MainPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(AppComponent)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    AppComponent,
    IntroPage,
    MainPage
  ]
})
export class AppModule {}
