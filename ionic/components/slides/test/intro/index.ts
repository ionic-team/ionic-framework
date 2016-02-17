import {App, Page, NavController} from 'ionic/ionic';


@App({
  template: '<ion-nav [root]="rootPage"></ion-nav>'
})
class MyApp {
  constructor() {
    this.rootPage = IntroPage;
  }
}

@Page({
  templateUrl: 'main.html'
})
class IntroPage {
  continueText: string = "Skip";

  constructor(public nav: NavController) {

  }

  onSlideChanged(slider) {
    console.log("Slide changed", slider);
  }

  onSlideChangeStart(slider) {
    console.log("Slide change start", slider);
    slider.isEnd ? this.continueText = "Continue" : this.continueText = "Skip";
  }

  skip() {
    this.nav.push(MainPage);
  }
}

@Page({
  template: `
  <ion-navbar *navbar>
    <ion-title>Slides</ion-title>
  </ion-navbar>

  <ion-content padding>
    <h1>Another Page</h1>
  </ion-content>

  `
})
class MainPage {

}
