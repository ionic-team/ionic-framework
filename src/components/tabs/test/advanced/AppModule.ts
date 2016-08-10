import { Component, NgModule, ViewChild } from '@angular/core';
import { IonicApp, IonicModule, App, NavController, NavParams, ModalController, ViewController, Tabs, Tab } from '../../../dist';


@Component({
  templateUrl: './signIn.html'
})
export class SignIn {
  constructor(public navCtrl: NavController) {}

  push() {
    this.navCtrl.push(TabsPage);
  }
}


@Component({
  templateUrl: './modalChat.html'
})
export class ChatPage {

  constructor(public viewCtrl: ViewController) {}

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
export class TabsPage {

  @ViewChild(Tabs) tabs: Tabs;

  constructor(public modalCtrl: ModalController, public params: NavParams) {}

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
export class Tab1Page1 {
  userId: string;

  constructor(public navCtrl: NavController, public app: App, public tabs: Tabs, public params: NavParams) {
    this.userId = params.get('userId');
  }

  goBack() {
    console.log('go back begin');
    this.navCtrl.pop().then((val: any) => {
      console.log('go back completed', val);
    });
  }

  favoritesTab() {
    this.tabs.select(1);
  }

  logout() {
    this.app.getRootNav().setRoot(SignIn, null, { animate: true, direction: 'pop' });
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
export class Tab1Page2 {

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
export class Tab1Page3 {

  constructor(public navCtrl: NavController) {}

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
export class Tab2Page1 {

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
export class Tab2Page2 {

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
export class Tab2Page3 {

  constructor(public navCtrl: NavController) {}

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
export class Tab3Page1 {

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
  template: '<ion-nav [root]="rootPage" swipeBackEnabled="false"></ion-nav>'
})
export class E2EApp {
  rootPage = SignIn;
}


let links: NavLink[] = [
  { component: SignIn },
  { component: TabsPage },
  { component: Tab1Page1 },
  { component: Tab1Page2 },
  { component: Tab1Page3 },
  { component: Tab2Page1 },
  { component: Tab2Page2 },
  { component: Tab2Page3 },
  { component: Tab3Page1 },
];

@NgModule({
  declarations: [
    E2EApp,
    SignIn,
    ChatPage,
    TabsPage,
    Tab1Page1,
    Tab1Page2,
    Tab1Page3,
    Tab2Page1,
    Tab2Page2,
    Tab2Page3,
    Tab3Page1
  ],
  imports: [
    IonicModule.forRoot(E2EApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    SignIn,
    ChatPage,
    TabsPage,
    Tab1Page1,
    Tab1Page2,
    Tab1Page3,
    Tab2Page1,
    Tab2Page2,
    Tab2Page3,
    Tab3Page1
  ]
})
export class AppModule {}
