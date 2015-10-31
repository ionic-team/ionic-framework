import {App, IonicApp, Page, NavController} from 'ionic/ionic';


@Page({
  templateUrl: 'page1.html'
})
class Page1 {
  constructor(app: IonicApp) {
    this.app = app;
    this.menu1Active();
  }
  menu1Active() {
    this.activeMenu = 'menu1';
    this.app.getComponent('menu1').enabled(true);
    this.app.getComponent('menu2').enabled(false);
  }
  menu2Active() {
    this.activeMenu = 'menu2';
    this.app.getComponent('menu1').enabled(false);
    this.app.getComponent('menu2').enabled(true);
  }
}


@App({
  templateUrl: 'main.html'
})
class E2EApp {
  constructor(app: IonicApp) {
    this.app = app;
    this.rootPage = Page1;
  }
}
