import { Component, NgModule, ViewChild } from '@angular/core';
import { /*DeepLink,*/ DeepLinkConfig, IonicApp, IonicModule, App, NavController, NavParams, ModalController, ViewController, Tabs, Tab } from '../../../..';


// @DeepLink({ name: 'sign-in' })
@Component({
  templateUrl: './signIn.html'
})
export class SignIn {}


@Component({
  templateUrl: './modalChat.html'
})
export class ChatPage {

  constructor(public viewCtrl: ViewController) {}

  ionViewDidLoad() {
    console.log('ChatPage, ionViewDidLoad');
  }

  ionViewWillUnload() {
    console.log('ChatPage, ionViewWillUnload');
  }
}


// @DeepLink({ name: 'tabs' })
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

  ionViewWillUnload() {
    console.log('TabsPage, ionViewWillUnload');
  }
}


//
// tab 1
//
// @DeepLink({ name: 'tab1-page1' })
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
    this.app.getRootNav().setRoot(SignIn, null, { animate: true, direction: 'back' });
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

  ionViewWillUnload() {
    console.log('Tab1Page1, ionViewWillUnload');
  }
}


// @DeepLink({ name: 'tab1-page2' })
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

  ionViewWillUnload() {
    console.log('Tab1Page2, ionViewWillUnload');
  }
}


// @DeepLink({ name: 'tab1-page3' })
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

  ionViewWillUnload() {
    console.log('Tab1Page3, ionViewWillUnload');
  }
}


//
// tab 2
//
// @DeepLink({ name: 'tab2-page1' })
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

  ionViewWillUnload() {
    console.log('Tab2Page1, ionViewWillUnload');
  }
}


// @DeepLink({ name: 'tab2-page2' })
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

  ionViewWillUnload() {
    console.log('Tab2Page2, ionViewWillUnload');
  }
}


// @DeepLink({
//   name: 'tab2-page3',
//   defaultHistory: []
// })
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

  ionViewWillUnload() {
    console.log('Tab2Page3, ionViewWillUnload');
  }
}


//
// tab 3
//
// @DeepLink({ name: 'tab3-page1' })
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

  ionViewWillUnload() {
    console.log('Tab3Page1, ionViewWillUnload');
  }
}

@Component({
  template: '<ion-nav [root]="rootPage" swipeBackEnabled="false"></ion-nav>'
})
export class E2EApp {
  rootPage = SignIn;
}


export const deepLinkConfig: DeepLinkConfig = {
  links: [
    { component: SignIn, name: 'sign-in' },
    { component: TabsPage, name: 'tabs' },
    { component: Tab1Page1, name: 'tab1-page1' },
    { component: Tab1Page2, name: 'tab1-page2' },
    { component: Tab1Page3, name: 'tab1-page3' },
    { component: Tab2Page1, name: 'tab2-page1' },
    { component: Tab2Page2, name: 'tab2-page2' },
    { component: Tab2Page3, name: 'tab2-page3' },
    { component: Tab3Page1, name: 'tab3-page1' },
  ]
};

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
    IonicModule.forRoot(E2EApp, null, deepLinkConfig)
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
