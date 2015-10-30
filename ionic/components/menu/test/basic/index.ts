import {App, IonicApp, Page, NavController} from 'ionic/ionic';


@Page({templateUrl: 'page1.html'})
class Page1 {}


@Page({templateUrl: 'page3.html'})
class Page3 {}


@Page({templateUrl: 'page2.html'})
class Page2 {
  constructor(nav: NavController) {
    this.nav = nav;
  }
  page3() {
    this.nav.push(Page3);
  }
}


@App({
  templateUrl: 'main.html'
})
class E2EApp {

  constructor(app: IonicApp) {
    this.app = app;
    this.rootView = Page1;

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
      this.app.getComponent('leftMenu').close();
    });
  }
}
