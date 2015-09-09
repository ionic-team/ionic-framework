import {App, IonicView, NavController} from 'ionic/ionic';


@App({
  templateUrl: 'main.html'
})
class IonicApp {
  constructor() {
    this.root = TabsPage;
  }
}


@IonicView({
  template: '' +
    '<ion-navbar *navbar>' +
      '<ion-title>Home</ion-title>' +
    '</ion-navbar>' +
    '<ion-content class="padding">' +
      'home' +
    '</ion-content>'
})
class HomeTabPage {
  constructor(nav: NavController) {
    this.nav = nav;
  }
  push() {
  }
}

@IonicView({
  template: '' +
    '<ion-navbar *navbar>' +
      '<ion-title>Peek</ion-title>' +
    '</ion-navbar>' +
    '<ion-content class="padding">' +
      'peek' +
    '</ion-content>'
})
class PeekTabPage {
  constructor(nav: NavController) {
    this.nav = nav;
  }
  push() {
  }
}


@IonicView({
  templateUrl: 'tabs.html'
})
class TabsPage {
  constructor() {
    this.homeTab = HomeTabPage;
    this.peekTab = PeekTabPage;
  }
}
