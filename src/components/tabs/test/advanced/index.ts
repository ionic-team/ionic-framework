import { Component, ViewChild } from '@angular/core';

import { ionicBootstrap, NavController, NavParams, ModalController, ViewController, Tabs, Tab } from '../../../../../src';


@Component({
  templateUrl: './signIn.html'
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
  templateUrl: './modalChat.html'
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

  constructor(private modalCtrl: ModalController, private params: NavParams) {}

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
    this.modalCtrl.create(ChatPage).present();
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
  templateUrl: './tab1page1.html'
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
  templateUrl: './tab1page2.html'
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
  templateUrl: './tab1page3.html'
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
  templateUrl: './tab2page1.html'
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
  templateUrl: './tab2page2.html'
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
  templateUrl: './tab2page3.html'
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
  templateUrl: './tab3page1.html'
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
  template: '<ion-nav [root]="root" swipeBackEnabled="false"></ion-nav>'
})
class E2EApp {
  root = SignIn;
}

ionicBootstrap(E2EApp);
