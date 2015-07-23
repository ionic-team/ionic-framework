import {Component} from 'angular2/angular2';

import {App, IonicView, NavController} from 'ionic/ionic';


@IonicView({
  template: '' +
    '<ion-navbar *navbar>' +
      '<ion-title>Sign In</ion-title>' +
    '</ion-navbar>' +
    '<ion-content class="padding">' +
      '<p><button id="signIn" primary (click)="push()">Go to tabs</button></p>' +
      '<f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>' +
      '<f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>' +
    '</ion-content>'
})
class SignIn {
  constructor(nav: NavController) {
    this.nav = nav;
  }

  push() {
    this.nav.push(TabsPage);
  }
}

@IonicView({
  templateUrl: './tabs.html'
})

class TabsPage {
  constructor(nav: NavController) {
    this.tab1Root = Tab1Page1
    this.tab2Root = Tab2Page1
  }
}


//
// tab 1
//
@IonicView({
  template: '' +
    '<ion-navbar *navbar>' +
      '<ion-title>Tabs 1 Page 1</ion-title>' +
    '</ion-navbar>' +
    '<ion-content class="padding">' +
      '<p><button id="goToTab1Page2" primary (click)="push()">Go to Tab 1, Page 2</button></p>' +
      '<f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>' +
      '<f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>' +
    '</ion-content>'
})
class Tab1Page1 {
  constructor(nav: NavController) {
    this.nav = nav;
  }

  push() {
    this.nav.push(Tab1Page2)
  }
}


@IonicView({
  template: '' +
    '<ion-navbar *navbar>' +
      '<ion-title>Tabs 1 Page 2</ion-title>' +
    '</ion-navbar>' +
    '<ion-content class="padding">' +
      '<p><button primary (click)="push()">Go to Tab 1, Page 3</button></p>' +
      '<p><button id="backToTab1Page1" primary (click)="nav.pop()">Back to Tab 1, Page 1</button></p>' +
      '<f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>' +
      '<f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>' +
    '</ion-content>'
})
class Tab1Page2 {
  constructor(nav: NavController) {
    this.nav = nav;
  }

  push() {
    this.nav.push(Tab1Page3)
  }
}


@IonicView({
  template: '' +
    '<ion-navbar *navbar>' +
      '<ion-title>Tabs 1 Page 3</ion-title>' +
    '</ion-navbar>' +
    '<ion-content class="padding">' +
      '<p><button primary (click)="nav.pop()">Back to Tab 1, Page 2</button></p>' +
      '<f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>' +
      '<f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>' +
    '</ion-content>'
})
class Tab1Page3 {
  constructor(nav: NavController) {
    this.nav = nav;
  }
}



//
// tab 2
//
@IonicView({
  template: '' +
    '<ion-navbar *navbar>' +
      '<ion-title>Tabs 2 Page 1</ion-title>' +
    '</ion-navbar>' +
    '<ion-content class="padding">' +
      '<p><button primary (click)="push()">Go to Tab 2, Page 2</button></p>' +
      '<f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>' +
      '<f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>' +
    '</ion-content>'
})
class Tab2Page1 {
  constructor(nav: NavController) {
    this.nav = nav;
  }

  push() {
    this.nav.push(Tab2Page2)
  }
}


@IonicView({
  template: '' +
    '<ion-navbar *navbar>' +
      '<ion-title>Tabs 2 Page 2</ion-title>' +
    '</ion-navbar>' +
    '<ion-content class="padding">' +
      '<p><button primary (click)="push()">Go to Tab 2, Page 3</button></p>' +
      '<p><button primary (click)="nav.pop()">Back to Tab 2, Page 1</button></p>' +
      '<f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>' +
      '<f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>' +
    '</ion-content>'
})
class Tab2Page2 {
  constructor(nav: NavController) {
    this.nav = nav;
  }

  push() {
    this.nav.push(Tab2Page3)
  }
}


@IonicView({
  template: '' +
    '<ion-navbar *navbar>' +
      '<ion-title>Tabs 2 Page 3</ion-title>' +
    '</ion-navbar>' +
    '<ion-content class="padding">' +
      '<p><button primary (click)="nav.pop()">Back to Tab 2, Page 2</button></p>' +
      '<f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>' +
      '<f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>' +
    '</ion-content>'
})
class Tab2Page3 {
  constructor(nav: NavController) {
    this.nav = nav;
  }
}


@App({
  routes: [
    {
      path: '/signin',
      component: SignIn,
      root: true
    }
  ]
})
class IonicApp {}
