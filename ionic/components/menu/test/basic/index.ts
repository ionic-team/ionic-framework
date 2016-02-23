import {App, IonicApp, MenuController, Page, NavController, Alert} from 'ionic-angular';


@Page({
  templateUrl: 'page1.html'
})
class Page1 {
  constructor(private nav: NavController) {}

  presentAlert() {
    let alert = Alert.create({
      title: "New Friend!",
      message: "Your friend, Obi wan Kenobi, just accepted your friend request!",
      cssClass: 'my-alert',
      buttons: ['Ok']
    });
    this.nav.present(alert);
  }
}


@Page({templateUrl: 'page3.html'})
class Page3 {}


@Page({templateUrl: 'page2.html'})
class Page2 {
  constructor(private nav: NavController) {}

  page3() {
    this.nav.push(Page3);
  }
}


@App({
  templateUrl: 'main.html'
})
class E2EApp {
  rootPage;
  changeDetectionCount: number = 0;
  pages: Array<{title: string, component: any}>;

  constructor(private app: IonicApp, private menu: MenuController) {
    this.rootPage = Page1;

    this.pages = [
      { title: 'Page 1', component: Page1 },
      { title: 'Page 2', component: Page2 },
      { title: 'Page 3', component: Page3 },
    ];
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    let nav = this.app.getComponent('nav');
    nav.setRoot(page.component).then(() => {
      // wait for the root page to be completely loaded
      // then close the menu
      this.menu.close();
    });
  }

  onMenuOpening(ev) {
    console.log('onMenuOpening', ev);
  }

  isChangeDetecting() {
    console.log('Change detection', ++this.changeDetectionCount);
    return true;
  }
}
