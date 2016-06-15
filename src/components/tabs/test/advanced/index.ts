import {Component, ViewChild} from '@angular/core';
import {Location} from '@angular/common';

import {ionicBootstrap, NavController, NavParams, Modal, ViewController, Tabs, Tab} from '../../../../../src';


@Component({
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
  constructor(private nav: NavController) {}

  push() {
    this.nav.push(TabsPage, {
      userId: 8675309
    });
  }
}


@Component({
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
  constructor(private viewCtrl: ViewController) {}

  ionViewLoaded() {
    console.log('ChatPage, ionViewLoaded');
  }

  ionViewDidUnload() {
    console.log('ChatPage, ionViewDidUnload');
  }
}


@Component({
  templateUrl: './tabs.html'
})
class TabsPage {
  tab1Root = Tab1Page1;
  tab2Root = Tab2Page1;
  tab3Root = Tab3Page1;
  @ViewChild(Tabs) tabs: Tabs;

  constructor(private nav: NavController, private params: NavParams) {}

  ngAfterViewInit() {
    this.tabs.ionChange.subscribe((tab: Tab) => {
      console.log('tabs.ionChange.subscribe', tab.index);
    });
  }

  onTabChange() {
    // wired up through the template
    // <ion-tabs (ionChange)="onTabChange()">
    console.log('onTabChange');
  }

  chat() {
    console.log('Chat clicked!');
    let modal = Modal.create(ChatPage);
    this.nav.present(modal);
  }

  ionViewWillEnter() {
    console.log('TabsPage, ionViewWillEnter');
  }

  ionViewDidEnter() {
    console.log('TabsPage, ionViewDidEnter');
  }

  ionViewWillLeave() {
    console.log('TabsPage, ionViewWillLeave');
  }

  ionViewDidLeave() {
    console.log('TabsPage, ionViewDidLeave');
  }

  ionViewDidUnload() {
    console.log('TabsPage, ionViewDidUnload');
  }
}


//
// tab 1
//
@Component({
  template: '' +
    '<ion-navbar *navbar>' +
      '<ion-title>Tabs 1 Page 1</ion-title>' +
    '</ion-navbar>' +
    '<ion-content padding>' +
      '<p><button id="goToTab1Page2" (click)="push()">Go to Tab 1, Page 2</button></p>' +
      '<p><button (click)="logout()">Logout</button></p>' +
      '<p><button (click)="favoritesTab()">Favorites Tab</button></p>' +
      '<p><button (click)="goBack()">Go Back</button></p>' +
      '<p>UserId: {{userId}}</p>' +
      '<f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>' +
      '<f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>' +
    '</ion-content>'
})
class Tab1Page1 {
  userId: string;

  constructor(private nav: NavController, private tabs: Tabs, private params: NavParams) {
    this.userId = params.get('userId');
  }

  push() {
    this.nav.push(Tab1Page2);
  }

  goBack() {
    console.log('go back begin');
    this.nav.pop().then((val) => {
      console.log('go back completed', val);
    });;
  }

  favoritesTab() {
    this.tabs.select(1);
  }

  logout() {
    this.nav.rootNav.setRoot(SignIn, null, { animate: true, direction: 'back' });
  }

  ionViewWillEnter() {
    console.log('Tab1Page1, ionViewWillEnter');
  }

  ionViewDidEnter() {
    console.log('Tab1Page1, ionViewDidEnter');
  }

  ionViewWillLeave() {
    console.log('Tab1Page1, ionViewWillLeave');
  }

  ionViewDidLeave() {
    console.log('Tab1Page1, ionViewDidLeave');
  }

  ionViewDidUnload() {
    console.log('Tab1Page1, ionViewDidUnload');
  }
}


@Component({
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
  constructor(private nav: NavController) {}

  push() {
    this.nav.push(Tab1Page3);
  }

  ionViewWillEnter() {
    console.log('Tab1Page2, ionViewWillEnter');
  }

  ionViewDidEnter() {
    console.log('Tab1Page2, ionViewDidEnter');
  }

  ionViewWillLeave() {
    console.log('Tab1Page2, ionViewWillLeave');
  }

  ionViewDidLeave() {
    console.log('Tab1Page2, ionViewDidLeave');
  }

  ionViewDidUnload() {
    console.log('Tab1Page2, ionViewDidUnload');
  }
}


@Component({
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
  constructor(private nav: NavController) {}

  ionViewWillEnter() {
    console.log('Tab1Page3, ionViewWillEnter');
  }

  ionViewDidEnter() {
    console.log('Tab1Page3, ionViewDidEnter');
  }

  ionViewWillLeave() {
    console.log('Tab1Page3, ionViewWillLeave');
  }

  ionViewDidLeave() {
    console.log('Tab1Page3, ionViewDidLeave');
  }

  ionViewDidUnload() {
    console.log('Tab1Page3, ionViewDidUnload');
  }
}



//
// tab 2
//
@Component({
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
  constructor(private nav: NavController) {}

  push() {
    this.nav.push(Tab2Page2);
  }

  ionViewWillEnter() {
    console.log('Tab2Page1, ionViewWillEnter');
  }

  ionViewDidEnter() {
    console.log('Tab2Page1, ionViewDidEnter');
  }

  ionViewWillLeave() {
    console.log('Tab2Page1, ionViewWillLeave');
  }

  ionViewDidLeave() {
    console.log('Tab2Page1, ionViewDidLeave');
  }

  ionViewDidUnload() {
    console.log('Tab2Page1, ionViewDidUnload');
  }
}


@Component({
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
  constructor(private nav: NavController) {}

  push() {
    this.nav.push(Tab2Page3);
  }

  ionViewWillEnter() {
    console.log('Tab2Page2, ionViewWillEnter');
  }

  ionViewDidEnter() {
    console.log('Tab2Page2, ionViewDidEnter');
  }

  ionViewWillLeave() {
    console.log('Tab2Page2, ionViewWillLeave');
  }

  ionViewDidLeave() {
    console.log('Tab2Page2, ionViewDidLeave');
  }

  ionViewDidUnload() {
    console.log('Tab2Page2, ionViewDidUnload');
  }
}


@Component({
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
  constructor(private nav: NavController) {}

  ionViewWillEnter() {
    console.log('Tab2Page3, ionViewWillEnter');
  }

  ionViewDidEnter() {
    console.log('Tab2Page3, ionViewDidEnter');
  }

  ionViewWillLeave() {
    console.log('Tab2Page3, ionViewWillLeave');
  }

  ionViewDidLeave() {
    console.log('Tab2Page3, ionViewDidLeave');
  }

  ionViewDidUnload() {
    console.log('Tab2Page3, ionViewDidUnload');
  }
}



//
// tab 3
//
@Component({
  template: '' +
    '<ion-navbar *navbar>' +
      '<ion-title>Tabs 3</ion-title>' +
    '</ion-navbar>' +
    '<ion-content padding><h2>Tabs 3</h2></ion-content>'
})
class Tab3Page1 {

  ionViewWillEnter() {
    console.log('Tab3Page1, ionViewWillEnter');
  }

  ionViewDidEnter() {
    console.log('Tab3Page1, ionViewDidEnter');
  }

  ionViewWillLeave() {
    console.log('Tab3Page1, ionViewWillLeave');
  }

  ionViewDidLeave() {
    console.log('Tab3Page1, ionViewDidLeave');
  }

  ionViewDidUnload() {
    console.log('Tab3Page1, ionViewDidUnload');
  }
}


@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
class E2EApp {
  root = SignIn;
}

ionicBootstrap(E2EApp);
