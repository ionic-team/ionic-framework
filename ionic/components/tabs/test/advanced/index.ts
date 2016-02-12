import {ViewChild} from 'angular2/core';
import {RouteConfig, Location} from 'angular2/router';

import {App, Page, NavController, Modal, ViewController, Tabs} from '../../../../../ionic/ionic';


@Page({
  template: `
    <ion-navbar *navbar>
      <ion-title>Sign In</ion-title>
    </ion-navbar>
    <ion-content padding>
      <ion-card>
        <ion-item>
          <ion-label>Username:</ion-label>
          <ion-input></ion-input>
        </ion-item>
        <ion-item>
          <ion-label>Password:</ion-label>
          <ion-input type="password"></ion-input>
        </ion-item>
        <ion-item>
          <button block id="signIn" (click)="push()">Sign In</button>
        </ion-item>
      </ion-card>
    </ion-content>
  `
})
class SignIn {
  constructor(nav: NavController) {
    this.nav = nav;
  }

  push() {
    this.nav.push(TabsPage);
  }
}


@Page({
  template: `
    <ion-toolbar>
      <ion-title>Chat Modal</ion-title>
    </ion-toolbar>
    <ion-content padding>
      <p><button (click)="viewCtrl.dismiss()">Close Modal</button></p>
    </ion-content>
  `
})
class ChatPage {
  constructor(viewCtrl: ViewController) {
    this.viewCtrl = viewCtrl;
  }
}


@Page({
  templateUrl: './tabs.html'
})
class TabsPage {
  @ViewChild(Tabs) tabs: Tabs;

  constructor(private nav: NavController) {
    this.tab1Root = Tab1Page1;
    this.tab2Root = Tab2Page1;
    this.tab3Root = Tab3Page1;
  }

  ngAfterViewInit() {
    this.tabs.change.subscribe(tab => {
      console.log('tabs.change.subscribe', tab.index);
    });
  }

  onTabChange() {
    // wired up through the template
    // <ion-tabs (change)="onTabChange()">
    console.log('onTabChange');
  }

  chat() {
    console.log('Chat clicked!');
    let modal = Modal.create(ChatPage);
    this.nav.present(modal);
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
      '<p><button (click)="favoritesTab()">Favorites Tab</button></p>' +
      '<f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>' +
      '<f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>' +
    '</ion-content>'
})
class Tab1Page1 {
  constructor(nav: NavController, tabs: Tabs) {
    this.nav = nav;
    this.tabs = tabs;
  }

  push() {
    this.nav.push(Tab1Page2)
  }

  favoritesTab() {
    this.tabs.select(1);
  }

  logout() {
    this.nav.rootNav.setRoot(SignIn, null, { animate: true, direction: 'back' });
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
