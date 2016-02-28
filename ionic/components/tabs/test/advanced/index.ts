import {ViewChild} from 'angular2/core';
import {RouteConfig, Location} from 'angular2/router';

import {App, Page, NavController, NavParams, Modal, ViewController, Tabs} from 'ionic-angular';


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
  constructor(private nav: NavController) {}

  push() {
    this.nav.push(TabsPage, {
      userId: 8675309
    });
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
  constructor(private viewCtrl: ViewController) {}

  onPageDidLoad() {
    console.log('ChatPage, onPageDidLoad');
  }

  onPageDidUnload() {
    console.log('ChatPage, onPageDidUnload');
  }
}


@Page({
  templateUrl: './tabs.html'
})
class TabsPage {
  @ViewChild(Tabs) tabs: Tabs;

  constructor(private nav: NavController, private params: NavParams) {
    this.tab1Root = Tab1Page1;
    this.tab1Params = params;
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

  onPageWillEnter() {
    console.log('TabsPage, onPageWillEnter');
  }

  onPageDidEnter() {
    console.log('TabsPage, onPageDidEnter');
  }

  onPageWillLeave() {
    console.log('TabsPage, onPageWillLeave');
  }

  onPageDidLeave() {
    console.log('TabsPage, onPageDidLeave');
  }

  onPageDidUnload() {
    console.log('TabsPage, onPageDidUnload');
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
    this.nav.push(Tab1Page2)
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

  onPageWillEnter() {
    console.log('Tab1Page1, onPageWillEnter');
  }

  onPageDidEnter() {
    console.log('Tab1Page1, onPageDidEnter');
  }

  onPageWillLeave() {
    console.log('Tab1Page1, onPageWillLeave');
  }

  onPageDidLeave() {
    console.log('Tab1Page1, onPageDidLeave');
  }

  onPageDidUnload() {
    console.log('Tab1Page1, onPageDidUnload');
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
  constructor(private nav: NavController) {}

  push() {
    this.nav.push(Tab1Page3)
  }

  onPageWillEnter() {
    console.log('Tab1Page2, onPageWillEnter');
  }

  onPageDidEnter() {
    console.log('Tab1Page2, onPageDidEnter');
  }

  onPageWillLeave() {
    console.log('Tab1Page2, onPageWillLeave');
  }

  onPageDidLeave() {
    console.log('Tab1Page2, onPageDidLeave');
  }

  onPageDidUnload() {
    console.log('Tab1Page2, onPageDidUnload');
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
  constructor(private nav: NavController) {}

  onPageWillEnter() {
    console.log('Tab1Page3, onPageWillEnter');
  }

  onPageDidEnter() {
    console.log('Tab1Page3, onPageDidEnter');
  }

  onPageWillLeave() {
    console.log('Tab1Page3, onPageWillLeave');
  }

  onPageDidLeave() {
    console.log('Tab1Page3, onPageDidLeave');
  }

  onPageDidUnload() {
    console.log('Tab1Page3, onPageDidUnload');
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
  constructor(private nav: NavController) {}

  push() {
    this.nav.push(Tab2Page2)
  }

  onPageWillEnter() {
    console.log('Tab2Page1, onPageWillEnter');
  }

  onPageDidEnter() {
    console.log('Tab2Page1, onPageDidEnter');
  }

  onPageWillLeave() {
    console.log('Tab2Page1, onPageWillLeave');
  }

  onPageDidLeave() {
    console.log('Tab2Page1, onPageDidLeave');
  }

  onPageDidUnload() {
    console.log('Tab2Page1, onPageDidUnload');
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
  constructor(private nav: NavController) {}

  push() {
    this.nav.push(Tab2Page3)
  }

  onPageWillEnter() {
    console.log('Tab2Page2, onPageWillEnter');
  }

  onPageDidEnter() {
    console.log('Tab2Page2, onPageDidEnter');
  }

  onPageWillLeave() {
    console.log('Tab2Page2, onPageWillLeave');
  }

  onPageDidLeave() {
    console.log('Tab2Page2, onPageDidLeave');
  }

  onPageDidUnload() {
    console.log('Tab2Page2, onPageDidUnload');
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
  constructor(private nav: NavController) {}

  onPageWillEnter() {
    console.log('Tab2Page3, onPageWillEnter');
  }

  onPageDidEnter() {
    console.log('Tab2Page3, onPageDidEnter');
  }

  onPageWillLeave() {
    console.log('Tab2Page3, onPageWillLeave');
  }

  onPageDidLeave() {
    console.log('Tab2Page3, onPageDidLeave');
  }

  onPageDidUnload() {
    console.log('Tab2Page3, onPageDidUnload');
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
class Tab3Page1 {

  onPageWillEnter() {
    console.log('Tab3Page1, onPageWillEnter');
  }

  onPageDidEnter() {
    console.log('Tab3Page1, onPageDidEnter');
  }

  onPageWillLeave() {
    console.log('Tab3Page1, onPageWillLeave');
  }

  onPageDidLeave() {
    console.log('Tab3Page1, onPageDidLeave');
  }

  onPageDidUnload() {
    console.log('Tab3Page1, onPageDidUnload');
  }
}


@App()
@RouteConfig([
  { path: '/', component: SignIn, as: 'Signin' },
  { path: '/tabs', component: TabsPage, as: 'Tabs' },
])
class E2EApp {}
