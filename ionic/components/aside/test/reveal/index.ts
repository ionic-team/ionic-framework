import {App, IonicApp, IonicView} from 'ionic/ionic';


@IonicView({templateUrl: 'page1.html'})
class Page1 {}


@App({
  templateUrl: 'main.html'
})
class E2EApp {

  constructor(app: IonicApp) {
    this.app = app;
    this.rootView = Page1;
  }

  openPage(aside, page) {
    // close the menu when clicking a link from the aside
    aside.close();

    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    let nav = this.app.getComponent('nav');
    nav.setRoot(page.component);
  }
}
