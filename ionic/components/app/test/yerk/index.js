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
  template: '' +
    '<ion-navbar *navbar>' +
      '<ion-title>Peek</ion-title>' +
    '</ion-navbar>' +
    '<ion-content class="padding">' +
    '</ion-content>'
})
class PeekTabPage {
  constructor(nav: NavController) {
    this.nav = nav;
  }
  push() {
  }
}


@Component({selector: 'ion-view'})
@IonicView({
  templateUrl: 'tabs.html'
})
class TabsPage {
  constructor() {
    this.homeTab = HomeTabPage;
    this.peekTab = PeekTabPage;
  }
}

export function main(ionicBootstrap) {
  ionicBootstrap(IonicApp);
}
