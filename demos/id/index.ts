import {App, IonicApp, Page} from 'ionic/ionic';

@Page({templateUrl: 'page1.html'})
class Page1 {
  constructor(app: IonicApp) {
    this.app = app;
    this.menu1Active();
  }
  menu1Active() {
    this.activeMenu = 'menu1';
    this.app.getComponent('menu1').enable(true);
    this.app.getComponent('menu2').enable(false);
  }
  menu2Active() {
    this.activeMenu = 'menu2';
    this.app.getComponent('menu1').enable(false);
    this.app.getComponent('menu2').enable(true);
  }
}

@App({
  templateUrl: 'main.html'
})
class ApiDemoApp {
  constructor(app: IonicApp) {
    this.app = app;
    this.rootView = Page1;
  }
}
