import {App, Page, IonicApp, MenuController} from 'ionic-angular';


@Page({
  templateUrl: 'page1.html'
})
class Page1 {
}

@Page({
  templateUrl: 'page2.html'
})
class Page2 {
}


@App({
  templateUrl: 'main.html'
})
class E2EApp {
  rootPage;
  activeMenu: string;

  constructor(app: IonicApp, menu: MenuController) {
    this.app = app;
    this.menu = menu;

    this.page1 = Page1;
    this.page2 = Page2;

    this.rootPage = Page1;
    this.menu1Active();
  }

  openPage(p) {
    // Get the <ion-nav> by id
    let nav = this.app.getComponent('nav');
    nav.setRoot(p);
  }

  menu1Active() {
    this.menu.enable(true, 'menu1');
    this.menu.enable(false, 'menu2');
    this.menu.enable(false, 'menu3');
  }
  menu2Active() {
    this.menu.enable(false, 'menu1');
    this.menu.enable(true, 'menu2');
    this.menu.enable(false, 'menu3');
  }
  menu3Active() {
    this.menu.enable(false, 'menu1');
    this.menu.enable(false, 'menu2');
    this.menu.enable(true, 'menu3');
  }
}
