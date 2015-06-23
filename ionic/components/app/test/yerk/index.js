import {Component} from 'angular2/src/core/annotations_impl/annotations';

import {IonicView} from 'ionic/ionic';


@Component({ selector: 'ion-app' })
@IonicView({
  templateUrl: 'main.html'
})
class IonicApp {
  constructor() {
    this.root = TabsPage;
  }
}

@Component({selector: 'ion-view'})
@IonicView({
  template: '' +
    '<ion-navbar *navbar>' +
      '<ion-title>Home</ion-title>' +
    '</ion-navbar>' +
    '<ion-content class="padding">' +
    '</ion-content>'
})
class HomeTabPage {
  constructor(nav: NavController) {
    this.nav = nav;
    console.log('Initi');
  }
  push() {
  }
}


@Component({selector: 'ion-view'})
@IonicView({
  template: `<ion-tabs id="tabs">
    <ion-tab tab-title="Home" tab-icon="ion-earth"></ion-tab>
    <ion-tab tab-title="Peek" tab-icon="ion-ios-glasses">
      <ion-content class="padding">
      </ion-content>
    </ion-tab>
    <ion-tab tab-title="Me" tab-icon="ion-ios-person">
      <ion-content class="padding">
      </ion-content>
    </ion-tab>
    <ion-tab tab-title="More" tab-icon="ion-ios-more">
      <ion-content class="padding">
      </ion-content>
    </ion-tab>

  </ion-tabs>
  `
})
class TabsPage {
  constructor() {
    this.firstTabPage = HomeTabPage;
  }
}

export function main(ionicBootstrap) {
  ionicBootstrap(IonicApp);
}
