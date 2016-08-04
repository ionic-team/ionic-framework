import { Component, ViewChild } from '@angular/core';
import { ionicBootstrap, App, MenuController, Nav } from '../../../../../src';


@Component({
  templateUrl: 'page1.html'
})
class Page1 {
}

@Component({
  templateUrl: 'page2.html'
})
class Page2 {
}


@Component({
  templateUrl: 'main.html'
})
class E2EApp {
  @ViewChild(Nav) nav: Nav;

  activeMenu: string;
  page1 = Page1;
  page2 = Page2;
  rootPage = Page1;

  constructor(public app: App, public menuCtrl: MenuController) {
    this.menu1Active();
  }

  openPage(p: any) {
    // Get the <ion-nav> by id
    this.nav.setRoot(p);
  }

  menu1Active() {
    this.menuCtrl.enable(true, 'menu1');
    this.menuCtrl.enable(false, 'menu2');
    this.menuCtrl.enable(false, 'menu3');
  }
  menu2Active() {
    this.menuCtrl.enable(false, 'menu1');
    this.menuCtrl.enable(true, 'menu2');
    this.menuCtrl.enable(false, 'menu3');
  }
  menu3Active() {
    this.menuCtrl.enable(false, 'menu1');
    this.menuCtrl.enable(false, 'menu2');
    this.menuCtrl.enable(true, 'menu3');
  }
}

ionicBootstrap(E2EApp);
