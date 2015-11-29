import {RouteConfig, Location} from 'angular2/router';

import {App, Page, NavController, Keyboard} from 'ionic/ionic';


@Page({
  template: `
    <ion-navbar *navbar>
      <ion-title>Sign In</ion-title>
    </ion-navbar>
    <ion-content padding>
      <ion-card>
        <ion-input>
          <ion-label>Username:</ion-label>
          <input type="text">
        </ion-input>
        <ion-input>
          <ion-label>Password:</ion-label>
          <input type="password">
        </ion-input>
        <ion-item>
          <button block id="signIn" (click)="push()">Sign In</button>
        </ion-item>
      </ion-card>
    </ion-content>
  `
})
class SignIn {
  constructor(nav: NavController, keyboard: Keyboard) {
    this.nav = nav;
    this.keyboard = keyboard;
  }

  push() {
    setTimeout(() => {
      this.nav.push(TabsPage);
    }, 1000);
  }
}


@Page({
  templateUrl: './tabs.html'
})
class TabsPage {
  constructor(nav: NavController) {
    this.tab1Root = Tab1Page1
    this.tab2Root = Tab2Page1
    this.tab3Root = Tab3Page1
  }
}


//
// tab 1
//
@Page({
  template: '' +
    '<ion-navbar *navbar>' +
      '<ion-title>Tabs 1 Page 1</ion-title>' +
    '</ion-navbar>' +
    '<ion-content padding>' +
      '<p><button id="goToTab1Page2" (click)="push()">Go to Tab 1, Page 2</button></p>' +
      '<p><button (click)="logout()">Logout</button></p>' +
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

  logout() {
    let tabs = this.nav.parent;
    let rootNav = tabs.parent;
    rootNav.pop();
  }
}


@Page({
  template: '' +
    '<ion-navbar *navbar primary>' +
      '<ion-title>Tabs 1 Page 2</ion-title>' +
    '</ion-navbar>' +
    '<ion-content padding>' +
      '<p><button (click)="push()">Go to Tab 1, Page 3</button></p>' +
      '<p><button id="backToTab1Page1" (click)="nav.pop()">Back to Tab 1, Page 1</button></p>' +
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


@Page({
  template: '' +
    '<ion-navbar *navbar>' +
      '<ion-title>Tabs 1 Page 3</ion-title>' +
    '</ion-navbar>' +
    '<ion-content padding>' +
      '<p><button (click)="nav.pop()">Back to Tab 1, Page 2</button></p>' +
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
@Page({
  template: '' +
    '<ion-navbar *navbar>' +
      '<ion-title>Tabs 2 Page 1</ion-title>' +
    '</ion-navbar>' +
    '<ion-content padding>' +
      '<p><button (click)="push()">Go to Tab 2, Page 2</button></p>' +
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


@Page({
  template: '' +
    '<ion-navbar *navbar>' +
      '<ion-title>Tabs 2 Page 2</ion-title>' +
    '</ion-navbar>' +
    '<ion-content padding>' +
      '<p><button (click)="push()">Go to Tab 2, Page 3</button></p>' +
      '<p><button (click)="nav.pop()">Back to Tab 2, Page 1</button></p>' +
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


@Page({
  template: '' +
    '<ion-navbar *navbar>' +
      '<ion-title>Tabs 2 Page 3</ion-title>' +
    '</ion-navbar>' +
    '<ion-content padding>' +
      '<p><button (click)="nav.pop()">Back to Tab 2, Page 2</button></p>' +
      '<f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>' +
      '<f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>' +
    '</ion-content>'
})
class Tab2Page3 {
  constructor(nav: NavController) {
    this.nav = nav;
  }
}



//
// tab 3
//
@Page({
  template: '' +
    '<ion-navbar *navbar>' +
      '<ion-title>Tabs 3</ion-title>' +
    '</ion-navbar>' +
    '<ion-content padding><h2>Tabs 3</h2></ion-content>'
})
class Tab3Page1 {}


@App()
@RouteConfig([
  { path: '/', component: SignIn, as: 'Signin' },
  { path: '/tabs', component: TabsPage, as: 'Tabs' },
])
class E2EApp {}
