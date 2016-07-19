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

  constructor(private app: App, private menu: MenuController) {
    this.menu1Active();
  }

  openPage(p) {
    // Get the <ion-nav> by id
    this.nav.setRoot(p);
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

ionicBootstrap(E2EApp);
