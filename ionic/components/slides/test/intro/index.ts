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
  constructor(nav: NavController) {
    this.nav = nav;
  }

  onSlideChanged(slider) {
    console.log('Slide changed', slider);
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
